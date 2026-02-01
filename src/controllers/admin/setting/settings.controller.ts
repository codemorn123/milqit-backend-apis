import { validateSchemaMiddleware } from '../../../middleware/common-validate';
import settingsService from '../../../services/admin/setting/settings.service';
import { ISettings } from '../../../types/settings.types';
import { SuccessResponse as SuccessDataResponse, } from '../../../utils/SuccessResponse';
import { updateSettingsSchema } from '../../../validations/settings.validator';
import {
  Route,
  Tags,
  Put,
  Get,
  Body,
  Middlewares,
  Security,
  SuccessResponse
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';


import { BaseController } from '../../base.controller';

@Route("admin/settings")
@Tags("ADMIN: Settings")
@Security("jwt")
export class AdminSettingsController extends BaseController {

  @Put("/")
  @SuccessResponse(StatusCodes.OK, "Success")
  @Middlewares(validateSchemaMiddleware(updateSettingsSchema))
  public async updateSettings(
    @Body() requestBody: Partial<ISettings>
  ): Promise<SuccessDataResponse<ISettings>> {
    const result = await settingsService.updateSettings(requestBody);
    return this.sendSuccess(result, 'Application settings updated successfully');
  }

  /**
   * Get application settings
   */
  @Get("/")
  @SuccessResponse(StatusCodes.OK, "Success")
  public async getSettings(): Promise<SuccessDataResponse<Partial<ISettings>>> {
    const result = await settingsService.getSettings();
    return this.sendSuccess(result, 'Application settings retrieved successfully');
  }
}