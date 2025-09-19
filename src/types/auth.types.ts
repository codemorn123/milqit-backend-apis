/**
 * Core user model interface representing user data in the database
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string; // Stored as hashed value
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The shape of the user profile data that is safe to return to clients.
 * Password and sensitive data are omitted.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: string; // ISO string format
  createdAt: string;  // ISO string format
  updatedAt: string;  // ISO string format
}

/**
 * JWT token payload structure
 */
export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
}

/**
 * Authentication tokens returned after successful authentication
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Expiration time in seconds
}

/**
 * The complete response for a successful login or registration
 */
export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

/**
 * Error response structure
 */


// ===== Request DTOs =====

/**
 * Login request data
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request data
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// ===== Mobile Authentication DTOs =====

/**
 * Session token for mobile authentication flow
 */
export interface SessionToken {
  phone: string;
  isVerified: boolean;
  userId?: string;
}

/**
 * Send OTP request input
 */
export interface ISendOtpInput {
  phone: string;
}

/**
 * Verify OTP request input
 */
export interface IVerifyOtpInput {
  phone: string;
  otp: string;
  name?: string; // Required for new users
  deviceId?: string; // Optional device identifier for push notifications
}

/**
 * OTP verification response
 */
export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  isNewUser?: boolean;
  user?: UserProfile;
  tokens?: AuthTokens;
}

/**
 * Mobile authentication response
 */
export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    isPhoneVerified: boolean;
    isNewUser: boolean;
    createdAt: string;
    updatedAt: string;
  };
  tokens: AuthTokens;
}

// ===== Admin Authentication DTOs =====

/**
 * Create admin request
 */
export interface CreateAdminRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  isActive?: boolean;
  roles: Array<'admin' | 'manager' | 'staff'>;
}


