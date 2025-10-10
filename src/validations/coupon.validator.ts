import Joi from 'joi';

// Re-using your existing ID schema
export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.pattern.base': '"id" must be a valid MongoDB ObjectID',
  }),
});

export const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(4).max(20).required(),
  description: Joi.string().min(10).required(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().positive().required(),
  maxDiscountAmount: Joi.number().positive().when('discountType', {
    is: 'percentage',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  minOrderValue: Joi.number().min(0).default(0),
  validFrom: Joi.date().iso().required(),
  validUntil: Joi.date().iso().greater(Joi.ref('validFrom')).required(),
  totalUsageLimit: Joi.number().integer().min(1).required(),
  usageLimitPerUser: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
});

export const updateCouponSchema = Joi.object({
  description: Joi.string().min(10).optional(),
  discountType: Joi.string().valid('percentage', 'fixed').optional(),
  discountValue: Joi.number().positive().optional(),
  maxDiscountAmount: Joi.number().positive().optional(),
  minOrderValue: Joi.number().min(0).optional(),
  validFrom: Joi.date().iso().optional(),
  validUntil: Joi.date().iso().greater(Joi.ref('validFrom')).optional(),
  totalUsageLimit: Joi.number().integer().min(1).optional(),
  usageLimitPerUser: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const applyCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().required(),
  orderTotal: Joi.number().positive().required(),
});

export const filterQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().optional().allow(''),
    isActive: Joi.boolean().optional(),
});