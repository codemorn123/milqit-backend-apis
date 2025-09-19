import express from 'express';
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

  Response,
  Path,
  Example,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface, PresentableError } from './../../error/clientErrorHelper';

import { UserProfile } from'./../../types/auth.types';

import UserService from './../../services/user.service';
import { success, SuccessResponse } from './../../utils/SuccessResponse';


// Example mock data
const exampleAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    address: '123 Main Street, Mumbai, India',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
    isPrimary: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    address: '201 Corporate Park, Pune, India',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411001',
    country: 'India',
    isPrimary: false,
  },
];



@Route('mobile/user')
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
//   @SuccessResponse(StatusCodes.OK, 'User Profile Retrieved')
  @Example<SuccessResponse<any>>(
    success({}, 'User profile retrieved successfully')
  )
  public async getUserProfile(
    @Path() userId: string
  ): Promise<SuccessResponse<UserProfile>> {
    const user = await UserService.getActiveUserById(userId); // return IUserDocument | null
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(user.toProfileDTO(), 'User profile retrieved successfully');
  }

  /**
   * Update the current user's profile.
   */
  @Put('{userId}/profile')
  @Security('jwt')
//   @SuccessResponse(StatusCodes.OK, 'Profile Updated')
  @Example<SuccessResponse<{}>>(success({}, 'Profile updated successfully'))
  public async updateProfile(
    @Path() userId: string,
    @Body() body: Partial<UserProfile>
  ): Promise<SuccessResponse<{}>> {
    // Example: await UserService.updateUserProfile(userId, body);
    return success({}, 'Profile updated successfully');
  }

  /**
   * Get all saved addresses for the current user.
   */
  @Get('{userId}/addresses')
  @Security('jwt')
//   @SuccessResponse(StatusCodes.OK, 'Addresses Retrieved')
  @Example<SuccessResponse<any[]>>(
    success(exampleAddresses, 'Addresses retrieved successfully')
  )
  public async getAddresses(
    @Path() userId: string
  ): Promise<SuccessResponse<any>> {
    const user = await UserService.getActiveUserById(userId);
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    return success(user || [], 'Addresses retrieved successfully');
  }

  /**
   * Add a new delivery address for the current user.
   */
  @Post('{userId}/addresses')
  @Security('jwt')
//   @SuccessResponse(StatusCodes.CREATED, 'Address Added')
  @Example<SuccessResponse<any>>(
    success(exampleAddresses[0], 'Address added successfully')
  )
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
//   @SuccessResponse(StatusCodes.OK, 'Primary Address Set')
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
//   @SuccessResponse(StatusCodes.OK, 'Address Removed')
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
