import Joi from 'joi';

export const createRefundSchema = Joi.object({
    orderId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid orderId format'),
    reason: Joi.string().required().min(5).max(200),
    description: Joi.string().optional().max(1000),
    amount: Joi.number().min(1).optional(), // Optional if full refund
    images: Joi.array().items(Joi.string().uri()).optional()
});
