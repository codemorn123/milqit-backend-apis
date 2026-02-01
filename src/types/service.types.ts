import { Document } from 'mongoose';
import { PaginationOptions } from './pagination.types';

/**
 * Shared service response types for consistent API responses
 */

export interface DeleteResponse {
    message: string;
    status: number;
}

export interface ToggleLikeResponse {
    message: string;
    liked: boolean;
    likes: number;
}

export interface BulkOperationResponse {
    success: boolean;
    modifiedCount: number;
    message: string;
}

export interface StatsResponse {
    [key: string]: number | string | object;
}

/**
 * Comment types for reusable comment functionality
 */
export interface IComment extends Document {
    _id: string;
    reelId?: string;
    postId?: string;
    userId: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICommentResponse {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
    };
    content: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Payment-related types
 */
export interface PaymentOrderResponse {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
}

export interface PaymentVerificationResponse {
    success: boolean;
    verified: boolean;
    orderId?: string;
    paymentId?: string;
}

export interface PaymentHistoryItem {
    _id: string;
    orderId: string;
    amount: number;
    status: string;
    method: string;
    createdAt: Date;
}

/**
 * Generic model with pagination support
 * Designed to work with mongoose-paginate-v2
 */
export interface IPaginateModel<T> {
    paginate(
        query?: Record<string, any>,
        options?: PaginationOptions
    ): Promise<{
        docs: any[];
        totalDocs: number;
        limit: number;
        page?: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        nextPage?: number | null;
        prevPage?: number | null;
        pagingCounter?: number;
    }>;
}
