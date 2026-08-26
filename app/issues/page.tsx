"use client";

import { useState } from "react";
import { useIssues } from "@/hooks/use-api";
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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-red-500/20", text: "text-red-400" },
  in_progress: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  resolved: { bg: "bg-green-500/20", text: "text-green-400" },
};

export default function IssuesPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = statusFilter !== "all" ? { status: statusFilter } : undefined;
  const { data, isLoading } = useIssues(1, 50, filters);
  const issues = data?.issues || [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Flag className="w-8 h-8 text-red-400" />
            Player Reports
          </h1>
          <p className="text-slate-400 mt-1">
            Issues reported by players, updated in real time
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : issues.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Reporter</TableHead>
                    <TableHead className="text-slate-300">Issue</TableHead>
                    <TableHead className="text-slate-300">Booking</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Reported</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue: any) => {
                    const colors =
                      statusColors[issue.status] || statusColors.open;
                    return (
                      <TableRow key={issue._id} className="border-slate-700">
                        <TableCell className="text-slate-300">
                          <div>
                            <p className="font-medium text-white">
                              {issue.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {issue.user?.phone || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300 max-w-md">
                          <p className="font-medium text-white">
                            {issue.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {issue.description}
                          </p>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {issue.booking?.bookingId || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 capitalize ${colors.bg} ${colors.text}`}
                          >
                            {issue.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                          {issue.createdAt
                            ? new Date(issue.createdAt).toLocaleString()
                            : "N/A"}
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
            <p className="text-slate-400">No reported issues found</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
