import {
  Route, Tags, Controller, Post, Get, Body, Middlewares, SuccessResponse, Response, Request, Security
} from 'tsoa';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
import { ICoupon } from '../../types/coupon.types';
import couponService from '../../services/admin/cms/coupon.service';
import { applyCouponSchema } from '../../validations/coupon.validator';
import { IRequest } from '../../types/request.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import APIError from '../../error/api-error';

@Route("customer/coupons")
@Tags("CUSTOMER: Coupons")
export class CustomerCouponController extends Controller {

  /**
   * Get all available coupons for the authenticated user.
   * Filters out coupons that are expired or have reached their usage limit for the user.
   */
  @Get("/available")
  @Security("jwt")
  @Middlewares([jwtAuthMiddleware])
  @SuccessResponse(200, "Success")
  public async getAvailableCoupons(
    @Request() req: IRequest
  ): Promise<SuccessDataResponse<ICoupon[]>> {
    const userId = req.user?.userId;
    // If user is not authenticated (though middleware ensures it), we might return general coupons or empty
    // But since we use jwtAuthMiddleware, userId should be present.

    const result = await couponService.getAvailableCoupons(userId);
    return success(result, 'Available coupons fetched successfully');
  }

  /**
   * Apply a coupon to an order total to calculate the discount.
   * Validates the coupon code and checks if it's applicable for the user and order amount.
   */
  @Post("/apply")
  @Security("jwt")
  @Middlewares([validateSchemaMiddleware(applyCouponSchema), jwtAuthMiddleware])
  @SuccessResponse(200, "Success")
  @Response(400, "Validation Failed")
  @Response(404, "Coupon Not Found")
  public async applyCoupon(
    @Request() req: IRequest,
    @Body() body: { code: string; orderTotal: number }
  ): Promise<SuccessDataResponse<{
    message: string;
    code: string;
    originalTotal: number;
    discountAmount: number;
    finalTotal: number;
  }>> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new APIError("Unauthorized: User not found in token", 401);
    }

    const result = await couponService.applyCoupon(body.code, body.orderTotal, userId);
    return success(result, 'Coupon applied successfully');
  }
}