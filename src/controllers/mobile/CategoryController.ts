import { Controller, Get, Route, Path, Query, Tags, Response } from 'tsoa';
import { categoryService } from '../../services/categoryService';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { ErrorResponse } from './../../types/common.types';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from './../../error/exampleErrors';
interface MobileCategoryResponse {
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
  
}





interface CategoryTreeResponse {
  categoryTree: Array<{
      id: string;
      name: string;
      image: string;
      icon: string | null;
      slug: string;
      children: any[]; 
    }>;
  
}

interface FeaturedCategoriesResponse {
 featuredCategories: Array<{
      id: string;
      name: string;
      image: string;
      deepLink: string;
      backgroundColor: string;
      textColor: string;
    }>;
  
}

@Route("mobile/categories")
@Tags("Mobile - Categories")

@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
export class MobileCategoryController extends Controller {

  @Get()
  public async listCategories(
    @Query() page = 1,
    @Query() limit = 20
  ): Promise<SuccessResponse<MobileCategoryResponse>> {
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
      
      return success({  
        categories,
          pagination: {
            total: result.totalDocs,
            pages: result.totalPages,
            page: result.page || 1,
            hasMore: result.hasNextPage || false
          } }, 'Categories fetched successfully');
      }


  @Get("tree")
  public async getCategoryTree(): Promise<SuccessResponse<CategoryTreeResponse>> {
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
      return success({ success: true, categoryTree: mobileTree }, 'Category tree fetched successfully');
  }
  
  /**
   * Get featured categories for mobile app
   */
  @Get("featured")
  public async getFeaturedCategories(): Promise<SuccessResponse<FeaturedCategoriesResponse>> {
    const options = {
        limit: 6,
        sortBy: 'displayOrder',
        sortOrder: 'asc' as const,
        isActive: true
      };
      
      const result = await categoryService.listCategories(options);
      const featuredCategories = result.docs.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image || cat.bannerImage || '',
        deepLink: cat.deepLink || `blinkit://category/${cat.slug}`,
        backgroundColor: cat.backgroundColor || "#FFFFFF",
        textColor: cat.textColor || "#000000"
      }));
      
      return success({ success: true, featuredCategories }, 'Featured categories fetched successfully');
  }
}