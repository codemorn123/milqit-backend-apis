import mongoose from 'mongoose';
import { logger } from '../config/logger';
import { ProductModel, ProductDocument, IProduct } from '../models/product.model';
import APIError from '../error/api-error';
import { createSlug } from '../utils/stringUtils';
import { IcommonImage, IProductFilter } from './../types/common.types';
import { CreateProductPayload, ProductFilterQueryParams } from './../types/product.types';
import customFileService from './custom-file.service';
import { PRODUCT_MAIN_IMAGES_PATH } from './../constants/file-paths';
import { PaginatedResponse } from '../types/common.types';
import { CategoryModel } from '../models/category.model';
import slugify from 'slugify';

// export type CreateProductPayload = Omit<IProduct, 'slug' | 'images' | '_id' | 'createdAt' | 'updatedAt' | 'inStock'>;

class ProductService {
  private readonly USER_CONTEXT = 'MarotiKathoke';




  private async generateUniqueSlug(name: string, sku?: string): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let counter = 1;
    // Ensure slug is unique
    while (await ProductModel.exists({ slug })) {
      slug = `${baseSlug}-${sku || counter++}`;
    }
    return slug;
  }





  public async listOfProducts(options: IProductFilter): Promise<PaginatedResponse<IProduct>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const search = options.search;

    const filter: mongoose.FilterQuery<IProduct> = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
    }

    const totalDocs = await ProductModel.countDocuments(filter);
    const docs = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IProduct[]>()
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


  public async createProduct(
    payload: CreateProductPayload,
    images?: Express.Multer.File[]
  ): Promise<IProduct> {
    try {
      console.log('🆕 Creating new product:', payload.name);
      if (!images?.length) {
        throw new APIError('At least one product image is required.', 400);
      }

      // Save multiple images with validation
      const savedImages = await customFileService.saveMultipleFilesWithValidation(
        images,
        PRODUCT_MAIN_IMAGES_PATH,
        {
          maxFiles: 10,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
          requiredFiles: 1
        }
      );

      // Convert to IcommonImage format
      const productImages: IcommonImage[] = savedImages.map(img => ({
        url: img.url,
        key: img.key
      }));

      // Generate unique slug
      const slug = await this.generateUniqueSlug(payload.name, payload.sku || '');

      // Prepare product data
      const productData = {
        ...payload,
        slug,
        images: productImages,
        inStock: payload.stock
      };

      const product = new ProductModel(productData);
      await product.save();

      console.log('✅ Product created successfully:', product.name);

      // Convert Mongoose document to plain object and ensure images array exists
      const productObject = product.toObject();

      // Type assertion with runtime safety check
      const result: IProduct = {
        ...productObject,
        _id: productObject._id,
        images: productObject.images || [], // Ensure images is always an array
        category: productObject.category,
        createdAt: productObject.createdAt,
        updatedAt: productObject.updatedAt
      };

      return result;


    } catch (error: unknown) {
      console.error('❌ Error creating product:', error);
      throw new APIError(`Product creation failed: ${error}`, 500);
    }
  }

  /**
   * Find products with pagination and filtering (Admin)
   */
  /**
   * Find products with pagination and filtering (Admin & User)
   */
  public async find(filters: IProductFilter): Promise<PaginatedResponse<IProduct>> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const search = filters.search;

    const query: mongoose.FilterQuery<IProduct> = {};

    // Search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { slug: searchRegex },
        { brand: searchRegex },
        { 'category.name': searchRegex } // Assuming population, but for simple query this might not work without aggregate. Keeping simple for now.
      ];
    }

    // Filters
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.category) {
      query.categoryId = filters.category;
    }

    if (filters.brand) {
      query.brand = filters.brand;
    }

    if (filters.unit) {
      query.unit = filters.unit;
    }

    // Price Range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.sellingPrice = {};
      if (filters.minPrice !== undefined) query.sellingPrice.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.sellingPrice.$lte = Number(filters.maxPrice);
    }

    // Sorting
    let sort: any = { createdAt: -1 }; // Default sort
    if (filters.sortBy) {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'price':
          sort = { sellingPrice: order };
          break;
        case 'name':
          sort = { name: order };
          break;
        case 'rating':
          sort = { averageRating: order };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'discount':
          // Note: Sorting by virtual fields (discount) requires aggregation, 
          // but for simple find we can't easily sort by virtuals. 
          // We'll stick to stored fields for now.
          // If discount is needed, we might need to store it or use aggregate.
          // For now, fallback to createdAt.
          sort = { createdAt: -1 };
          break;
        default:
          sort = { [filters.sortBy]: order };
      }
    }

    const totalDocs = await ProductModel.countDocuments(query);
    const docs = await ProductModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('categoryId', 'name slug') // Populate category
      .lean<IProduct[]>()
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

  /**
   * Find products for users (only active and public)
   */
  public async findForUsers(filters: ProductFilterQueryParams): Promise<PaginatedResponse<IProduct>> {
    try {
      console.log('👥 Fetching products for users with filters:', filters);

      // Force user-specific filters
      const userFilters: ProductFilterQueryParams = {
        ...filters,
        isActive: true,
        // isPublic: true
      };

      return await this.find(userFilters);

    } catch (error: any) {
      console.error('❌ Error fetching products for users:', error);
      throw error;
    }
  }

  /**
   * Search products for users with enhanced relevance
   */
  public async searchForUsers(filters: ProductFilterQueryParams): Promise<PaginatedResponse<IProduct>> {
    try {
      console.log('🔍 Searching products for users:', filters.search);
      const searchFilters: ProductFilterQueryParams = {
        ...filters,
        isActive: true,
        // isPublic: true,
        // sortBy: filters.sortBy || 'relevance'
      };

      return await this.find(searchFilters);
    } catch (error: any) {
      console.error('❌ Error searching products for users:', error);
      throw error;
    }
  }

  /**
   * Find product by ID
   */
  public async findById(id: string): Promise<ProductDocument> {
    try {
      console.log(`🔍 Fetching product with ID: ${id}`);

      if (!mongoose.isValidObjectId(id)) {
        throw new APIError('Invalid product ID format', 400);
      }

      const product = await ProductModel.findById(id)
        .populate('categoryId', 'name slug')
        .lean()
        .exec();

      if (!product) {
        console.log(`⚠️ Product with ID ${id} not found`);
        throw new APIError('Product not found', 404);
      }

      console.log(`✅ Found product: ${product.name}`);
      return product as ProductDocument;

    } catch (error: any) {
      console.error(`❌ Error fetching product ${id}:`, error);

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(`Error fetching product: ${error.message}`, 500);
    }
  }

  /**
   * Find product by ID for users (only active and public)
   */
  public async findByIdForUsers(id: string): Promise<ProductDocument | null> {
    try {
      console.log(`👥 User fetching product with ID: ${id}`);
      if (!mongoose.isValidObjectId(id)) {
        throw new APIError('Invalid product ID format', 400);
      }
      const product = await ProductModel.findOne({
        _id: id,
        // isActive: true,
        // isPublic: true
      })
        .populate('category', 'name slug')
        .lean()
        .exec();

      if (product) {
        console.log(`✅ User found product: ${product.name}`);
      } else {
        console.log(`⚠️ Product with ID ${id} not found or not available for users`);
      }

      return product as ProductDocument;

    } catch (error: any) {
      console.error(`❌ Error fetching product ${id} for users:`, error);
      throw error;
    }
  }

  /**
   * Find product by slug for users
   */
  public async getProductBySlug(slug: string, isPublic: boolean = true): Promise<ProductDocument | null> {
    try {
      console.log(`👥 User fetching product with slug: ${slug}`);
      const query: any = { slug };
      if (isPublic) {
        query.isActive = true;
        // query.isPublic = true;
      }

      const product = await ProductModel.findOne(query)
        .populate('categoryId', 'name slug')
        .lean()
        .exec();

      if (product) {
        console.log(`✅ User found product: ${product.name}`);
      } else {
        console.log(`⚠️ Product with slug ${slug} not found`);
      }

      return product as ProductDocument;
    } catch (error: any) {
      console.error(`❌ Error fetching product by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Update product by ID
   */
  public async update(
    id: string,
    updateData: IProduct,
    files: Express.Multer.File[] = []
  ): Promise<ProductDocument> {
    try {
      console.log(`🔄 Updating product ${id}`);

      if (!mongoose.isValidObjectId(id)) {
        throw new APIError('Invalid product ID format', 400);
      }

      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        throw new APIError('Product not found', 404);
      }

      // Process new images if provideds);

      // Prepare update data
      const updateWithMetadata = {
        ...updateData,
        updatedBy: this.USER_CONTEXT,
        updatedAt: new Date()
      };

      // Add new images to existing ones if provided


      // Update slug if name changed
      if (updateData.name && updateData.name !== existingProduct.name) {
        updateWithMetadata.slug = await this.generateUniqueSlug(
          updateData.name,
          updateData.sku || existingProduct.sku
        );
      }
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updateWithMetadata },
        { new: true, runValidators: true }
      )
        .exec();

      // const updatedProduct = await ProductModel.findByIdAndUpdate(
      //   id,
      //   { $set: updateWithMetadata },
      //   { new: true, runValidators: true }
      // )
      //   .populate('categoryId', 'name slug')
      //   .lean()
      //   .exec();

      if (!updatedProduct) {
        throw new APIError('Product not found for update', 404);
      }

      logger.info({ productId: id }, `Product updated by ${this.USER_CONTEXT}`);
      console.log(`✅ Product ${id} updated successfully`);

      return updatedProduct as ProductDocument;

    } catch (error: any) {
      console.error(`❌ Error updating product ${id}:`, error);

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

      throw new APIError(`Product update failed: ${error.message}`, 500);
    }
  }

  /**
   * Delete product by ID
   */
  public async remove(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting product ${id}`);
      if (!mongoose.isValidObjectId(id)) {
        throw new APIError('Invalid product ID format', 400);
      }
      const result = await ProductModel.findByIdAndDelete(id);

      if (!result) {
        throw new APIError('Product not found for deletion', 404);
      }

      logger.info({ productId: id }, `Product deleted by ${this.USER_CONTEXT}`);
      console.log(`✅ Product ${id} deleted successfully`);

    } catch (error: any) {
      console.error(`❌ Error deleting product ${id}:`, error);

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(`Product deletion failed: ${error.message}`, 500);
    }
  }

  /**
   * Get featured products
   */
  public async getFeaturedProducts(limit: number = 10): Promise<ProductDocument[]> {
    try {
      console.log(`⭐ Fetching ${limit} featured products`);

      const products = await ProductModel.find({
        isActive: true,
        isPublic: true,
        isFeatured: true
      })
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();

      console.log(`✅ Retrieved ${products.length} featured products`);
      return products as ProductDocument[];

    } catch (error: any) {
      console.error('❌ Error fetching featured products:', error);
      throw new APIError(`Error fetching featured products: ${error.message}`, 500);
    }
  }

  /**
   * Get related products based on category and tags
   */
  public async getRelatedProducts(productId: string, limit: number = 5): Promise<ProductDocument[]> {
    try {
      console.log(`🔗 Fetching related products for: ${productId}`);

      const product = await this.findById(productId);

      const relatedProducts = await ProductModel.find({
        _id: { $ne: productId },
        isActive: true,
        isPublic: true,
        $or: [
          { categoryId: product.category },
          { brand: product.brand }
        ]
      })
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec();

      console.log(`✅ Found ${relatedProducts.length} related products`);
      return relatedProducts as ProductDocument[];

    } catch (error: any) {
      console.error(`❌ Error fetching related products for ${productId}:`, error);
      throw new APIError(`Error fetching related products: ${error.message}`, 500);
    }
  }

  /**
   * Check product availability
   */
  public async checkProductAvailability(productId: string): Promise<{
    id: string;
    name: string;
    isAvailable: boolean;
    quantity: number;
    unit: string;
    estimatedDelivery?: string;
  } | null> {
    try {
      console.log(`📦 Checking availability for product: ${productId}`);
      const product = await this.findByIdForUsers(productId);
      if (!product) {
        return null;
      }

      const isAvailable = product.quantity > 0 && product.isActive
      return {
        id: product.id.toString(),
        name: product.name,
        isAvailable,
        quantity: product.quantity,
        unit: product.unit,
        // estimatedDelivery: product.estimatedDelivery
      };

    } catch (error: any) {
      console.error(`❌ Error checking availability for ${productId}:`, error);
      throw new APIError(`Error checking product availability: ${error.message}`, 500);
    }
  }

  /**
   * Get product statistics
   */
  public async getProductStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    featuredProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
  }> {
    try {
      console.log('📊 Fetching product statistics');

      const [
        totalProducts,
        activeProducts,
        featuredProducts,
        outOfStockProducts,
        lowStockProducts
      ] = await Promise.all([
        ProductModel.countDocuments().exec(),
        ProductModel.countDocuments({ isActive: true }).exec(),
        ProductModel.countDocuments({ isFeatured: true, isActive: true }).exec(),
        ProductModel.countDocuments({ quantity: 0, isActive: true }).exec(),
        ProductModel.countDocuments({ quantity: { $gt: 0, $lte: 10 }, isActive: true }).exec()
      ]);

      const inactiveProducts = totalProducts - activeProducts;

      const stats = {
        totalProducts,
        activeProducts,
        inactiveProducts,
        featuredProducts,
        outOfStockProducts,
        lowStockProducts
      };
      logger.info(stats, 'Product statistics fetched');

      return stats;

    } catch (error: any) {
      console.error('❌ Error fetching product statistics:', error);
      throw new APIError(`Error fetching product statistics: ${error.message}`, 500);
    }
  }

  public async getProductsByCategory(categoryId: string, filters: ProductFilterQueryParams, isPublic: boolean): Promise<PaginatedResponse<IProduct>> {
    try {

      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 10;
      const search = filters.search;

      const filter: mongoose.FilterQuery<IProduct> = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
      }


      console.log(`🔍 Fetching products by category: ${categoryId}`);

      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        console.log(`⚠️ Category with ID ${categoryId} not found`);
        throw new APIError('Category not found', 404);
      }

      const products = await ProductModel.find({
        categoryId,
        ...filters,
        isActive: true,
        isPublic
      })
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        // .limit(filters.limit)
        // .skip((filters.page - 1) * filters.limit)
        .lean()
        .exec();

      const total = await ProductModel.countDocuments({
        categoryId,
        ...filters,
        isActive: true,
        isPublic
      }).exec();

      return {
        docs: products,
        totalDocs: total,
        limit: limit,
        page: page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
      };

    } catch (error: any) {
      console.error(`❌ Error fetching products by category ${categoryId}:`, error);
      throw new APIError(`Error fetching products by category: ${error.message}`, 500);
    }
  }

}

// Export singleton instance
export const productService = new ProductService();
export default productService;