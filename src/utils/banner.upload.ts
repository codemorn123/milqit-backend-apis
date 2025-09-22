import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import APIError from './../error/api-error';
import { promises as fsPromises } from 'fs';
const bannerStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(process.cwd(), '/uploads/banners');
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  /**
   * Generates a unique filename for the uploaded file to avoid name collisions.
   * Format: fieldname-timestamp-randomnumber.extension
   */
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

/**
 * File filter to ensure only image files are uploaded.
 */
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Regular expression to check for common image file extensions
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    // Reject file with a specific error if it's not an image
    return cb(new APIError('Only image files (jpg, jpeg, png, gif, webp) are allowed!', 400));
  }
  // Accept file
  cb(null, true);
};


export const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


export const deleteFile = async (relativeFilePath: string): Promise<void> => {
    try {
      const absolutePath = path.join(process.cwd(), relativeFilePath);
      await fsPromises.unlink(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
    } catch (error: any) {
      // If the error is 'ENOENT', the file doesn't exist. This is not a failure
      // in a delete operation, so we can safely ignore it.
      if (error.code === 'ENOENT') {
        console.warn(`File not found, could not delete: ${relativeFilePath}`);
      } else {
        // For any other error (e.g., permissions), log it for debugging.
        console.error(`Error deleting file ${relativeFilePath}:`, error);
        // We don't re-throw the error, as failing to delete a file should not
        // prevent the database record from being deleted.
      }
    }
  };
  