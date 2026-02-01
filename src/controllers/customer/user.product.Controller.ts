import {
  Get, Path, Route, Tags, Queries, Response, Middlewares
} from 'tsoa';
import { productService } from '../../services/product.service';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
import { IProduct } from '../../models/product.model';
import { ProductFilterQueryParams } from '../../types/product.types';
import APIError from '../../error/api-error';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { validateZodSchemaMiddleware } from '../../middleware/zod-validate';
import { productQuerySchema } from '../../validations/product.validation';
import { idParamSchema, categoryIdParamSchema } from '../../constants/common.validator';
import { StatusCodes } from 'http-status-codes';



interface CustomerProductResponse extends Omit<IProduct, 'createdBy' | 'updatedBy'> {
  discountPercentage: number;
  savings: number;
  hasDiscount: boolean;
}

interface ProductFilters extends ProductFilterQueryParams {
  // Customer-specific filters only
}

interface SearchProductFilters extends ProductFilters {
  q: string;
}

interface SaleProductFilters extends ProductFilters {
  minDiscount?: number;
}

interface PriceRangeFilters extends ProductFilters {
  minPrice: number;
  maxPrice: number;
}

import { BaseController } from '../base.controller';

@Tags('CUSTOMER: Products')
@Route('customer/products')
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "Bad Request")
@Response<ErrorResponse>(StatusCodes.NOT_FOUND, "Not Found")
@Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error")
export class CustomerProductController extends BaseController {

  /**
   * Get all available products for customers
   * Only returns active and in-stock products
   * @summary Get Products for Customers
   */
  @Get('/')
  @Middlewares(validateZodSchemaMiddleware(productQuerySchema, "query"))
  @Response(StatusCodes.OK, "Success")
  public async getProducts(
    @Queries() filters: ProductFilters
  ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    try {
      // Force customer-specific filters to ensure only appropriate products are shown
      const customerFilters: ProductFilterQueryParams = {
        ...filters,
        isActive: true,
        inStock: true
      };

      const paginatedResult = await productService.findForUsers(customerFilters);

      // Transform response to include discount calculations and hide sensitive fields
      const transformedDocs = paginatedResult.docs.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      const result = {
        ...paginatedResult,
        docs: transformedDocs
      };

      return this.sendPaginated(result, 'Products fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching products: ${error.message}`, 500);
    }
  }

  /**
   * Get a product by slug for customers
   * @summary Get Product by Slug
   */
  @Get('slug/{slug}')
  @Response(StatusCodes.OK, "Success")
  public async getProductBySlug(
    @Path() slug: string
  ): Promise<SuccessResponse<CustomerProductResponse | null>> {
    try {
      const product = await productService.getProductBySlug(slug, true);

      if (!product) {
        return this.sendSuccess(null, 'Product not found or unavailable.');
      }

      const discountPercentage = product.mrp > 0
        ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
        : 0;

      const customerProduct: CustomerProductResponse = {
        ...product,
        discountPercentage,
        savings: product.mrp - product.sellingPrice,
        hasDiscount: product.sellingPrice < product.mrp
      } as CustomerProductResponse;

      return this.sendSuccess(customerProduct, 'Product details fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching product: ${error.message}`, 500);
    }
  }

  /**
   * Search products for customers
   * @summary Search Products
   */
  @Get('search')
  @Middlewares(validateZodSchemaMiddleware(productQuerySchema, "query"))
  @Response(StatusCodes.OK, "Success")
  public async searchProducts(
    @Queries() params: SearchProductFilters
  ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    try {
      const { q: searchQuery, ...filters } = params;

      if (!searchQuery || searchQuery.trim().length === 0) {
        throw new APIError('Search query is required', 400);
      }

      const results = await productService.searchForUsers({ ...filters, search: searchQuery });

      // Transform response to include discount calculations
      const transformedDocs = results.docs.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      const result = {
        ...results,
        docs: transformedDocs
      };

      return this.sendPaginated(result, 'Product search completed successfully.');
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Error searching products: ${error.message}`, 500);
    }
  }

  /**
   * Get featured products for customers
   * @summary Get Featured Products
   */
  @Get('featured')
  @Response(StatusCodes.OK, "Success")
  public async getFeaturedProducts(
    @Queries() params: { limit?: number }
  ): Promise<SuccessResponse<IProduct[]>> {
    try {
      const limit = Math.min(params.limit || 10, 50); // Cap at 50 for performance
      const products = await productService.getFeaturedProducts(limit);

      const transformedProducts = products.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      return this.sendSuccess(transformedProducts, 'Featured products fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching featured products: ${error.message}`, 500);
    }
  }

  /**
   * Get products by category for customers
   * @summary Get Products by Category
   */
  @Get('category/{categoryId}')
  @Middlewares([
    validateSchemaMiddleware(categoryIdParamSchema, "params"),
    validateZodSchemaMiddleware(productQuerySchema, "query")
  ])
  @Response(StatusCodes.OK, "Success")
  public async getProductsByCategory(
    @Path() categoryId: string,
    @Queries() filters: ProductFilters
  ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    try {
      const results = await productService.getProductsByCategory(categoryId, filters, true);

      const transformedDocs = results.docs.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      const result = {
        ...results,
        docs: transformedDocs
      };

      return this.sendPaginated(result, 'Products fetched by category successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching products by category: ${error.message}`, 500);
    }
  }

  /**
   * Get products with discounts (sale items)
   * @summary Get Sale Products
   */
  @Get('sale')
  @Middlewares(validateZodSchemaMiddleware(productQuerySchema, "query"))
  @Response(StatusCodes.OK, "Success")
  public async getSaleProducts(
    @Queries() filters: SaleProductFilters
  ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    try {
      const minDiscount = filters.minDiscount || 5; // At least 5% discount
      const { minDiscount: _, ...otherFilters } = filters;

      // Get products and filter by discount on the frontend
      // You could also add this logic to your service layer
      const results = await productService.findForUsers({
        ...otherFilters,
        sortBy: 'price',
        sortOrder: 'desc'
      });

      const saleProducts = results.docs.filter(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;
        return discountPercentage >= minDiscount;
      });

      const transformedDocs = saleProducts.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      const result = {
        ...results,
        docs: transformedDocs,
        totalDocs: transformedDocs.length
      };

      return this.sendPaginated(result, 'Sale products fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching sale products: ${error.message}`, 500);
    }
  }

  /**
   * Get new arrivals (recently added products)
   * @summary Get New Arrivals
   */
  @Get('new-arrivals')
  @Response(StatusCodes.OK, "Success")
  public async getNewArrivals(
    @Queries() params: { limit?: number; days?: number }
  ): Promise<SuccessResponse<CustomerProductResponse[]>> {
    try {
      const limit = Math.min(params.limit || 20, 50);
      const days = params.days || 30; // Products added in last 30 days

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const results = await productService.findForUsers({
        sortBy: 'price',
        sortOrder: 'desc',
        limit,
        page: 1
      });

      // Filter products created within the specified days
      const newProducts = results.docs.filter(product =>
        new Date(product.createdAt ?? new Date()) >= cutoffDate
      );

      const transformedProducts = newProducts.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      return this.sendSuccess(transformedProducts, 'New arrivals fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching new arrivals: ${error.message}`, 500);
    }
  }

  /**
   * Get products by price range
   * @summary Get Products by Price Range
   */
  @Get('price-range')
  @Middlewares(validateZodSchemaMiddleware(productQuerySchema, "query"))
  @Response(StatusCodes.OK, "Success")
  public async getProductsByPriceRange(
    @Queries() params: PriceRangeFilters
  ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    try {
      if (!params.minPrice || !params.maxPrice) {
        throw new APIError('Both minPrice and maxPrice are required', 400);
      }

      if (params.minPrice < 0 || params.maxPrice < 0) {
        throw new APIError('Price values cannot be negative', 400);
      }

      if (params.minPrice > params.maxPrice) {
        throw new APIError('Minimum price cannot be greater than maximum price', 400);
      }

      const { minPrice, maxPrice, ...filters } = params;

      const results = await productService.findForUsers({
        ...filters,
        minPrice,
        maxPrice,
        sortBy: 'price',
        sortOrder: 'asc'
      });

      const transformedDocs = results.docs.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      const result = {
        ...results,
        docs: transformedDocs
      };

      return this.sendPaginated(result, 'Products fetched by price range successfully.');
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Error fetching products by price range: ${error.message}`, 500);
    }
  }

  /**
   * Get related products for a specific product
   * @summary Get Related Products
   */
  @Get('{id}/related')
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  @Response(StatusCodes.OK, "Success")
  public async getRelatedProducts(
    @Path() id: string,
    @Queries() params: { limit?: number }
  ): Promise<SuccessResponse<CustomerProductResponse[]>> {
    try {
      const limit = Math.min(params.limit || 6, 20); // Cap at 20 for performance
      const products = await productService.getRelatedProducts(id, limit);

      const transformedProducts = products.map(product => {
        const discountPercentage = product.mrp > 0
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
          : 0;

        return {
          ...product,
          discountPercentage,
          savings: product.mrp - product.sellingPrice,
          hasDiscount: product.sellingPrice < product.mrp
        } as CustomerProductResponse;
      });

      return this.sendSuccess(transformedProducts, 'Related products fetched successfully.');
    } catch (error: any) {
      throw new APIError(`Error fetching related products: ${error.message}`, 500);
    }
  }

  /**
   * Get a single product by ID for customers
   * @summary Get Product Details
   */
  @Get('{id}')
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  @Response(StatusCodes.OK, "Success")
  public async getProductById(
    @Path() id: string
  ): Promise<SuccessResponse<IProduct | null>> {
    try {
      const product = await productService.findByIdForUsers(id);

      if (!product) {
        return this.sendSuccess(null, 'Product not found or unavailable.');
      }

      return this.sendSuccess(product, 'Product details fetched successfully.');
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Error fetching product: ${error.message}`, 500);
    }
  }
}