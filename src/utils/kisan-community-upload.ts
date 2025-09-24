// src/utils/kisan-community-upload.ts

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const destinationPath = 'uploads/kisan-community/images';

// Ensure the destination directory exists
fs.mkdirSync(destinationPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'kisan-' + uniqueSuffix + extension);
  },
});

const kisanCommunityUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any, false);
    }
  },
});

export default kisanCommunityUpload;