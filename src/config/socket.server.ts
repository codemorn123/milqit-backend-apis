import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { locationService } from '../services/location.service';
import { IUpdateLocationRequest } from '../models/location.model';
import jwt from 'jsonwebtoken';

interface AuthSocket extends Socket {
  userId?: string;
  userType?: string;
}

export class SocketServer {
  private io: Server;

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware() {
    this.io.use((socket: AuthSocket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      try {
        const decoded: any = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.JWT_SECRET || 'your-secret-key'
        );

        socket.userId = decoded.userId || decoded.id;
        socket.userType = decoded.userType || decoded.role;

        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthSocket) => {
      console.log(`✅ Client connected: ${socket.id} (User: ${socket.userId})`);

      // Join user-specific room
      if (socket.userId) {
        socket.join(`user:${socket.userId}`);
      }

      // ==================== LOCATION TRACKING EVENTS ====================

      /**
       * Start tracking session
       */
      socket.on('startTracking', async (data: {
        latitude: number;
        longitude: number;
        orderId?: string;
        sessionId: string;
      }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const tracking = await locationService.startTracking({
            userId: socket.userId,
            userType: socket.userType as any,
            latitude: data.latitude,
            longitude: data.longitude,
            orderId: data.orderId,
            sessionId: data.sessionId
          });

          // Join tracking room
          const roomName = this.getTrackingRoom(socket.userId, data.orderId);
          socket.join(roomName);

          socket.emit('trackingStarted', tracking);

          // Notify subscribers (delivery partner, customer, admin)
          this.notifySubscribers(tracking, 'trackingStarted');

          console.log(`📍 Tracking started for user ${socket.userId}`);
        } catch (error: any) {
          console.error('Start tracking error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      /**
       * Update location in real-time
       */
      socket.on('updateLocation', async (data: {
        latitude: number;
        longitude: number;
        orderId?: string;
        sessionId: string;
        speed?: number;
        accuracy?: number;
        heading?: number;
        batteryLevel?: number;
      }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          const tracking = await locationService.updateLocation({
            userId: socket.userId,
            userType: socket.userType as any,
            latitude: data.latitude,
            longitude: data.longitude,
            orderId: data.orderId,
            sessionId: data.sessionId,
            speed: data.speed,
            accuracy: data.accuracy,
            heading: data.heading,
            batteryLevel: data.batteryLevel
          });

          // Broadcast to tracking room
          const roomName = this.getTrackingRoom(socket.userId, data.orderId);
          this.io.to(roomName).emit('locationUpdate', {
            userId: socket.userId,
            userType: socket.userType,
            latitude: data.latitude,
            longitude: data.longitude,
            speed: data.speed,
            heading: data.heading,
            accuracy: data.accuracy,
            batteryLevel: data.batteryLevel,
            timestamp: new Date()
          });

          // Calculate and emit ETA if delivery partner
          if (socket.userType === 'delivery_partner' && data.orderId) {
            // Get order delivery address and calculate ETA
            // (implement based on your order model)
          }

          console.log(`📍 Location updated for user ${socket.userId}`);
        } catch (error: any) {
          console.error('Update location error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      /**
       * Subscribe to track another user (customer tracks delivery partner)
       */
      socket.on('subscribeTracking', async (data: {
        targetUserId: string;
        orderId?: string;
      }) => {
        try {
          // Join tracking room
          const roomName = this.getTrackingRoom(data.targetUserId, data.orderId);
          socket.join(roomName);

          // Send current location
          const location = await locationService.getCurrentLocation(
            data.targetUserId,
            data.orderId
          );

          if (location) {
            socket.emit('currentLocation', location);
          }

          console.log(`👀 User ${socket.userId} subscribed to track ${data.targetUserId}`);
        } catch (error: any) {
          console.error('Subscribe tracking error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      /**
       * Unsubscribe from tracking
       */
      socket.on('unsubscribeTracking', (data: {
        targetUserId: string;
        orderId?: string;
      }) => {
        const roomName = this.getTrackingRoom(data.targetUserId, data.orderId);
        socket.leave(roomName);
        console.log(`👋 User ${socket.userId} unsubscribed from tracking ${data.targetUserId}`);
      });

      /**
       * Stop tracking session
       */
      socket.on('stopTracking', async (data: {
        sessionId: string;
        orderId?: string;
      }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'User not authenticated' });
            return;
          }

          await locationService.stopTracking(
            socket.userId,
            data.sessionId,
            data.orderId
          );

          // Leave tracking room
          const roomName = this.getTrackingRoom(socket.userId, data.orderId);
          this.io.to(roomName).emit('trackingStopped', {
            userId: socket.userId,
            timestamp: new Date()
          });

          socket.leave(roomName);
          socket.emit('trackingStopped', { success: true });

          console.log(`🛑 Tracking stopped for user ${socket.userId}`);
        } catch (error: any) {
          console.error('Stop tracking error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      /**
       * Get nearby delivery partners
       */
      socket.on('findNearbyDeliveryPartners', async (data: {
        latitude: number;
        longitude: number;
        maxDistance?: number;
      }) => {
        try {
          const partners = await locationService.findNearbyDeliveryPartners(
            data.latitude,
            data.longitude,
            data.maxDistance
          );

          socket.emit('nearbyDeliveryPartners', partners);
        } catch (error: any) {
          console.error('Find nearby partners error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      /**
       * Get ETA
       */
      socket.on('getETA', async (data: {
        deliveryPartnerId: string;
        destinationLat: number;
        destinationLon: number;
      }) => {
        try {
          const eta = await locationService.getETA(
            data.deliveryPartnerId,
            data.destinationLat,
            data.destinationLon
          );

          socket.emit('etaCalculated', eta);
        } catch (error: any) {
          console.error('Get ETA error:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // ==================== DISCONNECT ====================

      socket.on('disconnect', (reason) => {
        console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`);
      });
    });
  }

  /**
   * Get tracking room name
   */
  private getTrackingRoom(userId: string, orderId?: string): string {
    return orderId ? `tracking:${userId}:${orderId}` : `tracking:${userId}`;
  }

  /**
   * Notify subscribers about tracking events
   */
  private notifySubscribers(tracking: any, event: string) {
    if (tracking.orderId) {
      // Notify everyone subscribed to this order
      this.io.to(`order:${tracking.orderId}`).emit(event, tracking);
    }
  }

  /**
   * Get Socket.IO instance
   */
  public getIO(): Server {
    return this.io;
  }
}

export let socketServer: SocketServer;

export const initializeSocketServer = (httpServer: HTTPServer): SocketServer => {
  socketServer = new SocketServer(httpServer);
  return socketServer;
};