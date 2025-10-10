import Joi from 'joi';

export const createOrderSchema = Joi.object({
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    }),
  
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid product ID format',
            'any.required': 'Product ID is required'
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
          })
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'Order must have at least one item',
      'any.required': 'Items are required'
    }),
  
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required().messages({
      'any.required': 'Full name is required'
    }),
    phone: Joi.string()
      .pattern(/^[+]?[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid phone number format',
        'any.required': 'Phone number is required'
      }),
    addressLine1: Joi.string().trim().required().messages({
      'any.required': 'Address line 1 is required'
    }),
    addressLine2: Joi.string().trim().optional().allow(''),
    city: Joi.string().trim().required().messages({
      'any.required': 'City is required'
    }),
    state: Joi.string().trim().required().messages({
      'any.required': 'State is required'
    }),
    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        'string.pattern.base': 'Pincode must be 6 digits',
        'any.required': 'Pincode is required'
      }),
    landmark: Joi.string().trim().optional().allow('')
  }).required(),
  
  paymentMethod: Joi.string()
    .valid('card', 'upi', 'netbanking', 'wallet', 'cod')
    .required()
    .messages({
      'any.only': 'Invalid payment method',
      'any.required': 'Payment method is required'
    }),
  
  notes: Joi.string().trim().optional().allow('')
});

export const updateOrderSchema = Joi.object({
  orderStatus: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    .optional(),
  
  paymentStatus: Joi.string()
    .valid('pending', 'paid', 'failed', 'refunded')
    .optional(),
  
  trackingNumber: Joi.string().trim().optional(),
  
  estimatedDelivery: Joi.date().optional(),
  
  cancellationReason: Joi.string().trim().optional()
}).min(1);