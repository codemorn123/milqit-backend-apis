import {   Consumes, Controller, Delete, FormField, Get, Middlewares, NoSecurity, Path, Post, Put, Queries, Response, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFile, UploadedFiles } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { categoryService } from '../../services/category.service';
import {  success, SuccessResponse } from '../../utils/SuccessResponse';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { createCategorySchema, updateCategorySchema } from '../../validations/category-validation-schema';
import { idParamSchema } from '../../constants/common.validator';
import { ICategory } from '../../models/category.model';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import APIError from '../../error/api-error';


// --- DTO Interfaces ---


@Route("admin/categories")
@Tags("Admin - Categories")
// @Security("jwt", ["admin"])
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.CONFLICT, 'Conflict')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
export class AdminCategoryController extends Controller {


  @Post("/")
  @Consumes("multipart/form-data")
  // @SuccessResponse(201, "Created")
  @Response(400, "Validation Failed")
  // @Middlewares([validateSchemaMiddleware(createCategorySchema, "body")])
  public async create(
    @FormField() name: string,
    @FormField() description: string,
    @FormField() parentId?: string,         // Optional fields are fine
    @FormField() backgroundColor?: string,
    @FormField() textColor?: string,
    @FormField() deepLink?: string,
    @FormField() slug?: string,
    @UploadedFile("categoryImage") categoryImage?: Express.Multer.File
  ): Promise<SuccessResponse<{}>> {
    const dataToValidate = { name, backgroundColor,parentId, textColor, description, deepLink ,slug };
    const { error, value } = createCategorySchema.validate(dataToValidate);
    if (error) {
      console.warn(error);
      throw new APIError(error.details[0].message, 400);
    }
    const result = await categoryService.createCategory(value, categoryImage);
    // const result = await kisanCommunityService.create(value, profileImage);
    return success(result, 'Category created successfully');
  }





  // @Get()
  @Get("/")
  @NoSecurity()
  public async listCategories(@Queries() fillter: IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
    const result = await categoryService.listCategories(fillter);
    return success(result, "Categories fetched successfully");
  }







  @Get("{id}")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async getCategoryById(@Path() id: string): Promise<SuccessResponse<ICategory>> {
    const category = await categoryService.getCategoryById(id);
    return success(category);
  }

  @Put("/{id}")
  @Consumes("multipart/form-data")
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Not Found")
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
    // Remove undefined keys so Joi doesn't validate empty fields
    Object.keys(dataToValidate).forEach(key => dataToValidate[key] === undefined && delete dataToValidate[key]);

    const { error, value } = updateCategorySchema.validate(dataToValidate);
    if (error) {
        this.setStatus(StatusCodes.BAD_REQUEST);
        throw new APIError(error.details[0].message, StatusCodes.BAD_REQUEST);
    }
    
    const updatedCategory = await categoryService.updateCategory(id, value, categoryImage);
    return success(updatedCategory, "Category updated successfully");
  }

  @Delete("{id}")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Not Found")
  public async delete(@Path() id: string): Promise<SuccessResponse<{ message: string }>> {
    const result = await categoryService.deleteCategory(id);
    return success(result);
  }


  @Post("deleteAll/") // Using DELETE on the root path for bulk operations
  @SuccessResponseTags(StatusCodes.OK, "Success")
  @Response(StatusCodes.NOT_FOUND, "Not Found")
  // @Middlewares(validateSchemaMiddleware(bulkDeleteSchema, "body"))
  public async deleteMultiple(
  ): Promise<SuccessResponse<{ message: string }>> {
    const result = await categoryService.deleteMultipleCategories();
    return success(result);
  }


}
