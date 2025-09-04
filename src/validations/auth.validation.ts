import { z } from 'zod';

/**
 * Configuration for OTP validation
 */
const OTP_CONFIG = {
  length: 6,
  expiry: 10 * 60, // 10 minutes in seconds
};

/**
 * Schema for validating phone numbers in E.164 format
 * Example: +919876543210
 */
const phoneSchema = z.string()
  .trim()
  .regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +919876543210)'
  });

/**
 * Schema for validating OTP codes
 */
const otpSchema = z.string()
  .trim()
  .regex(new RegExp(`^\\d{${OTP_CONFIG.length}}$`), {
    message: `OTP must be exactly ${OTP_CONFIG.length} digits`
  });

/**
 * Schema for validating user names
 */
const nameSchema = z.string()
  .trim()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name cannot exceed 50 characters' })
  .regex(/^[a-zA-Z\s]+$/, { 
    message: 'Name can only contain letters and spaces' 
  });

/**
 * Schema for device IDs used for push notifications
 */
const deviceIdSchema = z.string()
  .trim()
  .min(5, { message: 'Device ID must be at least 5 characters' })
  .optional();

/**
 * Schema for validating send OTP requests
 */
export const sendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema
  })
});

/**
 * Schema for validating verify OTP requests
 * For new users, name is required
 */
export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
    name: nameSchema.optional(),
    deviceId: deviceIdSchema
  })
});

/**
 * Schema for validating password reset requests
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: otpSchema,
    newPassword: z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  })
});

/**
 * Schema for validating mobile login requests (for users with password)
 */
export const mobileLoginSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    password: z.string().min(1, { message: 'Password is required' })
  })
});

/**
 * Schema for validating mobile token refresh requests
 */
export const mobileRefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10, { message: 'Valid refresh token is required' })
  })
});

/**
 * Schema for updating user profile from mobile
 */
export const updateProfileSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    deviceId: deviceIdSchema
  }).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update",
      path: ["_"]
    }
  )
});

export default {
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  mobileLoginSchema,
  mobileRefreshTokenSchema,
  updateProfileSchema,
  OTP_CONFIG
};