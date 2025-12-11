# Complete E-Commerce API - Grocery & Vegetable Delivery System

## Overview
This is a full-featured e-commerce API designed for grocery and vegetable delivery apps like Blinkit, Zepto, or Swiggy Instamart. The system provides complete order management, dispatch tracking, and delivery functionality.

---

## 🚀 Key Features

### Customer Features
- **Order Placement**: Place orders with multiple items
- **Order Tracking**: Real-time order status tracking
- **Order History**: View past orders
- **Order Cancellation**: Cancel orders with reasons
- **Reorder**: Quickly reorder from previous orders
- **Active Orders**: View ongoing deliveries
- **Cart Management**: Full cart functionality

### Admin Features
- **Order Management**: View and manage all orders
- **Dispatch System**: Assign orders for delivery
- **Status Updates**: Update order status through delivery lifecycle
- **Delivery Tracking**: Track orders with tracking numbers
- **Analytics**: Order statistics and insights
- **Bulk Operations**: Bulk status updates
- **Pending Dispatch**: View orders awaiting dispatch
- **Active Deliveries**: Monitor ongoing deliveries

---

## 📋 Order Status Flow

```
pending → confirmed → processing (out for delivery) → shipped → delivered
                ↓
            cancelled
                ↓
            refunded
```

### Status Definitions
1. **pending**: Order received, awaiting confirmation
2. **confirmed**: Order confirmed, preparing for dispatch
3. **processing**: Order is being processed / out for delivery
4. **shipped**: Order dispatched with tracking
5. **delivered**: Order successfully delivered
6. **cancelled**: Order cancelled by user or admin
7. **refunded**: Payment refunded

---

## 🔗 API Endpoints

### Customer Order APIs (`/customer/orders`)

#### 1. Place Order
```
POST /customer/orders
Authentication: Required (JWT)
```
**Request Body:**
```json
{
  "items": [
    {
      "product": "60f7b3b3b3f1b40015c8e8a2",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+919876543210",
    "addressLine1": "123, Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "upi",
  "notes": "Deliver between 10 AM to 2 PM"
}
```

#### 2. Get My Orders
```
GET /customer/orders?page=1&limit=10
Authentication: Required
```

#### 3. Get Order Details
```
GET /customer/orders/{orderId}
Authentication: Required
```

#### 4. Track Order
```
GET /customer/orders/track/{orderNumber}
Authentication: Required
```

#### 5. Cancel Order
```
POST /customer/orders/{orderId}/cancel
Authentication: Required
```
**Body:**
```json
{
  "reason": "Changed my mind"
}
```

#### 6. Get Active Orders
```
GET /customer/orders/active
Authentication: Required
```

#### 7. Get Order History
```
GET /customer/orders/history
Authentication: Required
```

#### 8. Reorder
```
POST /customer/orders/{orderId}/reorder
Authentication: Required
```

---

### Admin Order APIs (`/admin/orders`)

#### 1. Get All Orders
```
GET /admin/orders?page=1&limit=20&orderStatus=pending&sortBy=createdAt
Authentication: Required (Admin JWT)
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `orderStatus`: Filter by status (pending, confirmed, etc.)
- `paymentStatus`: Filter by payment status
- `sortBy`: Sort field (createdAt, totalAmount)
- `sortOrder`: Sort direction (asc, desc)
- `startDate`: Filter orders from date
- `endDate`: Filter orders to date

#### 2. Get Order by ID
```
GET /admin/orders/{orderId}
Authentication: Required (Admin)
```

#### 3. Get Order by Order Number
```
GET /admin/orders/order-number/{orderNumber}
Authentication: Required (Admin)
```

#### 4. Update Order
```
PUT /admin/orders/{orderId}
Authentication: Required (Admin)
```
**Body:**
```json
{
  "orderStatus": "confirmed",
  "paymentStatus": "paid",
  "trackingNumber": "TRK123456789",
  "estimatedDelivery": "2025-12-15T10:00:00Z"
}
```

#### 5. Confirm Order
```
POST /admin/orders/{orderId}/confirm
Authentication: Required (Admin)
```
**Body:**
```json
{
  "estimatedDelivery": "2025-12-15T10:00:00Z"
}
```

#### 6. Dispatch Order
```
POST /admin/orders/{orderId}/dispatch
Authentication: Required (Admin)
```
**Body:**
```json
{
  "trackingNumber": "TRK123456789",
  "estimatedDelivery": "2025-12-15T10:00:00Z",
  "deliveryPartner": "FastDelivery Co."
}
```

#### 7. Mark Out for Delivery
```
POST /admin/orders/{orderId}/out-for-delivery
Authentication: Required (Admin)
```

#### 8. Mark Delivered
```
POST /admin/orders/{orderId}/deliver
Authentication: Required (Admin)
```
**Body:**
```json
{
  "deliveryNotes": "Delivered successfully"
}
```

#### 9. Cancel Order (Admin)
```
POST /admin/orders/{orderId}/cancel
Authentication: Required (Admin)
```
**Body:**
```json
{
  "reason": "Out of stock"
}
```

#### 10. Process Refund
```
POST /admin/orders/{orderId}/refund
Authentication: Required (Admin)
```
**Body:**
```json
{
  "reason": "Product damaged",
  "refundAmount": 500
}
```

#### 11. Delete Order
```
DELETE /admin/orders/{orderId}
Authentication: Required (Admin)
```

#### 12. Get Order Statistics
```
GET /admin/orders/analytics/stats
Authentication: Required (Admin)
```
**Response:**
```json
{
  "totalOrders": 1250,
  "totalRevenue": 125000,
  "pendingOrders": 45,
  "confirmedOrders": 32,
  "deliveredOrders": 1100,
  "cancelledOrders": 73
}
```

#### 13. Get Pending Dispatch Orders
```
GET /admin/orders/pending-dispatch?page=1&limit=20
Authentication: Required (Admin)
```

#### 14. Get Active Deliveries
```
GET /admin/orders/active-deliveries?page=1&limit=20
Authentication: Required (Admin)
```

#### 15. Bulk Update Status
```
PUT /admin/orders/bulk/update-status
Authentication: Required (Admin)
```
**Body:**
```json
{
  "orderIds": ["order1", "order2", "order3"],
  "orderStatus": "confirmed"
}
```

---

## 🛒 Additional E-Commerce Features

### Cart Management (`/customer/cart`)
- Add items to cart
- Update quantity
- Remove items
- Clear cart
- Apply coupons

### Product Management (`/admin/products`)
- Create products
- Update products
- Upload images
- Manage inventory
- Product categories

### User Management
- User registration
- Address management
- Profile updates

### Payment Integration (`/customer/payments`)
- Payment processing
- Payment verification
- Refund handling

### Coupon System (`/admin/coupons`, `/customer/coupons`)
- Create discount coupons
- Apply coupons to orders
- Validate coupon usage

---

## 🔐 Authentication

All APIs require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Customer APIs**: Require customer role
**Admin APIs**: Require admin role

---

## 💾 Data Models

### Order Model
```typescript
{
  orderNumber: string;
  user: ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 Business Logic

### Order Creation Process
1. Validate user authentication
2. Fetch product details
3. Check product availability and stock
4. Calculate pricing (subtotal, discounts, delivery charges)
5. Deduct stock from inventory
6. Create order with `pending` status
7. Return order details

### Order Cancellation Process
1. Verify order ownership (customer) or admin access
2. Check if order can be cancelled (not delivered/refunded)
3. Restore product stock
4. Update order status to `cancelled`
5. Trigger refund if payment was made

### Dispatch Process (Admin)
1. Confirm order
2. Assign tracking number
3. Set estimated delivery time
4. Mark as `shipped`
5. Send notifications to customer

---

## 🔔 Notifications
Orders trigger notifications at key events:
- Order placed
- Order confirmed
- Out for delivery
- Delivered
- Cancelled

---

## 📈 Analytics & Reporting
- Order statistics
- Revenue tracking
- Popular products
- Delivery performance
- Cancellation rates

---

## 🚚 Delivery Charges
- Free delivery on orders above ₹500
- ₹40 for orders below ₹500

---

## 🎯 Next Steps

1. **Run Build**:
   ```bash
   npm run build
   ```

2. **Test APIs**: Use Swagger UI at `/api-docs`

3. **Integration**: Connect with frontend app

4. **Deploy**: Deploy to production server

---

## 📝 Notes

- All monetary values are in INR (Indian Rupees)
- Orders are paginated (default: 10 items per page)
- Stock management is handled automatically
- Transaction safety ensured with MongoDB sessions
- Full order lifecycle tracking included

---

**Created by**: Antigravity AI
**Date**: December 11, 2025
**Version**: 1.0.0
