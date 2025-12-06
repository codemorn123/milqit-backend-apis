import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    // Phone update usually requires separate flow with OTP, so we might not allow it here directly
    // or we allow it but it needs verification. For now, let's assume phone is immutable here.
});

export const addAddressSchema = Joi.object({
    label: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
    landmark: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    addressType: Joi.string().valid('home', 'work', 'other').required(),
    isPrimary: Joi.boolean().optional()
});

export const addressIdSchema = Joi.object({
    addressId: Joi.string().required()
});
