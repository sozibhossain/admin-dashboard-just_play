# JustPlay Admin Dashboard - Quick Start

## Pre-Launch Checklist

- [ ] Backend API running and accessible
- [ ] API endpoints configured correctly
- [ ] Database connected and populated with test data
- [ ] JWT secret key generated
- [ ] Environment variables set in `.env.local`

## Step 1: Install & Configure

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your settings
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-secure-random-key
```

## Step 2: Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Step 3: Login

You'll be redirected to `/auth/login`. Enter:
- **Name**: Any valid name
- **Phone**: Any phone number

The dashboard will retrieve these credentials from your backend.

## Step 4: Explore the Dashboard

### Main Pages

1. **Dashboard** (`/dashboard`)
   - Overview stats and key metrics
   - Booking trends and top performers
   - Live booking feed
   - Admin quick actions

2. **Booking Management** (`/bookings`)
   - View all bookings
   - Search and filter by status
   - Confirm, reject, or complete bookings
   - Pagination support

3. **User Management** (`/users`)
   - View all platform users
   - Search by name or phone
   - Ban/unban users
   - View user statistics

4. **Pitch Owners** (`/pitch-owners`)
   - Verify new pitch owners
   - Suspend owners
   - View owner performance
   - Check ratings

5. **Pitch Management** (`/pitches`)
   - Add new pitches
   - Edit pitch details
   - Set maintenance mode
   - Manage status

6. **Reports** (`/reports`)
   - View revenue analytics
   - Export data as CSV
   - Date range filtering

7. **Settings** (`/settings`)
   - Configure system settings
   - Manage business rules
   - Change admin password
   - View system status

8. **Emergency** (`/emergency`)
   - Lock/unlock system
   - Send mass notifications
   - Critical controls

## File Structure Quick Reference

```
Key files to modify for customization:
├── .env.local                          # Your configuration
├── lib/api.ts                          # Add/modify API endpoints here
├── lib/auth.ts                         # Authentication setup
├── components/layout/admin-layout.tsx  # Sidebar and header
├── app/globals.css                     # Theme colors
└── hooks/use-api.ts                    # React Query hooks
```

## Common Tasks

### Connect to Your Backend

Edit `/lib/api.ts` and update endpoints:

```typescript
export const bookingApi = {
  getBookings: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/YOUR_ENDPOINT_HERE", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },
};
```

### Change Color Scheme

Edit `/components/dashboard/stats-card.tsx` variant colors:

```typescript
const variantStyles = {
  blue: "border-blue-500/20 bg-gradient-to-br from-blue-500/10",
  // ... modify colors
};
```

### Add New Page

1. Create `/app/new-page/page.tsx`
2. Import AdminLayout
3. Wrap component with AdminLayout
4. Add navigation link in `/components/layout/admin-layout.tsx`

### Add New API Function

1. Add function to `/lib/api.ts`
2. Create React Query hook in `/hooks/use-api.ts`
3. Use hook in your component

## Troubleshooting

### "Unable to connect to API"
- Check `NEXT_PUBLIC_BASE_URL` is correct
- Verify backend is running
- Check CORS configuration

### "401 Unauthorized"
- Clear browser cookies
- Log out and log back in
- Check `NEXTAUTH_SECRET` is set

### "Data not loading"
- Open DevTools Network tab
- Check API response
- Verify data structure matches types
- Check React Query DevTools

### "Styling issues"
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`
- Check Tailwind CSS is processing

## Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel
```

Set environment variables in Vercel dashboard.

### Docker Deployment

```bash
docker build -t admin-dashboard .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://api.example.com \
  -e NEXTAUTH_URL=https://admin.example.com \
  -e NEXTAUTH_SECRET=your-secret \
  admin-dashboard
```

## Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest
- **NextAuth.js**: https://next-auth.js.org
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

## Need Help?

1. Check `README.md` for detailed documentation
2. Review `SETUP.md` for architecture details
3. Check `/types/api.ts` for data structures
4. Review existing components as examples
5. Contact support: support@justplay.iq

## What's Included

✅ Complete authentication system
✅ API integration with interceptors
✅ All dashboard pages
✅ Table with pagination
✅ Search and filtering
✅ Skeleton loading states
✅ Toast notifications
✅ Dark theme UI
✅ Responsive design
✅ TypeScript support
✅ React Query hooks
✅ Error handling

## Next Steps

1. Update your API endpoints in `/lib/api.ts`
2. Customize colors and branding
3. Add your backend base URL to `.env.local`
4. Test with real data
5. Deploy to production

Happy building! 🚀
