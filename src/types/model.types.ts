import { Document, Types } from 'mongoose';

/**
 * Base model interface with standard Mongoose document fields
 */
export interface IBaseDocument extends Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Standard schema options for consistent configuration
 */
export const DEFAULT_SCHEMA_OPTIONS = {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: (_: any, ret: any) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
    },
} as const;

/**
 * Common platform types used across multiple models
 */
export type Platform = 'ios' | 'android' | 'web' | 'other';

/**
 * Common status types
 */
export type ActiveStatus = 'active' | 'inactive';
export type BooleanStatus = boolean;

/**
 * Common device information interface
 */
export interface IDeviceInfo {
    platform: Platform;
    version: string;
    deviceId: string;
}

/**
 * Common location/coordinates interface
 */
export interface ILocation {
    latitude: number;
    longitude: number;
    address?: string;
}

/**
 * Common GeoJSON Point interface for MongoDB geospatial queries
 */
export interface IGeoPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Common image/media interface
 */
export interface IImage {
    url: string;
    key: string;
    alt?: string;
}

/**
 * Common address interface
 */
export interface IAddress {
    id?: string;
    label?: string;
    fullName?: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    addressType?: 'home' | 'work' | 'other';
    isDefault?: boolean;
}

/**
 * Common audit fields interface
 */
export interface IAuditFields {
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    deletedBy?: Types.ObjectId;
    deletedAt?: Date;
    isDeleted?: boolean;
}

/**
 * Common pagination metadata
 */
export interface IPaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Generic paginated response
 */
export interface IPaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

/**
 * Common timestamp fields for schemas that don't use timestamps: true
 */
export interface ITimestamps {
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Soft delete fields
 */
export interface ISoftDelete {
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
}
