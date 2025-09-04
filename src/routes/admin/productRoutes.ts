import express from 'express';
import { AdminProductController } from '../../controllers/admin/AdminProductController';
// import { authenticateJWT } from '../../middleware/authMiddleware';
// import { authorizeRoles } from '../../middleware/roleMiddleware';
import multer from 'multer';
import path from 'path';
import { ApiError } from '../../utils/errorHandler';
import { CreateProductDTO } from './../../dto/product.dto';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// Create product upload middleware
const productUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
}).array('images', 10); // Allow up to 10 images

const router = express.Router();

// Create product route with proper file upload handling
router.post('/',
//   authenticateJWT,
//   authorizeRoles(['admin']),
  (req, res, next) => {
    productUpload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(ApiError.badRequest('File size exceeds the 5MB limit'));
        }
        return next(ApiError.badRequest(`Upload error: ${err.message}`));
      } else if (err) {
        // An unknown error occurred
        return next(ApiError.badRequest(`File validation error: ${err.message}`));
      }
      
      // Everything went fine, proceed
      next();
    });
  },
//   async (req, res, next) => {
//     try {
//       const controller = new AdminProductController();
//       const response = await controller.createProduct(req);
//       res.status(201).json(response);
//     } catch (error) {
//       next(error);
//     }
//   }

async (req, res, next) => {
  try {
    const controller = new AdminProductController();

    const dto: CreateProductDTO = {
      name: req.body.name,
      price: Number(req.body.price),
      categoryId: req.body.categoryId,
      sku: req.body.sku,
      quantity: Number(req.body.quantity),
      unit: req.body.unit,
      description: req.body.description,
      brand: req.body.brand,
      isActive: true,
    };

   const response = await controller.createProduct(
  dto.name,
  dto.price,
  dto.categoryId,
  dto.sku,
  dto.quantity,
  dto.unit,
  dto.description,
  dto.brand,
  dto.isActive,
  req.files as Express.Multer.File[]
);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}
);

// Add other routes here...

export default router;