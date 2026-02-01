import APIError from '../error/api-error';
import { Request } from 'express';
import multer from 'multer';


/**
 * Multer configuration for handling file uploads in memory
 * Files are stored in memory as Buffer objects for direct Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only image files
 */
const imageFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new APIError('Only image files are allowed', 400));
    }
};

/**
 * File filter to accept both images and videos
 */
const mediaFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Accept image and video files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new APIError('Only image and video files are allowed', 400));
    }
};

/**
 * Multer middleware for single image upload
 * @param fieldName - Name of the form field containing the image
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 */
export const uploadSingleImage = (
    fieldName: string,
    maxSize: number = 5 * 1024 * 1024 // 5MB default
) => {
    return multer({
        storage,
        fileFilter: imageFileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).single(fieldName);
};

/**
 * Multer middleware for multiple image uploads
 * @param fieldName - Name of the form field containing the images
 * @param maxCount - Maximum number of files (default: 10)
 * @param maxSize - Maximum file size in bytes per file (default: 5MB)
 */
export const uploadMultipleImages = (
    fieldName: string,
    maxCount: number = 10,
    maxSize: number = 5 * 1024 * 1024 // 5MB default
) => {
    return multer({
        storage,
        fileFilter: imageFileFilter,
        limits: {
            fileSize: maxSize,
            files: maxCount,
        },
    }).array(fieldName, maxCount);
};

/**
 * Multer middleware for multiple fields with images
 * @param fields - Array of field configurations
 * @param maxSize - Maximum file size in bytes per file (default: 5MB)
 */
export const uploadImageFields = (
    fields: Array<{ name: string; maxCount: number }>,
    maxSize: number = 5 * 1024 * 1024 // 5MB default
) => {
    return multer({
        storage,
        fileFilter: imageFileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).fields(fields);
};

/**
 * Multer middleware for single media file (image or video)
 * @param fieldName - Name of the form field containing the media
 * @param maxSize - Maximum file size in bytes (default: 50MB for videos)
 */
export const uploadSingleMedia = (
    fieldName: string,
    maxSize: number = 50 * 1024 * 1024 // 50MB default for videos
) => {
    return multer({
        storage,
        fileFilter: mediaFileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).single(fieldName);
};

/**
 * Multer middleware for any file upload (no filtering)
 * @param fieldName - Name of the form field
 * @param maxSize - Maximum file size in bytes (default: 10MB)
 */
export const uploadAnyFile = (
    fieldName: string,
    maxSize: number = 10 * 1024 * 1024 // 10MB default
) => {
    return multer({
        storage,
        limits: {
            fileSize: maxSize,
        },
    }).single(fieldName);
};

export default {
    uploadSingleImage,
    uploadMultipleImages,
    uploadImageFields,
    uploadSingleMedia,
    uploadAnyFile,
};
