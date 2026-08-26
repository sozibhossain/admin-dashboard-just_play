"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/use-api";
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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollText } from "lucide-react";

const ACTION_OPTIONS = [
  "booking.status_changed",
  "booking.cancelled",
  "booking.confirmed",
  "booking.deleted",
  "user.banned",
  "user.unbanned",
  "user.deleted",
  "owner.verified",
  "owner.rejected",
  "owner.suspended",
  "pitch.created",
  "pitch.updated",
  "pitch.status_changed",
  "pitch.deleted",
  "system.locked",
  "system.unlocked",
  "notification.mass_sent",
  "settings.system_updated",
  "settings.general_updated",
  "settings.business_updated",
  "admin.password_changed",
  "backup.created",
  "backup.restored",
];

const ENTITY_TYPE_OPTIONS = [
  "booking",
  "user",
  "pitch_owner",
  "pitch",
  "system",
  "backup",
];

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [actionFilter, setActionFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");

  const filters = {
    ...(actionFilter !== "all" ? { action: actionFilter } : {}),
    ...(entityTypeFilter !== "all" ? { entityType: entityTypeFilter } : {}),
  };

  const { data, isLoading } = useAuditLogs(page, limit, filters);
  const logs = data?.logs || [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ScrollText className="w-8 h-8 text-blue-400" />
            Audit Log
          </h1>
          <p className="text-slate-400 mt-1">
            Record of all critical admin actions
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">All Actions</SelectItem>
                {ACTION_OPTIONS.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={entityTypeFilter}
              onValueChange={(v) => {
                setEntityTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by entity type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">All Entity Types</SelectItem>
                {ENTITY_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : logs.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Action</TableHead>
                    <TableHead className="text-slate-300">Actor</TableHead>
                    <TableHead className="text-slate-300">Entity</TableHead>
                    <TableHead className="text-slate-300">Message</TableHead>
                    <TableHead className="text-slate-300">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log._id} className="border-slate-700">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-0 bg-blue-500/20 text-blue-400"
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div>
                          <p className="font-medium">
                            {log.actor?.name || log.actor?.username || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.actorRole}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        {log.entityType}
                        <span className="text-slate-500">
                          {" "}
                          ({(log.entityId || "").slice(-6)})
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm max-w-md">
                        {log.message}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-slate-700 bg-slate-900 text-center">
            <p className="text-slate-400">No audit log entries found</p>
          </Card>
        )}

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Page {page}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={logs.length < limit}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
