"use client";

import { Card } from "@/components/ui/card";
import { useBookingTrend } from "@/hooks/use-api";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function BookingTrend() {
  const { data, isLoading } = useBookingTrend(7);

  if (isLoading) return <ChartSkeleton />;

  return (
    <Card className="p-6 border-slate-700 bg-slate-900">
      <h3 className="text-lg font-semibold text-white mb-6">
        Weekly Booking Trend
      </h3>

      {data?.trend && data.trend.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.trend}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#f1f5f9" }}
              formatter={(value) => [value, "Bookings"]}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">No data available</p>
        </div>
      )}
    </Card>
  );
}
