// import { 
//     LiveLocationModel, 
//     ILiveLocation, 
//     IUpdateLocationRequest, 
//     IStartTrackingRequest,
//     TrackingStatus,
//     LocationType 
//   } from '../models/location.model';
//   import APIError from '../error/api-error';
//   import { StatusCodes } from 'http-status-codes';
//   import mongoose from 'mongoose';
// import redisClient from '../config/redis.config';
// //   import { redisClient } from '../config/redis';
  
//   class LocationService {
//     private readonly LOCATION_CACHE_TTL = 300; // 5 minutes
//     private readonly MAX_HISTORY_ENTRIES = 500;
  
//     /**
//      * Start tracking session
//      */
//     async startTracking(data: IStartTrackingRequest): Promise<ILiveLocation> {
//       // Check if already tracking
//       const existingTracking = await LiveLocationModel.findOne({
//         userId: data.userId,
//         status: 'active',
//         ...(data.orderId && { orderId: data.orderId })
//       });
  
//       if (existingTracking) {
//         // Update existing session
//         existingTracking.currentLocation = {
//           type: 'Point',
//           coordinates: [data.longitude, data.latitude]
//         };
//         existingTracking.sessionId = data.sessionId;
//         existingTracking.lastUpdated = new Date();
        
//         await existingTracking.save();
        
//         // Cache in Redis
//         await this.cacheLocation(existingTracking);
        
//         return existingTracking.toJSON() as ILiveLocation;
//       }
  
//       // Create new tracking session
//       const tracking = new LiveLocationModel({
//         userId: data.userId,
//         userType: data.userType,
//         orderId: data.orderId,
//         currentLocation: {
//           type: 'Point',
//           coordinates: [data.longitude, data.latitude]
//         },
//         sessionId: data.sessionId,
//         status: 'active',
//         locationHistory: [
//           {
//             coordinates: {
//               type: 'Point',
//               coordinates: [data.longitude, data.latitude]
//             },
//             timestamp: new Date()
//           }
//         ]
//       });
  
//       await tracking.save();
      
//       // Cache in Redis
//       await this.cacheLocation(tracking);
  
//       return tracking.toJSON() as ILiveLocation;
//     }
  
//     /**
//      * Update location in real-time
//      */
//     async updateLocation(data: IUpdateLocationRequest): Promise<ILiveLocation> {
//       const tracking = await LiveLocationModel.findOne({
//         userId: data.userId,
//         sessionId: data.sessionId,
//         status: 'active'
//       });
  
//       if (!tracking) {
//         throw new APIError('Active tracking session not found', StatusCodes.NOT_FOUND);
//       }
  
//       // Update current location
//       tracking.currentLocation = {
//         type: 'Point',
//         coordinates: [data.longitude, data.latitude]
//       };
      
//       tracking.lastUpdated = new Date();
      
//       // Update metadata
//       if (data.speed !== undefined) tracking.speed = data.speed;
//       if (data.accuracy !== undefined) tracking.accuracy = data.accuracy;
//       if (data.heading !== undefined) tracking.heading = data.heading;
//       if (data.batteryLevel !== undefined) tracking.batteryLevel = data.batteryLevel;
  
//       // Add to location history (keep last 500 entries)
//       tracking.locationHistory.push({
//         coordinates: {
//           type: 'Point',
//           coordinates: [data.longitude, data.latitude]
//         },
//         timestamp: new Date(),
//         speed: data.speed,
//         accuracy: data.accuracy,
//         heading: data.heading
//       });
  
//       // Limit history size
//       if (tracking.locationHistory.length > this.MAX_HISTORY_ENTRIES) {
//         tracking.locationHistory = tracking.locationHistory.slice(-this.MAX_HISTORY_ENTRIES);
//       }
  
//       await tracking.save();
      
//       // Cache in Redis
//       await this.cacheLocation(tracking);
  
//       return tracking.toJSON() as ILiveLocation;
//     }
  
//     /**
//      * Get current location from cache or DB
//      */
//     async getCurrentLocation(userId: string, orderId?: string): Promise<ILiveLocation | null> {
//       // Try cache first
//       const cacheKey = this.getCacheKey(userId, orderId);
      
//       try {
//         const cached = await redisClient.get(cacheKey);
//         if (cached) {
//           return JSON.parse(cached);
//         }
//       } catch (error) {
//         console.error('Redis get error:', error);
//       }
  
//       // Fallback to DB
//       const query: any = {
//         userId: new mongoose.Types.ObjectId(userId),
//         status: 'active'
//       };
  
//       if (orderId) {
//         query.orderId = new mongoose.Types.ObjectId(orderId);
//       }
  
//       const tracking = await LiveLocationModel.findOne(query)
//         .sort({ lastUpdated: -1 })
//         .populate('userId', 'name phone')
//         .populate('orderId', 'orderNumber');
  
//       if (tracking) {
//         await this.cacheLocation(tracking);
//         return tracking.toJSON() as ILiveLocation;
//       }
  
//       return null;
//     }
  
//     /**
//      * Stop tracking session
//      */
//     async stopTracking(userId: string, sessionId: string, orderId?: string): Promise<void> {
//       const query: any = {
//         userId: new mongoose.Types.ObjectId(userId),
//         sessionId,
//         status: 'active'
//       };
  
//       if (orderId) {
//         query.orderId = new mongoose.Types.ObjectId(orderId);
//       }
  
//       const tracking = await LiveLocationModel.findOne(query);
  
//       if (!tracking) {
//         throw new APIError('Active tracking session not found', StatusCodes.NOT_FOUND);
//       }
  
//       tracking.status = 'completed';
//       await tracking.save();
  
//       // Remove from cache
//       const cacheKey = this.getCacheKey(userId, orderId);
//       try {
//         await redisClient.del(cacheKey);
//       } catch (error) {
//         console.error('Redis delete error:', error);
//       }
//     }
  
//     /**
//      * Find nearby delivery partners
//      */
//     async findNearbyDeliveryPartners(
//       latitude: number,
//       longitude: number,
//       maxDistance: number = 5000 // meters
//     ): Promise<ILiveLocation[]> {
//       const locations = await LiveLocationModel.find({
//         userType: 'delivery_partner',
//         status: 'active',
//         currentLocation: {
//           $near: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [longitude, latitude]
//             },
//             $maxDistance: maxDistance
//           }
//         }
//       })
//       .limit(20)
//       .populate('userId', 'name phone');
  
//       return locations.map(loc => loc.toJSON()) as ILiveLocation[];
//     }
  
//     /**
//      * Get location history
//      */
//     async getLocationHistory(
//       userId: string,
//       orderId?: string,
//       startDate?: Date,
//       endDate?: Date
//     ): Promise<ILiveLocation[]> {
//       const query: any = {
//         userId: new mongoose.Types.ObjectId(userId)
//       };
  
//       if (orderId) {
//         query.orderId = new mongoose.Types.ObjectId(orderId);
//       }
  
//       const locations = await LiveLocationModel.find(query)
//         .sort({ lastUpdated: -1 })
//         .limit(100);
  
//       return locations.map(loc => loc.toJSON()) as ILiveLocation[];
//     }
  
//     /**
//      * Calculate distance between two points (Haversine formula)
//      */
//     calculateDistance(
//       lat1: number,
//       lon1: number,
//       lat2: number,
//       lon2: number
//     ): number {
//       const R = 6371e3; // Earth radius in meters
//       const φ1 = (lat1 * Math.PI) / 180;
//       const φ2 = (lat2 * Math.PI) / 180;
//       const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//       const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
//       const a =
//         Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//         Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
//       return R * c; // Distance in meters
//     }
  
//     /**
//      * Get estimated time of arrival (ETA)
//      */
//     async getETA(
//       deliveryPartnerId: string,
//       destinationLat: number,
//       destinationLon: number
//     ): Promise<{ distance: number; eta: number }> {
//       const location = await this.getCurrentLocation(deliveryPartnerId);
  
//       if (!location) {
//         throw new APIError('Delivery partner location not found', StatusCodes.NOT_FOUND);
//       }
  
//       const [lon, lat] = location.currentLocation.coordinates;
//       const distance = this.calculateDistance(lat, lon, destinationLat, destinationLon);
  
//       // Estimate ETA (assuming average speed of 30 km/h in city)
//       const averageSpeed = location.speed || 30; // km/h
//       const eta = (distance / 1000 / averageSpeed) * 60; // minutes
  
//       return {
//         distance: Math.round(distance),
//         eta: Math.round(eta)
//       };
//     }
  
//     /**
//      * Cleanup stale locations (inactive for > 30 minutes)
//      */
//     async cleanupStaleLocations(): Promise<number> {
//       const result = await LiveLocationModel.cleanupStaleLocations(30);
//       return result.modifiedCount || 0;
//     }
  
//     /**
//      * Cache location in Redis
//      */
//     private async cacheLocation(tracking: any): Promise<void> {
//       const cacheKey = this.getCacheKey(
//         tracking.userId.toString(),
//         tracking.orderId?.toString()
//       );
  
//       // try {
//       //   await redisClient.setex(
//       //     cacheKey,
//       //     this.LOCATION_CACHE_TTL,
//       //     JSON.stringify(tracking.toJSON())
//       //   );
//       // } catch (error) {
//       //   console.error('Redis set error:', error);
//       // }
//     }
  
//     /**
//      * Generate cache key
//      */
//     private getCacheKey(userId: string, orderId?: string): string {
//       return orderId 
//         ? `location:${userId}:${orderId}` 
//         : `location:${userId}`;
//     }
//   }
  
//   export const locationService = new LocationService();




import { 
  LiveLocationModel, 
  ILiveLocation, 
  IUpdateLocationRequest, 
  IStartTrackingRequest,
  TrackingStatus,
  LocationType,
  LiveLocationDocument 
} from '../models/location.model';
import APIError from '../error/api-error';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
// import redisClient from '../config/redis.config';

class LocationService {
  private readonly LOCATION_CACHE_TTL = 300; // 5 minutes
  private readonly MAX_HISTORY_ENTRIES = 500;

  /**
   * Convert LiveLocationDocument to ILiveLocation
   */
  private convertToLiveLocation(doc: LiveLocationDocument): ILiveLocation {
    const json = doc.toJSON();
    return {
      id: json.id || doc._id.toString(),
      userId: doc.userId.toString(),
      userType: doc.userType,
      orderId: doc.orderId?.toString(),
      currentLocation: {
        type: 'Point',
        coordinates: doc.currentLocation.coordinates
      },
      lastUpdated: doc.lastUpdated,
      status: doc.status,
      sessionId: doc.sessionId,
      speed: doc.speed,
      accuracy: doc.accuracy,
      heading: doc.heading,
      batteryLevel: doc.batteryLevel,
      locationHistory: doc.locationHistory.map(history => ({
        coordinates: {
          type: 'Point',
          coordinates: history.coordinates.coordinates
        },
        timestamp: history.timestamp,
        speed: history.speed,
        accuracy: history.accuracy,
        heading: history.heading
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  /**
   * Start tracking session
   */
  async startTracking(data: IStartTrackingRequest): Promise<ILiveLocation> {
    // Check if already tracking
    const existingTracking = await LiveLocationModel.findOne({
      userId: data.userId,
      status: 'active',
      ...(data.orderId && { orderId: data.orderId })
    });

    if (existingTracking) {
      // Update existing session
      existingTracking.currentLocation = {
        type: 'Point',
        coordinates: [data.longitude, data.latitude]
      };
      existingTracking.sessionId = data.sessionId;
      existingTracking.lastUpdated = new Date();
      
      await existingTracking.save();
      
      // Cache in Redis
      await this.cacheLocation(existingTracking);
      
      return this.convertToLiveLocation(existingTracking);
    }

    // Create new tracking session
    const tracking = new LiveLocationModel({
      userId: data.userId,
      userType: data.userType,
      orderId: data.orderId,
      currentLocation: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude]
      },
      sessionId: data.sessionId,
      status: 'active',
      locationHistory: [
        {
          coordinates: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude]
          },
          timestamp: new Date()
        }
      ]
    });

    await tracking.save();
    
    // Cache in Redis
    await this.cacheLocation(tracking);

    return this.convertToLiveLocation(tracking);
  }

  /**
   * Update location in real-time
   */
  async updateLocation(data: IUpdateLocationRequest): Promise<ILiveLocation> {
    const tracking = await LiveLocationModel.findOne({
      userId: data.userId,
      sessionId: data.sessionId,
      status: 'active'
    });

    if (!tracking) {
      throw new APIError('Active tracking session not found', StatusCodes.NOT_FOUND);
    }

    // Update current location
    tracking.currentLocation = {
      type: 'Point',
      coordinates: [data.longitude, data.latitude]
    };
    
    tracking.lastUpdated = new Date();
    
    // Update metadata
    if (data.speed !== undefined) tracking.speed = data.speed;
    if (data.accuracy !== undefined) tracking.accuracy = data.accuracy;
    if (data.heading !== undefined) tracking.heading = data.heading;
    if (data.batteryLevel !== undefined) tracking.batteryLevel = data.batteryLevel;

    // Add to location history (keep last 500 entries)
    tracking.locationHistory.push({
      coordinates: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude]
      },
      timestamp: new Date(),
      speed: data.speed,
      accuracy: data.accuracy,
      heading: data.heading
    });

    // Limit history size
    if (tracking.locationHistory.length > this.MAX_HISTORY_ENTRIES) {
      tracking.locationHistory = tracking.locationHistory.slice(-this.MAX_HISTORY_ENTRIES);
    }

    await tracking.save();
    
    // Cache in Redis
    await this.cacheLocation(tracking);

    return this.convertToLiveLocation(tracking);
  }

  /**
   * Get current location from cache or DB
   */
  async getCurrentLocation(userId: string, orderId?: string): Promise<ILiveLocation | null> {
    // Try cache first
    const cacheKey = this.getCacheKey(userId, orderId);
    
    try {
      // const cached = await redisClient.get(cacheKey);
      // if (cached) {
      //   return JSON.parse(cached);
      // }
    } catch (error) {
      console.error('Redis get error:', error);
    }

    // Fallback to DB
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
      status: 'active'
    };

    if (orderId) {
      query.orderId = new mongoose.Types.ObjectId(orderId);
    }

    const tracking = await LiveLocationModel.findOne(query)
      .sort({ lastUpdated: -1 })
      .populate('userId', 'name phone')
      .populate('orderId', 'orderNumber');

    if (tracking) {
      const location = this.convertToLiveLocation(tracking);
      await this.cacheLocation(tracking);
      return location;
    }

    return null;
  }

  /**
   * Stop tracking session
   */
  async stopTracking(userId: string, sessionId: string, orderId?: string): Promise<void> {
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
      sessionId,
      status: 'active'
    };

    if (orderId) {
      query.orderId = new mongoose.Types.ObjectId(orderId);
    }

    const tracking = await LiveLocationModel.findOne(query);

    if (!tracking) {
      throw new APIError('Active tracking session not found', StatusCodes.NOT_FOUND);
    }

    tracking.status = 'completed';
    await tracking.save();

    // Remove from cache
    const cacheKey = this.getCacheKey(userId, orderId);
    try {
      // await redisClient.del(cacheKey);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  /**
   * Find nearby delivery partners
   */
  async findNearbyDeliveryPartners(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000 // meters
  ): Promise<ILiveLocation[]> {
    const locations = await LiveLocationModel.find({
      userType: 'delivery_partner',
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
    })
    .limit(20)
    .populate('userId', 'name phone');

    return locations.map(loc => this.convertToLiveLocation(loc));
  }

  /**
   * Get location history
   */
  async getLocationHistory(
    userId: string,
    orderId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ILiveLocation[]> {
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    if (orderId) {
      query.orderId = new mongoose.Types.ObjectId(orderId);
    }

    if (startDate || endDate) {
      query.lastUpdated = {};
      if (startDate) query.lastUpdated.$gte = startDate;
      if (endDate) query.lastUpdated.$lte = endDate;
    }

    const locations = await LiveLocationModel.find(query)
      .sort({ lastUpdated: -1 })
      .limit(100);

    return locations.map(loc => this.convertToLiveLocation(loc));
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Get estimated time of arrival (ETA)
   */
  async getETA(
    deliveryPartnerId: string,
    destinationLat: number,
    destinationLon: number
  ): Promise<{ distance: number; eta: number }> {
    const location = await this.getCurrentLocation(deliveryPartnerId);

    if (!location) {
      throw new APIError('Delivery partner location not found', StatusCodes.NOT_FOUND);
    }

    const [lon, lat] = location.currentLocation.coordinates;
    const distance = this.calculateDistance(lat, lon, destinationLat, destinationLon);

    // Estimate ETA (assuming average speed of 30 km/h in city)
    const averageSpeed = location.speed || 30; // km/h
    const eta = (distance / 1000 / averageSpeed) * 60; // minutes

    return {
      distance: Math.round(distance),
      eta: Math.round(eta)
    };
  }

  /**
   * Cleanup stale locations (inactive for > 30 minutes)
   */
  async cleanupStaleLocations(): Promise<number> {
    const result = await LiveLocationModel.cleanupStaleLocations(30);
    return result.modifiedCount || 0;
  }

  /**
   * Cache location in Redis
   */
  private async cacheLocation(tracking: LiveLocationDocument): Promise<void> {
    const cacheKey = this.getCacheKey(
      tracking.userId.toString(),
      tracking.orderId?.toString()
    );

    try {
      const location = this.convertToLiveLocation(tracking);

      // await redisClient.setex(
      //   cacheKey,
      //   this.LOCATION_CACHE_TTL,
      //   JSON.stringify(location)
      // );
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(userId: string, orderId?: string): string {
    return orderId 
      ? `location:${userId}:${orderId}` 
      : `location:${userId}`;
  }
}

export const locationService = new LocationService();