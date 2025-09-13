import { Controller, Get, Route, Query, Tags, Response, Queries } from 'tsoa';
import { categoryService } from '../../services/category.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { ErrorResponse, IFilter, PaginatedResponse } from '../../types/common.types';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import { ICategory } from '../../models/CategoryModel';


@Route("mobile/categories")
@Tags("Mobile - Categories")
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
export class MobileCategoryController extends Controller {

  @Get()
  public async listCategories(@Queries()  filter: IFilter
  ): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
      const result = await categoryService.listCategories(filter);
      return success(result, 'Categories fetched successfully');
      }

  /**
   * Get featured categories for mobile app
   */
  @Get("featured")
  public async getFeaturedCategories(@Queries() options: IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
      const result = await categoryService.listCategories(options);
      return success(result, 'Featured categories fetched successfully');
  }
}