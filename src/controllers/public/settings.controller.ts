import {
  Route,
  Tags,
  Controller,
  Get,
  SuccessResponse,
  Response
} from 'tsoa';
import { ISettings } from './../../types/settings.types';
import settingsService from './../../services/admin/setting/settings.service';
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import { StatusCodes } from 'http-status-codes';

@Route("public/settings")
@Tags("Public Settings")
export class PublicSettingsController extends Controller {

  /**
   * Retrieve application settings (splash screen, maintenance mode, etc.)
   */
  @Get("/")
  @SuccessResponse(200, "Success")
  @Response(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error")
  public async getSettings(): Promise<SuccessDataResponse<Partial<ISettings>>> {
    const result = await settingsService.getSettings();
    return success(result, 'Settings fetched successfully');
  }
}