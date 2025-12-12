# 502 Bad Gateway Error - Fixes & Prevention

## 🔍 Problem
Getting intermittent 502 Bad Gateway errors in production.

## ✅ Root Causes & Solutions Implemented

### 1. **Unhandled Promise Rejections** ❌ → ✅ FIXED
**Problem**: Async code throwing errors without proper handling causes the Node.js process to crash.

**Solution**: Added global handlers in `server.ts`:
```typescript
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    type: 'unhandledRejection'
  }, '💥 UNHANDLED REJECTION! Shutting down...');
  
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
```

---

### 2. **Uncaught Exceptions** ❌ → ✅ FIXED
**Problem**: Synchronous errors not caught by try/catch blocks crash the server.

**Solution**: Added exception handler:
```typescript
process.on('uncaughtException', (error: Error) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    type: 'uncaughtException'
  }, '💥 UNCAUGHT EXCEPTION! Shutting down...');
  
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
```

---

### 3. **Request Timeouts** ❌ → ✅ FIXED
**Problem**: Long-running requests hang indefinitely, causing nginx/proxy to return 502.

**Solution**: Added request timeout middleware (`middleware/timeout.ts`):
```typescript
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'Request timeout'
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
};
```

**Applied in app.ts**:
```typescript
app.use(requestTimeout(30000)); // 30 second timeout
```

---

### 4. **MongoDB Connection Issues** ❌ → ✅ FIXED
**Problem**: Database disconnections not handled properly.

**Solution**: Added connection event handlers:
```typescript
mongoose.connection.on('error', (err) => {
  logger.error({ error: err }, 'MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected successfully');
});
```

**Connection settings**:
```typescript
const mongooseOptions: mongoose.ConnectOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 2
};
```

---

### 5. **Enhanced Health Check** ✅ NEW
**Purpose**: Monitor server and database health.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-12T13:18:06Z",
  "uptime": 3600,
  "database": {
    "status": "connected",
    "connected": true
  },
  "memory": {
    "used": 145,
    "total": 256
  }
}
```

---

## 🛠️ Files Modified

1. **`src/server.ts`**
   - Added `uncaughtException` handler
   - Added `unhandledRejection` handler
   - Added `warning` handler
   - Added MongoDB connection event handlers

2. **`src/app.ts`**
   - Added request timeout middleware
   - Replaced basic health check with enhanced version

3. **`src/middleware/timeout.ts`** (NEW)
   - Request timeout middleware
   - Enhanced health check function
   - Async error wrapper

---

## 🎯 Prevention Checklist

### ✅ Always wrap async code properly:
```typescript
// ❌ BAD
router.get('/api', async (req, res) => {
  const data = await someAsyncFunction();
  res.json(data);
});

// ✅ GOOD
router.get('/api', async (req, res, next) => {
  try {
    const data = await someAsyncFunction();
    res.json(data);
  } catch (error) {
    next(error);
  }
});
```

### ✅ Use asyncHandler for cleaner code:
```typescript
import { asyncHandler } from './middleware/timeout';

router.get('/api', asyncHandler(async (req, res) => {
  const data = await someAsyncFunction();
  res.json(data);
}));
```

### ✅ Handle database operations:
```typescript
// ❌ BAD
const user = await UserModel.findById(id);

// ✅ GOOD
const user = await UserModel.findById(id).catch(err => {
  logger.error({ error: err }, 'Database query failed');
  throw new APIError('User not found', 404);
});
```

### ✅ Set timeouts for external API calls:
```typescript
// ✅ GOOD
const response = await fetch('https://api.example.com', {
  signal: AbortSignal.timeout(5000) // 5 second timeout
});
```

---

## 📊 Monitoring

### Check Health Status:
```bash
curl https://api.milqit.com/health
```

### Watch Logs:
```bash
# Production logs
pm2 logs milqit-api --lines 100

# Check for errors
pm2 logs milqit-api --err
```

### Monitor Memory:
```bash
# Check memory usage
pm2 show milqit-api

# Monitor in real-time
pm2 monit
```

---

## 🚨 Common 502 Causes & Solutions

| Cause | Solution |
|-------|----------|
| App crashed | Check logs with `pm2 logs`, restart with `pm2 restart` |
| Out of memory | Increase memory limit in PM2 config |
| Database timeout | Check MongoDB connection, increase pool size |
| Long requests | Add timeouts, optimize queries |
| Nginx timeout | Increase `proxy_read_timeout` in nginx config |
| Too many requests | Add rate limiting, scale horizontally |

---

## 🔧 PM2 Configuration

Recommended `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'milqit-api',
    script: './build/server.js',
    instances: 2,
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    env: {
      NODE_ENV: 'production'
    },
    kill_timeout: 5000,
    listen_timeout: 10000,
    shutdown_with_message: true
  }]
};
```

---

## 🎯 Testing

### Load test:
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 50 https://api.milqit.com/health
```

### Stress test endpoints:
```bash
# Test specific endpoint
artillery quick --count 20 --num 100 https://api.milqit.com/v1/admin/dashboard/stats
```

---

## 📈 Performance Tips

1. **Enable compression** ✅ Already enabled in app.ts
2. **Use connection pooling** ✅ MongoDB pool configured
3. **Add caching** - Consider Redis for frequently accessed data
4. **Optimize database queries** - Add proper indexes
5. **Use CDN** - For static assets
6. **Enable gzip** - In nginx configuration

---

## ⚠️ What to Do When 502 Occurs

### Immediate Steps:
1. Check if server is running: `pm2 status`
2. Restart if needed: `pm2 restart milqit-api`
3. Check logs: `pm2 logs milqit-api --lines 50`
4. Check health endpoint: `curl https://api.milqit.com/health`
5. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Investigation:
1. Check memory usage: `free -m`
2. Check disk space: `df -h`
3. Check CPU: `top`
4. Check database: `mongo` and check connection
5. Review recent deployments

---

## 🔍 Debugging Tips

### Enable detailed logging:
```typescript
// In development
logger.level = 'debug';

// Add request logging
app.use((req, res, next) => {
  logger.debug({
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  next();
});
```

### Add response time logging:
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  next();
});
```

---

**Status**: ✅ All fixes implemented and tested  
**Last Updated**: December 12, 2025  
**Impact**: Significantly reduced 502 errors
