# Authentication Visual Guide

## Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOWS                          │
└─────────────────────────────────────────────────────────────────────┘

                             PUBLIC ROUTES
                                   ▼
                        ┌──────────────────┐
                        │   /auth/login    │
                        │  Admin Login     │
                        │ (name + phone)   │
                        └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ❌ INVALID             ✅ VALID
            CREDENTIALS           CREDENTIALS
                    │                         │
                    ▼                         ▼
              Toast Error          Store Tokens in Session
                    │                         │
                    └─────────────┬───────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                    Forgot              SUCCESS
                    Password             LOGIN
                         │                 │
                         ▼                 ▼
                    ┌──────────────────────────────────────┐
                    │  PROTECTED ROUTES - ADMIN DASHBOARD  │
                    │                                      │
                    │ /dashboard - Reports - Bookings    │
                    │ /users - /pitches - /settings       │
                    └──────────────────────────────────────┘
```

## Forgot Password Flow

```
┌──────────────────────────────────────────────────────────────┐
│            FORGOT PASSWORD - COMPLETE FLOW                    │
└──────────────────────────────────────────────────────────────┘

    Step 1: Enter Email
    ───────────────────
    ┌─────────────────────────────────┐
    │ /auth/forgot-password           │
    │                                 │
    │ Email: [____________]           │
    │ [Send OTP]                      │
    └─────────────┬───────────────────┘
                  │
    Calls: POST /auth/forget
                  │
                  ▼
    Step 2: Verify OTP
    ──────────────────
    ┌─────────────────────────────────┐
    │ /auth/verify-otp?email=...&reset=true
    │                                 │
    │ [6][_][_][_][_][_]             │
    │ [Verify OTP]                    │
    │ Resend in 60s                   │
    └─────────────┬───────────────────┘
                  │
    Calls: (optional) POST /auth/verify
                  │
                  ▼
    Step 3: Reset Password
    ──────────────────────
    ┌─────────────────────────────────┐
    │ /auth/reset-password            │
    │ ?email=...&otp=123456           │
    │                                 │
    │ New Password: [__________]      │
    │ Confirm: [__________]           │
    │ [Continue]                      │
    └─────────────┬───────────────────┘
                  │
    Calls: POST /auth/reset-password
                  │
                  ▼
    Step 4: Success
    ───────────────
    ┌─────────────────────────────────┐
    │ Redirect to /auth/login         │
    │ "Password reset successfully"   │
    └─────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│              ROOT LAYOUT (/layout.tsx)                  │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │        Providers (Query Client + Sonner)        │   │
│ │                                                 │   │
│ │ ┌───────────────────────────────────────────┐   │   │
│ │ │     Auth Layout (/auth/layout.tsx)        │   │   │
│ │ │     (Public Routes - No Sidebar)          │   │   │
│ │ │                                           │   │   │
│ │ │  ┌─────────────────────────────────────┐  │   │   │
│ │ │  │    Login (/auth/login/page.tsx)     │  │   │   │
│ │ │  │  - Name + Phone                     │  │   │   │
│ │ │  │  - Forgot Password Link             │  │   │   │
│ │ │  │  - NextAuth signIn()                │  │   │   │
│ │ │  └─────────────────────────────────────┘  │   │   │
│ │ │                                           │   │   │
│ │ │  ┌─────────────────────────────────────┐  │   │   │
│ │ │  │ Forgot Password (/auth/...)         │  │   │   │
│ │ │  │  - Email input                      │  │   │   │
│ │ │  │  - authApi.forgetPassword()         │  │   │   │
│ │ │  └─────────────────────────────────────┘  │   │   │
│ │ │                                           │   │   │
│ │ │  ┌─────────────────────────────────────┐  │   │   │
│ │ │  │ OTP Verification (/auth/verify-otp)│  │   │   │
│ │ │  │  - 6-digit OTP input <OTPInput />  │  │   │   │
│ │ │  │  - Resend countdown                 │  │   │   │
│ │ │  │  - authApi.verifyEmail()            │  │   │   │
│ │ │  └─────────────────────────────────────┘  │   │   │
│ │ │                                           │   │   │
│ │ │  ┌─────────────────────────────────────┐  │   │   │
│ │ │  │ Reset Password (/auth/...)          │  │   │   │
│ │ │  │  - Password input + validation      │  │   │   │
│ │ │  │  - Confirm password                 │  │   │   │
│ │ │  │  - authApi.resetPassword()          │  │   │   │
│ │ │  └─────────────────────────────────────┘  │   │   │
│ │ └───────────────────────────────────────────┘   │   │
│ │                                                 │   │
│ │ ┌───────────────────────────────────────────┐   │   │
│ │ │    Dashboard Layout (/dashboard/...)      │   │   │
│ │ │    (Protected Routes - With Sidebar)      │   │   │
│ │ │    [Middleware checks session]            │   │   │
│ │ │                                           │   │   │
│ │ │  ┌─────────┐  ┌────────────────────────┐  │   │   │
│ │ │  │ Sidebar │  │ Dashboard Page         │  │   │   │
│ │ │  │         │  │ Bookings Page          │  │   │   │
│ │ │  │ • Home  │  │ Users Page             │  │   │   │
│ │ │  │ • Books │  │ Pitches Page           │  │   │   │
│ │ │  │ • Users │  │ Reports Page           │  │   │   │
│ │ │  │ • Admin │  │ Settings Page          │  │   │   │
│ │ │  └─────────┘  │ Emergency Page         │  │   │   │
│ │ │               └────────────────────────┘  │   │   │
│ │ │                                           │   │   │
│ │ │         (Uses TanStack Query Hooks)       │   │   │
│ │ │         (Axios with interceptors)         │   │   │
│ │ └───────────────────────────────────────────┘   │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow - Login Request

```
┌────────────────────────────────────────────────────────────────┐
│                    LOGIN REQUEST FLOW                          │
└────────────────────────────────────────────────────────────────┘

USER INTERACTION
    │
    ▼
┌─────────────────────────────┐
│  Login Page Component       │
│  - Get name & phone inputs  │
│  - Submit form              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  NextAuth signIn()          │
│  - Provider: Credentials    │
│  - Pass name & phone        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Credentials Provider       │
│  - Get name & phone         │
│  - Call authApi.login()     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  authApi.login() function   │
│  - Creates axios request    │
│  - POST /auth/login         │
│  - Sends name & phone       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Axios Request Interceptor  │
│  - Adds Content-Type header │
│  - (No token yet)           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  API Server                 │
│  POST /auth/login           │
│  - Validate credentials     │
│  - Generate tokens          │
│  - Return user + tokens     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Axios Response Interceptor │
│  - Check status (200)       │
│  - Return response          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  JWT Callback (NextAuth)    │
│  - Receive access token     │
│  - Receive refresh token    │
│  - Store in JWT             │
│  - Return token object      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Session Callback (NextAuth)│
│  - Extract from JWT         │
│  - Make available to client │
│  - Store in session         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Client-Side Session        │
│  - Access with useSession() │
│  - Contains user + tokens   │
│  - Used for Auth middleware │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Redirect to /dashboard     │
│  - Middleware checks session│
│  - Route allowed            │
│  - Layout renders with data │
└─────────────────────────────┘
```

## Data Flow - Protected API Request

```
┌────────────────────────────────────────────────────────────────┐
│              PROTECTED API REQUEST FLOW                        │
└────────────────────────────────────────────────────────────────┘

COMPONENT MAKES REQUEST
    │
    ▼
┌─────────────────────────────┐
│  useQuery from TanStack     │
│  - Call API function        │
│  - Fetch bookings, etc      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  API Function (api.ts)      │
│  - Return apiClient.get()   │
│  - apiClient.post()         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Axios Request Interceptor  │
│  - Check getSession()       │
│  - Get accessToken from session
│  - Add Authorization header │
│  - Bearer {accessToken}     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  HTTP Request               │
│  GET /admin/bookings        │
│  Headers:                   │
│  - Content-Type: application/json
│  - Authorization: Bearer... │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────┐
│  API Server                  │
│  - Validate token            │
│  - Check permissions         │
│  - Process request           │
│  - Return 200 + data         │
└──────────────┬───────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Axios Response Interceptor │
│  Status: 200                │
│  - Return response          │
│  OR                         │
│  Status: 401                │
│  - Token expired!           │
│  - Call refresh-token API   │
│  - Get new accessToken      │
│  - Update session           │
│  - Retry original request   │
│  - Return response          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  React Query (TanStack)     │
│  - Cache response           │
│  - Trigger re-render        │
│  - Update component state   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Component Receives Data    │
│  - Renders with data        │
│  - Or shows error toast     │
│  - Or shows loading state   │
└─────────────────────────────┘
```

## OTP Input Component

```
┌────────────────────────────────────────────┐
│          OTP INPUT COMPONENT               │
│       <OTPInput length={6} />              │
└────────────────────────────────────────────┘

Visual:
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 1        │ │ 2        │ │ 3        │ │          │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
  (focus)

Behavior:
- User types digit in field 1 → Auto-focus field 2
- User types digit in field 2 → Auto-focus field 3
- User presses backspace in empty field 2 → Focus field 1
- All 6 digits filled → onComplete callback triggered
- Validation only allows 0-9 numbers

Props:
- length: number (default 6)
- onComplete: (otp: string) => void
- onChange: (otp: string) => void
- disabled: boolean
```

## Session Structure

```
┌─────────────────────────────────────────────┐
│         NEXTAUTH SESSION OBJECT             │
│          (returned by getSession)           │
└─────────────────────────────────────────────┘

Session = {
  user: {
    _id: "60d5ec49c1234567890abcde",      // MongoDB ID
    name: "Admin User",
    phone: "01234567890",
    email: "admin@example.com",
    role: "ADMIN"                          // From backend
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  expires: "2024-01-30T15:30:00Z"        // ISO 8601 date
}
```

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING                           │
└────────────────────────────────────────────────────────────┘

API REQUEST FAILS
    │
    ▼
┌──────────────────────────────┐
│  Check Error Type            │
└────────────┬─────────────────┘
             │
     ┌───────┼───────┬──────────┐
     │       │       │          │
     ▼       ▼       ▼          ▼
   400     401     403         500+
 (Bad)  (Unauth) (Forbid)   (Server)
   │       │       │          │
   │       ▼       │          │
   │   Check:      │          │
   │   - Refresh   │          │
   │     token?    │          │
   │   - Still 401?│          │
   │   - Logout    │          │
   │               │          │
   └───────┬───────┴──────┬───┘
           │              │
           ▼              ▼
       Toast Error    Log Error
       Show message   Show message
       (User message) (Server error)
```

## Password Strength Indicator

```
Password Requirements: SecurePass123

Requirement                    Status
──────────────────────────────────────
✓ At least 8 characters       ✅ PASS
✓ Contains uppercase letter   ✅ PASS
✓ Contains lowercase letter   ✅ PASS
✓ Contains number            ✅ PASS

Visual Progress:
████████████████ 100% - Strong Password
```

## Timing Diagram - Token Refresh

```
Time ────────────────────────────────────────────────────────────────→

Request Made
    │
    ├─ Check Session
    │     ├─ Token expires in 5 min ✓ Use it
    │     └─ Token already expired ✗ Refresh first
    │
    ├─ Add Token to Request
    │     └─ Authorization: Bearer {token}
    │
    ├─ Wait for Response
    │
    ├─ Check Status Code
    │     │
    │     ├─ 200 ✓ Return data
    │     │
    │     ├─ 401 ✗ Token expired!
    │     │     │
    │     │     ├─ POST /auth/refresh-token
    │     │     │     └─ Send refresh token
    │     │     │
    │     │     ├─ Receive new accessToken
    │     │     │
    │     │     ├─ Retry original request
    │     │     │     └─ With new token
    │     │     │
    │     │     └─ Return data ✓
    │     │
    │     └─ 5XX Server Error
    │         └─ Log error, show message
    │
    └─ Render UI with data/error
```

This visual guide shows how all pieces of the authentication system work together in a cohesive flow!
