# User Activation/Deactivation API

## New Admin Endpoints for User Management

### 1. Activate User
**Endpoint**: `POST /v1/admin/users/{userId}/activate`

**Description**: Activates an inactive user account, allowing them to access the system again.

**Authentication**: Required (Admin JWT)

**Request**:
```bash
POST /v1/admin/users/68da5058baadce099ce82843/activate
Authorization: Bearer <admin-jwt-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User activated successfully",
  "result": {
    "id": "68da5058baadce099ce82843",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "isActive": true,
    "roles": ["customer"],
    "createdAt": "2025-12-11T10:00:00Z",
    "updatedAt": "2025-12-11T16:00:00Z"
  }
}
```

**Use Cases**:
- Reactivate a temporarily suspended account
- Restore access after resolving account issues
- Reverse an accidental deactivation

---

### 2. Deactivate User
**Endpoint**: `POST /v1/admin/users/{userId}/deactivate`

**Description**: Deactivates an active user account, preventing them from accessing the system while preserving their data.

**Authentication**: Required (Admin JWT)

**Request**:
```bash
POST /v1/admin/users/68da5058baadce099ce82843/deactivate
Authorization: Bearer <admin-jwt-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "result": {
    "id": "68da5058baadce099ce82843",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "isActive": false,
    "roles": ["customer"],
    "createdAt": "2025-12-11T10:00:00Z",
    "updatedAt": "2025-12-11T16:05:00Z"
  }
}
```

**Use Cases**:
- Suspend a user account temporarily
- Prevent access for policy violations
- Temporary account freeze for security reasons

---

## Error Responses

### User Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Invalid User ID (400)
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "userId",
      "message": "\"userId\" must be a valid MongoDB ObjectID"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Behavior Notes

### Idempotency
Both endpoints are **idempotent**:
- ✅ Activating an already active user returns success with no changes
- ✅ Deactivating an already inactive user returns success with no changes

### Data Preservation
- ❌ **NO data is deleted** when deactivating a user
- ✅ All user data, orders, and history remain intact
- ✅ User can be reactivated at any time to restore full access

### Authentication Impact
When a user is deactivated:
- ❌ They **cannot log in** to the system
- ❌ Existing sessions/tokens become **invalid**
- ✅ Admin can still view their profile and data
- ✅ Error message: "Account deactivated. Please contact support."

### Difference from Delete
- **Deactivate** (`/deactivate`): Soft delete, sets `isActive: false`, reversible
- **Delete** (`DELETE /{userId}`): Also soft delete (same as deactivate)
- **Hard Delete** (`DELETE /{userId}/force`): Permanent deletion, irreversible

---

## Complete Admin User Management Endpoints

1. `GET /v1/admin/users` - List all users (paginated)
2. `GET /v1/admin/users/{userId}` - Get user by ID
3. `POST /v1/admin/users/{userId}/activate` - **Activate user** ✨ NEW
4. `POST /v1/admin/users/{userId}/deactivate` - **Deactivate user** ✨ NEW
5. `DELETE /v1/admin/users/{userId}` - Soft delete user (same as deactivate)
6. `DELETE /v1/admin/users/{userId}/force` - Hard delete user (permanent)

---

## Testing Examples

### Activate a User
```bash
curl -X POST \
  'https://api.milqit.com/v1/admin/users/68da5058baadce099ce82843/activate' \
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'
```

### Deactivate a User
```bash
curl -X POST \
  'https://api.milqit.com/v1/admin/users/68da5058baadce099ce82843/deactivate' \
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'
```

### Check User Status
```bash
curl -X GET \
  'https://api.milqit.com/v1/admin/users/68da5058baadce099ce82843' \
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'
```

---

**Created**: December 11, 2025  
**Status**: ✅ Live and Ready  
**Version**: 1.0.0
