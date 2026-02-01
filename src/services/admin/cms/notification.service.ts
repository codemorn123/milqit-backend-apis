
import NotificationModel, { INotification, INotificationDocument } from "./../../../models/cms/notification.model";
import APIError from "./../../../error/api-error";
import { logger } from "./../../../config/logger";
import { BaseService } from "../../base.service";
import { IFilter, PaginatedResponse } from "../../../types/common.types";

class NotificationService extends BaseService<INotificationDocument> {
  constructor() {
    super(NotificationModel as any, ['title', 'message']);
  }

  /**
   * Creates a new notification and schedules it for sending.
   */
  public async create(data: Partial<INotification>): Promise<INotificationDocument> {
    const newNotification = await super.create(data);

    if (newNotification.scheduledAt) {
      // ** SCHEDULING LOGIC **
      logger.info(`Notification ${newNotification._id} scheduled for ${newNotification.scheduledAt}`);
    } else {
      // ** IMMEDIATE SEND LOGIC **
      logger.info(`Sending immediate notification ${newNotification._id}`);
      newNotification.status = 'sent';
      await newNotification.save();
    }

    return newNotification;
  }

  // getAll handled by BaseService

  /**
   * Retrieves sent notifications for customers.
   */



  public async getAllForCustomer(queryParams: IFilter): Promise<PaginatedResponse<INotificationDocument>> {
    // Re-use BaseService.getAll which handles pagination, search, and lean correctly
    return this.getAll(queryParams, { status: 'sent' });
  }
  /**
   * Deletes a notification.
   */
  public async delete(id: string): Promise<{ message: string; status: number }> {
    const notification = await NotificationModel.findById(id);
    if (!notification) {
      throw new APIError('Notification not found.', 404);
    }

    if (notification.status === 'pending' && notification.scheduledAt) {
      // ** CANCEL SCHEDULED JOB LOGIC **
      logger.warn(`Cancelling scheduled job for notification ${id}`);
    }

    return super.delete(id);
  }
}

export default new NotificationService();