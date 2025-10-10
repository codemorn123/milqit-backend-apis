
import NotificationModel, { INotification } from "./../../../models/cms/notification.model";
import APIError from "./../../../error/api-error";
import { IFilter } from "./../../../types/common.types";
import { logger } from "./../../../config/logger";
import { PaginatedResponse } from '../../../types/common.types';
import { SuccessResponse } from "@/utils/SuccessResponse";

class NotificationService {
  /**
   * Creates a new notification and schedules it for sending.
   */
  public async create(data: Partial<INotification>): Promise<INotification> {
    const newNotification = await NotificationModel.create(data);

    if (newNotification.scheduledAt) {
      // ** SCHEDULING LOGIC **
      // This is where you would integrate a job scheduler like BullMQ or Agenda.js
      // For now, we'll log a message.
      logger.info(`Notification ${newNotification._id} scheduled for ${newNotification.scheduledAt}`);
      // Example: await scheduleNotificationJob(newNotification._id, newNotification.scheduledAt);
    } else {
      // ** IMMEDIATE SEND LOGIC **
      // This is where you would call the Firebase Cloud Messaging (FCM) service
      logger.info(`Sending immediate notification ${newNotification._id}`);
      // Example: await sendFcmNotification(newNotification);
      // For demo purposes, we'll mark it as 'sent' immediately.
      newNotification.status = 'sent';
      await newNotification.save();
    }

    return newNotification;
  }

  /**
   * Retrieves all notifications with pagination and filtering (For Admin).
   */
  public async getAll(queryParams: IFilter):  Promise<PaginatedResponse<INotification>> {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const search = queryParams.search;
    const status = queryParams.isActive;

    const filter: any = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ title: searchRegex }, { message: searchRegex }];
    }
    if (status) {
      filter.status = status;
    }

    const totalRecords = await NotificationModel.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<INotification[]>()
      .exec();

    return {
        docs: data,
        totalDocs: totalRecords,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        
    }
  }
  
  /**
   * Retrieves sent notifications for customers.
   */
//   public async getAllForCustomer(queryParams: IFilter): Promise<PaginatedResponse<>> {
//     const page = Number(queryParams.page) || 1;
//     const limit = Number(queryParams.limit) || 10;

//     const filter: any = { status: 'sent' }; // Customers only see sent notifications

//     const totalRecords = await NotificationModel.countDocuments(filter);
//     const totalPages = Math.ceil(totalRecords / limit);

//     const data = await NotificationModel.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean<INotification[]>()
//       .exec();

//     return { data, pagination: { page, limit, totalRecord: totalRecords, totalPage: totalPages } };
//   }


public async getAllForCustomer(queryParams: IFilter): Promise<PaginatedResponse<INotification>> {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
  
    const filter: any = { status: 'sent' };
  
    const totalDocs = await NotificationModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
  
    const docs = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<INotification[]>()
      .exec();
  
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
  
    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    };
  }
  /**
   * Deletes a notification.
   */
  public async delete(id: string): Promise<{ message: string }> {
    const notification = await NotificationModel.findById(id);
    if (!notification) {
      throw new APIError('Notification not found.', 404);
    }

    if (notification.status === 'pending' && notification.scheduledAt) {
      // ** CANCEL SCHEDULED JOB LOGIC **
      // If you have a scheduled job, you must cancel it here.
      logger.warn(`Cancelling scheduled job for notification ${id}`);
      // Example: await cancelNotificationJob(id);
    }

    await NotificationModel.findByIdAndDelete(id);
    return { message: 'Notification deleted successfully.' };
  }
}

export default new NotificationService();