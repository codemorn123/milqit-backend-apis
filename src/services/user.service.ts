

// import { IUserDocument, UserModel } from '../models/UserModel';
import { CreateUserInput, UpdateUserInput } from '@/schemas/userSchemas';
import { PresentableError } from '../error/clientErrorHelper';
import bcrypt from 'bcrypt';
import { logger } from '../config/logger';
import mongoose, { FlattenMaps } from 'mongoose';
import { GeoLocation } from './../types/location.types';
import { UserProfile } from './../types/auth.types';
import { IUser, UserModel } from '../models/UserModel';


const UserService = {
    /**
     * Find a user by email
     */
    async findUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email: email.toLowerCase() }).exec();
    },

    /**
     * Find a user by phone number
     */
    async findUserByPhone(phone: string): Promise<IUser | null> {
        return UserModel.findOne({ phone }).exec();
    },

    /**
     * Get an active user by email
     */
    async getActiveUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email: email.toLowerCase(), isActive: true }).exec();
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




    // async createCustomerUser(data: CreateUserInput): Promise<IUser> {
    //     try {
    //         const passwordHash = await bcrypt.hash(data.password, 12);
    //         const finalEmail = (data.email && data.email.trim() !== "") 
    //         ? data.email.toLowerCase() 
    //         : null
    //         const finalPhone = data.phone || data.mobileNumber || undefined;

    //         const user = new UserModel({
    //             ...data,
    //             // Explicitly remove the plain-text password from the data object
    //             password: undefined, 
    //             // Safely handle null values for email
    //             email: finalEmail,
    //             passwordHash,
    //             isEmailVerified: false,
    //             isNewUser:data.isNewUser,
    //             phone: finalPhone,
    //             mobileNumber: finalPhone,
    //             // A user created via OTP should have their phone marked as verified
    //             isPhoneVerified: !!data.phone,
    //             roles: data.roles || ['customer'],
    //             createdAt: new Date(),
    //             updatedAt: new Date()
    //         });

    //         await user.save();
    //         logger.info(`User created: ${user.id}`);
    //         return user;
    //     } catch (error: any) {
    //         // --- Enhanced Error Logging ---
    //         logger.error('--- DETAILED USER CREATION ERROR ---');
    //         logger.error(`Error Name: ${error.name}`);
    //         logger.error(`Error Code: ${error.code}`);
    //         logger.error(`Error Message: ${error.message}`);
    //         // This will print the entire error object to your console for detailed debugging
    //         logger.error(`Full Error Object: ${JSON.stringify(error, null, 2)}`);
    //         logger.error('------------------------------------');

    //         // Handle duplicate key errors more dynamically
    //         if (error.code === 11000) { 
    //             const duplicatedField = Object.keys(error.keyValue)[0];
    //             throw new PresentableError('CONFLICT', `User with this ${duplicatedField} already exists`);
    //         }
    //         if (error.name === 'ValidationError') {
    //             const validationMessage = Object.values(error.errors).map((e: any) => e.message).join(', ');
    //             throw new PresentableError('VALIDATION_ERROR', validationMessage);
    //         }

    //         throw new PresentableError('SERVER_ERROR', 'Failed to create user account');
    //     }
    // },


    //     async createCustomerUser(data: CreateUserInput): Promise<IUser> {
    //         // This value is needed in the catch block, so we define it here.
    //         const finalPhone = data.phone || data.mobileNumber || undefined;



    //         try {
    //             const passwordHash = await bcrypt.hash(data.password, 12);
    //             const { email, password, ...restOfData } = data;

    // // This logic is already correct!
    // const finalEmail = (email && email.trim() !== "") 
    //     ? email.toLowerCase() 
    //     : null;



    //             // Defensively treat an empty string as null to work with the sparse index.


    //             const user = new UserModel({
    //                 ...restOfData,
    //                 password: undefined, // Remove plain-text password
    //                 email: finalEmail,
    //                 // Ensure both phone fields are consistent to avoid conflicts
    //                 phone: finalPhone,
    //                 // mobileNumber: finalPhone,
    //                 passwordHash,
    //                 isEmailVerified: false,
    //                 // isNewUser will be handled by the Mongoose schema's default:true
    //                 isPhoneVerified: !!finalPhone,
    //                 roles: data.roles || ['customer'],
    //                 // timestamps:true in schema handles createdAt/updatedAt
    //             });

    //             await user.save();
    //             logger.info(`User created: ${user.id}`);
    //             return user;
    //         } catch (error: any) {
    //             // --- Enhanced Error Logging ---
    //             logger.error('--- DETAILED USER CREATION ERROR ---');
    //             logger.error(`Error Name: ${error.name}`);
    //             logger.error(`Error Code: ${error.code}`);
    //             logger.error(`Error Message: ${error.message}`);
    //             logger.error(`Full Error Object: ${JSON.stringify(error, null, 2)}`);
    //             logger.error('------------------------------------');

    //             // --- ROBUSTNESS FIX: Handle account merge scenario ---
    //             // This block handles the specific case where a user signs up with a new phone number
    //             // but provides an email that already exists in the system.
    //             if (error.code === 11000 && error.keyValue.email) {
    //                 logger.info('Attempting to merge account due to duplicate email on phone signup.');
    //                 const existingUser = await UserModel.findOne({ email: error.keyValue.email });

    //                 if (!existingUser) {
    //                     // This should not happen if the index is correct, but as a safeguard:
    //                     throw new PresentableError('CONFLICT', 'User with this email already exists, but could not be found.');
    //                 }

    //                 // If the existing user already has a phone number, we cannot automatically merge.
    //                 if (existingUser.phone && existingUser.phone !== finalPhone) {
    //                     throw new PresentableError('CONFLICT', 'This email is already linked to a different phone number.');
    //                 }

    //                 // The existing user has no phone, so we can add this one.
    //                 existingUser.phone = finalPhone;
    //                 existingUser.mobileNumber = finalPhone;
    //                 existingUser.isPhoneVerified = true;
    //                 await existingUser.save();

    //                 logger.info(`Successfully merged phone number ${finalPhone} into user account ${existingUser.id}`);
    //                 return existingUser;
    //             }

    //             // Handle other duplicate key errors (e.g., phone number)
    //             if (error.code === 11000) { 
    //                 const duplicatedField = Object.keys(error.keyValue)[0];
    //                 throw new PresentableError('CONFLICT', `User with this ${duplicatedField} already exists`);
    //             }
    //             if (error.name === 'ValidationError') {
    //                 const validationMessage = Object.values(error.errors).map((e: any) => e.message).join(', ');
    //                 throw new PresentableError('VALIDATION_ERROR', validationMessage);
    //             }

    //             throw new PresentableError('SERVER_ERROR', 'Failed to create user account');
    //         }
    //     }


    async createCustomerUser(data: CreateUserInput): Promise<IUser> {
        const { email, password, ...restOfData } = data;
        const finalPhone = data.phone || data.mobileNumber;

        if (!finalPhone) {
            throw new PresentableError('VALIDATION_ERROR', 'A phone number is required to create an account.');
        }

        try {
            const passwordHash = await bcrypt.hash(password, 12);

            // Defensively treat an empty or whitespace email as null to work with the sparse unique index.
            const finalEmail = (email && email.trim() !== "")
                ? email.toLowerCase()
                : null;

            const user = new UserModel({
                ...restOfData,
                email: finalEmail,
                phone: finalPhone,
                mobileNumber: finalPhone, // BUG FIX: Ensure this is always set for consistency.
                passwordHash,
                isEmailVerified: false,
                isPhoneVerified: !!finalPhone,
                roles: data.roles || ['customer'],
            });

            await user.save();
            logger.info(`User created successfully: ${user.id}`);
            return user;

        } catch (error: any) {
            logger.error('--- DETAILED USER CREATION ERROR ---',
                error.keyValue
            );

            // ROBUST FEATURE: Handle account merge when a new phone signup uses an existing email.
            if (error.code === 11000 && error.keyValue.email) {
                logger.info(`Duplicate email detected. Attempting to merge account for email: ${error.keyValue.email}`);
                const existingUser = await UserModel.findOne({ email: error.keyValue.email });

                if (!existingUser) {
                    throw new PresentableError('CONFLICT', 'User with this email already exists, but could not be found.');
                }
                if (existingUser.phone && existingUser.phone !== finalPhone) {
                    throw new PresentableError('CONFLICT', 'This email is already linked to a different phone number.');
                }

                // Merge phone number into the existing email account.
                existingUser.phone = finalPhone;
                existingUser.mobileNumber = finalPhone;
                existingUser.isPhoneVerified = true;
                await existingUser.save();

                logger.info(`Successfully merged phone ${finalPhone} into user account ${existingUser.id}`);
                return existingUser;
            }

            // Handle other duplicate key errors (e.g., phone number).
            if (error.code === 11000) {
                const duplicatedField = Object.keys(error.keyValue)[0];
                throw new PresentableError('CONFLICT', `An account with this ${duplicatedField} already exists.`);
            }
            if (error.name === 'ValidationError') {
                const validationMessage = Object.values(error.errors).map((e: any) => e.message).join(', ');
                throw new PresentableError('VALIDATION_ERROR', validationMessage);
            }

            throw new PresentableError('SERVER_ERROR', 'Failed to create user account.');
        }


        // ... other user service methods (findUserByPhone, updateLastLogin, etc.)
    }
    ,
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
     * Update user profile
     */
    async updateUserProfile(userId: string, data: UpdateUserInput): Promise<IUser | null> {
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
    async addUserAddress(userId: string, address: any): Promise<IUser | null> {
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
    async setPrimaryAddress(userId: string, addressId: string): Promise<IUser | null> {
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
    async updateUserLocation(userId: string, location: GeoLocation): Promise<IUser | null> {
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
    async removeUserAddress(userId: string, addressId: string): Promise<IUser | null> {
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
    }
};

export default UserService;