import { Controller, Get, Route, Path, Query, Tags } from 'tsoa';
import mongoose from 'mongoose';
import { categoryService } from '../../services/categoryService';
import { ApiError } from '../../utils/errorHandler';
import { logger } from '../../config/logger';

// Define response interfaces for type safety
interface MobileCategoryResponse {
  success: boolean;
  data: {
    categories: Array<{
      id: string;
      name: string;
      image: string;
      icon: string | null;
      slug: string;
      backgroundColor: string;
      textColor: string;
      deepLink: string | null;
    }>;
    pagination: {
      total: number;
      pages: number;
      page: number;
      hasMore: boolean;
    };
  };
}

interface HomeCategoryResponse {
  success: boolean;
  data: {
    categories: Array<{
      id: string;
      name: string;
      image: string;
      bannerImage: string | null;
      backgroundColor: string;
      textColor: string;
      products: Array<{
        id: string;
        name: string;
        price: number;
        compareAtPrice: number | null;
        image: string;
        unit: string;
        unitValue: number;
        isVeg?: boolean;
        inStock: boolean;
        discount: number;
      }>;
      totalProducts: number;
      deepLink: string;
    }>;
  };
}

interface CategoryProductsResponse {
  success: boolean;
  data: {
    category: {
      id: string;
      name: string;
      description?: string;
      image: string;
      bannerImage: string | null;
      backgroundColor: string;
      textColor: string;
    };
    products: Array<{
      id: string;
      name: string;
      description?: string;
      price: number;
      compareAtPrice?: number;
      images: string[];
      unit: string;
      unitValue: number;
      isVeg?: boolean;
      inStock: boolean;
      discount: number;
      brand?: string;
      badges?: string[];
      packagedWeight?: string;
      deliveryTime?: string;
    }>;
    pagination: {
      total: number;
      pages: number;
      page: number;
      hasMore: boolean;
    };
  };
}

interface CategoryTreeResponse {
  success: boolean;
  data: {
    categoryTree: Array<{
      id: string;
      name: string;
      image: string;
      icon: string | null;
      slug: string;
      children: any[]; // Using any[] here as it's a recursive type
    }>;
  };
}

interface FeaturedCategoriesResponse {
  success: boolean;
  data: {
    featuredCategories: Array<{
      id: string;
      name: string;
      image: string;
      deepLink: string;
      backgroundColor: string;
      textColor: string;
    }>;
  };
}

@Route("mobile/categories")
@Tags("Mobile - Categories")
export class MobileCategoryController extends Controller {
  /**
   * Get all active categories for mobile app
   */
  @Get()
  public async listCategories(
    @Query() page = 1,
    @Query() limit = 20
  ): Promise<MobileCategoryResponse> {
    try {
      const options = {
        page,
        limit,
        sortBy: 'displayOrder',
        sortOrder: 'asc' as const,
        isActive: true
      };
      
      const result = await categoryService.listCategories(options);
      
      // Transform data for mobile client
      const categories = result.docs.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image,
        icon: cat.icon || null,
        slug: cat.slug,
        backgroundColor: cat.backgroundColor || "#FFFFFF",
        textColor: cat.textColor || "#000000",
        deepLink: cat.deepLink || null
      }));
      
      return {
        success: true,
        data: {
          categories,
          pagination: {
            total: result.totalDocs,
            pages: result.totalPages,
            page: result.page || 1,
            hasMore: result.hasNextPage || false
          }
        }
      };
    } catch (error) {
      logger.error({ error }, 'Failed to fetch categories for mobile app');
      throw ApiError.internal('Failed to load categories');
    }
  }
  
  /**
   * Get home screen categories with featured products
   */
  // @Get("home")
  // public async getHomeCategories(): Promise<HomeCategoryResponse> {
  //   try {
  //     // Get active top-level categories
  //     const options = {
  //       limit: 10,
  //       sortBy: 'displayOrder',
  //       sortOrder: 'asc' as const,
  //       isActive: true,
  //       parentId: null // Only top-level categories
  //     };
      
  //     const result = await categoryService.listCategories(options);
      
  //     // Prepare response with products for each category
  //     const homeCategories = [];
      
  //     for (const category of result.docs) {
  //       // Get a few products for this category
  //       const products = await productService.getProductsByCategory(
  //         category.id.toString(),
  //         1,
  //         8,
  //         'createdAt',
  //         'desc'
  //       );
        
  //       // Format products for mobile display
  //       const formattedProducts = products.docs.map(product => ({
  //         id: product.id.toString(),
  //         name: product.name,
  //         price: product.price,
  //         compareAtPrice: product.compareAtPrice || null,
  //         image: product.images[0],
  //         unit: product.unit,
  //         unitValue: product.unitValue,
  //         isVeg: product.isVeg,
  //         inStock: product.inStock,
  //         discount: product.discount || 0
  //       }));
        
  //       // homeCategories.push({
  //       //   id: category.id.toString(),
  //       //   name: category.name,
  //       //   image: category.image,
  //       //   bannerImage: category.bannerImage || null,
  //       //   backgroundColor: category.backgroundColor || "#FFFFFF",
  //       //   textColor: category.textColor || "#000000",
  //       //   products: formattedProducts,
  //       //   totalProducts: products.totalDocs,
  //       //   deepLink: category.deepLink || `blinkit://category/${category.slug}`
  //       // });
  //     }
      
  //     return {
  //       success: true,
  //       data: {
  //         categories: homeCategories
  //       }
  //     };
  //   } catch (error) {
  //     logger.error({ error }, 'Failed to fetch home categories');
  //     throw ApiError.internal('Failed to load home screen data');
  //   }
  // }
  
  /**
   * Get category by ID with products
  //  */
  // @Get("{id}/products")
  // public async getCategoryProducts(
  //   @Path() id: string,
  //   @Query() page = 1,
  //   @Query() limit = 20,
  //   @Query() sortBy = 'createdAt',
  //   @Query() sortOrder: 'asc' | 'desc' = 'desc'
  // ): Promise<CategoryProductsResponse> {
  //   try {
  //     // Validate ObjectId
  //     if (!mongoose.isValidObjectId(id)) {
  //       throw ApiError.badRequest('Invalid category ID');
  //     }
      
  //     // Get category details
  //     const category = await categoryService.getCategoryById(id);
      
  //     if (!category.isActive) {
  //       throw ApiError.notFound('Category not found or inactive');
  //     }
      
  //     // Get products for this category
  //     const productsResult = await productService.getProductsByCategory(
  //       id,
  //       page,
  //       limit,
  //       sortBy,
  //       sortOrder
  //     );
      
  //     // Format products for mobile display
  //     const products = productsResult.docs.map(product => ({
  //       id: product.id.toString(),
  //       name: product.name,
  //       description: product.description,
  //       price: product.price,
  //       compareAtPrice: product.compareAtPrice,
  //       images: product.images,
  //       unit: product.unit,
  //       unitValue: product.unitValue,
  //       isVeg: product.isVeg,
  //       inStock: product.inStock,
  //       discount: product.discount || 0,
  //       brand: product.brand || undefined,
  //       badges: product.badges || [],
  //       packagedWeight: product.packagedWeight || undefined,
  //       deliveryTime: product.deliveryTime || "10-15 mins"
  //     }));
      
  //     return {
  //       success: true,
  //       data: {
  //         category: {
  //           id: category.id.toString(),
  //           name: category.name,
  //           description: category.description,
  //           image: category.image,
  //           bannerImage: category.bannerImage || null,
  //           backgroundColor: category.backgroundColor || "#FFFFFF",
  //           textColor: category.textColor || "#000000"
  //         },
  //         products,
  //         pagination: {
  //           total: productsResult.totalDocs,
  //           pages: productsResult.totalPages,
  //           page: productsResult.page || 1,
  //           hasMore: productsResult.hasNextPage || false
  //         }
  //       }
  //     };
  //   } catch (error) {
  //     logger.error({ error, categoryId: id }, 'Failed to get category products');
  //     if (error instanceof ApiError) throw error;
  //     throw ApiError.internal('Failed to load category products');
  //   }
  // }
  
  /**
   * Get category hierarchy for mobile navigation
   */
  @Get("tree")
  public async getCategoryTree(): Promise<CategoryTreeResponse> {
    try {
      const fullTree = await categoryService.getCategoryTree();
      
      // Simplify tree for mobile app (fewer properties)
      const simplifyTree = (categories: any[]): any[] => {
        return categories.map(cat => ({
          id: cat._id.toString(),
          name: cat.name,
          image: cat.image,
          icon: cat.icon || null,
          slug: cat.slug,
          children: cat.children ? simplifyTree(cat.children) : []
        }));
      };
      
      const mobileTree = simplifyTree(fullTree);
      
      return {
        success: true,
        data: {
          categoryTree: mobileTree
        }
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get category tree for mobile');
      throw ApiError.internal('Failed to load categories');
    }
  }
  
  /**
   * Get featured categories for mobile app
   */
  @Get("featured")
  public async getFeaturedCategories(): Promise<FeaturedCategoriesResponse> {
    try {
      // Get featured categories (assuming there's a isFeatured field)
      // If not, this would need to be added to the category model
      const options = {
        limit: 6,
        sortBy: 'displayOrder',
        sortOrder: 'asc' as const,
        isActive: true
      };
      
      const result = await categoryService.listCategories(options);
      
      // Transform for mobile display
      const featuredCategories = result.docs.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image || cat.bannerImage || '',
        deepLink: cat.deepLink || `blinkit://category/${cat.slug}`,
        backgroundColor: cat.backgroundColor || "#FFFFFF",
        textColor: cat.textColor || "#000000"
      }));
      
      return {
        success: true,
        data: {
          featuredCategories
        }
      };
    } catch (error) {
      logger.error({ error }, 'Failed to fetch featured categories');
      throw ApiError.internal('Failed to load featured categories');
    }
  }
}