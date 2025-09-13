import { Body, Controller, Delete, Get, Middlewares, NoSecurity, Path, Post, Put, Queries, Response, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFiles } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { categoryService } from '../../services/category.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { CreateCategoryRequest } from './../../types/catergory.types';
import { IFilter, PaginatedResponse } from './../../types/common.types';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { createCategorySchema } from './../../validations/categoryValidators';
import { idParamSchema } from  './../../constants/common.validator';
import { PaginateResult } from 'mongoose';
import { ICategory, ICategoryDocument } from './../../models/CategoryModel';
import { ClientErrorInterface } from './../../error/clientErrorHelper';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from './../../error/exampleErrors';


// --- DTO Interfaces ---
interface CategoryDTO { }


@Route("admin/categories")
@Tags("Admin - Categories")
@Security("jwt", ["admin"])
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.CONFLICT, 'Conflict')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
export class AdminCategoryController extends Controller {




  @Post()
  @SuccessResponseTags(StatusCodes.CREATED, "Category created successfully")
  @Middlewares([validateSchemaMiddleware(createCategorySchema, "body")])
  @NoSecurity()
  public async createCategory(
   @Body () body: CreateCategoryRequest,
  ): Promise<SuccessResponse<CategoryDTO>> {
    const newCategory = await categoryService.createCategory(body);    
    return success(newCategory, "Category created successfully");
  }


  // @Get()
  @Get("/")
  @NoSecurity()
  public async  listCategories(@Queries() fillter:IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
    const result = await categoryService.listCategories(fillter);
    return success(result, "Categories fetched successfully");
  }

  @Get("{id}")
  public async getCategoryById(@Path() id: string): Promise<SuccessResponse<ICategory>> {
    const category = await categoryService.getCategoryById(id);
    return success(category);
  }

  @Put("{id}")
   @SuccessResponseTags("200", "Successfully updated address by ID")
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  @Middlewares([validateSchemaMiddleware(createCategorySchema, "body")])
  public async updateCategory(@Path() id: string, @Body () validatedData: CreateCategoryRequest): Promise<SuccessResponse<ICategory>> {
    const updatedCategory = await categoryService.updateCategory(id, validatedData);
    return success(updatedCategory, "Category updated successfully");
  }

  @Delete("{id}")
  @SuccessResponseTags(StatusCodes.NO_CONTENT, "No Content")
  public async deleteCategory(@Path() id: string): Promise<void> {
    await categoryService.deleteCategory(id);
    this.setStatus(StatusCodes.NO_CONTENT);
  }


  @Put("reorder")
  // @Middlewares(validate(reorderCategoriesSchema))
  public async reorderCategories(@Body() body: {categories: { id: string; displayOrder: number }[]
  }): Promise<SuccessResponse<null>> {
    await categoryService.reorderCategories(body.categories);
    return success(null, "Categories reordered successfully");
  }
}