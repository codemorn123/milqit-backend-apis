
import Joi from 'joi';



import { CommonEnums } from '../enums/common.enums';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Category name must have at least 2 characters.',
    'string.max': 'Category name cannot exceed 100 characters.',
    'any.required': 'Category name is a required field.',
  }),
  description: Joi.string().optional().allow(''),

  parentId: Joi.string().optional().allow(null, '').messages({
    'string.pattern.name': 'Parent ID must be a valid MongoDB ObjectId.',
  }),
  // icon: Joi.string().uri().optional().allow(null, '').messages({
  //   'string.uri': 'Icon must be a valid web address.',
  // }),
  backgroundColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().messages({
    'string.pattern.base': 'Background color must be a valid hex code (e.g., #FF5733).',
  }).default('#FF5733'),
  textColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().messages({
    'string.pattern.base': 'Text color must be a valid hex code (e.g., #FFFFFF).',
  }),
  deepLink: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Deep link must be a valid web address.',
  }),
  isActive: Joi.boolean().optional().default(true),
  status: Joi.string().valid(
    CommonEnums.status.ACTIVE,
    CommonEnums.status.INACTIVE,
    CommonEnums.status.DEACTIVE
  ).optional().default(CommonEnums.status.ACTIVE),
  slug: Joi.string().optional().allow(null, ''),
});



export const updateCategorySchema = createCategorySchema;