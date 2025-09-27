


import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Create upload directories with proper error handling
const createUploadDirs = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const imagesDir = path.join(uploadDir, 'images');
  const documentsDir = path.join(uploadDir, 'documents');
  const videosDir = path.join(uploadDir, 'videos');
  
  const dirs = [uploadDir, imagesDir, documentsDir, videosDir];
  
  try {
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });
    
    // Test write permissions
    const testFile = path.join(imagesDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`✅ Write permissions verified for: ${imagesDir}`);
    
    return { uploadDir, imagesDir, documentsDir, videosDir };
  } catch (error) {
    console.error('❌ Error creating upload directories:', error);
    throw error;
  }
};

const { imagesDir, documentsDir, videosDir } = createUploadDirs();

// Configure storage with detailed logging
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let targetDir = imagesDir; // default
    
    // Determine directory based on file type or field name
    if (file.fieldname.includes('document') || file.mimetype.includes('pdf')) {
      targetDir = documentsDir;
    } else if (file.fieldname.includes('video') || file.mimetype.includes('video')) {
      targetDir = videosDir;
    } else if (file.fieldname.includes('image') || file.mimetype.includes('image')) {
      targetDir = imagesDir;
    }
    
    console.log(`📁 Setting destination for ${file.fieldname}: ${targetDir}`);
    
    // Verify directory exists before callback
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Directory does not exist: ${targetDir}`);
      return cb(new Error(`Upload directory does not exist: ${targetDir}`), '');
    }
    
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4().substring(0, 8); // Short UUID
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      
      // Format: fieldname-timestamp-uuid-basename.ext
      const filename = `${file.fieldname}-${timestamp}-${uniqueId}-${baseName}${ext}`;
      
      console.log(`📄 Generated filename: ${filename}`);
      console.log(`📍 Original name: ${file.originalname}`);
      
      cb(null, filename);
    } catch (error) {
      console.error('❌ Error generating filename:', error);
      cb(error instanceof Error ? error : new Error(String(error)), '');
    }
  }
});

// Enhanced file filter with logging
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log(`🔍 Processing file: ${file.fieldname} - ${file.originalname} - ${file.mimetype}`);
  
  const allowedMimes: { [key: string]: string[] } = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
  };
  
  // Determine file category
  let isAllowed = false;
  let fileCategory = 'unknown';
  
  for (const [category, mimes] of Object.entries(allowedMimes)) {
    if (mimes.includes(file.mimetype)) {
      isAllowed = true;
      fileCategory = category;
      break;
    }
  }
  
  if (isAllowed) {
    console.log(`✅ File type allowed: ${file.mimetype} (${fileCategory})`);
    cb(null, true);
  } else {
    console.log(`❌ File type rejected: ${file.mimetype}`);
    cb(new Error(`Invalid file type. Received: ${file.mimetype}. Allowed types: ${Object.values(allowedMimes).flat().join(', ')}`));
  }
};

// Create multer instance with enhanced configuration
const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB for all files
    files: 5, // Maximum 5 files per request
  },
  fileFilter
});

// Export different upload configurations
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 5);
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 3 },
  { name: 'document', maxCount: 2 },
  { name: 'video', maxCount: 1 }
]);

export default upload;