import imageModel from "./../models/image.model";
import { IImage, IImageUpdate } from "./../types/image.type";
import { StatusCode } from "./../utils/status-code";
import { Model } from "mongoose";


class ImageRepository {
  private model: Model<IImage>;

  constructor(model: Model<IImage>) {
    this.model = model;
  }

  async create(data: IImage): Promise<IImage> {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error: any | unknown) {
      console.error("Error creating image:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<IImage | null> {
    try {
      const response = await this.model.findById(id).exec();

      return response;
    } catch (error: any | unknown) {
      console.error("Error finding image by ID:", error);
      throw error;
    }
  }

  async getAll(): Promise<IImage[]> {
    try {
      return await this.model.find().exec();
    } catch (error: any | unknown) {
      console.error("Error finding all images:", error);
      throw error;
    }
  }

  async updateById(
    id: string,
    update: Partial<IImageUpdate>
  ): Promise<IImage | null> {
    try {
      return await this.model
        .findByIdAndUpdate(id, update, { new: true })
        .exec();
    } catch (error: any | unknown) {
      console.error("Error updating image:", error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<{
    message: string;
    status: number;
  }> {
    try {
      await this.model.findByIdAndDelete(id).exec();
      return {
        message: `Images with Id ${id} deleted successfully`,
        status: StatusCode.NoContent,
      };
    } catch (error: any | unknown) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }
}

const imageRepository = new ImageRepository(imageModel);
export default imageRepository;