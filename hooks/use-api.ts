import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dashboardApi,
  bookingApi,
  userApi,
  pitchOwnerApi,
  pitchApi,
  settingsApi,
  emergencyApi,
  reportsApi,
  metaApi,
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

// ==================== Settings Hooks ====================

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => settingsApi.updateSettings(data),
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

// ==================== Emergency Hooks ====================

export const useLockSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => emergencyApi.lockSystem(reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
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
      toast.success("System unlocked");
    },
    onError: (error) => {
      toast.error("Failed to unlock system");
      console.error(error);
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      message,
      userType,
    }: {
      message: string;
      userType?: string;
    }) => emergencyApi.sendMassNotification(message, userType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
