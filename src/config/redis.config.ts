import Redis from 'ioredis';
import { config } from './index';

/**
 * In-Memory Cache Implementation (Fallback when Redis is not available)
 * This allows the app to work locally without Redis installed
 */
class MemoryCache {
  private cache: Map<string, { value: string; expiry: number | null }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  async get(key: string): Promise<string | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (entry.expiry && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiry });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    keys.forEach(key => {
      if (this.cache.delete(key)) deleted++;
    });
    return deleted;
  }

  async exists(...keys: string[]): Promise<number> {
    return keys.filter(key => this.cache.has(key)).length;
  }

  async keys(pattern: string): Promise<string[]> {
    // Simple pattern matching for * and ?
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return Array.from(this.cache.keys()).filter(key => regex.test(key));
  }

  async flushall(): Promise<'OK'> {
    this.cache.clear();
    return 'OK';
  }

  async ttl(key: string): Promise<number> {
    const entry = this.cache.get(key);
    if (!entry) return -2; // Key doesn't exist
    if (!entry.expiry) return -1; // Key exists but no expiry

    const remaining = Math.floor((entry.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry && entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

/**
 * Cache Client - Works with both Redis and Memory
 */
class CacheClient {
  private client: Redis | MemoryCache;
  private isRedis: boolean;
  private isConnected: boolean = false;

  constructor() {
    if (config.redis.enabled) {
      // Use actual Redis
      this.isRedis = true;
      const redisClient = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        lazyConnect: true, // Don't connect immediately
      });

      redisClient.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Redis connected successfully');
      });

      redisClient.on('ready', () => {
        console.log('✅ Redis is ready to accept commands');
      });

      redisClient.on('error', (error) => {
        console.error('❌ Redis error:', error.message);
        // Don't crash the app on Redis errors
      });

      redisClient.on('close', () => {
        this.isConnected = false;
        console.warn('⚠️ Redis connection closed');
      });

      redisClient.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      // Try to connect
      redisClient.connect().catch((error) => {
        console.error('❌ Failed to connect to Redis:', error.message);
        console.log('📦 Falling back to in-memory cache');
        this.isRedis = false;
        this.client = new MemoryCache();
      });

      this.client = redisClient;
    } else {
      // Use in-memory cache
      this.isRedis = false;
      this.client = new MemoryCache();
      this.isConnected = true;
      console.log('📦 Using in-memory cache (Redis disabled)');
    }
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Cache get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (this.isRedis && ttlSeconds) {
        await (this.client as Redis).setex(key, ttlSeconds, value);
      } else if (this.isRedis) {
        await (this.client as Redis).set(key, value);
      } else {
        await (this.client as MemoryCache).set(key, value, ttlSeconds);
      }
      return true;
    } catch (error) {
      console.error(`Cache set error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get JSON value from cache
   */
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache getJSON error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set JSON value in cache
   */
  async setJSON<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(value);
      return await this.set(key, jsonString, ttlSeconds);
    } catch (error) {
      console.error(`Cache setJSON error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Delete keys from cache
   */
  async del(...keys: string[]): Promise<number> {
    try {
      return await this.client.del(...keys);
    } catch (error) {
      console.error('Cache del error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(...keys: string[]): Promise<number> {
    try {
      return await this.client.exists(...keys);
    } catch (error) {
      console.error('Cache exists error:', error);
      return 0;
    }
  }

  /**
   * Get keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Cache keys error:', error);
      return [];
    }
  }

  /**
   * Delete keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.del(...keys);
    } catch (error) {
      console.error('Cache deletePattern error:', error);
      return 0;
    }
  }

  /**
   * Clear all cache
   */
  async flushAll(): Promise<boolean> {
    try {
      await this.client.flushall();
      return true;
    } catch (error) {
      console.error('Cache flushAll error:', error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Cache ttl error:', error);
      return -1;
    }
  }

  /**
   * Check if cache is ready
   */
  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Get cache type
   */
  getCacheType(): 'redis' | 'memory' {
    return this.isRedis ? 'redis' : 'memory';
  }

  /**
   * Disconnect (cleanup)
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isRedis) {
        await (this.client as Redis).quit();
      } else {
        (this.client as MemoryCache).destroy();
      }
      this.isConnected = false;
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

// Export singleton instance
export const cacheClient = new CacheClient();
export default cacheClient;