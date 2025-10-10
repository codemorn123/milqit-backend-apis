import Joi from 'joi';

export const initiateRefundSchema = Joi.object({
  orderId: Joi.string().hex().length(24).required().messages({
    'string.pattern.base': '"orderId" must be a valid MongoDB ObjectID',
  }),
  
  amount: Joi.number().positive().required().messages({
      'number.base': 'Refund amount must be a number.',
      'number.positive': 'Refund amount must be a positive number.',
      'any.required': 'Refund amount is required.',
  }),
  reason: Joi.string().min(10).max(250).required().messages({
      'string.empty': 'A reason for the refund is required.',
      'string.min': 'The reason must be at least 10 characters long.',
  }),
  adminNotes: Joi.string().optional().allow(''),
});






