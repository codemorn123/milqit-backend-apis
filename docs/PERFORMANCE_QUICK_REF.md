# Performance Optimization Quick Reference Card

## 🚨 TOP 5 FASTEST WINS (Do These Now!)

### 1. Add `.lean()` to All Read-Only Queries
```typescript
// ❌ SLOW
Product.find({ isActive: true })

// ✅ FAST (5-10x faster)
Product.find({ isActive: true }).lean()
```

### 2. Select Only Needed Fields
```typescript
// ❌ SLOW
User.findById(id)

// ✅ FAST
User.findById(id).select('_id name email phone').lean()
```

### 3. Optimize Population
```typescript
// ❌ SLOW
Order.find().populate('products').populate('userId')

// ✅ FAST
Order.find()
  .populate({ path: 'products', select: '_id name price', options: { lean: true } })
  .populate({ path: 'userId', select: '_id name', options: { lean: true } })
  .lean()
```

### 4. Run Index Setup Script
```bash
# Add to your server startup
import setupDatabaseIndexes from './scripts/setup-indexes';
await setupDatabaseIndexes();
```

### 5. Enable Performance Monitoring
```typescript
// In app.ts
import { performanceMonitor } from './middleware/performance-monitor';
app.use(performanceMonitor);
```

---

## 📋 Before/After Checklist

Use this for EVERY database query:

```typescript
// ❌ BEFORE (Slow - 2-5 seconds)
async function getProducts() {
  return await Product.find({ isActive: true })
    .populate('category')
    .populate('createdBy');
}

// ✅ AFTER (Fast - 200-400ms)
async function getProducts() {
  const cacheKey = 'products:active';
  
  return await cacheService.getOrSet(
    cacheKey,
    () => Product.find({ isActive: true })
      .select('-__v -createdBy -updatedBy')
      .populate({
        path: 'category',
        select: '_id name slug',
        options: { lean: true }
      })
      .limit(50)
      .lean(),
    CACHE_TTL.LONG
  );
}
```

**Checklist:**
- [ ] Added `.lean()`
- [ ] Selected only needed fields
- [ ] Optimized population
- [ ] Added pagination/limit
- [ ] Added caching
- [ ] Removed unnecessary fields

---

## 🎯 Service Method Template

Copy this template for all service methods:

```typescript
import { cacheService, CACHE_TTL, CACHE_PREFIX } from '../services/cache.service';

// For LIST operations
async findAll(filters: any, page = 1, limit = 20) {
  const cacheKey = `${CACHE_PREFIX.YOUR_RESOURCE}list:${JSON.stringify({ filters, page, limit })}`;
  
  return await cacheService.getOrSet(
    cacheKey,
    () => YourModel.find(filters)
      .select('-__v  -createdBy -updatedBy')  // Exclude unnecessary
      .populate({
        path: 'relatedField',
        select: '_id name',  // Only ID and name
        options: { lean: true }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    CACHE_TTL.MEDIUM
  );
}

// For GET by ID
async findById(id: string) {
  const cacheKey = `${CACHE_PREFIX.YOUR_RESOURCE}${id}`;
  
  return await cacheService.getOrSet(
    cacheKey,
    () => YourModel.findById(id)
      .select('-__v')
      .populate({
        path: 'relatedField',
        select: '_id name',
        options: { lean: true }
      })
      .lean(),
    CACHE_TTL.LONG
  );
}

// For CREATE/UPDATE (invalidate cache!)
async update(id: string, data: any) {
  const updated = await YourModel.findByIdAndUpdate(id, data, { new: true });
  
  // Invalidate caches
  await cacheService.delete(`${CACHE_PREFIX.YOUR_RESOURCE}${id}`);
  await cacheService.deletePattern(`${CACHE_PREFIX.YOUR_RESOURCE}list:*`);
  
  return updated;
}
```

---

## 🔧 Common Query Patterns

### Pattern 1: Get All with Filters
```typescript
// Optimized
async function getAll(filters) {
  return Model.find(filters)
    .select('_id name status')
    .lean()
    .limit(100);  // Always limit!
}
```

### Pattern 2: Get One by ID
```typescript
// Optimized
async function getById(id) {
  return Model.findById(id)
    .select('-__v')
    .lean();
}
```

### Pattern 3: Get with Relations
```typescript
// Optimized
async function getWithRelations(id) {
  return Model.findById(id)
    .select('-__v')
    .populate({
      path: 'relation',
      select: '_id name',  // Minimal fields
      options: { lean: true }
    })
    .lean();
}
```

### Pattern 4: Search with Pagination
```typescript
// Optimized
async function search(query, page, limit) {
  return Model.find({ name: new RegExp(query, 'i') })
    .select('_id name price image')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Math.min(limit, 100))  // Max 100
    .lean();
}
```

### Pattern 5: Count Documents
```typescript
// Optimized
async function count(filters) {
  // Use countDocuments, not count (deprecated)
  return Model.countDocuments(filters);
}
```

---

## 📊 Performance Targets

| Operation | Target Time |
|-----------|-------------|
| Simple GET by ID | < 50ms |
| GET list (paginated) | < 200ms |
| Search queries | < 300ms |
| Complex queries with joins | < 500ms |
| POST/PUT/DELETE | < 300ms |

---

## 🚀 Parallelization Pattern

When you need multiple independent operations:

```typescript
// ❌ SLOW (Sequential - 600ms total)
const user = await User.findById(userId);       // 200ms
const orders = await Order.find({ userId });     // 200ms
const cart = await Cart.findOne({ userId });     // 200ms

// ✅ FAST (Parallel - 200ms total)
const [user, orders, cart] = await Promise.all([
  User.findById(userId).select('_id name').lean(),
  Order.find({ userId }).select('_id orderNumber').lean(),
  Cart.findOne({ userId }).lean()
]);
```

---

## 🎯 Cache TTL Guide

Choose the right TTL for your data:

```typescript
CACHE_TTL.SHORT (60s)      // User cart, live data
CACHE_TTL.MEDIUM (5m)      // Product lists, search results
CACHE_TTL.LONG (15m)       // Categories, product details
CACHE_TTL.HOUR (1h)        // Settings, banners
CACHE_TTL.DAY (24h)        // Static content
```

---

## ⚡ Index Priority

Add these indexes FIRST:

```typescript
// CRITICAL (Add immediately)
UserModel.index({ phone: 1 });
UserModel.index({ email: 1 });
ProductModel.index({ slug: 1 });
ProductModel.index({ isActive: 1, inStock: 1 });
OrderModel.index({ userId: 1, createdAt: -1 });
CartModel.index({ userId: 1 });

// IMPORTANT (Add soon)
ProductModel.index({ category: 1, isActive: 1 });
OrderModel.index({ orderStatus: 1 });
NotificationModel.index({ userId: 1, createdAt: -1 });

// NICE TO HAVE (Add later)
ProductModel.index({ name: 'text', description: 'text' });
DeliveryBoyModel.index({ 'location.coordinates': '2dsphere' });
```

---

## 🔍 Debugging Slow Queries

### 1. Enable Query Logging
```typescript
mongoose.set('debug', true);
```

### 2. Check Query Execution Plan
```typescript
const explain = await Model.find(query).explain('executionStats');
console.log(explain);
```

### 3. Use Performance Monitor
Already logs requests > 1s automatically!

---

## ✅ Daily Performance Checkup

Run these checks daily:

```bash
# Check slow requests in logs
grep "SLOW_REQUEST" logs/app.log

# Check cache hit rate
# (Look for ✅ HIT vs ❌ MISS in console)

# Check response times in browser DevTools
# Network tab → Check timing

# Validate indexes exist
node -e "require('./src/scripts/setup-indexes').default()"
```

---

## 🎯 Performance Optimization Priority

1. **Database Queries** (Do first - biggest impact)
   - Add indexes
   - Use .lean()
   - Optimize population
   - Select only needed fields

2. **Caching** (Do second - easy wins)
   - Cache frequently accessed data
   - Invalidate on updates
   - Use appropriate TTLs

3. **Parallelization** (Do third - moderate impact)
   - Promise.all for independent operations
   - Async/await properly

4. **Data Transfer** (Do fourth - optimize bandwidth)
   - Pagination
   - Field selection
   - Compression

---

**Remember**: Measure before and after! Use `X-Response-Time` header.

**Goal**: All APIs < 500ms on localhost, < 1s in production 🚀
