// src/features/kisan-community/kisan-community.validator.ts

import Joi from 'joi';
import { idParamSchema } from '../constants/common.validator';


// Schema for creating a new entry (all fields except email are required)
export const createKisanCommunitySchema = Joi.object({
  farmerName: Joi.string().min(3).required().messages({
    'string.base': 'Farmer name must be a string.',
    'string.min': 'Farmer name must be at least 3 characters.',
    'any.required': 'Farmer name is required.',
  }),
  farmName: Joi.string().min(3).required().messages({
    'string.base': 'Farm name must be a string.',
    'string.min': 'Farm name is required.',
    'any.required': 'Farm name is required.',
  }),
  farmLocation: Joi.string().min(10).required().messages({
    'string.min': 'Farm location must be at least 10 characters.',
    'any.required': 'Farm location is required.',
  }),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be 10 digits.',
      'any.required': 'Mobile number is required.',
    }),
  email: Joi.string().email().optional().allow('').messages({
    'string.email': 'Invalid email address.',
  }),
  products: Joi.string().min(5).required().messages({
    'string.min': 'Products list must be at least 5 characters.',
    'any.required': 'Products list is required.',
  }),
  description: Joi.string().min(20).required().messages({
    'string.min': 'Description must be at least 20 characters.',
    'any.required': 'Description is required.',
  }),
});

// Schema for updating an entry (all fields are optional)
export const updateKisanCommunitySchema = Joi.object({
  farmerName: Joi.string().min(3).optional(),
  farmName: Joi.string().min(3).optional(),
  farmLocation: Joi.string().min(10).optional(),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .optional(),
  email: Joi.string().email().optional().allow(''),
  products: Joi.string().min(5).optional(),
  description: Joi.string().min(20).optional(),
});

// Schema for filtering and pagination queries
export const filterQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional().allow(''),
}).unknown(true); // Allow other query params

export { idParamSchema };