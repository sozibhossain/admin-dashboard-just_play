# JustPlay Admin Dashboard - Setup Guide

## Quick Start

### 1. Environment Setup

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and you'll be redirected to `/auth/login`

### 4. Login

Use the demo credentials (or any name/phone combination):
- **Name**: admin
- **Phone**: 0750000000

## Architecture Overview

### Authentication Flow

```
User Login (name, phone)
    ↓
NextAuth Credentials Provider
    ↓
Backend /auth/login API
    ↓
Returns: { accessToken, refreshToken, role, _id }
    ↓
Stored in JWT session
    ↓
Protected Routes (middleware.ts)
```

### API Request Flow

```
React Component
    ↓
Custom Hook (use-api.ts)
    ↓
TanStack Query
    ↓
Axios Client
    ↓
Request Interceptor (adds Bearer token)
    ↓
Backend API
    ↓
Response Interceptor (handles 401, refresh token)
    ↓
Component State Updated
    ↓
UI Re-renders
```

## File Organization

### Authentication Files

- `/lib/auth.ts` - NextAuth configuration
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `/middleware.ts` - Route protection
- `/types/next-auth.d.ts` - TypeScript definitions

### API Integration

- `/lib/axios.ts` - Axios instance with interceptors
- `/lib/api.ts` - All API functions organized by resource
- `/hooks/use-api.ts` - React Query hooks

### UI Components

- `/components/layout/admin-layout.tsx` - Main sidebar layout
- `/components/dashboard/` - Dashboard-specific components
- `/components/skeletons/` - Loading state components
- `/components/providers.tsx` - App-level providers

### Pages

- `/app/dashboard/` - Main dashboard
- `/app/bookings/` - Booking management
- `/app/users/` - User management
- `/app/pitch-owners/` - Pitch owner management
- `/app/pitches/` - Pitch management
- `/app/reports/` - Reports and analytics
- `/app/settings/` - System settings
- `/app/emergency/` - Emergency controls

## Key Configuration

### NextAuth Configuration (`/lib/auth.ts`)

- **Provider**: Credentials (custom login)
- **Callbacks**: `jwt` and `session` for token management
- **Pages**: Sign in at `/auth/login`
- **Session**: JWT strategy with 30-day max age

### Axios Configuration (`/lib/axios.ts`)

- **Base URL**: From `NEXT_PUBLIC_BASE_URL`
- **Request Interceptor**: Adds Bearer token from session
- **Response Interceptor**: Handles 401 with token refresh
- **Retry Logic**: Automatic retry on failure

### React Query Configuration (`/components/providers.tsx`)

- **Stale Time**: 5 minutes (data is fresh)
- **Cache Time**: 10 minutes (keep in memory)
- **Retry**: 1 attempt on failure
- **Focus Refetch**: Disabled (don't refetch on window focus)

## API Endpoints Expected

The backend should provide these endpoints (assuming base URL like `/api/`):

```
Auth:
  POST /auth/login - Login with phone & name
  POST /auth/refresh-token - Refresh access token
  POST /auth/logout - Logout

Admin:
  GET /admin/dashboard/stats - Get dashboard stats
  GET /admin/dashboard/booking-trend - Get booking trend
  GET /admin/dashboard/top-pitches - Get top pitches
  GET /admin/bookings - Get all bookings (paginated)
  PATCH /admin/bookings/:id/status - Update booking status
  GET /admin/users - Get all users (paginated)
  POST /admin/users/:id/ban - Ban user
  GET /admin/pitches - Get all pitches (paginated)
  PATCH /admin/pitches/:id/status - Update pitch status
  GET /admin/settings - Get settings
  PATCH /admin/settings - Update settings
  POST /admin/emergency/lock-system - Lock system
  POST /admin/emergency/notification - Send notification
```

All endpoints require Bearer token authorization.

## Development Tips

### React Query DevTools

Add React Query DevTools for debugging:

```bash
npm install @tanstack/react-query-devtools
```

Update `/components/providers.tsx`:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

### Console Debugging

Custom hooks include console.error for debugging. Watch browser console for errors.

### Postman/API Testing

Use the provided Postman collection to test API endpoints directly before integrating with the dashboard.

## Common Issues & Solutions

### Issue: 401 Unauthorized on requests

**Solution**: 
1. Verify `NEXTAUTH_SECRET` is set
2. Check backend is returning correct token format
3. Ensure credentials are correct
4. Clear browser cookies and re-login

### Issue: CORS errors

**Solution**:
1. Verify backend CORS configuration
2. Check `NEXT_PUBLIC_BASE_URL` is correct
3. Ensure backend is running on correct port

### Issue: Data not loading

**Solution**:
1. Check network tab in DevTools
2. Verify API response format matches expected structure
3. Check React Query DevTools for cache status
4. Try manual refetch by clicking page button

### Issue: Token refresh loop

**Solution**:
1. Check refresh token endpoint response
2. Verify new token is being returned
3. Check session is being updated
4. Log out and log back in

## Production Deployment

### Environment Variables

Update for production:

```bash
NEXT_PUBLIC_BASE_URL=https://api.justplay.iq/api
NEXTAUTH_URL=https://admin.justplay.iq
NEXTAUTH_SECRET=generate-long-random-string-here
```

### Build for Production

```bash
npm run build
npm start
```

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Docker Deployment

```bash
docker build -t justplay-admin:latest .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://api.justplay.iq/api \
  -e NEXTAUTH_URL=https://admin.justplay.iq \
  -e NEXTAUTH_SECRET=your-secret \
  justplay-admin:latest
```

## Testing

### Unit Tests

Add Jest configuration for component testing:

```bash
npm install --save-dev jest @testing-library/react
```

### E2E Tests

Add Playwright for end-to-end testing:

```bash
npm install --save-dev @playwright/test
```

## Monitoring

### Sentry Integration (Optional)

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js` for error tracking.

## Support

- Check README.md for detailed documentation
- Review API documentation from Postman collection
- Contact backend team for API issues
- Create GitHub issues for bugs/features
