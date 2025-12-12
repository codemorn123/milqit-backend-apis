# Admin Dashboard - Quick API Reference

## 📡 All Dashboard Endpoints

Base URL: `/v1/admin/dashboard`

| Endpoint | Method | Purpose | Response Data |
|----------|--------|---------|---------------|
| `/stats` | GET | Main dashboard statistics | Revenue, Orders, Products, Customers with % changes |
| `/sales-overview` | GET | Revenue & order trends | Time-series data for graphs |
| `/recent-orders` | GET | Latest orders | Order list with customer info |
| `/top-products` | GET | Best-selling products | Product sales rankings |
| `/customer-insights` | GET | Customer analytics | Total, active, new, top customers |
| `/order-status-distribution` | GET | Order breakdown by status | Status counts and amounts |
| `/revenue-by-payment-method` | GET | Payment method analytics | Revenue per payment type |

---

## 🎯 Quick Start

### 1. Get All Dashboard Data at Once

```javascript
const dashboardData = await Promise.all([
  fetch('/v1/admin/dashboard/stats'),
  fetch('/v1/admin/dashboard/sales-overview?period=30days'),
  fetch('/v1/admin/dashboard/recent-orders?limit=10'),
  fetch('/v1/admin/dashboard/top-products?limit=5')
]).then(responses => Promise.all(responses.map(r => r.json())));

const [stats, sales, orders, products] = dashboardData;
```

### 2. Display Stats Cards

```jsx
// Stats from /dashboard/stats
<StatsGrid>
  <StatCard 
    title="Total Revenue" 
    value={`₹${stats.result.totalRevenue.current / 1000}K`}
    trend={stats.result.totalRevenue.percentageChange}
    label="vs last month"
    icon="💰"
    color="green"
  />
  
  <StatCard 
    title="Total Orders" 
    value={stats.result.totalOrders.current.toLocaleString()}
    trend={stats.result.totalOrders.percentageChange}
    label="vs last month"
    icon="🛒"
    color="purple"
  />
  
  <StatCard 
    title="Total Products" 
    value={stats.result.totalProducts.current}
    label={`${stats.result.totalProducts.activeProducts} active`}
    icon="📦"
    color="orange"
  />
  
  <StatCard 
    title="New Customers" 
    value={stats.result.newCustomers.current.toLocaleString()}
    trend={stats.result.newCustomers.percentageChange}
    label="this month"
    icon="👥"
    color="blue"
  />
</StatsGrid>
```

### 3. Render Sales Graph

```jsx
// Data from /dashboard/sales-overview
import { Line } from 'react-chartjs-2';

const SalesChart = ({ data }) => ({
  labels: data.result.labels,
  datasets: [
    {
      label: 'Revenue (₹)',
      data: data.result.revenue,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Orders',
      data: data.result.orders,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
});

<Line data={SalesChart(salesData)} options={chartOptions} />
```

### 4. Recent Orders Table

```jsx
// Data from /dashboard/recent-orders
<Table>
  <thead>
    <tr>
      <th>Customer</th>
      <th>Order ID</th>
      <th>Amount</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {orders.result.map(order => (
      <tr key={order.orderId}>
        <td>{order.customerName}</td>
        <td>#{order.orderNumber.slice(-6)}</td>
        <td>₹{order.amount.toLocaleString()}</td>
        <td>
          <StatusBadge status={order.status}>
            {order.status}
          </StatusBadge>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

## 🎨 Status Badge Colors

```jsx
const getStatusColor = (status) => {
  const colors = {
    delivered: 'green',
    shipped: 'blue',
    pending: 'yellow',
    cancelled: 'red',
    confirmed: 'purple'
  };
  return colors[status] || 'gray';
};
```

---

## ⏱️ Time Period Filters

For `/sales-overview` endpoint:

```jsx
const [period, setPeriod] = useState('30days');

<ButtonGroup>
  <Button onClick={() => setPeriod('7days')}>7 Days</Button>
  <Button onClick={() => setPeriod('30days')} active>30 Days</Button>
  <Button onClick={() => setPeriod('90days')}>90 Days</Button>
  <Button onClick={() => setPeriod('1year')}>1 Year</Button>
</ButtonGroup>
```

---

## 📊 Format Utilities

```javascript
// Currency formatter
const formatCurrency = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// Percentage formatter
const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Date formatter
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric'
  });
};
```

---

## 🔄 Auto-refresh Dashboard

```javascript
useEffect(() => {
  // Initial load
  fetchDashboardData();
  
  // Refresh every 30 seconds
  const interval = setInterval(fetchDashboardData, 30000);
  
  return () => clearInterval(interval);
}, []);
```

---

## 🎯 Example: Complete Dashboard Component

```jsx
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState(null);
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState('30days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, salesRes, ordersRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get(`/admin/dashboard/sales-overview?period=${period}`),
        api.get('/admin/dashboard/recent-orders?limit=10')
      ]);
      
      setStats(statsRes.data.result);
      setSales(salesRes.data.result);
      setOrders(ordersRes.data.result);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="dashboard">
      <StatsCards data={stats} />
      <SalesChart data={sales} period={period} onPeriodChange={setPeriod} />
      <RecentOrdersTable orders={orders} />
    </div>
  );
};
```

---

**Created**: December 12, 2025  
**For**: Milqit Admin Dashboard  
**Status**: ✅ Production Ready
