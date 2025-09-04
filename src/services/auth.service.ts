import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OtpModel, IOtpDocument } from '../models/OtpModel';
import { tokenService } from './token.service';
import { ApiError } from '../utils/errorHandler';
import { logger } from '../config/logger';
import { SmsService } from './sms.service';
import UserService from './user.service';
import { UserModel, IUserDocument } from '../models/UserModel';

import {
  ISendOtpInput,
  IVerifyOtpInput,
  IAuthResponse,
  AuthTokens,
  LoginRequest as LoginInput,
  RegisterRequest as RegisterInput,
  RefreshTokenRequest as RefreshTokenInput,
  CreateAdminRequest as CreateAdminInput
} from '../types/auth.types';
import { CreateUserInput } from '@/schemas/userSchemas';

export class AuthService {
  /**
   * Registers a new user.
   */
  static async register(data: RegisterInput) {
    await UserService.checkIfUserExists(data.email, data.phone);
    const newUser = await UserService.createUser(data as CreateUserInput, false);
    if (!newUser) {
      throw ApiError.internal('Failed to create user');
    }
    
    const tokens = tokenService.generateAuthTokens(newUser.id, newUser.roles);
    return { user: newUser.toProfileDTO(), tokens };
  }

  /**
   * Logs a user in.
   */
  static async login(data: LoginInput) {
    const user = await UserService.getActiveUserByEmail(data.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    await UserService.updateLastLogin(user.id);
    const tokens = tokenService.generateAuthTokens(user.id, user.roles);

    return { user: user.toProfileDTO(), tokens };
  }

  /**
   * Refreshes authentication tokens.
   */
  static async refreshToken(data: RefreshTokenInput) {
    const payload = tokenService.verifyRefreshToken(data.refreshToken);
    const user = await UserService.getActiveUserById(payload.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found or account is disabled');
    }

    const tokens = tokenService.generateAuthTokens(user.id, user.roles);
    return { tokens };
  }

  /**
   * Creates a new admin user.
   */
  static async createAdmin(data: CreateAdminInput, creatorId: string) {
    await UserService.verifyAdminPrivileges(creatorId);
    await UserService.checkIfUserExists(data.email, data.phone);

    // Ensure 'admin' role is present
    const roles = [...new Set(['admin', ...(data.roles || [])])];
    const adminUser = await UserService.createUser({ ...data, isActive: data.isActive ?? true, isPhoneVerified: true }, true);
    
    if (!adminUser) {
      throw ApiError.internal('Failed to create admin user');
    }

    return adminUser.toProfileDTO();
  }

  /**
   * Bootstraps the first admin account if none exist.
   */
  static async bootstrapAdmin(data: CreateAdminInput) {
    const adminCount = await UserService.countAdmins();
    if (adminCount > 0) {
      throw ApiError.conflict('Admin accounts already exist. Bootstrap is not allowed.');
    }
    const adminUser = await UserService.createUser({ ...data, isActive: data.isActive ?? true, isPhoneVerified: true }, true);
    
    if (!adminUser) {
      throw ApiError.internal('Failed to bootstrap admin user');
    }

    return adminUser.toProfileDTO();
  }

  // ===== Mobile Authentication Methods =====

  /**
   * Sends login OTP to the provided phone number
   * @param phone Phone number in E.164 format
   * @returns Object containing expiration time in seconds
   */
  static async sendLoginOtp(phone: string): Promise<{ expiresIn: number }> {
    try {
      // Check for rate limiting (max 5 OTPs in 1 hour per phone number)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentOtps = await OtpModel.countDocuments({
        phone,
        createdAt: { $gte: hourAgo }
      });

      if (recentOtps >= 5) {
        throw ApiError.tooManyRequests('Too many OTP requests. Please try again later.');
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash OTP before storing
      const hashedOtp = await this.hashOtp(otp);
      
      // OTP expires in 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // Store OTP in database
      await OtpModel.create({
        phone,
        otp: hashedOtp,
        expiresAt,
        attempts: 0,
        verified: false,
        isInvalidated: false
      });

      // Send OTP via SMS service
      await SmsService.sendOtp(phone, otp);
      
      logger.info(`OTP sent to ${phone} successfully`);
      
      return { expiresIn: 10 * 60 }; // 10 minutes in seconds
    } catch (error: any) {
      // If error is already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      
      throw ApiError.internal(`Failed to send OTP: ${error.message}`);
    }
  }

  /**
   * Verifies OTP and authenticates the user
   * Creates a new user if they don't exist
   * @param data Object containing phone, otp, and optional name
   * @returns Authentication response with user data and tokens
   */
  static async verifyOtpAndAuthenticate(data: IVerifyOtpInput): Promise<IAuthResponse> {
    try {
      const { phone, otp, name, deviceId } = data;
      
      // Find the most recent non-expired, non-verified OTP for this phone
      const otpRecord = await OtpModel.findOne({
        phone,
        expiresAt: { $gt: new Date() },
        verified: false,
        isInvalidated: { $ne: true }
      }).sort({ createdAt: -1 });

      // Check if OTP exists
      if (!otpRecord) {
        throw ApiError.unauthorized('Invalid or expired OTP. Please request a new one.');
      }

      // Verify OTP
      const isValidOtp = await this.verifyOtpHash(otp, otpRecord.otp);
      
      // Handle invalid OTP
      if (!isValidOtp) {
        // Increment failed attempts
        otpRecord.attempts += 1;
        
        // Invalidate after 3 failed attempts
        if (otpRecord.attempts >= 3) {
          otpRecord.isInvalidated = true;
        }
        
        await otpRecord.save();
        throw ApiError.unauthorized('Invalid OTP. Please try again.');
      }

      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();

      // Check if user exists
      let user = await UserService.findUserByPhone(phone);
      const isNewUser = !user;

      // Handle new user registration
      if (isNewUser) {
        // Name is required for new users
        if (!name) {
          throw ApiError.badRequest('Name is required for new user registration.');
        }

        // Generate a random password for the new user
        const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

        // Create new user
        user = await UserService.createUser({
          name,
          phone,
          email: `${phone.replace(/\+/g, '')}@temp.milqit.com`,
          password: randomPassword, // UserService will hash this
          isActive: true,
          isPhoneVerified: true,
          roles: ['customer']
        });
        
        if (!user) {
          throw ApiError.internal('Failed to create user account');
        }
      } else {
        // Update existing user - at this point we're sure user exists
        if (user?.id && !user.isPhoneVerified) {
          user.isPhoneVerified = true;
           await UserService.updateLastLogin(user.id);
        }
       
        
        // Update name if provided
        if (name && name !== user?.name) {
          // Update using UserModel directly since UserService might not have this method
          await UserModel.findByIdAndUpdate(user?.id, { name });

          // Get the updated user only if user.id is defined
          if (user?.id) {
            const updatedUser = await UserService.getActiveUserById(user.id);
            if (!updatedUser) {
              throw ApiError.internal('Failed to retrieve updated user');
            }
            user = updatedUser;
          }
        }
      }

      // Save device ID if provided
      if (deviceId && user) {
        // Store device ID for push notifications
        await UserModel.findByIdAndUpdate(user.id, { deviceId });
      }

      // Ensure user is not null before proceeding
      if (!user) {
        throw ApiError.internal('User not found after OTP verification');
      }

      // Generate auth tokens
      const tokenResponse = tokenService.generateAuthTokens(user.id, user.roles);
      
      // Ensure expiresIn is included in tokens
      const tokens: AuthTokens = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresIn: 3600 // Default to 1 hour
      };

      // Format response - we know user exists at this point
      return {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone || '',
          email: user.email,
          isPhoneVerified: true,
          isNewUser,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        },
        tokens
      };
    } catch (error: any) {
      // If error is already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error(`OTP verification failed for ${data.phone}: ${error.message}`);
      
      throw ApiError.internal(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Hash OTP for secure storage
   */
  private static async hashOtp(otp: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
  }

  /**
   * Verify OTP against stored hash
   */
  private static async verifyOtpHash(otp: string, hash: string): Promise<boolean> {
    return bcrypt.compare(otp, hash);
  }
}

// For backwards compatibility
export const authService = AuthService;