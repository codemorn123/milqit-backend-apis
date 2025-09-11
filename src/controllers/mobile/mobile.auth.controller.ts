import { Body, Controller, Post, Route, Tags, Response, Middlewares } from 'tsoa';
import { validate } from '../../middleware/validation.middleware';
import { StatusCodes } from 'http-status-codes/build/cjs';
import UserService from '../../services/user.service';
import { ISendOtpInput, IVerifyOtpInput, IAuthResponse } from '../../types/auth.types';
import { sendOtpSchema, verifyOtpSchema } from './../../validations/auth.validation';
import { ErrorResponse } from './../../types/common.types';
import { authService } from './../../services/auth.service';
import { ClientErrorInterface } from './../../error/clientErrorHelper';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from './../../error/exampleErrors';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
@Route('mobile/auth')
@Tags('Mobile Authentication')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
export class MobileAuthController extends Controller {
  @Post('send-otp')
  @Middlewares(validate(sendOtpSchema))
  public async sendOtp(@Body() body: ISendOtpInput): Promise<SuccessResponse<{ isNewUser: boolean, otp:string }>> {
      const otpResult = await authService.sendLoginOtp(body.phone);
      const isNewUser = !(await UserService.findUserByPhone(body.phone));
      	return success({ isNewUser, otp: otpResult.otp }, 'OTP sent successfully');
  }

  @Post('verify-otp')  
  @Middlewares(validate(verifyOtpSchema))
  public async verifyOtp(@Body() body: IVerifyOtpInput): Promise< SuccessResponse<IAuthResponse>> {
    const result = await authService.verifyOtpAndAuthenticate(body);
    return success(result, 'Authentication successful');
  }

  @Post('resend-otp')
  @Middlewares(validate(sendOtpSchema))
  public async resendOtp(@Body() body: ISendOtpInput): Promise<SuccessResponse<{  otp:string }>> {
     const otpResult = await authService.sendLoginOtp(body.phone);
    	return success({ otp: otpResult.otp }, 'OTP sent successfully');
  }
}