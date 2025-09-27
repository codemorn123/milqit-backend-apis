import { ProductType, ValidUnit } from "./../models/product.model";

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