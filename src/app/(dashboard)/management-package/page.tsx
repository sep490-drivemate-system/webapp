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
import { PackageViewDialog } from "@/components/package/PackageViewDialog";
import PageHeader from "@/components/commons/Header/header";

interface Session {
  sessionId: string;
  date: string;
  duration: number;
  status: "completed" | "pending" | "cancelled";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.status === "active").length;
    const completed = packages.filter((p) => p.status === "completed").length;
    const totalRevenue = packages.reduce((sum, p) => sum + p.totalPrice, 0);
    const totalHours = packages.reduce((sum, p) => sum + p.totalHours, 0);
    const usedHours = packages.reduce((sum, p) => sum + p.usedHours, 0);

    return {
      total,
      active,
      completed,
      totalRevenue,
      totalHours,
      usedHours,
      utilizationRate:
        totalHours > 0 ? ((usedHours / totalHours) * 100).toFixed(1) : 0,
    };
  }, [packages]);

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
        title="Quản lý gói dịch vụ"
        description="Quản lý và theo dõi tất cả các gói dịch vụ trong hệ thống."
        actionButton={{
          label: "Tạo gói học mới",
          onClick: () => setIsCreateDialogOpen(true),
          icon: Plus,
        }}
      />

      {/* Statistics Cards */}
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
                Tổng doanh thu
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {formatCurrency(stats.totalRevenue)} VNĐ
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Từ {stats.total} gói dịch vụ
              </p>
            </div>
            <span className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
              <DollarSign className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium">
                Tổng số giờ thực hiện gói dịch vụ
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {stats.totalHours} giờ
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.usedHours} giờ đã sử dụng
              </p>
            </div>
            <span className="rounded-xl p-3 bg-sky-50 text-sky-600">
              <Clock className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium">
                Tổng tỷ lệ sử dụng gói dịch vụ
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {stats.utilizationRate}%
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.completed} gói hoàn thành
              </p>
            </div>
            <span className="rounded-xl p-3 bg-amber-50 text-amber-600">
              <TrendingUp className="size-5" />
            </span>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-10">
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
              <div className="">
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
              <div className="">
                <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
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
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="default"
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
        </CardContent>
      </Card>

      {/* Packages Table */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="overflow-x-auto rounded-2xl border">
          <Table className="w-full text-left text-sm">
            <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <TableRow>
                <TableHead className="px-4 py-3 font-semibold">STT</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Gói học
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Người hướng dẫn
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Thời lượng
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">Giá</TableHead>
                <TableHead className="px-4 py-3 font-semibold">Xe</TableHead>
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
                        <span className="text-sm">{pkg.instructorName}</span>
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
                            <div className="font-medium">{pkg.vehicleType}</div>
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
      </section>

      {/* Dialogs */}
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
