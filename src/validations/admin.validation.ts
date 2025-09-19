import Joi from 'joi';

export const createAdminSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
  phone: Joi.string()
    .required()
    .messages({
      'string.base': 'Phone must be a string',
      'any.required': 'Phone is required'
    }),
  roles: Joi.array()
    .items(Joi.string().valid('admin', 'manager', 'staff', 'vip', 'customer'))
    .messages({
      'array.includes': 'Roles must be one of admin, manager, staff, vip, customer'
    }),
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isActive must be a boolean'
    })
});