# Authentication - Quick Reference Card

## Routes Map

| Route | Type | Purpose | Auth |
|-------|------|---------|------|
| `/auth/login` | Page | Admin login | ❌ |
| `/auth/forgot-password` | Page | Start password reset | ❌ |
| `/auth/verify-otp` | Page | Enter OTP code | ❌ |
| `/auth/reset-password` | Page | Set new password | ❌ |
| `/dashboard` | Page | Main admin dashboard | ✅ |
| `/bookings` | Page | Booking management | ✅ |
| `/users` | Page | User management | ✅ |
| `/pitch-owners` | Page | Pitch owner management | ✅ |
| `/pitches` | Page | Pitch management | ✅ |
| `/reports` | Page | Reports & analytics | ✅ |
| `/settings` | Page | System settings | ✅ |
| `/emergency` | Page | Emergency controls | ✅ |

## API Functions Cheat Sheet

```typescript
import { authApi } from '@/lib/api';

// Login
await authApi.login('Name', '01234567890')
// Response: { accessToken, refreshToken, user }

// Verify Email with OTP
await authApi.verifyEmail('user@example.com', '123456')
// Response: { accessToken, refreshToken }

// Send Password Reset OTP
await authApi.forgetPassword('user@example.com')
// Response: { message: "OTP sent..." }

// Reset Password with OTP
await authApi.resetPassword('user@example.com', '123456', 'NewPass@123')
// Response: { accessToken, refreshToken }

// Change Password (requires auth)
await authApi.changePassword('OldPass@123', 'NewPass@456')
// Response: { message: "Password changed..." }

// Refresh Access Token
await authApi.refreshToken('refresh_token_here')
// Response: { accessToken, refreshToken }

// Logout (requires auth)
await authApi.logout()
// Response: { message: "Logout successful" }
```

## Hook Patterns

```typescript
// Get current session
import { useSession } from 'next-auth/react';
const { data: session, status } = useSession();
// session.user._id, session.user.name, session.accessToken, etc

// Sign out
import { signOut } from 'next-auth/react';
await signOut({ redirect: true, callbackUrl: '/auth/login' });

// Make authenticated API call
import { useQuery } from '@tanstack/react-query';
const { data, isLoading, error } = useQuery({
  queryKey: ['bookings'],
  queryFn: () => apiClient.get('/admin/bookings')
});

// Make authenticated mutation
const { mutate, isPending } = useMutation({
  mutationFn: (data) => apiClient.post('/admin/action', data),
  onSuccess: () => toast.success('Success'),
  onError: (error) => toast.error(error.message)
});
```

## Component Template - Protected Page

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

export default function MyPage() {
  const { data: session } = useSession();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/endpoint');
      return response.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    toast.error('Failed to load data');
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <h1>Welcome {session?.user?.name}</h1>
      {/* Render data */}
    </div>
  );
}
```

## Environment Variables Setup

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-string
```

Generate secret:
```bash
openssl rand -base64 32
```

## Common Tasks

### Check if User is Logged In
```typescript
const { data: session } = useSession();
if (!session) {
  // Not logged in
}
```

### Get User ID
```typescript
const userId = session?.user?._id;
```

### Get Access Token
```typescript
const token = session?.user?.accessToken;
```

### Show Error Toast
```typescript
import { toast } from 'sonner';
toast.error('Something went wrong');
toast.success('Operation successful');
```

### Make API Call with Error Handling
```typescript
try {
  const response = await apiClient.get('/admin/data');
  console.log(response.data);
} catch (error: any) {
  const message = error.response?.data?.message || 'Error occurred';
  toast.error(message);
}
```

### Protect a Route
Routes under `/dashboard`, `/bookings`, etc are protected by middleware.
User will be redirected to login if not authenticated.

### Use Password Strength Indicator
```typescript
const [password, setPassword] = useState('');

const passwordStrength = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
};

const isStrong = Object.values(passwordStrength).every(v => v);
```

## Testing Checklist

- [ ] `npm run dev` - App runs without errors
- [ ] Visit `/auth/login` - Login page renders
- [ ] Enter name and phone - Can submit form
- [ ] Invalid credentials - Shows error toast
- [ ] Valid credentials - Redirects to dashboard
- [ ] Visit protected route - Redirected to login if not auth
- [ ] Check session in DevTools - Session exists after login
- [ ] Click "Forgot Password" - Redirects to forgot page
- [ ] Enter email - OTP should be sent
- [ ] Enter OTP code - Verifies and redirects to reset page
- [ ] Enter new password - Validates strength
- [ ] Passwords match - Can submit
- [ ] Reset successful - Redirected to login
- [ ] Logout - Session cleared and redirected
- [ ] Refresh page - Session persists
- [ ] Check Network tab - Requests have Authorization header

## Debugging Commands

```typescript
// In browser console

// Check session
import { getSession } from 'next-auth/react';
const session = await getSession();
console.log(session);

// Check localStorage/cookies
console.log(document.cookie);
localStorage.getItem('key');

// Test API call
import apiClient from '@/lib/axios';
const response = await apiClient.get('/admin/bookings');
console.log(response.data);

// Check if token is valid
const token = session?.user?.accessToken;
// Decode at jwt.io (for debugging only)
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Session not found | Clear cookies, check NEXTAUTH_SECRET |
| Token not sent | Check axios interceptor in Network tab |
| 401 errors | Verify token in session, check expiry |
| Forgot password not working | Check email parameter in URL |
| OTP resend blocked | Wait for countdown timer |
| Password validation fails | Must be 8+ chars, have uppercase, lowercase, number |

## File Quick Links

| Purpose | File |
|---------|------|
| API functions | `/lib/api.ts` |
| HTTP client | `/lib/axios.ts` |
| NextAuth config | `/lib/auth.ts` |
| Login page | `/app/auth/login/page.tsx` |
| OTP page | `/app/auth/verify-otp/page.tsx` |
| Reset password | `/app/auth/reset-password/page.tsx` |
| Route protection | `/middleware.ts` |
| Complete docs | `/AUTH_FLOW.md` |
| Implementation | `/AUTH_IMPLEMENTATION.md` |
| Visual guide | `/AUTH_VISUAL_GUIDE.md` |

## Important Notes

1. **Tokens are in Session** - Not localStorage
2. **Axios auto-adds token** - Don't add manually
3. **401 auto-refreshes** - Transparent to components
4. **Routes auto-protected** - By middleware
5. **Session persists** - On refresh
6. **Errors show as toasts** - User-friendly messages
7. **Loading states included** - Don't make UI freeze
8. **Types are strict** - Full TypeScript support

## Production Checklist

- [ ] Use HTTPS only
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Set correct NEXTAUTH_URL
- [ ] Configure backend API base URL
- [ ] Set up email service for OTP
- [ ] Enable CSRF protection
- [ ] Set secure cookie flags
- [ ] Implement rate limiting on backend
- [ ] Add audit logging
- [ ] Monitor auth failures
- [ ] Test all auth flows
- [ ] Test token refresh
- [ ] Test logout
- [ ] Test protected routes
- [ ] Test error scenarios

## Performance Tips

1. Use React Query caching to avoid redundant requests
2. Memoize components to prevent unnecessary re-renders
3. Use Suspense for code splitting
4. Prefetch data on page navigation
5. Implement request deduplication
6. Cache API responses appropriately

## Security Tips

1. Never log tokens to console in production
2. Always use HTTPS
3. Keep NEXTAUTH_SECRET secure
4. Validate tokens on both client and server
5. Implement rate limiting
6. Monitor for suspicious activity
7. Log all auth events
8. Implement 2FA for extra security
