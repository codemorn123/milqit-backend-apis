import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OtpModel, IOtpDocument } from '../models/OtpModel';
import { UserModel, IUserDocument } from '../models/UserModel';
import { ApiError } from '../utils/errorHandler';
import { config } from '../config';
import { logger } from '../config/logger';
import { OtpRequestInput, OtpVerifyInput } from '../validations/auth.validation';
import { SessionToken } from '../types/auth.types';

/**
 * Response interface for OTP request
 */
interface OtpRequestResponse {
  sessionToken: string;
  expiresIn: number;
}

/**
 * Response interface for OTP verification
 */
interface OtpVerificationResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    roles: string[];
  };
  isNewUser: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

/**
 * JWT Token Payload interface
 */
interface JwtTokenPayload {
  userId: string;
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
}

/**
 * Session token payload
 */
interface SessionTokenPayload {
  phone: string;
  isVerified: boolean;
  createdAt: number;
  userId?: string;
}

/**
 * Generate a secure OTP code
 */
function generateSecureOtp(): string {
  // returns a 6-digit zero-padded string
  const num = crypto.randomInt(0, 1_000_000);
  return String(num).padStart(6, '0');
}


function normalizeUserForResponse(raw: Partial<IUserDocument> | any) {
  const phone = raw?.phone ?? undefined;
  return {
    id: String(raw?._id ?? raw?.id ?? ''),
    name: String(raw?.name ?? ''),
    email: String(raw?.email ?? ''),
    phone: phone === null ? undefined : phone,
    roles: Array.isArray(raw?.roles) ? raw.roles : (raw?.roles ? [String(raw.roles)] : [])
  };
}
/**
 * Check rate limiting for OTP requests
 */
async function checkRateLimit(phone: string): Promise<void> {
  const existingOtp = await OtpModel.findOne({ phone }).lean<IOtpDocument | null>();

  if (existingOtp && existingOtp.expiresAt > new Date()) {
    // OTP was created at expiresAt - 10 minutes
    const createdAtMs = existingOtp.expiresAt.getTime() - 10 * 60 * 1000;
    const secondsSinceCreation = (Date.now() - createdAtMs) / 1000;

    if (secondsSinceCreation < 60) {
      throw ApiError.tooManyRequests(
        `Please wait ${Math.ceil(60 - secondsSinceCreation)} seconds before requesting a new OTP`
      );
    }
  }
}

/**
 * Send OTP via SMS (simulated in non-production by logging)
 */
async function sendSMS(phone: string, otp: string): Promise<boolean> {
  if (config.env !== 'production') {
    logger.info({ phone, otp }, '[SIMULATED SMS]');
    return true;
  }

  try {
    const message = `${otp} is your verification code for Blinkit. Valid for 10 minutes.`;

    // In production, integrate with an actual SMS provider here.
    logger.info({ phone, otp }, '[SIMULATED SMS IN PRODUCTION - NO SMS PROVIDER CONFIGURED]');
    return true;
  } catch (error) {
    logger.error({ error, phone }, 'SMS sending error');
    return false;
  }
}

/**
 * Parse expiry strings like "15m", "1h", "7d" into seconds.
 * Falls back to the provided defaultSeconds if parsing fails.
 */
function parseExpiryToSeconds(expiry: string | undefined, defaultSeconds: number): number {
  if (!expiry) return defaultSeconds;

  const num = parseInt(expiry, 10);
  if (Number.isNaN(num)) return defaultSeconds;

  if (expiry.endsWith('m')) return num * 60;
  if (expiry.endsWith('h')) return num * 3600;
  if (expiry.endsWith('d')) return num * 86400;
  // plain number assumed to be seconds
  return num;
}

export const otpAuthService = {
  /**
   * Request a new OTP for phone verification
   */
  async requestOtp(data: OtpRequestInput): Promise<OtpRequestResponse> {
    try {
      const { phone } = data;

      // Check rate limiting
      await checkRateLimit(phone);

      // Generate OTP
      // const otp = generateSecureOtp();
      const otp = "123456";
      console.log("generateSecureOtpgenerateSecureOtp", otp);

      // Set expiry (10 minutes)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Delete any existing OTP
      await OtpModel.deleteOne({ phone });

      // Create new OTP record
      const storedOtp = config.env === 'production' ? await bcrypt.hash(otp, 5) : otp;

      await OtpModel.create({
        phone,
        otp: storedOtp,
        expiresAt,
        attempts: 0,
        verified: false
      });

      // Send OTP via SMS
      const smsSent = await sendSMS(phone, otp);

      if (!smsSent) {
        await OtpModel.deleteOne({ phone });
        throw ApiError.internal('Failed to send verification code. Please try again later.');
      }

      // Generate session token
      const sessionPayload: SessionTokenPayload = {
        phone,
        isVerified: false,
        createdAt: Date.now()
      };

      const sessionOptions: SignOptions = {
        expiresIn: '1h',
        algorithm: 'HS256' as Algorithm,
        issuer: 'blinkit-api'
      };

      const sessionToken = jwt.sign(sessionPayload, config.jwt.sessionSecret, sessionOptions);

      // Calculate expiry in seconds
      const expiresIn = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

      logger.info({ phone }, 'OTP requested successfully');

      return { sessionToken, expiresIn };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error({ error }, 'OTP request failed');
      throw ApiError.internal('Failed to generate verification code');
    }
  },

  /**
   * Verify an OTP and authenticate the user
  //  */
  // async verifyOtp(data: OtpVerifyInput): Promise<OtpVerificationResponse> {
  //   try {
  //     const { phone, otp } = data;

  //     // Find OTP record
  //     const otpRecord = await OtpModel.findOne({ phone }).lean<IOtpDocument | null>();
  //     if (!otpRecord) {
  //       throw ApiError.notFound('Verification code not found. Please request a new code.');
  //     }

  //     // Check if OTP is expired
  //     if (otpRecord.expiresAt < new Date()) {
  //       await OtpModel.deleteOne({ phone });
  //       throw ApiError.badRequest('Verification code has expired. Please request a new one.');
  //     }

  //     // Check attempts (limit to 3 attempts)
  //     if (otpRecord.attempts >= 3) {
  //       await OtpModel.deleteOne({ phone });
  //       throw ApiError.tooManyRequests('Too many failed attempts. Please request a new verification code.');
  //     }

  //     // Verify OTP
  //     let isValid: boolean;

  //     if (config.env === 'production' && otpRecord.otp.length > 10) {
  //       // Compare hash in production
  //       isValid = await bcrypt.compare(otp, otpRecord.otp);
  //     } else {
  //       // Direct comparison in development
  //       isValid = otpRecord.otp === otp;
  //     }

  //     if (!isValid) {
  //       // Increment attempts
  //       const updated = await OtpModel.findOneAndUpdate(
  //         { phone },
  //         { $inc: { attempts: 1 } },
  //         { new: true }
  //       ).lean<IOtpDocument | null>();

  //       const remainingAttempts = updated ? Math.max(0, 3 - updated.attempts) : 0;

  //       throw ApiError.badRequest(
  //         `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
  //       );
  //     }

  //     // Mark OTP as verified
  //     await OtpModel.updateOne({ phone }, { $set: { verified: true } });

  //     // Find or create user
  //     const existingUser = await UserModel.findOne({ phone }).lean<IUserDocument | null>();
  //     let userDoc: IUserDocument | null = null;
  //     let isNewUser = false;

  //     if (!existingUser) {
  //       isNewUser = true;

  //       // Generate secure password
  //       const randomPassword = crypto.randomBytes(32).toString('hex');
  //       const passwordHash = await bcrypt.hash(randomPassword, 12);

  //       // Generate unique email
  //       const tempEmailId = crypto.randomUUID();
  //       const tempEmail = `${tempEmailId}@temp.blinkit.com`;

  //       // Create new user
  //       const newUser = await UserModel.create({
  //         phone,
  //         name: `User-${phone.slice(-4)}`,
  //         email: tempEmail,
  //         passwordHash,
  //         roles: ['customer'],
  //         isActive: true,
  //         isPhoneVerified: true,
  //         isEmailVerified: false
  //       });

  //       // newUser is a mongoose document (not lean), keep it as-is
  //       userDoc = newUser as unknown as IUserDocument;
  //       logger.info({ userId: userDoc._id.toString() }, 'New user created via OTP verification');
  //     } else {
  //       // Use existing user - update verification and lastLogin
  //       const updateData = {
  //         isPhoneVerified: true,
  //         lastLogin: new Date()
  //       };

  //       const updatedUser = await UserModel.findByIdAndUpdate(
  //         existingUser._id,
  //         { $set: updateData },
  //         { new: true }
  //       ).lean<IUserDocument | null>();

  //       if (!updatedUser) {
  //         throw ApiError.internal('Failed to update user data');
  //       }

  //       // updatedUser is plain object from lean; but we can treat it as IUserDocument-like for reading fields
  //       userDoc = updatedUser as unknown as IUserDocument;
  //       logger.info({ userId: userDoc._id.toString() }, 'User logged in via OTP verification');
  //     }

  //     if (!userDoc) {
  //       throw ApiError.internal('User processing failed');
  //     }

  //     // Ensure account enabled explicitly (only block if isActive === false)
  //     if (userDoc.isActive === false) {
  //       throw ApiError.forbidden('Account is disabled. Please contact support.');
  //     }

  //     // Clean up OTP record
  //     await OtpModel.deleteOne({ phone });

  //     // Create proper JWT payloads with consistent user._id usage
  //     const accessPayload: JwtTokenPayload = {
  //       userId: userDoc._id.toString(),
  //       email: userDoc.email,
  //       roles: Array.isArray(userDoc.roles) ? userDoc.roles : [],
  //       type: 'access'
  //     };

  //     const refreshPayload: JwtTokenPayload = {
  //       userId: userDoc._id.toString(),
  //       email: userDoc.email,
  //       roles: Array.isArray(userDoc.roles) ? userDoc.roles : [],
  //       type: 'refresh'
  //     };

  //     // Create properly typed JWT options
  //     const accessOptions: SignOptions = {
  //       expiresIn: parseInt(config.jwt.accessExpiry),
  //       algorithm: 'HS256' as Algorithm,
  //       issuer: 'blinkit-api'
  //     };

  //     const refreshOptions: SignOptions = {
  //       expiresIn:parseInt( config.jwt.refreshExpiry),
  //       algorithm: 'HS256' as Algorithm,
  //       issuer: 'blinkit-api'
  //     };

  //     // Generate tokens
  //     const accessToken = jwt.sign(accessPayload, config.jwt.secret, accessOptions);
  //     const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, refreshOptions);

  //     // Calculate token expiration seconds
  //     const expiresIn = parseExpiryToSeconds(config.jwt.accessExpiry, 15 * 60);

  //     // Normalize phone to avoid null (convert null -> undefined)
  //     const normalizedPhone: string | undefined = (userDoc.phone ?? undefined) as string | undefined;

  //     // Return properly typed response
  //     return {
  //       user: {
  //         id: userDoc._id.toString(),
  //         name: userDoc.name,
  //         email: userDoc.email,
  //         phone: normalizedPhone,
  //         roles: Array.isArray(userDoc.roles) ? userDoc.roles : []
  //       },
  //       isNewUser,
  //       tokens: {
  //         accessToken,
  //         refreshToken,
  //         expiresIn
  //       }
  //     };
  //   } catch (error) {
  //     if (error instanceof ApiError) throw error;
  //     logger.error({ error }, 'OTP verification failed');
  //     throw ApiError.internal('Verification failed. Please try again.');
  //   }
  // },



  async verifyOtp(data: OtpVerifyInput): Promise<OtpVerificationResponse> {
    try {
      const { phone, otp } = data;

      const otpRecord = await OtpModel.findOne({ phone }).lean<IOtpDocument | null>();
      if (!otpRecord) {
        throw ApiError.notFound('Verification code not found. Please request a new code.');
      }

      if (otpRecord.expiresAt < new Date()) {
        await OtpModel.deleteOne({ phone });
        throw ApiError.badRequest('Verification code has expired. Please request a new one.');
      }

      if (otpRecord.attempts >= 3) {
        await OtpModel.deleteOne({ phone });
        throw ApiError.tooManyRequests('Too many failed attempts. Please request a new verification code.');
      }

      let isValid = false;
      if (config.env === 'production' && typeof otpRecord.otp === 'string' && otpRecord.otp.length > 10) {
        isValid = await bcrypt.compare(otp, otpRecord.otp);
      } else {
        isValid = otpRecord.otp === otp;
      }

      if (!isValid) {
        const updated = await OtpModel.findOneAndUpdate(
          { phone },
          { $inc: { attempts: 1 } },
          { new: true }
        ).lean<IOtpDocument | null>();

        const remainingAttempts = updated ? Math.max(0, 3 - (updated.attempts ?? 0)) : 0;
        throw ApiError.badRequest(
          `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
        );
      }

      // Mark OTP verified
      await OtpModel.updateOne({ phone }, { $set: { verified: true } });

      // Either find existing user or create new one
      const existingUser = await UserModel.findOne({ phone }).lean<IUserDocument | null>();
      let userDoc: IUserDocument | null = null;
      let isNewUser = false;

      if (!existingUser) {
        isNewUser = true;

        const randomPassword = crypto.randomBytes(32).toString('hex');
        const passwordHash = await bcrypt.hash(randomPassword, 12);
        const tempEmail = `${crypto.randomUUID()}@temp.blinkit.com`;

        const newUser = await UserModel.create({
          phone,
          name: `User-${phone.slice(-4)}`,
          email: tempEmail,
          passwordHash,
          roles: ['customer'],
          isActive: true,
          isPhoneVerified: true,
          isEmailVerified: false
        });

        // newUser is a mongoose document (not lean)
        userDoc = newUser as unknown as IUserDocument;
        logger.info({ userId: userDoc._id?.toString() }, 'New user created via OTP verification');
      } else {
        // Update existing user (use non-lean to preserve mongoose doc features if needed)
        const updatedUser = await UserModel.findByIdAndUpdate(
          existingUser._id,
          { $set: { isPhoneVerified: true, lastLogin: new Date() } },
          { new: true }
        ).lean<IUserDocument | null>();

        if (!updatedUser) {
          throw ApiError.internal('Failed to update user data');
        }

        userDoc = updatedUser as unknown as IUserDocument;
        logger.info({ userId: userDoc._id?.toString() }, 'User logged in via OTP verification');
      }

      if (!userDoc) {
        throw ApiError.internal('User processing failed');
      }

      // Block only if explicitly disabled
      if (userDoc.isActive === false) {
        throw ApiError.forbidden('Account is disabled. Please contact support.');
      }

      // Cleanup OTP
      await OtpModel.deleteOne({ phone });

      // Build JWT payloads
      const roles = Array.isArray(userDoc.roles) ? userDoc.roles : [];
      const accessPayload: JwtTokenPayload = {
        userId: userDoc._id.toString(),
        email: userDoc.email,
        roles,
        type: 'access'
      };
      const refreshPayload: JwtTokenPayload = {
        userId: userDoc._id.toString(),
        email: userDoc.email,
        roles,
        type: 'refresh'
      };

      const accessOptions: SignOptions = {
        expiresIn: parseInt(config.jwt.accessExpiry),
        algorithm: 'HS256' as Algorithm,
        issuer: 'blinkit-api'
      };
      const refreshOptions: SignOptions = {
        expiresIn: parseInt(config.jwt.refreshExpiry),
        algorithm: 'HS256' as Algorithm,
        issuer: 'blinkit-api'
      };

      const accessToken = jwt.sign(accessPayload, config.jwt.secret, accessOptions);
      const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, refreshOptions);

      const expiresIn = parseExpiryToSeconds(config.jwt.accessExpiry, 15 * 60);

      // Normalize phone to avoid null in response (string | undefined)
      const normalized = normalizeUserForResponse(userDoc);

      return {
        user: normalized,
        isNewUser,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn
        }
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      logger.error({ err }, 'OTP verification failed');
      throw ApiError.internal('Verification failed. Please try again.');
    }
  },

  /**
   * Verify session token for OTP flow
   */
  async verifySessionToken(sessionToken: string): Promise<SessionToken> {
    try {
      const decoded = jwt.verify(
        sessionToken,
        config.jwt.sessionSecret,
        {
          algorithms: ['HS256'],
          issuer: 'blinkit-api'
        }
      ) as SessionTokenPayload;

      // Check token age
      const sessionAgeMs = Date.now() - (decoded.createdAt || 0);
      const maxSessionAgeMs = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAgeMs > maxSessionAgeMs) {
        throw ApiError.unauthorized('Session has expired. Please start a new verification process.');
      }

      return {
        phone: decoded.phone,
        isVerified: decoded.isVerified,
        userId: decoded.userId
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid or expired session token');
      }
      if (error instanceof ApiError) throw error;

      logger.error({ error }, 'Session token verification failed');
      throw ApiError.unauthorized('Session verification failed');
    }
  },

  /**
   * Link phone number to existing account
   */
  async linkPhoneToAccount(
    userId: string,
    phone: string,
    verificationCode: string
  ): Promise<boolean> {
    try {
      // Validate ObjectId
      if (!mongoose.isValidObjectId(userId)) {
        throw ApiError.badRequest('Invalid user ID');
      }

      // Find user with proper typing
      const user = await UserModel.findById(userId);
      if (!user) {
        throw ApiError.notFound('User not found');
      }

      // Verify OTP
      const otpRecord = await OtpModel.findOne({ phone }).lean<IOtpDocument | null>();
      if (!otpRecord) {
        throw ApiError.badRequest('Verification code not found');
      }

      if (otpRecord.expiresAt < new Date()) {
        await OtpModel.deleteOne({ phone });
        throw ApiError.badRequest('Verification code has expired');
      }

      // Verify the code
      let isValid: boolean;
      if (config.env === 'production' && otpRecord.otp.length > 10) {
        isValid = await bcrypt.compare(verificationCode, otpRecord.otp);
      } else {
        isValid = otpRecord.otp === verificationCode;
      }

      if (!isValid) {
        throw ApiError.badRequest('Invalid verification code');
      }

      // Check if phone is used by another account
      const existingUserWithPhone = await UserModel.findOne({
        phone,
        _id: { $ne: new mongoose.Types.ObjectId(userId) }
      });

      if (existingUserWithPhone) {
        throw ApiError.conflict('Phone number is already linked to another account');
      }

      // Update user with phone number
      user.phone = phone;
      user.isPhoneVerified = true;
      await user.save();

      // Clean up OTP
      await OtpModel.deleteOne({ phone });

      logger.info({ userId, phone }, 'Phone number linked to account');
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error({ error, userId, phone }, 'Failed to link phone to account');
      throw ApiError.internal('Failed to link phone number to account');
    }
  }
};