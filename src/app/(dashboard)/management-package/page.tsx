"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Car,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Settings,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import packagesData from "@/data/mock-packages.json";
import { PackageFormDialog } from "@/components/package/PackageFormDialog";
import { PackageConfigDialog } from "@/components/package/PackageConfigDialog";
import { PackageViewDialog } from "@/components/package/PackageViewDialog";
import PageHeader from "@/components/commons/Header/header";
import { Cancel } from "@radix-ui/react-alert-dialog";
import {
  IconCancel,
  IconDisabled,
  IconDisabledOff,
  IconReload,
  IconStatusChange,
} from "@tabler/icons-react";

interface Session {
  sessionId: string;
  date: string;
  duration: number;
  status: "completed" | "pending" | "cancelled" | "rescheduled";
}

export interface PackageType {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  packageName: string;
  totalHours: number;
  usedHours: number;
  pendingHours: number;
  remainingHours: number;
  pricePerHour: number;
  totalPrice: number;
  hasVehicle: boolean;
  vehicleType: string | null;
  vehiclePlate: string | null;
  skills: string[];
  status: "active" | "completed" | "expired" | "cancelled";
  purchaseDate: string;
  expiryDate: string;
  sessions: Session[];
}

export default function ManagementPackagePage() {
  const [packages, setPackages] = useState<PackageType[]>(
    packagesData.packages as PackageType[]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Time filter state (year/month/week) for statistics cards
  const now = new Date();
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const getCurrentWeekOfMonth = (year: number, month: number, day?: number) => {
    const targetDate = day ? new Date(year, month - 1, day) : new Date();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay();
    const currentDay = targetDate.getDate();

    return Math.ceil((currentDay + firstWeekday) / 7);
  };

  const [selectedWeek, setSelectedWeek] = useState(
    getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const getAvailableMonths = (year: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => i + 1);
    }
    if (year < currentYear) {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
    return [];
  };

  const getAvailableWeeks = (year: number, month: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay();

    const totalWeeks = Math.ceil((lastDayOfMonth + firstWeekday) / 7);

    if (year === currentYear && month === currentMonth) {
      const currentWeek = getCurrentWeekOfMonth(
        year,
        month,
        currentDate.getDate()
      );
      return Array.from({ length: currentWeek }, (_, i) => i + 1);
    }
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return Array.from({ length: totalWeeks }, (_, i) => i + 1);
    }
    return [];
  };

  const getTimeRangeDescription = () => {
    switch (viewMode) {
      case "week":
        return `Tuần ${selectedWeek}, Tháng ${selectedMonth}/${selectedYear}`;
      case "month":
        return `Tháng ${selectedMonth}/${selectedYear}`;
      case "year":
        return `Năm ${selectedYear}`;
      default:
        return "Theo tháng";
    }
  };

  // Packages filtered by time range for statistics
  const packagesForStats = useMemo(() => {
    return packages.filter((pkg) => {
      const date = new Date(pkg.purchaseDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = getCurrentWeekOfMonth(year, month, date.getDate());

      if (viewMode === "year") {
        return year === selectedYear;
      }
      if (viewMode === "month") {
        return year === selectedYear && month === selectedMonth;
      }
      return (
        year === selectedYear &&
        month === selectedMonth &&
        week === selectedWeek
      );
    });
  }, [packages, viewMode, selectedYear, selectedMonth, selectedWeek]);

  // Session statistics (completed / cancelled / rescheduled) filtered by time range
  const sessionStats = useMemo(() => {
    let completed = 0;
    let cancelled = 0;
    let rescheduled = 0;

    packages.forEach((pkg) => {
      pkg.sessions.forEach((session) => {
        const date = new Date(session.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const week = getCurrentWeekOfMonth(year, month, date.getDate());

        let inRange = false;
        if (viewMode === "year") {
          inRange = year === selectedYear;
        } else if (viewMode === "month") {
          inRange = year === selectedYear && month === selectedMonth;
        } else {
          inRange =
            year === selectedYear &&
            month === selectedMonth &&
            week === selectedWeek;
        }

        if (!inRange) return;

        if (session.status === "completed") completed += 1;
        if (session.status === "cancelled") cancelled += 1;
        if (session.status === "rescheduled") rescheduled += 1;
      });
    });

    return { completed, cancelled, rescheduled };
  }, [packages, viewMode, selectedYear, selectedMonth, selectedWeek]);

  // Statistics
  const stats = useMemo(() => {
    const total = packagesForStats.length;
    const active = packagesForStats.filter((p) => p.status === "active").length;
    const completedPackages = packagesForStats.filter(
      (p) => p.status === "completed"
    ).length;
    const totalRevenue = packagesForStats.reduce(
      (sum, p) => sum + p.totalPrice,
      0
    );
    const totalHours = packagesForStats.reduce(
      (sum, p) => sum + p.totalHours,
      0
    );
    const usedHours = packagesForStats.reduce((sum, p) => sum + p.usedHours, 0);

    return {
      total,
      active,
      completed: completedPackages,
      totalRevenue,
      totalHours,
      usedHours,
      utilizationRate:
        totalHours > 0 ? ((usedHours / totalHours) * 100).toFixed(1) : 0,
      completedSessions: sessionStats.completed,
      cancelledSessions: sessionStats.cancelled,
      rescheduledSessions: sessionStats.rescheduled,
    };
  }, [packagesForStats, sessionStats]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || pkg.status === statusFilter;
      const matchesVehicle =
        vehicleFilter === "all" ||
        (vehicleFilter === "with" && pkg.hasVehicle) ||
        (vehicleFilter === "without" && !pkg.hasVehicle);

      return matchesSearch && matchesStatus && matchesVehicle;
    });
  }, [packages, searchQuery, statusFilter, vehicleFilter]);

  // Pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, vehicleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPackages.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPackages = filteredPackages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle create package
  const handleCreatePackage = (newPackage: PackageType) => {
    setPackages([...packages, newPackage]);
    setIsCreateDialogOpen(false);
  };

  // Handle edit package
  const handleEditPackage = (updatedPackage: PackageType) => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === updatedPackage.id ? updatedPackage : pkg
    );
    setPackages(updatedPackages);
    setIsEditDialogOpen(false);
    setSelectedPackage(null);
  };

  // Handle delete package
  const handleDeletePackage = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói học này?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Đang hoạt động",
        variant: "default" as const,
        icon: PlayCircle,
        className:
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
      },
      completed: {
        label: "Hoàn thành",
        variant: "secondary" as const,
        icon: CheckCircle,
        className: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      },
      expired: {
        label: "Hết hạn",
        variant: "destructive" as const,
        icon: AlertCircle,
        className:
          "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
      },
      cancelled: {
        label: "Đã hủy",
        variant: "outline" as const,
        icon: XCircle,
        className: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1 border ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Quản Lý Gói Dịch Vụ"
        description="Quản lý và theo dõi tất cả các gói dịch vụ trong hệ thống."
        actionButton={{
          label: "Cấu hình gói dịch vụ",
          onClick: () => setIsConfigDialogOpen(true),
          icon: Settings,
        }}
      />

      {/* Statistics Cards + Time Filter */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Thống kê gói dịch vụ & buổi huấn luyện</CardTitle>
            <CardDescription>
              Dữ liệu được lọc theo khoảng thời gian:{" "}
              {getTimeRangeDescription()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Đang xem theo:{" "}
              <span className="font-medium text-foreground">
                {getTimeRangeDescription()}
              </span>
            </span>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Bộ lọc {isFilterOpen ? "(Mở)" : "(Đóng)"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isFilterOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4"
                  style={{ backgroundColor: "white", border: "1px solid #ccc" }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-black mb-2 block">
                        Xem theo:
                      </label>
                      <div className="flex gap-2">
                        {(["year", "month", "week"] as const).map((mode) => (
                          <Button
                            key={mode}
                            variant={viewMode === mode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode(mode)}
                            className="flex-1"
                          >
                            {mode === "year"
                              ? "Năm"
                              : mode === "month"
                              ? "Tháng"
                              : "Tuần"}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Năm:
                        </label>
                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            setSelectedYear(newYear);

                            if (viewMode !== "year") {
                              const availableMonths =
                                getAvailableMonths(newYear);
                              const latestMonth =
                                availableMonths[availableMonths.length - 1] ||
                                1;
                              setSelectedMonth(latestMonth);

                              if (viewMode === "week") {
                                const availableWeeks = getAvailableWeeks(
                                  newYear,
                                  latestMonth
                                );
                                const latestWeek =
                                  availableWeeks[availableWeeks.length - 1] ||
                                  1;
                                setSelectedWeek(latestWeek);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                        >
                          {getAvailableYears().map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(viewMode === "month" || viewMode === "week") && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Tháng:
                          </label>
                          <select
                            value={selectedMonth}
                            onChange={(e) => {
                              const newMonth = Number(e.target.value);
                              setSelectedMonth(newMonth);

                              if (viewMode === "week") {
                                const availableWeeks = getAvailableWeeks(
                                  selectedYear,
                                  newMonth
                                );
                                const latestWeek =
                                  availableWeeks[availableWeeks.length - 1] ||
                                  1;
                                setSelectedWeek(latestWeek);
                              }
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableMonths(selectedYear).map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {viewMode === "week" && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Tuần:
                          </label>
                          <select
                            value={selectedWeek}
                            onChange={(e) =>
                              setSelectedWeek(Number(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableWeeks(selectedYear, selectedMonth).map(
                              (week) => (
                                <option key={week} value={week}>
                                  {week}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1"
                      >
                        Đóng
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isFilterOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium">
                    Tổng số gói dịch vụ
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {stats.total}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {stats.active} đang hoạt động
                  </p>
                </div>
                <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
                  <Package className="size-5" />
                </span>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium">
                    Tổng Buổi Huấn Luyện Đã Hoàn Thành
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {stats.completedSessions}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Từ {stats.total} gói dịch vụ
                  </p>
                </div>
                <span className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
                  <CheckCircle className="size-5" />
                </span>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium">
                    Tổng Buổi Huấn Luyện Bị Hủy
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {stats.cancelledSessions}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Từ {stats.total} gói dịch vụ
                  </p>
                </div>
                <span className="rounded-xl p-3 bg-red-50 text-red-600">
                  <IconCancel className="size-5" />
                </span>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium">
                    Tổng Buổi Huấn Luyện Bị Đổi Lịch
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {stats.rescheduledSessions}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Từ {stats.total} gói dịch vụ
                  </p>
                </div>
                <span className="rounded-xl p-3 bg-amber-50 text-amber-600">
                  <IconReload className="size-5" />
                </span>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filters + Packages Table in one Card */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, người hướng dẫn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="expired">Hết hạn</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={vehicleFilter}
                    onValueChange={setVehicleFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả tùy chọn xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả tùy chọn xe</SelectItem>
                      <SelectItem value="with">Có xe</SelectItem>
                      <SelectItem value="without">Không có xe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setVehicleFilter("all");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <div className="rounded-2xl border">
            <div className="overflow-x-auto rounded-2xl">
              <Table className="w-full text-left text-sm">
                <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4 py-3 font-semibold">
                      STT
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Gói học
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Người hướng dẫn
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Thời lượng
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Giá
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Xe
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Trạng thái
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold">
                      Ngày hết hạn
                    </TableHead>
                    <TableHead className="px-4 py-3 font-semibold text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        Không tìm thấy gói học phù hợp.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPackages.map((pkg, index) => (
                      <TableRow
                        key={pkg.id}
                        className="border-b last:border-b-0 hover:bg-muted/50"
                      >
                        <TableCell className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-medium">{pkg.packageName}</div>
                          <div className="text-sm text-muted-foreground">
                            {pkg.id}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={pkg.instructorAvatar} />
                              <AvatarFallback>
                                {pkg.instructorName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {pkg.instructorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium">
                              {pkg.usedHours}/{pkg.totalHours}h
                            </div>
                            <div className="text-muted-foreground">
                              Còn {pkg.remainingHours}h
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatCurrency(pkg.totalPrice)} VNĐ
                            </div>
                            <div className="text-muted-foreground">
                              {formatCurrency(pkg.pricePerHour)} VNĐ/h
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {pkg.hasVehicle ? (
                            <div className="flex items-center gap-1 text-sm">
                              <div>
                                <div className="font-medium">
                                  {pkg.vehicleType}
                                </div>
                                <div className="text-muted-foreground">
                                  {pkg.vehiclePlate}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Không có
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {getStatusBadge(pkg.status)}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="text-sm">
                            {formatDate(pkg.expiryDate)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  aria-label="Thao tác"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPackage(pkg);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 size-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPackage(pkg);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 size-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground sm:text-sm">
              Hiển thị {paginatedPackages.length}/{filteredPackages.length} gói
              học.
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Số hàng</span>
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
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
                  Trang {currentPage}/{totalPages}
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
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PackageConfigDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
      />

      <PackageFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePackage}
        mode="create"
      />

      <PackageFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditPackage}
        mode="edit"
        initialData={selectedPackage}
      />

      <PackageViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        package={selectedPackage}
      />
    </div>
  );
}
