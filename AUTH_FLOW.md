# JustPlay Admin Dashboard - Authentication Flow

## Overview

The authentication system supports multiple flows:
1. **Login Flow** - Direct login with name and phone
2. **Forgot Password Flow** - Reset password via email OTP
3. **Password Reset** - Change password with OTP verification

## Authentication Endpoints

All endpoints are relative to `{{baseUrl}}/auth`

### 1. Login
**POST** `/auth/login`

Request:
```json
{
  "name": "admin name",
  "phone": "01234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "_id": "user_id",
      "name": "admin name",
      "phone": "01234567890",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

### 2. Verify Email (OTP)
**POST** `/auth/verify`

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 3. Forgot Password
**POST** `/auth/forget`

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

### 4. Reset Password
**POST** `/auth/reset-password`

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecure@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 5. Change Password (Protected)
**POST** `/auth/change-password`

Headers:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Request:
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@456"
}
```

Response:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Refresh Token
**POST** `/auth/refresh-token`

Request:
```json
{
  "refreshToken": "refresh_token_here"
}
```

Response:
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 7. Logout (Protected)
**POST** `/auth/logout`

Headers:
```
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## User Flow Diagrams

### Login Flow
```
┌─────────────┐
│   Login     │
│  Page       │
└──────┬──────┘
       │
       ├─ POST /auth/login
       │
       ├─ Success ──┐
       │            │
       │            └─→ Store tokens in session
       │                 Redirect to /dashboard
       │
       └─ Error ────────→ Show error toast
```

### Forgot Password Flow
```
┌──────────────────┐
│ Forgot Password  │
│  Page            │
└────────┬─────────┘
         │
         ├─ POST /auth/forget
         │ (email)
         │
         ├─ Success ──┐
         │            │
         │            └─→ Redirect to OTP page
         │
         └─ Error ────────→ Show error toast

┌──────────────────┐
│   OTP Page       │
│ (verify-otp)     │
└────────┬─────────┘
         │
         ├─ POST /auth/verify (optional)
         │ OR redirect to reset page
         │
         ├─ Success ──┐
         │            │
         │            └─→ Redirect to Reset Password
         │
         └─ Error ────────→ Show error toast

┌──────────────────┐
│ Reset Password   │
│    Page          │
└────────┬─────────┘
         │
         ├─ POST /auth/reset-password
         │ (email, otp, newPassword)
         │
         ├─ Success ──┐
         │            │
         │            └─→ Redirect to Login
         │
         └─ Error ────────→ Show error toast
```

## Pages and Routes

### Public Routes (No Auth Required)
- `/auth/login` - Login page
- `/auth/forgot-password` - Forgot password page
- `/auth/verify-otp` - OTP verification page
- `/auth/reset-password` - Password reset page

### Protected Routes (Auth Required)
- `/dashboard` - Main dashboard
- `/bookings` - Booking management
- `/users` - User management
- `/pitch-owners` - Pitch owner management
- `/pitches` - Pitch management
- `/reports` - Reports and analytics
- `/settings` - System settings
- `/emergency` - Emergency controls

## Token Management

### Access Token
- JWT token for API requests
- Sent in `Authorization: Bearer {token}` header
- Expires after configured duration
- Automatically refreshed via interceptor on 401

### Refresh Token
- Long-lived token for obtaining new access tokens
- Stored securely in session
- Used automatically when access token expires
- Cannot be used for API requests directly

## Session Storage

Tokens are stored in NextAuth session:
```typescript
{
  user: {
    _id: "user_id",
    name: "admin name",
    phone: "01234567890",
    email: "admin@example.com",
    role: "ADMIN"
  },
  accessToken: "jwt_token",
  refreshToken: "refresh_token"
}
```

## Error Handling

### Common Error Responses

**Invalid Credentials**
```json
{
  "success": false,
  "message": "Invalid name or phone"
}
```

**Invalid OTP**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Token Expired**
```json
{
  "success": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

**Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

## Security Features

1. **CORS Protection** - Configured for your domain
2. **CSRF Protection** - NextAuth handles CSRF tokens
3. **XSS Protection** - Next.js built-in protections
4. **Secure Headers** - Content-Type, X-Frame-Options, etc.
5. **HTTP-Only Cookies** - Session stored securely (optional)
6. **Token Expiration** - Automatic refresh before expiration
7. **Rate Limiting** - Implement on backend for login attempts
8. **Password Validation** - Enforces strong passwords

## Implementation Details

### Axios Interceptor
The axios client automatically:
1. Adds Bearer token to all requests
2. Handles 401 errors by refreshing the token
3. Retries failed requests with new token
4. Logs out user if refresh fails

### NextAuth Callback
- `jwt` callback: Stores tokens in JWT
- `session` callback: Makes tokens available in session
- `redirect` callback: Handles post-login redirects

### Protected Routes
Middleware (`middleware.ts`) checks:
1. Valid session exists
2. Token not expired
3. Redirects to login if invalid

## Testing

### Test Credentials
```
Name: Admin
Phone: 0123456789
```

### Test OTP
- Any 6-digit code can be used in development
- Backend should return valid OTP in email in production

### Postman Collection
See `JustPlay API.postman_collection.json` for detailed API examples
