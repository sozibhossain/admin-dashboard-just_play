"use client";

import React from "react"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useSettings,
  useUpdateGeneralSettings,
  useUpdateBusinessSettings,
  useUpdateSystemSettings,
  useChangeAdminPassword,
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
  useBackups,
  useCreateBackup,
  useRestoreBackup,
} from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Shield,
  Activity,
  Lock,
  Trash2,
  DatabaseBackup,
  RotateCcw,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: settings, isLoading } = useSettings();
  const updateGeneral = useUpdateGeneralSettings();
  const updateBusiness = useUpdateBusinessSettings();
  const updateSystem = useUpdateSystemSettings();
  const changePassword = useChangeAdminPassword();

  const [formData, setFormData] = useState({
    appName: "",
    supportEmail: "",
    supportPhone: "",
    platformFee: 5,
    defaultCurrency: "IQD",
    defaultCity: "",
    sessionTimeoutMinutes: 30,
  });

  useEffect(() => {
    if (!settings) return;
    setFormData({
      appName: settings.general?.appName ?? "",
      supportEmail: settings.general?.supportEmail ?? "",
      supportPhone: settings.general?.supportPhone ?? "",
      platformFee: settings.business?.platformFeePercent ?? 5,
      defaultCurrency: settings.business?.defaultCurrency ?? "IQD",
      defaultCity: settings.business?.defaultCity ?? "",
      sessionTimeoutMinutes: settings.system?.adminSessionTimeoutMinutes ?? 30,
    });
  }, [settings]);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneral.mutate({
      appName: formData.appName,
      supportEmail: formData.supportEmail,
      supportPhone: formData.supportPhone,
    });
  };

  const handleBusinessSubmit = () => {
    updateBusiness.mutate({
      platformFeePercent: formData.platformFee,
      defaultCurrency: formData.defaultCurrency,
      defaultCity: formData.defaultCity,
    });
  };

  const handleSessionTimeoutSubmit = () => {
    updateSystem.mutate({
      adminSessionTimeoutMinutes: formData.sessionTimeoutMinutes,
    });
  };

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Missing admin session");
      return;
    }
    changePassword.mutate(
      { adminId: session.user.id, newPassword },
      {
        onSuccess: () => {
          setPasswordDialogOpen(false);
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  const [apiKeysDialogOpen, setApiKeysDialogOpen] = useState(false);
  const { data: apiKeys } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const [newKeyName, setNewKeyName] = useState("");

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Enter a name for the key");
      return;
    }
    createApiKey.mutate(newKeyName.trim(), {
      onSuccess: () => setNewKeyName(""),
    });
  };

  const { data: backupsData } = useBackups();
  const backups = backupsData?.backups || [];
  const createBackup = useCreateBackup();
  const restoreBackup = useRestoreBackup();
  const [restoreTarget, setRestoreTarget] = useState<any | null>(null);

  const handleCreateBackup = () => {
    createBackup.mutate("Manual backup triggered from admin dashboard");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Skeleton className="h-10 w-48 bg-slate-700 mb-4" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 border-slate-700 bg-slate-900">
                <Skeleton className="h-6 w-40 bg-slate-800 mb-4" />
                <Skeleton className="h-40 bg-slate-800" />
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">System Settings</h1>
          <p className="text-slate-400 mt-1">Manage platform configuration and settings</p>
        </div>

        {/* General Configuration */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              General Configuration
            </h3>
          </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                App Name
              </label>
              <Input
                type="text"
                value={formData.appName}
                onChange={(e) =>
                  setFormData({ ...formData, appName: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Support Email
              </label>
              <Input
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Support Phone
              </label>
              <Input
                type="tel"
                value={formData.supportPhone}
                onChange={(e) =>
                  setFormData({ ...formData, supportPhone: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={updateGeneral.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateGeneral.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Business Rules */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Business Rules</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Platform Fee (%)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Percentage taken from each online booking.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.platformFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platformFee: parseFloat(e.target.value),
                    })
                  }
                  className="w-24 bg-slate-800 border-slate-700 text-white"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Default Currency
              </label>
              <Select
                value={formData.defaultCurrency}
                onValueChange={(value) =>
                  setFormData({ ...formData, defaultCurrency: value })
                }
              >
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="IQD">IQD (Iraqi Dinar)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Default City
              </label>
              <Input
                type="text"
                value={formData.defaultCity}
                onChange={(e) =>
                  setFormData({ ...formData, defaultCity: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              type="button"
              onClick={handleBusinessSubmit}
              disabled={updateBusiness.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Business Rules
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">Change Admin Password</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Update your admin account password
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 bg-transparent"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-white">Manage API Keys</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Create and manage API keys for integrations
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-slate-600 bg-transparent"
                  onClick={() => setApiKeysDialogOpen(true)}
                >
                  Manage Keys
                </Button>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">
                    Admin Session Timeout
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Minutes of inactivity before an admin session expires
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={formData.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sessionTimeoutMinutes: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-24 bg-slate-800 border-slate-700 text-white"
                  />
                  <Button
                    size="sm"
                    onClick={handleSessionTimeoutSubmit}
                    disabled={updateSystem.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">System Status</span>
              <span className="text-green-400 font-medium">System Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Version</span>
              <span className="text-slate-400">
                {settings?.system?.version || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Last Backup</span>
              <span className="text-slate-400">
                {settings?.system?.lastBackupAt
                  ? new Date(settings.system.lastBackupAt).toLocaleString()
                  : "Never"}
              </span>
            </div>
          </div>
        </Card>

        {/* Data Backup & Recovery */}
        <Card className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DatabaseBackup className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Data Backup & Recovery
              </h3>
            </div>
            <Button
              size="sm"
              onClick={handleCreateBackup}
              disabled={createBackup.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createBackup.isPending ? "Backing up..." : "Create Manual Backup"}
            </Button>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            The system automatically backs up all data at least once per day.
            Manual backups can be triggered at any time, and any backup can be
            restored in case of a system failure.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {backups.length === 0 ? (
              <p className="text-sm text-slate-400">No backups yet.</p>
            ) : (
              backups.map((backup: any) => (
                <div
                  key={backup._id}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {backup.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {backup.type} &middot;{" "}
                      {backup.createdAt
                        ? new Date(backup.createdAt).toLocaleString()
                        : "N/A"}
                      {backup.status === "restored" && (
                        <span className="text-green-400"> &middot; restored</span>
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent shrink-0"
                    onClick={() => setRestoreTarget(backup)}
                    disabled={restoreBackup.isPending}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Restore
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Restore Backup Confirm */}
      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this backup?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will overwrite current data with the contents of{" "}
              {restoreTarget?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!restoreTarget) return;
                restoreBackup.mutate(restoreTarget._id);
                setRestoreTarget(null);
              }}
            >
              Yes, restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleChangePassword}
              disabled={changePassword.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {changePassword.isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Keys Dialog */}
      <Dialog open={apiKeysDialogOpen} onOpenChange={setApiKeysDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>API Keys</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="Key name (e.g. Mobile App)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button
                onClick={handleCreateKey}
                disabled={createApiKey.isPending}
                className="bg-blue-600 hover:bg-blue-700 shrink-0"
              >
                Create
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(apiKeys || []).length === 0 ? (
                <p className="text-sm text-slate-400">No API keys yet.</p>
              ) : (
                (apiKeys || []).map((key: any) => (
                  <div
                    key={key._id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        {key.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate font-mono">
                        {key.key}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent shrink-0"
                      onClick={() => deleteApiKey.mutate(key._id)}
                      disabled={deleteApiKey.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
