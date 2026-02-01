import cacheClient from '../config/redis.config';

/**
 * Cache TTL Constants (in seconds)
 */
export const CACHE_TTL = {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 900,           // 15 minutes
    HOUR: 3600,          // 1 hour
    DAY: 86400,          // 24 hours
    WEEK: 604800,        // 7 days
} as const;

/**
 * Cache Key Prefixes
 */
export const CACHE_PREFIX = {
    PRODUCT: 'product:',
    PRODUCT_LIST: 'products:list:',
    CATEGORY: 'category:',
    CATEGORY_LIST: 'categories:list:',
    BANNER: 'banner:',
    USER: 'user:',
    STATS: 'stats:',
} as const;

/**
 * Generic Cache Service
 * Provides high-level caching utilities with automatic serialization
 */
export class CacheService {
    /**
     * Get cached data with automatic deserialization
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const cached = await cacheClient.getJSON<T>(key);
            if (cached) {
                console.log(`✅ Cache HIT: ${key}`);
            } else {
                console.log(`❌ Cache MISS: ${key}`);
            }
            return cached;
        } catch (error) {
            console.error(`Cache get error for ${key}:`, error);
            return null;
        }
    }

    /**
     * Set cached data with automatic serialization
     */
    async set<T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
        try {
            const result = await cacheClient.setJSON(key, value, ttl);
            if (result) {
                console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
            }
            return result;
        } catch (error) {
            console.error(`Cache set error for ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete cached data
     */
    async delete(key: string): Promise<boolean> {
        try {
            const result = await cacheClient.del(key);
            if (result > 0) {
                console.log(`🗑️ Cache DELETE: ${key}`);
            }
            return result > 0;
        } catch (error) {
            console.error(`Cache delete error for ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete multiple keys
     */
    async deleteMany(...keys: string[]): Promise<number> {
        try {
            const result = await cacheClient.del(...keys);
            console.log(`🗑️ Cache DELETE: ${result} keys deleted`);
            return result;
        } catch (error) {
            console.error('Cache deleteMany error:', error);
            return 0;
        }
    }

    /**
     * Delete all keys matching pattern
     */
    async deletePattern(pattern: string): Promise<number> {
        try {
            const result = await cacheClient.deletePattern(pattern);
            console.log(`🗑️ Cache DELETE PATTERN: ${pattern} (${result} keys deleted)`);
            return result;
        } catch (error) {
            console.error('Cache deletePattern error:', error);
            return 0;
        }
    }

    /**
     * Invalidate product cache
     */
    async invalidateProduct(productId: string): Promise<void> {
        await this.delete(`${CACHE_PREFIX.PRODUCT}${productId}`);
        await this.deletePattern(`${CACHE_PREFIX.PRODUCT_LIST}*`);
    }

    /**
     * Invalidate category cache
     */
    async invalidateCategory(categoryId: string): Promise<void> {
        await this.delete(`${CACHE_PREFIX.CATEGORY}${categoryId}`);
        await this.deletePattern(`${CACHE_PREFIX.CATEGORY_LIST}*`);
    }

    /**
     * Invalidate all product caches
     */
    async invalidateAllProducts(): Promise<void> {
        await this.deletePattern(`${CACHE_PREFIX.PRODUCT}*`);
        await this.deletePattern(`${CACHE_PREFIX.PRODUCT_LIST}*`);
    }

    /**
     * Invalidate all category caches
     */
    async invalidateAllCategories(): Promise<void> {
        await this.deletePattern(`${CACHE_PREFIX.CATEGORY}*`);
        await this.deletePattern(`${CACHE_PREFIX.CATEGORY_LIST}*`);
    }

    /**
     * Get or set pattern (cache-aside)
     * Checks cache first, if miss, executes function and caches result
     */
    async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttl: number = CACHE_TTL.MEDIUM
    ): Promise<T> {
        // Try to get from cache
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        // Cache miss - fetch from source
        console.log(`🔄 Cache MISS - Fetching: ${key}`);
        const data = await fetchFn();

        // Store in cache (fire and forget - don't wait)
        this.set(key, data, ttl).catch(err => {
            console.error(`Failed to cache ${key}:`, err);
        });

        return data;
    }

    /**
     * Wrap a function with caching
     * Returns a cached version of the function
     */
    cached<TArgs extends any[], TResult>(
        keyGenerator: (...args: TArgs) => string,
        ttl: number = CACHE_TTL.MEDIUM
    ) {
        return async (
            fn: (...args: TArgs) => Promise<TResult>,
            ...args: TArgs
        ): Promise<TResult> => {
            const key = keyGenerator(...args);
            return this.getOrSet(key, () => fn(...args), ttl);
        };
    }

    /**
     * Clear all cache
     */
    async clearAll(): Promise<boolean> {
        console.log('🗑️ Clearing ALL cache');
        return await cacheClient.flushAll();
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<{
        type: 'redis' | 'memory';
        isReady: boolean;
        productKeys: number;
        categoryKeys: number;
        totalKeys: number;
    }> {
        const [productKeys, categoryKeys, allKeys] = await Promise.all([
            cacheClient.keys(`${CACHE_PREFIX.PRODUCT}*`),
            cacheClient.keys(`${CACHE_PREFIX.CATEGORY}*`),
            cacheClient.keys('*'),
        ]);

        return {
            type: cacheClient.getCacheType(),
            isReady: cacheClient.isReady(),
            productKeys: productKeys.length,
            categoryKeys: categoryKeys.length,
            totalKeys: allKeys.length,
        };
    }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
