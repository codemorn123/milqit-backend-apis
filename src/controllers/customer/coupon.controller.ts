import {
    Route, Tags, Controller, Post, Get, Body, Middlewares, SuccessResponse, Response, Request
  } from 'tsoa';
  import { validateSchemaMiddleware } from '../../middleware/common-validate';
  import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
  import { ICoupon } from '../../types/coupon.types';
  import couponService from '../../services/admin/cms/coupon.service';
  import { applyCouponSchema } from '../../validations/coupon.validator';
import { IRequest } from '../../types/request.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
//   import { IRequest } from '../../types/request.types';
  
  @Route("coupons")
  @Tags("Customer Coupons")
  export class CustomerCouponController extends Controller {
  
    @Get("/available")
    @SuccessResponse(200, "Success")
    public async getAvailableCoupons(): Promise<SuccessDataResponse<ICoupon[]>> {
      const result = await couponService.getAvailableCoupons();
      return success(result);
    }
  
    @Post("/apply")
    @SuccessResponse(200, "Success")
    @Response(400, "Validation Failed")
    @Response(404, "Not Found")
    // @Middlewares(validateSchemaMiddleware(applyCouponSchema),jwtAuthMiddleware())
    @Middlewares([validateSchemaMiddleware(applyCouponSchema), jwtAuthMiddleware])
    public async applyCoupon(
      @Request() req: IRequest, // Assuming your auth middleware adds user to the request
      @Body() body: { code: string; orderTotal: number }
    ): Promise<SuccessDataResponse<any>> {
        const userId = req.user?.userId;
      // A placeholder for the user ID. In your actual app, this would come from the JWT token.
    //   const userId = req.user?._id || '60d0fe4f5311236168a109ca'; // Replace with actual user ID from auth
    // const userId = req.user?._id || '60d0fe4f5311236168a109ca'; // Replace with actual user ID fr

    if (!userId) {
      throw new Error("Unauthorized: User not found in token");
    }
      const result = await couponService.applyCoupon(body.code, body.orderTotal, userId);
      return success(result);
    }
  }