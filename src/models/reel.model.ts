import mongoose, { Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBaseDocument } from '../types/model.types';
import {
    createSchemaOptions,
    StringField,
    NumberField,
    BooleanField,
    ObjectIdField,
    URLField,
} from '../utils/schema.helpers';

/**
 * Reel Interface
 */
export interface IReel {
    title: string;
    description?: string;
    videoUrl: string;
    videoKey?: string;
    thumbnailUrl?: string;
    thumbnailKey?: string;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    isActive: boolean;
    userId?: mongoose.Types.ObjectId; // Added for better querying
}

/**
 * Reel Document Interface
 */
export interface IReelDocument extends IReel, IBaseDocument {
    toggleLike(userId: string): Promise<{ liked: boolean; likesCount: number }>;
}

/**
 * Reel Model Interface with Static Methods
 */
export interface IReelModel extends PaginateModel<IReelDocument> {
    findActiveReels(limit?: number): Promise<IReelDocument[]>;
    findPopularReels(limit?: number, minLikes?: number): Promise<IReelDocument[]>;
    findByUser(userId: string): Promise<IReelDocument[]>;
}

/**
 * Reel Schema Definition
 */
const ReelSchema = new Schema<IReelDocument>(
    {
        title: StringField.required(true, 200),
        description: StringField.optional(true, 1000),
        videoUrl: URLField.required(),
        videoKey: StringField.optional(),
        thumbnailUrl: URLField.optional(),
        thumbnailKey: StringField.optional(),
        likes: NumberField.positiveOptional(),
        likedBy: [ObjectIdField.optional('User')],
        isActive: BooleanField.optional(true),
        userId: ObjectIdField.optional('User', true),
    },
    createSchemaOptions()
);

/**
 * Virtual Fields
 */
ReelSchema.virtual('likesCount').get(function (this: IReelDocument) {
    return this.likedBy?.length || 0;
});

ReelSchema.virtual('hasLikes').get(function (this: IReelDocument) {
    return this.likes > 0 || (this.likedBy?.length || 0) > 0;
});

/**
 * Indexes for Performance
 */
ReelSchema.index({ isActive: 1, createdAt: -1 });
ReelSchema.index({ userId: 1, isActive: 1 });
ReelSchema.index({ likes: -1, isActive: 1 });
ReelSchema.index({ likedBy: 1 });

/**
 * Instance Methods
 */
ReelSchema.methods.toggleLike = async function (
    this: IReelDocument,
    userId: string
): Promise<{ liked: boolean; likesCount: number }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const index = this.likedBy.findIndex((id) => id.toString() === userId);

    if (index > -1) {
        // Unlike
        this.likedBy.splice(index, 1);
        this.likes = Math.max(0, this.likes - 1);
        await this.save();
        return { liked: false, likesCount: this.likes };
    } else {
        // Like
        this.likedBy.push(userObjectId);
        this.likes += 1;
        await this.save();
        return { liked: true, likesCount: this.likes };
    }
};

/**
 * Static Methods
 */
ReelSchema.statics.findActiveReels = function (limit = 20): Promise<IReelDocument[]> {
    return this.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name phone');
};

ReelSchema.statics.findPopularReels = function (
    limit = 10,
    minLikes = 10
): Promise<IReelDocument[]> {
    return this.find({
        isActive: true,
        likes: { $gte: minLikes },
    })
        .sort({ likes: -1, createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name phone');
};

ReelSchema.statics.findByUser = function (userId: string): Promise<IReelDocument[]> {
    return this.find({
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true,
    }).sort({ createdAt: -1 });
};

/**
 * Apply Pagination Plugin
 */
ReelSchema.plugin(mongoosePaginate);

/**
 * Export Reel Model
 */
export const ReelModelClass = mongoose.model<IReelDocument, IReelModel>('Reel', ReelSchema);

// Backwards compatibility - use ReelModelClass in new code
export const ReelModel = ReelModelClass;

export default ReelModelClass;

