import Joi from 'joi';

/**
 * Admin create delivery boy validation schema
 */
export const adminCreateDeliveryBoySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required'
        }),
    phone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number in E.164 format (e.g., +911234567890)',
            'any.required': 'Phone number is required'
        }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    password: Joi.string()
        .min(6)
        .optional()
        .messages({
            'string.min': 'Password must be at least 6 characters long'
        }),
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
    aadharNumber: Joi.string()
        .trim()
        .length(12)
        .pattern(/^\d{12}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Aadhar number must be 12 digits',
            'string.length': 'Aadhar number must be 12 digits'
        }),
    panNumber: Joi.string()
        .trim()
        .uppercase()
        .length(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid PAN number'
        }),
    deliveryZone: Joi.array()
        .items(Joi.string())
        .optional(),
    isActive: Joi.boolean()
        .optional()
        .default(true),
    emergencyContactName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    emergencyContactPhone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .optional()
});

/**
 * Admin update delivery boy validation schema
 */
export const adminUpdateDeliveryBoySchema = Joi.object({
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
    aadharNumber: Joi.string()
        .trim()
        .length(12)
        .pattern(/^\d{12}$/)
        .optional(),
    panNumber: Joi.string()
        .trim()
        .uppercase()
        .length(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .optional(),
    deliveryZone: Joi.array()
        .items(Joi.string())
        .optional(),
    isActive: Joi.boolean()
        .optional(),
    isDocumentVerified: Joi.boolean()
        .optional(),
    isBackgroundCheckDone: Joi.boolean()
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
        }),
    emergencyContactName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    emergencyContactPhone: Joi.string()
        .pattern(/^\+[1-9]\d{1,14}$/)
        .optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

/**
 * Toggle delivery boy status validation schema
 */
export const toggleDeliveryBoyStatusSchema = Joi.object({
    isActive: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Status is required'
        }),
    reason: Joi.string()
        .trim()
        .max(500)
        .optional()
});

/**
 * Verify delivery boy documents validation schema
 */
export const verifyDeliveryBoyDocumentsSchema = Joi.object({
    isDocumentVerified: Joi.boolean()
        .required()
        .messages({
            'any.required': 'Document verification status is required'
        }),
    isBackgroundCheckDone: Joi.boolean()
        .optional(),
    verificationNotes: Joi.string()
        .trim()
        .max(1000)
        .optional()
});

/**
 * Assign delivery zones validation schema
 */
export const assignDeliveryZonesSchema = Joi.object({
    deliveryZone: Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one delivery zone is required',
            'any.required': 'Delivery zones are required'
        })
});

/**
 * Delivery boy list query validation schema
 */
export const deliveryBoyListQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .default(1),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .default(10),
    search: Joi.string()
        .trim()
        .optional(),
    isActive: Joi.boolean()
        .optional(),
    isAvailable: Joi.boolean()
        .optional(),
    isDocumentVerified: Joi.boolean()
        .optional(),
    vehicleType: Joi.string()
        .valid('bike', 'scooter', 'bicycle', 'car')
        .optional(),
    deliveryZone: Joi.string()
        .trim()
        .optional(),
    sortBy: Joi.string()
        .valid('name', 'createdAt', 'totalDeliveries', 'averageRating')
        .optional()
        .default('createdAt'),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('desc')
});

/**
 * Bulk operation validation schema
 */
export const bulkDeliveryBoyOperationSchema = Joi.object({
    deliveryBoyIds: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one delivery boy ID is required',
            'any.required': 'Delivery boy IDs are required'
        }),
    operation: Joi.string()
        .valid('activate', 'deactivate', 'verify', 'delete')
        .required()
        .messages({
            'any.only': 'Operation must be one of: activate, deactivate, verify, delete',
            'any.required': 'Operation is required'
        }),
    reason: Joi.string()
        .trim()
        .max(500)
        .optional()
});
