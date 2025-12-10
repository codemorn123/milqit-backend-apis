import { Controller, Route, Tags, Post, Get, Put, Delete, Body, Path, Query, Request, Security, Response, SuccessResponse as TsoaSuccessResponse } from 'tsoa';
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  setDeliveryInfoSchema,
  clearCartSchema
} from '../../schemas/cart.schema';
import cartService from '../../services/cart/cart.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { ICart, ILocation } from '../../models/CartModel';
import APIError from '../../error/api-error';
import { logger } from '../../config/logger';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

/**
 * Request/Response Interfaces
 */
interface AddToCartRequest {
  productId: string;
  quantity: number;
  notes?: string;
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
  location?: ILocation;
}

interface ClearCartRequest {
  confirmClear: boolean;
}

interface AuthRequest {
  user: { userId: string };
}



/**
 * User Cart Controller - Clean, optimized and type-safe
 * @author MarotiKathoke
 * @created 2025-12-05
 */
@Route('customer/cart')
@Tags('User Cart')
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class UserCartController extends Controller {

  /**
   * Validate user authentication
   */
  private validateUser(req: AuthRequest): string {
    if (!req.user?.userId) {
      throw new APIError('Unauthorized - User not authenticated', 401);
    }
    return req.user.userId;
  }

  /**
   * Validate request body with Joi schema
   */
  private validateRequest<T>(schema: Joi.ObjectSchema, data: T, context: string): T {
    const { error, value } = schema.validate(data);
    if (error) {
      throw new APIError(
        error.details.map(d => d.message).join(', '),
        400
      );
    }
    return value;
  }

  /**
   * Handle controller errors consistently
   */
  private handleError(error: any, context: string, userId?: string): never {
    logger.error({ userId, context, error: error.message }, `Error in ${context}`);

    if (error instanceof APIError) {
      this.setStatus(error.getStatusCode());
      throw error;
    }

    this.setStatus(500);
    throw new APIError(`Internal server error in ${context}`, 500);
  }

  /**
   * Add item to cart
   */
  @Post('/')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async addToCart(
    @Body() request: AddToCartRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);
      this.validateRequest(addToCartSchema, { body: request }, 'addToCart');

      const cart = await cartService.addToCart(
        userId,
        request.productId,
        request.quantity,
        request.notes
      );

      this.setStatus(200);
      return success(cart, 'Item added to cart successfully');
    } catch (error) {
      return this.handleError(error, 'addToCart', req.user?.userId);
    }
  }

  /**
   * Get user's cart
   */
  @Get('/')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async getCart(
    @Query() includeUnavailable: boolean = false,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);
      const cart = await cartService.getCart(userId, includeUnavailable);

      if (!cart) {
        this.setStatus(200);
        return success(
          { totalItems: 0, subtotal: 0, totalAmount: 0, items: [] },
          'Cart is empty'
        );
      }

      this.setStatus(200);
      return success(cart, 'Cart fetched successfully');
    } catch (error) {
      return this.handleError(error, 'getCart', req.user?.userId);
    }
  }

  /**
   * Update cart item quantity
   */
  @Put('/{productId}')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.NOT_FOUND, "Product Not Found")
  public async updateCartItem(
    @Path() productId: string,
    @Body() request: UpdateCartItemRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);
      this.validateRequest(
        updateCartItemSchema,
        { params: { productId }, body: request },
        'updateCartItem'
      );

      const cart = await cartService.updateCartItem(userId, productId, request.quantity);
      const message = request.quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully';

      this.setStatus(200);
      return success(cart, message);
    } catch (error) {
      return this.handleError(error, 'updateCartItem', req.user?.userId);
    }
  }

  /**
   * Remove item from cart
   */
  @Delete('/{productId}')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.NOT_FOUND, "Product Not Found")
  public async removeFromCart(
    @Path() productId: string,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      if (!productId?.trim()) {
        throw new APIError('Product ID is required', 400);
      }

      const cart = await cartService.removeFromCart(userId, productId);

      this.setStatus(200);
      return success(cart, 'Item removed from cart successfully');
    } catch (error) {
      return this.handleError(error, 'removeFromCart', req.user?.userId);
    }
  }

  /**
   * Clear entire cart
   */
  @Delete('/')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async clearCart(
    @Body() request: ClearCartRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);
      this.validateRequest(clearCartSchema, { body: request }, 'clearCart');

      await cartService.clearCart(userId);

      this.setStatus(200);
      return success(
        { totalItems: 0, subtotal: 0, totalAmount: 0, items: [] },
        'Cart cleared successfully'
      );
    } catch (error) {
      return this.handleError(error, 'clearCart', req.user?.userId);
    }
  }

  /**
   * Apply coupon to cart
   */
  @Post('/coupon')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.NOT_FOUND, "Coupon Not Found")
  public async applyCoupon(
    @Body() request: ApplyCouponRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);
      this.validateRequest(applyCouponSchema, { body: request }, 'applyCoupon');

      const cart = await cartService.applyCoupon(userId, request.couponCode);

      this.setStatus(200);
      return success(cart, 'Coupon applied successfully');
    } catch (error) {
      return this.handleError(error, 'applyCoupon', req.user?.userId);
    }
  }

  /**
   * Set delivery information
   */
  @Post('/delivery')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async setDeliveryInfo(
    @Body() request: SetDeliveryInfoRequest,
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);
      this.validateRequest(setDeliveryInfoSchema, { body: request }, 'setDeliveryInfo');

      const cart = await cartService.setDeliveryInfo(
        userId,
        request.deliveryType,
        request.deliveryAddress,
        request.scheduledDelivery,
        request.location
      );

      this.setStatus(200);
      return success(cart, 'Delivery information set successfully');
    } catch (error) {
      return this.handleError(error, 'setDeliveryInfo', req.user?.userId);
    }
  }

  /**
   * Get cart summary for checkout
   */
  @Get('/summary')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async getCartSummary(
    @Request() req: AuthRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);
      const summary = await cartService.getCartSummary(userId);

      this.setStatus(200);
      return success(summary, 'Cart summary retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'getCartSummary', req.user?.userId);
    }
  }
}