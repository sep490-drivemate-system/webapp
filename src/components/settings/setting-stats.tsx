"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { type Setting, getSettingCategoryFromName } from "@/lib/settings";
import { FileText, Package, XCircle, CalendarClock } from "lucide-react";

interface SettingStatsProps {
  settings: Setting[];
}

export default function SettingStats({ settings }: SettingStatsProps) {
  const total = settings.length;
  const cancelPackage = settings.filter(
    (s) => getSettingCategoryFromName(s.name) === "cancel-service-package"
  ).length;
  const cancelSession = settings.filter(
    (s) => getSettingCategoryFromName(s.name) === "cancel-driving-session"
  ).length;
  const rescheduleSession = settings.filter(
    (s) => getSettingCategoryFromName(s.name) === "reschedule-driving-session"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Tổng số chính sách
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">{total}</CardTitle>
          </div>
          <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <FileText className="size-5" />
          </span>
        </CardHeader>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Hủy gói dịch vụ
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {cancelPackage}
            </CardTitle>
          </div>
          <span className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Package className="size-5" />
          </span>
        </CardHeader>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Hủy buổi huấn luyện
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {cancelSession}
            </CardTitle>
          </div>
          <span className="rounded-xl bg-red-50 p-3 text-red-600">
            <XCircle className="size-5" />
          </span>
        </CardHeader>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Đổi lịch buổi huấn luyện
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {rescheduleSession}
            </CardTitle>
          </div>
          <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <CalendarClock className="size-5" />
          </span>
        </CardHeader>
      </Card>
    </div>
  );
}
