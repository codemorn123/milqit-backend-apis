import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Valid unit types for products
 * Based on fresh grocery delivery and restaurant apps
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export type ValidUnit = 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen' | 'bundle';

/**
 * Custom Joi validator for MongoDB ObjectId
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
const objectIdValidator = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'MongoDB ObjectId validation').messages({
  'any.invalid': 'Invalid MongoDB ObjectId format'
});

/**
 * Product validation schema based on IProduct interface
 * Optimized for React Native mobile apps (RFS, SmartFlow, home_fresh_app, core_mobile_app, shree-react-naive-app)
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export const productSchema = Joi.object({
  // Required fields
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 200 characters',
      'string.empty': 'Product name cannot be empty',
      'any.required': 'Product name is required'
    }),

  slug: Joi.string()
    .min(2)
    .max(250)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.min': 'Product slug must be at least 2 characters long',
      'string.max': 'Product slug cannot exceed 250 characters',
      'string.pattern.base': 'Product slug must contain only lowercase letters, numbers, and hyphens',
      'any.required': 'Product slug is required'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .min(0.01)
    .max(999999.99)
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'number.min': 'Price must be at least 0.01',
      'number.max': 'Price cannot exceed 999,999.99',
      'any.required': 'Price is required'
    }),

  categoryId: objectIdValidator
    .required()
    .messages({
      'any.required': 'Category ID is required'
    }),

  sku: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Z0-9-_]+$/)
    .trim()
    .uppercase()
    .required()
    .messages({
      'string.min': 'SKU must be at least 3 characters long',
      'string.max': 'SKU cannot exceed 50 characters',
      'string.pattern.base': 'SKU must contain only uppercase letters, numbers, hyphens, and underscores',
      'any.required': 'SKU is required'
    }),

  images: Joi.array()
    .items(
      Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .messages({
          'string.uri': 'Each image must be a valid HTTP/HTTPS URL'
        })
    )
    .min(0)
    .max(10)
    .default([])
    .messages({
      'array.max': 'Cannot have more than 10 product images',
      'array.base': 'Images must be an array'
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .required()
    .messages({
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity cannot be negative',
      'number.max': 'Quantity cannot exceed 999,999',
      'any.required': 'Quantity is required'
    }),

  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'isActive must be a boolean value'
    }),

  isFeatured: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'isFeatured must be a boolean value'
    }),

  inStock: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'inStock must be a boolean value'
    }),

  unit: Joi.string()
    .valid('piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle')
    .required()
    .messages({
      'any.only': 'Unit must be one of: piece, kg, gm, litre, ml, pack, dozen, bundle',
      'any.required': 'Unit is required'
    }),

  user: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .default('MarotiKathoke')
    .messages({
      'string.min': 'User must be at least 2 characters long',
      'string.max': 'User cannot exceed 100 characters'
    }),

  createdAt: Joi.date()
    .iso()
    .default(() => new Date())
    .messages({
      'date.base': 'Created date must be a valid date',
      'date.format': 'Created date must be in ISO format'
    }),

  updatedAt: Joi.date()
    .iso()
    .default(() => new Date())
    .messages({
      'date.base': 'Updated date must be a valid date',
      'date.format': 'Updated date must be in ISO format'
    }),

  // Optional fields
  description: Joi.string()
    .max(2000)
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 2000 characters'
    }),

  compareAtPrice: Joi.number()
    .positive()
    .precision(2)
    .min(0.01)
    .max(999999.99)
    .when('price', {
      is: Joi.exist(),
      then: Joi.number().greater(Joi.ref('price'))
    })
    .optional()
    .messages({
      'number.positive': 'Compare at price must be a positive number',
      'number.min': 'Compare at price must be at least 0.01',
      'number.max': 'Compare at price cannot exceed 999,999.99',
      'number.greater': 'Compare at price must be greater than regular price'
    }),

  brand: Joi.string()
    .max(100)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Brand name cannot exceed 100 characters'
    })
});

/**
 * Product creation validation schema
 * For creating new products via API
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export const createProductSchema = productSchema.fork(
  ['slug', 'createdAt', 'updatedAt'], 
  (schema) => schema.optional()
).messages({
  'object.unknown': 'Unknown field: {#label}'
})

/**
 * Product update validation schema
 * For updating existing products via API
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export const updateProductSchema = productSchema.fork(
  [
    'name', 'slug', 'price', 'categoryId', 'sku', 
    'images', 'quantity', 'isActive', 'isFeatured', 
    'inStock', 'unit', 'user', 'createdAt'
  ],
  (schema) => schema.optional()
).with('name', 'slug').messages({
  'object.with': 'When updating name, slug must also be provided',
  'object.unknown': 'Unknown field: {#label}',
  'object.min': 'At least one field must be provided for update'
}).min(1);

export const getProductsSchema = Joi.object({
  query: Joi.object({
    // Pagination
    page: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .default(1)
      .messages({
        'number.min': 'Page must be at least 1',
        'number.max': 'Page cannot exceed 1000'
      }),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100 for mobile performance'
      }),

    // Sorting
    sortBy: Joi.string()
      .valid(
        'name', 'price', 'createdAt', 'updatedAt', 'quantity',
        'popularity', 'rating', 'discount', 'featured'
      )
      .default('createdAt')
      .messages({
        'any.only': 'Sort field must be one of the allowed values'
      }),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'Sort order must be either asc or desc'
      }),

    // Search
    search: Joi.string()
      .max(100)
      .trim()
      .optional()
      .messages({
        'string.max': 'Search query cannot exceed 100 characters'
      }),

    // Basic filters
    isActive: Joi.boolean()
      .default(true),

    isFeatured: Joi.boolean()
      .optional(),

    inStock: Joi.boolean()
      .optional(),

    // Category filtering
    categoryId: objectIdValidator.optional(),

    categoryIds: Joi.array()
      .items(objectIdValidator)
      .max(10)
      .optional()
      .messages({
        'array.max': 'Cannot filter by more than 10 categories at once'
      }),

    // Price filtering
    minPrice: Joi.number()
      .min(0)
      .precision(2)
      .optional()
      .messages({
        'number.min': 'Minimum price cannot be negative'
      }),

    maxPrice: Joi.number()
      .positive()
      .precision(2)
      .when('minPrice', {
        is: Joi.exist(),
        then: Joi.number().greater(Joi.ref('minPrice'))
      })
      .optional()
      .messages({
        'number.positive': 'Maximum price must be positive',
        'number.greater': 'Maximum price must be greater than minimum price'
      }),

    // Brand filtering
    brand: Joi.string()
      .max(100)
      .trim()
      .optional(),

    brands: Joi.array()
      .items(Joi.string().trim().max(100))
      .max(5)
      .optional()
      .messages({
        'array.max': 'Cannot filter by more than 5 brands at once'
      }),

    // Unit filtering
    unit: Joi.string()
      .valid('piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle')
      .optional(),

    units: Joi.array()
      .items(Joi.string().valid('piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle'))
      .max(4)
      .optional()
      .messages({
        'array.max': 'Cannot filter by more than 4 units at once'
      }),

    // Stock filtering
    minQuantity: Joi.number()
      .integer()
      .min(0)
      .optional(),

    maxQuantity: Joi.number()
      .integer()
      .min(1)
      .when('minQuantity', {
        is: Joi.exist(),
        then: Joi.number().greater(Joi.ref('minQuantity'))
      })
      .optional()
      .messages({
        'number.greater': 'Maximum quantity must be greater than minimum quantity'
      }),

    // Date filtering
    createdAfter: Joi.date()
      .iso()
      .optional(),

    createdBefore: Joi.date()
      .iso()
      .optional(),

    updatedAfter: Joi.date()
      .iso()
      .optional(),

    updatedBefore: Joi.date()
      .iso()
      .optional(),

    // Mobile app specific filters
    hasImages: Joi.boolean()
      .optional(),

    // Fresh grocery specific (home_fresh_app)
    isOrganic: Joi.boolean()
      .optional(),

    isVegetarian: Joi.boolean()
      .optional(),

    // Restaurant specific (RFS-Mobile-App)
    mealType: Joi.string()
      .valid('breakfast', 'lunch', 'dinner', 'snacks', 'beverages')
      .optional(),

    spiceLevel: Joi.string()
      .valid('mild', 'medium', 'hot', 'extra_hot')
      .optional(),

    // SmartFlow specific filters
    workflow: Joi.string()
      .max(100)
      .optional(),

    status: Joi.string()
      .valid('pending', 'approved', 'rejected', 'processing')
      .optional()

  }).optional()
});

/**
 * Product ID validation schema
 * For single product operations
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export const productIdSchema = Joi.object({
  params: Joi.object({
    id: objectIdValidator.required().messages({
      'any.required': 'Product ID is required'
    })
  }).required()
});


/**
 * Product image update validation schema
 * For separate image management
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export const updateProductImagesSchema = Joi.object({
  body: Joi.object({
    images: Joi.array()
      .items(
        Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .messages({
            'string.uri': 'Each image must be a valid HTTP/HTTPS URL'
          })
      )
      .min(0)
      .max(10)
      .required()
      .messages({
        'array.max': 'Cannot have more than 10 images',
        'any.required': 'Images array is required'
      })
  }).required(),

  params: Joi.object({
    id: objectIdValidator.required()
  }).required()
});



export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  sku: string;
  images?: string[];
  quantity: number;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  brand?: string;
  unit: ValidUnit;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  slug?: string;
  updatedAt?: Date;
}

export interface GetProductsInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  categoryId?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  brands?: string[];
  unit?: ValidUnit;
  units?: ValidUnit[];
  minQuantity?: number;
  maxQuantity?: number;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  hasImages?: boolean;
  isOrganic?: boolean;
  isVegetarian?: boolean;
  mealType?: string;
  spiceLevel?: string;
  workflow?: string;
  status?: string;
}

export interface BulkProductOperation {
  productIds: string[];
  action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete';
}

export interface UpdateProductImagesInput {
  images: string[];
}


/**
 * Export all schemas and utilities
 * @author MarotiKathoke
 * @created 2025-09-13 10:58:50
 */
export default {
  productSchema,
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  productIdSchema,
  updateProductImagesSchema,

};