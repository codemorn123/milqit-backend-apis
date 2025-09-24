// src/services/file.service.ts

import fs from 'fs/promises';
import path from 'path';

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

  /**
   * Deletes a file from a specified local disk location.
   *
   * @param key The filename (key) of the file to delete.
   * @param destinationPath The relative path where the file is located (e.g., 'uploads/posts/images').
   * @returns A promise that resolves when the operation is complete.
   */
  public async deleteFile(key: string, destinationPath: string): Promise<void> {
    try {
      // 1. Construct the full path to the file.
      const fullPath = path.join(destinationPath, key);

      // 2. Delete the file from the filesystem.
      await fs.unlink(fullPath);
    } catch (err: any) {
      // It's safe to ignore "file not found" errors, as the file might have already been deleted.
      if (err.code !== 'ENOENT') {
        console.error(`Error deleting file: ${path.join(destinationPath, key)}`, err);
      }
    }
  }
}

export default new CustomFileService();