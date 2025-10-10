import { validateSchemaMiddleware } from'./../../../middleware/common-validate';
import { INotification } from './../../../models/cms/notification.model';
import notificationService from './../../../services/admin/cms/notification.service';
import { IFilter, IPaginated, PaginatedResponse } from './../../../types/common.types';
import {    SuccessResponse as SuccessResponseTags } from './../../../utils/SuccessResponse';
import { createNotificationSchema, filterQuerySchema, idParamSchema } from './../../../validations/notification.validator';
import {
    Route,
    Tags,
    Controller,
    Post,
    Get,
    Delete,
    Middlewares,
    SuccessResponse,
    Path,
    Body,
    Queries,
    Response,
  } from 'tsoa';
  import { success, SuccessResponse as SuccessDataResponse } from  './../../../utils/SuccessResponse';  
//   import { validateSchemaMiddleware } from './../../middleware/common-validate';
//   import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
//   import { INotification } from './../../types/notification.types';
//   import { IFilter, IPaginated } from './../../types/common.types';
//   import notificationService from './../../services/admin/notification.service';
//   import { createNotificationSchema, filterQuerySchema, idParamSchema } from './../../validations/notification.validator';

  
  @Route("admin/cms/notifications")
  @Tags("Admin Notifications")
  export class AdminNotificationController extends Controller {
  
    @Post("/")
    @SuccessResponse(201, "Created")
    @Response(400, "Validation Failed")
    @Middlewares(validateSchemaMiddleware(createNotificationSchema))
    public async createNotification(
      @Body() requestBody: { title: string; message: string; targetAudience: 'all' | 'customers' | 'vendors'; scheduledAt?: Date; imageUrl?: string; }
    ): Promise<SuccessResponseTags<INotification>> {
      const result = await notificationService.create(requestBody);
      return success(result, 'Notification created and scheduled successfully');
    }
  
    @Get("/")
    @SuccessResponse(200, "Success")
    @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
    // public async getAllNotifications(@Queries() queryParams: IFilter): Promise<{ data: INotification[]; pagination: IPaginated }> {
    //   return notificationService.getAll(queryParams);
    // }

    public async getAllNotifications(
        @Queries() queryParams: IFilter
      ): Promise<SuccessDataResponse<PaginatedResponse<INotification>>> {
          const result = await notificationService.getAllForCustomer(queryParams);
        return success(result);
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