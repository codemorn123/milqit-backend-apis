# Delivery Boy System - Quick Start Guide

## 🚀 What's New

Complete delivery boy management system with:
- ✅ Separate DeliveryBoy model (better architecture)
- ✅ OTP-based mobile authentication
- ✅ Comprehensive admin controls
- ✅ Location tracking
- ✅ Performance metrics
- ✅ Document verification workflow
- ✅ Bulk operations support

## 📁 Files Created

### Core Implementation (9 files):
```
src/
├── models/
│   └── DeliveryBoyModel.ts                    # Database schema
├── types/
│   ├── deliveryBoy.types.ts                   # Delivery boy types
│   └── admin.deliveryBoy.types.ts             # Admin operation types
├── validations/
│   ├── deliveryBoy.validation.ts              # Delivery boy validations
│   └── admin.deliveryBoy.validation.ts        # Admin validations
├── services/
│   └── deliveryBoy.service.ts                 # Business logic (extended)
└── controllers/
    ├── deliveryBoy/
    │   └── deliveryBoy.auth.controller.ts     # Delivery boy endpoints
    └── admin/
        └── admin.deliveryBoy.controller.ts    # Admin endpoints
```

### Documentation (3 files):
```
├── DELIVERY_BOY_API.md                        # Delivery boy API docs
├── ADMIN_DELIVERY_BOY_API.md                  # Admin API docs
└── DELIVERY_BOY_IMPLEMENTATION.md             # Complete summary
```

### Testing (2 files):
```
├── test-delivery-boy-api.sh                   # Delivery boy API tests
└── test-admin-delivery-boy-api.sh             # Admin API tests
```

## 🎯 API Endpoints

### Delivery Boy APIs (8 endpoints)
```
POST   /v1/delivery-boy/auth/send-otp          # Send OTP
POST   /v1/delivery-boy/auth/verify-otp        # Verify OTP & Login
POST   /v1/delivery-boy/auth/resend-otp        # Resend OTP
POST   /v1/delivery-boy/auth/refresh-token     # Refresh tokens
GET    /v1/delivery-boy/auth/profile           # Get profile
PUT    /v1/delivery-boy/auth/profile           # Update profile
PUT    /v1/delivery-boy/auth/location          # Update location
PUT    /v1/delivery-boy/auth/availability      # Toggle availability
```

### Admin APIs (12 endpoints)
```
POST   /v1/admin/delivery-boys                 # Create delivery boy
GET    /v1/admin/delivery-boys                 # List (with filters)
GET    /v1/admin/delivery-boys/stats           # Get statistics
GET    /v1/admin/delivery-boys/{id}            # Get details
PUT    /v1/admin/delivery-boys/{id}            # Update
DELETE /v1/admin/delivery-boys/{id}            # Delete
PUT    /v1/admin/delivery-boys/{id}/status     # Activate/Deactivate
PUT    /v1/admin/delivery-boys/{id}/verify-documents  # Verify docs
PUT    /v1/admin/delivery-boys/{id}/assign-zones      # Assign zones
GET    /v1/admin/delivery-boys/{id}/performance       # Get performance
GET    /v1/admin/delivery-boys/available/list         # Get available
POST   /v1/admin/delivery-boys/bulk-operation         # Bulk ops
```

## 🏃 Quick Start

### 1. Build the Project
```bash
npm run build
```

### 2. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

### 3. Test Delivery Boy APIs
```bash
# Make script executable (already done)
./test-delivery-boy-api.sh
```

### 4. Test Admin APIs
```bash
# First, get an admin token by logging in as admin
# Then replace YOUR_ADMIN_TOKEN in the script

./test-admin-delivery-boy-api.sh
```

## 💡 Usage Examples

### Example 1: Delivery Boy Registration
```bash
# Step 1: Send OTP
curl -X POST http://localhost:5001/v1/delivery-boy/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+911234567890"}'

# Step 2: Verify OTP and Register
curl -X POST http://localhost:5001/v1/delivery-boy/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "otp": "123456",
    "name": "John Doe",
    "vehicleType": "bike",
    "vehicleNumber": "KA01AB1234"
  }'
```

### Example 2: Admin Creates Delivery Boy
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

### Example 3: Get Available Delivery Boys
```bash
curl -X GET "http://localhost:5001/v1/admin/delivery-boys/available/list?zone=Bangalore%20North" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Example 4: Admin Verifies Documents
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

## 📊 Statistics Example

```bash
curl -X GET http://localhost:5001/v1/admin/delivery-boys/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Response:
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalDeliveryBoys": 100,
    "activeDeliveryBoys": 85,
    "availableDeliveryBoys": 45,
    "documentsVerified": 80,
    "averageRating": 4.5,
    "totalDeliveries": 5000,
    "byVehicleType": {
      "bike": 60,
      "scooter": 30,
      "bicycle": 5,
      "car": 5
    }
  }
}
```

## 🔐 Authentication Flow

### Delivery Boy:
1. Send OTP → `POST /delivery-boy/auth/send-otp`
2. Verify OTP → `POST /delivery-boy/auth/verify-otp`
3. Use access token for authenticated endpoints

### Admin:
1. Login as admin → `POST /admin/auth/login`
2. Use admin token for all admin endpoints

## 📖 Documentation

- **Delivery Boy APIs**: See `DELIVERY_BOY_API.md`
- **Admin APIs**: See `ADMIN_DELIVERY_BOY_API.md`
- **Implementation Details**: See `DELIVERY_BOY_IMPLEMENTATION.md`

## 🛠️ Key Features

### Security:
- OTP rate limiting (5 per hour)
- OTP attempts limiting (5 max)
- Password hashing with bcrypt
- JWT authentication
- Role-based access control

### Operations:
- Real-time location tracking
- Availability management
- Performance metrics
- Document verification
- Zone-based assignment
- Bulk operations

### Admin Controls:
- Create/Update/Delete
- Activate/Deactivate
- Document verification
- Zone assignment
- Performance monitoring
- Statistics dashboard

## 📝 Data Model

### Key Fields:
- **Basic**: name, phone, email
- **Vehicle**: vehicleType, vehicleNumber, drivingLicenseNumber
- **KYC**: aadharNumber, panNumber
- **Verification**: isDocumentVerified, isBackgroundCheckDone
- **Operation**: isAvailable, currentLocation, deliveryZone
- **Metrics**: totalDeliveries, completedDeliveries, averageRating
- **Banking**: bankAccountNumber, ifscCode, upiId

## 🔄 Common Workflows

### Onboarding:
```
1. Admin creates account
2. Delivery boy completes profile
3. Upload documents
4. Admin verifies documents
5. Admin assigns zones
6. Admin activates account
7. Delivery boy starts accepting orders
```

### Daily Operations:
```
1. Delivery boy logs in
2. Sets availability to "available"
3. Updates location periodically
4. Receives order assignments
5. Completes deliveries
6. Sets "unavailable" at end of shift
```

## 🧪 Testing

Both test scripts are provided and made executable:

```bash
# Test delivery boy APIs
./test-delivery-boy-api.sh

# Test admin APIs (requires admin token)
./test-admin-delivery-boy-api.sh
```

## ⚙️ Environment Variables

Ensure these are in your `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/milqit
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMS_PROVIDER=your_sms_provider
SMS_API_KEY=your_sms_api_key
```

## 📦 Dependencies

All dependencies are already in `package.json`:
- bcrypt (password hashing)
- tsoa (API documentation)
- joi (validation)
- mongoose (database)
- jsonwebtoken (authentication)

## 🎉 You're All Set!

The delivery boy system is now:
- ✅ Built and compiled
- ✅ Routes generated
- ✅ Ready to use
- ✅ Fully documented
- ✅ Test scripts provided

Start the server and begin testing!

```bash
npm run dev
```

Then open: `http://localhost:5001/docs` to see Swagger documentation.

---

**Need Help?**
- Check `DELIVERY_BOY_API.md` for delivery boy endpoints
- Check `ADMIN_DELIVERY_BOY_API.md` for admin endpoints
- Check `DELIVERY_BOY_IMPLEMENTATION.md` for technical details

Happy Coding! 🚀
