import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories with proper error handling
const createUploadDirs = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const imagesDir = path.join(uploadDir, 'images');
  
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`✅ Created directory: ${uploadDir}`);
    }
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`✅ Created directory: ${imagesDir}`);
    }
    
    // Test write permissions
    const testFile = path.join(imagesDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`✅ Write permissions verified for: ${imagesDir}`);
    
    return imagesDir;
  } catch (error) {
    console.error('❌ Error creating upload directories:', error);
    throw error;
  }
};

const imagesDir = createUploadDirs();

// Configure storage with detailed logging
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`📁 Setting destination for ${file.fieldname}: ${imagesDir}`);
    
    // Verify directory exists before callback
    if (!fs.existsSync(imagesDir)) {
      console.error(`❌ Directory does not exist: ${imagesDir}`);
      return cb(new Error(`Upload directory does not exist: ${imagesDir}`), '');
    }
    
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      
      console.log(`📄 Generated filename: ${filename}`);
      console.log(`📍 Full path will be: ${path.join(imagesDir, filename)}`);
      
      cb(null, filename);
    } catch (error) {
      console.error('❌ Error generating filename:', error);
      cb(error instanceof Error ? error : new Error(String(error)), '');
    }
  }
});

// File filter with logging
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log(`🔍 Processing file: ${file.fieldname} - ${file.originalname} - ${file.mimetype}`);
  
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log(`✅ File type allowed: ${file.mimetype}`);
    cb(null, true);
  } else {
    console.log(`❌ File type rejected: ${file.mimetype}`);
    cb(new Error(`Invalid file type. Only images are allowed. Received: ${file.mimetype}`));
  }
};

// Create multer instance
const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter
});

export default upload;