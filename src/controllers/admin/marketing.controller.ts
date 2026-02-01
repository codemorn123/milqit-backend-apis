import {
    Route,
    Tags,
    Post,
    Get,
    Body,
    Middlewares,
    Security,
    SuccessResponse,
    Queries
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { marketingService } from '../../services/marketing.service';
import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { IMarketingCampaign } from '../../models/marketing.model';

import { BaseController } from '../base.controller';

@Route("admin/marketing")
@Tags("ADMIN: Marketing")
@Security("jwt")
export class AdminMarketingController extends BaseController {

    /**
     * Create a new marketing campaign
     */
    @Post("/")
    @SuccessResponse(StatusCodes.CREATED, "Created")
    @Middlewares([jwtAuthMiddleware])
    public async createCampaign(
        @Body() body: {
            title: string;
            message: string;
            imageUrl?: string;
            context?: string;
            scheduleTime: Date;
        }
    ): Promise<SuccessDataResponse<IMarketingCampaign>> {
        const result = await marketingService.createCampaign(body);
        this.setStatus(StatusCodes.CREATED);
        return success(result, "Marketing campaign scheduled successfully");
    }

    /**
     * List marketing campaigns
     */
    @Get("/")
    @SuccessResponse(StatusCodes.OK, "Success")
    @Middlewares([jwtAuthMiddleware])
    public async getCampaigns(
        @Queries() query: IFilter
    ): Promise<SuccessDataResponse<PaginatedResponse<IMarketingCampaign>>> {
        const result = await marketingService.getCampaigns(query);
        return success(result, "Campaigns fetched successfully");
    }
}
