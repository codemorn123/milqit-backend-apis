import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IPermission {
	permissionCode: string;
	category: string;
	subCategory?: string;
	description: string;
	platform: string;
}

export enum Platform {
	APP = 'APP',
	Backend = 'BACKEND',
	AdminPortalWeb = 'ADMIN_PORTAL_WEB',
	AdminPortalBackend = 'ADMIN_PORTAL_BACKEND'
}

export enum Category {
	User = 'USER',
	AdminDashboard = 'ADMIN_DASHBOARD'
}

const permissionSchema = new Schema<IPermission>(
	{
		permissionCode: {
			type: String,
			unique: true,
			index: true,
			required: true
		},
		platform: { type: String, enum: Platform, required: true },
		category: { type: String, enum: Category, required: true },
		description: { type: String, required: true },
		subCategory: { type: String, required: false }
	},
	{ timestamps: true }
);

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);