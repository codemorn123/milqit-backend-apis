// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { ApiError } from '../utils/errorHandler';
// import { Request } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import { logger } from '../config/logger';

// // Define storage directories
// const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
// const TEMP_DIR = path.join(UPLOAD_DIR, 'temp');
// const PRODUCTS_DIR = path.join(UPLOAD_DIR, 'products');

// // Ensure directories exist
// [UPLOAD_DIR, TEMP_DIR, PRODUCTS_DIR].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, TEMP_DIR);
//   },
//   filename: (req, file, cb) => {
//     const uniqueId = uuidv4();
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `${file.fieldname}-${uniqueId}${ext}`);
//   }
// });

// // File filter function
// const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   // Check file type
//   if (!file.mimetype.startsWith('image/')) {
//     return cb(new Error('Only image files are allowed'));
//   }
  
//   // Check file extension
//   const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
//   const ext = path.extname(file.originalname).toLowerCase();
  
//   if (!validExtensions.includes(ext)) {
//     return cb(new Error('Invalid file extension. Allowed: jpg, jpeg, png, gif, webp'));
//   }
  
//   cb(null, true);
// };

// // Create multer instances for different use cases
// export const productImageUpload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//     files: 10 // Maximum 10 files
//   },
//   fileFilter: imageFileFilter
// }).array('images', 10); // Field name 'images' with max 10 files

// export const productUploadMiddleware = (req: Request, res: any, next: any) => {
//   productImageUpload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return next(ApiError.badRequest('File size exceeds the 5MB limit'));
//       }
//       if (err.code === 'LIMIT_FILE_COUNT') {
//         return next(ApiError.badRequest('Too many files. Maximum 10 images allowed'));
//       }
//       return next(ApiError.badRequest(`Upload error: ${err.message}`));
//     } else if (err) {
//       return next(ApiError.badRequest(`File validation error: ${err.message}`));
//     }
//     next();
//   });
// };

// // Helper to move file from temp to products directory
// export const moveUploadedFile = async (tempFilePath: string): Promise<string> => {
//   try {
//     const filename = path.basename(tempFilePath);
//     const targetPath = path.join(PRODUCTS_DIR, filename);
    
//     return new Promise((resolve, reject) => {
//       const readStream = fs.createReadStream(tempFilePath);
//       const writeStream = fs.createWriteStream(targetPath);
      
//       readStream.on('error', reject);
//       writeStream.on('error', reject);
      
//       writeStream.on('finish', () => {
//         fs.unlink(tempFilePath, (err) => {
//           if (err) {
//             logger.warn(`Failed to delete temp file: ${tempFilePath}`);
//           }
//         });
//         resolve(`/uploads/products/${filename}`); // Return relative URL path
//       });
      
//       readStream.pipe(writeStream);
//     });
//   } catch (error) {
//     logger.error(`Error moving file: ${error}`);
//     throw new Error('Failed to process uploaded file');
//   }
// };
import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'uploads');
const tempDir = path.join(uploadDir, 'temp');
const productsDir = path.join(uploadDir, 'products');

// Create directories if they don't exist
[uploadDir, tempDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// File filter to allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer upload middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Max 10 files
  },
  fileFilter
});

// Product upload middleware
export const productUpload = upload.array('images', 10);

/**
 * Move a file from temporary location to the products directory
 * @param tempFilePath Path to the temporary file
 * @returns The relative URL path to the moved file
 */
export async function moveUploadedFile(tempFilePath: string): Promise<string> {
  try {
    if (!tempFilePath || !fs.existsSync(tempFilePath)) {
      throw new Error(`Temp file does not exist: ${tempFilePath}`);
    }

    const filename = path.basename(tempFilePath);
    const targetPath = path.join(productsDir, filename);
    
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(tempFilePath);
      const writeStream = fs.createWriteStream(targetPath);
      
      readStream.on('error', (err) => {
        logger.error({ error: err.message, tempFilePath }, 'Error reading temp file');
        reject(err);
      });
      
      writeStream.on('error', (err) => {
        logger.error({ error: err.message, targetPath }, 'Error writing to products directory');
        reject(err);
      });
      
      writeStream.on('finish', () => {
        // Delete the temp file after successful copy
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            logger.warn({ path: tempFilePath, error: err.message }, 'Failed to delete temporary file');
          }
        });
        
        // Return the relative path for storage in database
        resolve(`/uploads/products/${filename}`);
      });
      
      // Pipe the data from the read stream to the write stream
      readStream.pipe(writeStream);
    });
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      tempFilePath 
    }, 'Failed to move uploaded file');
    throw new Error('Failed to process uploaded file');
  }
}