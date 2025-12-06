import Joi from 'joi';

export const startTrackingSchema = Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid userId format'),
    userType: Joi.string().valid('customer', 'delivery_partner').required(),
    orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    sessionId: Joi.string().required()
});

export const updateLocationSchema = Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid userId format'),
    userType: Joi.string().valid('customer', 'delivery_partner').required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    sessionId: Joi.string().required(),
    speed: Joi.number().min(0).optional(),
    accuracy: Joi.number().min(0).optional(),
    heading: Joi.number().min(0).max(360).optional(),
    batteryLevel: Joi.number().min(0).max(100).optional()
});

export const stopTrackingSchema = Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid userId format'),
    sessionId: Joi.string().required(),
    orderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
});

export const nearbyPartnersSchema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    maxDistance: Joi.number().min(0).optional()
});
