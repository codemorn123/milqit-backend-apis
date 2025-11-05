import { Types } from "mongoose";
import { ProductDetails, ProductType, ValidUnit } from "./../models/product.model";
import { IcommonImage } from "./common.types";

export interface CreateProductRequest {
  name: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  unit: ValidUnit;
  category: string;
  quantity: number;
  productType: ProductType;
  brand?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  productDetails?: string; // JSON string
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  mrp?: number;
  sellingPrice?: number;
  unit?: ValidUnit;
  category?: string;
  quantity?: number;
  productType?: ProductType;
  brand?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  productDetails?: string; // JSON string
}

export interface ProductStatsResponse {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  categoriesCount: number;
  brandsCount: number;
}

export interface BulkDeleteRequest {
  productIds: string[];
}

export interface UpdateStockRequest {
  quantity: number;
}

interface RemoveImagesRequest {
  imageKeys: string[];
}



export interface ProductFilterQueryParams {
  q?: string,
  page?: number,
  limit?: number,
  search?: string,
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number,
  brand?: string,
  unit?: 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen',
  sortBy?: 'name' | 'price' | 'createdAt' | 'popularity' | 'rating' | 'quantity' | 'unit' | 'relevance',
  sortOrder?: 'asc' | 'desc',
  isActive?: true,
  isPublic?: true,
  inStock?: true
};




export interface CreateProductPayload {
  name: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  category: string;
  stock: number;
  productType: string;
  productDetails: object;
  brand?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}


export interface IProductForCart {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  category: Types.ObjectId;
  sku: string;
  images?: IcommonImage[];
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  brand?: string;
  unit: ValidUnit;
  productType: ProductType;
  productDetails: ProductDetails;
  averageRating: number;
  reviewCount: number;
  
  // Computed fields
  discountPercentage?: number;
  savings?: number;
  hasDiscount?: boolean;
}