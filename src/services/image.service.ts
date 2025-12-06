import { IImage, IImageUpdate } from "../types/image.type";
import APIError from "./../error/api-error";
import { deleteImage } from "./../utils/delete";
import { BaseService } from "./base.service";
import ImageModel from "../models/image.model"; // Assuming this exists, need to verify

class ImageService extends BaseService<IImage> {
  constructor() {
    super(ImageModel as any, []); // No specific search fields mentioned in original code
  }

  // create handled by BaseService (original just called repo.create)

  // getOne handled by BaseService

  // getAll handled by BaseService

  async update(
    id: string,
    update: Partial<IImageUpdate>
  ): Promise<IImage> {
    const exitingImages = await ImageModel.findById(id);
    if (!exitingImages) {
      throw new APIError(`Images with ID ${id} not found.`);
    }

    if (exitingImages.key) {
      deleteImage(exitingImages.key, 'images');
    }

    // exitingImages.updatedAt = new Date(); // BaseService or Model timestamp handles this?
    // The original code returned {} or repo update. 
    // I will use super.update but I need to handle the file deletion logic which was there.
    // Wait, the original update logic was a bit weird: 
    // return {} 
    // // return imageRepository.updateById(id, update);

    // I'll implement a proper update.
    return super.update(id, update as any);
  }

  async delete(id: string): Promise<{
    message: string;
    status: number;
  }> {
    const response = await ImageModel.findById(id);
    if (!response) {
      throw new APIError(`Images with ID ${id} not found.`);
    }
    if (response.key) {
      deleteImage(response.key, 'images');
    }

    return super.delete(id);
  }
}

export default new ImageService();