



import mongoose from 'mongoose';
import APIError from '../error/api-error';
import { CategoryModel, ICategory, ICategoryDocument } from '../models/category.model';
import { ICategoryCreateParams } from '../types/catergory.types';
import customFileService from './custom-file.service';
import { CATEGORY_IMAGES_PATH } from '../constants/file-paths';
import { BaseService } from './base.service';

class CategoryService extends BaseService<ICategory> {
  constructor() {
    super(CategoryModel as any, ['name', 'slug']);
  }

  public async create(payload: Partial<ICategory>, file?: Express.Multer.File): Promise<ICategory> {
    const data: any = { ...payload };
    if (!file) {
      throw new APIError('Category image is required.', 400);
    }
    const { url, key } = await customFileService.saveFile(file, CATEGORY_IMAGES_PATH);
    data.categoryImage = { url, key };

    return super.create(data);
  }

  // listCategories (getAll) handled by BaseService. 
  // Note: Original listCategories had custom search logic (name or slug). BaseService handles this via searchFields.

  // getCategoryById (getOne) handled by BaseService.

  public async update(
    id: string,
    updateData: Partial<ICategory>,
    file?: Express.Multer.File
  ): Promise<ICategory> {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    const payload: any = { ...updateData };

    if (file) {
      // If a new file is uploaded, delete the old one first
      if (category.categoryImage?.key) {
        await customFileService.deleteFile(category.categoryImage.key, CATEGORY_IMAGES_PATH);
      }
      // Save the new file
      const { url, key } = await customFileService.saveFile(file, CATEGORY_IMAGES_PATH);
      payload.categoryImage = { url, key };
    }

    return super.update(id, payload);
  }

  public async delete(id: string): Promise<{ message: string; status: number }> {
    // Find and delete the document in one step
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new APIError('Category not found.', 404);
    }

    // If the deleted category had an image, delete it from storage
    if (category.categoryImage?.key) {
      await customFileService.deleteFile(category.categoryImage.key, CATEGORY_IMAGES_PATH);
    }

    return super.delete(id);
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
      // This looks dangerous deleting the whole directory? 
      // Original code: customFileService.deleteDirectory( 'categories/images')
      // I'll keep it as is for now but it seems risky.
      customFileService.deleteDirectory('categories/images')
    }

    return { message: `${deleteResult.deletedCount} categories deleted successfully.` };
  }
}

export const categoryService = new CategoryService();