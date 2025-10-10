import {
    Body, Controller, Post, Get, Put, Path, Route, Tags,
    Middlewares, Response, Query, SuccessResponse as TsoaSuccessResponse
  } from 'tsoa';
  import { StatusCodes } from 'http-status-codes';
  import { locationService } from '../../services/location.service';
  import { success, SuccessResponse, NullSuccessResponse } from '../../utils/SuccessResponse';
  import { ErrorResponse } from '../../types/common.types';
  import { 
    ILiveLocation, 
    IUpdateLocationRequest, 
    IStartTrackingRequest 
  } from '../../models/location.model';
  import { validateSchemaMiddleware } from '../../middleware/common-validate';
  import { idParamSchema } from '../../constants/common.validator';
  
  @Tags('Location Tracking')
  @Route('location')
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Response<ErrorResponse>(404, "Not Found")
  @Response<ErrorResponse>(500, "Server Error")
  export class LocationController extends Controller {
    /**
     * Start tracking session (REST API fallback)
     */
    @Post('start')
    @TsoaSuccessResponse(StatusCodes.CREATED, "Tracking Started")
    public async startTracking(
      @Body() data: IStartTrackingRequest
    ): Promise<SuccessResponse<ILiveLocation>> {
      const tracking = await locationService.startTracking(data);
      this.setStatus(StatusCodes.CREATED);
      return success(tracking, 'Tracking started successfully.');
    }
  
    /**
     * Update location (REST API fallback)
     */
    @Post('update')
    public async updateLocation(
      @Body() data: IUpdateLocationRequest
    ): Promise<SuccessResponse<ILiveLocation>> {
      const tracking = await locationService.updateLocation(data);
      return success(tracking, 'Location updated successfully.');
    }
  
    /**
     * Get current location
     */
    @Get('current/{userId}')
    public async getCurrentLocation(
      @Path() userId: string,
      @Query() orderId?: string
    ): Promise<SuccessResponse<ILiveLocation | null>> {
      const location = await locationService.getCurrentLocation(userId, orderId);
      return success(location, 'Current location fetched successfully.');
    }
  
    /**
     * Stop tracking
     */
    @Post('stop')
    public async stopTracking(
      @Body() data: { userId: string; sessionId: string; orderId?: string }
    ): Promise<NullSuccessResponse> {
      await locationService.stopTracking(data.userId, data.sessionId, data.orderId);
      return success(null, 'Tracking stopped successfully.');
    }
  
    /**
     * Find nearby delivery partners
     */
    @Get('nearby')
    public async findNearbyDeliveryPartners(
      @Query() latitude: number,
      @Query() longitude: number,
      @Query() maxDistance?: number
    ): Promise<SuccessResponse<ILiveLocation[]>> {
      const partners = await locationService.findNearbyDeliveryPartners(
        latitude,
        longitude,
        maxDistance
      );
      return success(partners, 'Nearby delivery partners fetched successfully.');
    }
  
    /**
     * Get location history
     */
    @Get('history/{userId}')
    public async getLocationHistory(
      @Path() userId: string,
      @Query() orderId?: string
    ): Promise<SuccessResponse<ILiveLocation[]>> {
      const history = await locationService.getLocationHistory(userId, orderId);
      return success(history, 'Location history fetched successfully.');
    }
  
    /**
     * Get ETA
     */
    @Get('eta/{deliveryPartnerId}')
    public async getETA(
      @Path() deliveryPartnerId: string,
      @Query() destinationLat: number,
      @Query() destinationLon: number
    ): Promise<SuccessResponse<{ distance: number; eta: number }>> {
      const eta = await locationService.getETA(
        deliveryPartnerId,
        destinationLat,
        destinationLon
      );
      return success(eta, 'ETA calculated successfully.');
    }
  }