import {
    Route,
    Tags,
    Controller,
    Get,
    SuccessResponse,
    Response
} from 'tsoa';
import settingsService from './../../services/admin/setting/settings.service';
import { ISettings } from './../../types/settings.types';
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import { StatusCodes } from 'http-status-codes';

@Route("customer/settings")
@Tags("Customer Settings")
export class CustomerSettingsController extends Controller {

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
