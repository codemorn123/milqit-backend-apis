import mongoose from 'mongoose';

export enum RoleName {
	ADMIN = 'admin',
	USER = 'user'
}

export interface IRole extends mongoose.Document {
	name: string;
}
const roleSchema = new mongoose.Schema<IRole>(
	{
		name: {
			type: String,
			required: true,
			enum: RoleName
		}
	},
	{
		timestamps: true
	}
);

export const Role = mongoose.model('Role', roleSchema);