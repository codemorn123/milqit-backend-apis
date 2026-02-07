import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Security,
  Middlewares,
  Response,
  // Path, // Removed as userId is no longer in path
  Request,
  Example,
  SuccessResponse as TsoaSuccessResponse
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface, PresentableError } from '../../error/clientErrorHelper';
// import { UserProfile } from '../../types/auth.types'; // Unused
import UserService from '../../services/user.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { IUser } from '../../models/UserModel';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
// import { idParamSchema } from '../../constants/common.validator'; // Removed as userId is no longer in path
import {
  updateProfileSchema,
  addAddressSchema,
  addressIdSchema
} from '../../validations/user.validation';

// Define input interface for profile update
interface IUpdateProfileRequest {
  name?: string;
  email?: string;
}

import { BaseController } from '../base.controller';

@Route('customer/user')
@Tags('Mobile User')
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class MobileUserController extends BaseController {
  /**
   * Get the current user's profile based on their authentication token.
   */
  @Get('profile')
  @Security('jwt')
  // @Middlewares([validateSchemaMiddleware(idParamSchema, "params")]) // Removed
  @Example<SuccessResponse<any>>(
    success({}, 'User profile retrieved successfully')
  )
  public async getUserProfile(
    @Request() req: any
  ): Promise<SuccessResponse<IUser>> {
    const userId = this.getUserId(req);
    const user = await UserService.getAndValidateUser(userId);
    return this.sendSuccess(user, 'User profile retrieved successfully');
  }

  /**
   * Update the current user's profile.
   */
  @Put('profile')
  @Security('jwt')
  @Middlewares([
    // validateSchemaMiddleware(idParamSchema, "params"), // Removed
    validateSchemaMiddleware(updateProfileSchema, "body")
  ])
  @Example<SuccessResponse<{}>>(success({}, 'Profile updated successfully'))
  public async updateProfile(
    @Request() req: any,
    @Body() body: IUpdateProfileRequest
  ): Promise<SuccessResponse<IUser>> {
    const userId = this.getUserId(req);
    const updatedUser = await UserService.updateUserProfile(userId, body);
    if (!updatedUser) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(updatedUser, 'Profile updated successfully');
  }

  /**
   * Delete user profile (Deactivate account)
   */
  @Delete('profile')
  @Security('jwt')
  // @Middlewares([validateSchemaMiddleware(idParamSchema, "params")]) // Removed
  @TsoaSuccessResponse(StatusCodes.OK, "Profile Deleted")
  public async deleteProfile(
    @Request() req: any
  ): Promise<SuccessResponse<{ success: boolean }>> {
    const userId = this.getUserId(req);
    await UserService.deactivateUser(userId);
    return this.sendSuccess({ success: true }, 'Profile deleted successfully');
  }

  /**
   * Get all saved addresses for the current user.
   */
  @Get('addresses')
  @Security('jwt')
  // @Middlewares([validateSchemaMiddleware(idParamSchema, "params")]) // Removed
  @Example<SuccessResponse<any[]>>(
    success([], 'Addresses retrieved successfully')
  )
  public async getAddresses(
    @Request() req: any
  ): Promise<SuccessResponse<any>> {
    const userId = this.getUserId(req);
    const user = await UserService.getActiveUserById(userId);
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return this.sendSuccess(user.addresses || [], 'Addresses retrieved successfully');
  }

  /**
   * Add a new delivery address for the current user.
   */
  @Post('addresses')
  @Security('jwt')
  @Middlewares([
    // validateSchemaMiddleware(idParamSchema, "params"), // Removed
    validateSchemaMiddleware(addAddressSchema, "body")
  ])
  @TsoaSuccessResponse(StatusCodes.CREATED, "Address Added")
  public async addAddress(
    @Request() req: any,
    @Body() address: any
  ): Promise<SuccessResponse<any>> {
    const userId = this.getUserId(req);
    const updatedUser = await UserService.addUserAddress(userId, address);
    const newAddress = updatedUser?.addresses?.slice(-1)[0];
    return this.sendCreated(newAddress, 'Address added successfully');
  }

  /**
   * Set a primary delivery address from the user's saved addresses.
   */
  @Put('addresses/primary')
  @Security('jwt')
  @Middlewares([
    // validateSchemaMiddleware(idParamSchema, "params"), // Removed
    validateSchemaMiddleware(addressIdSchema, "body")
  ])
  @Example<SuccessResponse<{ success: boolean }>>(
    success({ success: true }, 'Primary address set successfully')
  )
  public async setPrimaryAddress(
    @Request() req: any,
    @Body() body: { addressId: string }
  ): Promise<SuccessResponse<{ success: boolean }>> {
    const userId = this.getUserId(req);
    await UserService.setPrimaryAddress(userId, body.addressId);
    return this.sendSuccess({ success: true }, 'Primary address set successfully');
  }

  /**
   * Delete a saved address for the current user.
   */
  @Delete('addresses')
  @Security('jwt')
  @Middlewares([
    // validateSchemaMiddleware(idParamSchema, "params"), // Removed
    validateSchemaMiddleware(addressIdSchema, "body")
  ])
  @Example<SuccessResponse<{ success: boolean }>>(
    success({ success: true }, 'Address removed successfully')
  )
  public async removeAddress(
    @Request() req: any,
    @Body() body: { addressId: string }
  ): Promise<SuccessResponse<{ success: boolean }>> {
    const userId = this.getUserId(req);
    await UserService.removeUserAddress(userId, body.addressId);
    return this.sendSuccess({ success: true }, 'Address removed successfully');
  }
}
