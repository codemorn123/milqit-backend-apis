import {
    Route, Tags, Body, Middlewares,
    SuccessResponse, Security, Request, Get, Queries, Put, Path
} from 'tsoa';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
import { refundQuerySchema, processRefundSchema } from '../../validations/admin-refund.validation';
import { idParamSchema } from '../../constants/common.validator';
import { refundService } from '../../services/refund.service';
import { IRequest } from '../../types/request.types';
import { StatusCodes } from 'http-status-codes';
import APIError from '../../error/api-error';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { IRefundFilter, PaginatedResponse } from '../../types/common.types';
import { IRefund } from '../../models/refund.model';

import { BaseController } from '../base.controller';

@Route("admin/refunds")
@Tags("ADMIN: Refunds")
@Security("jwt")
export class AdminRefundController extends BaseController {

    /**
     * List all refunds
     */
    @Get("/")
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(refundQuerySchema, "query")])
    @SuccessResponse(StatusCodes.OK, "Success")
    public async getAllRefunds(
        @Queries() query: IRefundFilter
    ): Promise<SuccessDataResponse<PaginatedResponse<IRefund>>> {
        const result = await refundService.getAllRefunds(query);
        return success(result, "Refunds fetched successfully");
    }

    /**
     * Process a refund (Approve/Reject)
     */
    @Put("/{id}/process")
    @Middlewares([
        jwtAuthMiddleware,
        validateSchemaMiddleware(idParamSchema, "params"),
        validateSchemaMiddleware(processRefundSchema, "body")
    ])
    @SuccessResponse(StatusCodes.OK, "Success")
    public async processRefund(
        @Path() id: string,
        @Request() req: IRequest,
        @Body() body: { status: 'approved' | 'rejected'; adminNotes?: string; rejectionReason?: string }
    ): Promise<SuccessDataResponse<any>> {
        const adminId = req.user?.userId;
        if (!adminId) {
            throw new APIError("Unauthorized", StatusCodes.UNAUTHORIZED);
        }
        const result = await refundService.processRefund(id, body, adminId);
        return success(result, `Refund ${body.status} successfully`);
    }
}