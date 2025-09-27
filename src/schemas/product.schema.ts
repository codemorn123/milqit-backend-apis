import { objectIdValidator } from './../constants/common.validator';
import Joi from 'joi';

export type ValidUnit = 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen' | 'bundle';
export type ProductType = 'Food' | 'Electronics' | 'Apparel' | 'General';

// Common image schema
export const imageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'Image URL must be a valid URI',
    'any.required': 'Image URL is required'
  }),
  key: Joi.string().required().messages({
    'any.required': 'Image key is required'
  })
});

// Product details schemas for different product types
export const foodProductDetailsSchema = Joi.object({
  fssaiLicenceNumber: Joi.string().trim().optional().messages({
    'string.empty': 'FSSAI licence number cannot be empty'
  }),
  isVegetarian: Joi.boolean().default(true).messages({
    'boolean.base': 'Vegetarian flag must be a boolean value'
  }),
  shelfLife: Joi.string().trim().optional().messages({
    'string.empty': 'Shelf life cannot be empty'
  }),
  keyFeatures: Joi.array().items(Joi.string().trim()).optional().messages({
    'array.base': 'Key features must be an array of strings'
  })
}).optional();

export const electronicsProductDetailsSchema = Joi.object({
  modelNumber: Joi.string().trim().optional().messages({
    'string.empty': 'Model number cannot be empty'
  }),
  warranty: Joi.string().trim().optional().messages({
    'string.empty': 'Warranty information cannot be empty'
  }),
  specifications: Joi.array().items(
    Joi.object({
      key: Joi.string().required().messages({
        'any.required': 'Specification key is required'
      }),
      value: Joi.string().required().messages({
        'any.required': 'Specification value is required'
      })
    })
  ).optional().messages({
    'array.base': 'Specifications must be an array of key-value pairs'
  })
}).optional();

export const apparelProductDetailsSchema = Joi.object({
  size: Joi.array().items(Joi.string().trim()).optional().messages({
    'array.base': 'Sizes must be an array of strings'
  }),
  color: Joi.array().items(Joi.string().trim()).optional().messages({
    'array.base': 'Colors must be an array of strings'
  }),
  material: Joi.string().trim().optional().messages({
    'string.empty': 'Material cannot be empty'
  }),
  careInstructions: Joi.array().items(Joi.string().trim()).optional().messages({
    'array.base': 'Care instructions must be an array of strings'
  })
}).optional();

export const generalProductDetailsSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.array(),
    Joi.object()
  )
).optional();

// Dynamic product details validation based on product type
const getProductDetailsSchema = (productType: ProductType) => {
  switch (productType) {
    case 'Food':
      return foodProductDetailsSchema;
    case 'Electronics':
      return electronicsProductDetailsSchema;
    case 'Apparel':
      return apparelProductDetailsSchema;
    case 'General':
    default:
      return generalProductDetailsSchema;
  }
};

// Main product creation schema
export const createProductSchema = Joi.object({
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

  description: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Product description cannot exceed 2000 characters'
    }),

  // Blinkit-style pricing
  mrp: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'MRP must be a positive number',
      'number.precision': 'MRP must have at most 2 decimal places',
      'any.required': 'MRP (Maximum Retail Price) is required'
    }),

  sellingPrice: Joi.number()
    .positive()
    .precision(2)
    .required()
    .custom((value, helpers) => {
      const { mrp } = helpers.state.ancestors[0];
      if (mrp && value > mrp) {
        return helpers.error('sellingPrice.greater');
      }
      return value;
    })
    .messages({
      'number.positive': 'Selling price must be a positive number',
      'number.precision': 'Selling price must have at most 2 decimal places',
      'any.required': 'Selling price is required',
      'sellingPrice.greater': 'Selling price cannot be greater than MRP'
    }),

  unit: Joi.string()
    .valid('piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle')
    .required()
    .messages({
      'string.valid': 'Product unit must be one of: piece, kg, gm, litre, ml, pack, dozen, bundle',
      'any.required': 'Product unit is required'
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .max(10000)
    .required()
    .messages({
      'number.integer': 'Product quantity must be an integer',
      'number.min': 'Product quantity cannot be negative',
      'number.max': 'Product quantity cannot exceed 10,000',
      'any.required': 'Product quantity is required'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),

  category: objectIdValidator
    .required()
    .messages({
      'any.required': 'Product category is required'
    }),

  sku: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'SKU cannot exceed 100 characters'
    }),

  brand: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Brand name must be at least 1 character long',
      'string.max': 'Brand name cannot exceed 100 characters'
    }),

  productType: Joi.string()
    .valid('Food', 'Electronics', 'Apparel', 'General')
    .required()
    .messages({
      'string.valid': 'Product type must be one of: Food, Electronics, Apparel, General',
      'any.required': 'Product type is required'
    }),

  productDetails: Joi.when('productType', {
    is: 'Food',
    then: foodProductDetailsSchema.default({}),
    otherwise: Joi.when('productType', {
      is: 'Electronics',
      then: electronicsProductDetailsSchema.default({}),
      otherwise: Joi.when('productType', {
        is: 'Apparel',
        then: apparelProductDetailsSchema.default({}),
        otherwise: generalProductDetailsSchema.default({})
      })
    })
  }),

  images: Joi.array()
    .items(imageSchema)
    .optional()
    .messages({
      'array.base': 'Images must be an array'
    }),

  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Active status must be a boolean value'
    }),

  isFeatured: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Featured status must be a boolean value'
    }),

  inStock: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'In stock status must be a boolean value'
    }),

  averageRating: Joi.number()
    .min(0)
    .max(5)
    .precision(2)
    .default(0)
    .optional()
    .messages({
      'number.min': 'Average rating cannot be less than 0',
      'number.max': 'Average rating cannot be more than 5',
      'number.precision': 'Average rating must have at most 2 decimal places'
    }),

  reviewCount: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional()
    .messages({
      'number.integer': 'Review count must be an integer',
      'number.min': 'Review count cannot be negative'
    })
});

// Product update schema (all fields optional except some validations)
export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .optional()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 200 characters',
      'string.empty': 'Product name cannot be empty'
    }),

  description: Joi.string()
    .trim()
    .max(2000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Product description cannot exceed 2000 characters'
    }),

  mrp: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'MRP must be a positive number',
      'number.precision': 'MRP must have at most 2 decimal places'
    }),

  sellingPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Selling price must be a positive number',
      'number.precision': 'Selling price must have at most 2 decimal places'
    }),

  unit: Joi.string()
    .valid('piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle')
    .optional()
    .messages({
      'string.valid': 'Product unit must be one of: piece, kg, gm, litre, ml, pack, dozen, bundle'
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .max(10000)
    .optional()
    .messages({
      'number.integer': 'Product quantity must be an integer',
      'number.min': 'Product quantity cannot be negative',
      'number.max': 'Product quantity cannot exceed 10,000'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative'
    }),

  category: objectIdValidator.optional(),

  sku: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'SKU cannot exceed 100 characters'
    }),

  brand: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Brand name must be at least 1 character long',
      'string.max': 'Brand name cannot exceed 100 characters'
    }),

  productType: Joi.string()
    .valid('Food', 'Electronics', 'Apparel', 'General')
    .optional()
    .messages({
      'string.valid': 'Product type must be one of: Food, Electronics, Apparel, General'
    }),

  productDetails: Joi.alternatives().try(
    foodProductDetailsSchema,
    electronicsProductDetailsSchema,
    apparelProductDetailsSchema,
    generalProductDetailsSchema
  ).optional(),

  images: Joi.array()
    .items(imageSchema)
    .optional()
    .messages({
      'array.base': 'Images must be an array'
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Active status must be a boolean value'
    }),

  isFeatured: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Featured status must be a boolean value'
    }),

  inStock: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'In stock status must be a boolean value'
    }),

  averageRating: Joi.number()
    .min(0)
    .max(5)
    .precision(2)
    .optional()
    .messages({
      'number.min': 'Average rating cannot be less than 0',
      'number.max': 'Average rating cannot be more than 5',
      'number.precision': 'Average rating must have at most 2 decimal places'
    }),

  reviewCount: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Review count must be an integer',
      'number.min': 'Review count cannot be negative'
    })
});

// Product filter/query schema
export const getProductsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional()
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  search: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query cannot exceed 200 characters'
    }),

  category: objectIdValidator.optional(),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Brand filter cannot exceed 100 characters'
    }),

  productType: Joi.string()
    .valid('Food', 'Electronics', 'Apparel', 'General')
    .optional()
    .messages({
      'string.valid': 'Product type must be one of: Food, Electronics, Apparel, General'
    }),

  minPrice: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      'number.min': 'Minimum price cannot be negative',
      'number.precision': 'Minimum price must have at most 2 decimal places'
    }),

  maxPrice: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .custom((value, helpers) => {
      const { minPrice } = helpers.state.ancestors[0];
      if (minPrice && value < minPrice) {
        return helpers.error('maxPrice.less');
      }
      return value;
    })
    .messages({
      'number.min': 'Maximum price cannot be negative',
      'number.precision': 'Maximum price must have at most 2 decimal places',
      'maxPrice.less': 'Maximum price cannot be less than minimum price'
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Active filter must be a boolean value'
    }),

  isFeatured: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Featured filter must be a boolean value'
    }),

  inStock: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'In stock filter must be a boolean value'
    }),

  sortBy: Joi.string()
    .valid('name', 'mrp', 'sellingPrice', 'createdAt', 'updatedAt', 'averageRating', 'quantity', 'brand')
    .default('createdAt')
    .optional()
    .messages({
      'string.valid': 'Sort field must be one of: name, mrp, sellingPrice, createdAt, updatedAt, averageRating, quantity, brand'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .optional()
    .messages({
      'string.valid': 'Sort order must be either asc or desc'
    })
});

// Stock update schema
export const updateStockSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(0)
    .max(10000)
    .required()
    .messages({
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity cannot be negative',
      'number.max': 'Quantity cannot exceed 10,000',
      'any.required': 'Quantity is required'
    })
});

// Bulk delete schema
export const bulkDeleteProductsSchema = Joi.object({
  productIds: Joi.array()
    .items(objectIdValidator)
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one product ID is required',
      'array.max': 'Cannot delete more than 100 products at once',
      'any.required': 'Product IDs array is required'
    })
});

// Remove images schema
export const removeImagesSchema = Joi.object({
  imageKeys: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .max(20)
    .required()
    .messages({
      'array.min': 'At least one image key is required',
      'array.max': 'Cannot remove more than 20 images at once',
      'any.required': 'Image keys array is required'
    })
});

// Search schema
export const searchProductsSchema = getProductsSchema.keys({
  q: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query cannot exceed 200 characters',
      'any.required': 'Search query is required'
    })
});

// Export all schemas
export default {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  updateStockSchema,
  bulkDeleteProductsSchema,
  removeImagesSchema,
  searchProductsSchema,
  imageSchema,
  foodProductDetailsSchema,
  electronicsProductDetailsSchema,
  apparelProductDetailsSchema,
  generalProductDetailsSchema
};