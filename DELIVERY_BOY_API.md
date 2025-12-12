# Delivery Boy API Documentation

## Overview
This API provides authentication and profile management for delivery boys/partners using OTP-based mobile authentication.

## Base URL
- **Development**: `http://localhost:5001/v1`
- **Production**: `https://api.milqit.com/v1`

---

## Authentication Endpoints

### 1. Send OTP
Send OTP to delivery boy's phone number for login/registration.

**Endpoint**: `POST /delivery-boy/auth/send-otp`

**Request Body**:
```json
{
  "phone": "+911234567890"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "isExistingDeliveryBoy": false,
    "otp": "123456"
  }
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:5001/v1/delivery-boy/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890"
  }'
```

---

### 2. Verify OTP & Login/Register
Verify OTP and authenticate delivery boy. If new, registers the delivery boy.

**Endpoint**: `POST /delivery-boy/auth/verify-otp`

**Request Body**:
```json
{
  "phone": "+911234567890",
  "otp": "123456",
  "name": "John Doe",
  "email": "john@example.com",
  "vehicleType": "bike",
  "vehicleNumber": "KA01AB1234"
}
```

**Note**: 
- `name`, `email`, `vehicleType`, and `vehicleNumber` are optional
- Required only for new registrations

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Registration successful. Your account is pending admin approval.",
  "data": {
    "deliveryBoy": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "+911234567890",
      "email": "john@example.com",
      "isActive": false,
      "isPhoneVerified": true,
      "isEmailVerified": false,
      "vehicleType": "bike",
      "vehicleNumber": "KA01AB1234",
      "isDocumentVerified": false,
      "isBackgroundCheckDone": false,
      "isAvailable": false,
      "totalDeliveries": 0,
      "completedDeliveries": 0,
      "averageRating": 0,
      "createdAt": "2025-12-12T13:44:04.000Z",
      "updatedAt": "2025-12-12T13:44:04.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    },
    "isNewDeliveryBoy": true
  }
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:5001/v1/delivery-boy/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "otp": "123456",
    "name": "John Doe",
    "email": "john@example.com",
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234"
  }'
```

---

### 3. Resend OTP
Resend OTP to delivery boy's phone number.

**Endpoint**: `POST /delivery-boy/auth/resend-otp`

**Request Body**:
```json
{
  "phone": "+911234567890"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "654321"
  }
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:5001/v1/delivery-boy/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890"
  }'
```

---

### 4. Refresh Token
Refresh authentication tokens.

**Endpoint**: `POST /delivery-boy/auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:5001/v1/delivery-boy/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## Profile Management Endpoints
**Note**: All profile endpoints require authentication. Include the access token in the Authorization header.

### 5. Get Profile
Get authenticated delivery boy's profile.

**Endpoint**: `GET /delivery-boy/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
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
    "isDocumentVerified": true,
    "isBackgroundCheckDone": true,
    "isAvailable": true,
    "deliveryZone": ["Bangalore North", "Bangalore East"],
    "totalDeliveries": 150,
    "completedDeliveries": 145,
    "averageRating": 4.8,
    "createdAt": "2025-12-12T13:44:04.000Z",
    "updatedAt": "2025-12-12T13:44:04.000Z"
  }
}
```

**cURL Command**:
```bash
curl -X GET http://localhost:5001/v1/delivery-boy/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Update Profile
Update delivery boy profile information.

**Endpoint**: `PUT /delivery-boy/auth/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body** (all fields optional):
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "vehicleType": "scooter",
  "vehicleNumber": "KA02CD5678",
  "drivingLicenseNumber": "DL1234567890",
  "deliveryZone": ["Bangalore North", "Bangalore East", "Bangalore Central"],
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+919876543210",
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
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "vehicleType": "scooter",
    "vehicleNumber": "KA02CD5678",
    "drivingLicenseNumber": "DL1234567890",
    "deliveryZone": ["Bangalore North", "Bangalore East", "Bangalore Central"],
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+919876543210",
    ...
  }
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:5001/v1/delivery-boy/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "vehicleType": "scooter",
    "deliveryZone": ["Bangalore North", "Bangalore East"]
  }'
```

---

### 7. Update Location
Update delivery boy's current location.

**Endpoint**: `PUT /delivery-boy/auth/location`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "currentLocation": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    },
    "lastLocationUpdate": "2025-12-12T13:44:04.000Z",
    ...
  }
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:5001/v1/delivery-boy/auth/location \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

---

### 8. Update Availability
Update delivery boy's availability status.

**Endpoint**: `PUT /delivery-boy/auth/availability`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "isAvailable": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "You are now available for deliveries",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "isAvailable": true,
    ...
  }
}
```

**cURL Command**:
```bash
# Set available
curl -X PUT http://localhost:5001/v1/delivery-boy/auth/availability \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": true
  }'

# Set unavailable
curl -X PUT http://localhost:5001/v1/delivery-boy/auth/availability \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": false
  }'
```

---

## Data Models

### DeliveryBoy Schema
```typescript
{
  id: string;
  name: string;
  phone: string;              // E.164 format
  email?: string;
  isActive: boolean;          // Admin approval required
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  
  // Vehicle Information
  vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
  vehicleNumber?: string;
  drivingLicenseNumber?: string;
  
  // KYC Documents
  aadharNumber?: string;
  panNumber?: string;
  
  // Verification Status
  isDocumentVerified: boolean;
  isBackgroundCheckDone: boolean;
  
  // Operational
  isAvailable: boolean;
  currentLocation?: {
    type: 'Point';
    coordinates: [longitude, latitude];
  };
  lastLocationUpdate?: Date;
  deliveryZone?: string[];
  
  // Performance Metrics
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageRating: number;
  
  // Bank Details
  bankAccountNumber?: string;
  ifscCode?: string;
  bankAccountHolderName?: string;
  upiId?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid phone number in E.164 format (e.g., +911234567890)"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid OTP. You have 4 attempts left."
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Account is not activated. Please contact admin."
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

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many OTP requests. Please try again later."
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Failed to send OTP: Connection timeout"
  }
}
```

---

## Authentication Flow

### For New Delivery Boy:
1. **Send OTP**: `POST /delivery-boy/auth/send-otp`
2. **Verify OTP & Register**: `POST /delivery-boy/auth/verify-otp` (with name, email, vehicle info)
3. **Wait for Admin Approval**: `isActive` will be `false`
4. **Once Approved**: `isActive` becomes `true`
5. **Start Accepting Deliveries**: Update availability to `true`

### For Existing Delivery Boy:
1. **Send OTP**: `POST /delivery-boy/auth/send-otp`
2. **Verify OTP & Login**: `POST /delivery-boy/auth/verify-otp`
3. **Use Access Token**: Include in Authorization header for all profile APIs

---

## Notes

1. **Phone Number Format**: Must be in E.164 format (e.g., `+911234567890`)
2. **OTP Validity**: OTP expires in 10 minutes
3. **OTP Attempts**: Maximum 5 attempts per OTP
4. **Rate Limiting**: Maximum 5 OTP requests per hour per phone number
5. **Admin Approval**: New delivery boys require admin approval (`isActive: true`) before they can start accepting deliveries
6. **Token Expiry**: Access token expires in 1 hour (3600 seconds)
7. **Security**: Sensitive fields (aadhar, PAN, bank account) are excluded from API responses
8. **Location**: Uses GeoJSON Point format with [longitude, latitude] coordinates
