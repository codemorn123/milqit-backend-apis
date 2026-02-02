import { UploadApiResponse } from 'cloudinary';
import { uploadImage, deleteImage, deleteMultipleImages, getCloudinaryUsage } from '../utils/cloudinary.util';
import APIError from '../error/api-error';
import { IcommonImage } from '../types/common.types';

/**
 * Configuration for image upload validation
 */
export interface ImageUploadConfig {
    maxFiles?: number;
    maxFileSize?: number; // in bytes
    allowedMimeTypes?: string[];
    required?: boolean;
}

/**
 * Generic Cloudinary Image Service for handling all image operations
 * Provides clean, typed, reusable functions for Cloudinary operations
 */
export class CloudinaryImageService {
    private readonly defaultConfig: Required<ImageUploadConfig> = {
        maxFiles: 10,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        required: false,
    };

    /**
     * Upload a single image to Cloudinary with validation
     * @param file - Multer file object
     * @param folder - Cloudinary folder name
     * @param config - Upload configuration
     * @returns Image data with URL and public ID
     */
    async uploadSingle(
        file: Express.Multer.File | undefined,
        folder: string,
        config?: ImageUploadConfig
    ): Promise<IcommonImage> {
        const finalConfig = { ...this.defaultConfig, ...config };

        // Validate file presence
        if (!file) {
            if (finalConfig.required) {
                throw new APIError('Image file is required', 400);
            }
            throw new APIError('No image file provided', 400);
        }

        // Validate file type
        this.validateFileType(file, finalConfig.allowedMimeTypes);

        // Validate file size
        this.validateFileSize(file, finalConfig.maxFileSize);

        try {
            const result = await uploadImage(file.buffer, folder);
            return {
                url: result.secure_url,
                key: result.public_id,
            };
        } catch (error) {
            throw new APIError(
                `Failed to upload image: ${(error as Error).message}`,
                500
            );
        }
    }

    /**
     * Upload multiple images to Cloudinary with validation
     * @param files - Array of Multer file objects
     * @param folder - Cloudinary folder name
     * @param config - Upload configuration
     * @returns Array of image data with URLs and public IDs
     */
    async uploadMultiple(
        files: Express.Multer.File[] | undefined,
        folder: string,
        config?: ImageUploadConfig
    ): Promise<IcommonImage[]> {
        const finalConfig = { ...this.defaultConfig, ...config };

        // Validate files presence
        if (!files || files.length === 0) {
            if (finalConfig.required) {
                throw new APIError('At least one image file is required', 400);
            }
            return [];
        }

        // Validate file count
        if (files.length > finalConfig.maxFiles) {
            throw new APIError(
                `Maximum ${finalConfig.maxFiles} images allowed`,
                400
            );
        }

        // Validate each file
        files.forEach((file) => {
            this.validateFileType(file, finalConfig.allowedMimeTypes);
            this.validateFileSize(file, finalConfig.maxFileSize);
        });

        try {
            // Upload all files in parallel
            const uploadPromises = files.map((file) =>
                uploadImage(file.buffer, folder)
            );
            const results = await Promise.all(uploadPromises);

            return results.map((result) => ({
                url: result.secure_url,
                key: result.public_id,
            }));
        } catch (error) {
            throw new APIError(
                `Failed to upload images: ${(error as Error).message}`,
                500
            );
        }
    }

    /**
     * Delete a single image from Cloudinary
     * @param image - Image object with key property
     * @returns Success status
     */
    async deleteSingle(image: IcommonImage | undefined | null): Promise<boolean> {
        if (!image?.key) {
            console.warn('No image key provided for deletion');
            return false;
        }

        try {
            await deleteImage(image.key);
            return true;
        } catch (error) {
            console.error(`Failed to delete image ${image.key}:`, error);
            // Don't throw error - log and continue
            // This prevents deletion failures from blocking other operations
            return false;
        }
    }

    /**
     * Delete multiple images from Cloudinary
     * @param images - Array of image objects with key property
     * @returns Success status
     */
    async deleteMultiple(
        images: (IcommonImage | undefined | null)[] | undefined
    ): Promise<boolean> {
        if (!images || images.length === 0) {
            console.warn('No images provided for deletion');
            return false;
        }

        const imageKeys = images
            .filter((img): img is IcommonImage => !!img?.key)
            .map((img) => img.key);

        if (imageKeys.length === 0) {
            console.warn('No valid image keys found for deletion');
            return false;
        }

        try {
            await deleteMultipleImages(imageKeys);
            return true;
        } catch (error) {
            console.error('Failed to delete images:', error);
            // Don't throw error - log and continue
            return false;
        }
    }

    /**
     * Replace an existing image with a new one
     * Deletes the old image and uploads the new one
     * @param oldImage - Existing image to replace
     * @param newFile - New image file
     * @param folder - Cloudinary folder name
     * @param config - Upload configuration
     * @returns New image data
     */
    async replaceSingle(
        oldImage: IcommonImage | undefined | null,
        newFile: Express.Multer.File | undefined,
        folder: string,
        config?: ImageUploadConfig
    ): Promise<IcommonImage | null> {
        if (!newFile) {
            return null;
        }

        // Upload new image first
        const newImage = await this.uploadSingle(newFile, folder, config);

        // Delete old image (don't fail if deletion fails)
        if (oldImage?.key) {
            await this.deleteSingle(oldImage);
        }

        return newImage;
    }

    /**
     * Add new images to existing ones
     * @param existingImages - Current images array
     * @param newFiles - New image files to add
     * @param folder - Cloudinary folder name
     * @param config - Upload configuration
     * @returns Combined array of all images
     */
    async addToExisting(
        existingImages: IcommonImage[],
        newFiles: Express.Multer.File[] | undefined,
        folder: string,
        config?: ImageUploadConfig
    ): Promise<IcommonImage[]> {
        if (!newFiles || newFiles.length === 0) {
            return existingImages;
        }

        const newImages = await this.uploadMultiple(newFiles, folder, config);
        return [...existingImages, ...newImages];
    }

    /**
     * Validate file type
     * @private
     */
    private validateFileType(
        file: Express.Multer.File,
        allowedMimeTypes: string[]
    ): void {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new APIError(
                `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
                400
            );
        }
    }

    /**
     * Validate file size
     * @private
     */
    private validateFileSize(
        file: Express.Multer.File,
        maxFileSize: number
    ): void {
        if (file.size > maxFileSize) {
            const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
            throw new APIError(
                `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
                400
            );
        }
    }

    /**
     * Format file size for display
     * @param bytes - Size in bytes
     * @returns Formatted string
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Get Cloudinary usage statistics
     * @returns Promise with usage data
     */
    async getUsageStats(): Promise<any> {
        return await getCloudinaryUsage();
    }
}

// Export singleton instance
export const cloudinaryImageService = new CloudinaryImageService();
export default cloudinaryImageService;
