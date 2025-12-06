import APIError from './../../error/api-error';
import Banner from './../../models/banner.model';
import { IBanner, IBannerCreatePayload } from './../../types/banner.types';
import { BaseService } from '../base.service';
import fs from 'fs/promises';
import path from 'path';

class BannerService extends BaseService<IBanner> {
  constructor() {
    super(Banner as any, ['title']);
  }

  public async create(
    payload: IBannerCreatePayload, // This payload now includes 'platform'
    file?: Express.Multer.File
  ): Promise<IBanner> {
    if (!file) {
      throw new APIError('Banner image is required.', 400);
    }
    const imageUrl = `/uploads/banners/${file.filename}`;
    // @ts-ignore
    return super.create({ ...payload, imageUrl });
  }

  // getAll is now handled by BaseService

  // getOne is now handled by BaseService

  public async delete(id: string): Promise<{ message: string; status: number }> {
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new APIError('Banner not found', 400);
    }
    try {
      await fs.unlink(path.join(__dirname, '..', '..', 'public', banner.imageUrl));
    } catch (error) {
      console.error('Error deleting banner image:', error);
    }

    return super.delete(id);
  }
}

export default new BannerService();