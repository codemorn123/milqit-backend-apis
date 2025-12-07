import {
    Route,
    Tags,
    Controller,
    Get,
    SuccessResponse
} from 'tsoa';
import settingsService from './../../services/admin/setting/settings.service';
import { ISettings } from './../../types/settings.types';
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';

@Route("customer/settings")
@Tags("Customer Settings")
export class CustomerSettingsController extends Controller {

    /**
     * Retrieve application settings (splash screen, maintenance mode, etc.)
     */
    @Get("/")
    @SuccessResponse(200, "Success")
    public async getSettings(): Promise<SuccessDataResponse<Partial<ISettings>>> {
        const result = await settingsService.getSettings();
        return success(result, 'Settings fetched successfully');
    }
}
