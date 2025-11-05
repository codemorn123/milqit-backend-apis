import { Types } from 'mongoose';
import { logger } from '../../config/logger';
import APIError from '../../error/api-error';
import { ProductModel } from '../../models/product.model';
import CartModelClass, { ICart, ICartItem, IDeviceInfo, ILocation } from '../../models/CartModel';
import { IProductForCart } from '../../types/product.types';

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
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError(`Invalid ${fieldName} format`, 400);
    }
  }

  /**
   * Get and validate product with proper typing
   */
  private async getValidatedProduct(productId: string, quantity: number): Promise<IProductForCart> {
    const product = await ProductModel.findById(productId).lean();
    
    if (!product) {
      throw new APIError('Product not found', 404);
    }

    if (!product.isActive) {
      throw new APIError('Product is not active', 404);
    }
    
    if (!product.inStock || product.quantity < quantity) {
      throw new APIError(`Only ${product.quantity} items available in stock`, 400);
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
  private recalculateCartCharges(cart: any): void {
    cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
    cart.taxes = this.calculateTaxes(cart.subtotal);
  }

  /**
   * Add item to cart
   */
  public async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    deviceInfo?: IDeviceInfo,
    notes?: string
  ): Promise<ICart> {
    this.validateObjectId(userId, 'user ID');
    this.validateObjectId(productId, 'product ID');

    const product = await this.getValidatedProduct(productId, quantity);
    let cart = await CartModelClass.findActiveCart(userId);

    if (!cart) {
      cart = new CartModelClass({
        userId: new Types.ObjectId(userId),
        items: [],
        deviceInfo,
        status: 'active',
        isActive: true
      });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.quantity) {
        throw new APIError(
          `Cannot add ${quantity} more. Only ${product.quantity - existingItem.quantity} available`,
          400
        );
      }

      this.updateCartItemQuantity(existingItem, newQuantity);
    } else {
      cart.items.push(this.createCartItem(product, quantity));
    }

    if (notes) cart.notes = notes;
    if (deviceInfo) cart.deviceInfo = deviceInfo;

    this.recalculateCartCharges(cart);

    const savedCart = await cart.save();
    
    logger.info(
      { userId, productId, quantity, cartTotal: savedCart.totalAmount }, 
      'Item added to cart by MarotiKathoke'
    );

    return savedCart;
  }

  /**
   * Update cart item quantity
   */
  public async updateCartItem(
    userId: string, 
    productId: string, 
    quantity: number
  ): Promise<ICart> {
    this.validateObjectId(userId, 'user ID');
    this.validateObjectId(productId, 'product ID');

    const cart = await CartModelClass.findActiveCart(userId);
    if (!cart) throw new APIError('Cart not found', 404);

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      throw new APIError('Item not found in cart', 404);
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await this.getValidatedProduct(productId, quantity);
      this.updateCartItemQuantity(cart.items[itemIndex], quantity);
    }

    this.recalculateCartCharges(cart);
    return await cart.save();
  }

  /**
   * Get user's cart
   */
  public async getCart(
    userId: string, 
    includeUnavailable: boolean = false
  ): Promise<ICart | null> {
    this.validateObjectId(userId, 'user ID');

    const cart = await CartModelClass.findOne({ 
      userId: new Types.ObjectId(userId), 
      status: 'active' 
    })
    .populate('items.productId', 'isActive inStock quantity name sellingPrice mrp')
    .populate('items.categoryId', 'name slug')
    .lean() as ICart | null;

    if (!cart) return null;

    if (!includeUnavailable) {
      cart.items = cart.items.filter(item => {
        const product = item.productId as any;
        return product?.isActive && product?.inStock;
      });
    }

    cart.items.forEach(item => {
      const product = item.productId as any;
      item.isAvailable = !!(product?.isActive && product?.inStock);
      item.maxQuantity = product 
        ? Math.min(product.quantity, this.MAX_QUANTITY_PER_ITEM) 
        : 0;
    });

    return cart;
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
    this.validateObjectId(userId, 'user ID');

    await CartModelClass.updateOne(
      { userId: new Types.ObjectId(userId), status: 'active' },
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
          updatedAt: new Date()
        }
      }
    );

    logger.info({ userId }, 'Cart cleared by MarotiKathoke');
  }

  /**
   * Apply coupon to cart
   */
  public async applyCoupon(userId: string, couponCode: string): Promise<ICart> {
    this.validateObjectId(userId, 'user ID');

    const cart = await CartModelClass.findActiveCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new APIError('Cart is empty', 400);
    }

    const upperCoupon = couponCode.toUpperCase();
    if (cart.appliedCoupons.includes(upperCoupon)) {
      throw new APIError('Coupon already applied', 400);
    }

    const discountAmount = this.validateAndCalculateCouponDiscount(
      upperCoupon, 
      cart.subtotal
    );
    
    cart.appliedCoupons.push(upperCoupon);
    cart.discount += discountAmount;

    logger.info({ userId, couponCode, discount: discountAmount }, 'Coupon applied by MarotiKathoke');

    return await cart.save();
  }

  /**
   * Set delivery information
   */
  public async setDeliveryInfo(
    userId: string,
    deliveryType: string,
    deliveryAddress?: string,
    scheduledDelivery?: Date,
    location?: ILocation
  ): Promise<ICart> {
    this.validateObjectId(userId, 'user ID');

    const cart = await CartModelClass.findActiveCart(userId);
    if (!cart) throw new APIError('Cart not found', 404);

    cart.deliveryType = deliveryType as any;
    
    if (deliveryAddress && Types.ObjectId.isValid(deliveryAddress)) {
      cart.deliveryAddress = new Types.ObjectId(deliveryAddress);
    }
    
    if (scheduledDelivery) cart.scheduledDelivery = scheduledDelivery;
    if (location) cart.location = location;

    cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
    cart.estimatedDelivery = this.calculateEstimatedDelivery(
      cart.deliveryType, 
      scheduledDelivery
    );

    logger.info({ userId, deliveryType }, 'Delivery info set by MarotiKathoke');

    return await cart.save();
  }

  /**
   * Get cart summary for checkout
   */
  public async getCartSummary(userId: string): Promise<any> {
    const cart = await this.getCart(userId, false);
    
    if (!cart || cart.items.length === 0) {
      throw new APIError('Cart is empty', 400);
    }

    return {
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      discount: cart.discount,
      deliveryCharges: cart.deliveryCharges,
      taxes: cart.taxes,
      totalAmount: cart.totalAmount,
      savings: cart.savings,
      estimatedDelivery: cart.estimatedDelivery,
      appliedCoupons: cart.appliedCoupons,
      deliveryType: cart.deliveryType
    };
  }
}

export const cartService = new CartService();
export default cartService;