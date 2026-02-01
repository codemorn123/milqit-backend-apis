import {
    Route,
    Tags,
    Controller,
    Get,
    Queries,
    SuccessResponse,
    Middlewares,
    Example,
    Response
} from 'tsoa';
import bannerService from './../../services/banner/banner.service';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { IBanner, IBannerFilter } from './../../types/banner.types';
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { bannerFilterSchema } from './../../validations/banner-validation-schemas';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../base.controller';

@Route("customer/banners")
@Tags("Customer Banners")
export class CustomerBannerController extends BaseController {

    /**
     * Retrieve a list of active banners.
     * @param queryParams Filter parameters (placement, purpose, platform)
     */
    @Get("/")
    @SuccessResponse(200, "Success")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error")
    @Middlewares(validateSchemaMiddleware(bannerFilterSchema, "query"))
    @Example({
        queryParams: {
            placement: 'HOME_HERO_CAROUSEL',
            isActive: 'true'
        }
    })
    public async getAll(
        @Queries() queryParams: IBannerFilter
    ): Promise<SuccessDataResponse<PaginatedResponse<IBanner>>> {
        // Force isActive=true for customers unless explicitly requested (though usually customers only see active)
        // But the service handles filtering based on queryParams.
        // We might want to enforce isActive=true here if the client doesn't send it.

        const filters = { ...queryParams };
        if (!filters.isActive) {
            filters.isActive = true;
        }

        const result = await bannerService.getAll(filters);
        return this.sendPaginated(result, 'Banners fetched successfully');
    }
}
