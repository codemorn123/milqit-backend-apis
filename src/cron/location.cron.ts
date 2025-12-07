import cron from 'node-cron';
import { locationService } from '../services/location.service';
import { logger } from '../config/logger';

export const initLocationCron = () => {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        try {
            const cleaned = await locationService.cleanupStaleLocations();
            logger.info(`🧹 Cleaned up ${cleaned} stale location records`);
        } catch (error) {
            logger.error('Cleanup error:', error as any);
        }
    });

    logger.info('Location cleanup cron initialized (running every 10 minutes)');
};
