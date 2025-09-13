import mongoose from 'mongoose';
import { logger } from '../config/logger';
import ProductModel, { ProductDocument, IProduct } from '../models/ProductModel';
import APIError from '../error/api-error';
import { createSlug } from '../utils/stringUtils';
import { PaginatedResponse } from './../types/common.types';
import { ProductFilterQueryParams } from  './../types/product.types';


/**
 * Product Service
 * Handles all product-related business logic and database operations
 * @author MarotiKathoke
 * @created 2025-09-13 08:23:07
 */
class ProductService {
  private readonly USER_CONTEXT = 'MarotiKathoke';

  private async generateUniqueSlug(name: string, sku: string): Promise<string> {
    try {
      console.log(`🔗 Generating unique slug for: ${name}`);
      const baseSlug = createSlug(name) || createSlug(sku) || 'product';
      let finalSlug = baseSlug;
      let counter = 1;
      
      while (await ProductModel.exists({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }
      
      console.log(`✅ Generated unique slug: ${finalSlug}`);
      return finalSlug;
      
    } catch (error: any) {
      console.error('❌ Error generating slug:', error);
      throw new APIError(`Error generating slug: ${error.message}`, 500);
    }
  }

  /**
   * Process uploaded product images
   */
  
  /**
   * Create a new product
   */
  public async create(
    productData: IProduct, 
  ): Promise<ProductDocument> {
    try {
      console.log('🆕 Creating new product:', productData.name);
      const product = new ProductModel(productData);
      await product.save();
      
      logger.info({ 
        productId: product._id, 
        name: product.name,
        sku: product.sku 
      }, `Product created by ${this.USER_CONTEXT}`);
      
      console.log(`✅ Product created successfully with ID: ${product._id}`);
      
      return product;
      
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || 'unknown field';
        const value = error.keyValue?.[field];
        
        logger.warn({ field, value }, `Duplicate key error for ${this.USER_CONTEXT}`);
        throw new APIError(`A product with this ${field} already exists: ${value}`, 409);
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
        throw new APIError(`Validation failed: ${validationErrors.join(', ')}`, 400);
      }

      throw new APIError(`Product creation failed: ${error.message}`, 500);
    }
  }

  /**
   * Find products with pagination and filtering (Admin)
   */
  public async find(filters: ProductFilterQueryParams): Promise<PaginatedResponse<IProduct>> {
    try {
      console.log('📋 Fetching products with filters:', filters);
      const { 
        page = 1, 
        limit = 20, 
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;
      const filter: mongoose.FilterQuery<IProduct> = {};
      const skip = (page - 1) * limit;
      // Execute queries in parallel
      const [docs, totalDocs] = await Promise.all([
        ProductModel.find(filter)
          .populate('categoryId', 'name slug')
          // .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        ProductModel.countDocuments(filter).exec()
      ]);


      

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevPage = hasPrevPage ? page - 1 : null;
      const pagingCounter = (page - 1) * limit + 1;
      console.log(`✅ Found ${docs.length} products out of ${totalDocs} total`);
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
      console.error('❌ Error fetching products:', error);
      logger.error({ error: error.message }, 'Error fetching products');
      throw new APIError(`Error fetching products: ${error.message}`, 500);
    }
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
        .populate('categoryId', 'name slug')
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
          { categoryId: product.categoryId },
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

      console.log('✅ Product statistics:', stats);
      logger.info(stats, 'Product statistics fetched');
      
      return stats;
      
    } catch (error: any) {
      console.error('❌ Error fetching product statistics:', error);
      throw new APIError(`Error fetching product statistics: ${error.message}`, 500);
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;