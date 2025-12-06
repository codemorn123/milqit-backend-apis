import { IKisanCommunity } from './../../../types/kisan-community.types';
import KisanCommunityModel from './../../../models/cms/kisan-community.model';
import APIError from './../../../error/api-error';
import { BaseService } from '../../base.service';
import fileService from './../../../services/custom-file.service';
import { KISAN_COMMUNITY_IMAGES_PATH } from '../../../constants/file-paths';

class KisanCommunityService extends BaseService<IKisanCommunity> {
  constructor() {
    super(KisanCommunityModel as any, ['farmerName', 'farmName', 'products']);
  }

  public async create(data: Partial<IKisanCommunity>, file?: Express.Multer.File): Promise<IKisanCommunity> {
    const payload: Partial<IKisanCommunity> = { ...data };
    if (!file) {
      throw new APIError('Profile image is required.', 400);
    }
    const { url, key } = await fileService.saveFile(file, KISAN_COMMUNITY_IMAGES_PATH);
    payload.profileImage = { url, key };
    return super.create(payload);
  }

  // getAll handled by BaseService

  // getOne handled by BaseService

  public async update(
    id: string,
    updateData: Partial<IKisanCommunity>,
    file?: Express.Multer.File
  ): Promise<IKisanCommunity> {
    const member = await KisanCommunityModel.findById(id);
    if (!member) {
      throw new APIError(`Kisan Community member not found.`, 404);
    }

    const payload: Partial<IKisanCommunity> = { ...updateData };

    if (file) {
      if (member.profileImage?.key) {
        await fileService.deleteFile(member.profileImage.key, KISAN_COMMUNITY_IMAGES_PATH);
      }
      const { url, key } = await fileService.saveFile(file, KISAN_COMMUNITY_IMAGES_PATH);
      payload.profileImage = { url, key };
    }

    return super.update(id, payload);
  }

  public async delete(id: string): Promise<{ message: string; status: number }> {
    const member = await KisanCommunityModel.findById(id);
    if (!member) {
      throw new APIError(`Kisan Community member not found.`, 404);
    }

    if (member.profileImage?.key) {
      await fileService.deleteFile(member.profileImage.key, KISAN_COMMUNITY_IMAGES_PATH);
    }
    return super.delete(id);
  }
}

export default new KisanCommunityService();