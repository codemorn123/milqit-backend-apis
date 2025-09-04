import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import ProductModel, { ProductDocument } from '../models/ProductModel';
import { CreateProductInput, UpdateProductInput, GetProductsInput } from '../schemas/product.schema';
import { ApiError } from '../utils/errorHandler';
import { logger } from '../config/logger';
import { createSlug } from '../utils/stringUtils';
import { moveUploadedFile } from '../middleware/ProductfileUpload';

const USER_CONTEXT = 'MarotiKathoke';

/**
 * Generates a unique, URL-friendly slug for a product.
 */
const generateUniqueSlug = async (name: string, sku: string): Promise<string> => {
  const baseSlug = createSlug(name) || createSlug(sku);
  let finalSlug = baseSlug;
  let counter = 1;
  while (await ProductModel.exists({ slug: finalSlug })) {
    finalSlug = `${baseSlug}-${counter++}`;
  }
  return finalSlug;
};

export const productService = {
  /**
   * Creates a new product, processes images, and saves to the database.
   */
  async create(input: CreateProductInput, files: Express.Multer.File[]): Promise<ProductDocument> {
    const slug = await generateUniqueSlug(input.name, input.sku);
    const imagePaths = files?.length ? await Promise.all(files.map(file => moveUploadedFile(file.path))) : [];
    
    const product = new ProductModel({ ...input, slug, images: imagePaths, user: USER_CONTEXT });
    // await product.save();

     try {
      await product.save();
      logger.info(`Product created by ${USER_CONTEXT}`);
      return product;
    } catch (error: any) {
      // Check for MongoDB duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        logger.warn(`Duplicate key error for MarotiKathoke`);
        throw ApiError.conflict(
          `A product with this ${field} already exists.`, 
          { field, value }
        );
      }
      // For any other database error, re-throw as an internal server error
      throw ApiError.internal('Failed to create product due to a database error.');
    }
  
    // logger.info(`Product created by ${USER_CONTEXT}`);
    // return product;
  },

  /**
   * Finds and paginates products based on query filters.
   */
  async find(filters: GetProductsInput): Promise<PaginateResult<ProductDocument>> {
    const { page, limit, sortBy, sortOrder, search, ...restFilters } = filters;
    const query: FilterQuery<ProductDocument> = { ...restFilters };
    if (search) query.$text = { $search: search };

    const options: PaginateOptions = { page, limit,  sort: { ['asc']: sortOrder === 'asc' ? 1 : -1 }, lean: true };
    
    return ProductModel.paginate();
  },

  /**
   * Finds a single product by its ID. Throws a 404 error if not found.
   */
  async findById(id: string): Promise<ProductDocument> {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw ApiError.notFound('Product not found');
    return product as ProductDocument;
  },

  /**
   * Finds a product by ID and updates it with new data.
   */
  async update(id: string, data: UpdateProductInput): Promise<ProductDocument> {
    const product = await ProductModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!product) throw ApiError.notFound('Product not found for update');
    logger.info(`Product updated by ${USER_CONTEXT}`);
    return product as ProductDocument;
  },

  /**
   * Finds a product by ID and deletes it.
   */
  async remove(id: string): Promise<void> {
    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) throw ApiError.notFound('Product not found for deletion');
    logger.info(`Product deleted by ${USER_CONTEXT}`);
  },
};