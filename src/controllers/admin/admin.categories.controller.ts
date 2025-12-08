import {
  Consumes, Controller, Delete, FormField, Get, Middlewares, Path, Post, Put, Queries, Response, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFile
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { categoryService } from '../../services/category.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { createCategorySchema, updateCategorySchema } from '../../validations/category-validation-schema';
import { idParamSchema } from '../../constants/common.validator';
import { ICategory } from '../../models/category.model';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import APIError from '../../error/api-error';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';

@Route("admin/categories")
@Tags("ADMIN: Categories")
@Security("jwt")
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.CONFLICT, 'Conflict')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
export class AdminCategoryController extends Controller {

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
    console.log('AdminCategoryController.create called');
    console.log('categoryImage:', categoryImage ? 'Present' : 'Missing');
    // Manual validation for multipart/form-data fields since middleware can't easily validate them before TSOA parses them
    // However, we can construct an object and validate it using Joi
    const dataToValidate = { name, description, parentId, backgroundColor, textColor, deepLink, slug };

    // Remove undefined keys
    Object.keys(dataToValidate).forEach(key => (dataToValidate as any)[key] === undefined && delete (dataToValidate as any)[key]);

    const { error, value } = createCategorySchema.validate(dataToValidate);
    if (error) {
      throw new APIError(error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const result = await categoryService.create(value, categoryImage);
    this.setStatus(StatusCodes.CREATED);
    return success(result, 'Category created successfully');
  }

  /**
   * List all categories with pagination and filtering
   */
  @Get("/")
  @Middlewares([jwtAuthMiddleware])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  public async listCategories(@Queries() filter: IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
    const result = await categoryService.getAll(filter);
    return success(result, "Categories fetched successfully");
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
    return success(category);
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
    const dataToValidate = { name, description, parentId, backgroundColor, textColor, deepLink, slug };

    // Remove undefined keys
    Object.keys(dataToValidate).forEach(key => (dataToValidate as any)[key] === undefined && delete (dataToValidate as any)[key]);

    const { error, value } = updateCategorySchema.validate(dataToValidate);
    if (error) {
      throw new APIError(error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const updatedCategory = await categoryService.update(id, value, categoryImage);
    return success(updatedCategory, "Category updated successfully");
  }

  /**
   * Delete a category by ID
   */
  @Delete("{id}")
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Category Not Found")
  public async delete(@Path() id: string): Promise<SuccessResponse<{ message: string }>> {
    const result = await categoryService.delete(id);
    return success(result as any);
  }

  /**
   * Bulk delete all categories (Use with caution)
   */
  @Delete("/bulk/delete-all")
  @Middlewares([jwtAuthMiddleware])
  @SuccessResponseTags(StatusCodes.OK, "Success")
  public async deleteMultiple(): Promise<SuccessResponse<{ message: string }>> {
    const result = await categoryService.deleteMultipleCategories();
    return success(result);
  }
}
