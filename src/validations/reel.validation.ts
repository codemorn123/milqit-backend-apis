import Joi from 'joi';

export const createReelSchema = Joi.object({
    title: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Title must have at least 2 characters.',
        'string.max': 'Title cannot exceed 100 characters.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().optional().allow(''),
    isActive: Joi.boolean().optional().default(true),
});

export const reelQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().optional().allow(''),
});

export const addCommentSchema = Joi.object({
    content: Joi.string().min(1).max(500).required().messages({
        'string.empty': 'Comment cannot be empty.',
        'string.max': 'Comment cannot exceed 500 characters.',
        'any.required': 'Content is required.',
    }),
});

export const commentQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(20), // Higher limit for comments usually
});

export const updateReelSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    description: Joi.string().optional().allow(''),
    isActive: Joi.boolean().optional(),
});
