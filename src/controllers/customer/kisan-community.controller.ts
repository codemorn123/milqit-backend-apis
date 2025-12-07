import {
    Route,
    Tags,
    Controller,
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
import { success, SuccessResponse as SuccessDataResponse } from './../../utils/SuccessResponse';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { filterQuerySchema, idParamSchema } from './../../validations/kisan-community.validator';

@Route("customer/kisan-community")
@Tags("Customer Kisan Community")
export class CustomerKisanCommunityController extends Controller {

    /**
     * Retrieve a paginated list of Kisan Community members.
     * @param queryParams Filter and pagination parameters
     */
    @Get("/")
    @SuccessResponse(200, "Success")
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
        return success(result, 'Kisan community members fetched successfully');
    }

    /**
     * Retrieve details of a specific Kisan Community member by ID.
     * @param id The unique ID of the member
     */
    @Get("/{id}")
    @SuccessResponse(200, "Success")
    @Response(404, "Not Found")
    @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
    public async getById(@Path() id: string): Promise<SuccessDataResponse<IKisanCommunity>> {
        const result = await kisanCommunityService.getOne(id);
        return success(result, 'Kisan community member details fetched successfully');
    }
}
