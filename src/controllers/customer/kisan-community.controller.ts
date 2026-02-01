import {
    Route,
    Tags,
    Get,
    Queries,
    SuccessResponse,
    Path,
    Response,
    Middlewares,
    Example
} from 'tsoa';
import kisanCommunityService from './../../services/admin/cms/kisan-community.service';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { IKisanCommunity } from './../../types/kisan-community.types';
import { SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { filterQuerySchema, idParamSchema } from './../../validations/kisan-community.validator';
import { StatusCodes } from 'http-status-codes';

import { BaseController } from '../base.controller';

@Route("customer/kisan-community")
@Tags("Customer Kisan Community")
export class CustomerKisanCommunityController extends BaseController {

    /**
     * Retrieve a paginated list of Kisan Community members.
     * @param queryParams Filter and pagination parameters
     */
    @Get("/")
    @SuccessResponse(200, "Success")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error")
    @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
    @Example({
        queryParams: {
            page: 1,
            limit: 10
        }
    })
    public async getAll(
        @Queries() queryParams: IFilter
    ): Promise<SuccessDataResponse<PaginatedResponse<IKisanCommunity>>> {
        const result = await kisanCommunityService.getAll(queryParams);
        return this.sendPaginated(result, 'Kisan community members fetched successfully');
    }

    /**
     * Retrieve details of a specific Kisan Community member by ID.
     * @param id The unique ID of the member
     */
    @Get("/{id}")
    @SuccessResponse(200, "Success")
    @Response(StatusCodes.NOT_FOUND, "Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
    @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
    public async getById(@Path() id: string): Promise<SuccessDataResponse<IKisanCommunity>> {
        const result = await kisanCommunityService.getOne(id);
        return this.sendSuccess(result, 'Kisan community member details fetched successfully');
    }
}
