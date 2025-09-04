import express from 'express';


import multer from 'multer';
import { ApiError } from '../../utils/errorHandler';
import { logger } from '../../config/logger';
import { categoryUpload } from './../../middleware/fileUpload';
import { AdminCategoryController } from './../../controllers/admin/AdminCategoriesController';

const router = express.Router();

// Create category endpoint with file upload support
router.post('/', 
//   authenticateJWT,
//   authorizeRoles(['admin']),
  (req, res, next) => {
    categoryUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(ApiError.badRequest('File size exceeds the 5MB limit'));
        }
        return next(ApiError.badRequest(`File upload error: ${err.message}`));
      } else if (err) {
        return next(ApiError.badRequest(`Upload error: ${err.message}`));
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      const controller = new AdminCategoryController();
      // Pass the populated request with files to controller
      const result = await controller.createCategory(req);
      return res.status(201).json(result);
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }, 'Error in category creation route');
      next(error);
    }
  }
);

// Other routes can be defined here...

export default router;