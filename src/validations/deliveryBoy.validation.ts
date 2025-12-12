import Joi from 'joi';

/**
 * Send OTP validation schema
 */
export const deliveryBoySendOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number in E.164 format (e.g., +911234567890)',
            'any.required': 'Phone number is required'
        })
});

/**
 * Verify OTP validation schema
 */
export const deliveryBoyVerifyOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number in E.164 format (e.g., +911234567890)',
            'any.required': 'Phone number is required'
        }),
    otp: Joi.string()
        .length(6)
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only digits',
            'any.required': 'OTP is required'
        }),
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters'
        }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    vehicleType: Joi.string()
        .valid('bike', 'scooter', 'bicycle', 'car')
        .optional()
        .messages({
            'any.only': 'Vehicle type must be one of: bike, scooter, bicycle, car'
        }),
    vehicleNumber: Joi.string()
        .trim()
        .uppercase()
        .optional()
});

/**
 * Resend OTP validation schema
 */
export const deliveryBoyResendOtpSchema = deliveryBoySendOtpSchema;

/**
 * Update delivery boy profile validation schema
 */
export const updateDeliveryBoyProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    email: Joi.string()
        .email()
        .optional(),
    vehicleType: Joi.string()
        .valid('bike', 'scooter', 'bicycle', 'car')
        .optional(),
    vehicleNumber: Joi.string()
        .trim()
        .uppercase()
        .optional(),
    drivingLicenseNumber: Joi.string()
        .trim()
        .uppercase()
        .optional(),
    deliveryZone: Joi.array()
        .items(Joi.string())
        .optional(),
    emergencyContactName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    emergencyContactPhone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .optional(),
    bankAccountNumber: Joi.string()
        .trim()
        .optional(),
    ifscCode: Joi.string()
        .trim()
        .uppercase()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid IFSC code'
        }),
    bankAccountHolderName: Joi.string()
        .trim()
        .optional(),
    upiId: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[\w.-]+@[\w.-]+$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid UPI ID'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

/**
 * Update delivery boy location validation schema
 */
export const updateDeliveryBoyLocationSchema = Joi.object({
    latitude: Joi.number()
        .min(-90)
        .max(90)
        .required()
        .messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90',
            'any.required': 'Latitude is required'
        }),
    longitude: Joi.number()
        .min(-180)
        .max(180)
        .required()
        .messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180',
            'any.required': 'Longitude is required'
        })
});

/**
 * Update delivery boy availability validation schema
 */
export const updateDeliveryBoyAvailabilitySchema = Joi.object({
    isAvailable: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Availability status is required'
        })
});

/**
 * Refresh token validation schema
 */
export const deliveryBoyRefreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required'
        })
});
