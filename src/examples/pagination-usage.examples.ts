/**
 * PAGINATION USAGE EXAMPLES
 * 
 * This file demonstrates how to use the new mongoose-paginate-v2 generic system
 * across all services with clean, type-safe, reusable code.
 */

import { FilterQuery } from 'mongoose';
import { BaseService } from '../services/base.service';
import { ProductModel, IProduct, ProductDocument } from '../models/product.model';
import { ICategoryDocument } from '../types/category.types';
import { CategoryModel } from '../models/category.model';
import { PaginationQuery, PaginatedResponse } from '../types/pagination.types';

// ============================================================================
// EXAMPLE 1: Basic Service with Auto-Pagination
// ============================================================================

class ProductService extends BaseService<ProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'slug', 'brand']); // Search fields
    }

    /**
     * Get all products with automatic pagination
     * No manual pagination code needed!
     */
    async getAllProducts(query: PaginationQuery): Promise<PaginatedResponse<ProductDocument>> {
        // That's it! BaseService handles everything
        return await this.getAll(query);
    }

    /**
     * Get products with custom filter
     */
    async getActiveProducts(query: PaginationQuery): Promise<PaginatedResponse<ProductDocument>> {
        const filter: FilterQuery<ProductDocument> = {
            isActive: true
        };

        return await this.getAll(query, filter);
    }

    /**
     * Get products by category with pagination
     */
    async getProductsByCategory(
        categoryId: string,
        query: PaginationQuery
    ): Promise<PaginatedResponse<ProductDocument>> {
        const filter: FilterQuery<ProductDocument> = {
            categoryId: categoryId as any
        };

        return await this.getAll(query, filter);
    }

    /**
     * Get featured products with custom options
     */
    async getFeaturedProducts(query: PaginationQuery): Promise<PaginatedResponse<ProductDocument>> {
        const filter: FilterQuery<ProductDocument> = {
            isFeatured: true,
            isActive: true
        };

        // Override default options
        const options = {
            page: parseInt(String(query.page || 1)),
            limit: parseInt(String(query.limit || 10)),
            sort: { createdAt: -1 },
            populate: 'categoryId',
            select: 'name slug price images'
        };

        return await this.getAll(query, filter, options);
    }
}

// ============================================================================
// EXAMPLE 2: Category Service with Pagination
// ============================================================================

class CategoryService extends BaseService<ICategoryDocument> {
    constructor() {
        super(CategoryModel, ['name', 'slug', 'description']);
    }

    /**
     * Get all categories
     */
    async getAllCategories(query: PaginationQuery): Promise<PaginatedResponse<ICategoryDocument>> {
        return await this.getAll(query);
    }

    /**
     * Get active categories only
     */
    async getActiveCategories(query: PaginationQuery): Promise<PaginatedResponse<ICategoryDocument>> {
        const filter: FilterQuery<ICategoryDocument> = {
            isActive: true
        };

        return await this.getAll(query, filter);
    }

    /**
     * Get root categories (no parent)
     */
    async getRootCategories(query: PaginationQuery): Promise<PaginatedResponse<ICategoryDocument>> {
        const filter: FilterQuery<ICategoryDocument> = {
            parentId: null
        };

        return await this.getAll(query, filter);
    }

    /**
     * Get subcategories of a parent
     */
    async getSubcategories(
        parentId: string,
        query: PaginationQuery
    ): Promise<PaginatedResponse<ICategoryDocument>> {
        const filter: FilterQuery<ICategoryDocument> = {
            parentId: parentId as any
        };

        return await this.getAll(query, filter);
    }
}

// ============================================================================
// EXAMPLE 3: Controller Usage
// ============================================================================

/**
 * Example controller showing how to use paginated service
 */
class ExampleController {
    private productService = new ProductService();

    /**
     * GET /api/products
     * Query params: page, limit, search, sort, sortBy, sortOrder
     */
    async getProducts(req: any, res: any) {
        const query: PaginationQuery = {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            populate: req.query.populate,
        };

        const result = await this.productService.getAllProducts(query);

        return res.json({
            success: true,
            data: result
        });
    }

    /**
     * GET /api/products/active
     */
    async getActiveProducts(req: any, res: any) {
        const result = await this.productService.getActiveProducts(req.query);
        return res.json({ success: true, data: result });
    }

    /**
     * GET /api/categories/:categoryId/products
     */
    async getProductsByCategory(req: any, res: any) {
        const { categoryId } = req.params;
        const result = await this.productService.getProductsByCategory(
            categoryId,
            req.query
        );
        return res.json({ success: true, data: result });
    }
}

// ============================================================================
// EXAMPLE 4: Advanced Filtering + Pagination
// ============================================================================

class AdvancedProductService extends BaseService<ProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'slug', 'brand']);
    }

    /**
     * Advanced product search with multiple filters
     */
    async searchProducts(
        query: PaginationQuery & {
            minPrice?: number;
            maxPrice?: number;
            brands?: string[];
            categories?: string[];
            inStock?: boolean;
        }
    ): Promise<PaginatedResponse<ProductDocument>> {
        const filter: FilterQuery<ProductDocument> = {};

        // Price range
        if (query.minPrice || query.maxPrice) {
            filter.sellingPrice = {};
            if (query.minPrice) filter.sellingPrice.$gte = query.minPrice;
            if (query.maxPrice) filter.sellingPrice.$lte = query.maxPrice;
        }

        // Brands
        if (query.brands && query.brands.length > 0) {
            filter.brand = { $in: query.brands };
        }

        // Categories
        if (query.categories && query.categories.length > 0) {
            filter.categoryId = { $in: query.categories as any };
        }

        // Stock status
        if (query.inStock !== undefined) {
            filter.quantity = query.inStock ? { $gt: 0 } : 0;
        }

        // Execute with pagination
        return await this.getAll(query, filter, {
            populate: ['categoryId'],
            sort: { createdAt: -1 }
        });
    }
}

// ============================================================================
// EXAMPLE 5: Response Type
// ============================================================================

/**
 * The paginated response always has this structure
 */
interface ExamplePaginatedResponse {
    docs: any[];                  // The actual data
    totalDocs: number;            // Total number of documents
    limit: number;                // Items per page
    page: number;                 // Current page
    totalPages: number;           // Total pages
    hasNextPage: boolean;         // Has more pages?
    hasPrevPage: boolean;         // Has previous pages?
    nextPage: number | null;      // Next page number
    prevPage: number | null;      // Previous page number
    pagingCounter: number;        // Starting serial number
}

// ============================================================================
// EXAMPLE 6: API Request/Response
// ============================================================================

/**
 * API Request:
 * GET /api/products?page=2&limit=20&search=milk&sortBy=price&sortOrder=asc
 * 
 * Pagination will automatically:
 * - Parse page=2, limit=20
 * - Search for "milk" in name, slug, brand fields
 * - Sort by price ascending
 * - Return paginated results
 * 
 * API Response:
 * {
 *   "success": true,
 *   "data": {
 *     "docs": [...],           // 20 product documents
 *     "totalDocs": 156,
 *     "limit": 20,
 *     "page": 2,
 *     "totalPages": 8,
 *     "hasNextPage": true,
 *     "hasPrevPage": true,
 *     "nextPage": 3,
 *     "prevPage": 1,
 *     "pagingCounter": 21
 *   }
 * }
 */

// ============================================================================
// EXAMPLE 7: Custom Pagination Options
// ============================================================================

class CustomPaginationService extends BaseService<ProductDocument> {
    constructor() {
        super(ProductModel, ['name']);
    }

    /**
     * Get products with custom pagination settings
     */
    async getProductsCustom(query: PaginationQuery) {
        return await this.getAll(query, {}, {
            page: parseInt(String(query.page || 1)),
            limit: parseInt(String(query.limit || 10)),
            sort: { name: 1 },                    // Sort by name A-Z
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'reviews', select: 'rating' }
            ],
            select: 'name slug price images',     // Select specific fields
            lean: true,                            // Return plain objects (faster)
            leanWithId: true                       // Include virtual id field
        });
    }
}

// ============================================================================
// MIGRATION GUIDE: Converting Old Code to New
// ============================================================================

/**
 * BEFORE (Manual Pagination - DON'T DO THIS):
 */
class OldProductService {
    async getProducts(options: any) {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 10;
        const search = options.search;

        const filter: any = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
        }

        const totalDocs = await ProductModel.countDocuments(filter);
        const docs = await ProductModel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
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
}

/**
 * AFTER (Generic Pagination - DO THIS): 
 */
class NewProductService extends BaseService<ProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'slug']); // Search fields
    }

    async getProducts(query: PaginationQuery) {
        return await this.getAll(query); // That's it!
    }
}

/**
 * Result: 
 * - 50+ lines reduced to 3 lines
 * - Type-safe
 * - Reusable
 * - Consistent across all services
 * - Automatically handles edge cases
 */

export { };
