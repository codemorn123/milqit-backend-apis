# 🚀 API Performance Optimization Guide

**Goal**: Reduce API response times from 2-5 seconds to under 500ms

---

## 📊 Common Performance Bottlenecks

### 1. **Database Queries** (80% of slow APIs)
- N+1 query problems
- Missing indexes
- Over-population of references
- Not using `.lean()` for read-only operations
- Fetching unnecessary fields
- No query result caching

### 2. **Synchronous Operations** (10%)
- File uploads blocking the response
- External API calls not parallelized
- Heavy computations in request cycle

### 3. **Middleware Chain** (5%)
- Too many middleware functions
- Slow authentication checks
- Inefficient logging

### 4. **Data Transformation** (5%)
- Complex data mapping
- Large JSON serialization
- Unnecessary data copies

---

## ✅ Immediate Optimizations (Quick Wins)

### 1. Enable Performance Monitoring

Add to your `app.ts` or `server.ts`:

```typescript
import { performanceMonitor } from './middleware/performance-monitor';

// Add BEFORE other middleware
app.use(performanceMonitor);
```

This will log all slow requests (>1s) to help identify bottlenecks.

---

### 2. Use Lean Queries for Read-Only Operations

**❌ SLOW (500-800ms):**
```typescript
const products = await Product.find({ isActive: true });
// Returns full Mongoose documents with methods
```

**✅ FAST (50-100ms):**
```typescript
const products = await Product.find({ isActive: true }).lean();
// Returns plain JavaScript objects (5-10x faster)
```

**When to use `.lean()`:**
- GET endpoints (read-only)
- List/search operations
- Any time you're just returning data

**When NOT to use `.lean()`:**
- Before calling `.save()`
- When using document methods
- When modifying data

---

### 3. Select Only Needed Fields

**❌ SLOW:**
```typescript
const user = await User.findById(userId);
// Fetches ALL fields including password, tokens, etc.
```

**✅ FAST:**
```typescript
const user = await User.findById(userId)
  .select('_id name email phone addresses')
  .lean();
// Only fetches needed fields
```

---

### 4. Optimize Population (Prevent N+1)

**❌ VERY SLOW (3-5 seconds):**
```typescript
const orders = await Order.find({ userId })
  .populate('products')              // Fetches EVERYTHING
  .populate('userId')                // Fetches full user
  .populate('deliveryBoy');          // Fetches full delivery boy
```

**✅ FAST (200-400ms):**
```typescript
const orders = await Order.find({ userId })
  .populate({
    path: 'products',
    select: '_id name price image',  // Only needed fields
    options: { lean: true }
  })
  .populate({
    path: 'userId',
    select: '_id name phone',
    options: { lean: true }
  })
  .populate({
    path: 'deliveryBoy',
    select: '_id name phone',
    options: { lean: true }
  })
  .lean();
```

---

### 5. Add Database Indexes

**Critical indexes to add immediately:**

```typescript
// In your models or migration script
import { recommendedIndexes, ensureIndexes } from './utils/query-optimization';

// User model
UserModel.index({ phone: 1 });
UserModel.index({ email: 1 });
UserModel.index({ isActive: 1 });

// Product model
ProductModel.index({ slug: 1 });
ProductModel.index({ isActive: 1, inStock: 1 });
ProductModel.index({ category: 1, isActive: 1 });
ProductModel.index({ sellingPrice: 1 });

// Order model
OrderModel.index({ userId: 1, createdAt: -1 });
OrderModel.index({ orderStatus: 1 });
OrderModel.index({ orderNumber: 1 }, { unique: true });

// Cart model
CartModel.index({ userId: 1 }, { unique: true });

// Notification model
NotificationModel.index({ userId: 1, createdAt: -1 });
NotificationModel.index({ isRead: 1, userId: 1 });
```

---

### 6. Use Caching for Frequently Accessed Data

**Products (rarely change):**
```typescript
import { cacheService, CACHE_TTL, CACHE_PREFIX } from '../services/cache.service';

// Before
async getProducts(filters) {
  return await Product.find(filters).lean();
}

// After
async getProducts(filters) {
  const cacheKey = `${CACHE_PREFIX.PRODUCT_LIST}${JSON.stringify(filters)}`;
  
  return await cacheService.getOrSet(
    cacheKey,
    () => Product.find(filters).lean(),
    CACHE_TTL.LONG  // Cache for 15 minutes
  );
}
```

**Categories (rarely change):**
```typescript
async getAllCategories() {
  return await cacheService.getOrSet(
    CACHE_PREFIX.CATEGORY_LIST + 'all',
    () => Category.find({ isActive: true }).lean(),
    CACHE_TTL.HOUR  // Cache for 1 hour
  );
}
```

**Settings (rarely change):**
```typescript
async getSettings() {
  return await cacheService.getOrSet(
    'settings:app',
    () => Settings.findOne().lean(),
    CACHE_TTL.DAY  // Cache for 24 hours
  );
}
```

**Remember to invalidate cache on updates:**
```typescript
async updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  
  // Invalidate caches
  await cacheService.invalidateProduct(id);
  
  return product;
}
```

---

### 7. Parallelize Independent Operations

**❌ SLOW (2+ seconds):**
```typescript
async getOrderDetails(orderId) {
  const order = await Order.findById(orderId);
  const user = await User.findById(order.userId);
  const products = await Product.find({ _id: { $in: order.products } });
  
  return { order, user, products };
}
```

**✅ FAST (400-600ms):**
```typescript
async getOrderDetails(orderId) {
  const orderPromise = Order.findById(orderId).lean();
  
  const [order, user, products] = await Promise.all([
    orderPromise,
    orderPromise.then(o => User.findById(o.userId).select('_id name phone').lean()),
    orderPromise.then(o => Product.find({ _id: { $in: o.products } }).lean())
  ]);
  
  return { order, user, products };
}
```

---

## 🎯 Service Layer Optimizations

### Product Service Example

**Before (SLOW - 2-3s):**
```typescript
async findAll(filters) {
  return Product.find({
    isActive: true,
    ...filters
  })
  .populate('category')
  .populate('createdBy');
}
```

**After (FAST - 200-400ms):**
```typescript
async findAll(filters) {
  const cacheKey = `${CACHE_PREFIX.PRODUCT_LIST}${JSON.stringify(filters)}`;
  
  return cacheService.getOrSet(
    cacheKey,
    () => Product.find({
      isActive: true,
      ...filters
    })
    .select('-__v -createdBy -updatedBy')  // Exclude unnecessary fields
    .populate({
      path: 'category',
      select: '_id name slug',
      options: { lean: true }
    })
    .lean()
    .limit(filters.limit || 20),  // Always limit results
    CACHE_TTL.LONG
  );
}
```

### Order Service Example

**Before (SLOW - 3-5s):**
```typescript
async getUserOrders(userId) {
  return Order.find({ userId })
    .populate('products')
    .populate('userId')
    .populate('deliveryBoy')
    .sort({ createdAt: -1 });
}
```

**After (FAST - 300-500ms):**
```typescript
async getUserOrders(userId, page = 1, limit = 10) {
  return Order.find({ userId })
    .select('-__v')
    .populate({
      path: 'products',
      select: '_id name price image sellingPrice',
      options: { lean: true }
    })
    .populate({
      path: 'deliveryBoy',
      select: '_id name phone',
      options: { lean: true }
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
}
```

---

## 🔧 Controller Optimizations

### Before (SLOW)
```typescript
@Get()
public async getProducts(@Queries() filters) {
  const products = await productService.findAll(filters);
  return success(products, 'Products fetched');
}
```

### After (FAST)
```typescript
@Get()
public async getProducts(@Queries() filters) {
  // Add pagination
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 20, 100);  // Max 100
  
  // Optimize filters
  const optimizedFilters = {
    ...filters,
    page,
    limit,
    isActive: true,  // Always filter active
  };
  
  const products = await productService.findAll(optimizedFilters);
  return this.sendPaginated(products, SUCCESS_MESSAGES.FETCHED);
}
```

---

## 📈 Monitoring Performance

### 1. Add Response Time Headers

Already implemented in `performanceMonitor` middleware. Check response headers:
```
X-Response-Time: 234.56ms
```

### 2. Log Slow Queries

Enable MongoDB query logging in development:
```typescript
import { enableQueryLogging } from './utils/query-optimization';

if (process.env.NODE_ENV === 'development') {
  enableQueryLogging();
}
```

### 3. Monitor Cache Hit Rates

Check console for cache operations:
```
✅ Cache HIT: products:list:{...}
❌ Cache MISS: products:list:{...}
💾 Cache SET: products:list:{...} (TTL: 900s)
```

---

## 🎯 Specific API Optimizations

### GET /customer/products

**Problem**: Loading all products with full population (3-5s)

**Solution**:
1. Add `.lean()` to query
2. Limit population depth
3. Add caching
4. Add pagination
5. Select only needed fields

**Expected improvement**: 3-5s → 200-400ms

---

### GET /customer/orders

**Problem**: Over-populating related data (2-3s)

**Solution**:
1. Optimize population with field selection
2. Add index on `{ userId: 1, createdAt: -1 }`
3. Use `.lean()`
4. Add pagination

**Expected improvement**: 2-3s → 300-500ms

---

### GET /customer/cart

**Problem**: Populating all product details (1-2s)

**Solution**:
1. Only populate essential product fields
2. Cache cart for userId
3. Invalidate cache on cart updates
4. Use `.lean()`

**Expected improvement**: 1-2s → 100-200ms

---

## 🚀 Advanced Optimizations

### 1. Aggregate Queries for Complex Data

Instead of multiple queries + client-side joins:

```typescript
const stats = await Order.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  {
    $group: {
      _id: '$orderStatus',
      count: { $sum: 1 },
      total: { $sum: '$totalAmount' }
    }
  }
]);
```

### 2. Projection in Aggregation

```typescript
const products = await Product.aggregate([
  { $match: { isActive: true } },
  {
    $project: {
      _id: 1,
      name: 1,
      price: 1,
      image: 1,
      // Calculate discount on database side
      discount: {
        $subtract: ['$mrp', '$sellingPrice']
      }
    }
  }
]);
```

### 3. Use $lookup for Efficient Joins

```typescript
const orders = await Order.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  {
    $lookup: {
      from: 'products',
      localField: 'products',
      foreignField: '_id',
      as: 'productDetails',
      pipeline: [
        { $project: { _id: 1, name: 1, price: 1 } }
      ]
    }
  }
]);
```

---

## ✅ Performance Checklist

Before deploying any API endpoint, ensure:

- [ ] Queries use `.lean()` for read-only operations
- [ ] Only necessary fields are selected
- [ ] Indexes exist on queried fields
- [ ] Population depth is limited (max 2 levels)
- [ ] Population selects only needed fields
- [ ] Pagination is implemented
- [ ] Independent operations are parallelized
- [ ] Frequently accessed data is cached
- [ ] Cache invalidation is implemented
- [ ] Response time is < 500ms on localhost
- [ ] Performance monitoring is enabled

---

## 📊 Expected Results

| Endpoint | Before | After | Improvement |
|----------|--------|-------|-------------|
| GET /products | 2-3s | 200-400ms | 85% faster |
| GET /orders | 3-5s | 300-500ms | 90% faster |
| GET /cart | 1-2s | 100-200ms | 90% faster |
| GET /categories | 1s | 50-100ms | 95% faster |
| GET /banners | 500ms | 50ms | 90% faster |

---

## 🔍 Debugging Slow APIs

### 1. Enable Performance Monitor
```typescript
import { performanceMonitor } from './middleware/performance-monitor';
app.use(performanceMonitor);
```

### 2. Check Logs for Slow Requests
```
[WARN] Slow API endpoint detected: GET /customer/products (2345.67ms)
```

### 3. Enable Query Logging
```typescript
mongoose.set('debug', true);
```

### 4. Use Node.js Profiler
```bash
node --prof server.js
```

---

## 💡 Pro Tips

1. **Cache invalidation is hard** - Be conservative with cache TTL
2. **Index before scale** - Add indexes before you have performance problems
3. **Monitor always** - Keep performance monitoring enabled
4. **Profile in production** - Development performance != production performance
5. **Measure everything** - You can't optimize what you don't measure

---

**Remember**: The goal is < 500ms response time for all APIs! 🚀
