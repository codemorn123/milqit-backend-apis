import {
    Get, Middlewares, Path, Post, Queries, Route, Security, SuccessResponse as SuccessResponseTags, Tags, Request, Response
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { reelService } from '../../services/reel.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { IFilter, PaginatedResponse } from '../../types/common.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import { reelQuerySchema, addCommentSchema, commentQuerySchema } from '../../validations/reel.validation';
import { Body } from 'tsoa';
import { IReelResponse } from '../../types/reel.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { IRequest } from '../../types/request.types';
import APIError from '../../error/api-error';

import { BaseController } from '../base.controller';

@Route("customer/reels")
@Tags("CUSTOMER: Reels")
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class CustomerReelController extends BaseController {

    /**
     * Get all reels (Instagram-like feed)
     */
    @Get("/")
    @Middlewares([validateSchemaMiddleware(reelQuerySchema, "query")])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    public async getReels(
        @Request() req: IRequest,
        @Queries() query: IFilter
    ): Promise<SuccessResponse<PaginatedResponse<IReelResponse>>> {

        return this.sendPaginated(await reelService.getReels(query));
    }

    /**
     * Get all reels (Protected - returns isLiked status)
     */
    @Get("/feed")
    @Security("jwt")
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(reelQuerySchema, "query")])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    public async getReelsFeed(
        @Request() req: IRequest,
        @Queries() query: IFilter
    ): Promise<SuccessResponse<PaginatedResponse<IReelResponse>>> {
        const userId = req.user?.userId;
        const result = await reelService.getReels(query, userId);
        return this.sendPaginated(result, "Reels fetched successfully");
    }

    /**
     * Toggle like on a reel
     */
    @Post("/{id}/like")
    @Security("jwt")
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
    public async toggleLike(
        @Path() id: string,
        @Request() req: IRequest
    ): Promise<SuccessResponse<{ message: string; liked: boolean; likes: number }>> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new APIError("Unauthorized", StatusCodes.UNAUTHORIZED);
        }
        const result = await reelService.toggleLike(id, userId);
        return this.sendSuccess(result);
    }

    /**
     * Add a comment to a reel
     */
    @Post("/{id}/comments")
    @Security("jwt")
    @Middlewares([
        jwtAuthMiddleware,
        validateSchemaMiddleware(idParamSchema, "params"),
        validateSchemaMiddleware(addCommentSchema, "body") // Assuming you exported this
    ])
    @SuccessResponseTags(StatusCodes.CREATED, "Created")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    public async addComment(
        @Path() id: string,
        @Request() req: IRequest,
        @Body() body: { content: string }
    ): Promise<SuccessResponse<any>> {
        const userId = req.user?.userId;
        if (!userId) {
            throw new APIError("Unauthorized", StatusCodes.UNAUTHORIZED);
        }
        const result = await reelService.addComment(id, userId, body.content);
        return this.sendCreated(result, "Comment added successfully");
    }

    /**
     * Get comments for a reel
     */
    @Get("/{id}/comments")
    @Middlewares([
        validateSchemaMiddleware(idParamSchema, "params"),
        validateSchemaMiddleware(commentQuerySchema, "query") // Assuming you exported this
    ])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    public async getComments(
        @Path() id: string,
        @Queries() query: IFilter
    ): Promise<SuccessResponse<PaginatedResponse<any>>> {
        const result = await reelService.getComments(id, query);
        return this.sendPaginated(result, "Comments fetched successfully");
    }
}
