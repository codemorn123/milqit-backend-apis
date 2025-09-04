import { CategoryModel, ICategoryDocument, ICategory } from '../models/CategoryModel';
import { ApiError } from '../utils/errorHandler';
import mongoose, { PaginateOptions, PaginateResult } from 'mongoose';
import { imageUploadService } from './imageUploadService';
import { logger } from '../config/logger';
import slugify from 'slugify';
import { CreateCategoryInput, UpdateCategoryInput } from '../validations/categoryValidators';

// Category query options interface
export interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
}

// For the tree result structure
export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  image?: string;
  icon?: string;
  description?: string;
  children: CategoryTreeItem[];
}

// Interface for file processing options
interface FileProcessingOptions {
  imageFile?: Express.Multer.File | null;
  iconFile?: Express.Multer.File | null;
  bannerFile?: Express.Multer.File | null;
}

// File processing result
interface FileProcessingResult {
  imagePath?: string;
  iconPath?: string;
  bannerPath?: string;
}

export const categoryService = {
  /**
   * Process upload files and return their paths
   */
  async processUploadedFiles(
    imageFile?: Express.Multer.File | null,
    iconFile?: Express.Multer.File | null,
    bannerFile?: Express.Multer.File | null
  ): Promise<FileProcessingResult> {
    const result: FileProcessingResult = {};
    
    try {
      // Process main image if provided
      if (imageFile) {
        result.imagePath = await imageUploadService.processCategoryImage(imageFile);
      }
      
      // Process icon if provided
      if (iconFile) {
        result.iconPath = await imageUploadService.processCategoryImage(iconFile, {
          width: 128,
          height: 128
        });
      }
      
      // Process banner if provided
      if (bannerFile) {
        result.bannerPath = await imageUploadService.processCategoryImage(bannerFile, {
          width: 1200,
          height: 300
        });
      }
      
      return result;
    } catch (error) {
      // Clean up any uploaded files if an error occurs
      if (result.imagePath) {
        await imageUploadService.deleteImage(result.imagePath).catch((err: Error) => {
          logger.error({ err }, 'Failed to clean up image after error');
        });
      }
      
      if (result.iconPath) {
        await imageUploadService.deleteImage(result.iconPath).catch((err: Error) => {
          logger.error({ err }, 'Failed to clean up icon after error');
        });
      }
      
      if (result.bannerPath) {
        await imageUploadService.deleteImage(result.bannerPath).catch((err: Error) => {
          logger.error({ err }, 'Failed to clean up banner after error');
        });
      }
      
      // Re-throw the error
      throw error;
    }
  },

  /**
   * Generate a unique slug for a category
   */
  async generateUniqueSlug(name: string, existingId?: string): Promise<string> {
    // Generate base slug
    let slug = slugify(name, { 
      lower: true,
      strict: true,
      trim: true
    });
    
    // Check for duplicate slug
    const query: Record<string, unknown> = { slug };
    if (existingId) {
      query._id = { $ne: new mongoose.Types.ObjectId(existingId) };
    }
    
    const existingSlug = await CategoryModel.findOne(query);
    
    // If duplicate exists, append timestamp to make unique
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    
    return slug;
  },

  /**
   * Create a new category
   */
  async createCategory(
    data: CreateCategoryInput,
    files: FileProcessingOptions = {}
  ): Promise<ICategoryDocument> {
    const timestamp = new Date().toISOString();
    
    try {
      logger.info({ 
        action: 'CREATE_CATEGORY_ATTEMPT',
        data: { ...data, timestamp },
        user: 'MarotiKathoke'
      }, 'Attempting to create category');
      
      // Check for duplicate name
      const existingCategory = await CategoryModel.findOne({ 
        name: { $regex: new RegExp(`^${data.name}$`, 'i') }
      });
      
      if (existingCategory) {
        throw ApiError.conflict('Category with this name already exists');
      }
      
      // Generate unique slug
      const slug = await this.generateUniqueSlug(data.name);
      
      // Process uploaded files
      const { imagePath, iconPath, bannerPath } = await this.processUploadedFiles(
        files.imageFile,
        files.iconFile,
        files.bannerFile
      );
      
      if (!imagePath) {
        throw ApiError.badRequest('Category image is required');
      }
      
      // Process parent ID if provided
      let parentId: mongoose.Types.ObjectId | null = null;
      if (data.parentId) {
        if (data.parentId !== 'null' && data.parentId !== '') {
          if (mongoose.isValidObjectId(data.parentId)) {
            parentId = new mongoose.Types.ObjectId(data.parentId);
          } else {
            throw ApiError.badRequest('Invalid parent ID format');
          }
        }
      }
      
      // Create category
      const newCategory = await CategoryModel.create({
        ...data,
        slug,
        parentId,
        image: imagePath,
        icon: iconPath,
        bannerImage: bannerPath,
        createdBy: 'MarotiKathoke',
        updatedBy: 'MarotiKathoke',
      });
      
      logger.info({ 
        categoryId: newCategory._id.toString(),
        timestamp
      }, 'Category created successfully');
      
      return newCategory;
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        data,
        timestamp
      }, 'Failed to create category');
      
      if (error instanceof ApiError) throw error;
      throw ApiError.internal('Failed to create category');
    }
  },
  
  /**
   * Update an existing category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
    files: FileProcessingOptions = {},
    session?: mongoose.ClientSession
  ): Promise<ICategoryDocument> {
    const timestamp = new Date().toISOString();
    
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest('Invalid category ID format');
      }

      logger.info({ 
        action: 'UPDATE_CATEGORY_ATTEMPT',
        categoryId: id,
        data: { ...data, timestamp },
        user: 'MarotiKathoke'
      }, 'Attempting to update category');
      
      // Find the category
      const findOptions = session ? { session } : {};
      const category = await CategoryModel.findById(id).session(session || null);
      
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
      
      // If updating name, check duplicates and update slug
      if (data.name && data.name !== category.name) {
        const existingCategory = await CategoryModel.findOne({ 
          name: { $regex: new RegExp(`^${data.name}$`, 'i') },
          _id: { $ne: new mongoose.Types.ObjectId(id) }
        }).session(session || null);
        
        if (existingCategory) {
          throw ApiError.conflict('Category with this name already exists');
        }
        
        // Generate new slug
        category.slug = await this.generateUniqueSlug(data.name, id);
      }
      
      // Process uploaded files
      const { imagePath, iconPath, bannerPath } = await this.processUploadedFiles(
        files.imageFile,
        files.iconFile,
        files.bannerFile
      );
      
      // Update image if provided and delete old one
      if (imagePath) {
        if (category.image) {
          await imageUploadService.deleteImage(category.image).catch((err: Error) => {
            logger.warn({ err, oldPath: category.image }, 'Failed to delete old image');
          });
        }
        category.image = imagePath;
      }
      
      // Update icon if provided and delete old one
      if (iconPath) {
        if (category.icon) {
          await imageUploadService.deleteImage(category.icon).catch((err: Error) => {
            logger.warn({ err, oldPath: category.icon }, 'Failed to delete old icon');
          });
        }
        category.icon = iconPath;
      }
      
      // Update banner if provided and delete old one
      if (bannerPath) {
        if (category.bannerImage) {
          await imageUploadService.deleteImage(category.bannerImage).catch((err: Error) => {
            logger.warn({ err, oldPath: category.bannerImage }, 'Failed to delete old banner');
          });
        }
        category.bannerImage = bannerPath;
      }
      
      // Update fields from input data
      if (data.name !== undefined) category.name = data.name;
      if (data.description !== undefined) category.description = data.description;
      if (data.displayOrder !== undefined) category.displayOrder = data.displayOrder;
      if (data.isActive !== undefined) category.isActive = data.isActive;
      if (data.metaTitle !== undefined) category.metaTitle = data.metaTitle;
      if (data.metaDescription !== undefined) category.metaDescription = data.metaDescription;
      if (data.backgroundColor !== undefined) category.backgroundColor = data.backgroundColor;
      if (data.textColor !== undefined) category.textColor = data.textColor;
      
      // Handle parentId special case
      if (data.parentId !== undefined) {
        // Convert 'null' string or empty string to actual null
        if (data.parentId === 'null' || data.parentId === '' || data.parentId === null) {
          category.parentId = null;
        } else {
          // Ensure it's a valid ObjectId
          if (!mongoose.isValidObjectId(data.parentId)) {
            throw ApiError.badRequest('Invalid parent ID format');
          }

          // Prevent category from being its own parent
          if (data.parentId === category._id.toString()) {
            throw ApiError.badRequest('Category cannot be its own parent');
          }
          
          // Prevent circular references
          const potentialParent = await CategoryModel.findById(data.parentId).session(session || null);
          if (!potentialParent) {
            throw ApiError.notFound('Parent category not found');
          }
          
          // Check if setting as parent would create a circular reference
          let currentParent = potentialParent;
          let visited = new Set<string>([category._id.toString()]);
          
          while (currentParent.parentId) {
            const parentId = currentParent.parentId.toString();
            
            // Check for circular reference
            if (visited.has(parentId)) {
              throw ApiError.badRequest('Creating a circular reference is not allowed');
            }
            
            // Add to visited set
            visited.add(parentId);
            
            // Find next parent
            const nextParent = await CategoryModel.findById(parentId).session(session || null);
            if (!nextParent) break;
            currentParent = nextParent;
          }
          
          category.parentId = new mongoose.Types.ObjectId(data.parentId);
        }
      }
      
      // Update audit fields
      category.updatedAt = new Date();
      category.updatedBy = 'MarotiKathoke';
      
      // Save updated category
      await category.save({ session });
      
      logger.info({ 
        categoryId: id,
        timestamp
      }, 'Category updated successfully');
      
      return category;
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id,
        data,
        timestamp
      }, 'Failed to update category');
      
      if (error instanceof ApiError) throw error;
      throw ApiError.internal('Failed to update category');
    }
  },
  
  /**
   * Get a category by ID
   */
  async getCategoryById(id: string): Promise<ICategoryDocument> {
    try {
      // Validate ObjectID
      if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest('Invalid category ID format');
      }
      
      const category = await CategoryModel.findById(id);
      
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
      
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        id 
      }, 'Failed to get category');
      throw ApiError.internal('Failed to get category');
    }
  },
  
  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    
    try {
      logger.info({ 
        action: 'DELETE_CATEGORY_ATTEMPT',
        categoryId: id,
        timestamp,
        user: 'MarotiKathoke'
      }, 'Attempting to delete category');
      
      // Validate ObjectID
      if (!mongoose.isValidObjectId(id)) {
        throw ApiError.badRequest('Invalid category ID format');
      }
      
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
      
      // Check if category has subcategories
      const hasSubcategories = await CategoryModel.exists({ parentId: new mongoose.Types.ObjectId(id) });
      if (hasSubcategories) {
        throw ApiError.badRequest('Cannot delete category with subcategories. Remove subcategories first.');
      }
      
      // Check if category has products
      const ProductModel = mongoose.model('Product');
      const hasProducts = await ProductModel.exists({ categoryId: new mongoose.Types.ObjectId(id) });
      if (hasProducts) {
        throw ApiError.badRequest('Cannot delete category with associated products. Remove or reassign products first.');
      }
      
      // Delete associated images
      if (category.image) {
        await imageUploadService.deleteImage(category.image).catch((err: Error) => {
          logger.warn({ err, path: category.image }, 'Failed to delete category image');
        });
      }
      
      if (category.icon) {
        await imageUploadService.deleteImage(category.icon).catch((err: Error) => {
          logger.warn({ err, path: category.icon }, 'Failed to delete category icon');
        });
      }
      
      if (category.bannerImage) {
        await imageUploadService.deleteImage(category.bannerImage).catch((err: Error) => {
          logger.warn({ err, path: category.bannerImage }, 'Failed to delete category banner');
        });
      }
      
      // Delete the category
      await CategoryModel.findByIdAndDelete(id);
      
      logger.info({ 
        categoryId: id,
        timestamp
      }, 'Category deleted successfully');
      
      return true;
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        id,
        timestamp
      }, 'Failed to delete category');
      
      if (error instanceof ApiError) throw error;
      throw ApiError.internal('Failed to delete category');
    }
  },
  
  /**
   * List categories with pagination, sorting and filtering
   */
  async listCategories(options: CategoryQueryOptions = {}): Promise<PaginateResult<ICategoryDocument>> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'displayOrder',
        sortOrder = 'asc',
        search = '',
        isActive,
        parentId
      } = options;
      
      // Build filter
      const filter: Record<string, unknown> = {};
      
      // Add isActive filter if provided
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }
      
      // Add parentId filter (handle null case)
      if (parentId !== undefined) {
        if (parentId === 'null' || parentId === null) {
          filter.parentId = null;
        } else if (mongoose.isValidObjectId(parentId)) {
          filter.parentId = new mongoose.Types.ObjectId(parentId);
        } else {
          // If parentId is provided but invalid, return empty result
          logger.warn({ parentId }, 'Invalid parentId format provided for category listing');
          return {
            docs: [],
            totalDocs: 0,
            limit,
            page,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
            pagingCounter: 0,
            offset: 0  
          };
        }
      }
      
      // Add search if provided
      if (search) {
        filter.$or = [
          { name: { $regex: new RegExp(search, 'i') } },
          { description: { $regex: new RegExp(search, 'i') } }
        ];
      }
      
      // Configure pagination options
      const paginateOptions: PaginateOptions = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        lean: true
      };
      
      // Get paginated results
      const result = await CategoryModel.paginate(filter, paginateOptions);
      
      return result;
    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        options 
      }, 'Failed to list categories');
      
      throw ApiError.internal('Failed to list categories');
    }
  },
  
  /**
   * Get category hierarchy (tree structure)
   */
async getCategoryTree(): Promise<CategoryTreeItem[]> {
  try {
    // Define the correct type for category documents from lean query
    type LeanCategory = ICategory & { _id: mongoose.Types.ObjectId };

    // Get all categories
    const allCategories = await CategoryModel.find({ isActive: true })
      .sort('displayOrder')
      .lean<LeanCategory[]>(); // Now correctly typed as an array
    
    // Build tree starting with root categories (parentId is null)
    // Explicitly type the callback parameter
    const rootCategories = allCategories.filter((c: LeanCategory) => !c.parentId);
    
    // Function to build tree recursively with explicit types
    const buildTree = (categories: LeanCategory[]): CategoryTreeItem[] => {
      return categories.map((category: LeanCategory) => {
        // Get ID string safely
        const categoryId = category._id.toString();
        
        // Find children of this category - explicit typing of callback
        const children = allCategories.filter((c: LeanCategory) => 
          c.parentId && c.parentId.toString() === categoryId
        );
        
        // Create the tree item
        const treeItem: CategoryTreeItem = {
          id: categoryId,
          name: category.name,
          slug: category.slug,
          displayOrder: category.displayOrder,
          image: category.image,
          icon: category.icon,
          description: category.description,
          children: children.length > 0 ? buildTree(children) : []
        };
        
        return treeItem;
      });
    };
    
    // Build and return tree
    return buildTree(rootCategories);
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Failed to get category tree');
    
    throw ApiError.internal('Failed to get category hierarchy');
  }
}
};