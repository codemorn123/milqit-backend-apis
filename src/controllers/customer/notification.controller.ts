import {
    Route,
    Tags,
    Controller,
    Get,
    Middlewares,
    SuccessResponse,
    Queries,
  } from 'tsoa';
  import { validateSchemaMiddleware } from './../../middleware/common-validate';
  import { INotification } from './../../models/cms/notification.model';
  import { IFilter, IPaginated, PaginatedResponse } from './../../types/common.types';
  import notificationService from './../../services/admin/cms/notification.service';
  import { filterQuerySchema } from './../../validations/notification.validator';

import { success, SuccessResponse as SuccessDataResponse } from  './../../utils/SuccessResponse';
  
  @Route("customer/notifications")
  @Tags("Customer Notifications")
  export class CustomerNotificationController extends Controller {
  
    @Get("/")
    // @SuccessResponse(200, "Success")
    @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
    public async getNotifications(
      @Queries() queryParams: IFilter
    ): Promise<SuccessDataResponse<PaginatedResponse<INotification>>> {
        const result = await notificationService.getAllForCustomer(queryParams);
      return success(result);
    }
  
  }

 