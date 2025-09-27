// src/services/file.service.ts

import fs from 'fs/promises';
import path from 'path';
const UPLOADS_BASE_PATH = path.resolve(__dirname, '..', '..', 'uploads');
interface FileResult {
  url: string;
  key: string;
}

class CustomFileService {
  /**
   * Saves a file buffer to a specified local disk location.
   * This method is dynamic and can be used for any feature.
   *
   * @param file The file object from Multer (containing the buffer).
   * @param destinationPath The relative path where the file should be saved (e.g., 'uploads/posts/images').
   * @returns A promise that resolves to the public URL and key (filename) of the saved file.
   */
  public async saveFile(
    file: Express.Multer.File,
    destinationPath: string
  ): Promise<{ url: string; key: string }> {
    // 1. Ensure the dynamic destination directory exists.
    await fs.mkdir(destinationPath, { recursive: true });

    // 2. Create a unique filename to avoid collisions.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;

    // 3. Define the full path for saving the file.
    const fullPath = path.join(destinationPath, filename);

    // 4. Write the buffer to the disk.
    await fs.writeFile(fullPath, file.buffer);

    // 5. Return the public-facing URL and the key for database storage.
    return {
      url: `/${destinationPath}/${filename}`,
      key: filename,
    };
  }



  public async saveMultipleFiles(
    files: Express.Multer.File[],
    destinationPath: string
  ): Promise<Array<{ url: string; key: string }>> {
    if (!files || files.length === 0) {
      return [];
    }

    // Ensure the destination directory exists
    await fs.mkdir(destinationPath, { recursive: true });

    // Process all files concurrently for better performance
    const filePromises = files.map(async (file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const filename = file.fieldname + '-' + uniqueSuffix + extension;
      const fullPath = path.join(destinationPath, filename);

      await fs.writeFile(fullPath, file.buffer);

      return {
        url: `/${destinationPath}/${filename}`,
        key: filename,
      };
    });

    return Promise.all(filePromises);
  }


  public async saveMultipleFilesWithValidation(
    files: Express.Multer.File[],
    destinationPath: string,
    options: {
      maxFiles?: number;
      maxFileSize?: number; // in bytes
      allowedExtensions?: string[];
      requiredFiles?: number;
    } = {}
  ): Promise<FileResult[]> {
    const {
      maxFiles = 10,
      maxFileSize = 5 * 1024 * 1024, // 5MB default
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      requiredFiles = 1
    } = options;

    // Validation checks
    if (!files || files.length === 0) {
      if (requiredFiles > 0) {
        throw new Error(`At least ${requiredFiles} file(s) required`);
      }
      return [];
    }

    if (files.length < requiredFiles) {
      throw new Error(`At least ${requiredFiles} file(s) required, got ${files.length}`);
    }

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed, got ${files.length}`);
    }

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        throw new Error(`File ${file.originalname} exceeds maximum size of ${maxFileSize / (1024 * 1024)}MB`);
      }

      // Check file extension
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new Error(`File ${file.originalname} has invalid extension. Allowed: ${allowedExtensions.join(', ')}`);
      }
    }

    // Save files if validation passes
    return await this.saveMultipleFiles(files, destinationPath);
  }



  public async deleteMultipleFiles(keys: string[], destinationPath: string): Promise<void> {
    if (!keys || keys.length === 0) {
      return;
    }

    const deletePromises = keys.map(key => this.deleteFile(key, destinationPath));
    await Promise.all(deletePromises);
  }

  /**
   * Replace existing files with new ones (delete old, save new)
   * @param oldKeys Array of old file keys to delete
   * @param newFiles Array of new files to save
   * @param destinationPath Path where files are stored
   */
  public async replaceFiles(
    oldKeys: string[],
    newFiles: Express.Multer.File[],
    destinationPath: string
  ): Promise<Array<{ url: string; key: string }>> {
    // Delete old files (don't wait for completion to speed up the process)
    if (oldKeys && oldKeys.length > 0) {
      this.deleteMultipleFiles(oldKeys, destinationPath).catch(err => 
        console.error('Error deleting old files:', err)
      );
    }

    // Save new files
    return this.saveMultipleFiles(newFiles, destinationPath);
  }

  public async deleteFile(key: string, destinationPath: string): Promise<void> {
    try {
      const fullPath = path.join(destinationPath, key);
      await fs.unlink(fullPath);
    } catch (err: any) {
      // It's safe to ignore "file not found" errors, as the file might have already been deleted.
      if (err.code !== 'ENOENT') {
        console.error(`Error deleting file: ${path.join(destinationPath, key)}`, err);
      }
    }
  }


  // public async deleteDirectory(directoryName: string): Promise<void> {
  //   try {
  //     // 1. Resolve the absolute path of the directory to be deleted.
  //     const absolutePathToDelete = path.resolve(UPLOADS_BASE_PATH, directoryName);

  //     // 2. ✅ CRITICAL SAFETY CHECK: Ensure the path is within our safe base directory.
  //     // This prevents path traversal attacks like `../../etc`.
  //     if (!absolutePathToDelete.startsWith(UPLOADS_BASE_PATH)) {
  //       console.error(`DANGEROUS OPERATION BLOCKED: Attempt to delete directory outside of the safe path. Target: ${absolutePathToDelete}`);
  //       throw new Error('Access denied: Path is outside of the allowed directory.');
  //     }

  //     // 3. ✅ CRITICAL SAFETY CHECK: Prevent deleting the root uploads folder itself.
  //     if (absolutePathToDelete === UPLOADS_BASE_PATH) {
  //       console.error(`DANGEROUS OPERATION BLOCKED: Attempt to delete the root uploads directory.`);
  //       throw new Error('Access denied: Cannot delete the base uploads directory.');
  //     }

  //     console.log(`Attempting to delete directory: ${absolutePathToDelete}`);

  //     // 4. Perform the deletion using fs.rm
  //     // - `recursive: true`: Deletes the directory and all its contents.
  //     // - `force: true`: Suppresses errors if the directory doesn't exist.
  //     await fs.rm(absolutePathToDelete, { recursive: true, force: true });
      
  //     console.log(`Successfully deleted directory: ${directoryName}`);

  //   } catch (err: any) {
  //     // Catch and log any unexpected errors that aren't handled by `force: true`.
  //     console.error(`Error deleting directory '${directoryName}':`, err);
  //     throw err; // Re-throw the error to be handled by the global error handler.
  //   }
  // }



  public async deleteDirectory(directoryName: string): Promise<void> {
    try {
      // 1. Resolve the absolute path of the directory to be deleted.
      const absolutePathToDelete = path.resolve(UPLOADS_BASE_PATH, directoryName);

      // 2. ✅ CRITICAL SAFETY CHECK: Ensure the path is within our safe base directory.
      if (!absolutePathToDelete.startsWith(UPLOADS_BASE_PATH)) {
        console.error(`DANGEROUS OPERATION BLOCKED: Attempt to delete directory outside of the safe path. Target: ${absolutePathToDelete}`);
        throw new Error('Access denied: Path is outside of the allowed directory.');
      }

      // 3. ✅ CRITICAL SAFETY CHECK: Prevent deleting the root uploads folder itself.
      if (absolutePathToDelete === UPLOADS_BASE_PATH) {
        console.error(`DANGEROUS OPERATION BLOCKED: Attempt to delete the root uploads directory.`);
        throw new Error('Access denied: Cannot delete the base uploads directory.');
      }

      console.log(`Attempting to delete directory: ${absolutePathToDelete}`);

      await fs.rm(absolutePathToDelete, { recursive: true, force: true });
      
      console.log(`Successfully deleted directory: ${directoryName}`);

    } catch (err: any) {
      console.error(`Error deleting directory '${directoryName}':`, err);
      throw err;
    }
  }


  public async getFileInfo(key: string, destinationPath: string): Promise<{
    exists: boolean;
    size?: number;
    createdAt?: Date;
    extension?: string;
  }> {
    try {
      const fullPath = path.join(destinationPath, key);
      const stats = await fs.stat(fullPath);
      
      return {
        exists: true,
        size: stats.size,
        createdAt: stats.birthtime,
        extension: path.extname(key)
      };
    } catch (error) {
      return { exists: false };
    }
  }

  /**
   * Create directory if it doesn't exist
   * @param directoryPath Path to create
   */
  public async ensureDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath, { recursive: true });
    } catch (error) {
      console.error(`❌ Error creating directory ${directoryPath}:`, error);
      throw error;
    }
  }
  
}





export default new CustomFileService();