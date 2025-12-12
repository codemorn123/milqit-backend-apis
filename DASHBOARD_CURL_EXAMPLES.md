# Dashboard API - cURL Commands & Response Examples

Complete guide with actual cURL commands and response examples for testing.

---

## 🔐 Authentication

All requests require admin JWT token:
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 1️⃣ Dashboard Statistics

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/stats' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
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
      "percentageChange": 0,
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

**What you'll see**:
- ✅ Current month revenue vs last month
- ✅ Order count comparison
- ✅ Product inventory status
- ✅ New customer growth

---

## 2️⃣ Sales Overview (30 Days)

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/sales-overview?period=30days' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
```json
{
  "success": true,
  "message": "Sales overview retrieved successfully",
  "result": {
    "labels": [
      "2025-11-12",
      "2025-11-13",
      "2025-11-14",
      "2025-11-15",
      "2025-11-16",
      "2025-11-17",
      "2025-11-18",
      "2025-11-19",
      "2025-11-20",
      "2025-11-21",
      "2025-11-22",
      "2025-11-23",
      "2025-11-24",
      "2025-11-25",
      "2025-11-26",
      "2025-11-27",
      "2025-11-28",
      "2025-11-29",
      "2025-11-30",
      "2025-12-01",
      "2025-12-02",
      "2025-12-03",
      "2025-12-04",
      "2025-12-05",
      "2025-12-06",
      "2025-12-07",
      "2025-12-08",
      "2025-12-09",
      "2025-12-10",
      "2025-12-11"
    ],
    "revenue": [
      4200, 5500, 4800, 6200, 5900, 5100, 4700,
      5300, 6100, 5800, 6500, 5700, 5200, 6800,
      7200, 6900, 7500, 6300, 5900, 7800, 8200,
      7600, 8900, 8500, 7900, 8700, 9200, 8800,
      9500, 9100
    ],
    "orders": [
      38, 45, 42, 52, 48, 44, 40,
      46, 51, 49, 55, 47, 43, 58,
      62, 59, 64, 53, 48, 66, 71,
      65, 76, 73, 68, 75, 79, 76,
      82, 78
    ],
    "totalRevenue": 198500,
    "totalOrders": 1680
  }
}
```

**Use this for**:
- 📈 Line/Area charts
- 📊 Revenue trend analysis
- 📉 Order volume tracking

---

## 3️⃣ Sales Overview (7 Days)

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/sales-overview?period=7days' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
```json
{
  "success": true,
  "message": "Sales overview retrieved successfully",
  "result": {
    "labels": [
      "2025-12-05",
      "2025-12-06",
      "2025-12-07",
      "2025-12-08",
      "2025-12-09",
      "2025-12-10",
      "2025-12-11"
    ],
    "revenue": [7800, 8200, 7600, 8900, 8500, 7900, 8700],
    "orders": [66, 71, 65, 76, 73, 68, 75],
    "totalRevenue": 57600,
    "totalOrders": 494
  }
}
```

---

## 4️⃣ Recent Orders

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/recent-orders?limit=10' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
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
      "createdAt": "2025-12-11T16:30:00.000Z"
    },
    {
      "orderId": "676123abc45ef678901235",
      "orderNumber": "ORD1734028123457",
      "customerName": "Priya Singh",
      "amount": 1890,
      "status": "shipped",
      "createdAt": "2025-12-11T15:15:00.000Z"
    },
    {
      "orderId": "676123abc45ef678901236",
      "orderNumber": "ORD1734028123458",
      "customerName": "Rahul Kumar",
      "amount": 3120,
      "status": "pending",
      "createdAt": "2025-12-11T14:45:00.000Z"
    },
    {
      "orderId": "676123abc45ef678901237",
      "orderNumber": "ORD1734028123459",
      "customerName": "Sneha Patel",
      "amount": 1560,
      "status": "delivered",
      "createdAt": "2025-12-11T13:20:00.000Z"
    },
    {
      "orderId": "676123abc45ef678901238",
      "orderNumber": "ORD1734028123460",
      "customerName": "Amit Verma",
      "amount": 2780,
      "status": "confirmed",
      "createdAt": "2025-12-11T12:10:00.000Z"
    },
    {
      "orderId": "676123abc45ef678901239",
      "orderNumber": "ORD1734028123461",
      "customerName": "Neha Kapoor",
      "amount": 1920,
      "status": "shipped",
      "createdAt": "2025-12-11T11:05:00.000Z"
    },
    {
      "orderId": "676123abc45ef67890123a",
      "orderNumber": "ORD1734028123462",
      "customerName": "Ravi Mehta",
      "amount": 3450,
      "status": "processing",
      "createdAt": "2025-12-11T10:30:00.000Z"
    },
    {
      "orderId": "676123abc45ef67890123b",
      "orderNumber": "ORD1734028123463",
      "customerName": "Divya Reddy",
      "amount": 2100,
      "status": "delivered",
      "createdAt": "2025-12-11T09:45:00.000Z"
    },
    {
      "orderId": "676123abc45ef67890123c",
      "orderNumber": "ORD1734028123464",
      "customerName": "Karan Joshi",
      "amount": 1680,
      "status": "pending",
      "createdAt": "2025-12-11T08:20:00.000Z"
    },
    {
      "orderId": "676123abc45ef67890123d",
      "orderNumber": "ORD1734028123465",
      "customerName": "Pooja Gupta",
      "amount": 2950,
      "status": "confirmed",
      "createdAt": "2025-12-11T07:55:00.000Z"
    }
  ]
}
```

**Perfect for**:
- 📋 Recent orders table
- 🔔 Real-time order monitoring
- 👤 Customer activity tracking

---

## 5️⃣ Top Products

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/top-products?limit=10' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
```json
{
  "success": true,
  "message": "Top products retrieved successfully",
  "result": [
    {
      "productId": "prod001",
      "name": "Fresh Milk 1L",
      "totalSales": 1250,
      "totalRevenue": 62500,
      "orderCount": 850
    },
    {
      "productId": "prod002",
      "name": "Brown Bread (400g)",
      "totalSales": 980,
      "totalRevenue": 49000,
      "orderCount": 720
    },
    {
      "productId": "prod003",
      "name": "Organic Tomatoes (1kg)",
      "totalSales": 865,
      "totalRevenue": 43250,
      "orderCount": 650
    },
    {
      "productId": "prod004",
      "name": "Amul Butter 500g",
      "totalSales": 742,
      "totalRevenue": 37100,
      "orderCount": 580
    },
    {
      "productId": "prod005",
      "name": "Fresh Paneer 200g",
      "totalSales": 698,
      "totalRevenue": 34900,
      "orderCount": 520
    },
    {
      "productId": "prod006",
      "name": "Onions (1kg)",
      "totalSales": 1520,
      "totalRevenue": 30400,
      "orderCount": 890
    },
    {
      "productId": "prod007",
      "name": "Fresh Eggs (12 pcs)",
      "totalSales": 625,
      "totalRevenue": 31250,
      "orderCount": 475
    },
    {
      "productId": "prod008",
      "name": "Basmati Rice (5kg)",
      "totalSales": 384,
      "totalRevenue": 28800,
      "orderCount": 320
    },
    {
      "productId": "prod009",
      "name": "Potatoes (2kg)",
      "totalSales": 892,
      "totalRevenue": 26760,
      "orderCount": 615
    },
    {
      "productId": "prod010",
      "name": "Fresh Curd 500g",
      "totalSales": 556,
      "totalRevenue": 27800,
      "orderCount": 425
    }
  ]
}
```

**Shows you**:
- 🏆 Best-selling products
- 💰 Revenue per product
- 📦 Inventory insights

---

## 6️⃣ Customer Insights

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/customer-insights' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
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
      },
      {
        "customerId": "user125",
        "name": "Vikram Singh",
        "totalOrders": 32,
        "totalSpent": 87200
      },
      {
        "customerId": "user126",
        "name": "Priya Sharma",
        "totalOrders": 29,
        "totalSpent": 76800
      },
      {
        "customerId": "user127",
        "name": "Arjun Reddy",
        "totalOrders": 27,
        "totalSpent": 72500
      }
    ]
  }
}
```

**Insights on**:
- 👥 Customer base size
- 🎯 Active vs inactive ratio
- 🌟 VIP customers
- 📈 Monthly growth

---

## 7️⃣ Order Status Distribution

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/order-status-distribution' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
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
    "processing": {
      "count": 18,
      "totalAmount": 52000
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

**For creating**:
- 🥧 Pie/Donut charts
- 📊 Status distribution bars
- 📈 Fulfillment metrics

---

## 8️⃣ Revenue by Payment Method

### cURL Command
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/dashboard/revenue-by-payment-method' \
  -H 'Authorization: Bearer $ADMIN_TOKEN' \
  -H 'Content-Type: application/json'
```

### Response
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
    },
    "netbanking": {
      "orderCount": 128,
      "revenue": 456000
    },
    "wallet": {
      "orderCount": 92,
      "revenue": 298000
    }
  }
}
```

**Analyze**:
- 💳 Payment preferences
- 💰 Revenue by method
- 📊 Transaction patterns

---

## 🧪 Test All APIs at Once

### Bash Script
```bash
#!/bin/bash

ADMIN_TOKEN="your_admin_token_here"
BASE_URL="https://api.milqit.com/v1/admin/dashboard"

echo "🔍 Testing Dashboard Stats..."
curl -s -X GET "$BASE_URL/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n📈 Testing Sales Overview (30 days)..."
curl -s -X GET "$BASE_URL/sales-overview?period=30days" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n📋 Testing Recent Orders..."
curl -s -X GET "$BASE_URL/recent-orders?limit=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n🏆 Testing Top Products..."
curl -s -X GET "$BASE_URL/top-products?limit=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n👥 Testing Customer Insights..."
curl -s -X GET "$BASE_URL/customer-insights" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n📊 Testing Order Status Distribution..."
curl -s -X GET "$BASE_URL/order-status-distribution" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n💳 Testing Revenue by Payment Method..."
curl -s -X GET "$BASE_URL/revenue-by-payment-method" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .

echo "\n✅ All tests complete!"
```

Save as `test_dashboard.sh` and run:
```bash
chmod +x test_dashboard.sh
./test_dashboard.sh
```

---

## 🔧 Using with Postman

### Import Collection

1. Create new collection: "Milqit Dashboard APIs"
2. Add base URL variable: `{{base_url}}` = `https://api.milqit.com/v1`
3. Add auth token variable: `{{admin_token}}` = your JWT
4. Import these endpoints with Authorization header

### Environment Variables
```json
{
  "base_url": "https://api.milqit.com/v1",
  "admin_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📱 Mobile App Integration

### React Native Example
```javascript
import axios from 'axios';

const dashboardAPI = axios.create({
  baseURL: 'https://api.milqit.com/v1/admin/dashboard',
  headers: {
    'Authorization': `Bearer ${getAdminToken()}`,
    'Content-Type': 'application/json'
  }
});

// Fetch stats
const stats = await dashboardAPI.get('/stats');

// Fetch sales with period
const sales = await dashboardAPI.get('/sales-overview', {
  params: { period: '30days' }
});
```

---

## 🐛 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

**Created**: December 12, 2025  
**Status**: ✅ Ready to Test  
**Note**: Replace `$ADMIN_TOKEN` with your actual JWT token
