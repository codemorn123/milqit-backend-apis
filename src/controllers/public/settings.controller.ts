import {
  Route,
  Tags,
  Controller,
  Get,
  SuccessResponse
} from 'tsoa';
import { ISettings } from '../../types/settings.types';
import settingsService from '../../services/admin/setting/settings.service';
import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
import { StatusCodes } from 'http-status-codes';

@Route("settings")
@Tags("Public Settings")
export class PublicSettingsController extends Controller {

  @Get("/")
  @SuccessResponse(StatusCodes.OK, "Success")
  public async getSettings(): Promise<SuccessDataResponse<Partial<ISettings>>> {
    const result = await settingsService.getSettings();
    return success(result, "Settings fetched successfully");
  }
}