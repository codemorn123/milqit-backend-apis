import {
    Consumes, Controller, Delete, FormField, Get, Middlewares, Path, Post, Put, Queries, Route, Security, SuccessResponse as SuccessResponseTags, Tags, UploadedFile, Response
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { reelService } from '../../services/reel.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { createReelSchema } from '../../validations/reel.validation';
import { idParamSchema } from '../../constants/common.validator';
import { IReelDocument } from '../../models/reel.model';
import { IReel, IReelResponse } from '../../types/reel.types';
import APIError from '../../error/api-error';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { IFilter, PaginatedResponse } from '../../types/common.types';

@Route("admin/reels")
@Tags("ADMIN: Reels")
@Security("jwt")
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminReelController extends Controller {

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

        const dataToValidate = { title, description, isActive };
        // Remove undefined keys
        Object.keys(dataToValidate).forEach(key => (dataToValidate as any)[key] === undefined && delete (dataToValidate as any)[key]);

        const { error, value } = createReelSchema.validate(dataToValidate);
        if (error) {
            throw new APIError(error.details[0].message, StatusCodes.BAD_REQUEST);
        }

        if (!video) {
            throw new APIError("Video file is required", StatusCodes.BAD_REQUEST);
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
        return success(result, "Reels fetched successfully");
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
        return success(result);
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
        const dataToValidate = { title, description, isActive };
        // Remove undefined keys
        Object.keys(dataToValidate).forEach(key => (dataToValidate as any)[key] === undefined && delete (dataToValidate as any)[key]);

        // We can use updateReelSchema here if we want strict validation on what's passed, 
        // but since fields are optional in the schema, it works.
        // However, we should import it.

        const result = await reelService.update(id, dataToValidate, video);
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
