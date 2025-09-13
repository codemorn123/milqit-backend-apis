// // import fs from "fs/promises";
// // import path from "path";

// // // Function to delete an image from the local filesystem
// // export const deleteImage = async (filename: string) => {
// //   if (!filename) {
// //     throw new Error("No filename provided for deletion.");
// //   }

// //   // Adjust this to your actual uploads directory
// //   const uploadDir = path.join(__dirname, "uploads");
// //   const filePath = path.join(uploadDir, filename);

// //   try {
// //     await fs.unlink(filePath);
// //     return { message: "Image deleted successfully." };
// //   } catch (error) {
// //     // File not found or other error
// //     console.error("Error deleting image:", error);
// //     throw new Error("Failed to delete image.");
// //   }
// // };


// import fs from "fs/promises";
// import path from "path";

// /**
//  * Delete an image from the filesystem
//  * @param filename - The filename to delete
//  * @param directory - Optional subdirectory (defaults to 'images')
//  */
// export const deleteImage = async (
//   filename: string, 
//   directory: string = 'images'
// ): Promise<{ message: string }> => {
//   if (!filename) {
//     console.warn("⚠️ No filename provided for deletion");
//     throw new Error("No filename provided for deletion");
//   }

//   try {
//     // Build the correct path using process.cwd() instead of __dirname
//     // const uploadDir = path.join(process.cwd(), 'uploads', directory);

//     const uploadDir = path.join(process.cwd(), 'uploads');
//     const categories = path.join(uploadDir, 'categories');
//     const imagesDir = path.join(categories, 'images');

//     const filePath = path.join(imagesDir, filename);

//     console.log(`🗑️ Attempting to delete file: ${filePath}`);

//     // Check if file exists before trying to delete
//     try {
//       await fs.access(filePath);
//       console.log(`✅ File exists, proceeding with deletion: ${filename}`);
//     } catch (accessError) {
//       console.warn(`⚠️ File not found: ${filePath}`);
//       // Don't throw error if file doesn't exist - it's already "deleted"
//       return { message: "File not found (already deleted or never existed)" };
//     }

//     // Delete the file
//     await fs.unlink(filePath);
//     console.log(`✅ File deleted successfully: ${filename}`);
    
//     return { message: "Image deleted successfully" };
    
//   } catch (error) {
//     console.error("❌ Error deleting image:", error);
//     throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// };


import fs from "fs/promises";
import path from "path";

/**
 * Get file directory based on file type or explicit directory
 */
const getFileDirectory = (filename: string, explicitDir?: string): string => {
  if (explicitDir) {
    return path.join(process.cwd(), 'uploads', explicitDir);
  }
  
  // Auto-detect based on filename pattern
  if (filename.includes('document-') || filename.endsWith('.pdf')) {
    return path.join(process.cwd(), 'uploads', 'documents');
  } else if (filename.includes('video-') || filename.includes('.mp4')) {
    return path.join(process.cwd(), 'uploads', 'videos');
  } else {
    return path.join(process.cwd(), 'uploads', 'images');
  }
};

/**
 * Delete a single file
 */
export const deleteFile = async (
  filename: string, 
  directory?: string
): Promise<{ success: boolean; message: string }> => {
  if (!filename) {
    console.warn("⚠️ No filename provided for deletion");
    return { success: false, message: "No filename provided" };
  }

  try {
    const targetDir = getFileDirectory(filename, directory);
    const filePath = path.join(targetDir, filename);

    console.log(`🗑️ Attempting to delete file: ${filePath}`);

    // Check if file exists
    try {
      await fs.access(filePath);
      console.log(`✅ File exists, proceeding with deletion: ${filename}`);
    } catch (accessError) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return { success: true, message: "File not found (already deleted)" };
    }

    // Delete the file
    await fs.unlink(filePath);
    console.log(`✅ File deleted successfully: ${filename}`);
    
    return { success: true, message: "File deleted successfully" };
    
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return { 
      success: false, 
      message: `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Delete file by full path
 */
export const deleteFileByPath = async (fullPath: string): Promise<{ success: boolean; message: string }> => {
  if (!fullPath) {
    console.warn("⚠️ No file path provided for deletion");
    return { success: false, message: "No file path provided" };
  }

  try {
    console.log(`🗑️ Attempting to delete file by path: ${fullPath}`);

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (accessError) {
      console.warn(`⚠️ File not found: ${fullPath}`);
      return { success: true, message: "File not found (already deleted)" };
    }

    // Delete the file
    await fs.unlink(fullPath);
    console.log(`✅ File deleted successfully: ${fullPath}`);
    
    return { success: true, message: "File deleted successfully" };
    
  } catch (error) {
    console.error("❌ Error deleting file by path:", error);
    return { 
      success: false, 
      message: `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Delete multiple files
 */
export const deleteMultipleFiles = async (
  filenames: string[], 
  directory?: string
): Promise<{
  totalFiles: number;
  deleted: number;
  failed: number;
  results: Array<{ filename: string; success: boolean; message: string }>;
}> => {
  console.log(`🗑️ Deleting ${filenames.length} files`);
  
  const results = {
    totalFiles: filenames.length,
    deleted: 0,
    failed: 0,
    results: [] as Array<{ filename: string; success: boolean; message: string }>
  };

  for (const filename of filenames) {
    const result = await deleteFile(filename, directory);
    
    if (result.success) {
      results.deleted++;
    } else {
      results.failed++;
    }
    
    results.results.push({
      filename,
      success: result.success,
      message: result.message
    });
    
    console.log(`${result.success ? '✅' : '❌'} ${filename}: ${result.message}`);
  }

  console.log(`📊 Deletion summary: ${results.deleted} deleted, ${results.failed} failed`);
  return results;
};

/**
 * Get file information
 */
export const getFileInfo = async (
  filename: string, 
  directory?: string
): Promise<{
  exists: boolean;
  path?: string;
  size?: number;
  modified?: Date;
  directory?: string;
}> => {
  if (!filename) {
    throw new Error("No filename provided");
  }

  try {
    const targetDir = getFileDirectory(filename, directory);
    const filePath = path.join(targetDir, filename);

    try {
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        path: filePath,
        size: stats.size,
        modified: stats.mtime,
        directory: targetDir
      };
    } catch (error) {
      return {
        exists: false,
        directory: targetDir
      };
    }
  } catch (error) {
    console.error("❌ Error getting file info:", error);
    throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Clean up orphaned files
 */
export const cleanupOrphanedFiles = async (
  validFilenames: string[], 
  directory: string = 'images'
): Promise<{
  scanned: number;
  cleaned: number;
  errors: number;
  cleanedFiles: string[];
  errorDetails: Array<{ filename: string; error: string }>;
}> => {
  try {
    const targetDir = path.join(process.cwd(), 'uploads', directory);
    console.log(`🧹 Cleaning orphaned files in: ${targetDir}`);
    
    // Get all files in the directory
    const allFiles = await fs.readdir(targetDir);
    console.log(`📁 Found ${allFiles.length} files in directory`);
    
    // Filter out files that are not in the valid list
    const orphanedFiles = allFiles.filter(filename => !validFilenames.includes(filename));
    console.log(`🗑️ Found ${orphanedFiles.length} orphaned files`);
    
    const result = {
      scanned: allFiles.length,
      cleaned: 0,
      errors: 0,
      cleanedFiles: [] as string[],
      errorDetails: [] as Array<{ filename: string; error: string }>
    };
    
    // Delete orphaned files
    for (const filename of orphanedFiles) {
      const deleteResult = await deleteFile(filename, directory);
      
      if (deleteResult.success) {
        result.cleaned++;
        result.cleanedFiles.push(filename);
        console.log(`✅ Cleaned orphaned file: ${filename}`);
      } else {
        result.errors++;
        result.errorDetails.push({
          filename,
          error: deleteResult.message
        });
        console.error(`❌ Failed to clean: ${filename} - ${deleteResult.message}`);
      }
    }
    
    console.log(`🧹 Cleanup completed: ${result.cleaned} cleaned, ${result.errors} errors`);
    return result;
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw new Error(`Failed to cleanup orphaned files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Legacy export for backward compatibility
export const deleteImage = deleteFile;


