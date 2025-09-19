


import bcrypt from 'bcrypt';
import { OtpModel } from '../models/OtpModel';
import { tokenService } from './token.service';
import { logger } from '../config/logger';
import { SmsService } from './sms.service';
import UserService from './user.service';
import { UserModel } from '../models/UserModel';

import {
  IVerifyOtpInput,
  IAuthResponse,
  AuthTokens,
  LoginRequest as LoginInput,
  RegisterRequest as RegisterInput,
  RefreshTokenRequest as RefreshTokenInput,
  CreateAdminRequest as CreateAdminInput,
  UserProfile
} from '../types/auth.types';
import { CreateUserInput } from '../schemas/userSchemas';
import { PresentableError } from '../error/clientErrorHelper';
import { AdminService } from './admin.service';
import { IAdminDocument } from '../models/AdminModel';
// import Response as ExResponse from 'express';

/**
 * Service for handling authentication-related operations
 */
export class AuthService {
  /**
   * Registers a new user
   * @param data Registration data
   * @returns User profile and authentication tokens
   */
  static async register(data: RegisterInput): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    // Validate input
    if (!data.email) {
      throw new PresentableError('VALIDATION_ERROR', 'Email is required');
    }
    
    // Check if user already exists
    await UserService.checkIfUserExists(data.email, data.phone);
    
    // Create new user
    const newUser = await UserService.createUser(data as CreateUserInput, false);
    if (!newUser) {
      throw new PresentableError('SERVER_ERROR', 'Failed to create user');
    }
    
    // Generate authentication tokens
    const tokenResponse = tokenService.generateAuthTokens(newUser.id, newUser.roles);
    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: parseInt(tokenResponse.expiresIn) || 3600
    };
    
    return { user: newUser.toProfileDTO(), tokens };
  }


  static async login(data: LoginInput): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    // Validate input
    if (!data.email || !data.password) {
      throw new PresentableError('VALIDATION_ERROR', 'Email and password are required');
    }
    
    // Find user by email
    const user = await UserService.getActiveUserByEmail(data.email);
    if (!user) {
      throw new PresentableError('UNAUTHORIZED', 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new PresentableError('UNAUTHORIZED', 'Invalid credentials');
    }

    // Update last login timestamp
    await UserService.updateLastLogin(user.id);
    
    // Generate authentication tokens
    const tokenResponse = tokenService.generateAuthTokens(user.id, user.roles);
    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: parseInt(tokenResponse.expiresIn) || 3600
    };

    return { user: user.toProfileDTO(), tokens };
  }

  /**
   * Refreshes authentication tokens
   * @param data Refresh token data
   * @returns New authentication tokens
   */
  static async refreshToken(data: RefreshTokenInput): Promise<{ tokens: AuthTokens }> {
    if (!data.refreshToken) {
      throw new PresentableError('VALIDATION_ERROR', 'Refresh token is required');
    }
    
    // Verify the refresh token
    const payload = tokenService.verifyRefreshToken(data.refreshToken);
    
    // Check if user exists and is active
    const user = await UserService.getActiveUserById(payload.userId);
    if (!user) {
      throw new PresentableError('UNAUTHORIZED', 'User not found or account is disabled');
    }

    // Generate new authentication tokens
    const tokenResponse = tokenService.generateAuthTokens(user.id, user.roles);
    const tokens: AuthTokens = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: parseInt(tokenResponse.expiresIn) || 3600
    };
    
    return { tokens };
  }

  /**
   * Creates a new admin user
   * @param data Admin user data
   * @param creatorId ID of the user creating the admin
   * @returns Created admin user profile
   */
  static async createAdmin(data: CreateAdminInput, ): Promise<UserProfile> {
    const adminDoc = await AdminService.createAdmin(data);
    
    if (!adminDoc) {
      throw new PresentableError('SERVER_ERROR', 'Failed to create admin user');
    }

    return adminDoc ;
  }

  /**
   * Bootstraps the first admin account if none exist
   * @param data Admin user data
   * @returns Created admin user profile
   */
  static async bootstrapAdmin(data: CreateAdminInput): Promise<UserProfile> {
    // Check if admin accounts already exist
    const adminCount = await UserService.countAdmins();
    if (adminCount > 0) {
      throw new PresentableError('FORBIDDEN', 'Admin accounts already exist. Bootstrap is not allowed.');
    }
    
    // Create bootstrap admin user
    const adminUser = await UserService.createUser({
      ...data,
      isActive: data.isActive ?? true,
      isPhoneVerified: true
    }, true);
    
    if (!adminUser) {
      throw new PresentableError('SERVER_ERROR', 'Failed to bootstrap admin user');
    }

    return adminUser.toProfileDTO();
  }

  /**
   * Sends a login OTP to the provided phone number
   * @param phone Phone number in E.164 format
   * @returns Object containing expiration time and OTP (for development)
   */
  static async sendLoginOtp(phone: string): Promise<{ expiresIn: number; otp: string }> {
    try {
      // Validate phone number
      if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
        throw new PresentableError('VALIDATION_ERROR', 'Valid phone number is required');
      }

      // Check for rate limiting (max 5 OTPs in 1 hour per phone number)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentOtps = await OtpModel.countDocuments({
        phone,
        createdAt: { $gte: hourAgo }
      });

      if (recentOtps >= 5) {
        throw new PresentableError('TOO_MANY_REQUESTS', 'Too many OTP requests. Please try again later.');
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash OTP before storing
      const hashedOtp = await this.hashOtp(otp);
      
      // OTP expires in 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // Find existing OTP record or create new one
      const existingOtp = await OtpModel.findOne({ phone });
      
      if (existingOtp) {
        // Update existing OTP record
        await OtpModel.updateOne(
          { phone },
          {
            otp: hashedOtp,
            expiresAt,
            attempts: 0,
            verified: false,
            isInvalidated: false,
            createdAt: new Date() // Update creation time for new OTP
          }
        );
      } else {
        // Create new OTP record
        await OtpModel.create({
          phone,
          otp: hashedOtp,
          expiresAt,
          attempts: 0,
          verified: false,
          isInvalidated: false
        });
      }

      // Send OTP via SMS service
      await SmsService.sendOtp(phone, otp);
      
      logger.info(`OTP sent to ${phone} successfully`);
      
      return { expiresIn: 10 * 60, otp }; // 10 minutes in seconds
    } catch (error: any) {
      if (error instanceof PresentableError) {
        throw error;
      }
      
      logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      throw new PresentableError('SERVER_ERROR', `Failed to send OTP: ${error.message}`);
    }
  }

  /**
   * Verifies OTP and authenticates the user
   * Creates a new user if they don't exist
   * @param data Object containing phone, OTP, and optional name
   * @returns Authentication response with user data and tokens
   */
  static async verifyOtpAndAuthenticate(data: IVerifyOtpInput): Promise<IAuthResponse> {
    try {
      const { phone, otp, name, deviceId } = data;
      
      // Validate phone and OTP
      if (!phone || !otp) {
        throw new PresentableError('VALIDATION_ERROR', 'Phone and OTP are required');
      }
      
      // Find the most recent non-expired, non-verified OTP for this phone
      const otpRecord = await OtpModel.findOne({
        phone,
        expiresAt: { $gt: new Date() },
        verified: false,
        isInvalidated: { $ne: true }
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        throw new PresentableError('VALIDATION_ERROR', 'OTP has expired. Please request a new one.');
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
        throw new PresentableError('VALIDATION_ERROR', 'Invalid OTP. Please try again.');
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
          throw new PresentableError('VALIDATION_ERROR', 'Name is required for new user registration.');
        }
        
        // Generate a random password for the new user
        const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        
        // Create new user
        user = await UserService.createUser({
          name,
          phone,
          mobileNumber: phone, // Ensure mobileNumber field is set
          email:"",
          password: randomPassword,
          isActive: true,
          isPhoneVerified: true,
          roles: ['customer']
        });
        
        if (!user) {
          throw new PresentableError('SERVER_ERROR', 'Failed to create user account');
        }
      } else {
        // Update existing user if phone not yet verified
        if (user?.id && !user.isPhoneVerified) {
          user.isPhoneVerified = true;
          await UserService.updateLastLogin(user.id);
        }
        
        // Update name if provided and different
        if (name && name !== user?.name) {
          // Update both name and mobileNumber if needed
          await UserModel.findByIdAndUpdate(user?.id, { 
            name,
            mobileNumber: phone 
          });

          // Get updated user
          if (user?.id) {
            const updatedUser = await UserService.getActiveUserById(user.id);
            if (!updatedUser) {
              throw new PresentableError('SERVER_ERROR', 'Failed to update user information');
            }
            user = updatedUser;
          }
        }
      }

      // Save device ID if provided
      if (deviceId && user && user.id) {
        await UserModel.findByIdAndUpdate(user.id, { deviceId });
      }

      // Final check to ensure user exists
      if (!user) {
        throw new PresentableError('SERVER_ERROR', 'User not found after OTP verification');
      }

      // Generate auth tokens
      const tokenResponse = tokenService.generateAuthTokens(user.id, user.roles);
      
      // Format tokens with expiresIn
      const tokens: AuthTokens = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresIn: parseInt(tokenResponse.expiresIn) || 3600 // Default to 1 hour if not provided
      };

      // Return user profile and tokens
      return {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone || '',
          email: user.email || '',
          isPhoneVerified: true,
          isNewUser,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        },
        tokens
      };
    } catch (error: any) {
      // If error is already a PresentableError, rethrow it
      if (error instanceof PresentableError) {
        throw error;
      }
      
      logger.error(`OTP verification failed for ${data.phone}: ${error.message}`);
      throw new PresentableError('SERVER_ERROR', `Authentication failed: ${error.message}`);
    }
  }

  /**
   * Hash OTP for secure storage
   * @param otp OTP to hash
   * @returns Hashed OTP
   */
  private static async hashOtp(otp: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
  }

  /**
   * Verify OTP against stored hash
   * @param otp OTP to verify
   * @param hash Stored hash to compare against
   * @returns Whether OTP is valid
   */
  private static async verifyOtpHash(otp: string, hash: string): Promise<boolean> {
    return bcrypt.compare(otp, hash);
  }


  
}

// For backwards compatibility
export const authService = AuthService;