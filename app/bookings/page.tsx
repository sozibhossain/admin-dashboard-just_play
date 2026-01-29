"use client";

import { useState } from "react";
import {
  useBookings,
  useUpdateBookingStatus,
  useConfirmBooking,
  useDeleteBooking,
} from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
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
import { Search, Filter, CheckCircle2, XCircle, Clock } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  confirmed: { bg: "bg-blue-500/20", text: "text-blue-400" },
  completed: { bg: "bg-green-500/20", text: "text-green-400" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-400" },
  noshow: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewBooking, setViewBooking] = useState<any | null>(null);
  const [deleteBooking, setDeleteBooking] = useState<any | null>(null);

  const filters = statusFilter !== "all" ? { status: statusFilter } : undefined;
  const { data, isLoading } = useBookings(page, limit, filters);
  const updateStatus = useUpdateBookingStatus();
  const confirmBooking = useConfirmBooking();
  const removeBooking = useDeleteBooking();

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateStatus.mutate({ id: bookingId, status: newStatus });
  };

  const handleConfirm = (bookingId: string) => {
    confirmBooking.mutate(bookingId);
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Booking Management</h1>
          <p className="text-slate-400 mt-1">Manage and monitor all bookings</p>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search booking ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="noshow">No Show</SelectItem>
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
        ) : data?.bookings && data.bookings.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Details</TableHead>
                    <TableHead className="text-slate-300">User / Phone</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.bookings.map((booking: any) => {
                    const colors =
                      statusColors[booking.status] || statusColors.pending;
                    return (
                      <TableRow key={booking._id} className="border-slate-700">
                        <TableCell className="font-medium text-white">
                          {booking.bookingId || booking._id}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div>
                            <p className="font-medium">{booking.pitchId?.name}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(booking.date).toLocaleDateString()} at{" "}
                              {booking.timeSlot}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div>
                            <p className="font-medium">
                              {booking.userId?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.userId?.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {booking.price?.toLocaleString()} {booking.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${colors.bg} ${colors.text}`}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleConfirm(booking._id)}
                                  disabled={confirmBooking.isPending}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                                  onClick={() =>
                                    handleStatusChange(
                                      booking._id,
                                      "cancelled"
                                    )
                                  }
                                  disabled={updateStatus.isPending}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 bg-transparent"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                              onClick={() => setViewBooking(booking)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                              onClick={() => setDeleteBooking(booking)}
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
            <p className="text-slate-400">No bookings found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.bookings && data.bookings.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total bookings)
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

      <Dialog open={!!viewBooking} onOpenChange={(open) => !open && setViewBooking(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Booking ID:</span>{" "}
                {viewBooking.bookingId || viewBooking._id}
              </div>
              <div>
                <span className="text-slate-400">User:</span>{" "}
                {viewBooking.userId?.name || "N/A"} ({viewBooking.userId?.phone || "N/A"})
              </div>
              <div>
                <span className="text-slate-400">Pitch:</span>{" "}
                {viewBooking.pitchId?.name || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Date:</span>{" "}
                {new Date(viewBooking.date).toLocaleDateString()} at {viewBooking.timeSlot}
              </div>
              <div>
                <span className="text-slate-400">Amount:</span>{" "}
                {viewBooking.price?.toLocaleString()} {viewBooking.currency}
              </div>
              <div>
                <span className="text-slate-400">Status:</span>{" "}
                {viewBooking.status}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteBooking} onOpenChange={(open) => !open && setDeleteBooking(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
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
                if (!deleteBooking) return;
                removeBooking.mutate(deleteBooking._id);
                setDeleteBooking(null);
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
