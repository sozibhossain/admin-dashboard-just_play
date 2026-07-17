# Authentication Implementation Guide

## File Structure

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── forgot-password/
│   │   └── page.tsx           # Forgot password page
│   ├── verify-otp/
│   │   ├── page.tsx           # OTP verification page
│   │   └── loading.tsx        # Suspense boundary
│   ├── reset-password/
│   │   ├── page.tsx           # Reset password page
│   │   └── loading.tsx        # Suspense boundary
│   └── layout.tsx             # Auth layout (public routes)
├── dashboard/
│   └── layout.tsx             # Protected layout
├── page.tsx                   # Redirect to dashboard
└── layout.tsx                 # Root layout with providers

lib/
├── api.ts                     # Auth API functions
├── axios.ts                   # Axios client with interceptors
├── auth.ts                    # NextAuth configuration

types/
├── next-auth.d.ts            # NextAuth type definitions
└── api.ts                    # API type definitions

middleware.ts                  # Route protection

components/
├── ui/
│   └── otp-input.tsx         # Reusable OTP input component
└── providers.tsx             # App providers (Query + Sonner)
```

## Key Files Explained

### 1. `/lib/api.ts` - Auth Functions

```typescript
export const authApi = {
  login: async (name: string, phone: string) => {
    // POST /auth/login
  },

  verifyEmail: async (email: string, otp: string) => {
    // POST /auth/verify
  },

  forgetPassword: async (email: string) => {
    // POST /auth/forget
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    // POST /auth/reset-password
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    // POST /auth/change-password
  },

  refreshToken: async (refreshToken: string) => {
    // POST /auth/refresh-token
  },

  logout: async () => {
    // POST /auth/logout
  },
};
```

### 2. `/lib/axios.ts` - API Client

Features:
- Automatic Bearer token injection
- Automatic token refresh on 401
- Request retry with new token
- Error logging and handling

### 3. `/lib/auth.ts` - NextAuth Setup

```typescript
// Providers
Provider: CredentialsProvider ({
  name: "Credentials",
  credentials: {
    name: { label: "Name", type: "text" },
    phone: { label: "Phone", type: "tel" },
  },
})

// Callbacks
jwt: stores tokens in JWT
session: makes tokens available to client
```

### 4. `/middleware.ts` - Route Protection

Protects all routes except:
- `/auth/login`
- `/auth/forgot-password`
- `/auth/verify-otp`
- `/auth/reset-password`
- `/api/auth/*`

### 5. Auth Pages

#### Login Page (`/auth/login`)
- Takes name and phone
- Calls NextAuth's signIn()
- Stores tokens in session
- Redirects to dashboard

#### Forgot Password Page (`/auth/forgot-password`)
- Takes email address
- Calls `authApi.forgetPassword()`
- Redirects to OTP verification

#### OTP Verification Page (`/auth/verify-otp`)
- 6-digit OTP input
- Resend OTP functionality
- Timer countdown
- Routes to reset password page (if from forgot-password)

#### Reset Password Page (`/auth/reset-password`)
- Password and confirm password
- Password strength validation
- Calls `authApi.resetPassword()`
- Redirects to login

## Usage Examples

### Using Auth API Functions

```typescript
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

// Login
try {
  const result = await authApi.login('Admin', '0123456789');
  // Store tokens in session (NextAuth handles this)
} catch (error) {
  toast.error('Login failed');
}

// Forgot Password
try {
  await authApi.forgetPassword('user@example.com');
  toast.success('OTP sent');
} catch (error) {
  toast.error('Error sending OTP');
}

// Reset Password
try {
  await authApi.resetPassword('user@example.com', '123456', 'NewPass@123');
  toast.success('Password reset successful');
} catch (error) {
  toast.error('Password reset failed');
}
```

### Using Protected Routes

```typescript
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {session?.user?.name}</p>
      <p>Token: {session?.user?.accessToken}</p>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import apiClient from '@/lib/axios';

// API client automatically adds Bearer token
const response = await apiClient.get('/admin/bookings');

// If 401 error, automatically refreshes token and retries
const response = await apiClient.post('/admin/action', data);
```

## Environment Variables

Required in `.env.local`:

```env
# Base URL for API
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key

# Optional: Auth callback URLs
NEXTAUTH_CALLBACK_URL=http://localhost:3000/dashboard
```

## Login Flow Step-by-Step

1. User enters name and phone on `/auth/login`
2. Clicks "Sign In"
3. NextAuth calls credentials provider
4. Provider calls `POST /auth/login` API
5. Backend returns access token, refresh token, and user data
6. NextAuth stores tokens in JWT and session
7. Axios interceptor picks up token for future requests
8. User redirected to `/dashboard`

## Forgot Password Flow Step-by-Step

1. User clicks "Forgot Password?" on login page
2. Redirected to `/auth/forgot-password`
3. Enters email address
4. Clicks "Send OTP"
5. Calls `POST /auth/forget` API
6. Backend sends OTP to email
7. Redirected to `/auth/verify-otp?email={email}&reset=true`
8. User enters 6-digit OTP
9. Redirected to `/auth/reset-password?email={email}&otp={otp}`
10. User enters new password
11. Calls `POST /auth/reset-password` API
12. Success - redirected to login

## Token Refresh Flow

1. API request made with expired token
2. Backend returns 401 Unauthorized
3. Axios interceptor catches 401
4. Calls `POST /auth/refresh-token` with refresh token
5. Backend returns new access token
6. Original request retried with new token
7. Response returned to caller

## Password Validation Rules

```typescript
// Must have:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
```

## Error Handling

### Common Errors

| Status | Message | Action |
|--------|---------|--------|
| 401 | Unauthorized | Logout and redirect to login |
| 403 | Forbidden | Show permission error |
| 400 | Bad Request | Show validation error |
| 500 | Server Error | Show server error |

### Handling Errors in Components

```typescript
try {
  await authApi.login(name, phone);
} catch (error: any) {
  // Error from backend
  const message = error.response?.data?.message;
  
  // Network error
  if (!error.response) {
    toast.error('Network error');
  }
  
  // Auth error
  if (error.response?.status === 401) {
    toast.error('Invalid credentials');
  }
  
  // Server error
  if (error.response?.status === 500) {
    toast.error('Server error');
  }
}
```

## Debugging

### Check Session in Browser Console

```typescript
import { getSession } from 'next-auth/react';

const session = await getSession();
console.log(session);
// {
//   user: { _id, name, phone, email, role },
//   accessToken: '...',
//   refreshToken: '...'
// }
```

### Check Network Requests

1. Open DevTools → Network tab
2. Look for API requests to `/auth/*`
3. Check request headers for `Authorization: Bearer`
4. Check response for status codes

### Enable Debug Logging

Add to `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

## Security Best Practices

1. Always use HTTPS in production
2. Keep `NEXTAUTH_SECRET` secure and unique
3. Validate password strength on both client and server
4. Implement rate limiting on login attempts
5. Use secure cookies (httpOnly: true)
6. Regenerate tokens periodically
7. Implement logout on all devices
8. Monitor suspicious login attempts

## Testing

### Test Login
```
Name: Admin
Phone: 0123456789
```

### Test Forgot Password
1. Go to `/auth/forgot-password`
2. Enter email
3. Check for OTP (in development, shown in console/logs)
4. Enter OTP on verification page
5. Set new password

### Test Token Refresh
1. Set short token expiration on backend
2. Make API request after token expires
3. Should automatically refresh and retry

## Troubleshooting

### Session not persisting
- Check `NEXTAUTH_URL` is correct
- Check `NEXTAUTH_SECRET` is set
- Clear cookies and try again

### Token not being added to requests
- Verify session exists with `getSession()`
- Check axios interceptor is running
- Verify token is stored in session

### 401 errors on protected routes
- Check token is valid and not expired
- Verify middleware is configured
- Check protected route guard is working

### OTP not verifying
- Verify OTP code is correct
- Check email parameter is passed
- Verify OTP endpoint is correct

## Next Steps

1. Configure backend API endpoints
2. Test all auth flows with Postman
3. Set up email service for OTP delivery
4. Configure production environment variables
5. Implement audit logging for auth events
6. Set up monitoring and alerts
