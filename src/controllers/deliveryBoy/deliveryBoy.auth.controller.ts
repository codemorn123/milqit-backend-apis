import { Body, Controller, Post, Route, Tags, Response, Middlewares, Get, Security, Request, Put } from 'tsoa';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { deliveryBoyService } from '../../services/deliveryBoy.service';
import {
    IDeliveryBoySendOtpInput,
    IDeliveryBoyVerifyOtpInput,
    IDeliveryBoyAuthResponse,
    IUpdateDeliveryBoyProfileInput,
    IUpdateDeliveryBoyLocationInput,
    IUpdateDeliveryBoyAvailabilityInput
} from '../../types/deliveryBoy.types';
import {
    deliveryBoySendOtpSchema,
    deliveryBoyVerifyOtpSchema,
    deliveryBoyResendOtpSchema,
    updateDeliveryBoyProfileSchema,
    updateDeliveryBoyLocationSchema,
    updateDeliveryBoyAvailabilitySchema,
    deliveryBoyRefreshTokenSchema
} from '../../validations/deliveryBoy.validation';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { IDeliveryBoy } from '../../models/DeliveryBoyModel';

import { BaseController } from '../base.controller';

/**
 * Controller for delivery boy authentication and profile management
 */
@Route('delivery-boy/auth')
@Tags('Delivery Boy Authentication')
export class DeliveryBoyAuthController extends BaseController {
    /**
     * Send OTP to delivery boy's phone number for login/registration
     * @summary Send OTP for delivery boy authentication
     * @param body Phone number for OTP
     * @returns OTP sent successfully (OTP included in response for development)
     */
    @Post('send-otp')
    @Middlewares([validateSchemaMiddleware(deliveryBoySendOtpSchema, "body")])
    public async sendOtp(
        @Body() body: IDeliveryBoySendOtpInput
    ): Promise<SuccessResponse<{ isExistingDeliveryBoy: boolean, otp: string }>> {
        const otpResult = await deliveryBoyService.sendLoginOtp(body.phone);
        const existingDeliveryBoy = await deliveryBoyService.findDeliveryBoyByPhone(body.phone);

        return success(
            {
                isExistingDeliveryBoy: !!existingDeliveryBoy,
                otp: otpResult.otp
            },
            'OTP sent successfully'
        );
    }

    /**
     * Verify OTP and login or register delivery boy
     * @summary Verify OTP and authenticate delivery boy
     * @param body OTP verification data
     * @returns Authentication tokens and delivery boy profile
     */
    @Post('verify-otp')
    @Middlewares([validateSchemaMiddleware(deliveryBoyVerifyOtpSchema, "body")])
    public async verifyOtp(
        @Body() body: IDeliveryBoyVerifyOtpInput
    ): Promise<SuccessResponse<IDeliveryBoyAuthResponse>> {
        const result = await deliveryBoyService.loginOrRegister(body);

        const message = result.isNewDeliveryBoy
            ? 'Registration successful. Your account is pending admin approval.'
            : 'Login successful';

        return success(result, message);
    }

    /**
     * Resend OTP to delivery boy's phone number
     * @summary Resend OTP for delivery boy authentication
     * @param body Phone number for OTP
     * @returns OTP sent successfully
     */
    @Post('resend-otp')
    @Middlewares([validateSchemaMiddleware(deliveryBoyResendOtpSchema, "body")])
    public async resendOtp(
        @Body() body: IDeliveryBoySendOtpInput
    ): Promise<SuccessResponse<{ otp: string }>> {
        const otpResult = await deliveryBoyService.sendLoginOtp(body.phone);
        return success({ otp: otpResult.otp }, 'OTP sent successfully');
    }

    /**
     * Refresh authentication tokens for delivery boy
     * @summary Refresh tokens
     * @param body Refresh token
     * @returns New authentication tokens
     */
    @Post('refresh-token')
    @Middlewares([validateSchemaMiddleware(deliveryBoyRefreshTokenSchema, "body")])
    public async refreshToken(
        @Body() body: { refreshToken: string }
    ): Promise<SuccessResponse<{ tokens: any }>> {
        const result = await deliveryBoyService.refreshToken(body);
        return success(result, 'Tokens refreshed successfully');
    }

    /**
     * Get current delivery boy profile
     * @summary Get authenticated delivery boy profile
     * @param request Express request with authenticated user
     * @returns Delivery boy profile
     */
    @Get('profile')
    @Security('jwt', ['delivery_boy'])
    public async getProfile(
        @Request() request: any
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoyId = request.user.userId;
        const deliveryBoy = await deliveryBoyService.findDeliveryBoyById(deliveryBoyId);

        if (!deliveryBoy) {
            this.setStatus(StatusCodes.NOT_FOUND);
            throw new Error('Delivery boy not found');
        }

        return success(deliveryBoy, 'Profile retrieved successfully');
    }

    /**
     * Update delivery boy profile
     * @summary Update delivery boy profile
     * @param request Express request with authenticated user
     * @param body Profile update data
     * @returns Updated delivery boy profile
     */
    @Put('profile')
    @Security('jwt', ['delivery_boy'])
    @Middlewares([validateSchemaMiddleware(updateDeliveryBoyProfileSchema, "body")])
    public async updateProfile(
        @Request() request: any,
        @Body() body: IUpdateDeliveryBoyProfileInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoyId = request.user.userId;
        const updatedDeliveryBoy = await deliveryBoyService.updateProfile(deliveryBoyId, body);

        return success(updatedDeliveryBoy, 'Profile updated successfully');
    }

    /**
     * Update delivery boy location
     * @summary Update current location
     * @param request Express request with authenticated user
     * @param body Location coordinates
     * @returns Updated delivery boy profile
     */
    @Put('location')
    @Security('jwt', ['delivery_boy'])
    @Middlewares([validateSchemaMiddleware(updateDeliveryBoyLocationSchema, "body")])
    public async updateLocation(
        @Request() request: any,
        @Body() body: IUpdateDeliveryBoyLocationInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoyId = request.user.userId;
        const updatedDeliveryBoy = await deliveryBoyService.updateLocation(deliveryBoyId, body);

        return success(updatedDeliveryBoy, 'Location updated successfully');
    }

    /**
     * Update delivery boy availability status
     * @summary Update availability status
     * @param request Express request with authenticated user
     * @param body Availability status
     * @returns Updated delivery boy profile
     */
    @Put('availability')
    @Security('jwt', ['delivery_boy'])
    @Middlewares([validateSchemaMiddleware(updateDeliveryBoyAvailabilitySchema, "body")])
    public async updateAvailability(
        @Request() request: any,
        @Body() body: IUpdateDeliveryBoyAvailabilityInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoyId = request.user.userId;
        const updatedDeliveryBoy = await deliveryBoyService.updateAvailability(deliveryBoyId, body);

        const message = body.isAvailable
            ? 'You are now available for deliveries'
            : 'You are now unavailable for deliveries';

        return success(updatedDeliveryBoy, message);
    }
}
