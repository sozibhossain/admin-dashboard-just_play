import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "blue" | "yellow" | "green" | "red";
}

const variantStyles = {
  blue: "border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent",
  yellow:
    "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent",
  green:
    "border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent",
  red: "border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent",
};

const iconBgStyles = {
  blue: "bg-blue-500/20",
  yellow: "bg-yellow-500/20",
  green: "bg-green-500/20",
  red: "bg-red-500/20",
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  variant = "blue",
}: StatsCardProps) {
  return (
    <Card
      className={`p-6 border-slate-700 bg-slate-900 ${variantStyles[variant]} cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
