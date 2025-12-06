import { validateSchemaMiddleware } from './../../../middleware/common-validate';
import settingsService from './../../../services/admin/setting/settings.service';
import { ISettings } from './../../../types/settings.types';
import { SuccessResponse as SuccessDataResponse, success } from './../../../utils/SuccessResponse';
import { updateSettingsSchema } from './../../../validations/settings.validator';
import {
  Route,
  Tags,
  Controller,
  Put,
  Body,
  Middlewares,
  Security,
  SuccessResponse
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';


@Route("admin/settings")
@Tags("ADMIN: Settings")
@Security("jwt")
export class AdminSettingsController extends Controller {

  @Put("/")
  @SuccessResponse(StatusCodes.OK, "Success")
  @Middlewares(validateSchemaMiddleware(updateSettingsSchema))
  public async updateSettings(
    @Body() requestBody: Partial<ISettings>
  ): Promise<SuccessDataResponse<ISettings>> {
    const result = await settingsService.updateSettings(requestBody);
    return success(result, 'Application settings updated successfully');
  }
}