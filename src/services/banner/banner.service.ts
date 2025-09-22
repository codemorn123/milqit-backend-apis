import APIError from './../../error/api-error';
import Banner from './../../models/banner.model';
import { IBanner, IBannerCreatePayload, IBannerFilter } from './../../types/banner.types';
import { IPaginated } from './../../types/common.types';
import fs from 'fs/promises';
import path from 'path';


class BannerService {
  public async create(
    payload: IBannerCreatePayload, // This payload now includes 'platform'
    file: Express.Multer.File
  ): Promise<IBanner> {
    if (!file) {
      throw new APIError('Banner image is required.',400);
    }
    const imageUrl = `/uploads/banners/${file.filename}`;
    const newBanner = new Banner({ ...payload, imageUrl });
    return newBanner.save();
  }

  public async getAll(
    filters: IBannerFilter
  ): Promise<{ data: IBanner[]; pagination: IPaginated }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};
    // if (filters.type) {
    //   query.type = filters.type;
    // }
    if (filters.isActive) {
      query.isActive = filters.isActive === 'true';
    }
    // ADDED PLATFORM FILTERING LOGIC
    if (filters.platform) {
      query.platform = filters.platform;
    }

    const [data, total] = await Promise.all([
      Banner.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Banner.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        totalRecord: total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
  public async getOne(id: string): Promise<IBanner | null> {
    return Banner.findById(id).lean();
    
  }

  public async delete(id: string): Promise<{ message: string; status: number }> {
    const banner = await Banner.findById(id);
    if (!banner) {
    //   throw new ApiError('Banner not found', 400);
      throw new APIError('Banner not found',400);
    }
    await fs.unlink(path.join(__dirname, '..', '..', 'public', banner.imageUrl));
    // await banner.remove();
    await banner.deleteOne();
    return { message: 'Banner deleted successfully', status: 200 };
  }
  
  // No changes needed for getOne() or delete() methods
  // ... (getOne and delete methods remain the same)
//   public async getOne(id: string): Promise<IBanner> { /* ... */ }
//   public async delete(id: string): Promise<{ message: string; status: number }> { /* ... */ }

}
export default new BannerService();