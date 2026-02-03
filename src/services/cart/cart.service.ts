import { Types } from 'mongoose';
import { logger } from '../../config/logger';
import APIError from '../../error/api-error';
import { ProductModel } from '../../models/product.model';
import CartModelClass, { ICart, ICartItem, ICartDocument } from '../../models/CartModel';
import { IProductForCart } from '../../types/product.types';
import { PaginatedResponse, Location } from '../../types/common.types';
import { ICartSummary, ICartFilterOptions } from '../../types/cart.types';
import { QueryBuilder } from '../../utils/query-builder';

/**
 * Coupon Configuration Interface
 */
interface ICouponConfig {
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
}


interface IDeliveryChargeConfig {
  free: number;
  charge: number;
}


class CartService {
  private readonly DELIVERY_CHARGES: Record<string, IDeliveryChargeConfig> = {
    standard: { free: 500, charge: 40 },
    express: { free: 1000, charge: 60 },
    scheduled: { free: 500, charge: 40 },
    pickup: { free: 0, charge: 0 }
  };

  private readonly COUPONS: Record<string, ICouponConfig> = {
    WELCOME10: { type: 'percentage', value: 10, minOrder: 300 },
    SAVE50: { type: 'fixed', value: 50, minOrder: 500 },
    FRESH20: { type: 'percentage', value: 20, minOrder: 800 },
    MAROTI15: { type: 'percentage', value: 15, minOrder: 400 }
  };

  private readonly TAX_RATE = 0.05; // 5% GST
  private readonly MAX_QUANTITY_PER_ITEM = 50;

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(id: string, fieldName: string): void {
    if (!id || typeof id !== 'string') {
      throw new APIError(`${fieldName} is required`, 400);
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError(`Invalid ${fieldName} format`, 400);
    }
  }

  /**
   * Validate quantity
   */
  private validateQuantity(quantity: number): void {
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      throw new APIError('Quantity must be a positive integer', 400);
    }
    if (quantity > this.MAX_QUANTITY_PER_ITEM) {
      throw new APIError(`Maximum quantity allowed is ${this.MAX_QUANTITY_PER_ITEM}`, 400);
    }
  }

  /**
   * Get and validate product with proper typing
   */
  private async getValidatedProduct(productId: string, quantity: number): Promise<IProductForCart> {
    const product = await ProductModel.findById(productId)
      .select('name slug description mrp sellingPrice category sku images quantity isActive isFeatured inStock brand unit productType productDetails averageRating reviewCount')
      .lean();

    if (!product) {
      throw new APIError('Product not found', 404);
    }

    if (!product.isActive) {
      throw new APIError('Product is currently unavailable', 400);
    }

    if (!product.inStock) {
      throw new APIError('Product is out of stock', 400);
    }

    if (product.quantity < quantity) {
      throw new APIError(`Only ${product.quantity} item(s) available in stock`, 400);
    }

    // Map ProductDocument to IProductForCart
    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      category: product.category,
      sku: product.sku || '',
      images: product.images,
      quantity: product.quantity,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      inStock: product.inStock,
      brand: product.brand,
      unit: product.unit,
      productType: product.productType,
      productDetails: product.productDetails,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      discountPercentage: this.calculateDiscountPercentage(product.mrp, product.sellingPrice),
      savings: product.mrp - product.sellingPrice,
      hasDiscount: product.sellingPrice < product.mrp
    };
  }

  /**
   * Calculate discount percentage
   */
  private calculateDiscountPercentage(mrp: number, sellingPrice: number): number {
    if (mrp <= 0) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  /**
   * Create cart item from product
   */
  private createCartItem(product: IProductForCart, quantity: number): ICartItem {
    const subtotal = product.sellingPrice * quantity;
    const discount = (product.mrp - product.sellingPrice) * quantity;

    return {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.sellingPrice,
      compareAtPrice: product.mrp,
      quantity,
      unit: product.unit,
      images: product.images || [],
      brand: product.brand,
      categoryId: product.category,
      sku: product.sku,
      isAvailable: true,
      maxQuantity: Math.min(product.quantity, this.MAX_QUANTITY_PER_ITEM),
      subtotal,
      discount,
      finalPrice: subtotal
    };
  }

  /**
   * Update existing cart item
   */
  private updateCartItemQuantity(item: ICartItem, newQuantity: number): void {
    item.quantity = newQuantity;
    item.subtotal = item.price * newQuantity;
    item.discount = item.compareAtPrice
      ? (item.compareAtPrice - item.price) * newQuantity
      : 0;
    item.finalPrice = item.subtotal;
  }

  /**
   * Calculate delivery charges based on subtotal and delivery type
   */
  private calculateDeliveryCharges(subtotal: number, deliveryType: string): number {
    const config = this.DELIVERY_CHARGES[deliveryType];
    if (!config) return this.DELIVERY_CHARGES.standard.charge;
    return subtotal >= config.free ? 0 : config.charge;
  }

  /**
   * Calculate taxes (GST)
   */
  private calculateTaxes(subtotal: number): number {
    return Math.round(subtotal * this.TAX_RATE);
  }

  /**
   * Calculate estimated delivery time
   */
  private calculateEstimatedDelivery(deliveryType: string, scheduledDelivery?: Date): Date {
    if (scheduledDelivery) return scheduledDelivery;

    const now = Date.now();
    const deliveryTimes: Record<string, number> = {
      standard: 4 * 60 * 60 * 1000,   // 4 hours
      express: 30 * 60 * 1000,         // 30 minutes
      scheduled: 24 * 60 * 60 * 1000,  // 24 hours
      pickup: 15 * 60 * 1000           // 15 minutes
    };

    const time = deliveryTimes[deliveryType] || deliveryTimes.standard;
    return new Date(now + time);
  }

  /**
   * Validate and calculate coupon discount
   */
  private validateAndCalculateCouponDiscount(couponCode: string, subtotal: number): number {
    const coupon = this.COUPONS[couponCode];

    if (!coupon) {
      throw new APIError('Invalid coupon code', 400);
    }

    if (subtotal < coupon.minOrder) {
      throw new APIError(
        `Minimum order of ₹${coupon.minOrder} required for this coupon`,
        400
      );
    }

    return coupon.type === 'percentage'
      ? Math.round(subtotal * (coupon.value / 100))
      : coupon.value;
  }

  /**
   * Recalculate cart charges
   */
  private recalculateCartCharges(cart: ICartDocument): void {
    cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
    const taxableAmount = Math.max(0, cart.subtotal - cart.discount);
    cart.taxes = this.calculateTaxes(taxableAmount);
    cart.savings = cart.items.reduce((sum, item) => sum + item.discount, 0) + cart.discount;
  }

  /**
   * Add item to cart
   */
  public async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    notes?: string
  ): Promise<ICart> {
    try {
      this.validateObjectId(userId, 'user ID');
      this.validateObjectId(productId, 'product ID');
      this.validateQuantity(quantity);

      const product = await this.getValidatedProduct(productId, quantity);
      let cart = await CartModelClass.findActiveCart(userId);

      if (!cart) {
        cart = new CartModelClass({
          userId: new Types.ObjectId(userId),
          items: [],
          status: 'active',
          isActive: true,
          deliveryType: 'standard'
        });
      }

      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex >= 0) {
        const existingItem = cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.quantity) {
          const available = product.quantity - existingItem.quantity;
          throw new APIError(
            `Cannot add ${quantity} more. Only ${available} item(s) available`,
            400
          );
        }

        if (newQuantity > this.MAX_QUANTITY_PER_ITEM) {
          throw new APIError(
            `Maximum ${this.MAX_QUANTITY_PER_ITEM} items allowed per product`,
            400
          );
        }

        this.updateCartItemQuantity(existingItem, newQuantity);
      } else {
        cart.items.push(this.createCartItem(product, quantity));
      }

      if (notes) cart.notes = notes;

      this.recalculateCartCharges(cart);

      const savedCart = await cart.save();

      logger.info(
        { userId, productId, quantity, cartTotal: savedCart.totalAmount },
        'Item added to cart successfully'
      );

      return savedCart as unknown as ICart;
    } catch (error) {
      logger.error({ userId, productId, quantity, error }, 'Error adding item to cart');
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  public async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    try {
      this.validateObjectId(userId, 'user ID');
      this.validateObjectId(productId, 'product ID');

      if (quantity < 0) {
        throw new APIError('Quantity cannot be negative', 400);
      }

      const cart = await CartModelClass.findActiveCart(userId);
      if (!cart) {
        throw new APIError('Cart not found', 404);
      }

      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        throw new APIError('Item not found in cart', 404);
      }

      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
        logger.info({ userId, productId }, 'Item removed from cart');
      } else {
        this.validateQuantity(quantity);
        await this.getValidatedProduct(productId, quantity); // Validate availablity
        this.updateCartItemQuantity(cart.items[itemIndex], quantity);
        logger.info({ userId, productId, quantity }, 'Cart item updated');
      }

      this.recalculateCartCharges(cart);
      const savedCart = await cart.save();
      return savedCart as unknown as ICart;
    } catch (error) {
      logger.error({ userId, productId, quantity, error }, 'Error updating cart item');
      throw error;
    }
  }

  /**
   * Get user's cart
   */
  public async getCart(
    userId: string,
    includeUnavailable: boolean = false
  ): Promise<ICart | null> {
    try {
      this.validateObjectId(userId, 'user ID');

      const cart = await CartModelClass.findOne({
        userId: new Types.ObjectId(userId),
        status: 'active',
        isActive: true
      })
        .populate('items.productId', 'isActive inStock quantity name sellingPrice mrp images')
        .populate('items.categoryId', 'name slug')
        .lean<ICart>();

      if (!cart) return null;

      // Check if cart is expired
      if (cart.expiresAt < new Date()) {
        await CartModelClass.updateOne(
          { userId: new Types.ObjectId(userId), status: 'active' },
          { $set: { status: 'expired', isActive: false, updatedAt: new Date() } }
        );
        return null;
      }

      let hasUnavailableItems = false;
      const validItems = cart.items.filter(item => {
        const product = item.productId as any;
        const isAvailable = !!(product?.isActive && product?.inStock);

        if (!isAvailable) hasUnavailableItems = true;

        item.isAvailable = isAvailable;
        item.maxQuantity = product ? Math.min(product.quantity, this.MAX_QUANTITY_PER_ITEM) : 0;

        // Update price if changed
        if (product && item.price !== product.sellingPrice) {
          item.price = product.sellingPrice;
          item.subtotal = product.sellingPrice * item.quantity;
          item.finalPrice = item.subtotal;
        }

        return includeUnavailable || isAvailable;
      });

      cart.items = validItems;

      if (hasUnavailableItems) {
        logger.warn({ userId }, 'Cart contains unavailable items');
      }

      return cart;
    } catch (error) {
      logger.error({ userId, error }, 'Error fetching cart');
      throw error instanceof APIError ? error : new APIError('Failed to fetch cart', 500);
    }
  }

  /**
   * Remove item from cart
   */
  public async removeFromCart(userId: string, productId: string): Promise<ICart> {
    return await this.updateCartItem(userId, productId, 0);
  }

  /**
   * Clear entire cart
   */
  public async clearCart(userId: string): Promise<void> {
    try {
      this.validateObjectId(userId, 'user ID');

      const result = await CartModelClass.updateOne(
        { userId: new Types.ObjectId(userId), status: 'active', isActive: true },
        {
          $set: {
            items: [],
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            deliveryCharges: 0,
            taxes: 0,
            totalAmount: 0,
            savings: 0,
            appliedCoupons: [],
            notes: '',
            updatedAt: new Date(),
            lastActivityAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new APIError('Cart not found', 404);
      }

      logger.info({ userId }, 'Cart cleared successfully');
    } catch (error) {
      logger.error({ userId, error }, 'Error clearing cart');
      throw error;
    }
  }

  /**
   * Apply coupon to cart
   */
  public async applyCoupon(userId: string, couponCode: string): Promise<ICart> {
    try {
      this.validateObjectId(userId, 'user ID');

      if (!couponCode || !couponCode.trim()) {
        throw new APIError('Coupon code is required', 400);
      }

      const cart = await CartModelClass.findActiveCart(userId);
      if (!cart) {
        throw new APIError('Cart not found', 404);
      }

      if (!cart.items || cart.items.length === 0) {
        throw new APIError('Cannot apply coupon to empty cart', 400);
      }

      const upperCoupon = couponCode.trim().toUpperCase();

      if (cart.appliedCoupons.includes(upperCoupon)) {
        throw new APIError('Coupon already applied to this cart', 400);
      }

      const discountAmount = this.validateAndCalculateCouponDiscount(
        upperCoupon,
        cart.subtotal
      );

      cart.appliedCoupons.push(upperCoupon);
      cart.discount += discountAmount;

      this.recalculateCartCharges(cart);

      const savedCart = await cart.save();

      logger.info(
        { userId, couponCode: upperCoupon, discount: discountAmount },
        'Coupon applied successfully'
      );

      return savedCart as unknown as ICart;
    } catch (error) {
      logger.error({ userId, couponCode, error }, 'Error applying coupon');
      throw error;
    }
  }

  /**
   * Set delivery information
   */
  public async setDeliveryInfo(
    userId: string,
    deliveryType: string,
    deliveryAddress?: string,
    scheduledDelivery?: Date,
    location?: Location
  ): Promise<ICart> {
    try {
      this.validateObjectId(userId, 'user ID');

      const validTypes = ['standard', 'express', 'scheduled', 'pickup'];
      if (!validTypes.includes(deliveryType)) {
        throw new APIError(
          `Invalid delivery type. Must be one of: ${validTypes.join(', ')}`,
          400
        );
      }

      const cart = await CartModelClass.findActiveCart(userId);
      if (!cart) {
        throw new APIError('Cart not found', 404);
      }

      if (!cart.items || cart.items.length === 0) {
        throw new APIError('Cannot set delivery info for empty cart', 400);
      }

      if (deliveryType !== 'pickup') {
        if (!deliveryAddress) {
          throw new APIError('Delivery address is required', 400);
        }
        this.validateObjectId(deliveryAddress, 'delivery address');
        cart.deliveryAddress = new Types.ObjectId(deliveryAddress);
      }

      if (deliveryType === 'scheduled') {
        if (!scheduledDelivery) {
          throw new APIError('Scheduled delivery time is required', 400);
        }
        if (new Date(scheduledDelivery) <= new Date()) {
          throw new APIError('Scheduled delivery must be in the future', 400);
        }
        cart.scheduledDelivery = scheduledDelivery;
      }

      cart.deliveryType = deliveryType as any;
      if (location) cart.location = location;

      cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
      cart.estimatedDelivery = this.calculateEstimatedDelivery(
        cart.deliveryType,
        scheduledDelivery
      );

      this.recalculateCartCharges(cart);

      const savedCart = await cart.save();

      logger.info(
        { userId, deliveryType, deliveryAddress },
        'Delivery info set successfully'
      );

      return savedCart as unknown as ICart;
    } catch (error) {
      logger.error({ userId, deliveryType, error }, 'Error setting delivery info');
      throw error;
    }
  }

  /**
   * Get cart summary for checkout
   */
  public async getCartSummary(userId: string): Promise<ICartSummary> {
    try {
      this.validateObjectId(userId, 'user ID');

      const cart = await this.getCart(userId, false);

      if (!cart) {
        throw new APIError('Cart not found or empty', 404);
      }

      if (!cart.items || cart.items.length === 0) {
        throw new APIError('Cannot checkout with empty cart', 400);
      }

      const unavailableItems = cart.items.filter(item => !item.isAvailable);
      if (unavailableItems.length > 0) {
        const itemNames = unavailableItems.map(i => i.name).join(', ');
        throw new APIError(
          `${unavailableItems.length} item(s) unavailable: ${itemNames}`,
          400
        );
      }

      if (cart.deliveryType !== 'pickup' && !cart.deliveryAddress) {
        throw new APIError('Delivery address is required for home delivery', 400);
      }

      return {
        _id: (cart as any)._id?.toString() || (cart as any).id || '',
        totalItems: cart.totalItems,
        itemCount: cart.items.length,
        subtotal: cart.subtotal,
        discount: cart.discount,
        deliveryCharges: cart.deliveryCharges,
        taxes: cart.taxes,
        totalAmount: cart.totalAmount,
        savings: cart.savings,
        estimatedDelivery: cart.estimatedDelivery,
        appliedCoupons: cart.appliedCoupons,
        deliveryType: cart.deliveryType,
        deliveryAddress: cart.deliveryAddress,
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      };
    } catch (error) {
      logger.error({ userId, error }, 'Error getting cart summary');
      throw error instanceof APIError ? error : new APIError('Failed to get cart summary', 500);
    }
  }

  /**
   * Get all carts (Admin)
   */
  public async getAllCarts(filters: ICartFilterOptions): Promise<PaginatedResponse<ICart>> {
    const builder = new QueryBuilder(CartModelClass, filters);

    // Basic filters
    builder.filter([], ['userId', 'status', 'startDate', 'endDate']);

    if (filters.userId) builder.addFilter({ userId: filters.userId });
    if (filters.status) builder.addFilter({ status: filters.status });

    if (filters.dateFrom || filters.dateTo) {
      const dateFilter: any = {};
      if (filters.dateFrom) dateFilter.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) dateFilter.$lte = new Date(filters.dateTo);
      builder.addFilter({ createdAt: dateFilter });
    }

    return builder.exec([
      { path: 'userId', select: 'name phone email' },
      { path: 'items.productId', select: 'name slug price images sku' },
      { path: 'deliveryAddress', select: 'address city state pincode' }
    ]);
  }
}

export default new CartService();