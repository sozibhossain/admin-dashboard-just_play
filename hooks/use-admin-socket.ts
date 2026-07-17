"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";

export function useAdminSocket() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit("join", session.user.id);

    const invalidate = (key: string[]) =>
      queryClient.invalidateQueries({ queryKey: key });

    const onBookingFeed = () => {
      invalidate(["bookings"]);
      invalidate(["dashboard", "stats"]);
      invalidate(["dashboard", "recent-bookings"]);
      invalidate(["dashboard", "booking-trend"]);
      invalidate(["dashboard", "top-pitches"]);
      invalidate(["reports"]);
    };
    const onBookingDeleted = () => {
      onBookingFeed();
    };
    const onUserChanged = () => invalidate(["users"]);
    const onUserDeleted = () => invalidate(["users"]);
    const onOwnerCreated = () => invalidate(["pitch-owners"]);
    const onPitchChanged = () => invalidate(["pitches"]);
    const onCityChanged = () => invalidate(["countries"]);
    const onSportChanged = () => invalidate(["sports-admin"]);
    const onLockdownUpdated = () => {
      invalidate(["emergency"]);
      invalidate(["settings"]);
    };
    const onNotificationNew = (notif: any) => {
      toast.info(notif?.title || "New notification", {
        description: notif?.message,
      });
    };
    const onNotificationMass = (notif: any) => {
      toast.info(notif?.title || "Broadcast sent", {
        description: notif?.message,
      });
      invalidate(["audit-logs"]);
    };
    const onIssueNew = (issue: any) => {
      toast.warning("New player report", {
        description: issue?.title || "A player reported an issue",
      });
      invalidate(["issues"]);
      invalidate(["dashboard", "stats"]);
    };

    socket.on("admin:booking-feed", onBookingFeed);
    socket.on("booking:deleted", onBookingDeleted);
    socket.on("user:created", onUserChanged);
    socket.on("user:updated", onUserChanged);
    socket.on("user:deleted", onUserDeleted);
    socket.on("owner:created", onOwnerCreated);
    socket.on("pitch:created", onPitchChanged);
    socket.on("pitch:updated", onPitchChanged);
    socket.on("pitch:deleted", onPitchChanged);
    socket.on("city:created", onCityChanged);
    socket.on("city:updated", onCityChanged);
    socket.on("city:deleted", onCityChanged);
    socket.on("sport:created", onSportChanged);
    socket.on("sport:updated", onSportChanged);
    socket.on("sport:deleted", onSportChanged);
    socket.on("system:lockdown-updated", onLockdownUpdated);
    socket.on("notification:new", onNotificationNew);
    socket.on("notification:mass", onNotificationMass);
    socket.on("issue:new", onIssueNew);

    return () => {
      socket.off("admin:booking-feed", onBookingFeed);
      socket.off("booking:deleted", onBookingDeleted);
      socket.off("user:created", onUserChanged);
      socket.off("user:updated", onUserChanged);
      socket.off("user:deleted", onUserDeleted);
      socket.off("owner:created", onOwnerCreated);
      socket.off("pitch:created", onPitchChanged);
      socket.off("pitch:updated", onPitchChanged);
      socket.off("pitch:deleted", onPitchChanged);
      socket.off("city:created", onCityChanged);
      socket.off("city:updated", onCityChanged);
      socket.off("city:deleted", onCityChanged);
      socket.off("sport:created", onSportChanged);
      socket.off("sport:updated", onSportChanged);
      socket.off("sport:deleted", onSportChanged);
      socket.off("system:lockdown-updated", onLockdownUpdated);
      socket.off("notification:new", onNotificationNew);
      socket.off("notification:mass", onNotificationMass);
      socket.off("issue:new", onIssueNew);
    };
  }, [status, session?.user?.id, queryClient]);
}
