import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Route,
    Tags,
    Path,
    Security,
    Response,
    NoSecurity
  } from 'tsoa';
  import { StatusCodes } from 'http-status-codes';
  import { ClientErrorInterface, PresentableError } from '../../error/clientErrorHelper';
  import { success, SuccessResponse } from '../../utils/SuccessResponse';
  import SubscriptionService from '../../services/subscription.service';
import { ISubscription } from '../../types/subscription.types';

  
  @Route('mobile/subscriptions')
  @Tags('Subscriptions')
  @Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
  @Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
  @Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
  @Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
  export class SubscriptionController extends Controller {
    /**
     * Create a new subscription (e.g., Milk, Vegetables).
     */
    @Get('/')
    // @Security('jwt')
    @NoSecurity()
    public async getAllSubscriptions(): Promise<SuccessResponse<ISubscription[]>> {
      const subscriptions = await SubscriptionService.getAllSubscriptions();
      return success(subscriptions, 'Subscriptions retrieved successfully');
    }
    @Post()
    @Security('jwt')
    public async createSubscription(@Body() body: Partial<ISubscription>): Promise<SuccessResponse<ISubscription>> {
      const subscription = await SubscriptionService.createSubscription(body);
      this.setStatus(StatusCodes.CREATED);
      return success(subscription, 'Subscription created successfully');
    }
  
    /**
     * Get all subscriptions for a user.
     */
    @Get('{userId}')
    @Security('jwt')
    public async getSubscriptions(@Path() userId: string): Promise<SuccessResponse<ISubscription[]>> {
      const subscriptions = await SubscriptionService.getUserSubscriptions(userId);
      return success(subscriptions, 'Subscriptions retrieved successfully');
    }
  
    /**
     * Get a single subscription by ID.
     */
    @Get('detail/{id}')
    @Security('jwt')
    public async getSubscription(@Path() id: string): Promise<SuccessResponse<ISubscription>> {
      const subscription = await SubscriptionService.getSubscriptionById(id);
      if (!subscription) throw new PresentableError('NOT_FOUND', 'Subscription not found');
      return success(subscription, 'Subscription retrieved successfully');
    }
  
    /**
     * Update a subscription.
     */
    @Put('{id}')
    @Security('jwt')
    public async updateSubscription(
      @Path() id: string,
      @Body() body: Partial<ISubscription>
    ): Promise<SuccessResponse<ISubscription>> {
      const updated = await SubscriptionService.updateSubscription(id, body);
      if (!updated) throw new PresentableError('NOT_FOUND', 'Subscription not found');
      return success(updated, 'Subscription updated successfully');
    }
  
    /**
     * Cancel a subscription (soft deactivate).
     */
    @Put('{id}/cancel')
    @Security('jwt')
    public async cancelSubscription(@Path() id: string): Promise<SuccessResponse<ISubscription>> {
      const canceled = await SubscriptionService.cancelSubscription(id);
      if (!canceled) throw new PresentableError('NOT_FOUND', 'Subscription not found');
      return success(canceled, 'Subscription canceled successfully');
    }
  
    /**
     * Delete a subscription (hard delete).
     */
    @Delete('{id}')
    @Security('jwt')
    public async deleteSubscription(@Path() id: string): Promise<SuccessResponse<{}>> {
      const deleted = await SubscriptionService.deleteSubscription(id);
      if (!deleted) throw new PresentableError('NOT_FOUND', 'Subscription not found');
      return success({}, 'Subscription deleted successfully');
    }
  }
  