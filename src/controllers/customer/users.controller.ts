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
  Path,
  Example,
  SuccessResponse as TsoaSuccessResponse
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface, PresentableError } from '../../error/clientErrorHelper';
import { UserProfile } from '../../types/auth.types';
import UserService from '../../services/user.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { IUser } from '../../models/UserModel';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
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

@Route('customer/user')
@Tags('Mobile User')
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class MobileUserController extends Controller {
  /**
   * Get the current user's profile based on their authentication token.
   */
  @Get('{userId}/profile')
  @Security('jwt')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  @Example<SuccessResponse<any>>(
    success({}, 'User profile retrieved successfully')
  )
  public async getUserProfile(
    @Path() userId: string
  ): Promise<SuccessResponse<IUser>> {
    const user = await UserService.getActiveUserById(userId);
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(user, 'User profile retrieved successfully');
  }

  /**
   * Update the current user's profile.
   */
  @Put('{userId}/profile')
  @Security('jwt')
  @Middlewares([
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(updateProfileSchema)
  ])
  @Example<SuccessResponse<{}>>(success({}, 'Profile updated successfully'))
  public async updateProfile(
    @Path() userId: string,
    @Body() body: IUpdateProfileRequest
  ): Promise<SuccessResponse<IUser>> {
    const updatedUser = await UserService.updateUserProfile(userId, body);
    if (!updatedUser) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(updatedUser, 'Profile updated successfully');
  }

  /**
   * Delete user profile (Deactivate account)
   */
  @Delete('{userId}/profile')
  @Security('jwt')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  @TsoaSuccessResponse(StatusCodes.OK, "Profile Deleted")
  public async deleteProfile(
    @Path() userId: string
  ): Promise<SuccessResponse<{ success: boolean }>> {
    await UserService.deactivateUser(userId);
    return success({ success: true }, 'Profile deleted successfully');
  }

  /**
   * Get all saved addresses for the current user.
   */
  @Get('{userId}/addresses')
  @Security('jwt')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  @Example<SuccessResponse<any[]>>(
    success([], 'Addresses retrieved successfully')
  )
  public async getAddresses(
    @Path() userId: string
  ): Promise<SuccessResponse<any>> {
    const user = await UserService.getActiveUserById(userId);
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(user.addresses || [], 'Addresses retrieved successfully');
  }

  /**
   * Add a new delivery address for the current user.
   */
  @Post('{userId}/addresses')
  @Security('jwt')
  @Middlewares([
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(addAddressSchema)
  ])
  @TsoaSuccessResponse(StatusCodes.CREATED, "Address Added")
  public async addAddress(
    @Path() userId: string,
    @Body() address: any
  ): Promise<SuccessResponse<any>> {
    const updatedUser = await UserService.addUserAddress(userId, address);
    const newAddress = updatedUser?.addresses?.slice(-1)[0];
    this.setStatus(StatusCodes.CREATED);
    return success(newAddress, 'Address added successfully');
  }

  /**
   * Set a primary delivery address from the user's saved addresses.
   */
  @Put('{userId}/addresses/primary')
  @Security('jwt')
  @Middlewares([
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(addressIdSchema)
  ])
  @Example<SuccessResponse<{ success: boolean }>>(
    success({ success: true }, 'Primary address set successfully')
  )
  public async setPrimaryAddress(
    @Path() userId: string,
    @Body() body: { addressId: string }
  ): Promise<SuccessResponse<{ success: boolean }>> {
    await UserService.setPrimaryAddress(userId, body.addressId);
    return success({ success: true }, 'Primary address set successfully');
  }

  /**
   * Delete a saved address for the current user.
   */
  @Delete('{userId}/addresses')
  @Security('jwt')
  @Middlewares([
    validateSchemaMiddleware(idParamSchema, "params"),
    validateSchemaMiddleware(addressIdSchema)
  ])
  @Example<SuccessResponse<{ success: boolean }>>(
    success({ success: true }, 'Address removed successfully')
  )
  public async removeAddress(
    @Path() userId: string,
    @Body() body: { addressId: string }
  ): Promise<SuccessResponse<{ success: boolean }>> {
    await UserService.removeUserAddress(userId, body.addressId);
    return success({ success: true }, 'Address removed successfully');
  }
}
