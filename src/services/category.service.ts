

import mongoose from 'mongoose';
import { logger } from '../config/logger';
import { PresentableError } from '../error/clientErrorHelper';
import { CategoryModel, ICategory, ICategoryDocument } from '../models/CategoryModel';
import { IFilter, PaginatedResponse } from '../types/common.types';
import { CreateCategoryRequest } from '../types/catergory.types';
import APIError from '../error/api-error';

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  children: CategoryTreeItem[];
}


class CategoryService {

  public async createCategory(createCategoryRequest: CreateCategoryRequest): Promise<ICategoryDocument> {
    try {
      console.log('🆕 Creating new category:', createCategoryRequest.name);
      const categoryData = {
        ...createCategoryRequest,
        createdBy: 'MarotiKathoke',
        updatedBy: 'MarotiKathoke',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newCategory = await CategoryModel.create(categoryData);
      logger.info({ categoryId: newCategory._id }, 'Category created successfully');
      console.log(`✅ Category created successfully with ID: ${newCategory._id}`);
      
      return newCategory;
  
    } catch (error: any) {
      console.error('❌ Error creating category:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
        throw new APIError(`Validation failed: ${validationErrors.join(', ')}`, 400);
      }

      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0] || 'unknown field';
        throw new APIError(`Duplicate ${duplicateField} already exists`, 409);
      }

      throw new APIError(`Category creation failed: ${error.message}`, 500);
    }
  }

  /**
   * Update category by ID
   */
  public async updateCategory(
    id: string, 
    updateData: Partial<CreateCategoryRequest>
  ): Promise<ICategory> {
    try {
      console.log(`🔄 Updating category ${id}`);
      
      if (!mongoose.isValidObjectId(id)) {
        throw new APIError('Invalid category ID format', 400);
      }

      const updateWithMetadata = {
        ...updateData,
        updatedBy: 'MarotiKathoke',
        updatedAt: new Date()
      };

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id, 
        updateWithMetadata, 
        { 
          new: true,
          runValidators: true
        }
      ).exec();

      if (!updatedCategory) {
        throw new APIError(`Category with ID ${id} not found`, 404);
      }

      logger.info({ categoryId: id }, 'Category updated successfully');
      console.log(`✅ Category ${id} updated successfully`);
      
      return updatedCategory;
      
    } catch (error: any) {
      console.error(`❌ Error updating category ${id}:`, error);
      
      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
        throw new APIError(`Validation failed: ${validationErrors.join(', ')}`, 400);
      }

      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0] || 'unknown field';
        throw new APIError(`Duplicate ${duplicateField} already exists`, 409);
      }

      throw new APIError(`Category update failed: ${error.message}`, 500);
    }
  }

  /**
   * Get category by ID
   */
  public async getCategoryById(id: string): Promise<ICategoryDocument> {
    try {
      console.log(`🔍 Fetching category with ID: ${id}`);
      
      if (!mongoose.isValidObjectId(id)) {
        throw new PresentableError('VALIDATION_ERROR', 'Invalid category ID format');
      }

      const category = await CategoryModel.findById(id).exec();
      
      if (!category) {
        throw new PresentableError('NOT_FOUND', 'Category not found');
      }

      console.log(`✅ Found category: ${category.name}`);
      return category;
      
    } catch (error: any) {
      console.error(`❌ Error fetching category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete category by ID
   */
  public async deleteCategory(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting category ${id}`);
      
      const category = await this.getCategoryById(id);
      
      // Check for subcategories
      const hasSubcategories = await CategoryModel.exists({ parentId: category._id });
      if (hasSubcategories) {
        throw new PresentableError('CONFLICT', 'Cannot delete category with subcategories');
      }

      await CategoryModel.findByIdAndDelete(id);
      
      logger.info({ categoryId: id }, 'Category deleted successfully');
      console.log(`✅ Category ${id} deleted successfully`);
      
    } catch (error: any) {
      console.error(`❌ Error deleting category ${id}:`, error);
      throw error;
    }
  }

  /**
   * List categories with pagination and filtering
   */
  public async listCategories(options: IFilter): Promise<PaginatedResponse<ICategory>> {
    try {
      console.log('📋 Fetching categories with options:', options);
      const { 
        page = 1, 
        limit = 20, 
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Build filter
      const filter: mongoose.FilterQuery<ICategory> = {};
      
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries
      const [docs, totalDocs] = await Promise.all([
        CategoryModel.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        CategoryModel.countDocuments(filter).exec()
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevPage = hasPrevPage ? page - 1 : null;

      console.log(`✅ Found ${docs.length} categories out of ${totalDocs} total`);

      return {
        docs,
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
      };

    } catch (error: any) {
      console.error('❌ Error fetching categories:', error);
      throw new APIError(`Error fetching categories: ${error.message}`, 500);
    }
  }

  /**
   * Get category tree structure
   */
  /**
   * Reorder categories
   */
  public async reorderCategories(
    categories: { id: string; displayOrder: number }[]
  ): Promise<void> {
    try {
      console.log(`🔄 Reordering ${categories.length} categories`);
      
      // Validate all IDs first
      categories.forEach(item => {
        if (!mongoose.isValidObjectId(item.id)) {
          throw new APIError(`Invalid category ID: ${item.id}`, 400);
        }
      });

      // Update categories in bulk
      const bulkOps = categories.map(item => ({
        updateOne: {
          filter: { _id: item.id },
          update: { 
            displayOrder: item.displayOrder,
            updatedBy: 'MarotiKathoke',
            updatedAt: new Date()
          }
        }
      }));

      const result = await CategoryModel.bulkWrite(bulkOps);
      
      logger.info({ 
        count: categories.length,
        modifiedCount: result.modifiedCount 
      }, 'Categories reordered successfully');
      
      console.log(`✅ Reordered ${result.modifiedCount} categories successfully`);
      
    } catch (error: any) {
      console.error('❌ Error reordering categories:', error);
      throw new APIError(`Error reordering categories: ${error.message}`, 500);
    }
  }

  /**
   * Get category statistics
   */
  public async getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithChildren: number;
  }> {
    try {
      console.log('📊 Fetching category statistics');
      
      const [
        totalCategories,
        activeCategories,
        categoriesWithChildren
      ] = await Promise.all([
        CategoryModel.countDocuments().exec(),
        CategoryModel.countDocuments({ isActive: true }).exec(),
        CategoryModel.distinct('parentId', { parentId: { $ne: null } }).then(ids => ids.length)
      ]);

      const inactiveCategories = totalCategories - activeCategories;

      const stats = {
        totalCategories,
        activeCategories,
        inactiveCategories,
        categoriesWithChildren
      };

      console.log('✅ Category statistics:', stats);
      
      return stats;
      
    } catch (error: any) {
      console.error('❌ Error fetching category statistics:', error);
      throw new APIError(`Error fetching category statistics: ${error.message}`, 500);
    }
  }

  /**
   * Get category by slug
   */
  public async getCategoryBySlug(slug: string): Promise<ICategoryDocument | null> {
    try {
      console.log(`🔍 Fetching category with slug: ${slug}`);
      
      const category = await CategoryModel.findOne({ slug, isActive: true }).exec();
      
      if (category) {
        console.log(`✅ Found category: ${category.name}`);
      } else {
        console.log(`⚠️ Category with slug '${slug}' not found`);
      }
      
      return category;
      
    } catch (error: any) {
      console.error(`❌ Error fetching category by slug ${slug}:`, error);
      throw new APIError(`Error fetching category by slug: ${error.message}`, 500);
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;