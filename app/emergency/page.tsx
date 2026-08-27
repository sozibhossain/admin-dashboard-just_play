"use client";

import { useState } from "react";
import {
  useLockSystem,
  useUnlockSystem,
  useSendNotification,
  useSystemLockStatus,
} from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useConfirmation } from "@/components/confirmation-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Lock, Bell, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function EmergencyPage() {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState<
    "all" | "players" | "owners"
  >("all");
  const { data: lockStatus } = useSystemLockStatus();
  const lockSystem = useLockSystem();
  const unlockSystem = useUnlockSystem();
  const sendNotification = useSendNotification();
  const confirmAction = useConfirmation();

  const isLocked = !!lockStatus?.locked;

  const handleLockSystem = async () => {
    const confirmed = await confirmAction({
      title: "Lock the entire platform?",
      description:
        "All new bookings will stop immediately. Existing bookings will remain visible.",
      confirmLabel: "Lock platform",
      tone: "danger",
    });

    if (confirmed) lockSystem.mutate("Locked by admin for maintenance");
  };

  const handleUnlockSystem = async () => {
    const confirmed = await confirmAction({
      title: "Restore platform bookings?",
      description: "Players will be able to create new bookings again immediately.",
      confirmLabel: "Unlock platform",
      tone: "success",
    });

    if (confirmed) unlockSystem.mutate();
  };

  const handleSendAlert = async () => {
    if (!notificationMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const confirmed = await confirmAction({
      title: "Send this notification?",
      description: `This alert will be sent to ${notificationTarget === "all" ? "all users" : notificationTarget}.`,
      confirmLabel: "Send notification",
      tone: "primary",
    });

    if (!confirmed) return;

    sendNotification.mutate({
      message: notificationMessage,
      target: notificationTarget,
    });
    setNotificationMessage("");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Emergency Controls
          </h1>
          <p className="text-slate-400 mt-1">
            Critical platform management tools. Use with caution.
          </p>
        </div>

        {/* Current Status Banner */}
        <Card
          className={`p-4 border-2 ${
            isLocked
              ? "border-red-500/50 bg-red-500/10"
              : "border-green-500/30 bg-green-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {isLocked ? (
              <Lock className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
            <div>
              <p
                className={`font-medium ${isLocked ? "text-red-300" : "text-green-300"}`}
              >
                {isLocked
                  ? `System is currently LOCKED${lockStatus?.lockedAt ? ` since ${new Date(lockStatus.lockedAt).toLocaleString()}` : ""}`
                  : "System is operational"}
              </p>
              {isLocked && lockStatus?.message && (
                <p className="text-sm text-red-200 mt-1">
                  {lockStatus.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* System Lockdown */}
        <Card className="p-6 border-red-500/30 bg-red-500/10 border-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                System Lockdown
              </h3>
              <p className="text-red-300 font-medium mb-3">
                This will prevent ALL new bookings across the entire platform. Existing
                bookings will remain visible but no new actions can be taken by users.
              </p>
              <p className="text-sm text-slate-400 mb-4">
                Use this for server maintenance or critical disputes.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleLockSystem}
                disabled={lockSystem.isPending || isLocked}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                {lockSystem.isPending ? "Locking..." : "Lock System"}
              </Button>
              <Button
                onClick={handleUnlockSystem}
                disabled={unlockSystem.isPending || !isLocked}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
              >
                {unlockSystem.isPending ? "Unlocking..." : "Unlock System"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Mass Notification */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Mass Notification
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Send an alert to users across the platform.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Audience
                  </label>
                  <Select
                    value={notificationTarget}
                    onValueChange={(v: "all" | "players" | "owners") =>
                      setNotificationTarget(v)
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="players">Players Only</SelectItem>
                      <SelectItem value="owners">Pitch Owners Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Enter message here..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSendAlert}
                  disabled={sendNotification.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {sendNotification.isPending ? "Sending..." : "Send Alert"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Warning Message */}
        <Card className="p-4 border-yellow-500/30 bg-yellow-500/10">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-300 mb-1">Warning</p>
              <p className="text-sm text-yellow-200">
                These emergency controls should only be used in critical situations. Any
                actions taken here will directly affect all users on the platform. Please
                contact the system administrator before using these tools.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Reference */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Reference</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-slate-400">System Lockdown:</span>
              <span className="text-slate-300">Disables new bookings platform-wide</span>
            </div>
            <div className="flex gap-3">
              <span className="text-slate-400">Mass Notification:</span>
              <span className="text-slate-300">Sends push notification to selected audience</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
