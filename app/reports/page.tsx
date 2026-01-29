"use client";

import { useState } from "react";
import { useRevenueReport } from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { data: revenueData, isLoading } = useRevenueReport(
    dateRange.start,
    dateRange.end
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-slate-400 mt-1">View comprehensive platform analytics</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button variant="outline" className="border-slate-700 bg-transparent text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        </Card>

        {/* Revenue Trend */}
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <Card className="p-6 border-slate-700 bg-slate-900">
            <h3 className="text-lg font-semibold text-white mb-6">
              Revenue Trend
            </h3>
            {revenueData?.trend && revenueData.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData.trend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
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
                    formatter={(value) => [
                      `${(value as number).toLocaleString()} IQD`,
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-slate-700 bg-slate-900">
            <p className="text-sm text-slate-400 mb-2">Total Revenue</p>
            <h3 className="text-2xl font-bold text-white">
              {revenueData?.total?.toLocaleString() || 0} IQD
            </h3>
            <p className="text-xs text-green-400 mt-2">
              +{revenueData?.growth || 0}% vs previous period
            </p>
          </Card>

          <Card className="p-6 border-slate-700 bg-slate-900">
            <p className="text-sm text-slate-400 mb-2">Total Bookings</p>
            <h3 className="text-2xl font-bold text-white">
              {revenueData?.bookings || 0}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Average: {revenueData?.avgBookingValue?.toLocaleString() || 0} IQD
            </p>
          </Card>

          <Card className="p-6 border-slate-700 bg-slate-900">
            <p className="text-sm text-slate-400 mb-2">Platform Fee</p>
            <h3 className="text-2xl font-bold text-white">
              {revenueData?.platformFee?.toLocaleString() || 0} IQD
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              {revenueData?.feePercentage || 5}% of total revenue
            </p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
