import mongoose from 'mongoose';
import { logger } from '../config/logger';
import { UserModel } from '../models/UserModel';
import Product from '../models/product.model';
import { CategoryModel } from '../models/category.model';
import Order from '../models/order.model';
import Cart from '../models/CartModel';
import Notification from '../models/cms/notification.model';
import Banner from '../models/banner.model';
import { DeliveryBoyModel } from '../models/DeliveryBoyModel';
import LiveLocation from '../models/location.model';

/**
 * Database Index Setup Script
 * Run this to ensure all performance-critical indexes exist
 */

export async function setupDatabaseIndexes() {
    logger.info('Setting up database indexes...');

    try {
        // User Indexes
        await UserModel.collection.createIndex({ phone: 1 }, { unique: true, sparse: true });
        await UserModel.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
        await UserModel.collection.createIndex({ isActive: 1 });
        await UserModel.collection.createIndex({ createdAt: -1 });
        await UserModel.collection.createIndex({ 'addresses.isPrimary': 1 });
        logger.info('✅ User indexes created');

        // Product Indexes
        await Product.collection.createIndex({ slug: 1 }, { unique: true });
        await Product.collection.createIndex({ isActive: 1, inStock: 1 });
        await Product.collection.createIndex({ category: 1, isActive: 1 });
        await Product.collection.createIndex({ sellingPrice: 1 });
        await Product.collection.createIndex({ mrp: 1 });
        await Product.collection.createIndex({ createdAt: -1 });
        // Text search index
        await Product.collection.createIndex(
            { name: 'text', description: 'text' },
            { weights: { name: 10, description: 5 } }
        );
        logger.info('✅ Product indexes created');

        // Category Indexes
        await CategoryModel.collection.createIndex({ slug: 1 }, { unique: true });
        await CategoryModel.collection.createIndex({ isActive: 1 });
        await CategoryModel.collection.createIndex({ parentCategory: 1 });
        await CategoryModel.collection.createIndex({ createdAt: -1 });
        logger.info('✅ Category indexes created');

        // Order Indexes
        await Order.collection.createIndex({ userId: 1, createdAt: -1 });
        await Order.collection.createIndex({ orderNumber: 1 }, { unique: true });
        await Order.collection.createIndex({ orderStatus: 1 });
        await Order.collection.createIndex({ 'payment.status': 1 });
        await Order.collection.createIndex({ createdAt: -1 });
        await Order.collection.createIndex({ deliveryBoy: 1 });
        logger.info('✅ Order indexes created');

        // Cart Indexes
        await Cart.collection.createIndex({ userId: 1 }, { unique: true });
        await Cart.collection.createIndex({ 'items.productId': 1 });
        await Cart.collection.createIndex({ updatedAt: -1 });
        logger.info('✅ Cart indexes created');

        // Notification Indexes
        await Notification.collection.createIndex({ userId: 1, createdAt: -1 });
        await Notification.collection.createIndex({ isRead: 1, userId: 1 });
        await Notification.collection.createIndex({ type: 1 });
        await Notification.collection.createIndex({ createdAt: -1 });
        logger.info('✅ Notification indexes created');

        // Banner Indexes
        await Banner.collection.createIndex({ isActive: 1 });
        await Banner.collection.createIndex({ position: 1 });
        await Banner.collection.createIndex({ startDate: 1, endDate: 1 });
        logger.info('✅ Banner indexes created');

        // Delivery Boy Indexes
        await DeliveryBoyModel.collection.createIndex({ phone: 1 }, { unique: true });
        await DeliveryBoyModel.collection.createIndex({ email: 1 }, { sparse: true });
        await DeliveryBoyModel.collection.createIndex({ isActive: 1 });
        await DeliveryBoyModel.collection.createIndex({ verificationStatus: 1 });
        // Geospatial index for location-based queries
        await DeliveryBoyModel.collection.createIndex({ 'location.coordinates': '2dsphere' });
        logger.info('✅ Delivery Boy indexes created');

        // Live Location Indexes (if model exists)
        if (LiveLocation) {
            await LiveLocation.collection.createIndex({ userId: 1, isActive: 1 });
            await LiveLocation.collection.createIndex({ orderId: 1 });
            await LiveLocation.collection.createIndex({ sessionId: 1 });
            await LiveLocation.collection.createIndex({ updatedAt: -1 });
            // Geospatial index
            await LiveLocation.collection.createIndex({ 'location.coordinates': '2dsphere' });
            logger.info('✅ Live Location indexes created');
        }

        logger.info('🎉 All database indexes created successfully!');

        // Get index stats
        const stats = await getIndexStats();
        logger.info('📊 Index Statistics:', stats);

        return true;
    } catch (error) {
        logger.error({ error }, 'Failed to create database indexes');
        throw error;
    }
}

/**
 * Get statistics about indexes
 */
async function getIndexStats() {
    const models = [
        { name: 'User', model: UserModel },
        { name: 'Product', model: Product },
        { name: 'Category', model: CategoryModel },
        { name: 'Order', model: Order },
        { name: 'Cart', model: Cart },
        { name: 'Notification', model: Notification },
        { name: 'Banner', model: Banner },
        { name: 'DeliveryBoy', model: DeliveryBoyModel },
    ];

    const stats: any = {};

    for (const { name, model } of models) {
        try {
            const indexes = await model.collection.getIndexes();
            stats[name] = {
                count: Object.keys(indexes).length,
                indexes: Object.keys(indexes)
            };
        } catch (error) {
            stats[name] = { error: 'Failed to get indexes' };
        }
    }

    return stats;
}

/**
 * Drop all indexes (use with caution!)
 */
export async function dropAllIndexes() {
    logger.warn('⚠️  Dropping all indexes...');

    const models = [
        UserModel,
        Product,
        CategoryModel,
        Order,
        Cart,
        Notification,
        Banner,
        DeliveryBoyModel
    ];

    for (const model of models) {
        try {
            await model.collection.dropIndexes();
            logger.info(`Dropped indexes for ${model.collection.name}`);
        } catch (error) {
            logger.error({ error }, `Failed to drop indexes for ${model.collection.name}`);
        }
    }
}

// Export for use in server startup or migration scripts
export default setupDatabaseIndexes;
