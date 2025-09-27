// import {
//     Controller,
//     Get,
//     Path,
//     Query,
//     Route,
//     Tags,
//     Response,
//     Example,
//     SuccessResponse as TSSuccessResponse,
//     Queries,
//     Middlewares
// } from 'tsoa';
// import { StatusCodes } from 'http-status-codes';
// import { productService } from '../../services/product.service';
// import { success, SuccessResponse } from '../../utils/SuccessResponse';

// import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
// import APIError from '../../error/api-error';
// import { IProduct } from '../../models/product.model';
// import { ProductFilterQueryParams } from '../../types/product.types';
// import { validateSchemaMiddleware } from'../../middleware/common-validate';
// import { idParamSchema } from '../../constants/common.validator';

// /**
//  * User Product Controller
//  * Handles product-related operations for end users (customers)
//  * @author MarotiKathoke
//  * @created 2025-09-13 08:20:11
//  */
// @Tags('USER: Products')
// @Route('user/products')
// @Response<ErrorResponse>(400, "Bad Request")
// @Response<ErrorResponse>(404, "Not Found")
// @Response<ErrorResponse>(422, "Validation Error")
// @Response<ErrorResponse>(500, "Server Error")
// export class UserProductController extends Controller {

//     /**
//      * Get all active products with filtering, search, and pagination
//      * @summary Get products for customers - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/')
//     @TSSuccessResponse(200, "Products fetched successfully")
//     // @Example({
//     //     page: 1,
//     //     limit: 20,
//     //     search: "apple",
//     //     categoryId: "507f1f77bcf86cd799439011",
//     //     minPrice: 10,
//     //     maxPrice: 500,
//     //     brand: "Fresh Farm",
//     //     unit: "kg",
//     //     sortBy: "price",
//     //     sortOrder: "asc"
//     // })
//     public async getProducts(
//         @Queries() filters: ProductFilterQueryParams
//     ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
//         try {
//             const paginatedResult = await productService.findForUsers(filters);
//             console.log(`✅ User: Retrieved ${paginatedResult.docs.length} products out of ${paginatedResult.totalDocs} total`);
//             return success(
//                 paginatedResult,
//                 'Products fetched successfully'
//             );

//         } catch (error: any) {
//             console.error('❌ User: Error fetching products:', error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error fetching products: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Get product details by ID
//      * @summary Get single product details - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/{id}')
//     @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
//     @TSSuccessResponse(200, "Product fetched successfully")
//     public async getProductById(
//         @Path() id: string
//     ): Promise<SuccessResponse<IProduct>> {
//         try {
//             console.log(`🔍 User: Fetching product with ID: ${id}`);

//             const product = await productService.findByIdForUsers(id);

//             if (!product) {
//                 console.log(`⚠️ User: Product with ID ${id} not found or not active`);
//                 this.setStatus(StatusCodes.NOT_FOUND);
//                 throw new APIError('Product not found', 404);
//             }

//             console.log(`✅ User: Found product: ${product.name}`);

//             this.setStatus(StatusCodes.OK);
//             return success(
//                 product,
//                 'Product fetched successfully'
//             );

//         } catch (error: any) {
//             console.error(`❌ User: Error fetching product ${id}:`, error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error fetching product: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Get products by category
//      * @summary Get products filtered by category - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/category/{categoryId}')
//     @TSSuccessResponse(200, "Category products fetched successfully")
//     @Example({
//         page: 1,
//         limit: 20,
//         sortBy: "price",
//         sortOrder: "asc"
//     })
//     public async getProductsByCategory(
//         @Queries() filters: ProductFilterQueryParams,
//     ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
//         try {
//             console.log(`📂 User: Fetching products for category: ${filters.categoryId}`);



//             const paginatedResult = await productService.findForUsers(filters);

//             console.log(`✅ User: Retrieved ${paginatedResult.docs.length} products for category ${filters.categoryId}`);

//             this.setStatus(StatusCodes.OK);
//             return success(
//                 paginatedResult,
//                 'Category products fetched successfully'
//             );

//         } catch (error: any) {
//             console.error(`❌ User: Error fetching products for category ${filters.categoryId}:`, error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error fetching category products: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Search products with advanced filters
//      * @summary Advanced product search - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/search')
//     @TSSuccessResponse(200, "Search results fetched successfully")
//     @Example({
//         q: "fresh apple",
//         categoryId: "507f1f77bcf86cd799439011",
//         minPrice: 50,
//         maxPrice: 200,
//         brands: "Fresh Farm,Organic Valley",
//         page: 1,
//         limit: 20
//     })
//     public async searchProducts(
//         @Queries() filters: ProductFilterQueryParams
//     ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
//         try {
//             console.log('🔍 User: Searching products with query:', filters.q);

//             if (!filters.q || filters.q.trim().length < 2) {
//                 this.setStatus(StatusCodes.BAD_REQUEST);
//                 throw new APIError('Search query must be at least 2 characters long', 400);
//             }
//             const paginatedResult = await productService.searchForUsers(filters);

//             console.log(`✅ User: Found ${paginatedResult.docs.length} products for search: "${filters.q}"`);

//             // this.setStatus(StatusCodes.OK);
//             return success(
//                 paginatedResult,
//                 `Search results for "${filters.q}" fetched successfully`
//             );

//         } catch (error: any) {
//             console.error(`❌ User: Error searching products with query "${filters.q}":`, error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error searching products: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Get featured/popular products
//      * @summary Get featured products - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/featured')
//     @TSSuccessResponse(200, "Featured products fetched successfully")
//     public async getFeaturedProducts(
//         /** Number of featured products to return */
//         @Query() limit?: number
//     ): Promise<SuccessResponse<IProduct[]>> {
//         try {
//             console.log('⭐ User: Fetching featured products');

//             const validatedLimit = Math.min(20, Math.max(1, limit || 10)); // Max 20 featured products

//             const products = await productService.getFeaturedProducts(validatedLimit);

//             console.log(`✅ User: Retrieved ${products.length} featured products`);
//             this.setStatus(StatusCodes.OK);
//             return success(
//                 products,
//                 'Featured products fetched successfully'
//             );

//         } catch (error: any) {
//             console.error('❌ User: Error fetching featured products:', error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error fetching featured products: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Get related products based on product ID
//      * @summary Get related products - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/{id}/related')
//     @TSSuccessResponse(200, "Related products fetched successfully")
//     public async getRelatedProducts(
//         @Path() id: string,
//         /** Number of related products to return */
//         @Query() limit?: number
//     ): Promise<SuccessResponse<IProduct[]>> {
//         try {
//             console.log(`🔗 User: Fetching related products for: ${id}`);


//             const validatedLimit = Math.min(10, Math.max(1, limit || 5)); // Max 10 related products

//             const relatedProducts = await productService.getRelatedProducts(id, validatedLimit);

//             console.log(`✅ User: Retrieved ${relatedProducts.length} related products for ${id}`);

//             this.setStatus(StatusCodes.OK);
//             return success(
//                 relatedProducts,
//                 'Related products fetched successfully'
//             );

//         } catch (error: any) {
//             console.error(`❌ User: Error fetching related products for ${id}:`, error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error fetching related products: ${error.message}`, 500);
//         }
//     }

//     /**
//      * Get product availability status
//      * @summary Check product availability - authored by MarotiKathoke at 2025-09-13 08:20:11
//      */
//     @Get('/{id}/availability')
//     @TSSuccessResponse(200, "Product availability fetched successfully")
//     public async getProductAvailability(
//         @Path() id: string
//     ): Promise<SuccessResponse<{
//         id: string;
//         name: string;
//         isAvailable: boolean;
//         quantity: number;
//         unit: string;
//         estimatedDelivery?: string;
//     }>> {
//         try {
//             console.log(`📦 User: Checking availability for product: ${id}`);

//             const availability = await productService.checkProductAvailability(id);

//             if (!availability) {
//                 this.setStatus(StatusCodes.NOT_FOUND);
//                 throw new APIError('Product not found', 404);
//             }

//             console.log(`✅ User: Availability checked for product: ${id}`);

//             this.setStatus(StatusCodes.OK);
//             return success(availability, 'Product availability fetched successfully');

//         } catch (error: any) {
//             console.error(`❌ User: Error checking availability for product ${id}:`, error);

//             if (error instanceof APIError) {
//                 this.setStatus(error.getStatusCode() || StatusCodes.INTERNAL_SERVER_ERROR);
//                 throw error;
//             }

//             this.setStatus(StatusCodes.INTERNAL_SERVER_ERROR);
//             throw new APIError(`Error checking product availability: ${error.message}`, 500);
//         }
//     }
// }




import {
    Controller, Get, Path, Route, Tags, Queries, Response
  } from 'tsoa';
  import { productService } from '../../services/product.service';
  import { success, SuccessResponse } from '../../utils/SuccessResponse';
  import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
  import { IProduct, ProductDocument } from '../../models/product.model';
  import { ProductFilterQueryParams } from '../../types/product.types';
  import APIError from '../../error/api-error';
  
  // Customer-specific response interfaces
  interface ProductAvailabilityResponse {
    id: string;
    name: string;
    isAvailable: boolean;
    quantity: number;
    unit: string;
    sellingPrice: number;
    mrp: number;
    hasDiscount: boolean;
    discountPercentage?: number;
    savings?: number;
    
  }
  
  interface CustomerProductResponse extends Omit<IProduct, 'createdBy' | 'updatedBy'> {
    discountPercentage: number;
    savings: number;
    hasDiscount: boolean;
  }
  
  interface ProductFilters extends Omit<ProductFilterQueryParams, 'isActive' | 'createdBy' | 'updatedBy'> {
    // Customer-specific filters only
  }
  
  @Tags('CUSTOMER: Products')
  @Route('customer/products')
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(404, "Not Found") 
  @Response<ErrorResponse>(500, "Server Error")
  export class CustomerProductController extends Controller {
  
    /**
     * Get all available products for customers
     * Only returns active and in-stock products
     * @summary Get Products for Customers
     */
    @Get('/')
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
  
        return success(result, 'Products fetched successfully.');
      } catch (error: any) {
        throw new APIError(`Error fetching products: ${error.message}`, 500);
      }
    }
  
    /**
     * Get a single product by ID for customers
     * @summary Get Product Details
     */
    @Get('{id}')
    public async getProductById(
      @Path() id: string
    ): Promise<SuccessResponse<IProduct | null>> {
      try {
        const product = await productService.findByIdForUsers(id);
        
        if (!product) {
          return success(null, 'Product not found or unavailable.');
        }
  
        const discountPercentage = product.mrp > 0 
          ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
          : 0;
  
        // const customerProduct: CustomerProductResponse = {
        //   ...product,
        //   discountPercentage,
        //   savings: product.mrp - product.sellingPrice,
        //   hasDiscount: product.sellingPrice < product.mrp
        // };
  
        return success(product, 'Product details fetched successfully.');
      } catch (error: any) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(`Error fetching product: ${error.message}`, 500);
      }
    }
  
    /**
     * Get a product by slug for customers
     * @summary Get Product by Slug
     */
    // @Get('slug/{slug}')
    // public async getProductBySlug(
    //   @Path() slug: string
    // ): Promise<SuccessResponse<CustomerProductResponse | null>> {
    //   try {
    //     const product = await productService.gestProductBySlug(slug, true);
        
    //     if (!product) {
    //       return success(null, 'Product not found or unavailable.');
    //     }
  
    //     const discountPercentage = product.mrp > 0 
    //       ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //       : 0;
  
    //     const customerProduct: CustomerProductResponse = {
    //       ...product,
    //       discountPercentage,
    //       savings: product.mrp - product.sellingPrice,
    //       hasDiscount: product.sellingPrice < product.mrp
    //     };
  
    //     return success(customerProduct, 'Product details fetched successfully.');
    //   } catch (error: any) {
    //     throw new APIError(`Error fetching product: ${error.message}`, 500);
    //   }
    // }
  
    /**
     * Search products for customers
     * @summary Search Products
     */
    // @Get('search')
    // public async searchProducts(
    //   @Queries() params: ProductFilters & { q: string }
    // ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    //   try {
    //     const { q: searchQuery, ...filters } = params;
        
    //     if (!searchQuery || searchQuery.trim().length === 0) {
    //       throw new APIError('Search query is required', 400);
    //     }
  
    //     const results = await productService.searchProducts(searchQuery, filters, true);
        
    //     // Transform response to include discount calculations
    //     const transformedDocs = results.docs.map(product => {
    //       const discountPercentage = product.mrp > 0 
    //         ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //         : 0;
          
    //       return {
    //         ...product,
    //         discountPercentage,
    //         savings: product.mrp - product.sellingPrice,
    //         hasDiscount: product.sellingPrice < product.mrp
    //       } as CustomerProductResponse;
    //     });
  
    //     const result = {
    //       ...results,
    //       docs: transformedDocs
    //     };
  
    //     return success(result, 'Product search completed successfully.');
    //   } catch (error: any) {
    //     if (error instanceof APIError) {
    //       throw error;
    //     }
    //     throw new APIError(`Error searching products: ${error.message}`, 500);
    //   }
    // }
  
    /**
     * Get featured products for customers
     * @summary Get Featured Products
     */
    @Get('featured')
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
  
        return success(transformedProducts, 'Featured products fetched successfully.');
      } catch (error: any) {
        throw new APIError(`Error fetching featured products: ${error.message}`, 500);
      }
    }
  
    /**
     * Get products by category for customers
     * @summary Get Products by Category
     */
    @Get('category/{categoryId}')
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
  
        return success(result, 'Products fetched by category successfully.');
      } catch (error: any) {
        throw new APIError(`Error fetching products by category: ${error.message}`, 500);
      }
    }
  
    /**
     * Get products by brand for customers
     * @summary Get Products by Brand
     */
    // @Get('brand/{brand}')
    // public async getProductsByBrand(
    //   @Path() brand: string,
    //   @Queries() filters: ProductFilters
    // ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    //   try {
    //     const results = await productService.getProductsByBrand(brand, filters, true);
        
    //     const transformedDocs = results.docs.map(product => {
    //       const discountPercentage = product.mrp > 0 
    //         ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //         : 0;
          
    //       return {
    //         ...product,
    //         discountPercentage,
    //         savings: product.mrp - product.sellingPrice,
    //         hasDiscount: product.sellingPrice < product.mrp
    //       } as CustomerProductResponse;
    //     });
  
    //     const result = {
    //       ...results,
    //       docs: transformedDocs
    //     };
  
    //     return success(result, 'Products fetched by brand successfully.');
    //   } catch (error: any) {
    //     throw new APIError(`Error fetching products by brand: ${error.message}`, 500);
    //   }
    // }
  
    /**
     * Get related products for a specific product
     * @summary Get Related Products
     */
    @Get('{id}/related')
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
  
        return success(transformedProducts, 'Related products fetched successfully.');
      } catch (error: any) {
        throw new APIError(`Error fetching related products: ${error.message}`, 500);
      }
    }
  
    /**
     * Check product availability for customers
     * @summary Check Product Availability
     */
    // @Get('{id}/availability')
    // public async checkProductAvailability(
    //   @Path() id: string
    // ): Promise<SuccessResponse<ProductAvailabilityResponse | null>> {
    //   try {
    //     const availability = await productService.checkProductAvailability(id);
        
    //     if (!availability) {
    //       return success(null, 'Product not found or unavailable.');
    //     }
  
    //     const discountPercentage = availability.mrp > 0 
    //       ? Math.round(((availability.mrp - availability.sellingPrice) / availability.mrp) * 100) 
    //       : 0;
  
    //     const response: ProductAvailabilityResponse = {
    //       ...availability,
    //       discountPercentage,
    //       savings: availability.mrp - availability.sellingPrice
    //     };
  
    //     return success(response, 'Product availability checked successfully.');
    //   } catch (error: any) {
    //     throw new APIError(`Error checking product availability: ${error.message}`, 500);
    //   }
    // }
  
    /**
     * Get products with discounts (sale items)
     * @summary Get Sale Products
     */
    // @Get('sale')
    // public async getSaleProducts(
    //   @Queries() filters: ProductFilters & { minDiscount?: number }
    // ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    //   try {
    //     const minDiscount = filters.minDiscount || 5; // At least 5% discount
    //     const { minDiscount: _, ...otherFilters } = filters;
        
    //     // Get products and filter by discount on the frontend
    //     // You could also add this logic to your service layer
    //     const results = await productService.findForUsers({
    //       ...otherFilters,
    //       sortBy: 'createdAt',
    //       sortOrder: 'desc'
    //     });
        
    //     const saleProducts = results.docs.filter(product => {
    //       const discountPercentage = product.mrp > 0 
    //         ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //         : 0;
    //       return discountPercentage >= minDiscount;
    //     });
  
    //     const transformedDocs = saleProducts.map(product => {
    //       const discountPercentage = product.mrp > 0 
    //         ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //         : 0;
          
    //       return {
    //         ...product,
    //         discountPercentage,
    //         savings: product.mrp - product.sellingPrice,
    //         hasDiscount: product.sellingPrice < product.mrp
    //       } as CustomerProductResponse;
    //     });
  
    //     const result = {
    //       ...results,
    //       docs: transformedDocs,
    //       totalDocs: transformedDocs.length
    //     };
  
    //     return success(result, 'Sale products fetched successfully.');
    //   } catch (error: any) {
    //     throw new APIError(`Error fetching sale products: ${error.message}`, 500);
    //   }
    // }
  
    /**
     * Get new arrivals (recently added products)
     * @summary Get New Arrivals
     */
    @Get('new-arrivals')
    public async getNewArrivals(
      @Queries() params: { limit?: number; days?: number }
    ): Promise<SuccessResponse<CustomerProductResponse[]>> {
      try {
        const limit = Math.min(params.limit || 20, 50);
        const days = params.days || 30; // Products added in last 30 days
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const results = await productService.findForUsers({
          sortBy: 'createdAt',
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
  
        return success(transformedProducts, 'New arrivals fetched successfully.');
      } catch (error: any) {
        throw new APIError(`Error fetching new arrivals: ${error.message}`, 500);
      }
    }
  
    /**
     * Get products by price range
     * @summary Get Products by Price Range
     */
    // @Get('price-range')
    // public async getProductsByPriceRange(
    //   @Queries() params: ProductFilters & { minPrice: number; maxPrice: number }
    // ): Promise<SuccessResponse<PaginatedResponse<CustomerProductResponse>>> {
    //   try {
    //     if (!params.minPrice || !params.maxPrice) {
    //       throw new APIError('Both minPrice and maxPrice are required', 400);
    //     }
        
    //     if (params.minPrice < 0 || params.maxPrice < 0) {
    //       throw new APIError('Price values cannot be negative', 400);
    //     }
        
    //     if (params.minPrice > params.maxPrice) {
    //       throw new APIError('Minimum price cannot be greater than maximum price', 400);
    //     }
        
    //     const { minPrice, maxPrice, ...filters } = params;
        
    //     const results = await productService.findForUsers({
    //       ...filters,
    //       minPrice,
    //       maxPrice,
    //       sortBy: 'createdAt',
    //       sortOrder: 'asc'
    //     });
        
    //     const transformedDocs = results.docs.map(product => {
    //       const discountPercentage = product.mrp > 0 
    //         ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) 
    //         : 0;
          
    //       return {
    //         ...product,
    //         discountPercentage,
    //         savings: product.mrp - product.sellingPrice,
    //         hasDiscount: product.sellingPrice < product.mrp
    //       } as CustomerProductResponse;
    //     });
  
    //     const result = {
    //       ...results,
    //       docs: transformedDocs
    //     };
  
    //     return success(result, 'Products fetched by price range successfully.');
    //   } catch (error: any) {
    //     if (error instanceof APIError) {
    //       throw error;
    //     }
    //     throw new APIError(`Error fetching products by price range: ${error.message}`, 500);
    //   }
    // }
  }