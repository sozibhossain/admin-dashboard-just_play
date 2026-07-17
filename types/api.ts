// User Types
export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  city?: { _id: string; name: string };
  status: "active" | "inactive" | "banned";
  totalBookings?: number;
  noShows?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Pitch Owner Types
export interface PitchOwner {
  _id: string;
  name: string;
  businessName: string;
  phone: string;
  city?: { _id: string; name: string };
  status: "verified" | "pending" | "rejected" | "suspended";
  totalBookings?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// City Types
export interface City {
  _id: string;
  name: string;
  image?: string;
}

// Sport Types
export interface Sport {
  _id: string;
  name: string;
  image?: string;
}

// Pitch Types
export interface Pitch {
  _id: string;
  name: string;
  owner?: PitchOwner;
  city?: City;
  sport?: Sport;
  location: string;
  price: number;
  currency: string;
  pitchType: "indoor" | "outdoor";
  status: "active" | "maintenance" | "inactive" | "blocked";
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Booking Types
export interface Booking {
  _id: string;
  bookingId?: string;
  userId?: User;
  pitchId?: Pitch;
  date: string;
  timeSlot: string;
  price: number;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  createdAt?: string;
  updatedAt?: string;
}

// Dashboard Stats
export interface DashboardStats {
  todayBookings: number;
  totalRevenue: number;
  activeIssues: number;
  noShowRate: number;
  pendingVerifications?: number;
}

// Analytics/Reports
export interface BookingTrend {
  day: string;
  count: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface RevenueReport {
  total: number;
  bookings: number;
  avgBookingValue: number;
  platformFee: number;
  feePercentage: number;
  growth?: number;
  trend?: RevenueTrend[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  name: string;
  phone: string;
}

export interface LoginUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: { url?: string; public_id?: string } | string;
  role: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  role: string;
  _id: string;
  user: LoginUser;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
}>;

// Settings Types
export interface SystemSettings {
  appName: string;
  supportEmail: string;
  supportPhone: string;
  platformFee: number;
  defaultCurrency: string;
  defaultCity?: string;
  isSystemLocked?: boolean;
}

// Notification Types
export interface Notification {
  _id: string;
  message: string;
  sentAt: string;
  usersNotified?: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}
