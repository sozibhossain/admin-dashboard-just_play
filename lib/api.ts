import apiClient from "./axios";

const unwrapData = (response: any) => response?.data?.data ?? response?.data ?? null;

// ==================== Authentication APIs ====================

export const authApi = {
  login: async (name: string, phone: string) => {
    const response = await apiClient.post("/auth/login", { name, phone });
    return response.data;
  },

  verifyEmail: async (email: string, otp: string) => {
    const response = await apiClient.post("/auth/verify", { email, otp });
    return response.data;
  },

  forgetPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forget", { email });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout", {});
    return response.data;
  },
};

// ==================== Dashboard APIs ====================

export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get("/admin/dashboard/stats");
    const data = unwrapData(response);
    return {
      ...data,
      totalRevenue: data?.totalRevenue ?? data?.revenue ?? 0,
    };
  },

  getBookingTrend: async (days = 7) => {
    const response = await apiClient.get("/admin/dashboard/booking-trend", {
      params: { days },
    });
    const data = unwrapData(response);
    const trend = (data?.trend ?? data ?? []).map((item: any) => ({
      day: item.day ?? item._id ?? "N/A",
      count: item.count ?? item.bookings ?? item.value ?? 0,
    }));
    return { trend };
  },

  getTopPitches: async (limit = 5) => {
    const response = await apiClient.get("/admin/dashboard/top-pitches", {
      params: { limit },
    });
    const data = unwrapData(response);
    const pitches = (data?.pitches ?? data ?? []).map((pitch: any) => ({
      _id: pitch._id ?? pitch.pitchId,
      name: pitch.name ?? pitch.pitchName,
      bookings: pitch.bookings ?? 0,
      revenue: pitch.revenue ?? 0,
      rating: pitch.rating ?? 0,
    }));
    return { pitches };
  },

  getRecentBookings: async (limit = 5) => {
    const response = await apiClient.get("/admin/dashboard/recent-bookings", {
      params: { limit },
    });
    const data = unwrapData(response);
    const bookings = (data?.bookings ?? data ?? []).map((booking: any) => ({
      ...booking,
      userId: booking.userId ?? booking.user ?? null,
      pitchId: booking.pitchId ?? booking.pitch ?? null,
    }));
    return { bookings };
  },
};

// ==================== Booking APIs ====================

export const bookingApi = {
  getBookings: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/bookings", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const bookings = (data?.bookings ?? data ?? []).map((booking: any) => ({
      ...booking,
      userId: booking.userId ?? booking.user ?? null,
      pitchId: booking.pitchId ?? booking.pitch ?? null,
    }));
    return {
      bookings,
      total: data?.total ?? bookings.length,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/admin/bookings/${id}`);
    const data = unwrapData(response);
    return {
      ...data,
      userId: data?.userId ?? data?.user ?? null,
      pitchId: data?.pitchId ?? data?.pitch ?? null,
    };
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/admin/bookings/${id}/status`, {
      status,
    });
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string) => {
    const response = await apiClient.post(`/admin/bookings/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  confirmBooking: async (id: string) => {
    const response = await apiClient.post(`/admin/bookings/${id}/confirm`, {});
    return response.data;
  },

  deleteBooking: async (id: string) => {
    const response = await apiClient.delete(`/admin/bookings/${id}`);
    return response.data;
  },
};

// ==================== User APIs ====================

export const userApi = {
  getUsers: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/users", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const users = (data?.users ?? data ?? []).map((user: any) => ({
      ...user,
      totalBookings: user.totalBookings ?? user.stats?.bookings ?? 0,
      noShows: user.noShows ?? user.stats?.noshows ?? 0,
      city:
        typeof user.city === "string" ? { name: user.city } : user.city ?? null,
    }));
    return {
      users,
      total: data?.total ?? users.length,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return unwrapData(response);
  },

  banUser: async (id: string, reason?: string) => {
    const response = await apiClient.post(`/admin/users/${id}/ban`, { reason });
    return response.data;
  },

  unbanUser: async (id: string) => {
    const response = await apiClient.post(`/admin/users/${id}/unban`, {});
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await apiClient.get("/admin/users/search", {
      params: { q: query },
    });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },
};

// ==================== Pitch Owner APIs ====================

export const pitchOwnerApi = {
  getOwners: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/pitch-owners", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const owners = (data?.owners ?? data ?? []).map((owner: any) => ({
      ...owner,
      name: owner.name ?? owner.ownerName ?? "N/A",
      totalBookings: owner.totalBookings ?? owner.performance?.bookings ?? 0,
      rating: owner.rating ?? owner.performance?.rating ?? 0,
      city:
        typeof owner.city === "string"
          ? { name: owner.city }
          : owner.city ?? null,
    }));
    return {
      owners,
      total: data?.total ?? owners.length,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getOwnerById: async (id: string) => {
    const response = await apiClient.get(`/admin/pitch-owners/${id}`);
    return response.data;
  },

  verifyOwner: async (id: string) => {
    const response = await apiClient.post(
      `/admin/pitch-owners/${id}/verify`,
      {}
    );
    return response.data;
  },

  rejectOwner: async (id: string, reason?: string) => {
    const response = await apiClient.post(
      `/admin/pitch-owners/${id}/reject`,
      { reason }
    );
    return response.data;
  },

  suspendOwner: async (id: string, reason?: string) => {
    const response = await apiClient.post(
      `/admin/pitch-owners/${id}/suspend`,
      { reason }
    );
    return response.data;
  },

  getOwnerStats: async (id: string) => {
    const response = await apiClient.get(
      `/admin/pitch-owners/${id}/stats`
    );
    return unwrapData(response);
  },
};

// ==================== Pitch APIs ====================

export const pitchApi = {
  getPitches: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/pitches", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const pitches = (data?.pitches ?? data ?? []).map((pitch: any) => ({
      ...pitch,
      owner:
        pitch.owner && typeof pitch.owner === "object"
          ? {
              ...pitch.owner,
              name:
                pitch.owner.name ??
                pitch.owner.ownerName ??
                pitch.owner.businessName ??
                "N/A",
            }
          : pitch.owner ?? null,
    }));
    return {
      pitches,
      total: data?.total ?? pitches.length,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getPitchById: async (id: string) => {
    const response = await apiClient.get(`/admin/pitches/${id}`);
    return unwrapData(response);
  },

  createPitch: async (data: FormData) => {
    const response = await apiClient.post("/admin/pitches", data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updatePitch: async (id: string, data: FormData) => {
    const response = await apiClient.patch(`/admin/pitches/${id}`, data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updatePitchStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/admin/pitches/${id}/status`, {
      status,
    });
    return response.data;
  },

  deletePitch: async (id: string) => {
    const response = await apiClient.delete(`/admin/pitches/${id}`);
    return response.data;
  },

  getPitchAnalytics: async (id: string) => {
    const response = await apiClient.get(`/admin/pitches/${id}/analytics`);
    return response.data;
  },
};

// ==================== Event APIs ====================

export const eventApi = {
  getEvents: async (page = 1, limit = 10, filters?: any) => {
    const response = await apiClient.get("/admin/events", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const events = data?.events ?? data ?? [];
    return {
      events,
      total: data?.total ?? events.length,
      totalPages: data?.totalPages ?? 1,
    };
  },

  getEventById: async (id: string) => {
    const response = await apiClient.get(`/admin/events/${id}`);
    return unwrapData(response);
  },

  createEvent: async (data: FormData) => {
    const response = await apiClient.post("/admin/events", data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updateEvent: async (id: string, data: FormData) => {
    const response = await apiClient.patch(`/admin/events/${id}`, data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await apiClient.delete(`/admin/events/${id}`);
    return response.data;
  },
};

export const countryApi = {
  getCountries: async (q?: string) => {
    const response = await apiClient.get("/admin/cities", {
      params: q ? { q } : undefined,
    });
    const data = unwrapData(response);
    return { countries: Array.isArray(data) ? data : (data?.cities ?? []) };
  },

  getCountryById: async (id: string) => {
    const response = await apiClient.get(`/admin/cities/${id}`);
    return unwrapData(response);
  },

  createCountry: async (data: FormData) => {
    const response = await apiClient.post("/admin/cities", data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updateCountry: async (id: string, data: FormData) => {
    const response = await apiClient.patch(`/admin/cities/${id}`, data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  deleteCountry: async (id: string) => {
    const response = await apiClient.delete(`/admin/cities/${id}`);
    return response.data;
  },
};

export const sportApi = {
  getSports: async (q?: string) => {
    const response = await apiClient.get("/admin/sports", {
      params: q ? { q } : undefined,
    });
    const data = unwrapData(response);
    return { sports: Array.isArray(data) ? data : (data?.sports ?? []) };
  },

  getSportById: async (id: string) => {
    const response = await apiClient.get(`/admin/sports/${id}`);
    return unwrapData(response);
  },

  createSport: async (data: FormData) => {
    const response = await apiClient.post("/admin/sports", data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  updateSport: async (id: string, data: FormData) => {
    const response = await apiClient.patch(`/admin/sports/${id}`, data, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  deleteSport: async (id: string) => {
    const response = await apiClient.delete(`/admin/sports/${id}`);
    return response.data;
  },
};

// ==================== Settings APIs ====================

export const settingsApi = {
  getSettings: async () => {
    const response = await apiClient.get("/admin/settings");
    return unwrapData(response);
  },

  updateGeneral: async (data: {
    appName?: string;
    supportEmail?: string;
    supportPhone?: string;
  }) => {
    const response = await apiClient.patch("/admin/settings/general", data);
    return response.data;
  },

  updateBusiness: async (data: {
    platformFeePercent?: number;
    defaultCurrency?: string;
    defaultCity?: string;
    cancellationWindowHours?: number;
    lateCancellationAllowed?: boolean;
    reservationHoldMinutes?: number;
    bookingReminderMinutes?: number;
  }) => {
    const response = await apiClient.patch("/admin/settings/business", data);
    return response.data;
  },

  updateSystemSettings: async (data: {
    adminSessionTimeoutMinutes?: number;
    requireTwoFactor?: boolean;
  }) => {
    const response = await apiClient.patch("/admin/settings/system", data);
    return response.data;
  },

  changeAdminPassword: async (adminId: string, newPassword: string) => {
    const response = await apiClient.patch(
      "/admin/settings/security/change-password",
      { adminId, newPassword }
    );
    return response.data;
  },
};

// ==================== API Keys ====================

export const apiKeysApi = {
  getKeys: async () => {
    const response = await apiClient.get("/admin/settings/api-keys");
    return unwrapData(response);
  },

  createKey: async (name: string) => {
    const response = await apiClient.post("/admin/settings/api-keys", {
      name,
    });
    return response.data;
  },

  deleteKey: async (id: string) => {
    const response = await apiClient.delete(`/admin/settings/api-keys/${id}`);
    return response.data;
  },
};

// ==================== Audit Log ====================

export const auditApi = {
  getLogs: async (page = 1, limit = 50, filters?: any) => {
    const response = await apiClient.get("/admin/audit-logs", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    const logs = Array.isArray(data) ? data : data?.logs ?? [];
    return { logs };
  },
};

// ==================== Emergency APIs ====================

export const emergencyApi = {
  lockSystem: async (message?: string) => {
    const response = await apiClient.post("/admin/emergency/lock", {
      locked: true,
      message,
    });
    return response.data;
  },

  unlockSystem: async () => {
    const response = await apiClient.post("/admin/emergency/lock", {
      locked: false,
    });
    return response.data;
  },

  getSystemLockStatus: async () => {
    const response = await apiClient.get("/admin/emergency/status");
    return unwrapData(response);
  },

  sendMassNotification: async (
    message: string,
    target: "all" | "players" | "owners" = "all",
    title?: string
  ) => {
    const response = await apiClient.post("/admin/emergency/notify", {
      title,
      message,
      target,
    });
    return response.data;
  },
};

// ==================== Analytics & Reports ====================

export const reportsApi = {
  getRevenueReport: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get("/admin/reports/revenue", {
      params: { startDate, endDate },
    });
    const data = unwrapData(response);
    return {
      total: data?.total ?? data?.revenue ?? 0,
      bookings: data?.bookings ?? 0,
      avgBookingValue: data?.avgBookingValue ?? 0,
      platformFee: data?.platformFee ?? 0,
      feePercentage: data?.feePercentage ?? 5,
      growth: data?.growth ?? 0,
      trend: data?.trend ?? [],
    };
  },

  getBookingReport: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get("/admin/reports/bookings", {
      params: { startDate, endDate },
    });
    const data = unwrapData(response);
    const trend = (Array.isArray(data) ? data : []).map((item: any) => ({
      day: item._id ?? item.day ?? "N/A",
      count: item.count ?? 0,
    }));
    return { trend };
  },

  getUserReport: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get("/admin/reports/users", {
      params: { startDate, endDate },
    });
    const data = unwrapData(response);
    const trend = (Array.isArray(data) ? data : []).map((item: any) => ({
      day: item._id ?? item.day ?? "N/A",
      count: item.count ?? 0,
    }));
    return { trend };
  },

  getTopPitches: async (range: string = "30", limit = 10) => {
    const response = await apiClient.get("/admin/reports/top-pitches", {
      params: { range, limit },
    });
    const data = unwrapData(response);
    return { pitches: Array.isArray(data) ? data : [] };
  },

  exportReport: async (range: string = "30") => {
    const response = await apiClient.get("/admin/reports/export-csv", {
      params: { range },
      responseType: "blob",
    });
    return response.data;
  },
};

// ==================== Issues (Player Reports) ====================

export const issuesApi = {
  getIssues: async (page = 1, limit = 50, filters?: any) => {
    const response = await apiClient.get("/admin/issues", {
      params: { page, limit, ...filters },
    });
    const data = unwrapData(response);
    return { issues: Array.isArray(data) ? data : [] };
  },
};

// ==================== Backup & Recovery ====================

export const backupApi = {
  getBackups: async () => {
    const response = await apiClient.get("/admin/settings/backups");
    const data = unwrapData(response);
    return { backups: Array.isArray(data) ? data : [] };
  },

  createBackup: async (notes?: string) => {
    const response = await apiClient.post("/admin/settings/backups", { notes });
    return response.data;
  },

  restoreBackup: async (id: string) => {
    const response = await apiClient.post(`/admin/settings/backups/${id}/restore`, {});
    return response.data;
  },
};

// ==================== Meta APIs ====================

export const metaApi = {
  getCities: async () => {
    const response = await apiClient.get("/city");
    const data = unwrapData(response);
    const cities = data?.cities ?? data ?? [];
    return { cities };
  },

  getSports: async () => {
    const response = await apiClient.get("/sport");
    const data = unwrapData(response);
    const sports = data?.sports ?? data ?? [];
    return { sports };
  },
};
