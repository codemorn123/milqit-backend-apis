


import bcrypt from 'bcrypt';
import { OtpModel } from '../models/OtpModel';
import { tokenService } from './token.service';
import { logger } from '../config/logger';
import { SmsService } from './sms.service';
import UserService from './user.service';
import { IUser, UserModel } from '../models/UserModel';

import {
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

const MAX_OTP_ATTEMPTS = 5;

/**
 * Service for handling authentication-related operations
 */
export class AuthService {


  /**
   * Refreshes authentication tokens
   * @param data Refresh token data
   * @returns New authentication tokens
   */
  static async refreshToken(data: RefreshTokenInput): Promise<{ tokens: AuthTokens }> {
    if (!data.refreshToken) {
      throw new PresentableError('VALIDATION_ERROR', 'Refresh token is required');
    }

    const payload = tokenService.verifyRefreshToken(data.refreshToken);
  
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



    



  static async sendLoginOtp(phone: string): Promise<{ expiresIn: number; otp: string }> {
    try {
      if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
        throw new PresentableError('VALIDATION_ERROR', 'Valid phone number is required');
      }
  
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentOtps = await OtpModel.countDocuments({
        phone,
        createdAt: { $gte: hourAgo }
      });
  
      if (recentOtps >= 5) {
        throw new PresentableError('TOO_MANY_REQUESTS', 'Too many OTP requests. Please try again later.');
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await this.hashOtp(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
      const existingOtp = await OtpModel.findOne({ phone });
  
      if (existingOtp) {
        await OtpModel.updateOne(
          { phone },
          {
            otp: hashedOtp,
            expiresAt,
            attempts: 0,
            isVerified: false,
            isInvalidated: false,
            createdAt: new Date()
          }
        );
      } else {
        await OtpModel.create({
          phone,
          otp: hashedOtp,
          expiresAt,
          attempts: 0,
          isVerified: false,
          isInvalidated: false
        });
      }
  
      await SmsService.sendOtp(phone, otp);
      logger.info(`OTP sent to ${phone} successfully`);
      return { expiresIn: 10 * 60, otp };
    } catch (error: any) {
      if (error instanceof PresentableError) throw error;
      logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      throw new PresentableError('SERVER_ERROR', `Failed to send OTP: ${error.message}`);
    }
  }

  


  static async loginOrRegister(phone: string, otp: string): Promise<IAuthResponse> {
    const verificationResult = await this.verifyOtp(phone, otp);
    if (!verificationResult.success) {
      throw new PresentableError('UNAUTHORIZED', verificationResult.message);
    }
  
    await OtpModel.deleteOne({ phone, isVerified: true });
    let user = await UserModel.findOne({ phone });
    if (!user) {
      const dummyPassword = await bcrypt.hash(phone + new Date().toISOString(), 10);
      user = new UserModel({
        phone,
        isPhoneVerified: true,
        isNewUser: true, 
        passwordHash: dummyPassword,
      });
      await user.save();
    } else {
      // Update existing user's last login
      user.isNewUser = false; // No longer a new user after the first login
      user.lastLogin = new Date();
      await user.save();
    }
  
    const token = tokenService.generateAuthTokens(user.id, ['customer']);
    return {
      user,
      tokens: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresIn: parseInt(token.expiresIn) || 3600
      }
    };
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







  static async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    const otpDoc = await OtpModel.findOne({
      phone,
      isVerified: false,
    }).sort({ createdAt: -1 }); // Get the most recent OTP

    if (!otpDoc) {
      return { success: false, message: 'No active OTP found. Please request a new one.' };
    }

    if (new Date() > otpDoc.expiresAt) {
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (otpDoc.attempts >= MAX_OTP_ATTEMPTS) {
        return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
    }

    // ✅ The fix is here: Use bcrypt.compare
    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return { success: false, message: `Invalid OTP. You have ${MAX_OTP_ATTEMPTS - otpDoc.attempts} attempts left.` };
    }

    // If the OTP is correct, mark it as verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }
  
}

// For backwards compatibility
export const authService = AuthService;