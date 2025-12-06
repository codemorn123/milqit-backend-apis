import Joi from 'joi';

// Re-using your existing ID schema
export const idParamSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": '"id" must be a valid MongoDB ObjectID',
      "any.required": '"id" is required',
    }),
});

export const createNotificationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 3 characters long.',
  }),
  message: Joi.string().min(10).max(500).required().messages({
    'string.empty': 'Message is required.',
    'string.min': 'Message must be at least 10 characters long.',
  }),
  targetAudience: Joi.string().valid('all', 'customers', 'vendors').required(),
  // Ensure scheduledAt is a valid ISO date
  scheduledAt: Joi.date().iso().optional().allow(null).messages({
    'date.format': 'Scheduled time must be in a valid ISO 8601 date format.',
  }),
  imageUrl: Joi.string().uri().optional().allow(''),
});

export const updateNotificationSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  message: Joi.string().min(10).max(500).optional(),
  targetAudience: Joi.string().valid('all', 'customers', 'vendors').optional(),
  scheduledAt: Joi.date().iso().optional().allow(null),
  imageUrl: Joi.string().uri().optional().allow(''),
}).min(1);

export const filterQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  search: Joi.string().optional().allow(''),
  status: Joi.string().valid('pending', 'sent', 'failed').optional(),
});