import { z } from 'zod';
import mongoose from 'mongoose';

/**
 * Helper functions for validation
 */
const isValidObjectId = (val: string): boolean => {
  return mongoose.isValidObjectId(val);
};

// File validation for image uploads
export const categoryImageSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.string().refine(
    val => ['image/jpeg', 'image/png', 'image/webp'].includes(val),
    { message: 'Only JPEG, PNG and WebP formats are supported' }
  ),
  size: z.number().refine(
    val => val <= 5 * 1024 * 1024, // 5MB
    { message: 'Image size must not exceed 5MB' }
  )
});

// Base schema for category data
export const categoryBaseSchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim(),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(120, 'Slug cannot exceed 120 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  displayOrder: z.number()
    .int('Display order must be an integer')
    .nonnegative('Display order cannot be negative')
    .default(0),
  isActive: z.boolean().default(true),
  parentId: z.union([
    z.string().trim().refine(isValidObjectId, { message: 'Invalid parent category ID format' }),
    z.literal('null'),
    z.null()
  ]).optional().nullable(),
  metaTitle: z.string()
    .max(100, 'Meta title cannot exceed 100 characters')
    .trim()
    .optional(),
  metaDescription: z.string()
    .max(200, 'Meta description cannot exceed 200 characters')
    .trim()
    .optional(),
  backgroundColor: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional(),
  textColor: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional()
});

// Schema for creating categories
export const createCategorySchema = categoryBaseSchema.extend({
  // Make name required for creating
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name cannot exceed 100 characters')
    .trim()
});

// Schema for updating categories - all fields optional
export const updateCategorySchema = categoryBaseSchema.partial();

// Schema for reordering categories
export const reorderCategoriesSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().refine(isValidObjectId, { message: 'Invalid category ID format' }),
      displayOrder: z.number().int('Display order must be an integer').nonnegative()
    })
  ).min(1, 'At least one category is required')
});

// Types derived from schemas
export type CategoryInput = z.infer<typeof categoryBaseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>;