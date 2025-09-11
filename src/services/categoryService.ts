import mongoose, { PaginateOptions, PaginateResult } from 'mongoose';
import slugify from 'slugify';
import { logger } from '../config/logger';
import { PresentableError } from '../error/clientErrorHelper';
import { CategoryModel, ICategory, ICategoryDocument } from '../models/CategoryModel';
import { CreateCategoryInput, UpdateCategoryInput } from '../validations/categoryValidators';
import { imageUploadService } from './imageUploadService';

// --- Interfaces ---
export interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  children: CategoryTreeItem[];
  // You can add other relevant fields like image, icon, etc.
}

interface FileProcessingOptions {
  imageFile?: Express.Multer.File | null;
  iconFile?: Express.Multer.File | null;
  bannerFile?: Express.Multer.File | null;
}

interface FileProcessingResult {
  image?: string;
  icon?: string;
  bannerImage?: string;
}

// --- Error Handling Decorator ---
function handleServiceErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error: any) {
      if (error instanceof PresentableError) {
        throw error;
      }
      logger.error({ err: error, method: propertyKey, args }, `Unexpected error in CategoryService.${propertyKey}`);
      throw new PresentableError('SERVER_ERROR', 'An unexpected error occurred.');
    }
  };

  return descriptor;
}

class CategoryService {

  // --- Public CRUD Methods ---

  @handleServiceErrors
  public async createCategory(data: CreateCategoryInput, files: FileProcessingOptions): Promise<ICategoryDocument> {
    await this._assertCategoryNameIsUnique(data.name);
    const slug = await this._generateUniqueSlug(data.name);
    const filePaths = await this._processAndCleanupFiles(files);
    if (!filePaths.image) {
      throw new PresentableError('VALIDATION_ERROR', 'Category image is required.');
    }
    const parentId = this._validateAndGetParentId(data.parentId);
    const newCategory = await CategoryModel.create({
      ...data, ...filePaths, slug, parentId, createdAt: new Date(), updatedAt: new Date()
    });
    logger.info({ categoryId: newCategory._id }, 'Category created successfully');
    return newCategory;
  }

  @handleServiceErrors
  public async updateCategory(id: string, data: UpdateCategoryInput, files: FileProcessingOptions, session?: mongoose.ClientSession): Promise<ICategoryDocument> {
    const category = await this.getCategoryById(id, session);

    if (data.name && data.name !== category.name) {
      await this._assertCategoryNameIsUnique(data.name, id);
      category.slug = await this._generateUniqueSlug(data.name, id);
    }

    const newFilePaths = await this._processAndCleanupFiles(files, category);
    Object.assign(category, newFilePaths);
    
    if (data.parentId !== undefined) {
      category.parentId = await this._validateParentCategory(id, data.parentId);
    }
    
    const updatableFields: (keyof UpdateCategoryInput)[] = [
      'name', 'description', 'displayOrder', 'isActive', 'metaTitle', 'metaDescription', 'backgroundColor', 'textColor'
    ];
    
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        (category as any)[field] = data[field];
      }
    });

    category.updatedAt = new Date();
    await category.save({ session });
    logger.info({ categoryId: id }, 'Category updated successfully');
    return category;
  }

  @handleServiceErrors
  public async getCategoryById(id: string, session?: mongoose.ClientSession): Promise<ICategoryDocument> {
    if (!mongoose.isValidObjectId(id)) {
      throw new PresentableError('VALIDATION_ERROR', 'Invalid category ID format.');
    }
    const category = await CategoryModel.findById(id).session(session || null);
    if (!category) {
      throw new PresentableError('NOT_FOUND', 'Category not found.');
    }
    return category;
  }

  @handleServiceErrors
  public async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    const hasSubcategories = await CategoryModel.exists({ parentId: category._id });
    if (hasSubcategories) {
      throw new PresentableError('CONFLICT', 'Cannot delete category with subcategories.');
    }
    // Add product check if needed
    await this._processAndCleanupFiles({}, category); // Deletes all associated images
    await CategoryModel.findByIdAndDelete(id);
    logger.info({ categoryId: id }, 'Category deleted successfully.');
  }

  @handleServiceErrors
  public async listCategories(options: CategoryQueryOptions = {}): Promise<PaginateResult<ICategoryDocument>> {
    const { page = 1, limit = 20, sortBy = 'displayOrder', sortOrder = 'asc', search, isActive, parentId } = options;
    const filter: mongoose.FilterQuery<ICategoryDocument> = {};
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (parentId !== undefined) filter.parentId = this._validateAndGetParentId(parentId);
      
    const paginateOptions: PaginateOptions = { page, limit, sort: { [sortBy]: sortOrder }, lean: true };
    return CategoryModel.paginate(filter, paginateOptions);
  }

  @handleServiceErrors
  public async getCategoryTree(): Promise<CategoryTreeItem[]> {
    type LeanCategory = ICategory & { _id: mongoose.Types.ObjectId };
    const allCategories = await CategoryModel.find({ isActive: true }).sort('displayOrder').lean<LeanCategory[]>();
    type CategoryWithChildren = LeanCategory & { children: CategoryWithChildren[] };
    const categoryMap = new Map<string, CategoryWithChildren>();
    allCategories.forEach(cat => categoryMap.set(cat._id.toString(), { ...cat, children: [] }));
    const rootCategories: CategoryWithChildren[] = [];
    allCategories.forEach(cat => {
      const node = categoryMap.get(cat._id.toString())!;
      if (cat.parentId && categoryMap.has(cat.parentId.toString())) {
        categoryMap.get(cat.parentId.toString())!.children.push(node);
      } else {
        rootCategories.push(node);
      }
    });
    const buildTree = (categories: CategoryWithChildren[]): CategoryTreeItem[] => categories.map(cat => ({
      id: cat._id.toString(), name: cat.name, slug: cat.slug, children: buildTree(cat.children),
    }));
    return buildTree(rootCategories);
  }

  @handleServiceErrors
  public async reorderCategories(categories: { id: string; displayOrder: number }[]): Promise<void> {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      for (const item of categories) {
        // Use the main updateCategory method within the transaction
        await this.updateCategory(item.id, { displayOrder: item.displayOrder }, {}, session);
      }
    });
    await session.endSession();
    logger.info({  count: categories.length }, 'Categories reordered successfully');
  }

  // --- Private Helper Methods ---

  private async _processAndCleanupFiles(files: FileProcessingOptions, existingDoc?: ICategoryDocument): Promise<FileProcessingResult> {
    const processFile = async (file?: Express.Multer.File | null, oldPath?: string, options?: any) => {
      if (file) {
        if (oldPath) await imageUploadService.deleteImage(oldPath).catch(err => logger.warn({ err }, 'Failed to delete old image'));
        return imageUploadService.processCategoryImage(file, options);
      }
      if (existingDoc && Object.keys(files).length === 0) {
        if (oldPath) await imageUploadService.deleteImage(oldPath).catch(err => logger.warn({ err }, 'Failed to delete image on cleanup'));
      }
      return undefined;
    };
    const [image, icon, bannerImage] = await Promise.all([
      processFile(files.imageFile, existingDoc?.image),
      processFile(files.iconFile, existingDoc?.icon, { width: 128, height: 128 }),
      processFile(files.bannerFile, existingDoc?.bannerImage, { width: 1200, height: 300 }),
    ]);
    return { image, icon, bannerImage };
  }

  private async _generateUniqueSlug(name: string, existingId?: string): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true, trim: true });
    const query: mongoose.FilterQuery<ICategoryDocument> = { slug };
    if (existingId) query._id = { $ne: new mongoose.Types.ObjectId(existingId) };
    const existing = await CategoryModel.findOne(query);
    return existing ? `${slug}-${Date.now()}` : slug;
  }

  private async _assertCategoryNameIsUnique(name: string, existingId?: string): Promise<void> {
    const query: mongoose.FilterQuery<ICategoryDocument> = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    if (existingId) query._id = { $ne: new mongoose.Types.ObjectId(existingId) };
    const existingCategory = await CategoryModel.findOne(query);
    if (existingCategory) throw new PresentableError('CONFLICT', 'A category with this name already exists.');
  }

  private _validateAndGetParentId(parentId?: string | null): mongoose.Types.ObjectId | null {
    if (parentId === 'null' || parentId === '' || !parentId) return null;
    if (!mongoose.isValidObjectId(parentId)) throw new PresentableError('VALIDATION_ERROR', 'Invalid parent ID format.');
    return new mongoose.Types.ObjectId(parentId);
  }

  private async _validateParentCategory(categoryId: string, parentId: string | null): Promise<mongoose.Types.ObjectId | null> {
    const validatedParentId = this._validateAndGetParentId(parentId);
    if (!validatedParentId) return null;
    if (validatedParentId.toString() === categoryId) throw new PresentableError('VALIDATION_ERROR', 'Category cannot be its own parent.');
    let current = await CategoryModel.findById(validatedParentId);
    while (current) {
      if (current._id.toString() === categoryId) throw new PresentableError('VALIDATION_ERROR', 'Circular parent-child reference detected.');
      if (!current.parentId) break;
      current = await CategoryModel.findById(current.parentId);
    }
    return validatedParentId;
  }
}

export const categoryService = new CategoryService();