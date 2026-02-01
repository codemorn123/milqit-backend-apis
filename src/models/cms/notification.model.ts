import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// import { INotification } from './../types/notification.types';


export interface INotification {
  title: string;
  message: string;
  targetAudience: 'all' | 'customers' | 'vendors';
  scheduledAt?: Date | null;
  status: 'pending' | 'sent' | 'failed';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type INotificationDocument = INotification & Document;



const notificationSchema: Schema = new Schema<INotificationDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: String,
    enum: ['all', 'customers', 'vendors'], // Example audiences
    required: true,
  },
  scheduledAt: {
    type: Date,
    default: null, // Null means send immediately
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  imageUrl: {
    type: String,
    optional: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Apply the pagination plugin
notificationSchema.plugin(mongoosePaginate);

const NotificationModel = mongoose.model<INotificationDocument, PaginateModel<INotificationDocument>>('Notification', notificationSchema);

export default NotificationModel;