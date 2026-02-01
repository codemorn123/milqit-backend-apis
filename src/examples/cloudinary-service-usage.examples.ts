/**
 * CLOUDINARY IMAGE SERVICE - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the generic CloudinaryImageService
 * across different controllers and services.
 */

import cloudinaryImageService from '../services/cloudinary-image.service';
import { IcommonImage } from '../types/common.types';

// ============================================================================
// EXAMPLE 1: Single Image Upload (e.g., Category, User Profile)
// ============================================================================

export async function createCategoryExample(
    categoryData: any,
    imageFile: Express.Multer.File | undefined
) {
    // Upload single image with validation
    const uploadedImage = await cloudinaryImageService.uploadSingle(
        imageFile,
        'categories',        // Cloudinary folder name
        { required: true }   // Make it required
    );

    // Store in database
    categoryData.categoryImage = uploadedImage;

    return categoryData;
}

// ============================================================================
// EXAMPLE 2: Multiple Images Upload (e.g., Product, Gallery)
// ============================================================================

export async function createProductExample(
    productData: any,
    imageFiles: Express.Multer.File[] | undefined
) {
    // Upload multiple images with validation
    const uploadedImages = await cloudinaryImageService.uploadMultiple(
        imageFiles,
        'products',          // Cloudinary folder name
        {
            maxFiles: 10,      // Maximum 10 images
            required: true,     // At least 1 image required
            maxFileSize: 5 * 1024 * 1024  // 5MB per image
        }
    );

    // Store in database
    productData.images = uploadedImages;

    return productData;
}

// ============================================================================
// EXAMPLE 3: Replace Image (e.g., Update Category Image)
// ============================================================================

export async function updateCategoryImageExample(
    existingCategory: any,
    newImageFile: Express.Multer.File | undefined
) {
    if (!newImageFile) {
        return existingCategory; // No new image, keep existing
    }

    // Replace old image with new one (uploads new, deletes old)
    const newImage = await cloudinaryImageService.replaceSingle(
        existingCategory.categoryImage,  // Old image (will be deleted)
        newImageFile,                     // New image file
        'categories'                      // Cloudinary folder
    );

    if (newImage) {
        existingCategory.categoryImage = newImage;
    }

    return existingCategory;
}

// ============================================================================
// EXAMPLE 4: Add Images to Existing Array (e.g., Add Product Images)
// ============================================================================

export async function addProductImagesExample(
    existingProduct: any,
    newImageFiles: Express.Multer.File[] | undefined
) {
    if (!newImageFiles || newImageFiles.length === 0) {
        return existingProduct; // No new images
    }

    // Add new images to existing ones
    const combinedImages = await cloudinaryImageService.addToExisting(
        existingProduct.images || [],  // Existing images array
        newImageFiles,                   // New files to upload
        'products',                      // Cloudinary folder
        { maxFiles: 10 }                 // Total limit
    );

    existingProduct.images = combinedImages;

    return existingProduct;
}

// ============================================================================
// EXAMPLE 5: Delete Single Image (e.g., Delete Category)
// ============================================================================

export async function deleteCategoryExample(category: any) {
    // Delete image from Cloudinary
    await cloudinaryImageService.deleteSingle(category.categoryImage);

    // Then delete from database
    // ... database deletion code
}

// ============================================================================
// EXAMPLE 6: Delete Multiple Images (e.g., Delete Product)
// ============================================================================

export async function deleteProductExample(product: any) {
    // Delete all images from Cloudinary
    await cloudinaryImageService.deleteMultiple(product.images);

    // Then delete from database
    // ... database deletion code
}

// ============================================================================
// EXAMPLE 7: Bulk Delete with Array Mapping (e.g., Delete Multiple Products)
// ============================================================================

export async function bulkDeleteProductsExample(products: any[]) {
    // Collect all images from all products
    const allImages = products.flatMap(product => product.images || []);

    // Delete all images in one operation
    await cloudinaryImageService.deleteMultiple(allImages);

    // Then delete from database
    // ... database bulk deletion code
}

// ============================================================================
// EXAMPLE 8: Banner Service (Complete Example)
// ============================================================================

class BannerService {
    /**
     * Create banner with image
     */
    async create(bannerData: any, imageFile: Express.Multer.File | undefined) {
        // Upload banner image
        const uploadedImage = await cloudinaryImageService.uploadSingle(
            imageFile,
            'banners',
            {
                required: true,
                maxFileSize: 10 * 1024 * 1024  // 10MB for banners
            }
        );

        bannerData.bannerImage = uploadedImage;

        // Save to database
        // const banner = await BannerModel.create(bannerData);
        // return banner;

        return bannerData;
    }

    /**
     * Update banner image
     */
    async update(
        bannerId: string,
        updateData: any,
        newImageFile?: Express.Multer.File
    ) {
        // const existingBanner = await BannerModel.findById(bannerId);

        const existingBanner = {} as any; // placeholder

        if (newImageFile) {
            // Replace image
            const newImage = await cloudinaryImageService.replaceSingle(
                existingBanner.bannerImage,
                newImageFile,
                'banners'
            );

            if (newImage) {
                updateData.bannerImage = newImage;
            }
        }

        // Update database
        // return await BannerModel.findByIdAndUpdate(bannerId, updateData, { new: true });

        return updateData;
    }

    /**
     * Delete banner
     */
    async delete(bannerId: string) {
        // const banner = await BannerModel.findById(bannerId);

        const banner = {} as any; // placeholder

        // Delete image from Cloudinary
        await cloudinaryImageService.deleteSingle(banner.bannerImage);

        // Delete from database
        // await BannerModel.findByIdAndDelete(bannerId);
    }
}

// ============================================================================
// EXAMPLE 9: User Profile Picture Service
// ============================================================================

class UserProfileService {
    /**
     * Upload/Update profile picture
     */
    async updateProfilePicture(
        userId: string,
        profilePictureFile: Express.Multer.File | undefined
    ) {
        // const user = await UserModel.findById(userId);

        const user = {} as any; // placeholder

        // Replace old profile picture with new one
        const newProfilePicture = await cloudinaryImageService.replaceSingle(
            user.profilePicture,  // Old picture
            profilePictureFile,    // New picture
            'users',               // Folder
            {
                maxFileSize: 2 * 1024 * 1024,  // 2MB for profile pics
                allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png']
            }
        );

        if (newProfilePicture) {
            user.profilePicture = newProfilePicture;
            // await user.save();
        }

        return user;
    }
}

// ============================================================================
// EXAMPLE 10: Reel/Video Service
// ============================================================================

class ReelService {
    /**
     * Upload reel video
     */
    async create(reelData: any, videoFile: Express.Multer.File | undefined) {
        // For videos, use uploadSingleMedia middleware or modify config
        const uploadedVideo = await cloudinaryImageService.uploadSingle(
            videoFile,
            'reels',
            {
                required: true,
                maxFileSize: 100 * 1024 * 1024,  // 100MB for videos
                allowedMimeTypes: [
                    'video/mp4',
                    'video/quicktime',
                    'video/x-msvideo'
                ]
            }
        );

        reelData.videoUrl = uploadedVideo.url;
        reelData.videoKey = uploadedVideo.key;

        return reelData;
    }
}

// ============================================================================
// EXAMPLE 11: Custom Configuration Per Upload
// ============================================================================

export async function uploadWithCustomConfigExample(file: Express.Multer.File) {
    const image = await cloudinaryImageService.uploadSingle(
        file,
        'custom-folder',
        {
            maxFiles: 1,
            maxFileSize: 3 * 1024 * 1024,     // 3MB
            allowedMimeTypes: [
                'image/jpeg',
                'image/png',
                'image/webp'
            ],
            required: true
        }
    );

    return image;
}

// ============================================================================
// EXAMPLE 12: Error Handling Best Practices
// ============================================================================

export async function uploadWithErrorHandlingExample(
    file: Express.Multer.File | undefined
) {
    try {
        const image = await cloudinaryImageService.uploadSingle(
            file,
            'folder',
            { required: true }
        );

        // Success - save to database
        return { success: true, image };

    } catch (error) {
        // Error is already a formatted APIError from the service
        console.error('Upload failed:', error);

        // Re-throw or handle as needed
        throw error;
    }
}

// ============================================================================
// EXAMPLE 13: Conditional Image Updates
// ============================================================================

export async function conditionalUpdateExample(
    entityData: any,
    newFile: Express.Multer.File | undefined,
    shouldReplaceImage: boolean
) {
    if (shouldReplaceImage && newFile) {
        // Replace image
        const newImage = await cloudinaryImageService.replaceSingle(
            entityData.image,
            newFile,
            'folder'
        );

        if (newImage) {
            entityData.image = newImage;
        }
    } else if (newFile) {
        // Just upload, don't delete old one
        const newImage = await cloudinaryImageService.uploadSingle(
            newFile,
            'folder'
        );

        entityData.image = newImage;
    }

    return entityData;
}

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/**
 * TO MIGRATE A SERVICE TO USE CLOUDINARY:
 * 
 * 1. Update imports:
 *    - Remove: import customFileService from './custom-file.service';
 *    - Remove: import { SOME_PATH } from '../constants/file-paths';
 *    - Add: import cloudinaryImageService from './cloudinary-image.service';
 * 
 * 2. Replace create/upload logic:
 *    - Single image: cloudinaryImageService.uploadSingle(file, 'folder', config)
 *    - Multiple images: cloudinaryImageService.uploadMultiple(files, 'folder', config)
 * 
 * 3. Replace update logic:
 *    - Replace image: cloudinaryImageService.replaceSingle(old, new, 'folder')
 *    - Add images: cloudinaryImageService.addToExisting(existing, new, 'folder')
 * 
 * 4. Replace delete logic:
 *    - Single: cloudinaryImageService.deleteSingle(image)
 *    - Multiple: cloudinaryImageService.deleteMultiple(images)
 * 
 * 5. Update folder names:
 *    - Use descriptive folder names: 'products', 'categories', 'banners', 'users', etc.
 * 
 * 6. Test all operations:
 *    - Create with image
 *    - Update with new image
 *    - Delete (verify Cloudinary deletion)
 */

export { };
