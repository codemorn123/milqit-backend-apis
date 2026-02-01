import {
  Consumes, Delete, FormField, Get, Middlewares, Path, Post, Put, Queries, Response, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFile
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { categoryService } from '../../services/category.service';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { createCategorySchema, updateCategorySchema } from '../../validations/category-validation-schema';
import { idParamSchema } from '../../constants/common.validator';
import { ICategory } from '../../types/category.types';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import { handleValidationError } from '../../utils/error-helpers';
import { cleanObject } from '../../utils/object.utils';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { BaseController } from '../base.controller';

@Route("admin/categories")
@Tags("ADMIN: Categories")
@Security("jwt")
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.CONFLICT, 'Conflict')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
export class AdminCategoryController extends BaseController {

  /**
   * Create a new category with image upload
   */
  @Post("/")
  @Consumes("multipart/form-data")
  @SuccessResponseTags(StatusCodes.CREATED, "Created")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Middlewares([jwtAuthMiddleware])
  public async create(
    @FormField() name: string,
    @FormField() description?: string,
    @FormField() parentId?: string,
    @FormField() backgroundColor?: string,
    @FormField() textColor?: string,
    @FormField() deepLink?: string,
    @FormField() slug?: string,
    @UploadedFile("categoryImage") categoryImage?: Express.Multer.File
  ): Promise<SuccessResponse<ICategory>> {
    const cleanedData = cleanObject({ name, description, parentId, backgroundColor, textColor, deepLink, slug });
    const { error, value } = createCategorySchema.validate(cleanedData);
    if (error) handleValidationError(error);

    const result = await categoryService.create(value, categoryImage);
    return this.sendCreated(result, 'Category created successfully');
  }

  /**
   * List all categories with pagination and filtering
   */
  @Get("/")
  @Middlewares([jwtAuthMiddleware])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  public async listCategories(@Queries() filter: IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
    const result = await categoryService.getAll(filter);
    return this.sendPaginated(result, "Categories fetched successfully");
  }

  /**
   * Get a category by ID
   */
  @Get("{id}")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Category Not Found")
  public async getCategoryById(@Path() id: string): Promise<SuccessResponse<ICategory>> {
    const category = await categoryService.getOne(id);
    return this.sendSuccess(category);
  }

  /**
   * Update a category by ID
   */
  @Put("/{id}")
  @Consumes("multipart/form-data")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Category Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async update(
    @Path() id: string,
    @FormField() name?: string,
    @FormField() description?: string,
    @FormField() parentId?: string,
    @FormField() backgroundColor?: string,
    @FormField() textColor?: string,
    @FormField() deepLink?: string,
    @FormField() slug?: string,
    @UploadedFile("categoryImage") categoryImage?: Express.Multer.File
  ): Promise<SuccessResponse<ICategory>> {
    const cleanedData = cleanObject({ name, description, parentId, backgroundColor, textColor, deepLink, slug });
    const { error, value } = updateCategorySchema.validate(cleanedData);
    if (error) handleValidationError(error);

    const updatedCategory = await categoryService.update(id, value, categoryImage);
    return this.sendSuccess(updatedCategory, "Category updated successfully");
  }

  /**
   * Delete a category by ID
   */
  @Delete("{id}")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Category Not Found")
  public async delete(@Path() id: string): Promise<SuccessResponse<null>> {
    await categoryService.delete(id);
    return this.sendResponse('Category deleted successfully');
  }

  /**
   * Bulk delete all categories (Use with caution)
   */
  @Delete("/bulk/delete-all")
  @Middlewares([jwtAuthMiddleware])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  public async deleteMultiple(): Promise<SuccessResponse<{ message: string }>> {
    const result = await categoryService.deleteMultipleCategories();
    return this.sendSuccess(result);
  }
}
