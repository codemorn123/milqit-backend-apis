import {
    Route,
    Tags,
    Controller,
    Post,
    Middlewares,
    Get,
    Queries,
    SuccessResponse,
    Path,
    Delete,
    Response,
    Request,
  } from 'tsoa';
  

import { bannerFilterSchema, createBannerSchema } from './../../validations/banner-validation-schemas';
import { BannerPlacement, BannerPurpose } from  './../../types/banner.enums';
import { BannerPlatform, IBanner, IBannerFilter } from  './../../types/banner.types';
import { validateSchemaMiddleware } from  './../../middleware/common-validate';
import bannerService from  './../../services/banner/banner.service';
import { idParamSchema } from  './../../constants/common.validator';
import { IPaginated } from './../../types/common.types';
import { uploadBanner } from './../../utils/banner.upload';
import APIError from './../../error/api-error';

//   import { createBannerSchema, bannerFilterSchema } from './../constants/banner.validator';
import express from 'express';
  
  @Route('banners')
  @Tags('Banner')
  export class BannerController extends Controller {
    /**
     * Upload a new banner. The form fields are validated before the file is processed.
     * @param image The banner image file.
     * @param title The title of the banner for internal reference.
     * @param placement The UI location for the banner (e.g., 'HOME_HERO_CAROUSEL').
     * @param platform The target platform ('WEB' or 'MOBILE').
     * @param purpose The marketing purpose of the banner (e.g., 'SALE_EVENT').
     * @param redirectLink Optional URL to navigate to when the banner is clicked.
     * @param isActive Sets if the banner is active. Defaults to true.
     */
    @Post('/')
    @SuccessResponse(201, 'Banner Created')
    @Response(400, 'Validation Failed')
    // STEP 1: Let multer be the ONLY middleware.
    @Middlewares(uploadBanner.single('image'))
    public async createBanner(
      // STEP 2: Use the generic @Request decorator to get the whole request object.
      @Request() request: express.Request
    ): Promise<{
      success: boolean;
      message: string;
      data: IBanner;
    }> {
      // STEP 3: Manually validate the body AFTER multer has populated it.
      const { error, value } = createBannerSchema.validate(request.body);
      if (error) {
        // If validation fails, throw an error that your global error handler can catch.
        throw new APIError(error.details[0].message, 400);
      }
  
      // After validation, 'value' contains the sanitized form fields.
      const bannerData = value; 
      const file = request.file;
  
      if (!file) {
        throw new APIError('Banner image is required.', 400);
      }
      
      const result = await bannerService.create(bannerData, file);
  
      this.setStatus(201);
      return {
        success: true,
        message: 'Banner uploaded successfully',
        data: result,
      };
    }
  
    // ... other methods ...
  

    /**
     * Retrieve all banners with validated filtering and pagination.
     * @param placement Filter by UI placement.
     * @param purpose Filter by marketing purpose.
     * @param platform Filter by platform ('WEB' or 'MOBILE').
     * @param isActive Filter by active status ('true' or 'false').
     * @param page Page number for pagination.
     * @param limit Number of items per page.
     */
    @Get('/')
    @SuccessResponse('200', 'Successfully fetched all banners')
    @Response(400, 'Validation Failed')
    @Middlewares(validateSchemaMiddleware(bannerFilterSchema, 'query'))
    public async getAllBanners(@Queries() queryParams: IBannerFilter): Promise<{
      data: IBanner[];
      pagination: IPaginated;
    }> {
      return bannerService.getAll(queryParams);
    }
  
    /**
     * Retrieve a specific banner by its ID (validated).
     * @param id The banner's unique MongoDB ObjectID.
     */
    @Get('/{id}')
    @SuccessResponse('200', 'Successfully fetched banner by ID')
    @Response(400, 'Invalid ID Format')
    @Response(404, 'Banner Not Found')
    @Middlewares(validateSchemaMiddleware(idParamSchema, 'params'))
    public async getBannerById(@Path() id: string): Promise<IBanner|null> {
      return bannerService.getOne(id);
    }
  
    /**
     * Delete a banner by its ID (validated).
     * @param id The banner's unique MongoDB ObjectID.
     */
    @Delete('/{id}')
    @SuccessResponse('200', 'Successfully deleted banner')
    @Response(400, 'Invalid ID Format')
    @Response(404, 'Banner Not Found')
    @Middlewares(validateSchemaMiddleware(idParamSchema, 'params'))
    public async deleteBanner(@Path() id: string): Promise<{
      message: string;
      status: number;
    }> {
      return bannerService.delete(id);
    }
  }
  
  