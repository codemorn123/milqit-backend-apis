import Joi from 'joi';

export const refundQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(20),
    status: Joi.string().valid('pending', 'processing', 'completed', 'rejected', 'failed').optional(),
    orderId: Joi.string().optional(),
    userId: Joi.string().optional(),
});

export const processRefundSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
    adminNotes: Joi.string().optional().allow(''),
    rejectionReason: Joi.string().when('status', {
        is: 'rejected',
        then: Joi.required(),
        otherwise: Joi.optional().allow('')
    })
});
