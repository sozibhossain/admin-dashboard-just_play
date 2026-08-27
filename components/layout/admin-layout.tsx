"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  Users,
  Building2,
  MapPin,
  Settings,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Bell,
  ScrollText,
  Flag,
  Globe,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdminSocket } from "@/hooks/use-admin-socket";
import { disconnectSocket } from "@/lib/socket";

const navigation = [
  {
    category: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "Bookings", href: "/bookings", icon: Calendar },
    ],
  },
  {
    category: "MANAGEMENT",
    items: [
      { name: "Users (Players)", href: "/users", icon: Users },
      { name: "Pitch Owners", href: "/pitch-owners", icon: Building2 },
      { name: "Pitches", href: "/pitches", icon: MapPin },
      { name: "Events", href: "/events", icon: CalendarDays },
      { name: "Countries", href: "/countries", icon: Globe },
      { name: "Sports", href: "/sports", icon: Trophy },
    ],
  },
  {
    category: "ADMIN",
    items: [
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Player Reports", href: "/issues", icon: Flag },
      { name: "Audit Log", href: "/audit-log", icon: ScrollText },
      { name: "Emergency", href: "/emergency", icon: AlertTriangle },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useAdminSocket();

  const handleLogout = async () => {
    try {
      disconnectSocket();
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  return (
    <div className="dark flex h-svh min-h-svh bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(18rem,calc(100vw-3rem))] border-r border-slate-800 bg-slate-900 shadow-2xl shadow-black/40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:w-64 lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5 lg:px-6">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-950/40">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-white">JustPlay</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            {navigation.map((section) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-950/30"
                              : "text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex min-h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{session?.user?.name || "Admin"}</p>
                <p className="text-xs text-slate-400">{session?.user?.role || "Super Admin"}</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-lg shadow-blue-950/40">
                {(session?.user?.name || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
