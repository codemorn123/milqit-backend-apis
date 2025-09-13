// import { z } from 'zod';

// /**
//  * Configuration for OTP validation
//  */
// const OTP_CONFIG = {
//   length: 6,
//   expiry: 10 * 60, // 10 minutes in seconds
// };

// /**
//  * Schema for validating phone numbers in E.164 format
//  * Example: +919876543210
//  */
// const phoneSchema = z.string()
//   .trim()
//   .regex(/^\+[1-9]\d{1,14}$/, {
//     message: 'Phone number must be in E.164 format (e.g., +919876543210)'
//   });

// /**
//  * Schema for validating OTP codes
//  */
// const otpSchema = z.string()
//   .trim()
//   .regex(new RegExp(`^\\d{${OTP_CONFIG.length}}$`), {
//     message: `OTP must be exactly ${OTP_CONFIG.length} digits`
//   });

// /**
//  * Schema for validating user names
//  */
// const nameSchema = z.string()
//   .trim()
//   .min(2, { message: 'Name must be at least 2 characters' })
//   .max(50, { message: 'Name cannot exceed 50 characters' })
//   .regex(/^[a-zA-Z\s]+$/, { 
//     message: 'Name can only contain letters and spaces' 
//   });

// /**
//  * Schema for device IDs used for push notifications
//  */
// const deviceIdSchema = z.string()
//   .trim()
//   .min(5, { message: 'Device ID must be at least 5 characters' })
//   .optional();

// /**
//  * Schema for validating send OTP requests
//  */
// export const sendOtpSchema = z.object({
//   body: z.object({
//     phone: phoneSchema
//   })
// });

// /**
//  * Schema for validating verify OTP requests
//  * For new users, name is required
//  */
// export const verifyOtpSchema = z.object({
//   body: z.object({
//     phone: phoneSchema,
//     otp: otpSchema,
//     name: nameSchema.optional(),
//     deviceId: deviceIdSchema
//   })
// });

// /**
//  * Schema for validating password reset requests
//  */
// export const resetPasswordSchema = z.object({
//   body: z.object({
//     phone: phoneSchema,
//     otp: otpSchema,
//     newPassword: z.string()
//       .min(8, { message: 'Password must be at least 8 characters' })
//       .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
//       .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
//       .regex(/[0-9]/, { message: 'Password must contain at least one number' })
//   })
// });

// /**
//  * Schema for validating mobile login requests (for users with password)
//  */
// export const mobileLoginSchema = z.object({
//   body: z.object({
//     phone: phoneSchema,
//     password: z.string().min(1, { message: 'Password is required' })
//   })
// });

// /**
//  * Schema for validating mobile token refresh requests
//  */
// export const mobileRefreshTokenSchema = z.object({
//   body: z.object({
//     refreshToken: z.string().min(10, { message: 'Valid refresh token is required' })
//   })
// });

// /**
//  * Schema for updating user profile from mobile
//  */
// export const updateProfileSchema = z.object({
//   body: z.object({
//     name: nameSchema.optional(),
//     email: z.string().email({ message: 'Invalid email address' }).optional(),
//     deviceId: deviceIdSchema
//   }).refine(
//     (data) => Object.keys(data).length > 0,
//     {
//       message: "At least one field must be provided for update",
//       path: ["_"]
//     }
//   )
// });

// export default {
//   sendOtpSchema,
//   verifyOtpSchema,
//   resetPasswordSchema,
//   mobileLoginSchema,
//   mobileRefreshTokenSchema,
//   updateProfileSchema,
//   OTP_CONFIG
// };




import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Custom Joi extensions for mobile authentication
 * Optimized for React Native apps (RFS, SmartFlow, home_fresh_app, core_mobile_app, shree-react-naive-app)
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const customJoi = Joi.extend({
  type: 'objectId',
  base: Joi.string(),
  messages: {
    'objectId.invalid': 'Invalid ObjectId format'
  },
  validate(value, helpers) {
    if (!mongoose.isValidObjectId(value)) {
      return { value, errors: helpers.error('objectId.invalid') };
    }
    return { value };
  }
});

/**
 * Configuration for OTP validation
 * Mobile-optimized settings for React Native apps
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const OTP_CONFIG = {
  length: 6,
  expiry: 10 * 60, // 10 minutes in seconds
  maxAttempts: 3,
  cooldownPeriod: 60, // 1 minute between requests
  providers: {
    sms: {
      enabled: true,
      priority: 1
    },
    whatsapp: {
      enabled: true,
      priority: 2
    }
  }
} as const;

/**
 * Mobile app specific constants
 * Based on your GitHub repositories
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const MOBILE_AUTH_CONFIG = {
  // Session management
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  
  // Device management
  maxDevicesPerUser: 5,
  deviceIdMinLength: 10,
  
  // Security
  passwordMinLength: 8,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60, // 15 minutes
  
  // Mobile app specific
  supportedCountryCodes: ['+91', '+1', '+44', '+86'], // India, US, UK, China
  allowedNamePattern: /^[a-zA-Z\s\u0900-\u097F]+$/, // English + Devanagari for Indian names
} as const;

/**
 * Phone number validation schema
 * Supports E.164 format with country-specific validation
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const phoneSchema = Joi.string()
  .trim()
  .pattern(/^\+[1-9]\d{1,14}$/)
  .min(10)
  .max(16)
  .required()
  .custom((value, helpers) => {
    // Additional validation for supported country codes
    const supportedCodes = MOBILE_AUTH_CONFIG.supportedCountryCodes;
    const hasValidCountryCode = supportedCodes.some(code => value.startsWith(code));
    
    if (!hasValidCountryCode) {
      return helpers.error('phone.unsupportedCountry');
    }
    
    // India-specific validation (+91)
    if (value.startsWith('+91')) {
      if (value.length !== 13) {
        return helpers.error('phone.invalidIndianNumber');
      }
      const number = value.substring(3);
      if (!/^[6-9]\d{9}$/.test(number)) {
        return helpers.error('phone.invalidIndianFormat');
      }
    }
    
    return value;
  })
  .messages({
    'string.pattern.base': 'Phone number must be in E.164 format (e.g., +919876543210)',
    'string.min': 'Phone number must be at least 10 characters',
    'string.max': 'Phone number cannot exceed 16 characters',
    'phone.unsupportedCountry': 'Phone number country code is not supported',
    'phone.invalidIndianNumber': 'Indian phone number must be 13 characters including +91',
    'phone.invalidIndianFormat': 'Indian phone number must start with 6, 7, 8, or 9 after +91',
    'any.required': 'Phone number is required'
  });

/**
 * OTP validation schema
 * Mobile-optimized for React Native apps
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const otpSchema = Joi.string()
  .trim()
  .pattern(new RegExp(`^\\d{${OTP_CONFIG.length}}$`))
  .length(OTP_CONFIG.length)
  .required()
  .messages({
    'string.pattern.base': `OTP must be exactly ${OTP_CONFIG.length} digits`,
    'string.length': `OTP must be exactly ${OTP_CONFIG.length} characters`,
    'any.required': 'OTP is required'
  });

/**
 * Name validation schema
 * Supports multilingual names for Indian mobile apps
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const nameSchema = Joi.string()
  .trim()
  .min(2)
  .max(50)
  .pattern(MOBILE_AUTH_CONFIG.allowedNamePattern)
  .required()
  .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'string.pattern.base': 'Name can only contain letters, spaces, and Indian language characters',
    'any.required': 'Name is required'
  });

/**
 * Email validation schema
 * Mobile-optimized with domain validation
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ 
    minDomainSegments: 2,
    tlds: { allow: ['com', 'in', 'org', 'net', 'edu', 'gov'] }
  })
  .max(255)
  .optional()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 255 characters'
  });

/**
 * Device ID validation schema
 * For push notifications and device management
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const deviceIdSchema = Joi.string()
  .trim()
  .min(MOBILE_AUTH_CONFIG.deviceIdMinLength)
  .max(255)
  .optional()
  .messages({
    'string.min': `Device ID must be at least ${MOBILE_AUTH_CONFIG.deviceIdMinLength} characters`,
    'string.max': 'Device ID cannot exceed 255 characters'
  });

/**
 * Password validation schema
 * Strong password requirements for mobile security
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const passwordSchema = Joi.string()
  .min(MOBILE_AUTH_CONFIG.passwordMinLength)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .required()
  .messages({
    'string.min': `Password must be at least ${MOBILE_AUTH_CONFIG.passwordMinLength} characters`,
    'string.max': 'Password cannot exceed 128 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required'
  });

/**
 * Refresh token validation schema
 * For mobile session management
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
const refreshTokenSchema = Joi.string()
  .trim()
  .min(20)
  .max(500)
  .required()
  .messages({
    'string.min': 'Invalid refresh token format',
    'string.max': 'Invalid refresh token format',
    'any.required': 'Refresh token is required'
  });

/**
 * Send OTP validation schema
 * For mobile OTP requests (SMS/WhatsApp)
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const sendOtpSchema = Joi.object({
  phone: phoneSchema,
  provider: Joi.string()
    .valid('sms', 'whatsapp')
    .default('sms')
    .messages({
      'any.only': 'OTP provider must be either sms or whatsapp'
    }),
  
  purpose: Joi.string()
    .valid('login', 'register', 'password_reset', 'phone_verification')
    .default('login')
    .messages({
      'any.only': 'Purpose must be one of: login, register, password_reset, phone_verification'
    }),
  
  // Device info for security
  deviceInfo: Joi.object({
    platform: Joi.string().valid('ios', 'android').optional(),
    version: Joi.string().max(20).optional(),
    model: Joi.string().max(50).optional()
  }).optional()
  
}).required();

/**
 * Verify OTP validation schema
 * For mobile login/registration with OTP
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const verifyOtpSchema = Joi.object({
  phone: phoneSchema,
  otp: otpSchema,
  // Required for new user registration
  name: nameSchema.when('isNewUser', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  
  email: emailSchema,
  
  deviceId: deviceIdSchema,
  
  // Device information for push notifications
  deviceInfo: Joi.object({
    platform: Joi.string().valid('ios', 'android').required(),
    version: Joi.string().max(20).required(),
    model: Joi.string().max(50).optional(),
    pushToken: Joi.string().max(500).optional()
  }).optional(),
  
  // App-specific data
  appVersion: Joi.string().max(20).optional(),
  
  // Location for delivery apps (home_fresh_app)
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    address: Joi.string().max(500).optional()
  }).optional(),
  
  // User preferences
  preferences: Joi.object({
    language: Joi.string().valid('en', 'hi', 'mr', 'gu', 'ta', 'te').default('en'),
    notifications: Joi.boolean().default(true),
    marketing: Joi.boolean().default(false)
  }).optional()
  
}).required();

/**
 * Password reset validation schema
 * For mobile password reset flow
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    phone: phoneSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      }),
    
    deviceId: deviceIdSchema
    
  }).required()
});

/**
 * Mobile login validation schema
 * For users with existing passwords
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const mobileLoginSchema = Joi.object({
  body: Joi.object({
    phone: phoneSchema,
    password: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.min': 'Password is required',
        'any.required': 'Password is required'
      }),
    
    deviceId: deviceIdSchema,
    
    // Remember me option for mobile
    rememberMe: Joi.boolean().default(false),
    
    // Device info for security
    deviceInfo: Joi.object({
      platform: Joi.string().valid('ios', 'android').optional(),
      version: Joi.string().max(20).optional(),
      model: Joi.string().max(50).optional()
    }).optional()
    
  }).required()
});

/**
 * Mobile token refresh validation schema
 * For maintaining user sessions
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const mobileRefreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: refreshTokenSchema,
    deviceId: deviceIdSchema
  }).required()
});

/**
 * Update profile validation schema
 * For mobile profile management
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: nameSchema.optional(),
    email: emailSchema,
    
    // Profile image for mobile apps
    profileImage: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .optional()
      .messages({
        'string.uri': 'Profile image must be a valid URL'
      }),
    
    // Location for delivery apps
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional(),
      address: Joi.string().max(500).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      pincode: Joi.string().pattern(/^\d{6}$/).optional().messages({
        'string.pattern.base': 'Pincode must be 6 digits'
      })
    }).optional(),
    
    // User preferences
    preferences: Joi.object({
      language: Joi.string().valid('en', 'hi', 'mr', 'gu', 'ta', 'te').optional(),
      notifications: Joi.boolean().optional(),
      marketing: Joi.boolean().optional(),
      theme: Joi.string().valid('light', 'dark', 'auto').optional()
    }).optional(),
    
    deviceId: deviceIdSchema
    
  }).min(1).required().messages({
    'object.min': 'At least one field must be provided for update'
  })
});

/**
 * Change password validation schema
 * For mobile password change
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const changePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: passwordSchema,
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      }),
    
    deviceId: deviceIdSchema
    
  }).required()
});

/**
 * Logout validation schema
 * For mobile session cleanup
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const logoutSchema = Joi.object({
  body: Joi.object({
    deviceId: deviceIdSchema,
    logoutFromAllDevices: Joi.boolean().default(false)
  }).optional()
});

/**
 * Delete account validation schema
 * For mobile account deletion
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const deleteAccountSchema = Joi.object({
  body: Joi.object({
    phone: phoneSchema,
    otp: otpSchema,
    reason: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Reason cannot exceed 500 characters'
      }),
    
    confirmDeletion: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'Account deletion must be confirmed',
        'any.required': 'Account deletion confirmation is required'
      })
  }).required()
});

/**
 * Social login validation schema
 * For OAuth integration in mobile apps
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const socialLoginSchema = Joi.object({
  body: Joi.object({
    provider: Joi.string()
      .valid('google', 'facebook', 'apple')
      .required()
      .messages({
        'any.only': 'Provider must be one of: google, facebook, apple',
        'any.required': 'Social provider is required'
      }),
    
    accessToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Social access token is required'
      }),
    
    deviceId: deviceIdSchema,
    
    deviceInfo: Joi.object({
      platform: Joi.string().valid('ios', 'android').required(),
      version: Joi.string().max(20).required(),
      model: Joi.string().max(50).optional()
    }).optional()
    
  }).required()
});

/**
 * Joi validation middleware helper
 * Optimized for mobile error responses
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
        type: detail.type
      }));

      console.error('❌ Mobile Auth Validation Error:', {
        path: req.path,
        method: req.method,
        errors: validationErrors,
        userAgent: req.get('User-Agent'),
        user: 'MarotiKathoke',
        timestamp: new Date().toISOString()
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        errorCode: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      });
    }

    // Replace request with validated and sanitized data
    req.body = value.body || req.body;
    req.query = value.query || req.query;
    req.params = value.params || req.params;

    next();
  };
};

/**
 * Export all schemas and configurations
 * @author MarotiKathoke
 * @created 2025-09-13 14:17:31
 */
export default {
  // Schemas
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  mobileLoginSchema,
  mobileRefreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  logoutSchema,
  deleteAccountSchema,
  socialLoginSchema,
  
  // Configurations
  OTP_CONFIG,
  MOBILE_AUTH_CONFIG,
  
  // Utilities
  validateSchema,
  
  // Individual field schemas for reuse
  phoneSchema,
  otpSchema,
  nameSchema,
  emailSchema,
  deviceIdSchema,
  passwordSchema,
  refreshTokenSchema
};