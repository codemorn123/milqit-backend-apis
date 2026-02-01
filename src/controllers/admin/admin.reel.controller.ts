import {
    Consumes, Delete, FormField, Get, Middlewares, Path, Post, Put, Queries, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFile, Response
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { reelService } from '../../services/reel.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { createReelSchema } from '../../validations/reel.validation';
import { idParamSchema } from '../../constants/common.validator';
import { IReel, IReelResponse } from '../../types/reel.types';
import { handleValidationError, throwBadRequest } from '../../utils/error-helpers';
import { cleanObject } from '../../utils/object.utils';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { IFilter, PaginatedResponse } from '../../types/common.types';

import { BaseController } from '../base.controller';

@Route("admin/reels")
@Tags("ADMIN: Reels")
@Security("jwt")
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminReelController extends BaseController {

    /**
     * Upload a new reel
     */
    @Post("/")
    @Consumes("multipart/form-data")
    @SuccessResponseTags(StatusCodes.CREATED, "Created")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    @Middlewares([jwtAuthMiddleware])
    public async create(
        @FormField() title: string,
        @FormField() description?: string,
        @FormField() isActive?: boolean,
        @UploadedFile("video") video?: Express.Multer.File
    ): Promise<SuccessResponse<IReelResponse>> {
        const cleanedData = cleanObject({ title, description, isActive });
        const { error, value } = createReelSchema.validate(cleanedData);
        if (error) handleValidationError(error);

        if (!video) {
            throwBadRequest("Video file is required");
        }

        const result = await reelService.create(value, video);
        this.setStatus(StatusCodes.CREATED);
        return success(result as any, 'Reel uploaded successfully');
    }

    /**
     * Get all reels with pagination and filtering
     */
    @Get("/")
    @Middlewares([jwtAuthMiddleware])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    public async getAll(@Queries() filter: IFilter): Promise<SuccessResponse<PaginatedResponse<IReel>>> {
        const result = await reelService.getAll(filter);
        return this.sendPaginated(result as any, "Reels fetched successfully");
    }

    /**
     * Get a reel by ID
     */
    @Get("{id}")
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
    public async getById(@Path() id: string): Promise<SuccessResponse<IReel>> {
        const result = await reelService.getOne(id);
        return success(result as any, "Reel fetched successfully");
    }

    /**
     * Update a reel by ID
     */
    @Put("/{id}")
    @Consumes("multipart/form-data")
    @Middlewares([jwtAuthMiddleware])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
    public async update(
        @Path() id: string,
        @FormField() title?: string,
        @FormField() description?: string,
        @FormField() isActive?: boolean,
        @UploadedFile("video") video?: Express.Multer.File
    ): Promise<SuccessResponse<IReelResponse>> {
        const cleanedData = cleanObject({ title, description, isActive });

        const result = await reelService.update(id, cleanedData, video);
        return success(result as any, "Reel updated successfully");
    }

    /**
     * Delete a reel by ID
     */
    @Delete("{id}")
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @SuccessResponseTags(StatusCodes.OK, "Success")
    @Response(StatusCodes.NOT_FOUND, "Reel Not Found")
    @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
    public async delete(@Path() id: string): Promise<SuccessResponse<{ message: string }>> {
        const result = await reelService.delete(id);
        return success(result);
    }
}
