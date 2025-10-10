import {
    Route,
    Tags,
    Controller,
    Get,
    SuccessResponse
  } from 'tsoa';
  import { ISettings } from '../../types/settings.types';
import settingsService from '../../services/admin/setting/settings.service';
;
  
  @Route("settings")
  @Tags("Public Settings")
  export class PublicSettingsController extends Controller {
  
    @Get("/")
    @SuccessResponse(200, "Success")
    public async getSettings(): Promise<Partial<ISettings>> {
      return settingsService.getSettings();
    }
  }