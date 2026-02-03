import mongoose, { FilterQuery } from 'mongoose';
import slugify from 'slugify';
import APIError from '../error/api-error';
import ProductModel, { ProductDocument } from '../models/product.model';
import {
  CreateProductPayload,
  ProductAvailabilityResponse,
  ProductFilterQueryParams,
  ProductStatsResponse,
  UpdateProductPayload
} from '../types/product.types';
import cloudinaryImageService from './cloudinary-image.service';
import logger from './logger';
import { BaseService } from './base.service';
import { PaginatedResponse } from '../types/pagination.types';
import { QueryBuilder } from '../utils/query-builder';

class ProductService extends BaseService<ProductDocument, CreateProductPayload, UpdateProductPayload> {
  private readonly SEARCH_FIELDS = ['name', 'brand', 'slug'];
  private readonly CLOUDINARY_FOLDER = 'products';

  constructor() {
    super(ProductModel, ['name', 'brand', 'slug']);
  }

  /**
   * Get all products with advanced filtering and pagination
   * Overrides BaseService.getAll to implement custom filtering logic
   */
  public async getAll(
    query: ProductFilterQueryParams = {},
    filter: FilterQuery<ProductDocument> = {} // Additional internal filters
  ): Promise<PaginatedResponse<ProductDocument>> {
    const builder = new QueryBuilder(ProductModel, query);

    // Map legacy/alias params to builder params
    if (!query.search && query.q) builder.queryParams.search = query.q;
    if (!query.category && query.categoryId) builder.queryParams.category = query.categoryId;

    // Filter fields to ignore in direct match (handled below or by standard logic)
    const ignoredFields = [
      'minPrice',
      'maxPrice',
      'category',
      'q',
      'categoryId',
      'inStock',
      'isActive',
      'sortBy'
    ];

    builder.filter(this.SEARCH_FIELDS, ignoredFields);

    // --- Custom Filters ---

    // Category Filter
    if (builder.queryParams.category) {
      builder.addFilter({ category: builder.queryParams.category });
    }

    // Price Range Filter
    const { minPrice, maxPrice } = query;
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: FilterQuery<ProductDocument>['sellingPrice'] = {};
      if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
      if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);
      builder.addFilter({ sellingPrice: priceFilter });
    }

    // Stock & Status Filters
    if (query.inStock) {
      builder.addFilter({ inStock: true });
    }

    if (query.isActive !== undefined) {
      builder.addFilter({ isActive: query.isActive });
    }

    // Merge internal forced filters
    if (Object.keys(filter).length > 0) {
      builder.addFilter(filter);
    }

    // Sorting
    if (query.sortBy) {
      const sortMap: Record<string, string> = {
        'price': 'sellingPrice',
        'rating': 'averageRating',
        'newest': 'createdAt'
      };
      if (sortMap[query.sortBy]) {
        (builder.queryParams as any).sortBy = sortMap[query.sortBy];
      }
    }

    // Execute with population
    return builder.exec([{ path: 'category', select: 'name slug' }]) as Promise<PaginatedResponse<ProductDocument>>;
  }

  /**
   * Create a new product with image upload and slug generation
   */
  public async create(
    payload: CreateProductPayload,
    images?: Express.Multer.File[]
  ): Promise<ProductDocument> {
    if (!images?.length) {
      throw new APIError('At least one product image is required.', 400);
    }

    logger.info(`Creating product: ${payload.name}`);

    // Upload images
    const productImages = await cloudinaryImageService.uploadMultiple(
      images,
      this.CLOUDINARY_FOLDER,
      { maxFiles: 10, required: true }
    );

    // Generate unique slug
    const slug = await this.generateUniqueSlug(payload.name, payload.sku);

    // Ensure quantity/stock consistency
    const quantity = payload.quantity ?? payload.stock ?? 0;

    const productData: Partial<ProductDocument> = {
      ...payload,
      category: new mongoose.Types.ObjectId(payload.category),
      slug,
      images: productImages,
      // inStock is handled by pre-save hook based on quantity, but we set it here for completeness
      inStock: quantity > 0,
      quantity: quantity,
      stock: quantity
    };

    return super.create(productData as any);
  }

  /**
   * Update product with image handling and slug regeneration
   */
  public async update(
    id: string,
    data: UpdateProductPayload | Partial<ProductDocument>,
    files?: Express.Multer.File[]
  ): Promise<ProductDocument> {
    const existingProduct = await this.getOne(id);

    // Handle Images
    if (files && files.length > 0) {
      const currentImages = existingProduct.images || [];
      const updatedImages = await cloudinaryImageService.addToExisting(
        currentImages,
        files,
        this.CLOUDINARY_FOLDER
      );
      data.images = updatedImages;
    }

    // Handle Slug Update if name changes
    if (data.name && data.name !== existingProduct.name) {
      const slug = await this.generateUniqueSlug(data.name, data.sku);
      // Explicitly set slug as findByIdAndUpdate bypasses pre-save hooks usually
      (data as any).slug = slug;
    }

    // Mark as updated
    (data as any).updatedAt = new Date();

    const updated = await super.update(id, data as any);

    logger.info(`Product updated: ${id}`);
    return updated;
  }

  /**
   * Delete product and its images
   */
  public async delete(id: string): Promise<{ message: string; status: number }> {
    const product = await this.getOne(id);

    // Delete images from cloud storage
    if (product.images?.length) {
      await cloudinaryImageService.deleteMultiple(product.images);
    }

    logger.info(`Product deleted: ${id}`);
    return super.delete(id);
  }

  // --- Specialized Finder Methods ---

  /**
   * Find products for customer view (Active only)
   */
  public async findForUsers(filters: ProductFilterQueryParams): Promise<PaginatedResponse<ProductDocument>> {
    return this.getAll(filters, { isActive: true });
  }

  /**
   * Search products for users 
   */
  public async searchForUsers(filters: ProductFilterQueryParams): Promise<PaginatedResponse<ProductDocument>> {
    return this.getAll(filters, { isActive: true });
  }

  /**
   * Find single product by ID for users
   */
  public async findByIdForUsers(id: string): Promise<ProductDocument | null> {
    return this.findOne({ _id: id, isActive: true });
  }

  /**
   * Find product by slug for users
   */
  public async getProductBySlug(slug: string, isPublic: boolean = true): Promise<ProductDocument | null> {
    const filter: FilterQuery<ProductDocument> = { slug };
    if (isPublic) {
      filter.isActive = true;
    }
    return ProductModel.findOne(filter).populate('category', 'name slug').lean<ProductDocument>();
  }

  /**
   * Get products by category for users
   */
  public async getProductsByCategory(
    categoryId: string,
    filters: ProductFilterQueryParams = {},
    isPublic: boolean = true
  ): Promise<PaginatedResponse<ProductDocument>> {
    const query: ProductFilterQueryParams = { ...filters, categoryId };
    const internalFilter: FilterQuery<ProductDocument> = {};

    if (isPublic) {
      internalFilter.isActive = true;
    }

    return this.getAll(query, internalFilter);
  }

  // --- Business Logic Methods ---

  public async getFeaturedProducts(limit: number = 10): Promise<ProductDocument[]> {
    return ProductModel.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  public async getRelatedProducts(productId: string, limit: number = 5): Promise<ProductDocument[]> {
    const product = await this.getOne(productId);

    return ProductModel.find({
      _id: { $ne: productId },
      isActive: true,
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  public async checkProductAvailability(productId: string): Promise<ProductAvailabilityResponse | null> {
    const product = await this.findOne({ _id: productId });
    if (!product) return null;

    return {
      _id: product._id.toString(),
      name: product.name,
      isAvailable: product.quantity > 0 && product.isActive,
      quantity: product.quantity,
      unit: product.unit
    };
  }

  public async getProductStats(): Promise<ProductStatsResponse> {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts
    ] = await Promise.all([
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ isActive: true }),
      ProductModel.countDocuments({ isFeatured: true, isActive: true }),
      ProductModel.countDocuments({ quantity: 0, isActive: true }),
      ProductModel.countDocuments({ quantity: { $gt: 0, $lte: 10 }, isActive: true })
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts
    };
  }

  // --- Private Helper Methods ---

  /**
   * Generate a unique slug for a product
   */
  private async generateUniqueSlug(name: string, sku?: string): Promise<string> {
    let slug = slugify(name, { lower: true, strict: true, trim: true });

    // Check if slug exists
    if (await ProductModel.exists({ slug })) {
      const suffix = sku || Date.now().toString();
      slug = `${slug}-${suffix}`;
    }

    return slug;
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;