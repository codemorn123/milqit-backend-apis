# Admin Delivery Boy Management API Documentation

## Overview
This API provides comprehensive administrative operations for managing delivery boys/partners including CRUD operations, verification, zone assignment, and performance tracking.

## Base URL
- **Development**: `http://localhost:5001/v1`
- **Production**: `https://api.milqit.com/v1`

## Authentication
All admin endpoints require authentication with admin role.

**Header**:
```
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

---

## Endpoints

### 1. Create Delivery Boy
Create a new delivery boy account directly by admin.

**Endpoint**: `POST /admin/delivery-boys`

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+911234567890",
  "email": "john@example.com",
  "password": "optional_password",
  "vehicleType": "bike",
  "vehicleNumber": "KA01AB1234",
  "drivingLicenseNumber": "DL1234567890",
  "aadharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "deliveryZone": ["Bangalore North", "Bangalore East"],
  "isActive": true,
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+919876543210"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Delivery boy created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+911234567890",
    "email": "john@example.com",
    "isActive": true,
    "isPhoneVerified": true,
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234",
    "deliveryZone": ["Bangalore North", "Bangalore East"],
    ...
  }
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:5001/v1/admin/delivery-boys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+911234567890",
    "email": "john@example.com",
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234",
    "deliveryZone": ["Bangalore North"],
    "isActive": true
  }'
```

---

### 2. Get Delivery Boys List
Get paginated list of delivery boys with filtering and sorting.

**Endpoint**: `GET /admin/delivery-boys`

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search by name, phone, or email
- `isActive` (boolean, optional): Filter by active status
- `isAvailable` (boolean, optional): Filter by availability
- `isDocumentVerified` (boolean, optional): Filter by document verification
- `vehicleType` (string, optional): Filter by vehicle type (bike|scooter|bicycle|car)
- `deliveryZone` (string, optional): Filter by delivery zone
- `sortBy` (string, optional): Sort field (name|createdAt|totalDeliveries|averageRating)
- `sortOrder` (string, optional): Sort order (asc|desc)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery boys retrieved successfully",
  "data": {
    "deliveryBoys": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "phone": "+911234567890",
        "email": "john@example.com",
        "isActive": true,
        "isAvailable": true,
        "vehicleType": "bike",
        "totalDeliveries": 150,
        "averageRating": 4.8,
        ...
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**cURL Commands**:
```bash
# Get all delivery boys
curl -X GET "http://localhost:5001/v1/admin/delivery-boys?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get active delivery boys only
curl -X GET "http://localhost:5001/v1/admin/delivery-boys?isActive=true" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Search delivery boys
curl -X GET "http://localhost:5001/v1/admin/delivery-boys?search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filter by vehicle type and zone
curl -X GET "http://localhost:5001/v1/admin/delivery-boys?vehicleType=bike&deliveryZone=Bangalore%20North" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Sort by rating
curl -X GET "http://localhost:5001/v1/admin/delivery-boys?sortBy=averageRating&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 3. Get Delivery Boy Statistics
Get overall statistics for delivery boy management.

**Endpoint**: `GET /admin/delivery-boys/stats`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalDeliveryBoys": 100,
    "activeDeliveryBoys": 85,
    "availableDeliveryBoys": 45,
    "onDelivery": 40,
    "documentsVerified": 80,
    "documentsPending": 20,
    "averageRating": 4.5,
    "totalDeliveries": 5000,
    "completedDeliveries": 4750,
    "cancelledDeliveries": 250,
    "byVehicleType": {
      "bike": 60,
      "scooter": 30,
      "bicycle": 5,
      "car": 5
    },
    "byZone": {
      "Bangalore North": 40,
      "Bangalore South": 35,
      "Bangalore East": 25
    }
  }
}
```

**cURL Command**:
```bash
curl -X GET http://localhost:5001/v1/admin/delivery-boys/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 4. Get Delivery Boy Details
Get details of a specific delivery boy.

**Endpoint**: `GET /admin/delivery-boys/{deliveryBoyId}`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery boy retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+911234567890",
    "email": "john@example.com",
    "isActive": true,
    "isPhoneVerified": true,
    "isEmailVerified": false,
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234",
    "drivingLicenseNumber": "DL1234567890",
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true,
    "isAvailable": true,
    "currentLocation": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    },
    "deliveryZone": ["Bangalore North", "Bangalore East"],
    "totalDeliveries": 150,
    "completedDeliveries": 145,
    "cancelledDeliveries": 5,
    "averageRating": 4.8,
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+919876543210",
    "createdAt": "2025-12-12T13:44:04.000Z",
    "updatedAt": "2025-12-12T13:44:04.000Z"
  }
}
```

**cURL Command**:
```bash
curl -X GET http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 5. Update Delivery Boy
Update delivery boy details.

**Endpoint**: `PUT /admin/delivery-boys/{deliveryBoyId}`

**Request Body** (all fields optional):
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "vehicleType": "scooter",
  "vehicleNumber": "KA02CD5678",
  "drivingLicenseNumber": "DL9876543210",
  "deliveryZone": ["Bangalore North", "Bangalore Central"],
  "isActive": true,
  "isDocumentVerified": true,
  "isBackgroundCheckDone": true,
  "bankAccountNumber": "1234567890",
  "ifscCode": "SBIN0001234",
  "bankAccountHolderName": "John Smith",
  "upiId": "johnsmith@upi"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery boy updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    ...
  }
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "vehicleType": "scooter",
    "isActive": true
  }'
```

---

### 6. Delete Delivery Boy
Delete a delivery boy account.

**Endpoint**: `DELETE /admin/delivery-boys/{deliveryBoyId}`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery boy deleted successfully",
  "data": null
}
```

**cURL Command**:
```bash
curl -X DELETE http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 7. Toggle Delivery Boy Status
Activate or deactivate a delivery boy account.

**Endpoint**: `PUT /admin/delivery-boys/{deliveryBoyId}/status`

**Request Body**:
```json
{
  "isActive": true,
  "reason": "Completed verification process"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery boy activated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "isActive": true,
    ...
  }
}
```

**cURL Commands**:
```bash
# Activate delivery boy
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true,
    "reason": "Documents verified and approved"
  }'

# Deactivate delivery boy
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false,
    "reason": "Multiple customer complaints"
  }'
```

---

### 8. Verify Documents
Verify delivery boy documents.

**Endpoint**: `PUT /admin/delivery-boys/{deliveryBoyId}/verify-documents`

**Request Body**:
```json
{
  "isDocumentVerified": true,
  "isBackgroundCheckDone": true,
  "verificationNotes": "All documents verified and authentic"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Documents verified successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true,
    ...
  }
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011/verify-documents \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true,
    "verificationNotes": "All documents verified"
  }'
```

---

### 9. Assign Delivery Zones
Assign delivery zones to a delivery boy.

**Endpoint**: `PUT /admin/delivery-boys/{deliveryBoyId}/assign-zones`

**Request Body**:
```json
{
  "deliveryZone": ["Bangalore North", "Bangalore East", "Bangalore Central"]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Delivery zones assigned successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "deliveryZone": ["Bangalore North", "Bangalore East", "Bangalore Central"],
    ...
  }
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011/assign-zones \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryZone": ["Bangalore North", "Bangalore East"]
  }'
```

---

### 10. Get Performance Metrics
Get performance metrics for a delivery boy.

**Endpoint**: `GET /admin/delivery-boys/{deliveryBoyId}/performance`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Performance metrics retrieved successfully",
  "data": {
    "deliveryBoyId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "+911234567890",
    "totalDeliveries": 150,
    "completedDeliveries": 145,
    "cancelledDeliveries": 5,
    "averageRating": 4.8,
    "completionRate": 96.67
  }
}
```

**cURL Command**:
```bash
curl -X GET http://localhost:5001/v1/admin/delivery-boys/507f1f77bcf86cd799439011/performance \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 11. Get Available Delivery Boys
Get list of available delivery boys for order assignment.

**Endpoint**: `GET /admin/delivery-boys/available/list`

**Query Parameters**:
- `zone` (string, optional): Filter by delivery zone

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Available delivery boys retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "+911234567890",
      "isAvailable": true,
      "currentLocation": {
        "type": "Point",
        "coordinates": [77.5946, 12.9716]
      },
      "averageRating": 4.8,
      "vehicleType": "bike",
      ...
    }
  ]
}
```

**cURL Commands**:
```bash
# Get all available delivery boys
curl -X GET "http://localhost:5001/v1/admin/delivery-boys/available/list" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get available delivery boys in specific zone
curl -X GET "http://localhost:5001/v1/admin/delivery-boys/available/list?zone=Bangalore%20North" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 12. Bulk Operations
Perform bulk operations on multiple delivery boys.

**Endpoint**: `POST /admin/delivery-boys/bulk-operation`

**Request Body**:
```json
{
  "deliveryBoyIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "operation": "activate",
  "reason": "Verification completed for all"
}
```

**Operations**:
- `activate`: Activate delivery boys
- `deactivate`: Deactivate delivery boys
- `verify`: Verify documents
- `delete`: Delete delivery boys

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Bulk activate operation completed",
  "data": {
    "success": 2,
    "failed": 1,
    "errors": [
      {
        "deliveryBoyId": "507f1f77bcf86cd799439013",
        "error": "Delivery boy not found"
      }
    ]
  }
}
```

**cURL Commands**:
```bash
# Bulk activate
curl -X POST http://localhost:5001/v1/admin/delivery-boys/bulk-operation \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryBoyIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "operation": "activate",
    "reason": "Verification completed"
  }'

# Bulk verify documents
curl -X POST http://localhost:5001/v1/admin/delivery-boys/bulk-operation \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryBoyIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "operation": "verify",
    "reason": "Documents verified"
  }'

# Bulk deactivate
curl -X POST http://localhost:5001/v1/admin/delivery-boys/bulk-operation \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryBoyIds": ["507f1f77bcf86cd799439011"],
    "operation": "deactivate",
    "reason": "Temporary suspension"
  }'
```

---

## Common Use Cases

### 1. Onboarding New Delivery Boy
```bash
# Step 1: Create account
curl -X POST http://localhost:5001/v1/admin/delivery-boys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Delivery Boy",
    "phone": "+911234567890",
    "email": "newboy@example.com",
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234",
    "isActive": false
  }'

# Step 2: Verify documents (after receiving documents)
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/DELIVERY_BOY_ID/verify-documents \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true
  }'

# Step 3: Assign zones
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/DELIVERY_BOY_ID/assign-zones \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryZone": ["Bangalore North"]
  }'

# Step 4: Activate account
curl -X PUT http://localhost:5001/v1/admin/delivery-boys/DELIVERY_BOY_ID/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true,
    "reason": "Onboarding completed"
  }'
```

### 2. Finding Delivery Boy for Order
```bash
# Get available delivery boys in specific zone sorted by rating
curl -X GET "http://localhost:5001/v1/admin/delivery-boys/available/list?zone=Bangalore%20North" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Performance Review
```bash
# Get performance metrics
curl -X GET http://localhost:5001/v1/admin/delivery-boys/DELIVERY_BOY_ID/performance \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one field must be provided for update"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Admin role required."
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Delivery boy not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Delivery boy with this phone number already exists"
  }
}
```

---

## Best Practices

1. **Always verify documents** before activating delivery boy accounts
2. **Assign appropriate zones** based on delivery boy's location and vehicle type
3. **Monitor performance metrics** regularly to identify top performers and issues
4. **Use bulk operations** for efficiency when managing multiple delivery boys
5. **Keep delivery zones updated** based on coverage requirements
6. **Review background checks** before final activation
7. **Deactivate immediately** if any policy violations occur
8. **Track ratings** to ensure quality service

---

Created: 2025-12-12
