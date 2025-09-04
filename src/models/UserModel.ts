import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile } from '../types/auth.types';

export interface IUserDocument extends Document {
  id: string; 
  email: string;
  name: string;
  phone?: string;
  passwordHash: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  toProfileDTO(): UserProfile;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, sparse: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['customer'], index: true },
    isActive: { type: Boolean, default: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Ensure virtuals are included in toJSON
        transform: (doc, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash; // Never expose password hash
      },
    },
    toObject: { virtuals: true },
  }
);

// Instance method to return a clean DTO



export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });