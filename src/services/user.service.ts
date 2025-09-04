import { IUserDocument, UserModel } from './../models/UserModel';
import { CreateUserInput } from '@/schemas/userSchemas';
import { ApiError } from './../utils/errorHandler';
import bcrypt from 'bcrypt';

 const UserService = {
    async findUserByEmail(email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase() }).exec();
    },

    async findUserByPhone(phone: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ phone }).exec();
    },

    async getActiveUserByEmail(email: string): Promise<IUserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase(), isActive: true }).exec();
    },
    
    async getActiveUserById(id: string): Promise<IUserDocument | null> {
        return UserModel.findById(id).where('isActive', true).exec();
    },

    async checkIfUserExists(email: string, phone?: string): Promise<void> {
        if (await this.findUserByEmail(email)) {
            throw ApiError.conflict('Email already registered');
        }
        if (phone && (await this.findUserByPhone(phone))) {
            throw ApiError.conflict('Phone number already registered');
        }
    },

    async createUser(data: CreateUserInput, isBootstrapAdmin = false): Promise<IUserDocument> {
        const passwordHash = await bcrypt.hash(data.password, 12);
        
        const user = new UserModel({
            ...data,
            passwordHash,
            isEmailVerified: isBootstrapAdmin, // Auto-verify bootstrap admin
            isPhoneVerified: isBootstrapAdmin && !!data.phone,
        });

        await user.save();
        return user;
    },
    
    async updateLastLogin(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { lastLogin: new Date() });
    },

    async countAdmins(): Promise<number> {
        return UserModel.countDocuments({ roles: 'admin' }).exec();
    },

    async verifyAdminPrivileges(userId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user || !user.roles.includes('admin')) {
            throw ApiError.forbidden('You do not have permission to perform this action');
        }
    }
};


export default UserService;