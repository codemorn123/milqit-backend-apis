import { Route, Tags, Post, Get, Put, Delete, Body, Path, Query, Request, Security, Response, SuccessResponse as TsoaSuccessResponse, Middlewares } from 'tsoa';
import {
  addToCartSchema,
  updateCartItemParamsSchema,
  updateCartItemBodySchema,
  applyCouponSchema,
  setDeliveryInfoSchema,
  clearCartSchema
} from '../../schemas/cart.schema';
import cartService from '../../services/cart/cart.service';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { ICart } from '../../models/CartModel';
import APIError from '../../error/api-error';
import { logger } from '../../config/logger';
import { StatusCodes } from 'http-status-codes';
import { validateSchemaMiddleware } from '../../middleware/common-validate';

import {
  AddToCartRequest,
  UpdateCartItemRequest,
  ApplyCouponRequest,
  SetDeliveryInfoRequest,
  ClearCartRequest
} from '../../types/cart.types';
import { IRequest } from '../../types/request.types';



import { BaseController } from '../base.controller';


@Route('customer/cart')
@Tags('User Cart')
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class UserCartController extends BaseController {

  /**
   * Validate user authentication
   */
  private validateUser(req: IRequest): string {
    if (!req.user?.userId) {
      throw new APIError('Unauthorized - User not authenticated', 401);
    }
    return req.user.userId;
  }

  /**
   * Handle controller errors consistently
   */
  private handleError(error: any, context: string, userId?: string): never {
    logger.error({ userId, context, error: error.message }, `Error in ${context}`);

    if (error instanceof APIError) {
      this.setStatus(error.statusCode);
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
  @Middlewares([validateSchemaMiddleware(addToCartSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async addToCart(
    @Body() request: AddToCartRequest,
    @Request() req: IRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      const cart = await cartService.addToCart(
        userId,
        request.productId,
        request.quantity,
        request.notes
      );

      return this.sendSuccess(cart, 'Item added to cart successfully');
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
    @Request() req: IRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);
      const cart = await cartService.getCart(userId, includeUnavailable);

      if (!cart) {
        return this.sendSuccess(
          { totalItems: 0, subtotal: 0, totalAmount: 0, items: [] },
          'Cart is empty'
        );
      }

      return this.sendSuccess(cart, 'Cart fetched successfully');
    } catch (error) {
      return this.handleError(error, 'getCart', req.user?.userId);
    }
  }

  /**
   * Update cart item quantity
   */
  @Put('/{productId}')
  @Security('jwt')
  @Middlewares([
    validateSchemaMiddleware(updateCartItemParamsSchema, 'params'),
    validateSchemaMiddleware(updateCartItemBodySchema, 'body')
  ])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.NOT_FOUND, "Product Not Found")
  public async updateCartItem(
    @Path() productId: string,
    @Body() request: UpdateCartItemRequest,
    @Request() req: IRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      const cart = await cartService.updateCartItem(userId, productId, request.quantity);
      const message = request.quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully';

      return this.sendSuccess(cart, message);
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
    @Request() req: IRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      if (!productId?.trim()) {
        throw new APIError('Product ID is required', 400);
      }

      const cart = await cartService.removeFromCart(userId, productId);

      return this.sendSuccess(cart, 'Item removed from cart successfully');
    } catch (error) {
      return this.handleError(error, 'removeFromCart', req.user?.userId);
    }
  }

  /**
   * Clear entire cart
   */
  @Delete('/')
  @Security('jwt')
  @Middlewares([validateSchemaMiddleware(clearCartSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async clearCart(
    @Body() request: ClearCartRequest,
    @Request() req: IRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);

      await cartService.clearCart(userId);

      return this.sendSuccess(
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
  @Middlewares([validateSchemaMiddleware(applyCouponSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.NOT_FOUND, "Coupon Not Found")
  public async applyCoupon(
    @Body() request: ApplyCouponRequest,
    @Request() req: IRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      const cart = await cartService.applyCoupon(userId, request.couponCode);

      return this.sendSuccess(cart, 'Coupon applied successfully');
    } catch (error) {
      return this.handleError(error, 'applyCoupon', req.user?.userId);
    }
  }

  /**
   * Set delivery information
   */
  @Post('/delivery')
  @Security('jwt')
  @Middlewares([validateSchemaMiddleware(setDeliveryInfoSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async setDeliveryInfo(
    @Body() request: SetDeliveryInfoRequest,
    @Request() req: IRequest
  ): Promise<SuccessResponse<ICart>> {
    try {
      const userId = this.validateUser(req);

      const cart = await cartService.setDeliveryInfo(
        userId,
        request.deliveryType,
        request.deliveryAddress,
        request.scheduledDelivery,
        request.location
      );

      return this.sendSuccess(cart, 'Delivery information set successfully');
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
    @Request() req: IRequest
  ): Promise<SuccessResponse<any>> {
    try {
      const userId = this.validateUser(req);
      const summary = await cartService.getCartSummary(userId);
      return this.sendSuccess(summary, 'Cart summary retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'getCartSummary', req.user?.userId);
    }
  }
}