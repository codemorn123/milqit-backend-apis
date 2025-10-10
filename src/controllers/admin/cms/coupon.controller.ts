import { validateSchemaMiddleware } from './../../../middleware/common-validate';
import { ICoupon } from './../../../types/coupon.types';
import { createCouponSchema } from './../../../validations/coupon.validator';
import {
    Route, Tags, Controller, Post, Get, Put, Delete,
    Body, Path, Queries, Middlewares, SuccessResponse, Security
  } from 'tsoa';

  import couponService from './../../../services/admin/cms/coupon.service';
  import { success, SuccessResponse as SuccessDataResponse } from './../../../utils/SuccessResponse';
import { IFilter, IPaginated } from './../../../types/common.types';
import { updateCouponSchema, idParamSchema, filterQuerySchema } from './../../../validations/coupon.validator';

  @Route("admin/coupons")
  @Tags("Admin Coupons")
  @Security("jwt")
  export class AdminCouponController extends Controller {
    @Post("/")
    @Middlewares(validateSchemaMiddleware(createCouponSchema))
    public async create(@Body() body: ICoupon): Promise<SuccessDataResponse<ICoupon>> {
      const result = await couponService.create(body);
      return success(result, 'Coupon created successfully');
    }
  
    @Get("/")
    @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
    public async getAll(@Queries() queryParams: IFilter): Promise<{ data: ICoupon[]; pagination: IPaginated }> {
      return couponService.getAll(queryParams);
    }
  
    @Put("/{id}")
    @Middlewares(validateSchemaMiddleware(idParamSchema, "params"), validateSchemaMiddleware(updateCouponSchema))
    public async update(@Path() id: string, @Body() body: Partial<ICoupon>): Promise<SuccessDataResponse<ICoupon>> {
      const result = await couponService.update(id, body);
      return success(result, 'Coupon updated successfully');
    }
  
    @Delete("/{id}")
    @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
    public async delete(@Path() id: string): Promise<SuccessDataResponse<{ message: string }>> {
      const result = await couponService.delete(id);
      return success(result);
    }
  }