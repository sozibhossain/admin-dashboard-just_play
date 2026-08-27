"use client";

import { useState } from "react";
import {
  usePitchOwners,
  useVerifyOwner,
  useSuspendOwner,
  useRejectOwner,
  useOwnerStats,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle2, AlertTriangle } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  verified: { bg: "bg-green-500/20", text: "text-green-400" },
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  rejected: { bg: "bg-red-500/20", text: "text-red-400" },
  suspended: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default function PitchOwnersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Updated default value
  const [viewOwner, setViewOwner] = useState<any | null>(null);

  const filters = {
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
  };
  const { data, isLoading } = usePitchOwners(page, limit, filters);
  const verifyOwner = useVerifyOwner();
  const suspendOwner = useSuspendOwner();
  const rejectOwner = useRejectOwner();
  const confirmAction = useConfirmation();

  const handleVerify = async (ownerId: string) => {
    const confirmed = await confirmAction({
      title: "Verify this pitch owner?",
      description:
        "Their business profile will be approved and marked as verified across the platform.",
      confirmLabel: "Verify owner",
      tone: "success",
    });

    if (confirmed) verifyOwner.mutate(ownerId);
  };

  const handleSuspend = async (ownerId: string) => {
    const confirmed = await confirmAction({
      title: "Suspend this pitch owner?",
      description:
        "Their owner access and related management actions will be restricted until restored.",
      confirmLabel: "Suspend owner",
      tone: "warning",
    });

    if (confirmed) suspendOwner.mutate({ id: ownerId, reason: "Admin action" });
  };

  const handleReject = async (ownerId: string) => {
    const confirmed = await confirmAction({
      title: "Reject this application?",
      description:
        "The pitch owner application will be rejected. Review the profile before continuing.",
      confirmLabel: "Reject application",
      tone: "danger",
    });

    if (confirmed) rejectOwner.mutate({ id: ownerId, reason: "Admin action" });
  };

  const { data: ownerStats } = useOwnerStats(viewOwner?._id);

  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout>
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Pitch Owners</h1>
          <p className="text-slate-400 mt-1">Manage pitch owner accounts and verification</p>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search owners, business or city..."
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
                  <SelectItem value="all">All Status</SelectItem> {/* Updated value */}
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
        ) : data?.owners && data.owners.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Business</TableHead>
                    <TableHead className="text-slate-300">Owner Name</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Performance</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.owners.map((owner: any) => {
                    const colors =
                      statusColors[owner.status] || statusColors.pending;
                    return (
                      <TableRow key={owner._id} className="border-slate-700">
                        <TableCell className="font-medium text-white">
                          {owner.businessName}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {owner.name}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {owner.city?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="text-sm">
                            <p>Bookings: {owner.totalBookings || 0}</p>
                            <p className="text-yellow-400 font-medium">
                              Rating: {owner.rating?.toFixed(1) || "N/A"} ★
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${colors.bg} ${colors.text}`}
                          >
                            {owner.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {owner.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVerify(owner._id)}
                                  disabled={verifyOwner.isPending}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                                  onClick={() => handleReject(owner._id)}
                                  disabled={rejectOwner.isPending}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {owner.status === "verified" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                                onClick={() => handleSuspend(owner._id)}
                                disabled={suspendOwner.isPending}
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Suspend
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                              onClick={() => setViewOwner(owner)}
                            >
                              View Profile
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
            <p className="text-slate-400">No pitch owners found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.owners && data.owners.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total owners)
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

      <Dialog open={!!viewOwner} onOpenChange={(open) => !open && setViewOwner(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Pitch Owner Profile</DialogTitle>
          </DialogHeader>
          {viewOwner && (
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Business:</span>{" "}
                {viewOwner.businessName || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Owner Name:</span>{" "}
                {viewOwner.name || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>{" "}
                {viewOwner.phone || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">City:</span>{" "}
                {viewOwner.city?.name || viewOwner.city || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Status:</span> {viewOwner.status}
              </div>
              <div>
                <span className="text-slate-400">Bookings:</span>{" "}
                {ownerStats?.bookings ?? viewOwner.totalBookings ?? 0}
              </div>
              <div>
                <span className="text-slate-400">Rating:</span>{" "}
                {viewOwner.rating ? viewOwner.rating.toFixed(1) : "N/A"}
              </div>
              {ownerStats && (
                <>
                  <div>
                    <span className="text-slate-400">Revenue:</span>{" "}
                    {ownerStats.revenue?.toLocaleString?.() ?? 0}{" "}
                    {ownerStats.currency || "IQD"}
                  </div>
                  <div>
                    <span className="text-slate-400">Acceptance Rate:</span>{" "}
                    {ownerStats.acceptanceRate ?? 0}%
                  </div>
                  <div>
                    <span className="text-slate-400">Cancellations:</span>{" "}
                    {ownerStats.cancellations ?? 0}
                  </div>
                  <div>
                    <span className="text-slate-400">No-Shows:</span>{" "}
                    {ownerStats.noshows ?? 0}
                  </div>
                  <div>
                    <span className="text-slate-400">
                      Pitches ({ownerStats.totalPitches ?? 0}):
                    </span>
                    <ul className="mt-1 space-y-1">
                      {(ownerStats.pitches || []).map((p: any) => (
                        <li key={p._id} className="text-slate-300 text-xs">
                          {p.name} — {p.status} / {p.bookingAvailability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
