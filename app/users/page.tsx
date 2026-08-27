"use client";

import { useState } from "react";
import {
  useUsers,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
  useUserById,
} from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useConfirmation } from "@/components/confirmation-provider";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Ban, RotateCcw } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/20", text: "text-green-400" },
  inactive: { bg: "bg-gray-500/20", text: "text-gray-400" },
  banned: { bg: "bg-red-500/20", text: "text-red-400" },
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);

  const filters = {
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
  };
  const { data, isLoading } = useUsers(page, limit, filters);
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const removeUser = useDeleteUser();
  const confirmAction = useConfirmation();

  const handleBan = async (userId: string) => {
    const confirmed = await confirmAction({
      title: "Ban this user?",
      description:
        "They will lose access to the platform until an administrator restores their account.",
      confirmLabel: "Ban user",
      tone: "danger",
    });

    if (confirmed) banUser.mutate({ id: userId, reason: "Admin action" });
  };

  const handleUnban = async (userId: string) => {
    const confirmed = await confirmAction({
      title: "Restore this user?",
      description:
        "The user will be able to sign in and use the platform again immediately.",
      confirmLabel: "Restore access",
      tone: "success",
    });

    if (confirmed) unbanUser.mutate(userId);
  };

  const totalPages = data?.totalPages || 1;
  const { data: userDetail } = useUserById(viewUser?._id);

  return (
    <AdminLayout>
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">User Management</h1>
          <p className="text-slate-400 mt-1">Manage platform users and permissions</p>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search player name, phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={6} rows={10} />
        ) : data?.users && data.users.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">City</TableHead>
                    <TableHead className="text-slate-300">Stats</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((user: any) => {
                    const colors =
                      statusColors[user.status] || statusColors.active;
                    return (
                      <TableRow key={user._id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {user.city?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="text-sm">
                            <p>Bookings: {user.totalBookings || 0}</p>
                            <p className="text-xs text-slate-500">
                              No-Shows: {user.noShows || 0}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${colors.bg} ${colors.text}`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === "active" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                                onClick={() => handleBan(user._id)}
                                disabled={banUser.isPending}
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Ban User
                              </Button>
                            ) : user.status === "banned" ? (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleUnban(user._id)}
                                disabled={unbanUser.isPending}
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Reactivate
                              </Button>
                            ) : null}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                              onClick={() => setViewUser(user)}
                            >
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                              onClick={() => setDeleteUser(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-slate-700 bg-slate-900 text-center">
            <p className="text-slate-400">No users found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.users && data.users.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total users)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 text-sm text-slate-300">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Name:</span> {viewUser.name}
              </div>
              <div>
                <span className="text-slate-400">Phone:</span> {viewUser.phone}
              </div>
              <div>
                <span className="text-slate-400">City:</span>{" "}
                {viewUser.city?.name || viewUser.city || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Status:</span> {viewUser.status}
              </div>
              <div>
                <span className="text-slate-400">Bookings:</span>{" "}
                {userDetail?.stats?.bookings ?? viewUser.totalBookings ?? 0}
              </div>
              <div>
                <span className="text-slate-400">No-Shows:</span>{" "}
                {userDetail?.stats?.noshows ?? viewUser.noShows ?? 0}
              </div>
              <div>
                <span className="text-slate-400">Cancellations:</span>{" "}
                {userDetail?.stats?.cancellations ?? 0}
              </div>
              {userDetail?.bookingHistory?.length > 0 && (
                <div>
                  <span className="text-slate-400">Recent Bookings:</span>
                  <ul className="mt-1 space-y-1">
                    {userDetail.bookingHistory.map((b: any) => (
                      <li key={b._id} className="text-slate-300 text-xs">
                        {b.pitch?.name || "N/A"} —{" "}
                        {b.date ? new Date(b.date).toLocaleDateString() : ""}{" "}
                        {b.timeSlot} ({b.status})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!deleteUser) return;
                removeUser.mutate(deleteUser._id);
                setDeleteUser(null);
              }}
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
