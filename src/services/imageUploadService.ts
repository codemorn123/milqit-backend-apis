import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';
import { Request } from 'express';
import { ApiError } from '../utils/errorHandler';
import { logger } from '../config/logger';
import { config } from '../config';

// Define upload directories
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const PRODUCT_IMAGES_DIR = path.join(UPLOAD_DIR, 'products');
const CATEGORY_IMAGES_DIR = path.join(UPLOAD_DIR, 'categories');

// Ensure directories exist
async function ensureDirectories(): Promise<void> {
  try {
    await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
    await fs.mkdir(CATEGORY_IMAGES_DIR, { recursive: true });
  } catch (error) {
    logger.error({ error }, 'Failed to create upload directories');
    throw new Error('Failed to create upload directories');
  }
}

// Initialize directories
ensureDirectories();

// Define allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`));
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});

// Interface for image processing options
interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

// Image upload service
export const imageUploadService = {
  /**
   * Process and save a product image
   */
  async processProductImage(
    file: Express.Multer.File,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    try {
      const { width = 800, height, quality = 80, format = 'webp' } = options;
      
      // Generate filename and path
      const filename = `${Date.now()}-${uuidv4()}.${format}`;
      const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
      
      // Process image with sharp
      let sharpInstance = sharp(file.path);
      
      // Resize if dimensions provided
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Set format and quality
      if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
      } else if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality });
      }
      
      // Save processed image
      await sharpInstance.toFile(filePath);
      
      // Delete temp upload
      await fs.unlink(file.path);
      
      // Return relative path for database storage
      return `/uploads/products/${filename}`;
    } catch (error) {
      logger.error({ error, file }, 'Failed to process product image');
      throw ApiError.internal('Failed to process product image');
    }
  },
  
  /**
   * Process and save a category image
   */
  async processCategoryImage(
    file: Express.Multer.File,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    try {
      const { width = 600, height, quality = 85, format = 'webp' } = options;
      
      // Generate filename and path
      const filename = `${Date.now()}-${uuidv4()}.${format}`;
      const filePath = path.join(CATEGORY_IMAGES_DIR, filename);
      
      // Process image with sharp
      let sharpInstance = sharp(file.path);
      
      // Resize if dimensions provided
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Set format and quality
      if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
      } else if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality });
      }
      
      // Save processed image
      await sharpInstance.toFile(filePath);
      
      // Delete temp upload
      await fs.unlink(file.path);
      
      // Return relative path for database storage
      return `/uploads/categories/${filename}`;
    } catch (error) {
      logger.error({ error, file }, 'Failed to process category image');
      throw ApiError.internal('Failed to process category image');
    }
  },
  
  /**
   * Process multiple product images
   */
  async processMultipleProductImages(
    files: Express.Multer.File[],
    options: ImageProcessingOptions = {}
  ): Promise<string[]> {
    try {
      const imageUrls: string[] = [];
      
      for (const file of files) {
        const imageUrl = await this.processProductImage(file, options);
        imageUrls.push(imageUrl);
      }
      
      return imageUrls;
    } catch (error) {
      logger.error({ error }, 'Failed to process multiple product images');
      throw ApiError.internal('Failed to process product images');
    }
  },
  
  /**
   * Delete an image
   */
  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      // Convert URL path to file system path
      const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      const fullPath = path.join(process.cwd(), relativePath);
      
      // Check if file exists
      await fs.access(fullPath);
      
      // Delete file
      await fs.unlink(fullPath);
      
      return true;
    } catch (error) {
      logger.warn({ error, imagePath }, 'Failed to delete image or image not found');
      return false;
    }
  }
};