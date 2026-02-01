

// import { IUserDocument, UserModel } from '../models/UserModel';
import { CreateUserInput } from '../schemas/userSchemas';
import { PresentableError } from '../error/clientErrorHelper';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';
import mongoose from 'mongoose';
import { GeoLocation } from './../types/location.types';
import { IUser, UserModel } from '../models/UserModel';


const UserService = {

    async findUserByPhone(phone: string): Promise<IUser | null> {
        return UserModel.findOne({ phone }).exec();
    },


    /**
     * Get an active user by ID
     */
    async getActiveUserById(id: string): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return UserModel.findById(id).where('isActive', true).exec();
    },

    /**
     * Get user by ID and validate status.
     * Throws specific errors if not found or inactive.
     */
    async getAndValidateUser(userId: string): Promise<IUser> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            throw new PresentableError('NOT_FOUND', 'User not found');
        }
        if (!user.isActive) {
            throw new PresentableError('UNAUTHORIZED', 'Account deactivated. Please contact support.');
        }
        return user;
    },


    /**
     * Create a new user
     */
    async createUser(data: CreateUserInput, isBootstrapAdmin = false): Promise<IUser> {
        try {
            const passwordHash = await bcrypt.hash(data.password, 12);

            const user = new UserModel({
                ...data,
                email: data.email?.toLowerCase(),
                passwordHash,
                isEmailVerified: isBootstrapAdmin, // Auto-verify bootstrap admin
                isPhoneVerified: isBootstrapAdmin && !!data.phone,
                roles: data.roles || ['customer'],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await user.save();
            logger.info(`User created: ${user.id}`);
            return user;
        } catch (error: any) {
            logger.error(`Failed to create user: ${error.message}`);
            if (error.code === 11000) { // Duplicate key error
                throw new PresentableError('CONFLICT', 'User with this email or phone already exists');
            }
            throw new PresentableError('SERVER_ERROR', 'Failed to create user account');
        }
    },





    /**
     * 
     * Update user's last login timestamp
     */
    async updateLastLogin(userId: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return;
        }
        await UserModel.findByIdAndUpdate(userId, {
            lastLogin: new Date(),
            updatedAt: new Date()
        });
    },

    /**
     * Count admin users
     */
    async countAdmins(): Promise<number> {
        return UserModel.countDocuments({ roles: 'admin' }).exec();
    },

    /**
     * Verify a user has admin privileges
     */
    async verifyAdminPrivileges(userId: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('FORBIDDEN', 'Invalid user ID');
        }

        const user = await UserModel.findById(userId);
        if (!user || !user.roles.includes('admin')) {
            throw new PresentableError('FORBIDDEN', 'You do not have permission to perform this action');
        }
    },


    /**
     * Update user's saved addresses
     */
    async addUserAddress(userId: string, address: any): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            await this.getAndValidateUser(userId);

            // Add address with unique ID
            const addressId = new mongoose.Types.ObjectId().toString();
            const newAddress = { ...address, id: addressId };

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $push: { addresses: newAddress },
                    updatedAt: new Date()
                },
                { new: true }
            );

            return updatedUser;
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to add user address: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to add address');
        }
    },

    /**
     * Update user's primary address
     */
    async setPrimaryAddress(userId: string, addressId: string): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            const user = await this.getAndValidateUser(userId);

            // Find the address
            const addressExists = user.addresses?.some(addr => addr.id === addressId);
            if (!addressExists) {
                throw new PresentableError('NOT_FOUND', 'Address not found');
            }

            // Update primary address
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    primaryAddressId: addressId,
                    updatedAt: new Date()
                },
                { new: true }
            );

            return updatedUser;
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to set primary address: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to set primary address');
        }
    },

    /**
     * Update user's current location
     */
    async updateUserLocation(userId: string, location: GeoLocation): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            await this.getAndValidateUser(userId);
            // Validate coordinates
            if (!location.latitude || !location.longitude) {
                throw new PresentableError('BAD_REQUEST', 'Invalid location coordinates');
            }

            // Create GeoJSON point for MongoDB
            const geoLocation = {
                type: 'Point',
                coordinates: [location.longitude, location.latitude]
            };

            // Update user location
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    currentLocation: geoLocation,
                    lastLocationUpdate: new Date(),
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

            return updatedUser;
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to update user location: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to update location');
        }
    },

    /**
     * Delete a user address
     */
    async removeUserAddress(userId: string, addressId: string): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            const user = await this.getAndValidateUser(userId);

            // Remove address
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $pull: { addresses: { id: addressId } },
                    updatedAt: new Date()
                },
                { new: true }
            );

            // Reset primary address if it was the deleted one
            if (user.primaryAddressId === addressId) {
                await UserModel.findByIdAndUpdate(
                    userId,
                    { primaryAddressId: null }
                );
            }

            return updatedUser;
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to remove user address: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to remove address');
        }
    },

    /**
     * Find users near a specific location
     * Useful for targeting nearby users for promotions
     */
    async findNearbyUsers(location: GeoLocation, maxDistanceKm: number = 5): Promise<IUser[]> {
        try {
            // Convert distance to meters
            const maxDistanceMeters = maxDistanceKm * 1000;

            // Find users near the specified location
            const users = await UserModel.find({
                currentLocation: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [location.longitude, location.latitude]
                        },
                        $maxDistance: maxDistanceMeters
                    }
                },
                isActive: true
            }).exec();

            return users;
        } catch (error: any) {
            logger.error(`Failed to find nearby users: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to find nearby users');
        }
    },

    /**
     * Update user FCM token for push notifications
     */
    async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            await this.getAndValidateUser(userId);
            await UserModel.findByIdAndUpdate(
                userId,
                {
                    fcmToken,
                    updatedAt: new Date()
                }
            );
        } catch (error: any) {
            logger.error(`Failed to update FCM token: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to update notification token');
        }
    },
    async findOne(id: string): Promise<Partial<IUser> | null> {
        return UserModel.findOne({ _id: id }).lean().exec();
    },

    /**
     * Update user profile
     */
    async updateUserProfile(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            await this.getAndValidateUser(userId);
            // Prevent updating sensitive fields directly
            delete data.passwordHash;
            delete data.roles;
            delete data.isPhoneVerified;
            delete data.phone; // Phone update usually requires OTP verification

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    ...data,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

            return updatedUser;
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to update user profile: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to update user profile');
        }
    },

    /**
     * Deactivate user account (Soft delete)
     */
    async deactivateUser(userId: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            await this.getAndValidateUser(userId);
            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    isActive: false,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!user) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }
        } catch (error: any) {
            if (error instanceof PresentableError) {
                throw error;
            }
            logger.error(`Failed to deactivate user: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to deactivate user account');
        }
    }
};

export default UserService;