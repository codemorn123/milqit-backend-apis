// import { Body, Controller, Get, Post, Route, Tags, Response, Security, Request } from 'tsoa';
// import { ZodError } from 'zod';
// import express from 'express';

// import {
//   LoginRequest,
//   RefreshTokenRequest,
//   AuthResponse,
//   UserProfile
// } from '../../types/auth.types';
// import { authService } from '../../services/authService';
// import { validate } from '../../utils/zodValidator';
// import { createAdminSchema, loginSchema, refreshTokenSchema } from '../../validations/auth.validation';
// import { ApiError } from '../../utils/errorHandler';
// import { ErrorResponse } from '../../types/common.types';
// import { logger } from './../../config/logger';

// /**
//  * Normalizes a user document/object returned from the service into the exact
//  * runtime shape required by the UserProfile/AuthResponse TypeScript types.
//  *
//  * Guarantees:
//  * - phone: string | undefined  (converts null -> undefined)
//  * - isEmailVerified: boolean  (coerces undefined/null -> false)
//  * - isPhoneVerified: boolean  (coerces undefined/null -> false)
//  * - lastLogin: string | undefined
//  * - createdAt / updatedAt: string (ISO)
//  */
// function normalizeUserProfile(raw: any): UserProfile {
//   return {
//     id: String(raw.id ?? raw._id ?? ''),
//     name: String(raw.name ?? ''),
//     email: String(raw.email ?? ''),
//     phone: raw.phone ?? undefined,
//     roles: Array.isArray(raw.roles) ? raw.roles : (raw.roles ? [raw.roles] : []),
//     isActive: Boolean(raw.isActive),
//     // coerce to boolean so matches UserProfile which expects boolean (not optional)
//     isEmailVerified: Boolean(raw.isEmailVerified),
//     isPhoneVerified: Boolean(raw.isPhoneVerified),
//     lastLogin: raw.lastLogin ? new Date(raw.lastLogin).toISOString() : undefined,
//     createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
//     updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
//   } as UserProfile;
// }


// export interface CreateAdminRequest {
//   name: string;
//   email: string;
//   phone?: string;
//   password: string;
//   roles: Array<'admin' | 'manager' | 'staff'>;
// }


// @Route('admin-auth')
// @Tags('Admin Authentication')
// export class AdminAuthController extends Controller {
//   /**
//    * Admin login with email and password
//    */
//   @Post('login')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden - Not an admin')
//   @Response<ErrorResponse>(422, 'Validation Error')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async login(
//     @Body() requestBody: LoginRequest
//   ): Promise<AuthResponse> {
//     try {
//       // Validate input (may throw ZodError)
//       const validatedData = validate(loginSchema, requestBody);

//       // Authenticate
//       const result = await authService.login(validatedData);

//       if (!result || !result.user) {
//         // Defensive: if authService returned nothing, treat as unauthorized
//         throw ApiError.unauthorized('Invalid credentials');
//       }

//       // Ensure admin role
//       if (!Array.isArray(result.user.roles) || !result.user.roles.includes('admin')) {
//         throw ApiError.forbidden('Admin access required');
//       }

//       // Normalize user so it exactly matches UserProfile (no nullable booleans)
//       const normalizedUser = normalizeUserProfile(result.user);

//       const normalized: AuthResponse = {
//         user: normalizedUser,
//         tokens: result.tokens,
//       };

//       this.setStatus(200);
//       return normalized;
//     } catch (err: any) {
//       // Let ZodErrors bubble so centralized error handler can produce a 422
//       if (err instanceof ZodError) throw err;

//       // If the error is already an ApiError, rethrow it unchanged
//       if (err instanceof ApiError) throw err;

//       // Log and convert unknown errors into a safe internal server ApiError
//       console.error('❌ AdminAuthController.login error:', err && err.stack ? err.stack : err);
//       throw ApiError.internal('Failed to login');
//     }
//   }

//   /**
//    * Refresh access token using a refresh token (Admin)
//    */
//   @Post('refresh-token')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(422, 'Validation Error')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async refreshToken(
//     @Body() requestBody: RefreshTokenRequest
//   ): Promise<{ tokens: { accessToken: string; refreshToken: string; expiresIn: number } }> {
//     try {
//       const validatedData = validate(refreshTokenSchema, requestBody);

//       const result = await authService.refreshToken(validatedData);

//       if (!result || !result.tokens) {
//         throw ApiError.unauthorized('Invalid refresh token');
//       }

//       this.setStatus(200);
//       return result;
//     } catch (err: any) {
//       if (err instanceof ZodError) throw err;
//       if (err instanceof ApiError) throw err;

//       console.error('❌ AdminAuthController.refreshToken error:', err && err.stack ? err.stack : err);
//       throw ApiError.internal('Failed to refresh token');
//     }
//   }

//   /**
//    * Get the current admin's profile
//    */
//   @Get('profile')
//   @Security('jwt', ['admin'])
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'User Not Found')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async getProfile(
//     @Request() request: express.Request & { user?: { userId: string } }
//   ): Promise<UserProfile> {
//     try {
//       if (!request.user?.userId) {
//         throw ApiError.unauthorized('Authentication required');
//       }

//       const profile = await authService.getProfile(request.user.userId);

//       if (!profile) {
//         throw ApiError.notFound('User not found');
//       }

//       // Ensure still admin
//       if (!Array.isArray(profile.roles) || !profile.roles.includes('admin')) {
//         throw ApiError.forbidden('Admin access required');
//       }

//       // Normalize profile to strict UserProfile shape
//       const normalizedProfile = normalizeUserProfile(profile);

//       this.setStatus(200);
//       return normalizedProfile;
//     } catch (err: any) {
//       if (err instanceof ApiError) throw err;
//       console.error('❌ AdminAuthController.getProfile error:', err && err.stack ? err.stack : err);
//       throw ApiError.internal('Failed to fetch profile');
//     }
//   }




//   @Post('create')
// // @Security('jwt', ['admin'])
// @Response<ErrorResponse>(400, 'Bad Request')
// // @Response<ErrorResponse>(401, 'Unauthorized')
// @Response<ErrorResponse>(403, 'Forbidden')
// @Response<ErrorResponse>(409, 'Conflict - Email or Phone Already Exists')
// @Response<ErrorResponse>(422, 'Validation Error')
// @Response<ErrorResponse>(500, 'Server Error')
// public async createAdmin(
//   @Body() requestBody: CreateAdminRequest,
//   @Request() request: express.Request & { user?: { userId: string } }
// ): Promise<{ 
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   roles: string[];
//   createdAt: string;
// }> {
//   try {
//     if (!request.user?.userId) {
//       throw ApiError.unauthorized('Authentication required');
//     }

//     // Validate input
//     const validatedData = validate(createAdminSchema, requestBody);

//     // Create admin account
//     const result = await authService.createAdmin(validatedData, request.user.userId);

//     // Return created admin info
//     this.setStatus(201);
//     return {
//       id: result.id,
//       name: result.name,
//       email: result.email,
//       phone: result.phone ?? undefined, // Ensure null is converted to undefined
//       roles: result.roles,
//       createdAt: result.createdAt
//     };
//   } catch (err: any) {
//     // Let ZodErrors bubble so centralized error handler can produce a 422
//     if (err instanceof ZodError) throw err;

//     // If the error is already an ApiError, rethrow it unchanged
//     if (err instanceof ApiError) throw err;

//     // Log and convert unknown errors into a safe internal server ApiError
//     console.error('❌ AdminAuthController.createAdmin error:', err && err.stack ? err.stack : err);
//     throw ApiError.internal('Failed to create admin account');
//   }
// }


// @Post('bootstrap')
// @Response<ErrorResponse>(400, 'Bad Request')
// @Response<ErrorResponse>(403, 'Forbidden - Invalid Bootstrap Key')
// @Response<ErrorResponse>(409, 'Conflict - Admins Already Exist or Email Already Registered')
// @Response<ErrorResponse>(422, 'Validation Error')
// @Response<ErrorResponse>(500, 'Server Error')
// public async bootstrapAdmin(
//   @Body() requestBody: CreateAdminRequest & { bootstrapKey: string }
// ): Promise<{
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   roles: string[];
//   createdAt: string;
// }> {
//   try {
//     // Comprehensive logging of bootstrap attempt (without sensitive data)
//     logger.info({
//       action: 'BOOTSTRAP_ADMIN_ATTEMPT',
//       timestamp: new Date().toISOString(),
//       email: requestBody.email, // Log email for audit purposes
//       hasBootstrapKey: !!requestBody.bootstrapKey // Log if key was provided without revealing it
//     }, 'Bootstrap admin creation attempt');

//     // Check if bootstrapKey is provided
//     if (!requestBody.bootstrapKey) {
//       throw ApiError.badRequest('Bootstrap key is required');
//     }

//     // Get bootstrap key from environment variable
//     const { bootstrapKey, ...adminData } = requestBody;
//     const validBootstrapKey = process.env.ADMIN_BOOTSTRAP_KEY;
    
//     if (!validBootstrapKey) {
//       logger.error({ action: 'BOOTSTRAP_CONFIG_ERROR' }, 'ADMIN_BOOTSTRAP_KEY environment variable is not set');
//       throw ApiError.internal('Server configuration error - bootstrap key not configured');
//     }
    
//     if (bootstrapKey !== validBootstrapKey) {
//       logger.warn({ action: 'BOOTSTRAP_ADMIN_REJECTED' }, 'Invalid bootstrap key provided');
//       throw ApiError.forbidden('Invalid bootstrap key');
//     }

//     // Validate admin data
//     try {
//       const validatedData = validate(createAdminSchema, adminData);
      
//       // Use the bootstrap method in authService
//       const result = await authService.bootstrapAdmin(validatedData);

//       // Return created admin info
//       this.setStatus(201);
//       return {
//         id: result.id,
//         name: result.name,
//         email: result.email,
//         phone: result.phone ?? undefined,
//         roles: result.roles,
//         createdAt: result.createdAt
//       };
//     } catch (validationError) {
//       if (validationError instanceof ZodError) throw validationError;
//       logger.error({ error: validationError }, 'Data validation error');
//       throw validationError;
//     }
//   } catch (err: any) {
//     if (err instanceof ZodError) throw err;
//     if (err instanceof ApiError) throw err;
    
//     // Detailed error logging for debugging
//     console.error('❌ AdminAuthController.bootstrapAdmin error:', err && err.stack ? err.stack : err);
//     logger.error({
//       error: err.message,
//       stack: err.stack,
//       requestBody: {
//         ...requestBody,
//         bootstrapKey: '[REDACTED]',
//         password: '[REDACTED]'
//       }
//     }, 'Bootstrap admin failed with exception');
    
//     throw ApiError.internal('Failed to bootstrap admin account');
//   }
// }



// }


