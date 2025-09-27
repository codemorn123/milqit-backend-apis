



import mongoose from 'mongoose';
import APIError from '../error/api-error';
import { CategoryModel, ICategory, ICategoryDocument } from '../models/category.model';
import { IFilter, PaginatedResponse } from '../types/common.types';
import { ICategoryCreateParams } from '../types/catergory.types';
import customFileService from './custom-file.service';
import { CATEGORY_IMAGES_PATH } from '../constants/file-paths';


class CategoryService {
  public async createCategory(payload: ICategoryCreateParams, file?: Express.Multer.File): Promise<ICategoryDocument> {
   try {
    if (!file) {
      throw new APIError('Category image is required.', 400);
    }
    const { url, key } = await customFileService.saveFile(file, CATEGORY_IMAGES_PATH);
    payload.categoryImage = { url, key };

    const newCategory = await CategoryModel.create(payload);
    return newCategory;
   }catch (error: any) {
    console.error('❌ Error creating category:', error);
    throw new APIError(`Error creating category: ${error.message}`, 500);
   }

  }

  public async listCategories(options: IFilter): Promise<PaginatedResponse<ICategory>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const search = options.search;

    const filter: mongoose.FilterQuery<ICategory> = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
    }

    const totalDocs = await CategoryModel.countDocuments(filter);
    const docs = await CategoryModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ICategory[]>()
      .exec();
      
    return {
      docs: docs,
      totalDocs: totalDocs,
      limit: limit,
      page: page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };
  }

  public async getCategoryById(id: string): Promise<ICategoryDocument> {
    const category = await CategoryModel.findById(id).lean<ICategoryDocument>();
    if (!category) {
      throw new APIError('Category not found.', 404);
    }
    return category;
  }

  public async updateCategory(
    id: string,
    updateData: Partial<ICategoryCreateParams>,
    file?: Express.Multer.File
  ): Promise<ICategoryDocument> {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    const payload: Partial<ICategoryCreateParams> = { ...updateData };

    if (file) {
      // If a new file is uploaded, delete the old one first
      if (category.categoryImage?.key) {
        await customFileService.deleteFile(category.categoryImage.key, CATEGORY_IMAGES_PATH);
      }
      // Save the new file
      const { url, key } = await customFileService.saveFile(file, CATEGORY_IMAGES_PATH);
      payload.categoryImage = { url, key };
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, payload, { new: true }).lean<ICategory>();
    if (!updatedCategory) {
      throw new APIError('Failed to update category.', 500);
    }
    return updatedCategory as ICategoryDocument;
  }

  public async deleteCategory(id: string): Promise<{ message: string }> {
    // Find and delete the document in one step
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    // If the deleted category had an image, delete it from storage
    if (category.categoryImage?.key) {
      await customFileService.deleteFile(category.categoryImage.key, CATEGORY_IMAGES_PATH);
    }

    return { message: 'Category deleted successfully.' };
  }



  public async deleteMultipleCategories(): Promise<{ message: string }> {

    const categoriesToDelete = await CategoryModel.find();
    if (categoriesToDelete.length === 0) {
      throw new APIError('No matching categories found to delete.', 404);
    }
    const imageKeysToDelete = categoriesToDelete
      .map(cat => cat.categoryImage?.key)
      .filter((key): key is string => !!key); // Filter out any null/undefined key
    const deleteResult = await CategoryModel.deleteMany();
    if (imageKeysToDelete.length > 0) {
      customFileService.deleteDirectory( 'categories/images')
    }

    return { message: `${deleteResult.deletedCount} categories deleted successfully.` };
  }
}

export const categoryService = new CategoryService();