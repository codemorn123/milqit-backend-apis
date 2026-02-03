import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ISubscription } from '../types/subscription.types';
import { createSchemaOptions } from '../utils/schema.helpers';

type SubscriptionDocument = ISubscription & Document;
const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: { type: String, required: true },
    productType: { type: String, enum: ['milk', 'vegetable'], required: true },
    plan: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    quantity: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    productName: { type: String, required: true },
    subscriptionType: { type: String, required: true },
    planType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  },
  createSchemaOptions()
);

// Apply pagination plugin
SubscriptionSchema.plugin(mongoosePaginate);

export default model<SubscriptionDocument, PaginateModel<SubscriptionDocument>>('Subscription', SubscriptionSchema);