import { Controller, Post, Get, Put, Delete, Route, 
  Path, Body, SuccessResponse, Query, Tags, 
  Security, Response, Example, Request } from 'tsoa';
import mongoose from 'mongoose';
import { categoryService, CategoryQueryOptions } from '../../services/categoryService';
import { ApiError } from '../../utils/errorHandler';
import { logger } from '../../config/logger';
import { validate } from '../../utils/zodValidator';
import { 
  categoryBaseSchema,
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema
} from '../../validations/categoryValidators';
import { ZodError } from 'zod';
import express from 'express';
import multer from 'multer';
import { ErrorResponse } from './../../types/common.types';

/**
 * Response interfaces for TSOA documentation
 */
export interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: {
    category?: Record<string, any>;
    [key: string]: any;
  };
}

export interface PaginatedCategoryResponse {
  success: boolean;
  data: {
    categories: Array<Record<string, any>>;
    pagination: {
      total: number;
      pages: number;
      page: number;
      limit: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      prevPage: number | null;
      nextPage: number | null;
    };
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface CategoryReorderRequest {
  categories: Array<{ id: string; displayOrder: number }>;
}

export interface ReorderResponse {
  success: boolean;
  message: string;
  data?: {
    results: Array<{ id: string; success: boolean }>;
  };
}


@Route("admin/categories")
@Tags("Admin - Categories")
// @Security("jwt", ["admin"]) // Use jwt security with admin role requirement
@Response<ErrorResponse>(400, "Bad Request")
@Response<ErrorResponse>(401, "Unauthorized")
@Response<ErrorResponse>(403, "Forbidden")
@Response<ErrorResponse>(404, "Not Found")
@Response<ErrorResponse>(409, "Conflict")
@Response<ErrorResponse>(422, "Validation Error")
@Response<ErrorResponse>(500, "Server Error")
export class AdminCategoryController extends Controller {
  /**
   * Create a new product category
   * Note: This endpoint processes multipart/form-data with files
   */
  @Post()
  @SuccessResponse(201, "Category created successfully")
public async createCategory(
  @Request() request: express.Request
): Promise<CategoryResponse> {
  try {
    const timestamp = new Date().toISOString();
    
    // Debug log everything
    logger.debug({
      action: 'CREATE_CATEGORY_DEBUG',
      body: request.body,
      files: request.files,
      headers: request.headers,
      timestamp
    }, 'Category create - raw request data');
    
    // Extract files from multer-populated request
    const reqFiles = request.files as {
      [fieldname: string]: Express.Multer.File[];
    } | undefined;
    
    // Process form data
    const formData = {
      name: request.body.name || '',
      description: request.body.description || '',
      displayOrder: request.body.displayOrder ? parseInt(request.body.displayOrder) : 0,
      isActive: request.body.isActive === 'true' ? true : 
                request.body.isActive === 'false' ? false : true,
      parentId: request.body.parentId === 'null' ? null : request.body.parentId || null,
      metaTitle: request.body.metaTitle || '',
      metaDescription: request.body.metaDescription || '',
      backgroundColor: request.body.backgroundColor || '#FFFFFF',
      textColor: request.body.textColor || '#000000'
    };
    
    // Log processed data
    logger.info({ 
      action: 'CREATE_CATEGORY_API',
      processedData: formData,
      hasImage: reqFiles?.image ? true : false,
      imageCount: reqFiles?.image?.length,
      timestamp,
      user: 'MarotiKathoke'
    }, 'Category create with processed data');
    
    // Extract files if present
    const files = {
      imageFile: reqFiles?.image?.[0],
      iconFile: reqFiles?.icon?.[0],
      bannerFile: reqFiles?.banner?.[0]
    };
    
    // Create category through service with try/catch
    let category;
    try {
      // Validate with Zod - with proper error handling
      const validatedData = validate(createCategorySchema, formData);
      category = await categoryService.createCategory(validatedData, files);
    } catch (serviceError) {
      logger.error({
        error: serviceError instanceof Error ? serviceError.message : 'Unknown error',
        stack: serviceError instanceof Error ? serviceError.stack : undefined,
        formData,
        hasFiles: !!files.imageFile,
        timestamp
      }, 'Error in category creation service');
      throw serviceError;
    }
    
    // Return success response
    this.setStatus(201);
    return {
      success: true,
      message: "Category created successfully",
      data: {
        category: category.toObject()
      }
    };
  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, 'Category creation failed');
    
    return handleControllerError(error, "Failed to create category");
  }
}
  // public async createCategory(
  //   @Request() request: express.Request
  // ): Promise<CategoryResponse> {
  //   try {
  //     const timestamp = new Date().toISOString();
      
  //     // Extract data from multer-populated request
  //     const reqFiles = request.files as {
  //       [fieldname: string]: Express.Multer.File[];
  //     } | undefined;
      
  //     // Extract and validate JSON data
  //     const jsonData = request.body;
      
  //     // Log operation start
  //     logger.info({ 
  //       action: 'CREATE_CATEGORY_API',
  //       data: { ...jsonData, timestamp },
  //       user: 'MarotiKathoke'
  //     }, 'Category create API called');
      
  //     // Validate with Zod
  //     const validatedData = validate(createCategorySchema, jsonData);
      
  //     // Extract files if present
  //     const files = {
  //       imageFile: reqFiles?.image?.[0],
  //       iconFile: reqFiles?.icon?.[0],
  //       bannerFile: reqFiles?.banner?.[0]
  //     };
      
  //     // Create category through service
  //     const category = await categoryService.createCategory(validatedData, files);
      
  //     // Return success response
  //     this.setStatus(201);
  //     return {
  //       success: true,
  //       message: "Category created successfully",
  //       data: {
  //         category: category.toObject()
  //       }
  //     };
  //   } catch (error) {
  //     return handleControllerError(error, "Failed to create category");
  //   }
  // }

  /**
   * Get all categories with pagination and filtering
   */
  @Get()
  public async listCategories(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() sortBy?: string,
    @Query() sortOrder?: "asc" | "desc",
    @Query() search?: string,
    @Query() isActive?: boolean,
    @Query() parentId?: string
  ): Promise<PaginatedCategoryResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      logger.info({ 
        action: 'LIST_CATEGORIES_API',
        query: { page, limit, sortBy, sortOrder, search, isActive, parentId },
        timestamp,
        user: 'MarotiKathoke'
      }, 'List categories API called');
      
      const options: CategoryQueryOptions = {
        page: page || 1,
        limit: limit || 20,
        sortBy,
        sortOrder,
        search,
        isActive,
        parentId: parentId === "null" ? null : parentId,
      };

      const result = await categoryService.listCategories(options);

      return {
        success: true,
        data: {
          categories: result.docs.map(doc => doc.toObject ? doc.toObject() : doc),
          pagination: {
            total: result.totalDocs,
            pages: result.totalPages,
            page: result.page || 1,
            limit: result.limit,
            hasPrevPage: result.hasPrevPage || false,
            hasNextPage: result.hasNextPage || false,
            prevPage: result.prevPage ?? null,
            nextPage: result.nextPage ?? null,
          },
        },
      };
    } catch (error) {
      return handleControllerError(error, "Failed to list categories");
    }
  }

  /**
   * Get category by ID
   */
  @Get("{id}")
  public async getCategoryById(@Path() id: string): Promise<CategoryResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      logger.info({ 
        action: 'GET_CATEGORY_API',
        id,
        timestamp,
        user: 'MarotiKathoke'
      }, 'Get category API called');
      
      // Validate ObjectID
      if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest("Invalid category ID format");
      }

      const category = await categoryService.getCategoryById(id);
      
      return {
        success: true,
        data: {
          category: category.toObject ? category.toObject() : category,
        },
      };
    } catch (error) {
      return handleControllerError(error, "Failed to get category", { id });
    }
  }

  /**
   * Update an existing category
   * Note: This endpoint processes multipart/form-data with files
   */
  @Put("{id}")
  public async updateCategory(
    @Path() id: string,
    @Request() request: express.Request
  ): Promise<CategoryResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      // Extract data from multer-populated request
      const reqFiles = request.files as {
        [fieldname: string]: Express.Multer.File[];
      } | undefined;
      
      // Extract and validate JSON data
      const jsonData = request.body;
      
      // Log operation start
      logger.info({ 
        action: 'UPDATE_CATEGORY_API',
        id,
        data: { ...jsonData, timestamp },
        user: 'MarotiKathoke'
      }, 'Category update API called');
      
      // Validate ObjectID
      if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest("Invalid category ID format");
      }
      
      // Validate with Zod (partial validation for updates)
      const validatedData = validate(updateCategorySchema, jsonData);
      
      // Extract files if present
      const files = {
        imageFile: reqFiles?.image?.[0],
        iconFile: reqFiles?.icon?.[0],
        bannerFile: reqFiles?.banner?.[0]
      };
      
      // Update category through service
      const updatedCategory = await categoryService.updateCategory(id, validatedData, files);
      
      // Return success response
      return {
        success: true,
        message: "Category updated successfully",
        data: {
          category: updatedCategory.toObject ? updatedCategory.toObject() : updatedCategory,
        },
      };
    } catch (error) {
      return handleControllerError(error, "Failed to update category", { id });
    }
  }

  /**
   * Delete a category
   */
  @Delete("{id}")
  public async deleteCategory(@Path() id: string): Promise<CategoryResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      logger.info({ 
        action: 'DELETE_CATEGORY_API',
        id,
        timestamp,
        user: 'MarotiKathoke'
      }, 'Category delete API called');
      
      // Delete through service
      await categoryService.deleteCategory(id);
      
      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      return handleControllerError(error, "Failed to delete category", { id });
    }
  }

  /**
   * Get category tree hierarchy
   */
  @Get("tree")
  public async getCategoryTree(): Promise<CategoryResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      logger.info({ 
        action: 'GET_CATEGORY_TREE_API',
        timestamp,
        user: 'MarotiKathoke'
      }, 'Category tree API called');
      
      const tree = await categoryService.getCategoryTree();
      
      return {
        success: true,
        data: {
          categoryTree: tree,
        },
      };
    } catch (error) {
      return handleControllerError(error, "Failed to get category tree");
    }
  }

  /**
   * Reorder categories by updating display order
   */
  @Put("reorder")
  public async reorderCategories(
    @Body() requestBody: CategoryReorderRequest
  ): Promise<ReorderResponse> {
    try {
      const timestamp = new Date().toISOString();
      
      logger.info({ 
        action: 'REORDER_CATEGORIES_API',
        data: requestBody,
        timestamp,
        user: 'MarotiKathoke'
      }, 'Reorder categories API called');
      
      // Validate request data with Zod
      const validatedData = validate(reorderCategoriesSchema, requestBody);
      const { categories } = validatedData;

      // Start a MongoDB session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Process all updates within the transaction
        const updateResults: Array<{ id: string; success: boolean }> = [];

        for (const item of categories) {
          try {
            // Use updateCategory to update each item's display order
            await categoryService.updateCategory(
              item.id, 
              { displayOrder: item.displayOrder },
              {}, // No files
              session
            );
            updateResults.push({ id: item.id, success: true });
          } catch (err) {
            updateResults.push({ id: item.id, success: false });
            logger.warn({ categoryId: item.id, error: err }, "Failed to update category order");
          }
        }

        // Check if any updates failed
        const hasFailures = updateResults.some((result) => !result.success);
        if (hasFailures) {
          // Roll back the transaction if any updates failed
          await session.abortTransaction();

          // Set multi-status code
          this.setStatus(207);

          return {
            success: false,
            message: "Some category updates failed",
            data: { results: updateResults },
          };
        }

        // Commit the transaction
        await session.commitTransaction();

        return {
          success: true,
          message: "Categories reordered successfully",
          data: { results: updateResults },
        };
      } catch (error) {
        // Roll back the transaction on any error
        await session.abortTransaction();
        throw error;
      } finally {
        // End the session
        session.endSession();
      }
    } catch (error) {
      return handleControllerError(error, "Failed to reorder categories");
    }
  }
}

/**
 * Centralized error handler for controllers
 * Logs the error and constructs an appropriate ApiError response
 */
function handleControllerError(error: any, message: string, context: Record<string, any> = {}): never {
  const timestamp = new Date().toISOString();
  
  // If it's already an ApiError, log and rethrow
  if (error instanceof ApiError) {
    logger.warn({ 
      ...context,
      errorCode: error.code,
      errorStatus: error.status,
      timestamp,
      user: 'MarotiKathoke'
    }, `${message}: ${error.message}`);
    throw error;
  }
  
  // If it's a validation error from Zod
  if (error instanceof ZodError) {

    throw ApiError.validation(error);
  }
  
  // Handle mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    logger.warn({ 
      ...context,
      validation: error.errors,
      timestamp,
      user: 'MarotiKathoke'
    }, `Mongoose validation error: ${message}`);
    throw ApiError.validation(Object.values(error.errors).map(e => e.message));
  }
  
  // Handle duplicate key errors
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern)[0];
    logger.warn({ 
      ...context,
      duplicateKey,
      timestamp,
      user: 'MarotiKathoke'
    }, `Duplicate key error: ${message}`);
    throw ApiError.conflict(`Duplicate ${duplicateKey} value`);
  }
  
  // Log and throw generic server error for everything else
  logger.error({ 
    ...context,
    error: error.message,
    stack: error.stack,
    timestamp,
    user: 'MarotiKathoke'
  }, `Unexpected error: ${message}`);
  
  throw ApiError.internal(message);
}