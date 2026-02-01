import { Body, Post, Route, Tags, Response, Middlewares, SuccessResponse as TsoaSuccessResponse } from 'tsoa';
import { StatusCodes } from 'http-status-codes/build/cjs';
import UserService from '../../services/user.service';
import { ISendOtpInput, IVerifyOtpInput, IAuthResponse, AuthTokens } from '../../types/auth.types';
import { sendOtpSchema, verifyOtpSchema } from '../../validations/auth.validation';
import { authService } from '../../services/auth.service';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { BaseController } from '../base.controller';
import { CustomerControllerResponses } from '../../constants/response-decorators';
import { SUCCESS_MESSAGES } from '../../constants/response-messages';

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

  @Post('verify-otp')
  @Middlewares([validateSchemaMiddleware(verifyOtpSchema, "body")])
  public async verifyOtp(@Body() body: IVerifyOtpInput): Promise<SuccessResponse<IAuthResponse>> {
    const result = await authService.loginOrRegister(body.phone, body.otp);
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
   */
  @Post('refresh-token')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async refreshToken(@Body() body: { refreshToken: string }): Promise<SuccessResponse<{ tokens: AuthTokens }>> {
    const result = await authService.refreshToken(body);
    return this.sendSuccess(result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
  }
}