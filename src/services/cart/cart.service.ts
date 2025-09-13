import mongoose, { Types } from 'mongoose';
import { logger } from './../../config/logger';
import APIError from'./../../error/api-error';
import  {  CartModel, CartModelClass, ICart, ICartItem, IDeviceInfo } from './../../models/CartModel';
import ProductModel, { ProductDocument } from'./../../models/ProductModel';


/**
 * Cart Service for mobile grocery delivery apps
 * Fixed TypeScript types for proper Document handling
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
class CartService {
  private readonly USER_CONTEXT = 'MarotiKathoke';

  /**
   * Add item to cart or update quantity if exists
   * @param userId - User's ObjectId as string
   * @param productId - Product's ObjectId as string
   * @param quantity - Quantity to add
   * @param deviceInfo - Optional device information
   * @param notes - Optional notes
   * @returns Promise<CartDocument>
   */
  public async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    deviceInfo?: IDeviceInfo,
    notes?: string
  ): Promise<ICart> {
    try {
      console.log(`🛒 Adding product ${productId} to cart for user ${userId}`);
      
      // Validate ObjectIds
      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }
      
      if (!Types.ObjectId.isValid(productId)) {
        throw new APIError('Invalid product ID format', 400);
      }

      // Validate product
      const product = await ProductModel.findById(productId).lean() as ProductDocument | null;
      if (!product || !product.isActive) {
        throw new APIError('Product not found or inactive', 404);
      }
      
      if (!product.inStock || product.quantity < quantity) {
        throw new APIError(`Only ${product.quantity} items available in stock`, 400);
      }

      // Find or create cart
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

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      const subtotal = product.price * quantity;
      const discount = product.compareAtPrice ? 
        (product.compareAtPrice - product.price) * quantity : 0;

      const cartItem: ICartItem = {
        productId: new Types.ObjectId(productId),
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        quantity,
        unit: product.unit,
        images: product.images || [],
        brand: product.brand,
        categoryId: product.categoryId,
        sku: product.sku,
        isAvailable: true,
        maxQuantity: Math.min(product.quantity, 50),
        subtotal,
        discount,
        finalPrice: subtotal
      };

      if (existingItemIndex >= 0) {
        // Update existing item
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (newQuantity > product.quantity) {
          throw new APIError(
            `Cannot add ${quantity} more. Only ${product.quantity - cart.items[existingItemIndex].quantity} available`, 
            400
          );
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].subtotal = product.price * newQuantity;
        cart.items[existingItemIndex].discount = product.compareAtPrice ? 
          (product.compareAtPrice - product.price) * newQuantity : 0;
        cart.items[existingItemIndex].finalPrice = cart.items[existingItemIndex].subtotal;
      } else {
        // Add new item
        cart.items.push(cartItem);
      }

      if (notes) {
        cart.notes = notes;
      }

      // Update device info if provided
      if (deviceInfo) {
        cart.deviceInfo = deviceInfo;
      }

      // Calculate delivery charges and taxes
      cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
      cart.taxes = this.calculateTaxes(cart.subtotal);

      // Save cart (triggers pre-save middleware for calculations)
      const savedCart = await cart.save();
      
      logger.info({ 
        userId, 
        productId, 
        quantity, 
        cartTotal: savedCart.totalAmount 
      }, `Item added to cart by ${this.USER_CONTEXT}`);

      console.log(`✅ Product added to cart. Total items: ${savedCart.totalItems}`);
      return savedCart;

    } catch (error: any) {
      console.error('❌ Error adding to cart:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to add item to cart: ${error.message}`, 500);
    }
  }

  /**
   * Update cart item quantity
   * @param userId - User's ObjectId as string
   * @param productId - Product's ObjectId as string
   * @param quantity - New quantity (0 to remove)
   * @returns Promise<CartDocument>
   */
  public async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    try {
      console.log(`🔄 Updating cart item ${productId} quantity to ${quantity}`);

      // Validate ObjectIds
      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }
      
      if (!Types.ObjectId.isValid(productId)) {
        throw new APIError('Invalid product ID format', 400);
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
        // Remove item
        cart.items.splice(itemIndex, 1);
      } else {
        // Validate stock
        const product = await ProductModel.findById(productId).lean() as ProductDocument | null;
        if (!product || quantity > product.quantity) {
          throw new APIError(`Only ${product?.quantity || 0} items available`, 400);
        }

        // Update quantity and recalculate
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
        cart.items[itemIndex].discount = cart.items[itemIndex].compareAtPrice 
          ? (cart.items[itemIndex].compareAtPrice! - cart.items[itemIndex].price) * quantity 
          : 0;
        cart.items[itemIndex].finalPrice = cart.items[itemIndex].subtotal;
      }

      // Recalculate charges
      cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
      cart.taxes = this.calculateTaxes(cart.subtotal);

      const updatedCart = await cart.save();

      console.log(`✅ Cart updated. Total items: ${updatedCart.totalItems}`);
      return updatedCart;

    } catch (error: any) {
      console.error('❌ Error updating cart:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to update cart: ${error.message}`, 500);
    }
  }

  /**
   * Get user's active cart with populated data
   * @param userId - User's ObjectId as string
   * @param includeUnavailable - Include unavailable items
   * @returns Promise<CartDocument | null>
   */
  public async getCart(userId: string, includeUnavailable: boolean = false): Promise<ICart | null> {
    try {
      console.log(`📋 Fetching cart for user ${userId}`);

      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }

      const cart = await CartModelClass.findOne({ 
        userId: new Types.ObjectId(userId), 
        status: 'active' 
      })
      .populate('items.productId', 'isActive inStock quantity name price')
      .populate('items.categoryId', 'name slug')
      .lean() as ICart | null;

      if (!cart) {
        return null;
      }

      // Filter unavailable items if requested
      if (!includeUnavailable) {
        cart.items = cart.items.filter(item => {
          const product = item.productId as any;
          return product && product.isActive && product.inStock;
        });
      }

      // Update availability status for all items
      for (const item of cart.items) {
        const product = item.productId as any;
        item.isAvailable = !!(product && product.isActive && product.inStock);
        item.maxQuantity = product ? Math.min(product.quantity, 50) : 0;
      }

      console.log(`✅ Cart retrieved with ${cart.items.length} items`);
      return cart;

    } catch (error: any) {
      console.error('❌ Error fetching cart:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to fetch cart: ${error.message}`, 500);
    }
  }

  /**
   * Remove item from cart
   * @param userId - User's ObjectId as string
   * @param productId - Product's ObjectId as string
   * @returns Promise<CartDocument>
   */
  public async removeFromCart(userId: string, productId: string): Promise<ICart> {
    try {
      return await this.updateCartItem(userId, productId, 0);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Clear entire cart
   * @param userId - User's ObjectId as string
   * @returns Promise<void>
   */
  public async clearCart(userId: string): Promise<void> {
    try {
      console.log(`🗑️ Clearing cart for user ${userId}`);

      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }

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

      console.log(`✅ Cart cleared for user ${userId}`);

    } catch (error: any) {
      console.error('❌ Error clearing cart:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to clear cart: ${error.message}`, 500);
    }
  }

  /**
   * Apply coupon to cart
   * @param userId - User's ObjectId as string
   * @param couponCode - Coupon code to apply
   * @returns Promise<CartDocument>
   */
  public async applyCoupon(userId: string, couponCode: string): Promise<ICart> {
    try {
      console.log(`🎫 Applying coupon ${couponCode} to cart`);

      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }

      const cart = await CartModelClass.findActiveCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new APIError('Cart is empty', 400);
      }

      // Check if coupon already applied
      if (cart.appliedCoupons.includes(couponCode.toUpperCase())) {
        throw new APIError('Coupon already applied', 400);
      }

      // Validate and calculate coupon discount
      const discountAmount = this.validateAndCalculateCouponDiscount(
        couponCode.toUpperCase(), 
        cart.subtotal
      );
      
      cart.appliedCoupons.push(couponCode.toUpperCase());
      cart.discount += discountAmount;
      
      const updatedCart = await cart.save();

      console.log(`✅ Coupon applied. Discount: ₹${discountAmount}`);
      return updatedCart;

    } catch (error: any) {
      console.error('❌ Error applying coupon:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to apply coupon: ${error.message}`, 500);
    }
  }

  /**
   * Set delivery information
   * @param userId - User's ObjectId as string
   * @param deliveryType - Type of delivery
   * @param deliveryAddress - Optional delivery address ID
   * @param scheduledDelivery - Optional scheduled delivery date
   * @param location - Optional location data
   * @returns Promise<CartDocument>
   */
  public async setDeliveryInfo(
    userId: string,
    deliveryType: string,
    deliveryAddress?: string,
    scheduledDelivery?: Date,
    location?: any
  ): Promise<ICart> {
    try {
      console.log(`🚚 Setting delivery info for user ${userId}`);

      if (!Types.ObjectId.isValid(userId)) {
        throw new APIError('Invalid user ID format', 400);
      }

      const cart = await CartModelClass.findActiveCart(userId);
      if (!cart) {
        throw new APIError('Cart not found', 404);
      }

      cart.deliveryType = deliveryType as any;
      
      if (deliveryAddress && Types.ObjectId.isValid(deliveryAddress)) {
        cart.deliveryAddress = new Types.ObjectId(deliveryAddress);
      }
      
      if (scheduledDelivery) {
        cart.scheduledDelivery = scheduledDelivery;
      }
      
      if (location) {
        cart.location = location;
      }

      // Recalculate delivery charges
      cart.deliveryCharges = this.calculateDeliveryCharges(cart.subtotal, cart.deliveryType);
      cart.estimatedDelivery = this.calculateEstimatedDelivery(cart.deliveryType, scheduledDelivery);

      const updatedCart = await cart.save();

      console.log(`✅ Delivery info updated for ${deliveryType} delivery`);
      return updatedCart;

    } catch (error: any) {
      console.error('❌ Error setting delivery info:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to set delivery info: ${error.message}`, 500);
    }
  }

  /**
   * Get cart summary for checkout
   * @param userId - User's ObjectId as string
   * @returns Promise<any>
   */
  public async getCartSummary(userId: string): Promise<any> {
    try {
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

    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to get cart summary: ${error.message}`, 500);
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Calculate delivery charges based on order value and type
   */
  private calculateDeliveryCharges(subtotal: number, deliveryType: string): number {
    const charges = {
      standard: subtotal >= 500 ? 0 : 40,
      express: subtotal >= 1000 ? 20 : 60,
      scheduled: subtotal >= 500 ? 0 : 40,
      pickup: 0
    };

    return charges[deliveryType as keyof typeof charges] || 40;
  }

  /**
   * Calculate taxes (GST for India)
   */
  private calculateTaxes(subtotal: number): number {
    return Math.round(subtotal * 0.05); // 5% GST
  }

  /**
   * Calculate estimated delivery time
   */
  private calculateEstimatedDelivery(deliveryType: string, scheduledDelivery?: Date): Date {
    const now = new Date();
    
    if (scheduledDelivery) {
      return scheduledDelivery;
    }

    const deliveryTimes = {
      standard: 4 * 60 * 60 * 1000, // 4 hours
      express: 30 * 60 * 1000, // 30 minutes
      scheduled: 24 * 60 * 60 * 1000, // Next day
      pickup: 15 * 60 * 1000 // 15 minutes
    };

    const deliveryTime = deliveryTimes[deliveryType as keyof typeof deliveryTimes] || deliveryTimes.standard;
    return new Date(now.getTime() + deliveryTime);
  }

  /**
   * Validate coupon and calculate discount
   */
  private validateAndCalculateCouponDiscount(couponCode: string, subtotal: number): number {
    // Coupon validation logic
    const coupons: { [key: string]: { type: 'percentage' | 'fixed', value: number, minOrder: number } } = {
      'WELCOME10': { type: 'percentage', value: 10, minOrder: 300 },
      'SAVE50': { type: 'fixed', value: 50, minOrder: 500 },
      'FRESH20': { type: 'percentage', value: 20, minOrder: 800 },
      'MAROTI15': { type: 'percentage', value: 15, minOrder: 400 }
    };

    const coupon = coupons[couponCode];
    if (!coupon) {
      throw new APIError('Invalid coupon code', 400);
    }

    if (subtotal < coupon.minOrder) {
      throw new APIError(`Minimum order of ₹${coupon.minOrder} required for this coupon`, 400);
    }

    if (coupon.type === 'percentage') {
      return Math.round(subtotal * (coupon.value / 100));
    } else {
      return coupon.value;
    }
  }
}

// Export singleton instance
export const cartService = new CartService();
export default cartService;

console.log(`✅ CartService initialized with fixed TypeScript types by MarotiKathoke at ${new Date().toISOString()}`);