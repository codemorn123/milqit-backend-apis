import * as admin from 'firebase-admin';
import { config } from '../config';
import { logger } from '../config/logger';
import { DeviceModel } from '../models/device.model';

export class FCMService {
    private static instance: FCMService;
    private initialized: boolean = false;

    private constructor() {
        this.initialize();
    }

    public static getInstance(): FCMService {
        if (!FCMService.instance) {
            FCMService.instance = new FCMService();
        }
        return FCMService.instance;
    }

    private initialize() {
        try {
            if (this.initialized) return;

            const serviceAccountKey = config.firebase.serviceAccountKey;

            if (!serviceAccountKey) {
                logger.warn('Firebase Service Account Key not provided. FCM will not work.');
                return;
            }

            let serviceAccount;
            // Check if it's a path or JSON string
            if (serviceAccountKey.trim().startsWith('{')) {
                serviceAccount = JSON.parse(serviceAccountKey);
            } else {
                // If it's a path, we might need to require it, but for security and simplicity in env vars, 
                // we usually prefer JSON string or path handling. 
                // For now, let's assume it's a JSON string or we handle path later if needed.
                // If it's a path, `admin.credential.cert(require(path))` would work.
                // But let's stick to JSON content for env var usage usually.
                // If it is a path, we can try to read it.
                // For safety, let's assume it's JSON content for now as per plan.
                logger.warn('Firebase key provided but does not look like JSON. Assuming it is a path is risky without fs.');
                // If user provides path, we can't easily require it dynamically in TS without issues sometimes.
                // Let's assume it's the JSON content.
            }

            if (serviceAccount) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                this.initialized = true;
                logger.info('Firebase Admin initialized successfully');
            }
        } catch (error: any) {
            logger.error(`Failed to initialize Firebase Admin: ${error.message}`);
        }
    }

    /**
     * Register or update a device token
     */
    async registerDevice(userId: string, deviceToken: string, platform: 'android' | 'ios' | 'web') {
        try {
            await DeviceModel.findOneAndUpdate(
                { deviceToken },
                {
                    userId,
                    deviceToken,
                    platform,
                    isActive: true,
                    lastActiveAt: new Date()
                },
                { upsert: true, new: true }
            );
            logger.info(`Device registered for user ${userId}`);
        } catch (error: any) {
            logger.error(`Error registering device: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove a device token (logout)
     */
    async removeDevice(deviceToken: string) {
        try {
            await DeviceModel.findOneAndUpdate(
                { deviceToken },
                { isActive: false }
            );
            logger.info(`Device token removed: ${deviceToken}`);
        } catch (error: any) {
            logger.error(`Error removing device: ${error.message}`);
            throw error;
        }
    }

    /**
     * Send notification to a specific user
     */
    async sendToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
        if (!this.initialized) {
            logger.warn('FCM not initialized, skipping notification');
            return;
        }

        try {
            const devices = await DeviceModel.find({ userId, isActive: true });
            if (!devices.length) return;

            const tokens = devices.map(d => d.deviceToken);

            const message: admin.messaging.MulticastMessage = {
                tokens,
                notification: {
                    title,
                    body
                },
                data,
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        channelId: 'default'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1
                        }
                    }
                }
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            // Handle failed tokens
            if (response.failureCount > 0) {
                const failedTokens: string[] = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                    }
                });

                if (failedTokens.length > 0) {
                    // Deactivate failed tokens
                    await DeviceModel.updateMany(
                        { deviceToken: { $in: failedTokens } },
                        { isActive: false }
                    );
                    logger.info(`Deactivated ${failedTokens.length} failed device tokens`);
                }
            }

            logger.info(`Notification sent to user ${userId}: ${response.successCount} success, ${response.failureCount} failed`);

        } catch (error: any) {
            logger.error(`Error sending notification: ${error.message}`);
        }
    }

    /**
     * Send notification to multiple users
     */
    async sendToUsers(userIds: string[], title: string, body: string, data?: Record<string, string>) {
        // Implementation for bulk sending if needed
        // For now, loop or use multicast with all tokens
        // But multicast has limit of 500 tokens.
        // Better to iterate users or batch tokens.
        for (const userId of userIds) {
            await this.sendToUser(userId, title, body, data);
        }
    }
    /**
     * Send notification to a topic
     */
    async sendToTopic(topic: string, notification: { title: string; body: string; imageUrl?: string; data?: any }): Promise<void> {
        try {
            const message: admin.messaging.Message = {
                topic: topic,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        channelId: 'marketing_channel'
                    }
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            contentAvailable: true
                        }
                    }
                }
            };

            const response = await admin.messaging().send(message);
            logger.info(`Successfully sent message to topic ${topic}: ${response}`);
        } catch (error) {
            logger.error(`Error sending message to topic ${topic}:`, error as any);
            // We don't throw here to avoid stopping the campaign processing loop
        }
    }
}

export const fcmService = FCMService.getInstance();
