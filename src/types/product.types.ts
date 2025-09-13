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



