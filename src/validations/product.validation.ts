import { z } from 'zod';
import mongoose from 'mongoose';

// Current context
const CURRENT_TIMESTAMP = '20250901045437';
const CURRENT_USER = 'MarotiKathoke';

// Valid units
const VALID_UNITS = ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'] as const;

// Helper functions
const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

const numericString = z.union([
  z.number(),
  z.string().transform((val, ctx) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid number format`,
      });
      return z.NEVER;
    }
    return num;
  })
]);

const integerString = z.union([
  z.number().int(),
  z.string().transform((val, ctx) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid integer format`,
      });
      return z.NEVER;
    }
    return num;
  })
]);

const booleanString = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform(val => val === 'true'),
  z.string().transform((val, ctx) => {
    const lower = val.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be true or false',
    });
    return z.NEVER;
  })
]);

const arrayString = z.union([
  z.array(z.string()),
  z.string().transform(val => val.split(',').map(item => item.trim()).filter(Boolean))
]);

// Product schemas
export const createProductSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name cannot exceed 200 characters')
    .trim(),
  
  description: z.string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  price: numericString
    .refine(val => val > 0, 'Price must be greater than zero'),
  
  compareAtPrice: numericString
    .refine(val => val >= 0, 'Compare at price must be non-negative')
    .optional(),
  
  categoryId: z.string()
    .refine(isValidObjectId, 'Invalid category ID format'),
  
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(100, 'SKU cannot exceed 100 characters')
    .trim(),
  
  barcode: z.string()
    .max(50, 'Barcode cannot exceed 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  quantity: integerString
    .refine(val => val >= 0, 'Quantity must be non-negative'),
  
  isActive: booleanString.optional().default(true),
  isFeatured: booleanString.optional().default(false),
  
  attributes: z.record(z.string(), z.string())
    .optional()
    .or(z.string().transform((val, ctx) => {
      try {
        return JSON.parse(val);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Attributes must be valid JSON',
        });
        return z.NEVER;
      }
    })),
  
  tags: arrayString.optional().default([]),
  
  unit: z.enum(VALID_UNITS),
  
  unitValue: numericString
    .refine(val => val > 0, 'Unit value must be greater than zero'),
  
  deliveryTime: z.string()
    .max(100, 'Delivery time cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  
  isVeg: booleanString.optional().default(true),
  
  packagedWeight: z.string()
    .max(50, 'Packaged weight cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  
  tax: numericString
    .refine(val => val >= 0 && val <= 100, 'Tax must be between 0 and 100')
    .optional()
    .default(0),
  
  discount: numericString
    .refine(val => val >= 0 && val <= 100, 'Discount must be between 0 and 100')
    .optional()
    .default(0),
  
  brand: z.string()
    .max(100, 'Brand name cannot exceed 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  expiryDate: z.union([
    z.date(),
    z.string().transform((val, ctx) => {
      if (!val) return undefined;
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid date format',
        });
        return z.NEVER;
      }
      if (date <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date must be in the future',
        });
        return z.NEVER;
      }
      return date;
    })
  ]).optional(),
  
  manufacturerInfo: z.string()
    .max(1000, 'Manufacturer info cannot exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  nutritionalInfo: z.string()
    .max(1000, 'Nutritional info cannot exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  storageInstructions: z.string()
    .max(1000, 'Storage instructions cannot exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  countryOfOrigin: z.string()
    .max(100, 'Country of origin cannot exceed 100 characters')
    .trim()
    .optional()
    .default('India'),
  
  inStock: booleanString.optional(),
  
  minOrderQuantity: integerString
    .refine(val => val >= 1, 'Minimum order quantity must be at least 1')
    .optional()
    .default(1),
  
  maxOrderQuantity: integerString
    .refine(val => val >= 1, 'Maximum order quantity must be at least 1')
    .optional(),
  
  badges: arrayString.optional().default([]),
  
  relatedProducts: arrayString
    .transform(val => val.filter(id => isValidObjectId(id)))
    .optional()
    .default([])
}).refine(
  data => !data.maxOrderQuantity || data.maxOrderQuantity >= data.minOrderQuantity,
  {
    message: 'Maximum order quantity cannot be less than minimum order quantity',
    path: ['maxOrderQuantity']
  }
);

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
  limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  isFeatured: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  isVeg: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  inStock: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  categoryId: z.string().refine(isValidObjectId, 'Invalid category ID format').optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val)).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(val => parseFloat(val)).optional(),
  brand: z.string().optional(),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim())).optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;