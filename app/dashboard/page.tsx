"use client";

import { useDashboardStats } from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BookingFeed } from "@/components/dashboard/booking-feed";
import { BookingTrend } from "@/components/dashboard/booking-trend";
import { TopPitches } from "@/components/dashboard/top-pitches";
import { StatsSkeleton } from "@/components/skeletons/stats-skeleton";
import {
  Calendar,
  DollarSign,
  AlertCircle,
  Users,
  Activity,
  Database,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here's your platform overview.
          </p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Today's Bookings"
              value={stats?.todayBookings || 0}
              icon={<Calendar className="w-6 h-6 text-blue-400" />}
              trend={{ value: 12.5, isPositive: true }}
              variant="blue"
            />
            <StatsCard
              title="Revenue (Est.)"
              value={`${stats?.totalRevenue?.toLocaleString() || 0} IQD`}
              icon={<DollarSign className="w-6 h-6 text-green-400" />}
              variant="green"
            />
            <StatsCard
              title="Active Issues"
              value={stats?.activeIssues || 0}
              icon={<AlertCircle className="w-6 h-6 text-red-400" />}
              variant="red"
            />
            <StatsCard
              title="No-Show Rate"
              value={`${stats?.noShowRate || 0}%`}
              icon={<Users className="w-6 h-6 text-yellow-400" />}
              variant="yellow"
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <BookingTrend />
            <TopPitches />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BookingFeed />

            {/* Admin Controls */}
            <Card className="p-6 border-slate-700 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Admin Controls
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Quick access to frequent administrative tasks.
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                  ✓ Verify New Pitch Owner
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 justify-start bg-transparent text-white"
                >
                  ⚙️ Edit Pricing Rules
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 justify-start bg-transparent text-white"
                >
                  🔔 Send Push Notification
                </Button>
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 border-slate-700 bg-slate-900">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Server Status</span>
                    <span className="text-sm font-medium text-green-400">
                      Online
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Database Load</span>
                    <span className="text-sm font-medium text-slate-300">
                      12%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "12%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">App Version</span>
                    <span className="text-sm font-medium text-slate-300">
                      v2.1.0 (JustPlay)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
