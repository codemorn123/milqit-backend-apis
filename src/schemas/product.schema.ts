import { z } from 'zod';
import mongoose from 'mongoose';

const objectId = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid MongoDB ObjectId',
});

// --- Schemas for Validating HTTP Requests ---

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    price: z.coerce.number({ message: 'Price must be a number' }).positive(),
    categoryId: objectId,
    sku: z.string().min(3),
    quantity: z.coerce.number().int().min(0),
    unit: z.enum(['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen']),
    description: z.string().optional(),
    brand: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  params: z.object({ id: objectId }),
});

export const getProductsSchema = z.object({
  query: z.object({
    // page: z.coerce.number().min(1).optional().default(1),
    // limit: z.coerce.number().min(1).max(100).optional().default(20),
    // sortBy: z.string().optional().default('createdAt'),
    page: z.coerce.number().min(1).optional(),
limit: z.coerce.number().min(1).max(100).optional(),
sortBy: z.string().optional(),
sortOrder: z.enum(['asc', 'desc']).optional(),
    // sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    search: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

// --- Exported TypeScript Types for Service Layer ---
// This is the critical part that was missing. It makes the types available for import.
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsInput = z.infer<typeof getProductsSchema>['query'];