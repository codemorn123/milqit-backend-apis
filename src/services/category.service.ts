import APIError from '../error/api-error';
import { CategoryModel } from '../models/category.model';
import { ICategory, ICategoryDocument } from '../types/category.types';
import cloudinaryImageService from './cloudinary-image.service';
import cacheService, { CACHE_PREFIX, CACHE_TTL } from './cache.service';
import { BaseService } from './base.service';
import logger from './logger';
import slugify from 'slugify';

class CategoryService extends BaseService<ICategoryDocument> {
  constructor() {
    super(CategoryModel as any, ['name', 'slug']);
  }

  public async create(
    categoryData: ICategory,
    image?: Express.Multer.File
  ): Promise<ICategoryDocument> {

    // Sanitize empty strings
    if (!categoryData.parentId) {
      categoryData.parentId = null;
    }

    if (!categoryData.slug) {
      categoryData.slug = slugify(categoryData.name, {
        lower: true,
        strict: true,
        trim: true
      });
    }

    // Check if slug exists
    const existingCategory = await CategoryModel.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      throw new APIError('Category with this slug already exists', 409);
    }

    if (!image) {
      throw new APIError('Category image is required.', 400);
    }

    logger.info('Uploading category image to Cloudinary');
    const uploadedImage = await cloudinaryImageService.uploadSingle(
      image,
      'categories',
      { required: true }
    );

    categoryData.categoryImage = uploadedImage;

    const newCategory = await super.create(categoryData);

    // Invalidate category list caches
    await cacheService.invalidateAllCategories();

    return newCategory;
  }

  // Override getOne to add caching
  public async getOne(id: string): Promise<ICategoryDocument> {
    const cacheKey = `${CACHE_PREFIX.CATEGORY}${id}`;

    return await cacheService.getOrSet(
      cacheKey,
      () => super.getOne(id),
      CACHE_TTL.MEDIUM
    );
  }

  public async update(
    id: string,
    updateData: Partial<ICategory>,
    file?: Express.Multer.File
  ): Promise<ICategoryDocument> {
    const category = await this.getOne(id);

    const payload: Partial<ICategory> = { ...updateData };

    if (file) {
      // Replace old image with new one
      const newImage = await cloudinaryImageService.replaceSingle(
        category.categoryImage,
        file,
        'categories'
      );

      if (newImage) {
        payload.categoryImage = newImage;
      }
    }

    // Sanitize
    if (payload.parentId === undefined) {
      payload.parentId = null;
    }

    // Handle slug update if name changes, or let user specify.
    if (!payload.slug) {
      delete payload.slug;
    }

    const updatedCategory = await super.update(id, payload);

    // Invalidate caches
    await cacheService.invalidateCategory(id);
    await cacheService.invalidateAllCategories();

    return updatedCategory;
  }

  public async delete(id: string): Promise<{ message: string; status: number }> {
    const category = await this.getOne(id);

    // Delete image from Cloudinary
    if (category.categoryImage) {
      await cloudinaryImageService.deleteSingle(category.categoryImage);
    }

    const result = await super.delete(id);

    // Invalidate caches
    await cacheService.invalidateCategory(id);
    await cacheService.invalidateAllCategories();

    return result;
  }

  public async deleteMultipleCategories(): Promise<{ message: string }> {
    const categoriesToDelete = await CategoryModel.find();
    if (categoriesToDelete.length === 0) {
      throw new APIError('No matching categories found to delete.', 404);
    }

    const categoryImages = categoriesToDelete
      .map(cat => cat.categoryImage)
      .filter(img => !!img);

    const deleteResult = await CategoryModel.deleteMany();

    // Delete all images from Cloudinary
    if (categoryImages.length > 0) {
      await cloudinaryImageService.deleteMultiple(categoryImages);
    }

    // Invalidate all category caches
    await cacheService.invalidateAllCategories();

    return { message: `${deleteResult.deletedCount} categories deleted successfully.` };
  }
}

export const categoryService = new CategoryService();