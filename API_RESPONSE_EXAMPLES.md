# Dashboard API Response Examples

This document shows **exactly** how each API response will look when you call the endpoints.

---

## 📊 1. Dashboard Stats Response

**API Call:**
```
GET /v1/admin/dashboard/stats
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/stats');
const data = await response.json();

console.log(data.result.totalRevenue.current); // 391200
console.log(data.result.totalRevenue.percentageChange); // 12.3
console.log(data.result.totalOrders.current); // 5103
console.log(data.result.newCustomers.current); // 1748
```

---

## 📈 2. Sales Overview Response (30 Days)

**API Call:**
```
GET /v1/admin/dashboard/sales-overview?period=30days
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/sales-overview?period=30days');
const data = await response.json();

// For Chart.js
const chartData = {
  labels: data.result.labels,
  datasets: [
    {
      label: 'Revenue',
      data: data.result.revenue,
      borderColor: 'rgb(59, 130, 246)'
    },
    {
      label: 'Orders',
      data: data.result.orders,
      borderColor: 'rgb(168, 85, 247)'
    }
  ]
};

console.log('Total Revenue:', data.result.totalRevenue); // 198500
console.log('Total Orders:', data.result.totalOrders); // 1680
```

---

## 📋 3. Recent Orders Response

**API Call:**
```
GET /v1/admin/dashboard/recent-orders?limit=10
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/recent-orders?limit=10');
const data = await response.json();

// Display in table
data.result.forEach(order => {
  console.log(`${order.customerName}: ₹${order.amount} - ${order.status}`);
});

// First order
const firstOrder = data.result[0];
console.log(firstOrder.customerName); // "Ankit Sharma"
console.log(firstOrder.orderNumber); // "ORD1734028123456"
console.log(firstOrder.amount); // 2340
console.log(firstOrder.status); // "delivered"
```

---

## 🏆 4. Top Products Response

**API Call:**
```
GET /v1/admin/dashboard/top-products?limit=10
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/top-products?limit=10');
const data = await response.json();

// Top product
const topProduct = data.result[0];
console.log(topProduct.name); // "Fresh Milk 1L"
console.log(topProduct.totalRevenue); // 62500
console.log(topProduct.totalSales); // 1250

// Loop through all
data.result.forEach((product, index) => {
  console.log(`#${index + 1}: ${product.name} - ₹${product.totalRevenue}`);
});
```

---

## 👥 5. Customer Insights Response

**API Call:**
```
GET /v1/admin/dashboard/customer-insights
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/customer-insights');
const data = await response.json();

console.log('Total Customers:', data.result.totalCustomers); // 5432
console.log('Active Customers:', data.result.activeCustomers); // 4789
console.log('New This Month:', data.result.newThisMonth); // 342

// Top customer
const topCustomer = data.result.topCustomers[0];
console.log(topCustomer.name); // "Rajesh Patel"
console.log(topCustomer.totalOrders); // 45
console.log(topCustomer.totalSpent); // 125600
```

---

## 📊 6. Order Status Distribution Response

**API Call:**
```
GET /v1/admin/dashboard/order-status-distribution
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/order-status-distribution');
const data = await response.json();

console.log('Pending Orders:', data.result.pending.count); // 45
console.log('Delivered Orders:', data.result.delivered.count); // 4998
console.log('Total Delivered Revenue:', data.result.delivered.totalAmount); // 14250000

// For pie chart
const pieData = {
  labels: Object.keys(data.result),
  data: Object.values(data.result).map(item => item.count)
};
```

---

## 💳 7. Revenue by Payment Method Response

**API Call:**
```
GET /v1/admin/dashboard/revenue-by-payment-method
```

**Response:**
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

**How to use this:**
```javascript
const response = await fetch('/v1/admin/dashboard/revenue-by-payment-method');
const data = await response.json();

console.log('UPI Orders:', data.result.upi.orderCount); // 3245
console.log('UPI Revenue:', data.result.upi.revenue); // 9876500
console.log('COD Orders:', data.result.cod.orderCount); // 1523
console.log('COD Revenue:', data.result.cod.revenue); // 4123000

// Calculate total
const totalRevenue = Object.values(data.result)
  .reduce((sum, method) => sum + method.revenue, 0);
console.log('Total Revenue:', totalRevenue);
```

---

## 🎯 Complete Example: Fetch All Dashboard Data

```javascript
async function loadDashboard() {
  try {
    // Fetch all data in parallel
    const [stats, sales, orders, products, customers, statusDist, paymentMethods] = 
      await Promise.all([
        fetch('/v1/admin/dashboard/stats').then(r => r.json()),
        fetch('/v1/admin/dashboard/sales-overview?period=30days').then(r => r.json()),
        fetch('/v1/admin/dashboard/recent-orders?limit=10').then(r => r.json()),
        fetch('/v1/admin/dashboard/top-products?limit=5').then(r => r.json()),
        fetch('/v1/admin/dashboard/customer-insights').then(r => r.json()),
        fetch('/v1/admin/dashboard/order-status-distribution').then(r => r.json()),
        fetch('/v1/admin/dashboard/revenue-by-payment-method').then(r => r.json())
      ]);

    console.log('📊 Dashboard Stats:', stats.result);
    console.log('📈 Sales Data:', sales.result);
    console.log('📋 Recent Orders:', orders.result);
    console.log('🏆 Top Products:', products.result);
    console.log('👥 Customers:', customers.result);
    console.log('📊 Status Distribution:', statusDist.result);
    console.log('💳 Payment Methods:', paymentMethods.result);

    return {
      stats: stats.result,
      sales: sales.result,
      orders: orders.result,
      products: products.result,
      customers: customers.result,
      statusDist: statusDist.result,
      paymentMethods: paymentMethods.result
    };
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Use it
const dashboardData = await loadDashboard();
```

---

## ✅ Response Structure Summary

All responses follow this pattern:

```typescript
{
  success: boolean,        // Always true for successful requests
  message: string,         // Description of the response
  result: T                // The actual data (varies by endpoint)
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

**Created**: December 12, 2025  
**Purpose**: Show exact API response formats  
**Status**: ✅ Production Ready
