import { PaginateResult } from 'mongoose';
import { ProductDocument } from '../models/ProductModel';

export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    categoryId: string;
    sku: string;
    quantity: number;
    isActive: boolean;
    brand?: string;
    unit: 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen';
}

/**
 * @description Plain TypeScript interface for updating a product.
 */
export type UpdateProductDTO = Partial<CreateProductDTO>;

/**
 * @description The clean, public-facing shape of a product in API responses.
 */
export interface ProductResponseDTO {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    isActive: boolean;
    inStock: boolean;
    user: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * @description The shape of the paginated product list response.
 */
export interface PaginatedProductsResponseDTO {
    products: ProductResponseDTO[];
    pagination: {
        totalDocs: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

/**
 * Maps a Mongoose document to a clean, public-facing DTO.
 */
export const toProductResponseDTO = (product: ProductDocument): ProductResponseDTO => ({
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    images: product.images,
    isActive: product.isActive,
    inStock: product.inStock,
    user: product.user,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
});

/**
 * Maps a Mongoose pagination result to the public-facing paginated DTO.
 */
export const toPaginatedProductsResponseDTO = (
    paginatedResult: PaginateResult<ProductDocument>
): PaginatedProductsResponseDTO => ({
    products: paginatedResult.docs.map(toProductResponseDTO),
    pagination: {
        totalDocs: paginatedResult.totalDocs,
        totalPages: paginatedResult.totalPages,
        currentPage: paginatedResult.page || 1,
        limit: paginatedResult.limit,
        hasNextPage: paginatedResult.hasNextPage,
        hasPrevPage: paginatedResult.hasPrevPage,
    },
});