import { Body, Controller, Post, Route, Tags, SuccessResponse, Response, Middlewares } from 'tsoa';
import { validate } from '../../middleware/validation.middleware';


import UserService from '../../services/user.service';
import { ISendOtpInput, IVerifyOtpInput, IAuthResponse } from '../../types/auth.types';
import { logger } from '../../config/logger';
import { sendOtpSchema, verifyOtpSchema } from './../../validations/auth.validation';
import { ErrorResponse } from './../../types/common.types';
// import { otpAuthService } from '@/services/otpAuthService';
import { authService } from './../../services/auth.service';

/**
 * Controller for mobile authentication flows
 * Handles OTP-based login and registration
 */
@Route('mobile/auth')
@Tags('Mobile Authentication')
export class MobileAuthController extends Controller {
  /**
   * Initiates the login/registration flow by sending an OTP to the user's phone.
   * The client should use the response to determine if they need to ask for the user's name.
   */
  @Post('send-otp')
  @SuccessResponse(200, 'OTP Sent')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(422, 'Validation Error')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Server Error')
  @Middlewares(validate(sendOtpSchema))
  public async sendOtp(@Body() body: ISendOtpInput): Promise<{ 
    message: string; 
    isNewUser: boolean;
    expiresIn: number;
  }> {
    try {
      // Send OTP to the validated phone number
      const otpResult = await authService.sendLoginOtp(body.phone);
      
      // Check if this is a new user
      const isNewUser = !(await UserService.findUserByPhone(body.phone));
      
      this.setStatus(200);
      return {
        message: 'OTP sent successfully.',
        isNewUser,
        expiresIn: otpResult.expiresIn
      };
    } catch (error: any) {
      // logger.error('Failed to send OTP', {
      //   phone: body.phone,
      //   error: error.message
      // });
      
      // Let the global error handler take care of the error
      throw error;
    }
  }

  /**
   * Verifies an OTP to complete login or registration.
   * If the user is new, the `name` field is required.
   *
   * @param body The request body containing phone, OTP, and optional name.
   */
  @Post('verify-otp')
  @SuccessResponse(201, 'Authentication Successful')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(401, 'Invalid or Expired OTP')
  @Response<ErrorResponse>(422, 'Validation Error')
  @Response<ErrorResponse>(500, 'Server Error')
  @Middlewares(validate(verifyOtpSchema))
  public async verifyOtp(@Body() body: IVerifyOtpInput): Promise<IAuthResponse> {
    try {
      // Verify OTP and authenticate user
      const result = await authService.verifyOtpAndAuthenticate(body);
      
      this.setStatus(201);
      return result;
    } catch (error: any) {
      // logger.error('Failed to verify OTP', {
      //   phone: body.phone,
      //   error: error.message
      // });
      
      // Let the global error handler take care of the error
      throw error;
    }
  }

  /**
   * Resends an OTP to the user's phone number.
   * Can be used if the original OTP expires or wasn't received.
   */
  @Post('resend-otp')
  @SuccessResponse(200, 'OTP Resent')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(429, 'Too Many Requests')
  @Response<ErrorResponse>(500, 'Server Error')
  @Middlewares(validate(sendOtpSchema))
  public async resendOtp(@Body() body: ISendOtpInput): Promise<{ 
    message: string;
    expiresIn: number;
  }> {
    try {
      // Just reuse the sendLoginOtp method
      const otpResult = await authService.sendLoginOtp(body.phone);
      
      this.setStatus(200);
      return {
        message: 'OTP resent successfully.',
        expiresIn: otpResult.expiresIn
      };
    } catch (error: any) {
      // logger.error('Failed to resend OTP', {
      //   phone: body.phone,
      //   error: error.message
      // });
      
      // Let the global error handler take care of the error
      throw error;
    }
  }
}