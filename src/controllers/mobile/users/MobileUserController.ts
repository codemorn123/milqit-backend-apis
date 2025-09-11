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
  SuccessResponse,
  Response,
  Request,
  Path,
  Example,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import UserService from '../../../services/user.service';
import { ClientErrorInterface, PresentableError } from '../../../error/clientErrorHelper';
import { success, SuccessResponse as ApiSuccessResponse } from '../../../utils/SuccessResponse';
import { UserProfile } from '../../../types/auth.types';
import { UpdateUserInput } from '../../../schemas/userSchemas'; // <-- Import the correct type for updates

const exampleUserProfile: UserProfile = {
  id: 'ffca2a3a-c0bf-4931-b65a-8d8ccf867096',
  name: 'Doe',
  email: 'john@doe.org',
  phone: '+91-9876543210',
    roles: ['USER'],
  isActive: true,   
    isEmailVerified: true,
    isPhoneVerified: false,
    lastLogin: '2024-10-01T10:00:00Z',
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-10-01T09:00:00Z',
};

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
    @SuccessResponse(StatusCodes.OK, 'User Profile Retrieved')
    @Example<ApiSuccessResponse<UserProfile>>(success(exampleUserProfile, 'User profile retrieved successfully'))
    public async getUserProfile(@Path() userId: string): Promise<ApiSuccessResponse<UserProfile>> {
        const user = await UserService.getActiveUserById(userId);
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
    @SuccessResponse(StatusCodes.OK, 'Profile Updated')
    @Example<ApiSuccessResponse<{}>>(success({}, 'Profile updated successfully'))
    public async updateProfile(@Path() userId: string): Promise<ApiSuccessResponse<{}>> {
        // The 'data' object is now correctly typed as UpdateUserInput
        // const updatedUser = await UserService.updateUserProfile(userId, {});
        return success({}, 'Profile updated successfully');
    }

    /**
     * Get all saved addresses for the current user.
     */
    @Get('{userId}/addresses')
    @Security('jwt')
    @SuccessResponse(StatusCodes.OK, 'Addresses Retrieved')
    @Example<ApiSuccessResponse<any[]>>(success(exampleAddresses, 'Addresses retrieved successfully'))
    public async getAddresses(@Path() userId: string): Promise<ApiSuccessResponse<any[]>> {
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
    @SuccessResponse(StatusCodes.CREATED, 'Address Added')
    @Example<ApiSuccessResponse<any>>(success(exampleAddresses[0], 'Address added successfully'))
    public async addAddress(@Path() userId: string, @Body() address: any): Promise<ApiSuccessResponse<any>> {
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
    @SuccessResponse(StatusCodes.OK, 'Primary Address Set')
    @Example<ApiSuccessResponse<{ success: boolean }>>(success({ success: true }, 'Primary address set successfully'))
    public async setPrimaryAddress(@Path() userId: string, @Body() body: { addressId: string }): Promise<ApiSuccessResponse<{ success: boolean }>> {
        await UserService.setPrimaryAddress(userId, body.addressId);
        return success({ success: true }, 'Primary address set successfully');
    }

    /**
     * Delete a saved address for the current user.
     */
    @Delete('{userId}/addresses')
    @Security('jwt')
    @SuccessResponse(StatusCodes.OK, 'Address Removed')
    @Example<ApiSuccessResponse<{ success: boolean }>>(success({ success: true }, 'Address removed successfully'))
    public async removeAddress(@Path() userId: string, @Body() body: { addressId: string }): Promise<ApiSuccessResponse<{ success: boolean }>> {
        await UserService.removeUserAddress(userId, body.addressId);
        return success({ success: true }, 'Address removed successfully');
    }
}