import mongoose from 'mongoose';
import { logger } from '../config/logger';

/**
 * Database Query Optimization Utilities
 * Helpers to improve query performance
 */

/**
 * Enable query logging in development
 */
export const enableQueryLogging = () => {
    if (process.env.NODE_ENV === 'development') {
        mongoose.set('debug', (collectionName: string, method: string, query: any, doc: any) => {
            logger.debug({
                collection: collectionName,
                method,
                query: JSON.stringify(query),
            }, `MongoDB Query: ${collectionName}.${method}`);
        });
    }
};

/**
 * Common query optimizations for mongoose
 */
export const queryOptimizations = {
    /**
     * Lean queries - returns plain JS objects instead of mongoose documents
     * Use for READ-ONLY operations (30-50% faster)
     */
    lean: () => ({ lean: true }),

    /**
     * Select only needed fields
     * Reduces data transfer and processing time
     */
    selectFields: (fields: string[]) => ({
        select: fields.join(' ')
    }),

    /**
     * Exclude sensitive/large fields
     */
    excludeFields: (fields: string[]) => ({
        select: fields.map(f => `-${f}`).join(' ')
    }),

    /**
     * Limit population depth to prevent deep nesting
     */
    limitPopulation: (path: string, select?: string) => ({
        populate: {
            path,
            select: select || '_id name',
            options: { lean: true }
        }
    }),

    /**
     * Add index hints for complex queries
     */
    useIndex: (indexName: string) => ({
        hint: indexName
    }),

    /**
     * Set query timeout (in ms)
     */
    setTimeout: (ms: number = 5000) => ({
        maxTimeMS: ms
    }),

    /**
     * Batch size for cursor operations
     */
    batchSize: (size: number = 100) => ({
        batchSize: size
    })
};

/**
 * Optimized population helper
 * Prevents over-population and N+1 queries
 */
export function optimizedPopulate(
    query: any,
    populations: Array<{
        path: string;
        select?: string;
        populate?: any;
        match?: any;
    }>
) {
    populations.forEach(pop => {
        query.populate({
            ...pop,
            options: { lean: true },
            select: pop.select || '_id name'
        });
    });
    return query;
}

/**
 * Check if indexes exist on a model
 */
export async function checkIndexes(modelName: string, model: any) {
    try {
        const indexes = await model.collection.getIndexes();
        logger.info({
            model: modelName,
            indexes: Object.keys(indexes)
        }, `Indexes for ${modelName}`);
        return indexes;
    } catch (error) {
        logger.error({ error, model: modelName }, `Failed to get indexes for ${modelName}`);
        return {};
    }
}

/**
 * Recommended indexes for common collections
 */
export const recommendedIndexes = {
    users: [
        { phone: 1 },
        { email: 1 },
        { 'addresses.isPrimary': 1 },
        { isActive: 1 },
        { createdAt: -1 }
    ],
    products: [
        { slug: 1 },
        { isActive: 1, inStock: 1 },
        { category: 1, isActive: 1 },
        { sellingPrice: 1 },
        { createdAt: -1 },
        { name: 'text', description: 'text' } // Text index for search
    ],
    orders: [
        { userId: 1, createdAt: -1 },
        { orderStatus: 1 },
        { 'payment.status': 1 },
        { createdAt: -1 },
        { orderNumber: 1 }
    ],
    categories: [
        { slug: 1 },
        { isActive: 1 },
        { parentCategory: 1 }
    ],
    carts: [
        { userId: 1 },
        { 'items.productId': 1 },
        { updatedAt: -1 }
    ],
    notifications: [
        { userId: 1, createdAt: -1 },
        { isRead: 1, userId: 1 }
    ],
    deliveryBoys: [
        { phone: 1 },
        { isActive: 1 },
        { 'location.coordinates': '2dsphere' } // Geospatial index
    ],
    liveLocations: [
        { userId: 1, isActive: 1 },
        { orderId: 1 },
        { sessionId: 1 },
        { 'location.coordinates': '2dsphere' }
    ]
};

/**
 * Create indexes for a model
 */
export async function ensureIndexes(modelName: string, model: any, indexes: any[]) {
    try {
        for (const index of indexes) {
            await model.collection.createIndex(index);
        }
        logger.info({ model: modelName, count: indexes.length }, `Created ${indexes.length} indexes for ${modelName}`);
    } catch (error) {
        logger.error({ error, model: modelName }, `Failed to create indexes for ${modelName}`);
    }
}

/**
 * Query performance tips
 */
export const performanceTips = {
    // Use lean() for read-only queries
    useLean: true,

    // Select only needed fields
    selectFields: true,

    // Avoid deep population (max 2 levels)
    limitPopulationDepth: 2,

    // Use pagination for large datasets
    usePagination: true,

    // Cache frequently accessed data
    useCache: true,

    // Use projection to exclude large fields
    useProjection: true,

    // Limit array elements in results
    limitArrays: true,

    // Use countDocuments instead of count (deprecated)
    useCountDocuments: true
};
