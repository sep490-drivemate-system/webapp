"use client";

import { ReactNode } from "react";
import {
  Bell,
  MessageCircle,
  Wallet,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type NotificationCategory = "all" | "system" | "customer" | "instructor";

export type NotificationType =
  | "message"
  | "schedule_change"
  | "schedule_cancel"
  | "wallet_change"
  | "payment_success"
  | "payment_failed";

export interface NotificationCardData {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  category: NotificationCategory;
  read: boolean;
  route?: string;
  data?: Record<string, unknown>;
}

interface NotificationCardProps {
  notification: NotificationCardData;
  onMarkAsRead?: () => void;
}

const typeIconMap: Record<NotificationType, ReactNode> = {
  message: <MessageCircle className="h-4 w-4" />,
  schedule_change: <Bell className="h-4 w-4" />,
  schedule_cancel: <XCircle className="h-4 w-4" />,
  wallet_change: <Wallet className="h-4 w-4" />,
  payment_success: <CheckCircle className="h-4 w-4" />,
  payment_failed: <XCircle className="h-4 w-4" />,
};

export default function NotificationCard({
  notification,
  onMarkAsRead,
}: NotificationCardProps) {
  const Icon = typeIconMap[notification.type] ?? <Bell className="h-4 w-4" />;

  return (
    <Card
      className={`border ${
        notification.read ? "bg-white" : "border-emerald-200 bg-emerald-50/40"
      }`}
    >
      <CardContent className="flex gap-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            notification.read
              ? "bg-slate-100 text-slate-500"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {Icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              {notification.title}
            </h3>
            <span className="text-xs text-slate-500">{notification.time}</span>
          </div>
          <p className="text-sm text-slate-600">{notification.message}</p>
          {!notification.read && (
            <Button
              variant="link"
              className="px-0 text-xs"
              onClick={onMarkAsRead}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
