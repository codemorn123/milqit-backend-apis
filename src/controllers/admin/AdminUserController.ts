// import { Controller, Get, Post, Put, Delete, Route, Tags, Security, Body, Path, Query, Response } from 'tsoa';
// import { ZodError } from 'zod';
// import {
//   UserResponseDTO,
//   UserListResponseDTO,
//   UserStatsDTO,
//   CreateUserRequestDTO,
//   UpdateUserRequestDTO,
//   BulkUpdateRequestDTO,
// } from '../../interfaces/IUser';
// import { userService } from '../../services/UserService';
// import {
//   validateCreateUser,
//   validateUpdateUser,
//   validateBulkUpdate,
//   validateUserFilters,
//   validatePagination,
//   formatZodError,
// } from '../../validations/userValidation';

// import { ErrorResponse, ErrorDetail, ApiResponseDTO } from '../../types/common.types';

// @Route('admin/users')
// @Tags('Admin - User Management - MarotiKathoke')
// @Security('adminAuth')
// export class AdminUserController extends Controller {
//   private developerName = process.env.DEVELOPER_NAME || 'MarotiKathoke';

//   private successResponse<T>(data: T, message?: string): ApiResponseDTO<T> {
//     return {
//       success: true,
//       data,
//       message,
//       timestamp: new Date().toISOString(),
//       developer: this.developerName,
//     };
//   }

//   private errorResponse(error: ErrorDetail, status: number = 400): ApiResponseDTO<any> {
//     this.setStatus(status);
//     return {
//       success: false,
//       error,
//       timestamp: new Date().toISOString(),
//       developer: this.developerName,
//     };
//   }

//   /**
//    * Get paginated list of users with filters
//    */
//   @Get('/')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async getUsers(
//     @Query() page: number = 1,
//     @Query() limit: number = 10,
//     @Query() search?: string,
//     @Query() role?: 'customer' | 'admin' | 'manager' | 'staff' | 'vip',
//     @Query() isActive?: boolean,
//     @Query() isEmailVerified?: boolean,
//     @Query() isPhoneVerified?: boolean,
//     @Query() sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin',
//     @Query() sortOrder?: 'asc' | 'desc'
//   ): Promise<ApiResponseDTO<UserListResponseDTO>> {
//     try {
//       console.log(`📋 AdminUserController.getUsers called by ${this.developerName} at ${new Date().toISOString()}`);

//       const pagination = await validatePagination({ page, limit });
//       const filters = await validateUserFilters({
//         search,
//         role,
//         isActive,
//         isEmailVerified,
//         isPhoneVerified,
//         sortBy,
//         sortOrder,
//       });

//       const users = await userService.getUsers(pagination, filters);

//       return this.successResponse(users, 'Users retrieved successfully');
//     } catch (error: any) {
//       if (error instanceof ZodError) {
//         const details = formatZodError(error);
//         return this.errorResponse({ code: 'VALIDATION_ERROR', message: 'Validation error', details }, 422);
//       }
//       console.error('❌ Error in AdminUserController.getUsers:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to retrieve users', 500);
//     }
//   }

//   /**
//    * Get user by ID
//    */
//   @Get('/{userId}')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'Not Found')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async getUserById(@Path() userId: string): Promise<ApiResponseDTO<UserResponseDTO>> {
//     try {
//       console.log(`👤 AdminUserController.getUserById called for ID: ${userId} by ${this.developerName}`);

//       const user = await userService.getUserById(userId);
//       if (!user) return this.errorResponse('User not found', 404);

//       return this.successResponse(user, 'User retrieved successfully');
//     } catch (error: any) {
//       console.error('❌ Error in AdminUserController.getUserById:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to retrieve user', 500);
//     }
//   }

//   /**
//    * Create new user
//    */
//   @Post('/')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden - Not an admin')
//   @Response<ErrorResponse>(422, 'Validation Error')
//   @Response<ErrorResponse>(409, 'Conflict - Duplicate')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async createUser(@Body() userData: CreateUserRequestDTO | unknown): Promise<ApiResponseDTO<UserResponseDTO>> {
//     try {
//       console.log(`➕ AdminUserController.createUser called by ${this.developerName} at ${new Date().toISOString()}`);

//       const parsed = await validateCreateUser(userData);

//       const user = await userService.createUser(parsed as any);

//       this.setStatus(201);
//       return this.successResponse(user, 'User created successfully');
//     } catch (error: any) {
//       if (error instanceof ZodError) {
//         const details = formatZodError(error);
//         return this.errorResponse({ code: 'VALIDATION_ERROR', message: 'Validation error', details }, 422);
//       }

//       if (error && (error.code === 'DUPLICATE_EMAIL' || error.code === 'DUPLICATE_PHONE')) {
//         return this.errorResponse({ code: 'CONFLICT', message: error.message || 'Resource conflict' }, 409);
//       }

//       console.error('❌ Error in AdminUserController.createUser:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to create user', 500);
//     }
//   }

//   /**
//    * Update user
//    */
//   @Put('/{userId}')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'Not Found')
//   @Response<ErrorResponse>(422, 'Validation Error')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async updateUser(@Path() userId: string, @Body() updateData: UpdateUserRequestDTO | unknown): Promise<ApiResponseDTO<UserResponseDTO>> {
//     try {
//       console.log(`✏️ AdminUserController.updateUser called for ID: ${userId} by ${this.developerName}`);

//       const parsed = await validateUpdateUser(updateData);

//       const user = await userService.updateUser(userId, parsed as any);
//       if (!user) return this.errorResponse('User not found', 404);

//       return this.successResponse(user, 'User updated successfully');
//     } catch (error: any) {
//       if (error instanceof ZodError) {
//         const details = formatZodError(error);
//         return this.errorResponse({ code: 'VALIDATION_ERROR', message: 'Validation error', details }, 422);
//       }

//       if (error && error.code === 'DUPLICATE_PHONE') {
//         return this.errorResponse({ code: 'CONFLICT', message: error.message || 'Resource conflict' }, 409);
//       }

//       console.error('❌ Error in AdminUserController.updateUser:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to update user', 500);
//     }
//   }

//   /**
//    * Delete user (soft delete)
//    */
//   @Delete('/{userId}')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'Not Found')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async deleteUser(@Path() userId: string): Promise<ApiResponseDTO<{ deleted: boolean }>> {
//     try {
//       console.log(`🗑️ AdminUserController.deleteUser called for ID: ${userId} by ${this.developerName}`);

//       const deleted = await userService.deleteUser(userId);
//       if (!deleted) return this.errorResponse('User not found', 404);

//       return this.successResponse({ deleted: true }, 'User deactivated successfully');
//     } catch (error: any) {
//       console.error('❌ Error in AdminUserController.deleteUser:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to delete user', 500);
//     }
//   }

//   /**
//    * Get user statistics
//    */
//   @Get('/analytics/stats')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async getUserStats(): Promise<ApiResponseDTO<UserStatsDTO>> {
//     try {
//       console.log(`📊 AdminUserController.getUserStats called by ${this.developerName} at ${new Date().toISOString()}`);

//       const stats = await userService.getUserStats();

//       return this.successResponse(stats, 'User statistics retrieved successfully');
//     } catch (error: any) {
//       console.error('❌ Error in AdminUserController.getUserStats:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to retrieve stats', 500);
//     }
//   }

//   /**
//    * Bulk update users
//    */
//   @Put('/bulk/update')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(422, 'Validation Error')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async bulkUpdateUsers(@Body() bulkUpdateData: BulkUpdateRequestDTO | unknown): Promise<ApiResponseDTO<{ updatedCount: number }>> {
//     try {
//       console.log(`🔄 AdminUserController.bulkUpdateUsers called by ${this.developerName}`);

//       const parsed = await validateBulkUpdate(bulkUpdateData);

//       const updatedCount = await userService.bulkUpdateUsers(parsed.userIds, parsed.updates);

//       return this.successResponse({ updatedCount }, `${updatedCount} users updated successfully`);
//     } catch (error: any) {
//       if (error instanceof ZodError) {
//         const details = formatZodError(error);
//         return this.errorResponse({ code: 'VALIDATION_ERROR', message: 'Validation error', details }, 422);
//       }

//       console.error('❌ Error in AdminUserController.bulkUpdateUsers:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to bulk update users', 500);
//     }
//   }

//   /**
//    * Activate user
//    */
//   @Put('/{userId}/activate')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'Not Found')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async activateUser(@Path() userId: string): Promise<ApiResponseDTO<UserResponseDTO>> {
//     try {
//       console.log(`✅ AdminUserController.activateUser called for ID: ${userId} by ${this.developerName}`);

//       const user = await userService.updateUser(userId, { isActive: true } as any);
//       if (!user) return this.errorResponse('User not found', 404);

//       return this.successResponse(user, 'User activated successfully');
//     } catch (error: any) {
//       console.error('❌ Error in AdminUserController.activateUser:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to activate user', 500);
//     }
//   }

//   /**
//    * Verify user email
//    */
//   @Put('/{userId}/verify-email')
//   @Response<ErrorResponse>(400, 'Bad Request')
//   @Response<ErrorResponse>(401, 'Unauthorized')
//   @Response<ErrorResponse>(403, 'Forbidden')
//   @Response<ErrorResponse>(404, 'Not Found')
//   @Response<ErrorResponse>(500, 'Server Error')
//   public async verifyUserEmail(@Path() userId: string): Promise<ApiResponseDTO<UserResponseDTO>> {
//     try {
//       console.log(`📧 AdminUserController.verifyUserEmail called for ID: ${userId} by ${this.developerName}`);

//       const user = await userService.updateUser(userId, { isEmailVerified: true } as any);
//       if (!user) return this.errorResponse('User not found', 404);

//       return this.successResponse(user, 'User email verified successfully');
//     } catch (error: any) {
//       console.error('❌ Error in AdminUserController.verifyUserEmail:', error && error.stack ? error.stack : error);
//       return this.errorResponse(error?.message ?? 'Failed to verify user email', 500);
//     }
//   }
// }