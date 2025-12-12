import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Query,
    Route,
    Tags,
    Response,
    Middlewares,
    Security,
    Request
} from 'tsoa';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { deliveryBoyService } from '../../services/deliveryBoy.service';
import {
    IAdminCreateDeliveryBoyInput,
    IAdminUpdateDeliveryBoyInput,
    IToggleDeliveryBoyStatusInput,
    IVerifyDeliveryBoyDocumentsInput,
    IAssignDeliveryZonesInput,
    IDeliveryBoyListQuery,
    IDeliveryBoyStats,
    IDeliveryBoyPerformance,
    IPaginatedDeliveryBoyList,
    IBulkDeliveryBoyOperation,
    IBulkOperationResponse
} from '../../types/admin.deliveryBoy.types';
import {
    adminCreateDeliveryBoySchema,
    adminUpdateDeliveryBoySchema,
    toggleDeliveryBoyStatusSchema,
    verifyDeliveryBoyDocumentsSchema,
    assignDeliveryZonesSchema,
    deliveryBoyListQuerySchema,
    bulkDeliveryBoyOperationSchema
} from '../../validations/admin.deliveryBoy.validation';
import { ErrorResponse } from '../../types/common.types';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import {
    NOT_FOUND_ERROR_EXAMPLE,
    SERVER_ERROR_EXAMPLE,
    VALIDATION_ERROR_EXAMPLE
} from '../../error/exampleErrors';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { IDeliveryBoy } from '../../models/DeliveryBoyModel';

/**
 * Controller for admin delivery boy management operations
 */
@Route('admin/delivery-boys')
@Tags('Admin - Delivery Boy Management')
@Security('jwt', ['admin'])
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ErrorResponse>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ErrorResponse>(StatusCodes.CONFLICT, 'Conflict')
export class AdminDeliveryBoyController extends Controller {
    /**
     * Create a new delivery boy account
     * @summary Create delivery boy
     * @param body Delivery boy creation data
     * @returns Created delivery boy
     */
    @Post()
    @Middlewares([validateSchemaMiddleware(adminCreateDeliveryBoySchema, 'body')])
    public async createDeliveryBoy(
        @Body() body: IAdminCreateDeliveryBoyInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        this.setStatus(StatusCodes.CREATED);
        const deliveryBoy = await deliveryBoyService.adminCreateDeliveryBoy(body);
        return success(deliveryBoy, 'Delivery boy created successfully');
    }

    /**
     * Get list of delivery boys with pagination and filters
     * @summary Get delivery boys list
     * @param page Page number
     * @param limit Items per page
     * @param search Search by name, phone, or email
     * @param isActive Filter by active status
     * @param isAvailable Filter by availability
     * @param isDocumentVerified Filter by document verification status
     * @param vehicleType Filter by vehicle type
     * @param deliveryZone Filter by delivery zone
     * @param sortBy Sort by field
     * @param sortOrder Sort order
     * @returns Paginated list of delivery boys
     */
    @Get()
    public async getDeliveryBoysList(
        @Query() page?: number,
        @Query() limit?: number,
        @Query() search?: string,
        @Query() isActive?: boolean,
        @Query() isAvailable?: boolean,
        @Query() isDocumentVerified?: boolean,
        @Query() vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car',
        @Query() deliveryZone?: string,
        @Query() sortBy?: 'name' | 'createdAt' | 'totalDeliveries' | 'averageRating',
        @Query() sortOrder?: 'asc' | 'desc'
    ): Promise<SuccessResponse<IPaginatedDeliveryBoyList>> {
        const query: IDeliveryBoyListQuery = {
            page,
            limit,
            search,
            isActive,
            isAvailable,
            isDocumentVerified,
            vehicleType,
            deliveryZone,
            sortBy,
            sortOrder
        };

        const result = await deliveryBoyService.adminGetDeliveryBoysList(query);
        return success(result, 'Delivery boys retrieved successfully');
    }

    /**
     * Get delivery boy statistics
     * @summary Get statistics
     * @returns Delivery boy statistics
     */
    @Get('stats')
    public async getStatistics(): Promise<SuccessResponse<IDeliveryBoyStats>> {
        const stats = await deliveryBoyService.adminGetDeliveryBoyStats();
        return success(stats, 'Statistics retrieved successfully');
    }

    /**
     * Get a specific delivery boy by ID
     * @summary Get delivery boy details
     * @param deliveryBoyId Delivery boy ID
     * @returns Delivery boy details
     */
    @Get('{deliveryBoyId}')
    public async getDeliveryBoy(
        @Path() deliveryBoyId: string
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoy = await deliveryBoyService.findDeliveryBoyById(deliveryBoyId);

        if (!deliveryBoy) {
            this.setStatus(StatusCodes.NOT_FOUND);
            throw new Error('Delivery boy not found');
        }

        return success(deliveryBoy, 'Delivery boy retrieved successfully');
    }

    /**
     * Update delivery boy details
     * @summary Update delivery boy
     * @param deliveryBoyId Delivery boy ID
     * @param body Update data
     * @returns Updated delivery boy
     */
    @Put('{deliveryBoyId}')
    @Middlewares([validateSchemaMiddleware(adminUpdateDeliveryBoySchema, 'body')])
    public async updateDeliveryBoy(
        @Path() deliveryBoyId: string,
        @Body() body: IAdminUpdateDeliveryBoyInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoy = await deliveryBoyService.adminUpdateDeliveryBoy(deliveryBoyId, body);
        return success(deliveryBoy, 'Delivery boy updated successfully');
    }

    /**
     * Delete a delivery boy
     * @summary Delete delivery boy
     * @param deliveryBoyId Delivery boy ID
     * @returns Success message
     */
    @Delete('{deliveryBoyId}')
    public async deleteDeliveryBoy(
        @Path() deliveryBoyId: string
    ): Promise<SuccessResponse<null>> {
        await deliveryBoyService.adminDeleteDeliveryBoy(deliveryBoyId);
        return success(null, 'Delivery boy deleted successfully');
    }

    /**
     * Toggle delivery boy active status (activate/deactivate)
     * @summary Toggle status
     * @param deliveryBoyId Delivery boy ID
     * @param body Status toggle data
     * @returns Updated delivery boy
     */
    @Put('{deliveryBoyId}/status')
    @Middlewares([validateSchemaMiddleware(toggleDeliveryBoyStatusSchema, 'body')])
    public async toggleStatus(
        @Path() deliveryBoyId: string,
        @Body() body: IToggleDeliveryBoyStatusInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoy = await deliveryBoyService.adminToggleStatus(deliveryBoyId, body);
        const message = body.isActive
            ? 'Delivery boy activated successfully'
            : 'Delivery boy deactivated successfully';
        return success(deliveryBoy, message);
    }

    /**
     * Verify delivery boy documents
     * @summary Verify documents
     * @param deliveryBoyId Delivery boy ID
     * @param body Verification data
     * @returns Updated delivery boy
     */
    @Put('{deliveryBoyId}/verify-documents')
    @Middlewares([validateSchemaMiddleware(verifyDeliveryBoyDocumentsSchema, 'body')])
    public async verifyDocuments(
        @Path() deliveryBoyId: string,
        @Body() body: IVerifyDeliveryBoyDocumentsInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoy = await deliveryBoyService.adminVerifyDocuments(deliveryBoyId, body);
        const message = body.isDocumentVerified
            ? 'Documents verified successfully'
            : 'Document verification status updated';
        return success(deliveryBoy, message);
    }

    /**
     * Assign delivery zones to delivery boy
     * @summary Assign zones
     * @param deliveryBoyId Delivery boy ID
     * @param body Zone assignment data
     * @returns Updated delivery boy
     */
    @Put('{deliveryBoyId}/assign-zones')
    @Middlewares([validateSchemaMiddleware(assignDeliveryZonesSchema, 'body')])
    public async assignZones(
        @Path() deliveryBoyId: string,
        @Body() body: IAssignDeliveryZonesInput
    ): Promise<SuccessResponse<IDeliveryBoy>> {
        const deliveryBoy = await deliveryBoyService.adminAssignZones(deliveryBoyId, body);
        return success(deliveryBoy, 'Delivery zones assigned successfully');
    }

    /**
     * Get delivery boy performance metrics
     * @summary Get performance
     * @param deliveryBoyId Delivery boy ID
     * @returns Performance metrics
     */
    @Get('{deliveryBoyId}/performance')
    public async getPerformance(
        @Path() deliveryBoyId: string
    ): Promise<SuccessResponse<IDeliveryBoyPerformance>> {
        const performance = await deliveryBoyService.adminGetPerformance(deliveryBoyId);
        return success(performance, 'Performance metrics retrieved successfully');
    }

    /**
     * Get available delivery boys for assignment
     * @summary Get available delivery boys
     * @param zone Optional delivery zone filter
     * @returns List of available delivery boys
     */
    @Get('available/list')
    public async getAvailableDeliveryBoys(
        @Query() zone?: string
    ): Promise<SuccessResponse<IDeliveryBoy[]>> {
        const deliveryBoys = await deliveryBoyService.getAvailableDeliveryBoys(zone);
        return success(deliveryBoys, 'Available delivery boys retrieved successfully');
    }

    /**
     * Perform bulk operations on delivery boys
     * @summary Bulk operations
     * @param body Bulk operation data
     * @returns Bulk operation results
     */
    @Post('bulk-operation')
    @Middlewares([validateSchemaMiddleware(bulkDeliveryBoyOperationSchema, 'body')])
    public async bulkOperation(
        @Body() body: IBulkDeliveryBoyOperation
    ): Promise<SuccessResponse<IBulkOperationResponse>> {
        const result = await deliveryBoyService.adminBulkOperation(body);
        return success(result, `Bulk ${body.operation} operation completed`);
    }
}
