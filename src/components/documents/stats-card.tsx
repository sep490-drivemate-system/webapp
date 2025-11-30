"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";

interface StatsCardsProps {
  totalUsers?: number;
  verifiedDocs?: number;
  pendingDocs?: number;
  rejectedDocs?: number;
  totalIcon?: LucideIcon;
}

export function StatsCards({
  totalUsers = 0,
  verifiedDocs = 0,
  pendingDocs = 0,
  rejectedDocs = 0,
  totalIcon: TotalIcon = Users,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Tổng hồ sơ",
      value: totalUsers,
      icon: TotalIcon,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "Đã xác nhận",
      value: verifiedDocs,
      icon: CheckCircle,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Chờ Xác Nhận",
      value: pendingDocs,
      icon: Clock,
      accent: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Bị Từ Chối",
      value: rejectedDocs,
      icon: AlertCircle,
      accent: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-card">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardDescription className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  {stat.value}
                </CardTitle>
              </div>
              <span className={`rounded-xl p-3 ${stat.accent}`}>
                <Icon className="size-5" />
              </span>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
