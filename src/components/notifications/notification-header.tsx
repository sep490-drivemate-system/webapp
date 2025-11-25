"use client";

import { BellRing } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NotificationHeaderProps {
  stats: {
    total: number;
    system: number;
    customer: number;
    unread: number;
  };
}

export default function NotificationHeader({ stats }: NotificationHeaderProps) {
  return (
    <section className="space-y-4">
      <Card className="rounded-2xl border bg-white p-6 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Trung tâm thông báo</CardTitle>
              <CardDescription>
                Quản lý và theo dõi hoạt động mới nhất từ hệ thống và khách hàng
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
}
