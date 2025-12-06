










import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';

export type LocationType = 'customer' | 'delivery_partner';
export type TrackingStatus = 'active' | 'inactive' | 'completed';

// Location Point Interface (GeoJSON format) - TSOA compatible
export interface ILocationPoint {
  type: 'Point';
  coordinates: number[]; // Changed from [number, number] to number[] for TSOA compatibility
}

// For internal use with proper typing
export interface ILocationPointInternal {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Location History Entry
export interface ILocationHistory {
  coordinates: ILocationPoint;
  timestamp: Date;
  speed?: number; // km/h
  accuracy?: number; // meters
  heading?: number; // degrees
}

// Live Location Interface (for API responses)
export interface ILiveLocation {
  id: string;
  userId: string;
  userType: LocationType;
  orderId?: string;
  currentLocation: ILocationPoint;
  lastUpdated: Date;
  status: TrackingStatus;
  sessionId: string;

  // Additional metadata
  speed?: number;
  accuracy?: number;
  heading?: number;
  batteryLevel?: number;

  // Location history
  locationHistory: ILocationHistory[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface LiveLocationDocument extends IBase {
  userId: mongoose.Types.ObjectId;
  userType: LocationType;
  orderId?: mongoose.Types.ObjectId;
  currentLocation: ILocationPointInternal;
  lastUpdated: Date;
  status: TrackingStatus;
  sessionId: string;

  speed?: number;
  accuracy?: number;
  heading?: number;
  batteryLevel?: number;

  locationHistory: Array<{
    coordinates: ILocationPointInternal;
    timestamp: Date;
    speed?: number;
    accuracy?: number;
    heading?: number;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

// Request Interfaces
export interface IUpdateLocationRequest {
  userId: string;
  userType: LocationType;
  latitude: number;
  longitude: number;
  orderId?: string;
  sessionId: string;
  speed?: number;
  accuracy?: number;
  heading?: number;
  batteryLevel?: number;
}

export interface IStartTrackingRequest {
  userId: string;
  userType: LocationType;
  orderId?: string;
  latitude: number;
  longitude: number;
  sessionId: string;
}

export interface IStopTrackingRequest {
  userId: string;
  orderId?: string;
  sessionId: string;
}

export interface IGetLocationRequest {
  userId: string;
  orderId?: string;
}

export interface INearbyUsersRequest {
  longitude: number;
  latitude: number;
  maxDistance?: number;
  userType?: LocationType;
}

// Response Interfaces
export interface ILocationResponse {
  success: boolean;
  message: string;
  data?: ILiveLocation;
}

export interface ILocationListResponse {
  success: boolean;
  message: string;
  data: ILiveLocation[];
  total?: number;
}

// Define custom static methods interface
interface LiveLocationModel extends PaginateModel<LiveLocationDocument> {
  findActiveTracking(
    userId: string,
    orderId?: string
  ): Promise<LiveLocationDocument | null>;

  findNearbyUsers(
    longitude: number,
    latitude: number,
    maxDistance?: number,
    userType?: LocationType
  ): Promise<LiveLocationDocument[]>;

  cleanupStaleLocations(
    olderThanMinutes?: number
  ): Promise<{ acknowledged: boolean; modifiedCount: number; matchedCount: number }>;
}

const LocationPointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: function (coords: number[]) {
        return coords.length === 2 &&
          coords[0] >= -180 && coords[0] <= 180 && // longitude
          coords[1] >= -90 && coords[1] <= 90;     // latitude
      },
      message: 'Invalid coordinates format [longitude, latitude]'
    }
  }
}, { _id: false });

const LocationHistorySchema = new Schema({
  coordinates: {
    type: LocationPointSchema,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  speed: {
    type: Number,
    min: 0
  },
  accuracy: {
    type: Number,
    min: 0
  },
  heading: {
    type: Number,
    min: 0,
    max: 360
  }
}, { _id: false });

const LiveLocationSchema = new Schema<LiveLocationDocument, LiveLocationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userType: {
      type: String,
      enum: ['customer', 'delivery_partner'],
      required: true,
      index: true
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      index: true
    },
    currentLocation: {
      type: LocationPointSchema,
      required: true,
      index: '2dsphere' // Enable geospatial queries
    },
    lastUpdated: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
      required: true,
      index: true
    },
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    speed: {
      type: Number,
      min: 0
    },
    accuracy: {
      type: Number,
      min: 0
    },
    heading: {
      type: Number,
      min: 0,
      max: 360
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    locationHistory: {
      type: [LocationHistorySchema],
      default: [],
      // Limit history to last 500 entries
      validate: {
        validator: function (history: any[]) {
          return history.length <= 500;
        },
        message: 'Location history exceeds maximum limit'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;

        // Transform ObjectIds to strings for API responses
        if (ret.userId) ret.userId = ret.userId.toString();
        if (ret.orderId) ret.orderId = ret.orderId.toString();
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
      },
    }
  }
);

// Indexes
LiveLocationSchema.index({ userId: 1, status: 1 });
LiveLocationSchema.index({ orderId: 1, status: 1 });
LiveLocationSchema.index({ userId: 1, orderId: 1 });

// Compound index for efficient queries
LiveLocationSchema.index({
  userId: 1,
  userType: 1,
  status: 1,
  lastUpdated: -1
});

// Pre-save middleware
LiveLocationSchema.pre('save', function (next) {
  this.lastUpdated = new Date();

  // Limit location history to last 500 entries
  if (this.locationHistory.length > 500) {
    this.locationHistory = this.locationHistory.slice(-500);
  }

  next();
});

// Static methods
LiveLocationSchema.statics.findActiveTracking = function (
  userId: string,
  orderId?: string
): Promise<LiveLocationDocument | null> {
  const query: any = {
    userId: new mongoose.Types.ObjectId(userId),
    status: 'active'
  };

  if (orderId) {
    query.orderId = new mongoose.Types.ObjectId(orderId);
  }

  return this.findOne(query);
};

LiveLocationSchema.statics.findNearbyUsers = function (
  longitude: number,
  latitude: number,
  maxDistance: number = 5000, // meters
  userType?: LocationType
): Promise<LiveLocationDocument[]> {
  const query: any = {
    status: 'active',
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  };

  if (userType) {
    query.userType = userType;
  }

  return this.find(query);
};

LiveLocationSchema.statics.cleanupStaleLocations = function (
  olderThanMinutes: number = 30
): Promise<{ acknowledged: boolean; modifiedCount: number; matchedCount: number }> {
  const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);

  return this.updateMany(
    {
      status: 'active',
      lastUpdated: { $lt: cutoffTime }
    },
    {
      $set: { status: 'inactive' }
    }
  );
};

// Apply pagination plugin
// LiveLocationSchema.plugin(mongoosePaginate);

// Export the model with custom static methods
export const LiveLocationModel = mongoose.model<LiveLocationDocument, LiveLocationModel>(
  'LiveLocation',
  LiveLocationSchema
);

export default LiveLocationModel;