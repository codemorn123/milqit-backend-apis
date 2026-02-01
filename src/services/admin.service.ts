import bcrypt from 'bcrypt';
import { AdminModel } from '../models/AdminModel';
import { logger } from '../config/logger';
import { AuthTokens, CreateAdminRequest, LoginRequest, UserProfile } from '../types/auth.types';
import { tokenService } from './token.service';
import { IUser, UserModel } from '../models/UserModel';
import { IFilter, PaginatedResponse } from '../types/common.types';
import mongoose from 'mongoose';
import APIError from '../error/api-error';




export const AdminService = {
  async createAdmin(data: CreateAdminRequest): Promise<UserProfile> {
    try {
      // Validate input
      if (!data.email || !data.email.trim()) {
        throw new APIError('Email is required', 400);
      }

      if (!data.password || data.password.length < 8) {
        throw new APIError('Password must be at least 8 characters long', 400);
      }

      if (!data.name || !data.name.trim()) {
        throw new APIError('Name is required', 400);
      }

      // Check if admin already exists
      const existingAdmin = await AdminModel.findOne({
        adminEmail: data.email.toLowerCase()
      });

      if (existingAdmin) {
        throw new APIError('Admin with this email already exists', 409);
      }

      // Check phone if provided
      if (data.phone) {
        const existingPhone = await AdminModel.findOne({ phone: data.phone });
        if (existingPhone) {
          throw new APIError('Admin with this phone number already exists', 409);
        }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);

      // Create admin
      const admin = new AdminModel({
        ...data,
        adminEmail: data.email.toLowerCase().trim(),
        passwordHash,
        roles: data.roles || ['admin'],
        isActive: data.isActive !== undefined ? data.isActive : true,
        isEmailVerified: true,
        isPhoneVerified: !!data.phone,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await admin.save();

      logger.info(
        { adminId: admin.id, email: admin.adminEmail },
        'Admin created successfully'
      );

      return admin as unknown as UserProfile;
    } catch (error: any) {
      logger.error(
        { adminEmail: data.email, error: error.message, stack: error.stack },
        'Failed to create admin'
      );

      // Re-throw APIError instances
      if (error instanceof APIError) {
        throw error;
      }

      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'field';
        const fieldName = field === 'adminEmail' ? 'email' : field;
        throw new APIError(`Admin with this ${fieldName} already exists`, 409);
      }

      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors || {})
          .map((err: any) => err.message)
          .join(', ');
        throw new APIError(messages || 'Validation failed', 400);
      }

      // Handle bcrypt errors
      if (error.message?.includes('bcrypt')) {
        throw new APIError('Password encryption failed', 500);
      }

      // Generic error with original message
      throw new APIError(
        error.message || 'Failed to create admin account. Please try again.',
        500
      );
    }
  },
  async login(data: LoginRequest): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    try {
      // Validate input
      if (!data.email || !data.email.trim()) {
        throw new APIError('Email is required', 400);
      }

      if (!data.password || !data.password.trim()) {
        throw new APIError('Password is required', 400);
      }

      // Find admin
      const admin = await AdminModel.findOne({
        adminEmail: data.email.toLowerCase().trim()
      });

      if (!admin) {
        throw new APIError('Invalid email or password', 401);
      }

      // Check if admin is active
      if (!admin.isActive) {
        throw new APIError('Account has been deactivated. Please contact support.', 403);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, admin.passwordHash);

      if (!isPasswordValid) {
        logger.warn(
          { adminId: admin.id, email: data.email },
          'Failed login attempt - invalid password'
        );
        throw new APIError('Invalid email or password', 401);
      }

      // Update last login timestamp
      admin.updatedAt = new Date();
      await admin.save();

      // Generate JWT tokens
      const tokenResponse = tokenService.generateAuthTokens(admin.id, admin.roles);
      const tokens: AuthTokens = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresIn: parseInt(tokenResponse.expiresIn) || 3600
      };

      logger.info(
        { adminId: admin.id, email: admin.adminEmail },
        'Admin logged in successfully'
      );

      return {
        user: admin as unknown as UserProfile,
        tokens
      };
    } catch (error: any) {
      logger.error(
        { adminEmail: data.email, error: error.message, stack: error.stack },
        'Login failed'
      );

      // Re-throw APIError instances
      if (error instanceof APIError) {
        throw error;
      }

      // Handle bcrypt comparison errors
      if (error.message?.includes('bcrypt')) {
        throw new APIError('Password verification failed', 500);
      }

      // Handle database connection errors
      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      // Generic error with original message
      throw new APIError(
        error.message || 'Login failed. Please try again.',
        500
      );
    }
  },
  async listCustomers(queryParams: IFilter): Promise<PaginatedResponse<IUser>> {
    try {
      // Validate and set defaults
      const page = Math.max(1, Number(queryParams.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(queryParams.limit) || 10));
      const search = queryParams.search?.trim();

      // Build filter
      const filter: mongoose.FilterQuery<IUser> = {};

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ];
      }

      if (queryParams.isActive !== undefined) {
        filter.isActive = queryParams.isActive;
      }

      // Execute queries
      const totalDocs = await UserModel.countDocuments(filter);
      const docs = await UserModel.find(filter)
        .select('-passwordHash -__v') // Exclude sensitive fields
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IUser[]>()
        .exec();

      const totalPages = Math.ceil(totalDocs / limit);

      logger.info(
        { page, limit, totalDocs, search },
        'Customer list fetched'
      );

      return {
        docs,
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        pagingCounter: (page - 1) * limit + 1
      };
    } catch (error: any) {
      logger.error(
        { queryParams, error: error.message, stack: error.stack },
        'Error fetching customer list'
      );

      // Re-throw APIError instances
      if (error instanceof APIError) {
        throw error;
      }

      // Handle database errors
      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      throw new APIError(
        error.message || 'Failed to fetch customer list',
        500
      );
    }
  },

  async listAdminUsers(): Promise<UserProfile[]> {
    try {
      const admins = await AdminModel.find({ isActive: true })
        .select('-passwordHash -__v') // Exclude sensitive fields
        .sort({ createdAt: -1 })
        .lean<UserProfile[]>()
        .exec();

      logger.info({ count: admins.length }, 'Admin users list fetched');

      return admins;
    } catch (error: any) {
      logger.error(
        { error: error.message, stack: error.stack },
        'Error fetching admin users'
      );

      // Re-throw APIError instances
      if (error instanceof APIError) {
        throw error;
      }

      // Handle database errors
      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      throw new APIError(
        error.message || 'Failed to fetch admin users',
        500
      );
    }
  },


  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await UserModel.find()
        .select('-passwordHash -__v')
        .sort({ createdAt: -1 })
        .lean<IUser[]>()
        .exec();

      logger.info({ count: users.length }, 'All users fetched');
      return users;
    } catch (error: any) {
      logger.error(
        { error: error.message, stack: error.stack },
        'Error fetching all users'
      );

      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      throw new APIError(error.message || 'Failed to fetch users', 500);
    }
  },

  async getAllActiveUsers(): Promise<IUser[]> {
    try {
      const users = await UserModel.find({ isActive: true })
        .select('-passwordHash -__v')
        .sort({ createdAt: -1 })
        .lean<IUser[]>()
        .exec();

      logger.info({ count: users.length }, 'Active users fetched');
      return users;
    } catch (error: any) {
      logger.error(
        { error: error.message, stack: error.stack },
        'Error fetching active users'
      );

      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      throw new APIError(error.message || 'Failed to fetch active users', 500);
    }
  },

  async getAllInactiveUsers(): Promise<IUser[]> {
    try {
      const users = await UserModel.find({ isActive: false })
        .select('-passwordHash -__v')
        .sort({ createdAt: -1 })
        .lean<IUser[]>()
        .exec();

      logger.info({ count: users.length }, 'Inactive users fetched');
      return users;
    } catch (error: any) {
      logger.error(
        { error: error.message, stack: error.stack },
        'Error fetching inactive users'
      );

      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerError') {
        throw new APIError('Database connection failed. Please try again later.', 503);
      }

      throw new APIError(error.message || 'Failed to fetch inactive users', 500);
    }
  }

};