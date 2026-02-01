import { Types, FilterQuery } from "mongoose";
import { ProductDetails, ProductType, ValidUnit, ProductDocument, IProduct } from "../models/product.model";
import { IcommonImage, IProductFilter } from "./common.types";
import { PaginationQuery } from "./pagination.types";

// --- Request DTOs (Data Transfer Objects) ---

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
  productDetails?: string; // JSON string from multipart/form-data
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

// --- Service Payloads (Internal Use) ---

export interface CreateProductPayload {
  name: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  unit: ValidUnit;
  category: string;
  quantity: number; // Mapping 'quantity' from request to 'quantity'/'stock' in model
  productType: ProductType;
  productDetails: ProductDetails; // Parsed object
  brand?: string;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  // Internal fields
  stock?: number;
}

export interface UpdateProductPayload extends Partial<Omit<CreateProductPayload, 'productDetails'>> {
  productDetails?: ProductDetails;
  images?: IcommonImage[];
}

// --- Query & Filters ---

export interface ProductFilterQueryParams extends PaginationQuery {
  q?: string;           // Search query alias
  categoryId?: string;  // Category ID alias
  category?: string;    // Direct category ID
  isPublic?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'newest';
}

export interface ProductAvailabilityResponse {
  id: string;
  name: string;
  isAvailable: boolean;
  quantity: number;
  unit: string;
}

export interface ProductStatsResponse {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
}

// --- Models/Entities Extensions ---

// Useful if you need a frontend-specific projection that differs slightly from IProduct
export interface IProductForCart extends IProduct {
  discountPercentage?: number;
  savings?: number;
  hasDiscount?: boolean;
}