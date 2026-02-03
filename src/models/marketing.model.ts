import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { createSchemaOptions } from '../utils/schema.helpers';

export interface IMarketingCampaign {
    title: string;
    message: string;
    imageUrl?: string;
    context?: string; // e.g., "Grocery", "Ecommerce"
    scheduleTime: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    targetAudience?: string; // e.g., "all", "active_users"
    failureReason?: string;
}

export interface MarketingCampaignDocument extends IMarketingCampaign, Document {
    createdAt: Date;
    updatedAt: Date;
}

const MarketingCampaignSchema = new Schema<MarketingCampaignDocument>(
    {
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        imageUrl: { type: String },
        context: { type: String },
        scheduleTime: { type: Date, required: true, index: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending',
            index: true,
        },
        targetAudience: { type: String, default: 'all' },
        failureReason: { type: String },
    },
    createSchemaOptions()
);

MarketingCampaignSchema.plugin(mongoosePaginate);

export const MarketingCampaignModel = mongoose.model<
    MarketingCampaignDocument,
    PaginateModel<MarketingCampaignDocument>
>('MarketingCampaign', MarketingCampaignSchema);
