import {
  Body,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Path,
  Security,
  Response,
  NoSecurity,
  Middlewares
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface, PresentableError } from '../../error/clientErrorHelper';
import { SuccessResponse } from '../../utils/SuccessResponse';
import SubscriptionService from '../../services/subscription.service';
import { ISubscription } from '../../types/subscription.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';


import { BaseController } from '../base.controller';

@Route('customer/subscriptions')
@Tags('Subscriptions')
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class SubscriptionController extends BaseController {
  /**
   * Create a new subscription (e.g., Milk, Vegetables).
   */
  @Get('/')
  // @Security('jwt')
  @NoSecurity()
  @Response(StatusCodes.OK, 'Success')
  public async getAllSubscriptions(): Promise<SuccessResponse<ISubscription[]>> {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    return this.sendSuccess(subscriptions, 'Subscriptions retrieved successfully');
  }
  @Post()
  @Security('jwt')
  @Response(StatusCodes.CREATED, 'Created')
  @Response(StatusCodes.BAD_REQUEST, 'Validation Failed')
  public async createSubscription(@Body() body: Partial<ISubscription>): Promise<SuccessResponse<ISubscription>> {
    const subscription = await SubscriptionService.createSubscription(body);
    return this.sendCreated(subscription, 'Subscription created successfully');
  }

  /**
   * Get all subscriptions for a user.
   */
  @Get('{userId}')
  @Security('jwt')
  @Response(StatusCodes.OK, 'Success')
  @Response(StatusCodes.NOT_FOUND, 'User Not Found')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getSubscriptions(@Path() userId: string): Promise<SuccessResponse<ISubscription[]>> {
    const subscriptions = await SubscriptionService.getUserSubscriptions(userId);
    return this.sendSuccess(subscriptions, 'Subscriptions retrieved successfully');
  }

  /**
   * Get a single subscription by ID.
   */
  @Get('detail/{id}')
  @Security('jwt')
  @Response(StatusCodes.OK, 'Success')
  @Response(StatusCodes.NOT_FOUND, 'Subscription Not Found')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getSubscription(@Path() id: string): Promise<SuccessResponse<ISubscription>> {
    const subscription = await SubscriptionService.getSubscriptionById(id);
    if (!subscription) throw new PresentableError('NOT_FOUND', 'Subscription not found');
    return this.sendSuccess(subscription, 'Subscription retrieved successfully');
  }

  /**
   * Update a subscription.
   */
  @Put('{id}')
  @Security('jwt')
  @Response(StatusCodes.OK, 'Success')
  @Response(StatusCodes.NOT_FOUND, 'Subscription Not Found')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async updateSubscription(
    @Path() id: string,
    @Body() body: Partial<ISubscription>
  ): Promise<SuccessResponse<ISubscription>> {
    const updated = await SubscriptionService.updateSubscription(id, body);
    if (!updated) throw new PresentableError('NOT_FOUND', 'Subscription not found');
    return this.sendSuccess(updated, 'Subscription updated successfully');
  }

  /**
   * Cancel a subscription (soft deactivate).
   */
  @Put('{id}/cancel')
  @Security('jwt')
  @Response(StatusCodes.OK, 'Success')
  @Response(StatusCodes.NOT_FOUND, 'Subscription Not Found')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async cancelSubscription(@Path() id: string): Promise<SuccessResponse<ISubscription>> {
    const canceled = await SubscriptionService.cancelSubscription(id);
    if (!canceled) throw new PresentableError('NOT_FOUND', 'Subscription not found');
    return this.sendSuccess(canceled, 'Subscription canceled successfully');
  }

  /**
   * Delete a subscription (hard delete).
   */
  @Delete('{id}')
  @Security('jwt')
  @Response(StatusCodes.OK, 'Success')
  @Response(StatusCodes.NOT_FOUND, 'Subscription Not Found')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async deleteSubscription(@Path() id: string): Promise<SuccessResponse<{}>> {
    const deleted = await SubscriptionService.deleteSubscription(id);
    if (!deleted) throw new PresentableError('NOT_FOUND', 'Subscription not found');
    return this.sendSuccess({}, 'Subscription deleted successfully');
  }
}
