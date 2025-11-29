"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationCard from "@/components/notifications/notification-card";
import NotificationTabs from "@/components/notifications/notification-tabs";
import PageHeader from "@/components/commons/Header/header";

type NotificationType =
  | "message"
  | "schedule_change"
  | "schedule_cancel"
  | "wallet_change"
  | "payment_success"
  | "payment_failed";

type NotificationCategory = "all" | "system" | "customer" | "instructor";

interface Notification {
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

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Tin nhắn mới từ khách hàng",
      message: "Bạn có tin nhắn mới từ Nguyễn Văn A về buổi tập lái.",
      time: "5 phút trước",
      type: "message",
      category: "customer",
      read: false,
    },
    {
      id: 2,
      title: "Khách hàng thay đổi lịch tập lái",
      message:
        "Khách hàng Nguyễn Văn B đã thay đổi buổi tập lái ngày 15/12/2024 từ 9:00 sang 10:00.",
      time: "1 giờ trước",
      type: "schedule_change",
      category: "customer",
      read: false,
    },
    {
      id: 3,
      title: "Khách hàng hủy buổi tập lái",
      message:
        "Khách hàng Trần Thị C đã hủy buổi tập lái ngày 20/12/2024. Vui lòng kiểm tra và xác nhận.",
      time: "2 giờ trước",
      type: "schedule_cancel",
      category: "customer",
      read: false,
    },
    {
      id: 4,
      title: "Thay đổi số dư ví",
      message:
        "Số dư ví của bạn đã thay đổi: +500,000 VNĐ từ giao dịch nạp tiền.",
      time: "3 giờ trước",
      type: "wallet_change",
      category: "system",
      read: true,
    },
    {
      id: 5,
      title: "Thanh toán thành công",
      message: "Bạn đã thanh toán thành công 1,000,000 VNĐ cho gói học lái xe.",
      time: "1 ngày trước",
      type: "payment_success",
      category: "system",
      read: true,
    },
    {
      id: 6,
      title: "Thanh toán thất bại",
      message:
        "Giao dịch thanh toán 500,000 VNĐ đã thất bại. Vui lòng thử lại.",
      time: "2 ngày trước",
      type: "payment_failed",
      category: "system",
      read: true,
    },
    {
      id: 7,
      title: "Đổi lịch tập lái thành công",
      message:
        "Bạn đã đổi lịch tập lái thành công từ ngày 10/12/2024 sang 12/12/2024.",
      time: "3 ngày trước",
      type: "schedule_change",
      category: "system",
      read: true,
    },
    {
      id: 8,
      title: "Tin nhắn mới từ khách hàng",
      message: "Bạn có tin nhắn mới từ Lê Văn D về lịch học.",
      time: "3 ngày trước",
      type: "message",
      category: "customer",
      read: true,
    },
  ]);

  const stats = useMemo(() => {
    const total = notifications.length;
    const system = notifications.filter((n) => n.category === "system").length;
    const customer = notifications.filter(
      (n) => n.category === "customer" || n.category === "instructor"
    ).length;
    const unread = notifications.filter((n) => !n.read).length;
    return { total, system, customer, unread };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    if (activeFilter === "system") {
      filtered = notifications.filter((n) => n.category === "system");
    } else if (activeFilter === "customer") {
      filtered = notifications.filter(
        (n) => n.category === "customer" || n.category === "instructor"
      );
    }
    return filtered;
  }, [notifications, activeFilter]);

  // Pagination calculations
  const totalPages = useMemo(
    () => Math.ceil(filteredNotifications.length / itemsPerPage),
    [filteredNotifications.length, itemsPerPage]
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const endIndex = useMemo(
    () => startIndex + itemsPerPage,
    [startIndex, itemsPerPage]
  );

  const paginatedNotifications = useMemo(
    () => filteredNotifications.slice(startIndex, endIndex),
    [filteredNotifications, startIndex, endIndex]
  );

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Trung tâm thông báo"
          description="Quản lý và theo dõi hoạt động mới nhất từ hệ thống và khách hàng"
          className="space-y-4"
        />
      </div>

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-end">
          <div className="flex w-full max-w-sm flex-col items-stretch space-y-3">
            <NotificationTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              stats={stats}
            />
            {stats.unread > 0 && (
              <div className="flex justify-end">
                <Button
                  onClick={markAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              </div>
            )}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16">
            <div className="mb-4 rounded-full bg-slate-10p-4">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Chưa có thông báo
            </h3>
            <p className="text-center text-sm text-slate-600">
              Bạn sẽ thấy thông báo ở đây khi có hoạt động trên tài khoản của
              bạn.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground sm:text-sm">
                  Hiển thị {paginatedNotifications.length}/
                  {filteredNotifications.length} thông báo.
                </div>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Số hàng
                    </span>
                    <Select
                      value={`${itemsPerPage}`}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-20 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[5, 10, 20, 30, 50].map((size) => (
                          <SelectItem key={size} value={`${size}`}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="hidden sm:flex"
                      onClick={goToFirstPage}
                      disabled={!canGoPrevious}
                    >
                      <ChevronsLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousPage}
                      disabled={!canGoPrevious}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Trang {currentPage}/{totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextPage}
                      disabled={!canGoNext}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hidden sm:flex"
                      onClick={goToLastPage}
                      disabled={!canGoNext}
                    >
                      <ChevronsRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
