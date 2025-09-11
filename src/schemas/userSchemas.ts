import { z } from 'zod';

/* ----------------------------- Base primitives ---------------------------- */

export const UserEmailSchema = z
  .string()
  .min(5, { message: 'Email must be at least 5 characters' })
  .max(100, { message: 'Email must be less than 100 characters' })
  .email({ message: 'Invalid email format' })
  .transform((email) => email.toLowerCase().trim());

export const UserNameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name must be less than 50 characters' })
  .trim()
  .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' });

export const UserPhoneSchema = z
  .string()
  .regex(/^[0-9]{10,11}$/, { message: 'Phone must be 10-11 digits' })
  .optional();

export const UserPasswordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(100, { message: 'Password must be less than 100 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  });

export const RolesEnum = z.enum(['customer', 'admin', 'manager', 'staff', 'vip']);

export const UserRolesSchema = z
  .array(RolesEnum)
  .min(1, { message: 'At least one role is required' })
  .default(['customer']);

/* ----------------------------- Request schemas ---------------------------- */

export const CreateUserSchema = z.object({
  email: UserEmailSchema,
  name: UserNameSchema,
  phone: UserPhoneSchema,
  password: UserPasswordSchema,
  roles: UserRolesSchema.optional(),
  isActive: z.boolean().optional().default(true),
  isPhoneVerified: z.boolean().optional().default(false),
  mobileNumber: UserPhoneSchema.optional(),
});

export const UpdateUserSchema = z
  .object({
    name: UserNameSchema.optional(),
    phone: UserPhoneSchema,
    roles: UserRolesSchema.optional(),
    isActive: z.boolean().optional(),
    isEmailVerified: z.boolean().optional(),
    isPhoneVerified: z.boolean().optional(),
    email: UserEmailSchema.optional(),
  })
  .partial();

/* ----------------------------- Query / util schemas ------------------------- */

export const UserFiltersSchema = z.object({
  search: z.string().min(1).max(100).trim().optional(),
  role: RolesEnum.optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'lastLogin']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Use z.coerce.number() for query params (they often come as strings)
 */
export const PaginationSchema = z.object({
  page: z
    .coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: 'page must be a number' })
    .min(1, { message: 'page must be at least 1' })
    .default(1),
  limit: z
    .coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: 'limit must be a number' })
    .min(1, { message: 'limit must be at least 1' })
    .max(100, { message: 'limit must be at most 100' })
    .default(10),
});

/* ----------------------------- ID / Bulk schemas ---------------------------- */

export const UserIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid user ID format' });

export const BulkUpdateSchema = z.object({
  userIds: z.array(UserIdSchema).min(1).max(100),
  updates: z
    .object({
      isActive: z.boolean().optional(),
      roles: UserRolesSchema.optional(),
      name: UserNameSchema.optional(),
      phone: UserPhoneSchema.optional(),
    })
    .partial(),
});






/**
 * Schema for validating profile updates
 */
export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        email: z.string().email().optional(),
        phone: z.string().regex(/^\+[1-9]\d{1,14}$/, {
            message: 'Phone number must be in E.164 format (e.g., +919876543210)'
        }).optional(),
        profilePicture: z.string().url().optional(),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: 'Date of birth must be in YYYY-MM-DD format'
        }).optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
        path: ["_"]
    })
});

/**
 * Schema for adding a new address
 */
export const addAddressSchema = z.object({
    body: z.object({
        label: z.string().min(1).max(50),
        address: z.string().min(5).max(200),
        city: z.string().min(2).max(50),
        state: z.string().min(2).max(50),
        pincode: z.string().regex(/^\d{6}$/, {
            message: 'Pincode must be 6 digits'
        }),
        landmark: z.string().max(100).optional(),
        isDefault: z.boolean().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        addressType: z.enum(['home', 'work', 'other'])
    })
});

/**
 * Schema for updating user location
 */
export const updateLocationSchema = z.object({
    body: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        accuracy: z.number().min(0).optional()
    })
});

/**
 * Schema for updating device token
 */
export const deviceTokenSchema = z.object({
    body: z.object({
        fcmToken: z.string().min(20).max(255)
    })
});

/**
 * Schema for delivery availability check
 */
export const deliveryAvailabilitySchema = z.object({
    query: z.object({
        latitude: z.coerce.number().min(-90).max(90),
        longitude: z.coerce.number().min(-180).max(180)
    })
});

export default {
    updateProfileSchema,
    addAddressSchema,
    updateLocationSchema,
    deviceTokenSchema,
    deliveryAvailabilitySchema
};



/* ----------------------------- Exported TS types --------------------------- */

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type BulkUpdateInput = z.infer<typeof BulkUpdateSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type UserFiltersInput = z.infer<typeof UserFiltersSchema>;