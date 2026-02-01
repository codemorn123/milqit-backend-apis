import { Document, Types } from 'mongoose';
import { IBaseDocument } from './model.types';

export interface ICategory {
    name: string;
    description?: string;
    slug: string;
    isActive: boolean; // Keeping for backward compatibility
    status?: string; // New field based on user request
    parentId?: Types.ObjectId | null;
    icon?: string;
    backgroundColor?: string;
    textColor?: string;
    deepLink?: string;
    displayOrder?: number;

    bannerImage?: {
        url: string;
        key: string;
    };
    categoryImage?: {
        url: string;
        key: string;
    };
}

export interface ICategoryDocument extends ICategory, IBaseDocument {
    // Methods or virtuals can be added here
}
