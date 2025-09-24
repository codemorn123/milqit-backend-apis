// src/services/file.service.ts

import fs from 'fs/promises';
import path from 'path';

class FileService {
  private destinationPath = 'uploads/kisan-community/images';

  constructor() {
    // Ensure the destination directory exists
    fs.mkdir(this.destinationPath, { recursive: true });
  }

  /**
   * Saves a file buffer to the local disk.
   * @param file The file object containing the buffer.
   * @returns The public URL and key (filename) of the saved file.
   */
  public async saveFile(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const filename = 'kisan-' + uniqueSuffix + extension;
    const fullPath = path.join(this.destinationPath, filename);

    await fs.writeFile(fullPath, file.buffer);

    return {
      url: `/${this.destinationPath}/${filename}`,
      key: filename,
    };
  }

  /**
   * Deletes a file from the local disk.
   * @param key The filename (key) of the file to delete.
   */
  public async deleteFile(key: string): Promise<void> {
    try {
      const fullPath = path.join(this.destinationPath, key);
      await fs.unlink(fullPath);
    } catch (err) {
      console.error(`Failed to delete file: ${key}`, err);
    }
  }
}

export default new FileService();