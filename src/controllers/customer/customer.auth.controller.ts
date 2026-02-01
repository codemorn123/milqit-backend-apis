import { Body, Post, Route, Tags, Response, Middlewares, SuccessResponse as TsoaSuccessResponse, Request } from 'tsoa';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import UserService from '../../services/user.service';
import { ISendOtpInput, IVerifyOtpInput, IAuthResponse, AuthTokens } from '../../types/auth.types';
import { sendOtpSchema, verifyOtpSchema } from '../../validations/auth.validation';
import { authService } from '../../services/auth.service';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { BaseController } from '../base.controller';
import { CustomerControllerResponses } from '../../constants/response-decorators';
import { SUCCESS_MESSAGES } from '../../constants/response-messages';
import CookieHelper from '../../utils/cookie.helper';

@Route('customer/auth')
@Tags('Customer Authentication')
@CustomerControllerResponses()
export class MobileAuthController extends BaseController {
  @Post('send-otp')
  @Middlewares([validateSchemaMiddleware(sendOtpSchema, "body")])

  public async sendOtp(@Body() body: ISendOtpInput): Promise<SuccessResponse<{ isNewUser: boolean, otp: string }>> {
    const otpResult = await authService.sendLoginOtp(body.phone);
    const isNewUser = !(await UserService.findUserByPhone(body.phone));
    return this.sendSuccess({ isNewUser, otp: otpResult.otp }, SUCCESS_MESSAGES.OTP_SENT);
  }

  /**
   * Verify OTP and login/register
   * For web platform: Sets HTTP-only cookies for access and refresh tokens
   * For mobile platform: Returns tokens in response body
   */
  @Post('verify-otp')
  @Middlewares([validateSchemaMiddleware(verifyOtpSchema, "body")])
  public async verifyOtp(
    @Body() body: IVerifyOtpInput,
    @Request() request: ExpressRequest
  ): Promise<SuccessResponse<IAuthResponse>> {
    const result = await authService.loginOrRegister(body.phone, body.otp);

    // Check if platform is web - set cookies
    const platform = body.platform || 'mobile';
    if (platform === 'web') {
      const res = request.res as ExpressResponse;

      // Set HTTP-only cookies for web
      CookieHelper.setAuthTokens(
        res,
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.tokens.expiresIn,
        604800 // 7 days for refresh token
      );

      // For web, you can optionally still return tokens in body for localStorage fallback
      // Or remove them from response for extra security (cookies only)
      // Uncomment below to remove tokens from response body for web:
      // return this.sendSuccess({ user: result.user, tokens: { accessToken: '', refreshToken: '', expiresIn: result.tokens.expiresIn } }, SUCCESS_MESSAGES.LOGIN_SUCCESS);
    }

    return this.sendSuccess(result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
  }

  @Post('resend-otp')
  @Middlewares([validateSchemaMiddleware(sendOtpSchema, "body")])
  public async resendOtp(@Body() body: ISendOtpInput): Promise<SuccessResponse<{ otp: string }>> {
    const otpResult = await authService.sendLoginOtp(body.phone);
    return this.sendSuccess({ otp: otpResult.otp }, SUCCESS_MESSAGES.OTP_SENT);
  }

  /**
   * Refresh authentication tokens
   * Supports both body-based (mobile) and cookie-based (web) refresh tokens
   */
  @Post('refresh-token')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async refreshToken(
    @Body() body: { refreshToken?: string; platform?: 'mobile' | 'web' },
    @Request() request: ExpressRequest
  ): Promise<SuccessResponse<{ tokens: AuthTokens }>> {
    const platform = body.platform || 'mobile';

    // Get refresh token from cookie (web) or body (mobile)
    let refreshToken = body.refreshToken;

    if (platform === 'web') {
      // Try to get from cookie first for web platform
      refreshToken = CookieHelper.getRefreshToken(request) || body.refreshToken;
    }

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const result = await authService.refreshToken({ refreshToken });

    // If web platform, update cookies
    if (platform === 'web') {
      const res = request.res as ExpressResponse;
      CookieHelper.setAuthTokens(
        res,
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.tokens.expiresIn,
        604800
      );
    }

    return this.sendSuccess(result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
  }

  /**
   * Logout - Clear authentication cookies (web only)
   */
  @Post('logout')
  public async logout(
    @Request() request: ExpressRequest
  ): Promise<SuccessResponse<null>> {
    const res = request.res as ExpressResponse;
    CookieHelper.clearAuthTokens(res);
    return this.sendResponse('Logged out successfully');
  }
}