"use client";

import { Card } from "@/components/ui/card";
import { useTopPitches } from "@/hooks/use-api";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export function TopPitches() {
  const { data, isLoading } = useTopPitches(5);

  return (
    <Card className="p-6 border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Top Performing Pitches</h3>
        <Link href="/pitches" className="text-sm text-blue-500 hover:text-blue-400">
          View All
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton columns={4} rows={5} />
      ) : data?.pitches && data.pitches.length > 0 ? (
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800 border-slate-700">
                <TableHead className="text-slate-300">Pitch Name</TableHead>
                <TableHead className="text-slate-300">Bookings</TableHead>
                <TableHead className="text-slate-300">Revenue</TableHead>
                <TableHead className="text-right text-slate-300">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pitches.map((pitch: any, idx: number) => (
                <TableRow key={pitch._id} className="border-slate-700">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold">{idx + 1}</span>
                      {pitch.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {pitch.bookings || 0}
                  </TableCell>
                  <TableCell className="text-slate-300 font-medium">
                    {pitch.revenue?.toLocaleString() || 0} IQD
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-500 font-medium">
                      {pitch.rating?.toFixed(1) || "N/A"} ★
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-slate-400">No data available</p>
        </div>
      )}
    </Card>
  );
}
