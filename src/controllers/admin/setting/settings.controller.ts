import { validateSchemaMiddleware } from './../../../middleware/common-validate';
import settingsService from './../../../services/admin/setting/settings.service';
import { ISettings } from './../../../types/settings.types';
import { SuccessResponse as SuccessResponseTags,success } from './../../../utils/SuccessResponse';
import { updateSettingsSchema } from './../../../validations/settings.validator';
import {
    Route,
    Tags,
    Controller,
    Put,
    Body,
    Middlewares,

    Response,
    Security,
    SuccessResponse
  } from 'tsoa';

  
  @Route("admin/settings")
  @Tags("Admin Settings")
  @Security("jwt") // Assuming you have JWT security middleware
  export class AdminSettingsController extends Controller {
  
    @Put("/")
    @SuccessResponse(200, "Success")
    @Response(400, "Validation Failed")
    @Middlewares(validateSchemaMiddleware(updateSettingsSchema))
    public async updateSettings(
      @Body() requestBody: Partial<ISettings>
    ): Promise<SuccessResponseTags<ISettings>> {
      const result = await settingsService.updateSettings(requestBody);
      return success(result, 'Application settings updated successfully');
    }
  }