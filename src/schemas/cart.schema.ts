import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Custom ObjectId validator
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
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
 * Add item to cart validation
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const addToCartSchema = Joi.object({
  body: Joi.object({
    productId: objectIdValidator.required().messages({
      'any.required': 'Product ID is required'
    }),
    
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .required()
      .messages({
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Maximum 50 items allowed per product',
        'any.required': 'Quantity is required'
      }),
    
    notes: Joi.string()
      .max(200)
      .trim()
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 200 characters'
      }),
    
    deviceInfo: Joi.object({
      platform: Joi.string().valid('ios', 'android').required(),
      version: Joi.string().max(20).required(),
      deviceId: Joi.string().max(255).required()
    }).optional()
  }).required()
});

/**
 * Update cart item validation
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const updateCartItemSchema = Joi.object({
  params: Joi.object({
    productId: objectIdValidator.required()
  }).required(),
  
  body: Joi.object({
    quantity: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .required()
      .messages({
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative',
        'number.max': 'Maximum 50 items allowed per product',
        'any.required': 'Quantity is required'
      }),
    
    notes: Joi.string()
      .max(200)
      .trim()
      .optional()
      .allow('')
  }).required()
});

/**
 * Apply coupon validation
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const applyCouponSchema = Joi.object({
  body: Joi.object({
    couponCode: Joi.string()
      .trim()
      .uppercase()
      .min(3)
      .max(20)
      .pattern(/^[A-Z0-9]+$/)
      .required()
      .messages({
        'string.min': 'Coupon code must be at least 3 characters',
        'string.max': 'Coupon code cannot exceed 20 characters',
        'string.pattern.base': 'Coupon code must contain only uppercase letters and numbers',
        'any.required': 'Coupon code is required'
      })
  }).required()
});

/**
 * Set delivery info validation
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const setDeliveryInfoSchema = Joi.object({
  body: Joi.object({
    deliveryType: Joi.string()
      .valid('standard', 'express', 'scheduled', 'pickup')
      .required()
      .messages({
        'any.only': 'Delivery type must be one of: standard, express, scheduled, pickup',
        'any.required': 'Delivery type is required'
      }),
    
    deliveryAddress: objectIdValidator.when('deliveryType', {
      not: 'pickup',
      then: Joi.required(),
      otherwise: Joi.optional()
    }).messages({
      'any.required': 'Delivery address is required for home delivery'
    }),
    
    scheduledDelivery: Joi.date()
      .iso()
      .min('now')
      .when('deliveryType', {
        is: 'scheduled',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'date.min': 'Scheduled delivery must be in the future',
        'any.required': 'Scheduled delivery time is required for scheduled delivery'
      }),
    
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().max(500).required()
    }).optional()
  }).required()
});

/**
 * Get cart validation (query parameters)
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const getCartSchema = Joi.object({
  query: Joi.object({
    includeUnavailable: Joi.boolean().default(false),
    currency: Joi.string().valid('INR', 'USD').default('INR'),
    calculateDelivery: Joi.boolean().default(true)
  }).optional()
});

/**
 * Clear cart validation
 * @author MarotiKathoke
 * @created 2025-09-13 15:30:15
 */
export const clearCartSchema = Joi.object({
  body: Joi.object({
    confirmClear: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'Cart clear must be confirmed',
        'any.required': 'Confirmation is required to clear cart'
      })
  }).required()
});

export default {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  setDeliveryInfoSchema,
  getCartSchema,
  clearCartSchema
};