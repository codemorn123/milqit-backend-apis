# Redis Caching Implementation Guide

## Overview
This implementation provides a flexible caching solution that works **both with Redis (production) and in-memory cache (local development)** automatically. No Redis installation required for local testing!

## Features

✅ **Automatic Fallback** - Uses Redis when available, falls back to in-memory cache  
✅ **Zero Configuration** - Works out of the box locally without Redis  
✅ **Type-Safe** - Full TypeScript support  
✅ **Generic Service** - Easy to use across all services  
✅ **Fast APIs** - Significantly improves response times  
✅ **Cache Invalidation** - Smart invalidation on data changes  

## Quick Start

### Environment Setup

Add to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_if_any
REDIS_ENABLED=false  #  Set to 'true' in production
```

### Local Development (No Redis)
```env
REDIS_ENABLED=false  # or just omit it
```
The app will automatically use in-memory cache!

### Production (With Redis)
```env
REDIS_ENABLED=true
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

## Architecture

### File Structure
```
src/
├── config/
│   ├── index.ts                # Redis env config
│   └── redis.config.ts         # Redis/Memory client (automatic fallback)
└── services/
    └── cache.service.ts        # High-level cache service
```

### How It Works

1. **Redis Enabled (Production)**
   ```
   App → CacheService → Redis Client → Actual Redis Server
   ```

2. **Redis Disabled (Local Dev)**
   ```
   App → CacheService → Memory Cache → In-Memory Map
   ```

3. **Redis Connection Failed**
   ```
   App → CacheService → Automatic Fallback → Memory Cache
   ```

## Usage

### Basic Caching

```typescript
import cacheService, { CACHE_PREFIX, CACHE_TTL } from './services/cache.service';

// Get from cache
const product = await cacheService.get<IProduct>('product:123');

// Set in cache (5 minutes TTL)
await cacheService.set('product:123', productData, CACHE_TTL.MEDIUM);

// Delete from cache
await cacheService.delete('product:123');
```

### Cache-Aside Pattern (Recommended)

```typescript
// Automatically checks cache, fetches if miss, and stores
const product = await cacheService.getOrSet(
  `${CACHE_PREFIX.PRODUCT}${id}`,
  () => ProductModel.findById(id),  // Only called on cache miss
  CACHE_TTL.MEDIUM
);
```

### Service Integration

#### Example: Category Service with Caching

```typescript
import cacheService, { CACHE_PREFIX, CACHE_TTL } from './cache.service';

class CategoryService {
  // GET with caching
  async getOne(id: string): Promise<ICategory> {
    const cacheKey = `${CACHE_PREFIX.CATEGORY}${id}`;
    
    return await cacheService.getOrSet(
      cacheKey,
      () => CategoryModel.findById(id),
      CACHE_TTL.MEDIUM
    );
  }

  // CREATE with cache invalidation
  async create(data: ICategory): Promise<ICategory> {
    const newCategory = await CategoryModel.create(data);
    
    // Invalidate list caches
    await cacheService.invalidateAllCategories();
    
    return newCategory;
  }

  // UPDATE with cache invalidation
  async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
    const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    
    // Invalidate specific category and lists
    await cacheService.invalidateCategory(id);
    
    return updated;
  }

  // DELETE with cache invalidation
  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id);
    
    // Invalidate caches
    await cacheService.invalidateCategory(id);
  }
}
```

## Cache TTL Constants

```typescript
CACHE_TTL.SHORT   // 1 minute  - Frequently changing data
CACHE_TTL.MEDIUM  // 5 minutes - Default for most data
CACHE_TTL.LONG    // 15 minutes - Stable data
CACHE_TTL.HOUR    // 1 hour - Rarely changing data
CACHE_TTL.DAY     // 24 hours - Static content
CACHE_TTL.WEEK    // 7 days - Very static content
```

## Cache Key Prefixes

```typescript
CACHE_PREFIX.PRODUCT       // 'product:'
CACHE_PREFIX.PRODUCT_LIST  // 'products:list:'
CACHE_PREFIX.CATEGORY      // 'category:'
CACHE_PREFIX.CATEGORY_LIST // 'categories:list:'
CACHE_PREFIX.BANNER        // 'banner:'
CACHE_PREFIX.USER          // 'user:'
CACHE_PREFIX.STATS         // 'stats:'
```

## Cache Service Methods

### Get/Set Operations

```typescript
// Get cached data
const data = await cacheService.get<Type>(key);

// Set cached data with TTL
await cacheService.set(key, data, CACHE_TTL.MEDIUM);

// Get or fetch and cache
const data = await cacheService.getOrSet(key, fetchFunction, ttl);
```

### Invalidation Operations

```typescript
// Delete single key
await cacheService.delete(key);

// Delete multiple keys
await cacheService.deleteMany(key1, key2, key3);

// Delete by pattern
await cacheService.deletePattern('product:*');

// Invalidate specific product
await cacheService.invalidateProduct(productId);

// Invalidate all products
await cacheService.invalidateAllProducts();

// Clear everything
await cacheService.clearAll();
```

### Statistics

```typescript
const stats = await cacheService.getStats();
console.log(stats);
// {
//   type: 'redis' | 'memory',
//   isReady: true,
//   productKeys: 45,
//   categoryKeys: 12,
//   totalKeys: 103
// }
```

## Performance Improvements

### Before Caching
```
GET /api/products → Database Query (50-200ms)
GET /api/products → Database Query (50-200ms)
GET /api/products → Database Query (50-200ms)
```

### After Caching
```
GET /api/products → Database Query (50-200ms) ← Cache MISS
GET /api/products → Cache Hit (1-5ms) ✅
GET /api/products → Cache Hit (1-5ms) ✅
```

**Result: 10-50x faster response times!**

## Best Practices

### 1. Always Use Cache-Aside Pattern

**❌ Don't:**
```typescript
const cached = await cacheService.get(key);
if (!cached) {
  const data = await fetchData();
  await cacheService.set(key, data);
  return data;
}
return cached;
```

**✅ Do:**
```typescript
return await cacheService.getOrSet(key, () => fetchData(), TTL);
```

### 2. Invalidate on Writes

```typescript
// CREATE
await cacheService.invalidateAllProducts();  // Clear list caches

// UPDATE
await cacheService.invalidateProduct(id);    // Clear specific + lists

// DELETE
await cacheService.invalidateProduct(id);    // Clear specific + lists
```

### 3. Use Appropriate TTLs

```typescript
// Frequently changing (e.g., stock levels)
CACHE_TTL.SHORT  // 1 minute

// Standard entities (e.g., products, categories)
CACHE_TTL.MEDIUM // 5 minutes

// Static content (e.g., banners, config)
CACHE_TTL.LONG   // 15 minutes
```

### 4. Namespace Your Keys

```typescript
// Good
`${CACHE_PREFIX.PRODUCT}${id}`
`${CACHE_PREFIX.PRODUCT_LIST}page:1:limit:10`

// Bad
`product_${id}`
`products_list`
```

## Debugging

### Check Cache Status

```typescript
import cacheClient from './config/redis.config';

console.log('Cache Type:', cacheClient.getCacheType()); // 'redis' or 'memory'
console.log('Is Ready:', cacheClient.isReady());        // true/false
```

### View Cache Logs

The cache service logs all operations:
```
✅ Cache HIT: product:123
❌ Cache MISS: category:456
💾 Cache SET: product:123 (TTL: 300s)
🗑️ Cache DELETE: category:456
```

### Monitor Cache Stats

```typescript
// Add to admin endpoint
app.get('/admin/cache-stats', async (req, res) => {
  const stats = await cacheService.getStats();
  res.json(stats);
});
```

## Testing

### Unit Tests (with Memory Cache)

```typescript
// Tests automatically use memory cache (REDIS_ENABLED=false)
describe('Product Service', () => {
  beforeEach(async () => {
    await cacheService.clearAll();  // Clear before each test
  });

  it('should cache product', async () => {
    const product = await productService.getOne('123');
    // Second call should be cached
    const cachedProduct = await productService.getOne('123');
  });
});
```

### Integration Tests (with Redis)

```typescript
// Use test Redis instance
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6380  // Different port for testing
```

## Production Deployment

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

### Kubernetes

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  REDIS_ENABLED: "true"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

## Monitoring

### Health Check

```typescript
app.get('/health', async (req, res) => {
  const cacheReady = cacheClient.isReady();
  
  res.json({
    status: cacheReady ? 'healthy' : 'degraded',
    cache: {
      type: cacheClient.getCacheType(),
      ready: cacheReady
    }
  });
});
```

### Metrics

```typescript
// Cache hit rate
const hits = await redis.get('cache:hits') || 0;
const misses = await redis.get('cache:misses') || 0;
const hitRate = hits / (hits + misses);

console.log(`Cache Hit Rate: ${(hitRate * 100).toFixed(2)}%`);
```

## Troubleshooting

### Issue: Cache not working locally

**Check:**
```typescript
console.log('Cache Type:', cacheClient.getCacheType());
// Should show: 'memory' (if Redis disabled)
```

### Issue: Stale data in cache

**Solution:** Check TTL and invalidation
```typescript
// Check TTL
const ttl = await cacheClient.ttl(key);
console.log(`TTL remaining: ${ttl} seconds`);

// Force invalidation
await cacheService.delete(key);
```

### Issue: Redis connection failed

**Check logs:**
```
❌ Failed to connect to Redis: Connection refused
📦 Falling back to in-memory cache
```
The app will continue working with memory cache!

## Advanced Usage

### Custom Cache Wrapper

```typescript
// Wrap any async function with caching
const cachedGetUser = cacheService.cached<[string], IUser>(
  (userId) => `user:${userId}`,
  CACHE_TTL.HOUR
);

// Use it
const user = await cachedGetUser(fetchUserFromDB, userId);
```

### Batch Operations

```typescript
// Cache multiple items at once
const products = await Promise.all(
  productIds.map(id =>
    cacheService.getOrSet(
      `product:${id}`,
      () => ProductModel.findById(id),
      CACHE_TTL.MEDIUM
    )
  )
);
```

## Migration from Non-Cached System

### Step 1: Add Cache Service

```typescript
import cacheService, { CACHE_PREFIX, CACHE_TTL } from './cache.service';
```

### Step 2: Wrap Read Operations

```typescript
// Before
async getProduct(id: string) {
  return await ProductModel.findById(id);
}

// After
async getProduct(id: string) {
  return await cacheService.getOrSet(
    `${CACHE_PREFIX.PRODUCT}${id}`,
    () => ProductModel.findById(id),
    CACHE_TTL.MEDIUM
  );
}
```

### Step 3: Add Invalidation to Writes

```typescript
async updateProduct(id: string, data: any) {
  const updated = await ProductModel.findByIdAndUpdate(id, data);
  await cacheService.invalidateProduct(id);
  return updated;
}
```

## Resources

- [Redis Documentation](https://redis.io/docs/)
- [ioredis GitHub](https://github.com/redis/ioredis)
- [Caching Strategies](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)

## Support

- Local development works automatically (no Redis needed)
- Production uses actual Redis for scalability
- Automatic failover ensures zero downtime
- Comprehensive error handling and logging

---

**Implementation Date:** January 26, 2026  
**Version:** 1.0.0
