import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminDocument extends Document {
  name: string;
  email: string;
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
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  roles: { type: [String], default: ['admin'] },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);