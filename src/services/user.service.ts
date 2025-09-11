// import { IUserDocument, UserModel } from './../models/UserModel';
// import { CreateUserInput } from '@/schemas/userSchemas';
// import { ApiError } from './../utils/errorHandler';
// import bcrypt from 'bcrypt';

//  const UserService = {
//     async findUserByEmail(email: string): Promise<IUserDocument | null> {
//         return UserModel.findOne({ email: email.toLowerCase() }).exec();
//     },

//     async findUserByPhone(phone: string): Promise<IUserDocument | null> {
//         return UserModel.findOne({ phone }).exec();
//     },

//     async getActiveUserByEmail(email: string): Promise<IUserDocument | null> {
//         return UserModel.findOne({ email: email.toLowerCase(), isActive: true }).exec();
//     },
    
//     async getActiveUserById(id: string): Promise<IUserDocument | null> {
//         return UserModel.findById(id).where('isActive', true).exec();
//     },

//     async checkIfUserExists(email: string, phone?: string): Promise<void> {
//         if (await this.findUserByEmail(email)) {
//             throw ApiError.conflict('Email already registered');
//         }
//         if (phone && (await this.findUserByPhone(phone))) {
//             throw ApiError.conflict('Phone number already registered');
//         }
//     },

//     async createUser(data: CreateUserInput, isBootstrapAdmin = false): Promise<IUserDocument> {
//         const passwordHash = await bcrypt.hash(data.password, 12);
        
//         const user = new UserModel({
//             ...data,
//             passwordHash,
//             isEmailVerified: isBootstrapAdmin, // Auto-verify bootstrap admin
//             isPhoneVerified: isBootstrapAdmin && !!data.phone,
//         });

//         await user.save();
//         return user;
//     },
    
//     async updateLastLogin(userId: string): Promise<void> {
//         await UserModel.findByIdAndUpdate(userId, { lastLogin: new Date() });
//     },

//     async countAdmins(): Promise<number> {
//         return UserModel.countDocuments({ roles: 'admin' }).exec();
//     },

//     async verifyAdminPrivileges(userId: string): Promise<void> {
//         const user = await UserModel.findById(userId);
//         if (!user || !user.roles.includes('admin')) {
//             throw ApiError.forbidden('You do not have permission to perform this action');
//         }
//     }
// };


// export default UserService;




import { IUserDocument, UserModel } from '../models/UserModel';
import { CreateUserInput, UpdateUserInput } from '@/schemas/userSchemas';
import { ApiError } from '../utils/errorHandler';
import { PresentableError } from '../error/clientErrorHelper';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';
import mongoose from 'mongoose';
import { UserProfile } from '@/types/auth.types';
import { GeoLocation } from './../types/location.types';


const UserService = {
    /**
     * Find a user by email
     */
    async findUserByEmail(email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase() }).exec();
    },

    /**
     * Find a user by phone number
     */
    async findUserByPhone(phone: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ phone }).exec();
    },

    /**
     * Get an active user by email
     */
    async getActiveUserByEmail(email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase(), isActive: true }).exec();
    },
    
    /**
     * Get an active user by ID
     */
    async getActiveUserById(id: string): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return UserModel.findById(id).where('isActive', true).exec();
    },

    /**
     * Check if a user with the given email or phone already exists
     */
    async checkIfUserExists(email: string, phone?: string): Promise<void> {
        if (await this.findUserByEmail(email)) {
            throw new PresentableError('CONFLICT', 'Email already registered');
        }
        if (phone && (await this.findUserByPhone(phone))) {
            throw new PresentableError('CONFLICT', 'Phone number already registered');
        }
    },

    /**
     * Create a new user
     */
    async createUser(data: CreateUserInput, isBootstrapAdmin = false): Promise<IUserDocument> {
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
     * Update user profile
     */
    async updateUserProfile(userId: string, data: UpdateUserInput): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            // Get current user data
            const user = await this.getActiveUserById(userId);
            if (!user) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

            // Prevent updating email if it's different and already exists
            if (data.email && data.email !== user.email) {
                const existingUser = await this.findUserByEmail(data.email);
                if (existingUser && existingUser.id !== userId) {
                    throw new PresentableError('CONFLICT', 'Email already in use');
                }
            }

            // Prevent updating phone if it's different and already exists
            if (data.phone && data.phone !== user.phone) {
                const existingUser = await this.findUserByPhone(data.phone);
                if (existingUser && existingUser.id !== userId) {
                    throw new PresentableError('CONFLICT', 'Phone number already in use');
                }
            }

            // Update the user
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {
                    ...data,
                    email: data?.email?.toLowerCase(),
                    updatedAt: new Date()
                },
                { new: true }
            );

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
     * Update user's saved addresses
     */
    async addUserAddress(userId: string, address: any): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            const user = await this.getActiveUserById(userId);
            if (!user) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

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
    async setPrimaryAddress(userId: string, addressId: string): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            const user = await this.getActiveUserById(userId);
            if (!user) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

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
    async updateUserLocation(userId: string, location: GeoLocation): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
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
    async removeUserAddress(userId: string, addressId: string): Promise<IUserDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid user ID');
        }

        try {
            const user = await this.getActiveUserById(userId);
            if (!user) {
                throw new PresentableError('NOT_FOUND', 'User not found');
            }

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
    async findNearbyUsers(location: GeoLocation, maxDistanceKm: number = 5): Promise<IUserDocument[]> {
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
    }
};

export default UserService;