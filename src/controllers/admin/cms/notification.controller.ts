import { validateSchemaMiddleware } from './../../../middleware/common-validate';
import { INotification } from './../../../models/cms/notification.model';
import notificationService from './../../../services/admin/cms/notification.service';
import { IFilter, IPaginated, PaginatedResponse } from './../../../types/common.types';
import { SuccessResponse as SuccessResponseTags } from './../../../utils/SuccessResponse';
import { createNotificationSchema, filterQuerySchema, idParamSchema, updateNotificationSchema } from './../../../validations/notification.validator';
import {
  Route,
  Tags,
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Middlewares,
  SuccessResponse,
  Path,
  Body,
  Queries,
  Response,
} from 'tsoa';
import { success, SuccessResponse as SuccessDataResponse } from './../../../utils/SuccessResponse';



@Route("admin/cms/notifications")
@Tags("Admin Notifications")
export class AdminNotificationController extends Controller {

  @Post("/")
  @SuccessResponse(201, "Created")
  @Response(400, "Validation Failed")
  @Middlewares(validateSchemaMiddleware(createNotificationSchema, "body"))
  public async createNotification(
    @Body() requestBody: { title: string; message: string; targetAudience: 'all' | 'customers' | 'vendors'; scheduledAt?: Date; imageUrl?: string; }
  ): Promise<SuccessResponseTags<INotification>> {
    const result = await notificationService.create(requestBody);
    return success(result, 'Notification created and scheduled successfully');
  }

  @Get("/")
  @SuccessResponse(200, "Success")
  @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
  public async getAllNotifications(
    @Queries() queryParams: IFilter
  ): Promise<SuccessDataResponse<PaginatedResponse<INotification>>> {
    const result = await notificationService.getAll(queryParams);
    return success(result);
  }

  @Get("/{id}")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async getNotificationById(@Path() id: string): Promise<SuccessResponseTags<INotification>> {
    const result = await notificationService.getOne(id);
    return success(result);
  }

  @Put("/{id}")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Middlewares([
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(updateNotificationSchema, "body")
  ])
  public async updateNotification(
    @Path() id: string,
    @Body() requestBody: Partial<INotification>
  ): Promise<SuccessResponseTags<INotification>> {
    const result = await notificationService.update(id, requestBody);
    return success(result, 'Notification updated successfully');
  }


  @Delete("/{id}")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async deleteNotification(@Path() id: string): Promise<SuccessResponseTags<{ message: string }>> {
    const result = await notificationService.delete(id);
    return success(result);
  }
}