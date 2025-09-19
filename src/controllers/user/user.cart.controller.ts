import { Controller, Route, Tags, Post, Get, Put, Delete, Body, Path, Query, Request, Security } from 'tsoa';


import { 
  addToCartSchema, 
  updateCartItemSchema, 
  applyCouponSchema, 
  setDeliveryInfoSchema,
  clearCartSchema 
} from './../../schemas/cart.schema';
import cartService from './../../services/cart/cart.service';
import { success } from './../../utils/SuccessResponse';

interface AddToCartRequest {
  productId: string;
  quantity: number;
  notes?: string;
  deviceInfo?: {
    platform: 'ios' | 'android';
    version: string;
    deviceId: string;
  };
}

interface UpdateCartItemRequest {
  quantity: number;
  notes?: string;
}

interface ApplyCouponRequest {
  couponCode: string;
}

interface SetDeliveryInfoRequest {
  deliveryType: 'standard' | 'express' | 'scheduled' | 'pickup';
  deliveryAddress?: string;
  scheduledDelivery?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface ClearCartRequest {
  confirmClear: boolean;
}

/**
 * User Cart Controller - Mobile optimized for grocery delivery
 * Handles all cart operations for React Native apps
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
@Route('user/cart')
@Tags('User Cart')
export class UserCartController extends Controller {
  
  /**
   * Add item to cart
   * @summary Add product to user's cart
   * @param request Add to cart request body
   * @param req Express request object
   */
  @Post('/')
  @Security('jwt')
  public async addToCart(
    @Body() request: AddToCartRequest,
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🛒 User ${req.user?.id} adding item to cart:`, request.productId);

      // Validate request
      const { error } = addToCartSchema.validate({ body: request });
      if (error) {
        this.setStatus(400);
        return {
          success: false,
          message: 'Validation failed',
          errors: error.details.map(d => d.message)
        };
      }

      const cart = await cartService.addToCart(
        req.user!.id,
        request.productId,
        request.quantity,
        request.deviceInfo,
        request.notes
      );

     return success(cart, 'Item added to cart successfully');

    } catch (error: any) {
      console.error('❌ Error in addToCart:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to add item to cart',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Get user's cart
   * @summary Retrieve user's active cart
   * @param includeUnavailable Include unavailable items
   * @param req Express request object
   */
  @Get('/')
  @Security('jwt')
  public async getCart(
    @Query() includeUnavailable: boolean = false,
    // @Request() req: ExpressRequest
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`📋 User ${req.user?.id} fetching cart`);

      const cart = await cartService.getCart(req.user!.id, includeUnavailable);

      if (!cart) {
        return {
          success: true,
          message: 'Cart is empty',
          data: {
            cart: {
              totalItems: 0,
              subtotal: 0,
              totalAmount: 0,
              items: [],
              estimatedDelivery: null
            }
          },
          timestamp: new Date().toISOString(),
          user: 'MarotiKathoke'
        };
      }
return success(cart, 'Cart fetched successfully');

    } catch (error: any) {
      console.error('❌ Error in getCart:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to fetch cart',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Update cart item quantity
   * @summary Update quantity of specific item in cart
   * @param productId Product ID to update
   * @param request Update cart item request body
   * @param req Express request object
   */
  @Put('/{productId}')
  @Security('jwt')
  public async updateCartItem(
    @Path() productId: string,
    @Body() request: UpdateCartItemRequest,
    // @Request() req: ExpressRequest
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🔄 User ${req.user?.id} updating cart item:`, productId);

      const { error } = updateCartItemSchema.validate({ 
        params: { productId }, 
        body: request 
      });
      if (error) {
        this.setStatus(400);
        return {
          success: false,
          message: 'Validation failed',
          errors: error.details.map(d => d.message)
        };
      }
      const cart = await cartService.updateCartItem(
        req.user!.id,
        productId,
        request.quantity
      );

      return success(cart, request.quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',);

    } catch (error: any) {
      console.error('❌ Error in updateCartItem:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to update cart item',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Remove item from cart
   * @summary Remove specific item from cart
   * @param productId Product ID to remove
   * @param req Express request object
   */
  @Delete('/{productId}')
  @Security('jwt')
  public async removeFromCart(
    @Path() productId: string,
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🗑️ User ${req.user?.id} removing item from cart:`, productId);
      const cart = await cartService.removeFromCart(req.user!.id, productId);
      return success(cart, 'Item removed from cart');
    
    } catch (error: any) {
      console.error('❌ Error in removeFromCart:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to remove item from cart',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Clear entire cart
   * @summary Clear all items from cart
   * @param request Clear cart confirmation
   * @param req Express request object
   */
  @Delete('/')
  @Security('jwt')
  public async clearCart(
    @Body() request: ClearCartRequest,
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🗑️ User ${req.user?.id} clearing cart`);

      // Validate request
      const { error } = clearCartSchema.validate({ body: request });
      if (error) {
        this.setStatus(400);
        return {
          success: false,
          message: 'Validation failed',
          errors: error.details.map(d => d.message)
        };
      }

      await cartService.clearCart(req.user!.id);

      return {
        success: true,
        message: 'Cart cleared successfully',
        data: {
          cart: {
            totalItems: 0,
            subtotal: 0,
            totalAmount: 0,
            items: []
          }
        },
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };

    } catch (error: any) {
      console.error('❌ Error in clearCart:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to clear cart',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Apply coupon to cart
   * @summary Apply discount coupon to cart
   * @param request Apply coupon request body
   * @param req Express request object
   */
  @Post('/coupon')
  @Security('jwt')
  public async applyCoupon(
    @Body() request: ApplyCouponRequest,
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🎫 User ${req.user?.id} applying coupon:`, request.couponCode);

      // Validate request
      const { error } = applyCouponSchema.validate({ body: request });
      if (error) {
        this.setStatus(400);
        return {
          success: false,
          message: 'Validation failed',
          errors: error.details.map(d => d.message)
        };
      }

      const cart = await cartService.applyCoupon(req.user!.id, request.couponCode);
      return success(cart, 'Coupon applied successfully');

    } catch (error: any) {
      console.error('❌ Error in applyCoupon:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to apply coupon',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Set delivery information
   * @summary Set delivery type and address for cart
   * @param request Set delivery info request body
   * @param req Express request object
   */
  @Post('/delivery')
  @Security('jwt')
  public async setDeliveryInfo(
    @Body() request: SetDeliveryInfoRequest,
    @Request() req: { user: { id: string } }
  ) {
    try {
      console.log(`🚚 User ${req.user?.id} setting delivery info:`, request.deliveryType);
      // Validate request
      const { error } = setDeliveryInfoSchema.validate({ body: request });
      if (error) {
        this.setStatus(400);
        return {
          success: false,
          message: 'Validation failed',
          errors: error.details.map(d => d.message)
        };
      }

      const cart = await cartService.setDeliveryInfo(
        req.user!.id,
        request.deliveryType,
        request.deliveryAddress,
        request.scheduledDelivery,
        request.location
      );
      return success(cart, 'Delivery information set successfully');
    } catch (error: any) {
      console.error('❌ Error in setDeliveryInfo:', error);
      this.setStatus(error.statusCode || 500);
      return {
        success: false,
        message: error.message || 'Failed to set delivery information',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }

  /**
   * Get cart summary for checkout
   * @summary Get cart summary with totals for checkout
   * @param req Express request object
   */
  @Get('/summary')
  @Security('jwt')
  public async getCartSummary( @Request() req: { user: { id: string } }) {
    try {
      console.log(`📊 User ${req.user?.id} fetching cart summary`);
      const summary = await cartService.getCartSummary(req.user!.id);
      return success(summary, 'Cart summary retrieved successfully');
   

    } catch (error: any) {
      console.error('❌ Error in getCartSummary:', error);
      this.setStatus(error.statusCode || 500);

      return {
        success: false,
        message: error.message || 'Failed to get cart summary',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };
    }
  }
}