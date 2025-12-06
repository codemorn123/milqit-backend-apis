import {
  Route, Tags, Controller, Post, Get, Put, Delete,
  Body, Path, Queries, Middlewares, SuccessResponse, Security
} from 'tsoa';
import { validateSchemaMiddleware } from '../../../middleware/common-validate';
import { ICoupon, ICouponCreateRequest } from '../../../types/coupon.types';
import {
  createCouponSchema,
  updateCouponSchema,
  idParamSchema,
  filterQuerySchema
} from '../../../validations/coupon.validator';
import couponService from '../../../services/admin/cms/coupon.service';
import { success, SuccessResponse as SuccessDataResponse } from '../../../utils/SuccessResponse';
import { IFilter, PaginatedResponse } from '../../../types/common.types';
import { jwtAuthMiddleware } from '../../../middleware/jwt-auth';

@Route("admin/coupons")
@Tags("ADMIN: Coupons")
@Security("jwt")
export class AdminCouponController extends Controller {

  /**
   * Create a new coupon
   */
  @Post("/")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(createCouponSchema, "body")])
  @SuccessResponse(201, "Created")
  public async create(@Body() body: ICouponCreateRequest): Promise<SuccessDataResponse<ICoupon>> {
    const result = await couponService.create(body);
    this.setStatus(201);
    return success(result, 'Coupon created successfully');
  }

  /**
   * Get all coupons with pagination and filtering
   */
  @Get("/")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(filterQuerySchema, "query")])
  @SuccessResponse(200, "Success")
  public async getAll(@Queries() queryParams: IFilter): Promise<SuccessDataResponse<PaginatedResponse<ICoupon>>> {
    const result = await couponService.getAll(queryParams);
    return success(result, 'Coupons fetched successfully');
  }

  /**
   * Get a coupon by ID
   */
  @Get("/{id}")
  @Middlewares([
    jwtAuthMiddleware,
    validateSchemaMiddleware(idParamSchema, "params")
  ])
  @SuccessResponse(200, "Success")
  public async getById(@Path() id: string): Promise<SuccessDataResponse<ICoupon>> {
    const result = await couponService.getOne(id);
    return success(result, 'Coupon fetched successfully');
  }

  /**
   * Update a coupon by ID
   */
  @Put("/{id}")
  @Middlewares([
    jwtAuthMiddleware,
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(updateCouponSchema, "body")
  ])
  @SuccessResponse(200, "Success")
  public async update(@Path() id: string, @Body() body: Partial<ICoupon>): Promise<SuccessDataResponse<ICoupon>> {
    const result = await couponService.update(id, body);
    return success(result, 'Coupon updated successfully');
  }

  /**
   * Delete a coupon by ID
   */
  @Delete("/{id}")
  @Middlewares([
    jwtAuthMiddleware,
    validateSchemaMiddleware(idParamSchema, "params")
  ])
  @SuccessResponse(200, "Success")
  public async delete(@Path() id: string): Promise<SuccessDataResponse<{ message: string }>> {
    const result = await couponService.delete(id);
    return success(result, 'Coupon deleted successfully');
  }
}