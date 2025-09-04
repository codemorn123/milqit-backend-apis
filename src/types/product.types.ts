export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  sku: string;
  barcode?: string;
  images: string[];
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  attributes?: Record<string, string>;
  tags?: string[];
  unit?: string;
  unitValue?: number;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  category: {
    id: string;
    name: string;
  };
  inStock: boolean;
  unit?: string;
  unitValue?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

// TSOA Product Request DTOs
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  sku: string;
  barcode?: string;
  images: string[];
  quantity: number;
  isActive?: boolean;
  isFeatured?: boolean;
  attributes?: Record<string, string>;
  tags?: string[];
  unit?: string;
  unitValue?: number;
  deliveryTime?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  categoryId?: string;
  sku?: string;
  barcode?: string;
  images?: string[];
  quantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  attributes?: Record<string, string>;
  tags?: string[];
  unit?: string;
  unitValue?: number;
  deliveryTime?: string;
}

// TSOA Category Request DTOs
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  slug?: string;
  parentId?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}

// Product query parameters
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  tags?: string | string[];
}