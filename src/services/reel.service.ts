import mongoose from 'mongoose';
import APIError from '../error/api-error';
import { ReelModel, IReelDocument } from '../models/reel.model';
import { IFilter, PaginatedResponse } from '../types/common.types';
import customFileService from './custom-file.service';
import { IReel, IReelResponse } from '../types/reel.types';
import { CommentModel, ICommentDocument } from '../models/comment.model';
import { BaseService } from './base.service';
import { QueryBuilder } from '../utils/query-builder';

const REELS_PATH = 'reels/videos';

class ReelService extends BaseService<IReelDocument> {
    constructor() {
        super(ReelModel as any, ['title']);
    }

    public async create(
        data: Partial<IReelDocument>,
        file?: Express.Multer.File
    ): Promise<IReelDocument> {
        if (!file) {
            throw new APIError('Video file is required.', 400);
        }

        // Basic validation for video type (can be enhanced)
        if (!file.mimetype.startsWith('video/')) {
            throw new APIError('Uploaded file must be a video.', 400);
        }

        const { url, key } = await customFileService.saveFile(file, REELS_PATH);

        const payload = {
            ...data,
            videoUrl: url,
            videoKey: key,
        };

        return super.create(payload);
    }

    public async getReels(
        options: IFilter,
        userId?: string
    ): Promise<PaginatedResponse<IReelResponse>> {
        const builder = new QueryBuilder(ReelModel, options);
        builder.filter(['title']);

        // Ensure only active reels are fetched by default unless specified otherwise? 
        // Original logic: const query: mongoose.FilterQuery<any> = { isActive: true };
        // QueryBuilder handles isActive if passed in options. 
        // But if we want to enforce isActive=true for this method (likely for public feed), we should set it.
        // Assuming this method is for public/user feed.
        builder.query.isActive = true;

        const result = await builder.exec();

        const resultDocs = result.docs.map((doc: any) => {
            const isLiked = userId
                ? doc.likedBy?.some((id: any) => id.toString() === userId)
                : false;
            return this.mapToResponse(doc, isLiked);
        });

        return {
            ...result,
            docs: resultDocs
        };
    }

    public async delete(id: string): Promise<{ message: string; status: number }> {
        const reel = await ReelModel.findById(id);
        if (!reel) {
            throw new APIError('Reel not found.', 404);
        }

        if (reel.videoKey) {
            await customFileService.deleteFile(reel.videoKey, REELS_PATH);
        }

        return super.delete(id);
    }

    public async toggleLike(reelId: string, userId: string): Promise<{ message: string; liked: boolean; likes: number }> {
        const reel = await ReelModel.findById(reelId);
        if (!reel) {
            throw new APIError('Reel not found.', 404);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const index = reel.likedBy.findIndex((id) => id.toString() === userId);

        let liked = false;
        if (index === -1) {
            // Like
            reel.likedBy.push(userObjectId);
            reel.likes += 1;
            liked = true;
        } else {
            // Unlike
            reel.likedBy.splice(index, 1);
            reel.likes = Math.max(0, reel.likes - 1);
            liked = false;
        }

        await reel.save();

        return {
            message: liked ? 'Reel liked.' : 'Reel unliked.',
            liked,
            likes: reel.likes,
        };
    }

    private mapToResponse(doc: any, isLiked?: boolean): IReelResponse {
        return {
            _id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            videoUrl: doc.videoUrl,
            thumbnailUrl: doc.thumbnailUrl,
            likes: doc.likes,
            isActive: doc.isActive,
            createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
            updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
            isLiked
        };
    }

    // --- Comments ---

    public async addComment(reelId: string, userId: string, content: string): Promise<ICommentDocument> {
        const reel = await ReelModel.findById(reelId);
        if (!reel) {
            throw new APIError('Reel not found.', 404);
        }

        const comment = await CommentModel.create({
            reelId,
            userId,
            content,
        });

        // Populate user details for immediate return
        await comment.populate('userId', 'firstName lastName profileImage');

        return comment;
    }

    public async getComments(reelId: string, options: IFilter): Promise<PaginatedResponse<ICommentDocument>> {
        const builder = new QueryBuilder<ICommentDocument>(CommentModel, options);
        builder.query.reelId = reelId;
        builder.query.isActive = true;

        const result = await builder.exec(['userId']);

        return result;
    }

    public async update(
        id: string,
        data: Partial<IReelDocument>,
        file?: Express.Multer.File
    ): Promise<IReelDocument> {
        const reel = await ReelModel.findById(id);
        if (!reel) {
            throw new APIError('Reel not found.', 404);
        }

        const payload: any = { ...data };

        if (file) {
            // Basic validation for video type
            if (!file.mimetype.startsWith('video/')) {
                throw new APIError('Uploaded file must be a video.', 400);
            }

            // Delete old video
            if (reel.videoKey) {
                await customFileService.deleteFile(reel.videoKey, REELS_PATH);
            }

            // Save new video
            const { url, key } = await customFileService.saveFile(file, REELS_PATH);
            payload.videoUrl = url;
            payload.videoKey = key;
        }

        return super.update(id, payload);
    }
}

export const reelService = new ReelService();
