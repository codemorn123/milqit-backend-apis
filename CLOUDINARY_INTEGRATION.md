# Cloudinary Integration Guide

## Overview
This project has been migrated from local file storage to Cloudinary for all image management. Cloudinary provides cloud-based image storage, optimization, and transformation capabilities.

## Setup

### 1. Environment Variables
Add the following environment variables to your `.env` file:

```env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Cloudinary Credentials
1. Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy the **Cloud Name**, **API Key**, and **API Secret**
4. Add them to your environment variables

## Architecture

### File Structure
```
src/
├── config/
│   └── cloudinary.config.ts      # Cloudinary configuration
├── utils/
│   └── cloudinary.util.ts        # Cloudinary utility functions
├── middleware/
│   └── cloudinary-upload.middleware.ts  # Multer middleware for file uploads
└── services/
    ├── category.service.ts       # Updated to use Cloudinary
    └── product.service.ts        # Updated to use Cloudinary
```

### Configuration
**File:** `src/config/cloudinary.config.ts`

Initializes Cloudinary with credentials from environment variables and ensures secure connections.

### Utility Functions
**File:** `src/utils/cloudinary.util.ts`

Provides the following functions:

#### `uploadImage(buffer, folder, publicId?)`
- **Purpose**: Upload an image to Cloudinary
- **Parameters**:
  - `buffer`: Image file buffer from multer
  - `folder`: Target folder in Cloudinary (e.g., 'products', 'categories')
  - `publicId`: Optional custom public ID
- **Returns**: Upload result with `secure_url` and `public_id`

#### `deleteImage(publicId)`
- **Purpose**: Delete an image from Cloudinary
- **Parameters**:
  - `publicId`: The Cloudinary public ID to delete
- **Returns**: Deletion result

#### `deleteMultipleImages(publicIds[])`
- **Purpose**: Delete multiple images in one operation
- **Parameters**:
  - `publicIds`: Array of Cloudinary public IDs
- **Returns**: Bulk deletion result

#### `getImageUrl(publicId, options)`
- **Purpose**: Generate optimized image URL with transformations
- **Parameters**:
  - `publicId`: The Cloudinary public ID
  - `options`: Transformation options (width, height, quality, format)
- **Returns**: Transformed image URL

#### `deleteFolder(folderPath)`
- **Purpose**: Delete all images in a folder
- **Parameters**:
  - `folderPath`: Cloudinary folder path
- **Returns**: Deletion result

#### `extractPublicIdFromUrl(url)`
- **Purpose**: Extract public ID from a Cloudinary URL
- **Parameters**:
  - `url`: Full Cloudinary URL
- **Returns**: Public ID or null

## Usage Examples

### Categories Service
**File:** `src/services/category.service.ts`

#### Creating a Category with Image
```typescript
// Upload image to Cloudinary
const uploadResult = await uploadImage(image.buffer, 'categories');

// Store URL and public_id in database
categoryData.categoryImage = { 
  url: uploadResult.secure_url, 
  key: uploadResult.public_id 
};
```

#### Updating a Category Image
```typescript
// Delete old image from Cloudinary
if (category.categoryImage?.key) {
  await deleteImage(category.categoryImage.key);
}

// Upload new image
const uploadResult = await uploadImage(file.buffer, 'categories');
payload.categoryImage = { 
  url: uploadResult.secure_url, 
  key: uploadResult.public_id 
};
```

#### Deleting a Category
```typescript
// Delete image from Cloudinary before deleting category
if (category.categoryImage?.key) {
  await deleteImage(category.categoryImage.key);
}
```

### Products Service
**File:** `src/services/product.service.ts`

#### Creating a Product with Multiple Images
```typescript
// Upload multiple images to Cloudinary
const uploadPromises = images.map(image => uploadImage(image.buffer, 'products'));
const uploadResults = await Promise.all(uploadPromises);

// Convert to database format
const productImages = uploadResults.map(result => ({
  url: result.secure_url,
  key: result.public_id
}));
```

#### Updating Product Images
```typescript
// Upload new images
const uploadPromises = files.map(file => uploadImage(file.buffer, 'products'));
const uploadResults = await Promise.all(uploadPromises);

const newImages = uploadResults.map(result => ({
  url: result.secure_url,
  key: result.public_id
}));

// Add to existing images
updateData.images = [...existingImages, ...newImages];
```

#### Deleting a Product
```typescript
// Delete all product images from Cloudinary
const imagePublicIds = product.images
  .map(img => img.key)
  .filter((key): key is string => !!key);

if (imagePublicIds.length > 0) {
  await deleteMultipleImages(imagePublicIds);
}
```

## Middleware

### Upload Middleware
**File:** `src/middleware/cloudinary-upload.middleware.ts`

Provides multer configurations for various upload scenarios:

#### Single Image Upload
```typescript
import { uploadSingleImage } from '../middleware/cloudinary-upload.middleware';

// In your route or controller
uploadSingleImage('fieldName', 5 * 1024 * 1024) // 5MB max
```

#### Multiple Images Upload
```typescript
import { uploadMultipleImages } from '../middleware/cloudinary-upload.middleware';

// In your route or controller
uploadMultipleImages('fieldName', 10, 5 * 1024 * 1024) // Max 10 files, 5MB each
```

#### Media File Upload (Images + Videos)
```typescript
import { uploadSingleMedia } from '../middleware/cloudinary-upload.middleware';

// In your route or controller
uploadSingleMedia('fieldName', 50 * 1024 * 1024) // 50MB max for videos
```

## Folder Structure in Cloudinary

The project uses the following folder structure in Cloudinary:

```
ByeNext/
├── categories/      # Category images
├── products/        # Product images
├── banners/         # Banner images
├── users/           # User profile images
└── reels/           # Reel videos
```

## Database Schema

Images are stored in the database with the following structure:

```typescript
interface IcommonImage {
  url: string;      // Full Cloudinary URL
  key: string;      // Cloudinary public_id (used for deletion)
}
```

### Category Model
```typescript
categoryImage: {
  url: string;      // e.g., "https://res.cloudinary.com/demo/image/upload/v123/ByeNext/categories/abc.jpg"
  key: string;      // e.g., "ByeNext/categories/abc"
}
```

### Product Model
```typescript
images: [
  {
    url: string;
    key: string;
  }
]
```

## Migration from Local Storage

### What Changed?

1. **File Storage**: Images are now stored on Cloudinary instead of the local file system
2. **File References**: Database stores Cloudinary `public_id` instead of local file paths
3. **Image Deletion**: Images are deleted from Cloudinary when database records are deleted
4. **Image Access**: Images are accessed via Cloudinary CDN URLs

### Benefits

1. **Scalability**: No server disk space concerns
2. **Performance**: Global CDN delivers images faster
3. **Optimization**: Automatic image optimization and format conversion
4. **Transformations**: On-the-fly image resizing, cropping, and effects
5. **Reliability**: Built-in backup and redundancy

## Controllers to Update

The following controllers should be updated to use Cloudinary (follow the same pattern as Category and Product):

### ✅ Completed
- [x] `src/services/category.service.ts`
- [x] `src/services/product.service.ts`

### 🔄 Need Updates
- [ ] Banner controller/service
- [ ] User profile controller/service
- [ ] Reel controller/service
- [ ] Any other image upload endpoints

## Best Practices

### 1. Always Delete Old Images
```typescript
// When updating, delete old image first
if (oldImageKey) {
  await deleteImage(oldImageKey);
}
```

### 2. Handle Upload Failures
```typescript
try {
  const uploadResult = await uploadImage(buffer, 'products');
  // Save to database
} catch (error) {
  // Handle error, don't save to database if upload fails
  throw new APIError('Image upload failed', 500);
}
```

### 3. Use Proper Folder Organization
```typescript
// Good: Organized by feature
uploadImage(buffer, 'products')
uploadImage(buffer, 'categories')

// Bad: Everything in one folder
uploadImage(buffer, 'uploads')
```

### 4. Validate Before Upload
```typescript
// Check file type
if (!file.mimetype.startsWith('image/')) {
  throw new APIError('Only images allowed', 400);
}

// Check file size
if (file.size > 5 * 1024 * 1024) {
  throw new APIError('File too large', 400);
}
```

## Image Transformations

You can generate optimized URLs using the `getImageUrl` function:

```typescript
import { getImageUrl } from '../utils/cloudinary.util';

// Original image
const originalUrl = image.url;

// Thumbnail (200x200, cropped)
const thumbnail = getImageUrl(image.key, {
  width: 200,
  height: 200,
  crop: 'fill'
});

// Optimized (auto quality and format)
const optimized = getImageUrl(image.key, {
  quality: 'auto',
  format: 'auto'
});

// Responsive image
const responsive = getImageUrl(image.key, {
  width: 800,
  quality: 'auto:good',
  format: 'webp'
});
```

## Troubleshooting

### Error: "Invalid cloudinary credentials"
- Check your environment variables are set correctly
- Verify credentials on Cloudinary dashboard
- Ensure `.env` file is loaded properly

### Error: "Upload failed"
- Check your upload preset settings on Cloudinary
- Verify file size limits
- Check network connectivity

### Images not deleting
- Verify the `public_id` is stored correctly in database
- Check Cloudinary API permissions
- Ensure the image exists in Cloudinary dashboard

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Support

For questions or issues:
1. Check the Cloudinary documentation
2. Review this guide
3. Check console logs for error details
4. Verify environment variables
