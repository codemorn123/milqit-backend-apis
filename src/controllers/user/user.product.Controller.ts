import {
    Controller,
    Get,
    Path,
    Query,
    Route,
    Tags,
    Response,
    Example,
    SuccessResponse as TSSuccessResponse,
    Queries,
    Middlewares
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../../services/product.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';

import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
import APIError from '../../error/api-error';
import { IProduct } from '../../models/ProductModel';
import { ProductFilterQueryParams } from '../../types/product.types';
import { validateSchemaMiddleware } from'../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';

/**
 * User Product Controller
 * Handles product-related operations for end users (customers)
 * @author MarotiKathoke
 * @created 2025-09-13 08:20:11
 */
@Tags('USER: Products')
@Route('user/products')
@Response<ErrorResponse>(400, "Bad Request")
@Response<ErrorResponse>(404, "Not Found")
@Response<ErrorResponse>(422, "Validation Error")
@Response<ErrorResponse>(500, "Server Error")
export class UserProductController extends Controller {

    /**
     * Get all active products with filtering, search, and pagination
     * @summary Get products for customers - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/')
    @TSSuccessResponse(200, "Products fetched successfully")
    @Example({
        page: 1,
        limit: 20,
        search: "apple",
        categoryId: "507f1f77bcf86cd799439011",
        minPrice: 10,
        maxPrice: 500,
        brand: "Fresh Farm",
        unit: "kg",
        sortBy: "price",
        sortOrder: "asc"
    })
    public async getProducts(
        @Queries() filters: ProductFilterQueryParams
    ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
        try {

            const paginatedResult = await productService.findForUsers(filters);
            console.log(`✅ User: Retrieved ${paginatedResult.docs.length} products out of ${paginatedResult.totalDocs} total`);
            return success(
                paginatedResult,
                'Products fetched successfully'
            );

        } catch (error: any) {
            console.error('❌ User: Error fetching products:', error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error fetching products: ${error.message}`, 500);
        }
    }

    /**
     * Get product details by ID
     * @summary Get single product details - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/{id}')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    @TSSuccessResponse(200, "Product fetched successfully")
    public async getProductById(
        @Path() id: string
    ): Promise<SuccessResponse<IProduct>> {
        try {
            console.log(`🔍 User: Fetching product with ID: ${id}`);

            const product = await productService.findByIdForUsers(id);

            if (!product) {
                console.log(`⚠️ User: Product with ID ${id} not found or not active`);
                this.setStatus(StatusCodes.NOT_FOUND);
                throw new APIError('Product not found', 404);
            }

            console.log(`✅ User: Found product: ${product.name}`);

            this.setStatus(StatusCodes.OK);
            return success(
                product,
                'Product fetched successfully'
            );

        } catch (error: any) {
            console.error(`❌ User: Error fetching product ${id}:`, error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error fetching product: ${error.message}`, 500);
        }
    }

    /**
     * Get products by category
     * @summary Get products filtered by category - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/category/{categoryId}')
    @TSSuccessResponse(200, "Category products fetched successfully")
    @Example({
        page: 1,
        limit: 20,
        sortBy: "price",
        sortOrder: "asc"
    })
    public async getProductsByCategory(
        @Queries() filters: ProductFilterQueryParams,
    ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
        try {
            console.log(`📂 User: Fetching products for category: ${filters.categoryId}`);



            const paginatedResult = await productService.findForUsers(filters);

            console.log(`✅ User: Retrieved ${paginatedResult.docs.length} products for category ${filters.categoryId}`);

            this.setStatus(StatusCodes.OK);
            return success(
                paginatedResult,
                'Category products fetched successfully'
            );

        } catch (error: any) {
            console.error(`❌ User: Error fetching products for category ${filters.categoryId}:`, error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error fetching category products: ${error.message}`, 500);
        }
    }

    /**
     * Search products with advanced filters
     * @summary Advanced product search - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/search')
    @TSSuccessResponse(200, "Search results fetched successfully")
    @Example({
        q: "fresh apple",
        categoryId: "507f1f77bcf86cd799439011",
        minPrice: 50,
        maxPrice: 200,
        brands: "Fresh Farm,Organic Valley",
        page: 1,
        limit: 20
    })
    public async searchProducts(
        @Queries() filters: ProductFilterQueryParams
    ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
        try {
            console.log('🔍 User: Searching products with query:', filters.q);

            if (!filters.q || filters.q.trim().length < 2) {
                this.setStatus(StatusCodes.BAD_REQUEST);
                throw new APIError('Search query must be at least 2 characters long', 400);
            }
            const paginatedResult = await productService.searchForUsers(filters);

            console.log(`✅ User: Found ${paginatedResult.docs.length} products for search: "${filters.q}"`);

            // this.setStatus(StatusCodes.OK);
            return success(
                paginatedResult,
                `Search results for "${filters.q}" fetched successfully`
            );

        } catch (error: any) {
            console.error(`❌ User: Error searching products with query "${filters.q}":`, error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error searching products: ${error.message}`, 500);
        }
    }

    /**
     * Get featured/popular products
     * @summary Get featured products - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/featured')
    @TSSuccessResponse(200, "Featured products fetched successfully")
    public async getFeaturedProducts(
        /** Number of featured products to return */
        @Query() limit?: number
    ): Promise<SuccessResponse<IProduct[]>> {
        try {
            console.log('⭐ User: Fetching featured products');

            const validatedLimit = Math.min(20, Math.max(1, limit || 10)); // Max 20 featured products

            const products = await productService.getFeaturedProducts(validatedLimit);

            console.log(`✅ User: Retrieved ${products.length} featured products`);
            this.setStatus(StatusCodes.OK);
            return success(
                products,
                'Featured products fetched successfully'
            );

        } catch (error: any) {
            console.error('❌ User: Error fetching featured products:', error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error fetching featured products: ${error.message}`, 500);
        }
    }

    /**
     * Get related products based on product ID
     * @summary Get related products - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/{id}/related')
    @TSSuccessResponse(200, "Related products fetched successfully")
    public async getRelatedProducts(
        @Path() id: string,
        /** Number of related products to return */
        @Query() limit?: number
    ): Promise<SuccessResponse<IProduct[]>> {
        try {
            console.log(`🔗 User: Fetching related products for: ${id}`);


            const validatedLimit = Math.min(10, Math.max(1, limit || 5)); // Max 10 related products

            const relatedProducts = await productService.getRelatedProducts(id, validatedLimit);

            console.log(`✅ User: Retrieved ${relatedProducts.length} related products for ${id}`);

            this.setStatus(StatusCodes.OK);
            return success(
                relatedProducts,
                'Related products fetched successfully'
            );

        } catch (error: any) {
            console.error(`❌ User: Error fetching related products for ${id}:`, error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error fetching related products: ${error.message}`, 500);
        }
    }

    /**
     * Get product availability status
     * @summary Check product availability - authored by MarotiKathoke at 2025-09-13 08:20:11
     */
    @Get('/{id}/availability')
    @TSSuccessResponse(200, "Product availability fetched successfully")
    public async getProductAvailability(
        @Path() id: string
    ): Promise<SuccessResponse<{
        id: string;
        name: string;
        isAvailable: boolean;
        quantity: number;
        unit: string;
        estimatedDelivery?: string;
    }>> {
        try {
            console.log(`📦 User: Checking availability for product: ${id}`);

            const availability = await productService.checkProductAvailability(id);

            if (!availability) {
                this.setStatus(StatusCodes.NOT_FOUND);
                throw new APIError('Product not found', 404);
            }

            console.log(`✅ User: Availability checked for product: ${id}`);

            this.setStatus(StatusCodes.OK);
            return success(availability, 'Product availability fetched successfully');

        } catch (error: any) {
            console.error(`❌ User: Error checking availability for product ${id}:`, error);

            if (error instanceof APIError) {
                this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
                throw error;
            }

            this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            throw new APIError(`Error checking product availability: ${error.message}`, 500);
        }
    }
}