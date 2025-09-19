import bcrypt from 'bcrypt';
import { AdminModel, IAdminDocument } from '../models/AdminModel';
import { PresentableError } from '../error/clientErrorHelper';
import { logger } from '../config/logger';
import { AuthTokens, CreateAdminRequest, LoginRequest, UserProfile } from  '../types/auth.types';
import { tokenService } from './token.service';
import { UserModel } from './../models/UserModel';




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
  async listUsers(): Promise<UserProfile[]> {
    return UserModel.find();
  },

  async listAdminUsers(): Promise<UserProfile[]> {
    return [];
  }


//   public async all(): Promise<T[]> {
//     return (await this.model.find().lean()) as T[];
// }

};