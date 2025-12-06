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
  Request
} from 'tsoa';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { INotification } from './../../models/cms/notification.model';
import { IFilter, IPaginated, PaginatedResponse } from './../../types/common.types';
import notificationService from './../../services/admin/cms/notification.service';
import { filterQuerySchema } from './../../validations/notification.validator';
import { fcmService } from './../../services/fcm.service';
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import Joi from 'joi';

// Validation schema for device registration
const deviceRegistrationSchema = Joi.object({
  deviceToken: Joi.string().required(),
  platform: Joi.string().valid('android', 'ios', 'web').required()
});

interface DeviceRegistrationRequest {
  deviceToken: string;
  platform: 'android' | 'ios' | 'web';
}

interface DeviceRemovalRequest {
  deviceToken: string;
}

@Route("customer/notifications")
@Tags("Customer Notifications")
export class CustomerNotificationController extends Controller {

  @Get("/")
  @Security('jwt')
  @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
  public async getNotifications(
    @Queries() queryParams: IFilter
  ): Promise<SuccessDataResponse<PaginatedResponse<INotification>>> {
    const result = await notificationService.getAllForCustomer(queryParams);
    return success(result);
  }

  /**
   * Register a device for push notifications
   */
  @Post("/register-device")
  @Security('jwt')
  @Middlewares(validateSchemaMiddleware(deviceRegistrationSchema))
  public async registerDevice(
    @Body() body: DeviceRegistrationRequest,
    @Request() req: any
  ): Promise<SuccessDataResponse<{ success: boolean }>> {
    const userId = req.user.id;
    await fcmService.registerDevice(userId, body.deviceToken, body.platform);
    return success({ success: true }, 'Device registered successfully');
  }

  /**
   * Remove a device token (logout)
   */
  @Post("/remove-device")
  @Security('jwt')
  public async removeDevice(
    @Body() body: DeviceRemovalRequest
  ): Promise<SuccessDataResponse<{ success: boolean }>> {
    await fcmService.removeDevice(body.deviceToken);
    return success({ success: true }, 'Device removed successfully');
  }

}