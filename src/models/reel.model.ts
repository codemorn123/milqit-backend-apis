import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';

export interface IReel {
    title: string;
    description?: string;
    videoUrl: string;
    videoKey?: string; // For S3/storage deletion
    thumbnailUrl?: string;
    thumbnailKey?: string;
    likes: number;
    likedBy: mongoose.Types.ObjectId[]; // Array of user IDs who liked the reel
    isActive: boolean;
}

export interface IReelDocument extends IReel, IBase { }

export interface ReelModel extends PaginateModel<IReelDocument> { }

const ReelSchema = new Schema<IReelDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        videoKey: {
            type: String,
        },
        thumbnailUrl: {
            type: String,
        },
        thumbnailKey: {
            type: String,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                delete ret.__v;
            },
        },
    }
);

ReelSchema.plugin(mongoosePaginate);

export const ReelModel = mongoose.model<IReelDocument, ReelModel>('Reel', ReelSchema);
