# Admin Dashboard Analytics API

Complete analytics endpoints for admin dashboard with real-time statistics, graphs, and insights.

---

## 📊 Dashboard Endpoints

### 1. Dashboard Statistics
**Endpoint**: `GET /v1/admin/dashboard/stats`

Get main dashboard overview statistics (similar to the stat cards in your UI).

**Request**:
```bash
GET /v1/admin/dashboard/stats
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "result": {
    "totalRevenue": {
      "current": 391200,
      "previous": 348500,
      "percentageChange": 12.3,
      "label": "vs last month"
    },
    "totalOrders": {
      "current": 5103,
      "previous": 4712,
      "percentageChange": 8.3,
      "label": "vs last month"
    },
    "totalProducts": {
      "current": 234,
      "activeProducts": 195,
      "percentageChange": 5.1,
      "label": "195 active"
    },
    "newCustomers": {
      "current": 1748,
      "percentageChange": 18.2,
      "label": "this month"
    }
  }
}
```

**Use Case**: Display on main dashboard cards showing key metrics.

---

### 2. Sales Overview (For Graphs)
**Endpoint**: `GET /v1/admin/dashboard/sales-overview?period=30days`

Get revenue and order trends over time for charts/graphs.

**Query Parameters**:
- `period`: `7days` | `30days` | `90days` | `1year` (default: `30days`)

**Request**:
```bash
GET /v1/admin/dashboard/sales-overview?period=30days
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Sales overview retrieved successfully",
  "result": {
    "labels": ["2025-01-01", "2025-01-02", "2025-01-03", ...],
    "revenue": [4200, 5500, 4800, 6200, ...],
    "orders": [38, 45, 42, 52, ...],
    "totalRevenue": 156000,
    "totalOrders": 1250
  }
}
```

**Use Case**: 
- Plot line/area charts for revenue trends
- Display order count trends
- Compare revenue vs orders

**Chart Implementation**:
```javascript
// Example with Chart.js or similar
{
  labels: result.labels,
  datasets: [
    {
      label: 'Revenue',
      data: result.revenue,
      borderColor: 'rgb(75, 192, 192)',
      fill: true
    },
    {
      label: 'Orders',
      data: result.orders,
      borderColor: 'rgb(153, 102, 255)',
      fill: false
    }
  ]
}
```

---

### 3. Recent Orders
**Endpoint**: `GET /v1/admin/dashboard/recent-orders?limit=10`

Get latest customer orders for the dashboard table.

**Query Parameters**:
- `limit`: Number of orders to retrieve (default: 10)

**Request**:
```bash
GET /v1/admin/dashboard/recent-orders?limit=5
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Recent orders retrieved successfully",
  "result": [
    {
      "orderId": "676123abc45ef678901234",
      "orderNumber": "ORD1734028123456",
      "customerName": "Ankit Sharma",
      "amount": 2340,
      "status": "delivered",
      "createdAt": "2025-12-11T10:30:00Z"
    },
    {
      "orderId": "676123abc45ef678901235",
      "orderNumber": "ORD1734028123457",
      "customerName": "Priya Singh",
      "amount": 1890,
      "status": "shipped",
      "createdAt": "2025-12-11T09:15:00Z"
    },
    {
      "orderId": "676123abc45ef678901236",
      "orderNumber": "ORD1734028123458",
      "customerName": "Rahul Kumar",
      "amount": 3120,
      "status": "pending",
      "createdAt": "2025-12-11T08:45:00Z"
    }
  ]
}
```

**Use Case**: Display in "Recent Orders" table with customer names, amounts, and status badges.

---

### 4. Top Products
**Endpoint**: `GET /v1/admin/dashboard/top-products?limit=10`

Get best-selling products by revenue.

**Query Parameters**:
- `limit`: Number of products to retrieve (default: 10)

**Request**:
```bash
GET /v1/admin/dashboard/top-products?limit=5
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Top products retrieved successfully",
  "result": [
    {
      "productId": "prod123",
      "name": "Fresh Milk 1L",
      "totalSales": 1250,
      "totalRevenue": 62500,
      "orderCount": 850
    },
    {
      "productId": "prod124",
      "name": "Brown Bread",
      "totalSales": 980,
      "totalRevenue": 49000,
      "orderCount": 720
    }
  ]
}
```

**Use Case**: Display top-selling products table or chart.

---

### 5. Customer Insights
**Endpoint**: `GET /v1/admin/dashboard/customer-insights`

Get customer statistics and top customers.

**Request**:
```bash
GET /v1/admin/dashboard/customer-insights
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Customer insights retrieved successfully",
  "result": {
    "totalCustomers": 5432,
    "activeCustomers": 4789,
    "newThisMonth": 342,
    "topCustomers": [
      {
        "customerId": "user123",
        "name": "Rajesh Patel",
        "totalOrders": 45,
        "totalSpent": 125600
      },
      {
        "customerId": "user124",
        "name": "Sneha Gupta",
        "totalOrders": 38,
        "totalSpent": 98500
      }
    ]
  }
}
```

**Use Case**: Customer analytics section showing total, active, and VIP customers.

---

### 6. Order Status Distribution
**Endpoint**: `GET /v1/admin/dashboard/order-status-distribution`

Get breakdown of orders by status (for pie/donut charts).

**Request**:
```bash
GET /v1/admin/dashboard/order-status-distribution
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Order status distribution retrieved successfully",
  "result": {
    "pending": {
      "count": 45,
      "totalAmount": 125000
    },
    "confirmed": {
      "count": 32,
      "totalAmount": 89000
    },
    "shipped": {
      "count": 28,
      "totalAmount": 76000
    },
    "delivered": {
      "count": 4998,
      "totalAmount": 14250000
    },
    "cancelled": {
      "count": 73,
      "totalAmount": 0
    }
  }
}
```

**Use Case**: Pie chart showing order status distribution.

---

### 7. Revenue by Payment Method
**Endpoint**: `GET /v1/admin/dashboard/revenue-by-payment-method`

Get breakdown of revenue by payment method.

**Request**:
```bash
GET /v1/admin/dashboard/revenue-by-payment-method
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Revenue by payment method retrieved successfully",
  "result": {
    "upi": {
      "orderCount": 3245,
      "revenue": 9876500
    },
    "cod": {
      "orderCount": 1523,
      "revenue": 4123000
    },
    "card": {
      "orderCount": 335,
      "revenue": 1250500
    }
  }
}
```

**Use Case**: Chart showing payment method preferences and revenue distribution.

---

## 🎨 Dashboard Layout Suggestions

### Main Dashboard Grid

```
┌─────────────────────────────────────────────────────────┐
│  [Total Revenue] [Total Orders] [Products] [Customers]  │
└─────────────────────────────────────────────────────────┘
┌────────────────────────────┬───────────────────────────┐
│   Sales Overview Graph      │  Recent Orders Table      │
│   (Line/Area Chart)         │  (Latest 10 orders)       │
│   - 7 Days / 30 Days        │                           │
└────────────────────────────┴───────────────────────────┘
┌────────────────────────────┬───────────────────────────┐
│   Top Products              │  Customer Insights        │
│   (Table/Bar Chart)         │  (Stats + Top Customers)  │
└────────────────────────────┴───────────────────────────┘
┌────────────────────────────┬───────────────────────────┐
│   Order Status              │  Payment Methods          │
│   (Donut Chart)             │  (Pie Chart)              │
└────────────────────────────┴───────────────────────────┘
```

---

## 📈 Implementation Example

### Frontend Integration

```typescript
// Fetch dashboard data on component mount
const fetchDashboardData = async () => {
  try {
    // Parallel requests for better performance
    const [stats, sales, orders, products] = await Promise.all([
      fetch('/v1/admin/dashboard/stats'),
      fetch('/v1/admin/dashboard/sales-overview?period=30days'),
      fetch('/v1/admin/dashboard/recent-orders?limit=10'),
      fetch('/v1/admin/dashboard/top-products?limit=5')
    ]);

    // Update state with responses
    setDashboardStats(await stats.json());
    setSalesData(await sales.json());
    setRecentOrders(await orders.json());
    setTopProducts(await products.json());
  } catch (error) {
    console.error('Dashboard fetch error:', error);
  }
};
```

### Stats Cards Component

```jsx
<div className="stats-grid">
  <StatCard
    icon={<DollarIcon />}
    title="Total Revenue"
    value={`₹${formatCurrency(stats.totalRevenue.current)}`}
    change={stats.totalRevenue.percentageChange}
    label={stats.totalRevenue.label}
    color="green"
  />
  <StatCard
    icon={<CartIcon />}
    title="Total Orders"
    value={stats.totalOrders.current.toLocaleString()}
    change={stats.totalOrders.percentageChange}
    label={stats.totalOrders.label}
    color="purple"
  />
  {/* ... more cards ... */}
</div>
```

---

## 🔄 Real-time Updates

For real-time dashboard updates, consider:

1. **Polling**: Refresh data every 30-60 seconds
   ```javascript
   setInterval(fetchDashboardData, 30000);
   ```

2. **WebSocket**: Push updates for new orders (future enhancement)

3. **Optimistic Updates**: Update UI immediately, sync with server

---

## 🚀 Performance Tips

1. **Caching**: Dashboard stats can be cached for 5-10 minutes
2. **Pagination**: Load recent orders in batches
3. **Lazy Loading**: Load charts only when visible
4. **Database Indexing**: Ensure indexes on:
   - `orders.createdAt`
   - `orders.orderStatus` 
   - `orders.user`
   - `users.createdAt`

---

## 📊 Chart Libraries Compatibility

These APIs work with:
- ✅ **Chart.js** - Simple and lightweight
- ✅ **Recharts** - React-specific
- ✅ **ApexCharts** - Feature-rich
- ✅ **Victory** - Composable charts
- ✅ **Nivo** - Beautiful D3 charts

---

**Created**: December 12, 2025  
**Status**: ✅ Ready for Production  
**Version**: 1.0.0
