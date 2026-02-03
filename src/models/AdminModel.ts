import mongoose, { Schema, Document } from 'mongoose';
import { createSchemaOptions } from '../utils/schema.helpers';

export interface IAdminDocument extends Document {
  name: string;
  adminEmail: string;
  passwordHash: string;
  phone: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>({
  name: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  roles: { type: [String], default: ['admin'] },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
}, createSchemaOptions());

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);

// Default export for compatibility
export default AdminModel;