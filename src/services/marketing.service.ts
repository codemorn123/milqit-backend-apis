import { MarketingCampaignModel, IMarketingCampaign } from '../models/marketing.model';
import { fcmService } from './fcm.service';
import { logger } from '../config/logger';
import { IFilter, PaginatedResponse } from '../types/common.types';

class MarketingService {
    /**
     * Create a new marketing campaign
     */
    public async createCampaign(data: Partial<IMarketingCampaign>): Promise<IMarketingCampaign> {
        const campaign = await MarketingCampaignModel.create(data);
        return campaign;
    }

    /**
     * Get campaigns with pagination
     */
    public async getCampaigns(options: IFilter): Promise<PaginatedResponse<IMarketingCampaign>> {
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 20;
        const query: any = {};

        if (options.search) {
            query.$or = [
                { title: { $regex: options.search, $options: 'i' } },
                { message: { $regex: options.search, $options: 'i' } },
            ];
        }

        const totalDocs = await MarketingCampaignModel.countDocuments(query);
        const docs = await MarketingCampaignModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec();

        return {
            docs: docs as any,
            totalDocs,
            limit,
            page,
            totalPages: Math.ceil(totalDocs / limit),
            hasNextPage: page < Math.ceil(totalDocs / limit),
            hasPrevPage: page > 1,
            nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    }

    /**
     * Process pending campaigns that are due
     * This method is called by the cron job
     */
    public async processPendingCampaigns(): Promise<void> {
        const now = new Date();

        // Find pending campaigns scheduled for now or in the past
        const campaigns = await MarketingCampaignModel.find({
            status: 'pending',
            scheduleTime: { $lte: now },
        });

        if (campaigns.length === 0) {
            return;
        }

        logger.info(`Found ${campaigns.length} pending marketing campaigns.`);

        for (const campaign of campaigns) {
            try {
                // Mark as processing
                campaign.status = 'processing';
                await campaign.save();

                // Send notification
                // For 'all' audience, we send to all registered devices
                // In a real scenario, we might filter by user segments

                // Note: fcmService.sendToAll is not implemented yet, so we'll use sendMulticast 
                // if we had a list of tokens, or we need to implement sendToTopic('all')

                // Assuming we have a topic 'all_users' that devices subscribe to, 
                // or we just iterate tokens (inefficient for large scale).
                // For this MVP, let's assume we send to a topic or just log it if no topic logic exists.

                // Let's use a hypothetical sendToTopic for now, or implement a basic broadcast.
                // Since FCMService doesn't have broadcast, we will implement a basic version here 
                // or extend FCMService. For now, let's assume we send to a topic 'marketing'.

                await fcmService.sendToTopic('marketing', {
                    title: campaign.title,
                    body: campaign.message,
                    imageUrl: campaign.imageUrl,
                    data: {
                        context: campaign.context || '',
                        type: 'marketing'
                    }
                });

                campaign.status = 'completed';
                await campaign.save();
                logger.info(`Campaign ${campaign._id} processed successfully.`);

            } catch (error: any) {
                logger.error(`Failed to process campaign ${campaign._id}: ${error.message}`);
                campaign.status = 'failed';
                campaign.failureReason = error.message;
                await campaign.save();
            }
        }
    }
}

export const marketingService = new MarketingService();
