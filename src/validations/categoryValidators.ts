import Joi from 'joi';
import mongoose from 'mongoose';

// Custom Joi extensions for ObjectId
const customJoi = Joi.extend({
  type: 'objectId',
  base: Joi.string(),
  messages: {
    'objectId.invalid': 'Invalid ObjectId format'
  },
  validate(value, helpers) {
    if (!mongoose.isValidObjectId(value)) {
      return { value, errors: helpers.error('objectId.invalid') };
    }
    return { value };
  }
});

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 100 characters',
      'any.required': 'Category name is required'
    }),
  
  slug: Joi.string()
    .min(2)
    .max(120)
    .trim()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.min': 'Slug must be at least 2 characters',
      'string.max': 'Slug cannot exceed 120 characters',
      'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
      'any.required': 'Slug is required'
    }),
  
  description: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  parentId: Joi.alternatives()
    .try(
      customJoi.objectId(),
      Joi.string().valid('null', ''),
      Joi.allow(null)
    )
    .optional()
    .messages({
      'objectId.invalid': 'Invalid parent category ID format'
    }),
  
    isActive: Joi.boolean()
    .optional()
    .default(true),
    
  displayOrder: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'Display order must be an integer',
      'number.min': 'Display order cannot be negative'
    }),
});