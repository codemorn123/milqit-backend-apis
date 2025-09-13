import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories with proper error handling
const createUploadDirs = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const categoriesDir = path.join(uploadDir, 'categories');
  const imagesDir = path.join(categoriesDir, 'images');
  const iconsDir = path.join(categoriesDir, 'icons');
  const bannersDir = path.join(categoriesDir, 'banners');
  
  const dirs = [uploadDir, categoriesDir, imagesDir, iconsDir, bannersDir];
  
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
    console.log(`✅ Write permissions verified`);
    
    return { imagesDir, iconsDir, bannersDir };
  } catch (error) {
    console.error('❌ Error creating upload directories:', error);
    throw error;
  }
};

const { imagesDir, iconsDir, bannersDir } = createUploadDirs();

// Configure storage with different folders for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationDir: string;
    
    switch (file.fieldname) {
      case 'image':
        destinationDir = imagesDir;
        break;
      case 'icon':
        destinationDir = iconsDir;
        break;
      case 'banner':
        destinationDir = bannersDir;
        break;
      default:
        destinationDir = imagesDir;
    }
    
    console.log(`📁 Setting destination for ${file.fieldname}: ${destinationDir}`);
    
    if (!fs.existsSync(destinationDir)) {
      console.error(`❌ Directory does not exist: ${destinationDir}`);
      return cb(new Error(`Upload directory does not exist: ${destinationDir}`), '');
    }
    
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      
      console.log(`📄 Generated filename: ${filename}`);
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
    files: 3 // Maximum 3 files
  },
  fileFilter
});

export default upload;

// Helper function to generate file URLs with proper error handling
export const generateFileUrl = (file: Express.Multer.File): string => {
  console.log('🔍 Generating URL for file:', {
    fieldname: file.fieldname,
    filename: file.filename,
    destination: file.destination,
    path: file.path,
    originalname: file.originalname
  });

  // Check if file has required properties
  if (!file.filename) {
    throw new Error('File filename is missing');
  }

  if (!file.destination) {
    throw new Error('File destination is missing');
  }

  // Build URL using destination and filename
  let fileUrl: string;

  if (file.path) {
    // Use file.path if available
    const relativePath = file.path.replace(/\\/g, '/').replace(process.cwd(), '');
    fileUrl = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  } else {
    // Fallback: construct path from destination and filename
    const fullPath = path.join(file.destination, file.filename);
    const relativePath = fullPath.replace(/\\/g, '/').replace(process.cwd(), '');
    fileUrl = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  }

  console.log(`🔗 Generated file URL: ${fileUrl}`);
  return fileUrl;
};

// Helper function to process multiple files and return URLs with error handling
export const processUploadedFiles = (files: {
  image?: Express.Multer.File[];
  icon?: Express.Multer.File[];
  banner?: Express.Multer.File[];
}): {
  imageUrl?: string;
  iconUrl?: string;
  bannerUrl?: string;
} => {
  const result: any = {};

  console.log('🔄 Processing uploaded files:', {
    imageCount: files.image?.length || 0,
    iconCount: files.icon?.length || 0,
    bannerCount: files.banner?.length || 0
  });

  try {
    if (files.image && files.image[0]) {
      console.log('📸 Processing image file:', files.image[0].filename);
      result.imageUrl = generateFileUrl(files.image[0]);
      console.log(`📸 Image URL: ${result.imageUrl}`);
    }
    
    if (files.icon && files.icon[0]) {
      console.log('🎯 Processing icon file:', files.icon[0].filename);
      result.iconUrl = generateFileUrl(files.icon[0]);
      console.log(`🎯 Icon URL: ${result.iconUrl}`);
    }
    
    if (files.banner && files.banner[0]) {
      console.log('🎨 Processing banner file:', files.banner[0].filename);
      result.bannerUrl = generateFileUrl(files.banner[0]);
      console.log(`🎨 Banner URL: ${result.bannerUrl}`);
    }
  } catch (error) {
    console.error('❌ Error processing files:', error);
    throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log('✅ File processing completed:', result);
  return result;
};

// Alternative helper function that doesn't rely on file.path
export const processUploadedFilesAlternative = (files: {
  image?: Express.Multer.File[];
  icon?: Express.Multer.File[];
  banner?: Express.Multer.File[];
}): {
  imageUrl?: string;
  iconUrl?: string;
  bannerUrl?: string;
} => {
  const result: any = {};

  const getFileUrl = (file: Express.Multer.File): string => {
    // Construct URL from known directory structure
    const baseUrl = '/uploads/categories';
    let subfolder = '';
    
    switch (file.fieldname) {
      case 'image':
        subfolder = 'images';
        break;
      case 'icon':
        subfolder = 'icons';
        break;
      case 'banner':
        subfolder = 'banners';
        break;
      default:
        subfolder = 'images';
    }
    
    return `${baseUrl}/${subfolder}/${file.filename}`;
  };

  if (files.image && files.image[0]) {
    result.imageUrl = getFileUrl(files.image[0]);
    console.log(`📸 Image URL: ${result.imageUrl}`);
  }
  
  if (files.icon && files.icon[0]) {
    result.iconUrl = getFileUrl(files.icon[0]);
    console.log(`🎯 Icon URL: ${result.iconUrl}`);
  }
  
  if (files.banner && files.banner[0]) {
    result.bannerUrl = getFileUrl(files.banner[0]);
    console.log(`🎨 Banner URL: ${result.bannerUrl}`);
  }

  return result;
};