import express from 'express';
import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Query, Request, Response, Route, Security, Tags } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { categoryService, CategoryQueryOptions, CategoryTreeItem } from '../../services/categoryService';
import { validate } from '../../middleware/validation.middleware';
import { createCategorySchema, reorderCategoriesSchema, updateCategorySchema, CategoryReorderInput } from '../../validations/categoryValidators';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';

// --- DTO Interfaces ---
interface CategoryDTO { }
interface PaginatedCategoriesDTO { }

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
  // @SuccessResponse(StatusCodes.CREATED, "Created")
  public async createCategory(@Request() request: express.Request): Promise<SuccessResponse<CategoryDTO>> {
    const validatedData = createCategorySchema.parse(request.body);
    const files = request.files as { [fieldname: string]: Express.Multer.File[] };
    const fileOptions = { imageFile: files?.image?.[0], iconFile: files?.icon?.[0], bannerFile: files?.banner?.[0] };
    
    const newCategory = await categoryService.createCategory(validatedData, fileOptions);
    this.setStatus(StatusCodes.CREATED);
    return success(newCategory.toObject() as CategoryDTO, "Category created successfully");
  }

  @Get()
  public async listCategories(@Query() page=1, @Query() limit=20, @Query() sortBy='displayOrder', @Query() sortOrder: 'asc'|'desc'='asc', @Query() search?: string, @Query() isActive?: boolean, @Query() parentId?: string): Promise<SuccessResponse<PaginatedCategoriesDTO>> {
    const options: CategoryQueryOptions = { page, limit, sortBy, sortOrder, search, isActive, parentId };
    const result = await categoryService.listCategories(options);
    const responseData: PaginatedCategoriesDTO = {
      categories: result.docs as any[],
      pagination: { total: result.totalDocs, pages: result.totalPages, page: result.page ?? 1, limit: result.limit, hasMore: result.hasNextPage ?? false },
    };
    return success(responseData);
  }

  @Get("{id}")
  public async getCategoryById(@Path() id: string): Promise<SuccessResponse<CategoryDTO>> {
    const category = await categoryService.getCategoryById(id);
    return success(category.toObject() as CategoryDTO);
  }

  @Put("{id}")
  public async updateCategory(@Path() id: string, @Request() request: express.Request): Promise<SuccessResponse<CategoryDTO>> {
    const validatedData = updateCategorySchema.parse(request.body);
    const files = request.files as { [fieldname: string]: Express.Multer.File[] };
    const fileOptions = { imageFile: files?.image?.[0], iconFile: files?.icon?.[0], bannerFile: files?.banner?.[0] };
    const updatedCategory = await categoryService.updateCategory(id, validatedData, fileOptions);
    return success(updatedCategory.toObject() as CategoryDTO, "Category updated successfully");
  }

  @Delete("{id}")
  // @SuccessResponse(StatusCodes.NO_CONTENT, "No Content")
  public async deleteCategory(@Path() id: string): Promise<void> {
    
    await categoryService.deleteCategory(id);
    this.setStatus(StatusCodes.NO_CONTENT);
  }

  @Get("tree")
  public async getCategoryTree(): Promise<SuccessResponse<{ tree: CategoryTreeItem[] }>> {
    const tree = await categoryService.getCategoryTree();
    return success({ tree });
  }

  @Put("reorder")
  @Middlewares(validate(reorderCategoriesSchema))
  public async reorderCategories(@Body() body: {categories: { id: string; displayOrder: number }[]
  }): Promise<SuccessResponse<null>> {
    await categoryService.reorderCategories(body.categories);
    return success(null, "Categories reordered successfully");
  }
}