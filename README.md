# JustPlay Admin Dashboard

A comprehensive, pixel-perfect admin dashboard for the JustPlay platform built with Next.js 16, TypeScript, shadcn/ui, TanStack Query, Axios, and NextAuth.

## Features

### ✨ Complete Admin Dashboard

- **Dashboard**: Real-time stats, booking trends, top performing pitches, live booking feed
- **Booking Management**: Full booking CRUD with status management, pagination, and filtering
- **User Management**: Player account management, ban/unban functionality, search
- **Pitch Owners**: Owner verification, suspension, and performance tracking
- **Pitch Management**: Pitch CRUD, status management, maintenance scheduling
- **Reports & Analytics**: Revenue tracking, booking trends, comprehensive data exports
- **Settings**: System configuration, business rules, security options
- **Emergency Controls**: System lockdown, mass notifications, critical platform management

### 🔐 Authentication & Security

- NextAuth.js integration with JWT tokens
- Axios interceptors for automatic token management
- Automatic token refresh
- Protected routes with middleware
- Session-based role management

### 📊 Data Management

- TanStack Query (React Query) for efficient data fetching and caching
- Automatic refetch and cache invalidation
- Optimistic updates
- Error handling and retry logic
- Pagination support on all tables

### 🎨 UI/UX

- Dark theme professional dashboard design
- Responsive layout (mobile-first)
- Skeleton loading states
- Toast notifications with Sonner
- shadcn/ui components
- Tailwind CSS v4

### 📱 Table Features

- Sortable columns
- Pagination
- Search and filtering
- Bulk actions
- Status management
- Action buttons (confirm, reject, ban, etc.)

## Tech Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query v5
- **HTTP Client**: Axios with interceptors
- **Authentication**: NextAuth.js
- **Notifications**: Sonner
- **Charts**: Recharts
- **Icons**: Lucide React

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/        # NextAuth API routes
│   ├── auth/
│   │   └── login/                     # Login page
│   ├── dashboard/                     # Main dashboard
│   ├── bookings/                      # Booking management
│   ├── users/                         # User management
│   ├── pitch-owners/                  # Pitch owner management
│   ├── pitches/                       # Pitch management
│   ├── reports/                       # Reports & analytics
│   ├── settings/                      # System settings
│   ├── emergency/                     # Emergency controls
│   └── layout.tsx                     # Root layout
├── components/
│   ├── layout/
│   │   └── admin-layout.tsx          # Main admin layout with sidebar
│   ├── dashboard/                     # Dashboard components
│   ├── skeletons/                     # Loading skeleton components
│   └── providers.tsx                  # App providers (Query, Auth, Toaster)
├── hooks/
│   └── use-api.ts                    # Custom React Query hooks
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── axios.ts                      # Axios client with interceptors
│   ├── api.ts                        # API functions organized by resource
│   └── utils.ts                      # Utility functions
├── middleware.ts                      # Next.js middleware for route protection
├── types/
│   └── next-auth.d.ts               # NextAuth type definitions
└── public/                            # Static assets
```

## API Integration

### Authentication Flow

1. **Login**: Send credentials to `/auth/login`
2. **Token Storage**: Tokens stored in NextAuth session
3. **Interceptors**: Axios automatically adds Bearer token to requests
4. **Token Refresh**: Automatic refresh on 401 response
5. **Logout**: Clear session and redirect to login

### API Functions

API calls are organized in `/lib/api.ts` by resource:

```typescript
// Dashboard
dashboardApi.getStats()
dashboardApi.getBookingTrend(days)
dashboardApi.getTopPitches(limit)
dashboardApi.getRecentBookings(limit)

// Bookings
bookingApi.getBookings(page, limit, filters)
bookingApi.updateBookingStatus(id, status)
bookingApi.confirmBooking(id)
bookingApi.cancelBooking(id, reason)

// Users
userApi.getUsers(page, limit, filters)
userApi.banUser(id, reason)
userApi.unbanUser(id)

// Pitches
pitchApi.getPitches(page, limit, filters)
pitchApi.updatePitchStatus(id, status)

// ... and more
```

### React Query Hooks

Custom hooks in `/hooks/use-api.ts` provide:

```typescript
// Queries
useDashboardStats()
useBookings(page, limit, filters)
useUsers(page, limit, filters)
usePitches(page, limit, filters)

// Mutations
useUpdateBookingStatus()
useBanUser()
useVerifyOwner()
useLockSystem()
useSendNotification()

// ... and more
```

## Features Breakdown

### Dashboard Page

- **Stats Cards**: Today's bookings, revenue, active issues, no-show rate
- **Weekly Trend Chart**: Bar chart showing booking trend
- **Top Pitches Table**: Top 5 performing pitches
- **Live Booking Feed**: Real-time booking updates (30s refresh)
- **Admin Controls**: Quick access buttons
- **System Health**: Server status, database load, app version

### Booking Management

- **Advanced Filtering**: By status, date, user, pitch
- **Status Management**: Approve, reject, complete, cancel bookings
- **Pagination**: 10 items per page (configurable)
- **Real-time Updates**: Automatic refresh on status changes
- **Action Buttons**: Context-aware actions based on booking status

### User Management

- **Search & Filter**: Find users by name, phone, status
- **User Actions**: Ban/unban users
- **Stats Display**: Bookings, no-shows, city
- **Status Badge**: Active/Inactive/Banned status

### Pitch Management

- **Full CRUD**: Create, read, update, delete pitches
- **Status Management**: Active, maintenance, inactive, blocked
- **Type Badge**: Indoor/outdoor pitch types
- **Owner Information**: Display pitch owner details
- **Pricing**: Show price and currency

### Reports

- **Revenue Analytics**: Trend charts and summaries
- **Date Range Filtering**: Custom date selection
- **Export Functionality**: Download reports as CSV
- **Key Metrics**: Total revenue, bookings, platform fee

### Settings

- **General Configuration**: App name, support contact
- **Business Rules**: Platform fee, currency, default city
- **Security**: Password change, API key management
- **System Status**: Server status, version info

### Emergency Controls

- **System Lockdown**: Prevent all new bookings
- **Mass Notifications**: Send alerts to all users
- **Quick Reference**: Emergency procedure guide

## Customization

### Styling

- Edit color scheme in `/components/dashboard/stats-card.tsx`
- Modify layout in `/components/layout/admin-layout.tsx`
- Update theme in `app/globals.css`

### API Endpoints

Update `/lib/api.ts` with your actual API endpoints:

```typescript
export const bookingApi = {
  getBookings: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/bookings", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },
  // ... other methods
};
```

### React Query Configuration

Adjust cache times in `/components/providers.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});
```

## Authentication

### Login

- Navigate to `/auth/login`
- Enter name and phone number
- Credentials are validated against backend
- On success, tokens are stored in NextAuth session

### Middleware Protection

Routes requiring authentication are protected via `/middleware.ts`:

- `/dashboard/*`
- `/bookings/*`
- `/users/*`
- `/pitch-owners/*`
- `/pitches/*`
- `/settings/*`
- `/emergency/*`

Unauthenticated users are redirected to `/auth/login`

### Token Management

Tokens are automatically managed:

1. Stored in secure session
2. Sent with every request via axios interceptor
3. Refreshed on 401 response
4. Cleared on logout

## Error Handling

- **API Errors**: Caught and displayed via Sonner toast
- **Network Issues**: Automatic retry with exponential backoff
- **Token Expiry**: Automatic refresh or logout
- **Validation**: Form validation with error messages

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Use Next.js Image component
- **Caching**: TanStack Query + browser cache
- **Lazy Loading**: Dynamic imports for components
- **Bundle Size**: Tree-shaking unused code

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t justplay-admin .
docker run -p 3000:3000 justplay-admin
```

## Troubleshooting

### Token Issues

If you get 401 errors:
1. Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set
2. Verify backend is returning correct token format
3. Clear browser cookies and re-login

### API Connection Issues

If API calls fail:
1. Verify `NEXT_PUBLIC_BASE_URL` is correct
2. Check CORS configuration on backend
3. Ensure backend is running

### Database/Cache Issues

If data isn't updating:
1. Check TanStack Query DevTools (if installed)
2. Force refetch by clicking relevant button
3. Clear cache in browser DevTools

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Contact: support@justplay.iq

## Changelog

### v1.0.0
- Initial admin dashboard release
- Complete booking management
- User and pitch management
- Reports and analytics
- Emergency controls
- System settings
