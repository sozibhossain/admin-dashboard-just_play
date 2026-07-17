import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dashboardApi,
  bookingApi,
  userApi,
  pitchOwnerApi,
  pitchApi,
  eventApi,
  countryApi,
  sportApi,
  settingsApi,
  apiKeysApi,
  auditApi,
  emergencyApi,
  reportsApi,
  metaApi,
  issuesApi,
  backupApi,
} from "@/lib/api";
import { toast } from "sonner";

// ==================== Dashboard Hooks ====================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookingTrend = (days = 7) => {
  return useQuery({
    queryKey: ["dashboard", "booking-trend", days],
    queryFn: () => dashboardApi.getBookingTrend(days),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTopPitches = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "top-pitches", limit],
    queryFn: () => dashboardApi.getTopPitches(limit),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRecentBookings = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "recent-bookings", limit],
    queryFn: () => dashboardApi.getRecentBookings(limit),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// ==================== Booking Hooks ====================

export const useBookings = (page = 1, limit = 10, filters?: any) => {
  return useQuery({
    queryKey: ["bookings", page, limit, filters],
    queryFn: () => bookingApi.getBookings(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingApi.getBookingById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: (error) => {
      toast.error("Failed to update booking status");
      console.error(error);
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingApi.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking cancelled");
    },
    onError: (error) => {
      toast.error("Failed to cancel booking");
      console.error(error);
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingApi.confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking confirmed");
    },
    onError: (error) => {
      toast.error("Failed to confirm booking");
      console.error(error);
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete booking");
      console.error(error);
    },
  });
};

// ==================== User Hooks ====================

export const useUsers = (page = 1, limit = 10, filters?: any) => {
  return useQuery({
    queryKey: ["users", page, limit, filters],
    queryFn: () => userApi.getUsers(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      userApi.banUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User banned successfully");
    },
    onError: (error) => {
      toast.error("Failed to ban user");
      console.error(error);
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User unbanned successfully");
    },
    onError: (error) => {
      toast.error("Failed to unban user");
      console.error(error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error(error);
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => userApi.searchUsers(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== Pitch Owner Hooks ====================

export const usePitchOwners = (page = 1, limit = 10, filters?: any) => {
  return useQuery({
    queryKey: ["pitch-owners", page, limit, filters],
    queryFn: () => pitchOwnerApi.getOwners(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useVerifyOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pitchOwnerApi.verifyOwner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitch-owners"] });
      toast.success("Owner verified successfully");
    },
    onError: (error) => {
      toast.error("Failed to verify owner");
      console.error(error);
    },
  });
};

export const useSuspendOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      pitchOwnerApi.suspendOwner(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitch-owners"] });
      toast.success("Owner suspended successfully");
    },
    onError: (error) => {
      toast.error("Failed to suspend owner");
      console.error(error);
    },
  });
};

export const useRejectOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      pitchOwnerApi.rejectOwner(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitch-owners"] });
      toast.success("Owner rejected");
    },
    onError: (error) => {
      toast.error("Failed to reject owner");
      console.error(error);
    },
  });
};

export const useOwnerStats = (id: string) => {
  return useQuery({
    queryKey: ["pitch-owners", id, "stats"],
    queryFn: () => pitchOwnerApi.getOwnerStats(id),
    enabled: !!id,
  });
};

// ==================== Pitch Hooks ====================

export const usePitches = (page = 1, limit = 10, filters?: any) => {
  return useQuery({
    queryKey: ["pitches", page, limit, filters],
    queryFn: () => pitchApi.getPitches(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePitchById = (id: string) => {
  return useQuery({
    queryKey: ["pitch", id],
    queryFn: () => pitchApi.getPitchById(id),
    enabled: !!id,
  });
};

export const useCreatePitch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => pitchApi.createPitch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      toast.success("Pitch created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create pitch");
      console.error(error);
    },
  });
};

export const useUpdatePitch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      pitchApi.updatePitch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      toast.success("Pitch updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pitch");
      console.error(error);
    },
  });
};

export const useUpdatePitchStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      pitchApi.updatePitchStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      toast.success("Pitch status updated");
    },
    onError: (error) => {
      toast.error("Failed to update pitch status");
      console.error(error);
    },
  });
};

export const useDeletePitch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pitchApi.deletePitch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      toast.success("Pitch deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete pitch");
      console.error(error);
    },
  });
};

// ==================== Event Hooks ====================

export const useEvents = (page = 1, limit = 10, filters?: any) => {
  return useQuery({
    queryKey: ["events", page, limit, filters],
    queryFn: () => eventApi.getEvents(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useEventById = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventApi.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => eventApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create event");
      console.error(error);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      eventApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update event");
      console.error(error);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete event");
      console.error(error);
    },
  });
};

// ==================== Country Hooks ====================

export const useCountries = (q?: string) => {
  return useQuery({
    queryKey: ["countries", q],
    queryFn: () => countryApi.getCountries(q),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => countryApi.createCountry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create country");
      console.error(error);
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      countryApi.updateCountry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update country");
      console.error(error);
    },
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => countryApi.deleteCountry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete country");
      console.error(error);
    },
  });
};

// ==================== Sport Admin Hooks ====================

export const useSportsAdmin = (q?: string) => {
  return useQuery({
    queryKey: ["sports-admin", q],
    queryFn: () => sportApi.getSports(q),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => sportApi.createSport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-admin"] });
      toast.success("Sport created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create sport");
      console.error(error);
    },
  });
};

export const useUpdateSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      sportApi.updateSport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-admin"] });
      toast.success("Sport updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update sport");
      console.error(error);
    },
  });
};

export const useDeleteSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sportApi.deleteSport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-admin"] });
      toast.success("Sport deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete sport");
      console.error(error);
    },
  });
};

// ==================== Settings Hooks ====================

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      appName?: string;
      supportEmail?: string;
      supportPhone?: string;
    }) => settingsApi.updateGeneral(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error(error);
    },
  });
};

export const useUpdateBusinessSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => settingsApi.updateBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Business rules updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update business rules");
      console.error(error);
    },
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      adminSessionTimeoutMinutes?: number;
      requireTwoFactor?: boolean;
    }) => settingsApi.updateSystemSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("System settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update system settings");
      console.error(error);
    },
  });
};

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: ({
      adminId,
      newPassword,
    }: {
      adminId: string;
      newPassword: string;
    }) => settingsApi.changeAdminPassword(adminId, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error("Failed to change password");
      console.error(error);
    },
  });
};

// ==================== API Key Hooks ====================

export const useApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => apiKeysApi.getKeys(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => apiKeysApi.createKey(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key created");
    },
    onError: (error) => {
      toast.error("Failed to create API key");
      console.error(error);
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.deleteKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete API key");
      console.error(error);
    },
  });
};

// ==================== Audit Log Hooks ====================

export const useAuditLogs = (page = 1, limit = 50, filters?: any) => {
  return useQuery({
    queryKey: ["audit-logs", page, limit, filters],
    queryFn: () => auditApi.getLogs(page, limit, filters),
    staleTime: 60 * 1000,
  });
};

// ==================== Emergency Hooks ====================

export const useSystemLockStatus = () => {
  return useQuery({
    queryKey: ["emergency", "status"],
    queryFn: () => emergencyApi.getSystemLockStatus(),
    staleTime: 30 * 1000,
  });
};

export const useLockSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message?: string) => emergencyApi.lockSystem(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["emergency"] });
      toast.success("System locked");
    },
    onError: (error) => {
      toast.error("Failed to lock system");
      console.error(error);
    },
  });
};

export const useUnlockSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => emergencyApi.unlockSystem(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["emergency"] });
      toast.success("System unlocked");
    },
    onError: (error) => {
      toast.error("Failed to unlock system");
      console.error(error);
    },
  });
};

export const useSendNotification = () => {
  return useMutation({
    mutationFn: ({
      message,
      target,
      title,
    }: {
      message: string;
      target?: "all" | "players" | "owners";
      title?: string;
    }) => emergencyApi.sendMassNotification(message, target, title),
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send notification");
      console.error(error);
    },
  });
};

// ==================== Reports Hooks ====================

export const useRevenueReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["reports", "revenue", startDate, endDate],
    queryFn: () => reportsApi.getRevenueReport(startDate, endDate),
    staleTime: 30 * 60 * 1000,
  });
};

export const useBookingReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["reports", "bookings", startDate, endDate],
    queryFn: () => reportsApi.getBookingReport(startDate, endDate),
    staleTime: 30 * 60 * 1000,
  });
};

export const useReportsTopPitches = (range = "30", limit = 10) => {
  return useQuery({
    queryKey: ["reports", "top-pitches", range, limit],
    queryFn: () => reportsApi.getTopPitches(range, limit),
    staleTime: 30 * 60 * 1000,
  });
};

// ==================== Issues Hooks ====================

export const useIssues = (page = 1, limit = 50, filters?: any) => {
  return useQuery({
    queryKey: ["issues", page, limit, filters],
    queryFn: () => issuesApi.getIssues(page, limit, filters),
    staleTime: 60 * 1000,
  });
};

// ==================== Backup & Recovery Hooks ====================

export const useBackups = () => {
  return useQuery({
    queryKey: ["backups"],
    queryFn: () => backupApi.getBackups(),
    staleTime: 60 * 1000,
  });
};

export const useCreateBackup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notes?: string) => backupApi.createBackup(notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Backup created");
    },
    onError: (error) => {
      toast.error("Failed to create backup");
      console.error(error);
    },
  });
};

export const useRestoreBackup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => backupApi.restoreBackup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup restored successfully");
    },
    onError: (error) => {
      toast.error("Failed to restore backup");
      console.error(error);
    },
  });
};

// ==================== Meta Hooks ====================

export const useCities = () => {
  return useQuery({
    queryKey: ["meta", "cities"],
    queryFn: () => metaApi.getCities(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useSports = () => {
  return useQuery({
    queryKey: ["meta", "sports"],
    queryFn: () => metaApi.getSports(),
    staleTime: 30 * 60 * 1000,
  });
};
