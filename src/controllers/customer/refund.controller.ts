import {
    Body,
    Controller,
    Get,
    Post,
    Route,
    Tags,
    Security,
    Middlewares,
    Response,
    Path,
    Example,
    SuccessResponse as TsoaSuccessResponse,
    Request
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface, PresentableError } from '../../error/clientErrorHelper';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { refundService } from '../../services/refund.service';
import { IRefund } from '../../models/refund.model';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { createRefundSchema } from '../../validations/refund.validation';
import { idParamSchema } from '../../constants/common.validator';

interface CreateRefundRequest {
    orderId: string;
    reason: string;
    description?: string;
    amount?: number;
    images?: string[];
}

@Route('customer/refunds')
@Tags('Customer Refunds')
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class CustomerRefundController extends Controller {

    /**
     * Request a refund for an order
     */
    @Post('/')
    @Security('jwt')
    @Middlewares([validateSchemaMiddleware(createRefundSchema)])
    @TsoaSuccessResponse(StatusCodes.CREATED, "Refund Requested")
    public async requestRefund(
        @Body() body: CreateRefundRequest,
        @Request() req: any
    ): Promise<SuccessResponse<IRefund>> {
        // Assuming req.user is populated by auth middleware
        // We need to get userId from the request context. 
        // Since TSOA doesn't automatically inject req.user into @Request without proper setup,
        // we usually rely on the expressAuthentication middleware to attach user to request.
        // However, here I'll assume the standard pattern used in other controllers or pass userId explicitly if needed.
        // But wait, other controllers use @Path userId. 
        // Ideally, we should get userId from the token.
        // Let's check how other controllers get the user. 
        // MobileUserController uses @Path userId.
        // But for a generic "my refunds" or "request refund", we should use the authenticated user.
        // I'll assume req.user.id is available if @Security('jwt') is used.

        // Actually, looking at other controllers, they often take userId as param.
        // But for security, using the token's user ID is better.
        // I'll try to use @Request() request: express.Request and access request.user.id

        // Wait, I can't import Request from tsoa easily as it might conflict or be generic.
        // I'll use @Request() request: any for now and cast it.

        const userId = req.user.id;
        const refund = await refundService.createRefundRequest(userId, body);
        this.setStatus(StatusCodes.CREATED);
        return success(refund as unknown as IRefund, 'Refund request submitted successfully');
    }

    /**
     * Get all refunds for the current user
     */
    @Get('/')
    @Security('jwt')
    public async getMyRefunds(
        @Request() req: any
    ): Promise<SuccessResponse<IRefund[]>> {
        const userId = req.user.id;
        const refunds = await refundService.getUserRefunds(userId);
        return success(refunds as unknown as IRefund[], 'Refunds retrieved successfully');
    }

    /**
     * Get details of a specific refund
     */
    @Get('{id}')
    @Security('jwt')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    public async getRefundDetails(
        @Path() id: string,
        @Request() req: any
    ): Promise<SuccessResponse<IRefund>> {
        const userId = req.user.id;
        const refund = await refundService.getRefundById(id, userId);

        if (!refund) {
            throw new PresentableError('NOT_FOUND', 'Refund not found');
        }

        return success(refund as unknown as IRefund, 'Refund details retrieved successfully');
    }
}