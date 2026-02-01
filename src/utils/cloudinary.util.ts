import type {
    DeleteApiResponse,
    UploadApiOptions,
    UploadApiResponse,
} from "cloudinary";
import cloudinary from "../config/cloudinary.config";
import APIError from "../error/api-error";

/**
 * Upload an image buffer to Cloudinary
 * @param buffer - Image file buffer
 * @param folder - Cloudinary folder name (e.g., 'products', 'categories', 'banners')
 * @param publicId - Optional custom public ID
 * @returns Promise with upload result containing url and public_id
 */
export const uploadImage = async (
    buffer: Buffer,
    folder: string = "uploads",
    publicId?: string,
): Promise<UploadApiResponse> => {
    try {
        const options: UploadApiOptions = {
            folder: `ByeNext/${folder}`,
            resource_type: "auto",
            ...(publicId && { public_id: publicId }),
        };

        return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(options, (error, result) => {
                    if (error) {
                        reject(new APIError(`Cloudinary upload failed: ${error.message}`, 500));
                    } else if (!result) {
                        reject(new APIError("Cloudinary upload failed: No result returned", 500));
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                })
                .end(buffer);
        });
    } catch (error) {
        throw new APIError(`Error uploading image: ${(error as Error).message}`, 500);
    }
};

/**
 * Generate optimized image URL from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options (width, height, crop, quality, etc.)
 * @returns Optimized image URL
 */
export const getImageUrl = (
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string | number;
        format?: string;
    } = {},
): string => {
    try {
        return cloudinary.url(publicId, {
            width: options.width,
            height: options.height,
            crop: options.crop || 'fill',
            quality: options.quality || 'auto',
            format: options.format || 'auto',
            secure: true,
        });
    } catch (error) {
        throw new APIError(`Error generating image URL: ${(error as Error).message}`, 500);
    }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID to delete
 * @returns Promise with deletion result
 */
export const deleteImage = async (
    publicId: string,
): Promise<DeleteApiResponse> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'not found') {
            console.warn(`Image not found in Cloudinary: ${publicId}`);
        }

        return result;
    } catch (error) {
        throw new APIError(`Error deleting image: ${(error as Error).message}`, 500);
    }
};

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of Cloudinary public IDs to delete
 * @returns Promise with deletion results
 */
export const deleteMultipleImages = async (
    publicIds: string[],
): Promise<{ deleted: Record<string, string> }> => {
    try {
        if (!publicIds || publicIds.length === 0) {
            return { deleted: {} };
        }

        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        throw new APIError(`Error deleting multiple images: ${(error as Error).message}`, 500);
    }
};

/**
 * Delete all images in a specific folder
 * @param folderPath - Cloudinary folder path (e.g., 'ByeNext/categories')
 * @returns Promise with deletion result
 */
export const deleteFolder = async (
    folderPath: string,
): Promise<{ deleted: Record<string, string> }> => {
    try {
        const result = await cloudinary.api.delete_resources_by_prefix(folderPath);
        return result;
    } catch (error) {
        throw new APIError(`Error deleting folder: ${(error as Error).message}`, 500);
    }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Full Cloudinary URL
 * @returns Public ID or null if not a valid Cloudinary URL
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
    try {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/ByeNext/categories/image.jpg
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error extracting public ID from URL:', error);
        return null;
    }
};

export default {
    uploadImage,
    getImageUrl,
    deleteImage,
    deleteMultipleImages,
    deleteFolder,
    extractPublicIdFromUrl,
};
