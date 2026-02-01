import {
  Route,
  Tags,
  Controller,
  Get,
  Post,
  Body,
  Middlewares,
  SuccessResponse,
  Queries,
  Security,
  Request,
  Response
} from 'tsoa';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { INotification } from './../../models/cms/notification.model';
import { IFilter, PaginatedResponse } from './../../types/common.types';
import notificationService from './../../services/admin/cms/notification.service';
import { filterQuerySchema } from './../../validations/notification.validator';
import { fcmService } from './../../services/fcm.service';
import { SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

// Validation schema for device registration
const deviceRegistrationSchema = Joi.object({
  deviceToken: Joi.string().required(),
  platform: Joi.string().valid('android', 'ios', 'web').required()
});

const deviceRemovalSchema = Joi.object({
  deviceToken: Joi.string().required()
});

interface DeviceRegistrationRequest {
  deviceToken: string;
  platform: 'android' | 'ios' | 'web';
}

interface DeviceRemovalRequest {
  deviceToken: string;
}

import { BaseController } from '../base.controller';

@Route("customer/notifications")
@Tags("Customer Notifications")
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class CustomerNotificationController extends BaseController {

  @Get("/")
  @Security('jwt')
  @SuccessResponse(200, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
  public async getNotifications(
    @Queries() queryParams: IFilter
  ): Promise<SuccessDataResponse<PaginatedResponse<INotification>>> {
    const result = await notificationService.getAllForCustomer(queryParams);
    return this.sendPaginated(result);
  }

  /**
   * Register a device for push notifications
   */
  @Post("/register-device")
  @Security('jwt')
  @SuccessResponse(200, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Middlewares(validateSchemaMiddleware(deviceRegistrationSchema, "body"))
  public async registerDevice(
    @Body() body: DeviceRegistrationRequest,
    @Request() req: any
  ): Promise<SuccessDataResponse<{ success: boolean }>> {
    const userId = req.user.userId;
    await fcmService.registerDevice(userId, body.deviceToken, body.platform);
    return this.sendSuccess({ success: true }, 'Device registered successfully');
  }

  /**
   * Remove a device token (logout)
   */
  @Post("/remove-device")
  @Security('jwt')
  @SuccessResponse(200, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Middlewares(validateSchemaMiddleware(deviceRemovalSchema, "body"))
  public async removeDevice(
    @Body() body: DeviceRemovalRequest
  ): Promise<SuccessDataResponse<{ success: boolean }>> {
    await fcmService.removeDevice(body.deviceToken);
    return this.sendSuccess({ success: true }, 'Device removed successfully');
  }

}