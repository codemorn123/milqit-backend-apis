import cron from 'node-cron';
import { marketingService } from '../services/marketing.service';
import { logger } from '../config/logger';

export const initMarketingCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            // logger.info('Running marketing campaign cron...');
            await marketingService.processPendingCampaigns();
        } catch (error) {
            logger.error('Error running marketing cron:', error as any);
        }
    });

    logger.info('Marketing cron initialized (running every minute)');
};
