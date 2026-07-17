"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentBookings } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function BookingFeed() {
  const { data, isLoading } = useRecentBookings(5);

  return (
    <Card className="p-6 border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Live Booking Feed</h3>
        <Link href="/bookings" className="text-sm text-blue-500 hover:text-blue-400">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800">
              <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
              <Skeleton className="h-3 w-3/4 bg-slate-700" />
            </div>
          ))
        ) : data?.bookings && data.bookings.length > 0 ? (
          data.bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">
                    {booking.userId?.name} @ {booking.pitchId?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(booking.date).toLocaleDateString()} at{" "}
                    {booking.timeSlot}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`border-0 ${
                    booking.status === "confirmed"
                      ? "bg-green-500/20 text-green-400"
                      : booking.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : booking.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No recent bookings</p>
          </div>
        )}
      </div>
    </Card>
  );
}
