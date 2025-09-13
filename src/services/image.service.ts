import imageRepository from "./../ repository/image.repository";
import { IImage, IImageUpdate } from "../types/image.type";
import APIError from "./../error/api-error";
import { IFilter, IPaginated } from "./../types/common.types";
import { deleteImage } from "./../utils/delete";


class ImageService {
  async create(data: IImage): Promise<IImage> {
    try {
      const response = await imageRepository.create(data);

      if (!response) {
        throw new APIError("Error creating Images", 500);
      }

      return response;
    } catch (error: any | unknown) {
      if (error instanceof APIError) {
        throw error;
      }

      throw error;
    }
  }

  async getOne(id: string): Promise<IImage | null> {
    try {
      const response = await imageRepository.getById(id);
      if (!response) {
        throw new APIError(`Images with ID ${id} not found.`);
      }
      return response;
    } catch (error: any | unknown) {
      if (error instanceof APIError) {
        throw error;
      }

      throw error;
    }
  }

  async getAll(filter: IFilter): Promise<{
    data: IImage[];
    pagination: IPaginated;
  }> {
    let response = await imageRepository.getAll();

    const { page = 1, limit = 10 } = filter;
    const totalRecord = response.length;
    const totalPage = Math.ceil(totalRecord / limit);

    response = response.slice((page - 1) * limit, page * limit);
    return {
      data: response,
      pagination: {
        page,
        limit,
        totalRecord,
        totalPage,
      },
    };
  }

  async update(
    id: string,
    update: Partial<IImageUpdate>
  ): Promise<IImage | null> {
    try {
      const exitingImages = await imageRepository.getById(id);
      if (!exitingImages) {
        throw new APIError(`Images with ID ${id} not found.`);
      }



      if (exitingImages.key) {
        deleteImage(exitingImages.key, 'images');
      }

      exitingImages.updatedAt = new Date();
      return{}
      // return imageRepository.updateById(id, update);
    } catch (error: unknown | any) {
      if (error instanceof APIError) {
        throw error;
      }

      throw error;
    }
  }

  async delete(id: string): Promise<{
    message: string;
    status: number;
  }> {
    try {
      const response = await imageRepository.getById(id);
      if (!response) {
        throw new APIError(`Images with ID ${id} not found.`);
      }
      if (response.key) {
        deleteImage(response.key, 'images');
      }


      return imageRepository.deleteById(id);
    } catch (error: unknown | any) {
      if (error instanceof APIError) {
        throw error;
      }

      throw error;
    }
  }
}

export default new ImageService();