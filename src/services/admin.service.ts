import bcrypt from 'bcrypt';
import { AdminModel, IAdminDocument } from '../models/AdminModel';
import { PresentableError } from '../error/clientErrorHelper';
import { logger } from '../config/logger';
import { AuthTokens, CreateAdminRequest, LoginRequest, UserProfile } from  '../types/auth.types';
import { tokenService } from './token.service';
import { IUser, UserModel } from './../models/UserModel';
import { IFilter, PaginatedResponse } from  '../types/common.types';
import mongoose from 'mongoose';




export const AdminService = {
  async createAdmin(data: CreateAdminRequest): Promise<UserProfile> {
    try {
      const passwordHash = await bcrypt.hash(data.password, 12);
      const admin = new AdminModel({
        ...data,
        email: data.email?.toLowerCase(),
        passwordHash,
        roles: data.roles || ['admin'],
        isActive: true || data.isActive,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await admin.save();
      logger.info(`Admin created: ${admin.id}`);
      return admin as unknown as UserProfile;
    } catch (error: any) {
      logger.error(`Failed to create admin: ${error.message}`);
      if (error.code === 11000) {
        throw new PresentableError('CONFLICT', 'Admin with this email or phone already exists');
      }
      throw new PresentableError('SERVER_ERROR', 'Failed to create admin account');
    }
  },
  async login(data: LoginRequest): Promise<{ user: UserProfile, tokens: AuthTokens }> {
    if (!data.email || !data.password) {
      throw new PresentableError('VALIDATION_ERROR', 'Email and password are required');
    }
    const admin = await AdminModel.findOne({ email: data.email.toLowerCase(), isActive: true });
    if (!admin) {
      throw new PresentableError('UNAUTHORIZED', 'Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(data.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new PresentableError('UNAUTHORIZED', 'Invalid credentials');
    }

    // Optionally update last login timestamp (add a field if needed)
    admin.updatedAt = new Date();
    await admin.save();

    // Generate JWT tokens
    const tokenResponse = tokenService.generateAuthTokens(admin.id, admin.roles);
    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: parseInt(tokenResponse.expiresIn) || 3600
    };
    return {
      user: admin as unknown as UserProfile,
      tokens
    };
  },
  async listCustomers(queryParams: IFilter): Promise<PaginatedResponse<IUser>> {
      const page = Number(queryParams.page) || 1;
      const limit = Number(queryParams.limit) || 10;
      const search = queryParams.search;
  
      const filter: mongoose.FilterQuery<IUser> = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
      }

      if(queryParams.isActive !== undefined){
        filter.isActive = queryParams.isActive;
      }
  
      const totalDocs = await UserModel.countDocuments(filter);
      const docs = await UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IUser[]>()
        .exec();
        
      return {
        docs: docs,
        totalDocs: totalDocs,
        limit: limit,
        page: page,
        totalPages: Math.ceil(totalDocs / limit),
        hasNextPage: page < Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1,
        nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      };
  },

  async listAdminUsers(): Promise<UserProfile[]> {
    return [];
  },


   async getAllUsers(): Promise<IUser[]> {
    return UserModel.find();
  },

   async getAllActiveUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: true });
  } ,


   async getAllInactiveUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: false });
  }


  

//   public async all(): Promise<T[]> {
//     return (await this.model.find().lean()) as T[];
// }

};