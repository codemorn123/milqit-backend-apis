// src/features/kisan-community/kisan-community.service.ts

import fs from 'fs/promises';
import path from 'path';
import { IKisanCommunity } from './../../../types/kisan-community.types';
import KisanCommunityModel from  './../../../models/cms/kisan-community.model';
import APIError  from './../../../error/api-error';
import { IFilter, IPaginated }  from './../../../types/common.types';
import fileService from './../../../services/custom-file.service';
import { KISAN_COMMUNITY_IMAGES_PATH } from '../../../constants/file-paths';

class KisanCommunityService {
  public async create(data: Partial<IKisanCommunity>, file?: Express.Multer.File): Promise<IKisanCommunity> {
    const payload: Partial<IKisanCommunity> = { ...data };

    if (!file) {
        throw new APIError('Profile image is required.', 400); // Throw a Bad Request error
      }
      const { url, key } = await fileService.saveFile(file, KISAN_COMMUNITY_IMAGES_PATH);
      payload.profileImage = { url, key };
    const newMember = await KisanCommunityModel.create(payload);
    return newMember.toObject();
  }

  public async getAll(queryParams: IFilter): Promise<{ data: IKisanCommunity[]; pagination: IPaginated }> {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const search = queryParams.search;

    const filter: any = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ farmerName: searchRegex }, { farmName: searchRegex }, { products: searchRegex }];
    }

    const totalRecords = await KisanCommunityModel.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await KisanCommunityModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IKisanCommunity[]>()
      .exec();

    return { data, pagination: { page, limit, totalRecord: totalRecords, totalPage: totalPages } };
  }

  public async getOne(id: string): Promise<IKisanCommunity> {
    const member = await KisanCommunityModel.findById(id).lean<IKisanCommunity>();
    if (!member) {
      throw new APIError(`Kisan Community member not found.`, 404);
    }
    return member;
  }

  public async update(
    id: string,
    updateData: Partial<IKisanCommunity>,
    file?: Express.Multer.File
  ): Promise<IKisanCommunity> { // 2. CORRECTED: Return DTO
    const member = await KisanCommunityModel.findById(id);
    if (!member) {
      throw new APIError(`Kisan Community member not found.`, 404);
    }

    const payload: Partial<IKisanCommunity> = { ...updateData };

    if (file) {
      if (member.profileImage?.key) {
        // 6. CORRECTED: Use the file service and constant path for deletion
        await fileService.deleteFile(member.profileImage.key, KISAN_COMMUNITY_IMAGES_PATH);
      }
      payload.profileImage = {
        url: `/${KISAN_COMMUNITY_IMAGES_PATH}/${file.filename}`,
        key: file.filename,
      };
    }

    const updatedMember = await KisanCommunityModel.findByIdAndUpdate(id, payload, { new: true }).lean<IKisanCommunity>(); // 4. CORRECTED: Use DTO type
    if (!updatedMember) {
      throw new APIError(`Failed to update Kisan Community member.`, 500);
    }
    return updatedMember;
  }

  /**
   * Deletes a Kisan Community member and their associated profile image.
   */
  public async delete(id: string): Promise<{ message: string }> {
    const member = await KisanCommunityModel.findByIdAndDelete(id);
    if (!member) {
      throw new APIError(`Kisan Community member not found.`, 404);
    }

    if (member.profileImage?.key) {
      // 6. CORRECTED: Use the file service and constant path for deletion
      await fileService.deleteFile(member.profileImage.key, KISAN_COMMUNITY_IMAGES_PATH);
    }
    return { message: `Member deleted successfully.` };
  }
}

//   public async update(id: string, updateData: Partial<IKisanCommunity>, file?: Express.Multer.File): Promise<IKisanCommunity> {
//     const member = await KisanCommunityModel.findById(id);
//     if (!member) {
//       throw new APIError(`Kisan Community member not found.`, 404);
//     }

//     const payload: Partial<IKisanCommunity> = { ...updateData };

//     if (file) {
//       // If a new file is uploaded, delete the old one from the disk
//       if (member.profileImage?.key) {
//         try {
//           const oldImagePath = path.join('uploads/kisan-community/images', member.profileImage.key);
//           await fs.unlink(oldImagePath);
//         } catch (err) {
//           console.error(`Failed to delete old image: ${member.profileImage.key}`, err);
//         }
//       }
//       payload.profileImage = {
//         url: `/uploads/kisan-community/images/${file.filename}`,
//         key: file.filename,
//       };
//     }

//     const updatedMember = await KisanCommunityModel.findByIdAndUpdate(id, payload, { new: true }).lean<IKisanCommunity>();
//     if (!updatedMember) {
//       throw new APIError(`Failed to update Kisan Community member.`, 500);
//     }
//     return updatedMember;
//   }

//   public async delete(id: string): Promise<{ message: string }> {
//     const member = await KisanCommunityModel.findByIdAndDelete(id);
//     if (!member) {
//       throw new APIError(`Kisan Community member not found.`, 404);
//     }

//     // Delete the associated image file from the disk
//     if (member.profileImage?.key) {
//       try {
//         const imagePath = path.join('uploads/kisan-community/images', member.profileImage.key);
//         await fs.unlink(imagePath);
//       } catch (err) {
//         console.error(`Failed to delete image on delete: ${member.profileImage.key}`, err);
//       }
//     }
//     return { message: `Member deleted successfully.` };
//   }


export default new KisanCommunityService();