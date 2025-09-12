import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

// Get the images directory path
const getImagesDirectory = (): string => {
  return path.join(process.cwd(), 'uploads', 'images');
};

// Ensure directory exists
const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
};

// Get full file path
const getFilePath = (filename: string): string => {
  const imagesDir = getImagesDirectory();
  return path.join(imagesDir, filename);
};

// Check if file exists
export const fileExists = async (filename: string): Promise<boolean> => {
  try {
    const filePath = getFilePath(filename);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Delete image from filesystem
export const deleteImage = async (filename: string): Promise<{ message: string }> => {
  if (!filename) {
    throw new Error("No filename provided for deletion.");
  }

  const imagesDir = getImagesDirectory();
  await ensureDirectoryExists(imagesDir);
  
  const filePath = getFilePath(filename);
  
  console.log(`🗑️ Attempting to delete: ${filePath}`);

  try {
    // Check if file exists first
    const exists = await fileExists(filename);
    if (!exists) {
      console.log(`⚠️ File not found: ${filePath}`);
      return { message: "File not found (already deleted)." };
    }

    // Delete the file
    await fs.unlink(filePath);
    console.log(`✅ Successfully deleted: ${filePath}`);
    return { message: "Image deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get file info
export const getFileInfo = async (filename: string) => {
  const filePath = getFilePath(filename);
  try {
    const stats = await fs.stat(filePath);
    return {
      filename,
      path: filePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      filename,
      path: filePath,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Clean up orphaned files (files not in database)
export const cleanupOrphanedFiles = async (validFilenames: string[]): Promise<string[]> => {
  const imagesDir = getImagesDirectory();
  const deletedFiles: string[] = [];
  
  try {
    const files = await fs.readdir(imagesDir);
    
    for (const file of files) {
      // Skip hidden files and directories
      if (file.startsWith('.') || file.startsWith('test')) continue;
      
      if (!validFilenames.includes(file)) {
        try {
          await fs.unlink(path.join(imagesDir, file));
          deletedFiles.push(file);
          console.log(`🧹 Cleaned up orphaned file: ${file}`);
        } catch (error) {
          console.error(`❌ Error deleting orphaned file ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
  
  return deletedFiles;
};

// Generate public URL for image
export const getImageUrl = (filename: string): string => {
  return `/uploads/images/${filename}`;
};

export { getImagesDirectory, getFilePath };