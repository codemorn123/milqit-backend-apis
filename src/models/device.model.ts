import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice {
    userId: mongoose.Types.ObjectId;
    deviceToken: string;
    platform: 'android' | 'ios' | 'web';
    isActive: boolean;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeviceDocument extends Document, IDevice { }

const DeviceSchema = new Schema<DeviceDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        deviceToken: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        platform: {
            type: String,
            enum: ['android', 'ios', 'web'],
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastActiveAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index to quickly find user's active devices
DeviceSchema.index({ userId: 1, isActive: 1 });

export const DeviceModel = mongoose.model<DeviceDocument>('Device', DeviceSchema);
export default DeviceModel;
