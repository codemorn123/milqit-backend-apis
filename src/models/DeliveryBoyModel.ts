import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryBoy {
    id: string;
    name: string;
    phone: string;
    email?: string;
    passwordHash: string;
    isActive: boolean;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Delivery-specific fields
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
    drivingLicenseNumber?: string;
    aadharNumber?: string;
    panNumber?: string;

    // Verification status
    isDocumentVerified: boolean;
    isBackgroundCheckDone: boolean;

    // Operational fields
    isAvailable: boolean;
    currentLocation?: {
        type: string;
        coordinates: number[];
    };
    lastLocationUpdate?: Date;
    deliveryZone?: string[];

    // Performance metrics
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    averageRating: number;

    // Bank details for payments
    bankAccountNumber?: string;
    ifscCode?: string;
    bankAccountHolderName?: string;
    upiId?: string;

    // Emergency contact
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

type IDeliveryBoyDocument = IDeliveryBoy & Document;

const DeliveryBoySchema = new Schema<IDeliveryBoyDocument>(
    {
        phone: {
            type: String,
            required: true,
            index: true,
            validate: {
                validator: (value: string) => {
                    return /^\+[1-9]\d{1,14}$/.test(value);
                },
                message: 'Please provide a valid phone number',
            },
            unique: true
        },
        email: {
            type: String,
            unique: true,
            index: true,
            sparse: true,
            trim: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false, // Admin approval required
            index: true
        },
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date
        },

        // Delivery-specific fields
        vehicleType: {
            type: String,
            enum: ['bike', 'scooter', 'bicycle', 'car']
        },
        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true
        },
        drivingLicenseNumber: {
            type: String,
            trim: true,
            uppercase: true
        },
        aadharNumber: {
            type: String,
            trim: true
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true
        },

        // Verification status
        isDocumentVerified: {
            type: Boolean,
            default: false
        },
        isBackgroundCheckDone: {
            type: Boolean,
            default: false
        },

        // Operational fields
        isAvailable: {
            type: Boolean,
            default: false
        },
        currentLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        lastLocationUpdate: {
            type: Date
        },
        deliveryZone: {
            type: [String],
            default: []
        },

        // Performance metrics
        totalDeliveries: {
            type: Number,
            default: 0
        },
        completedDeliveries: {
            type: Number,
            default: 0
        },
        cancelledDeliveries: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        // Bank details for payments
        bankAccountNumber: {
            type: String,
            trim: true
        },
        ifscCode: {
            type: String,
            trim: true,
            uppercase: true
        },
        bankAccountHolderName: {
            type: String,
            trim: true
        },
        upiId: {
            type: String,
            trim: true,
            lowercase: true
        },

        // Emergency contact
        emergencyContactName: {
            type: String,
            trim: true
        },
        emergencyContactPhone: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                delete ret._id;
                delete ret.__v;
                delete ret.passwordHash;
                delete ret.aadharNumber;
                delete ret.panNumber;
                delete ret.bankAccountNumber;
            },
        },
        toObject: { virtuals: true },
    }
);

// Create geospatial index for location-based queries
DeliveryBoySchema.index({ currentLocation: '2dsphere' });

// Create compound indexes for common queries
DeliveryBoySchema.index({ isActive: 1, isAvailable: 1 });
DeliveryBoySchema.index({ deliveryZone: 1, isAvailable: 1 });

export const DeliveryBoyModel = mongoose.model<IDeliveryBoyDocument>('DeliveryBoy', DeliveryBoySchema);
