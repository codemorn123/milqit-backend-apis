import { Controller, Route, Tags, Post, Get, Put, Delete, Body, Path, Query, Request, Security } from 'tsoa';
import { 
  addToCartSchema, 
  updateCartItemSchema, 
  applyCouponSchema, 
  setDeliveryInfoSchema,
  clearCartSchema 
} from '../../schemas/cart.schema';
import cartService from '../../services/cart/cart.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { ICart } from '../../models/CartModel';

/**
 * Request/Response Interfaces
 */
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

interface AuthRequest {
  user: { id: string };
}



/**
 * User Cart Controller - Clean, optimized and type-safe
 */
@Route('customer/cart')
@Tags('User Cart')
export class UserCartController extends Controller {
  
  /**
   * Add item to cart
   */
  @Post('/')
  @Security('jwt')
  public async addToCart(
    @Body() request: AddToCartRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const { error } = addToCartSchema.validate({ body: request });
    if (error) {
      this.setStatus(400);
      throw new Error(error.details.map(d => d.message).join(', '));
    }

    const cart = await cartService.addToCart(
      req.user.id,
      request.productId,
      request.quantity,
      request.deviceInfo,
      request.notes
    );

    return success(cart, 'Item added to cart successfully');
  }

  /**
   * Get user's cart
   */
  @Get('/')
  @Security('jwt')
  public async getCart(
    @Query() includeUnavailable: boolean = false,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<{
    totalItems: number;
    subtotal: number;
    totalAmount: number;
    items: ICart['items'];
  }>> {
    const cart = await cartService.getCart(req.user.id, includeUnavailable);

    if (!cart) {
      return success(
        { totalItems: 0, subtotal: 0, totalAmount: 0, items: [] },
        'Cart is empty'
      );
    }

    return success(cart, 'Cart fetched successfully');
  }

  /**
   * Update cart item quantity
   */
  @Put('/{productId}')
  @Security('jwt')
  public async updateCartItem(
    @Path() productId: string,
    @Body() request: UpdateCartItemRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const { error } = updateCartItemSchema.validate({ 
      params: { productId }, 
      body: request 
    });
    if (error) {
      this.setStatus(400);
      throw new Error(error.details.map(d => d.message).join(', '));
    }

    const cart = await cartService.updateCartItem(
      req.user.id,
      productId,
      request.quantity
    );

    const message = request.quantity === 0 
      ? 'Item removed from cart' 
      : 'Cart updated successfully';

    return success(cart, message);
  }

  /**
   * Remove item from cart
   */
  @Delete('/{productId}')
  @Security('jwt')
  public async removeFromCart(
    @Path() productId: string,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const cart = await cartService.removeFromCart(req.user.id, productId);
    return success(cart, 'Item removed from cart');
  }

  /**
   * Clear entire cart
   */
  @Delete('/')
  @Security('jwt')
  public async clearCart(
    @Body() request: ClearCartRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<{
    totalItems: number;
    subtotal: number;
    totalAmount: number;
    items: ICart['items'];
  }>> {
    const { error } = clearCartSchema.validate({ body: request });
    if (error) {
      this.setStatus(400);
      throw new Error(error.details.map(d => d.message).join(', '));
    }

    await cartService.clearCart(req.user.id);

    return success(
      { totalItems: 0, subtotal: 0, totalAmount: 0, items: [] },
      'Cart cleared successfully'
    );
  }

  /**
   * Apply coupon to cart
   */
  @Post('/coupon')
  @Security('jwt')
  public async applyCoupon(
    @Body() request: ApplyCouponRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const { error } = applyCouponSchema.validate({ body: request });
    if (error) {
      this.setStatus(400);
      throw new Error(error.details.map(d => d.message).join(', '));
    }

    const cart = await cartService.applyCoupon(req.user.id, request.couponCode);
    return success(cart, 'Coupon applied successfully');
  }

  /**
   * Set delivery information
   */
  @Post('/delivery')
  @Security('jwt')
  public async setDeliveryInfo(
    @Body() request: SetDeliveryInfoRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const { error } = setDeliveryInfoSchema.validate({ body: request });
    if (error) {
      this.setStatus(400);
      throw new Error(error.details.map(d => d.message).join(', '));
    }

    const cart = await cartService.setDeliveryInfo(
      req.user.id,
      request.deliveryType,
      request.deliveryAddress,
      request.scheduledDelivery,
      request.location
    );

    return success(cart, 'Delivery information set successfully');
  }

  /**
   * Get cart summary for checkout
   */
  @Get('/summary')
  @Security('jwt')
  public async getCartSummary(
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    const summary = await cartService.getCartSummary(req.user.id);
    return success(summary, 'Cart summary retrieved successfully');
  }
}