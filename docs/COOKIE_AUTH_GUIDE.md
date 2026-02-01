# Cookie-Based Authentication for Web Platform

This guide explains how to use cookie-based authentication for web clients while maintaining token-based auth for mobile apps.

## Overview

The authentication system now supports **two modes**:

1. **Mobile Platform** (default): Tokens returned in response body
2. **Web Platform**: Tokens set as HTTP-only cookies + optionally in response body

## API Endpoints

### 1. Verify OTP (Login/Register)

**Endpoint**: `POST /customer/auth/verify-otp`

#### Mobile Request (default):
```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "platform": "mobile"
}
```

**Response**: Tokens in body
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

#### Web Request:
```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "platform": "web"
}
```

**Response**: Same as mobile, BUT tokens are ALSO set as HTTP-only cookies:
- Cookie: `access_token` (expires in 1 hour)
- Cookie: `refresh_token` (expires in 7 days)

### 2. Refresh Token

**Endpoint**: `POST /customer/auth/refresh-token`

#### Mobile Request:
```json
{
  "refreshToken": "eyJhbGc...",
  "platform": "mobile"
}
```

#### Web Request (with cookies):
```json
{
  "platform": "web"
}
```
The refresh token is automatically read from the `refresh_token` cookie. You can still provide it in the body as fallback.

### 3. Logout (Web Only)

**Endpoint**: `POST /customer/auth/logout`

Clears the `access_token` and `refresh_token` cookies.

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Frontend Integration

### Web (React/Next.js Example)

```typescript
// Login with OTP
async function loginWithOTP(phone: string, otp: string) {
  const response = await fetch('http://localhost:5001/v1/customer/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: Send cookies
    body: JSON.stringify({
      phone,
      otp,
      platform: 'web', // Set platform to 'web'
    }),
  });
  
  const data = await response.json();
  
  // Cookies are automatically set by browser
  // You can optionally store tokens in localStorage as fallback
  if (data.success) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
    // Optional: localStorage.setItem('accessToken', data.data.tokens.accessToken);
  }
  
  return data;
}

// Refresh token (automatic from cookies)
async function refreshToken() {
  const response = await fetch('http://localhost:5001/v1/customer/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: Send cookies
    body: JSON.stringify({
      platform: 'web',
    }),
  });
  
  return response.json();
}

// Logout
async function logout() {
  const response = await fetch('http://localhost:5001/v1/customer/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  
  localStorage.removeItem('user');
  return response.json();
}

// Making authenticated requests
async function fetchUserProfile() {
  const response = await fetch('http://localhost:5001/v1/customer/profile', {
    method: 'GET',
    credentials: 'include', // Cookies sent automatically
    headers: {
      'Content-Type': 'application/json',
      // If you also store in localStorage as fallback:
      // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
  });
  
  return response.json();
}
```

### Mobile (React Native Example)

```typescript
// Mobile continues to use token-based auth
async function loginWithOTP(phone: string, otp: string) {
  const response = await fetch('http://localhost:5001/v1/customer/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      otp,
      platform: 'mobile', // or omit (defaults to mobile)
    }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store tokens in secure storage
    await AsyncStorage.setItem('accessToken', data.data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
}

// Making authenticated requests (mobile)
async function fetchUserProfile() {
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5001/v1/customer/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  return response.json();
}
```

## Cookie Configuration

### Development (localhost)
- **Secure**: `false` (allows HTTP)
- **SameSite**: `lax`
- **Domain**: Not set (works with localhost)
- **HttpOnly**: `true` (prevents XSS)

### Production
- **Secure**: `true` (HTTPS only)
- **SameSite**: `strict` (CSRF protection)
- **Domain**: Can be configured in `cookie.helper.ts`
- **HttpOnly**: `true` (prevents XSS)

## Security Benefits (Web Platform)

1. **HTTP-only cookies**: JavaScript cannot access tokens (XSS protection)
2. **SameSite attribute**: Prevents CSRF attacks
3. **Secure flag** (production): Cookies only sent over HTTPS
4. **Automatic inclusion**: Browser sends cookies with every request to same domain

## Dual Storage Strategy (Optional)

For maximum compatibility, you can use both:

1. **Primary**: HTTP-only cookies (more secure, automatic)
2. **Fallback**: localStorage (for custom auth header if cookies fail)

The backend returns tokens in both response body AND sets cookies for web platform, allowing you to choose your strategy.

## CORS Configuration

For cookies to work in development with separate frontend/backend:

```typescript
// Frontend
fetch(url, {
  credentials: 'include', // REQUIRED
  // ...
})

// Backend (already configured in app.ts)
cors({
  credentials: true, // REQUIRED
  origin: 'http://localhost:3000', // Your frontend URL
})
```

## Testing with cURL

```bash
# Login (web platform)
curl -X POST http://localhost:5001/v1/customer/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","otp":"123456","platform":"web"}' \
  -c cookies.txt

# Refresh token using cookies
curl -X POST http://localhost:5001/v1/customer/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"platform":"web"}' \
  -b cookies.txt \
  -c cookies.txt

# Logout
curl -X POST http://localhost:5001/v1/customer/auth/logout \
  -b cookies.txt
```

## Notes

- Cookie names: `access_token`, `refresh_token`
- Max age configurable in `CookieHelper`
- Platform parameter is optional (defaults to `mobile`)
- Both platforms can coexist - same endpoints work for both
