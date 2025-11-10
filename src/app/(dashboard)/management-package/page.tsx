"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  MoreHorizontal
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
  const [packages, setPackages] = useState<PackageType[]>(packagesData.packages as PackageType[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter(p => p.status === "active").length;
    const completed = packages.filter(p => p.status === "completed").length;
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
      utilizationRate: totalHours > 0 ? ((usedHours / totalHours) * 100).toFixed(1) : 0
    };
  }, [packages]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = 
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;
      const matchesVehicle = 
        vehicleFilter === "all" || 
        (vehicleFilter === "with" && pkg.hasVehicle) ||
        (vehicleFilter === "without" && !pkg.hasVehicle);

      return matchesSearch && matchesStatus && matchesVehicle;
    });
  }, [packages, searchQuery, statusFilter, vehicleFilter]);

  // Handle create package
  const handleCreatePackage = (newPackage: PackageType) => {
    setPackages([...packages, newPackage]);
    setIsCreateDialogOpen(false);
  };

  // Handle edit package
  const handleEditPackage = (updatedPackage: PackageType) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === updatedPackage.id ? updatedPackage : pkg
    );
    setPackages(updatedPackages);
    setIsEditDialogOpen(false);
    setSelectedPackage(null);
  };

  // Handle delete package
  const handleDeletePackage = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói học này?")) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Đang hoạt động", variant: "default" as const, icon: CheckCircle },
      completed: { label: "Hoàn thành", variant: "secondary" as const, icon: CheckCircle },
      expired: { label: "Hết hạn", variant: "destructive" as const, icon: XCircle },
      cancelled: { label: "Đã hủy", variant: "outline" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý gói thuê</h1>

        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo gói học mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng gói học</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Từ {stats.total} gói học
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giờ học</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {stats.usedHours}h đã sử dụng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ sử dụng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} gói hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, giảng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Xe đi kèm</Label>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="with">Có xe</SelectItem>
                  <SelectItem value="without">Không có xe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setVehicleFilter("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách gói học ({filteredPackages.length})</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả các gói học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gói học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Giờ học</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="font-medium">{pkg.packageName}</div>
                    <div className="text-sm text-muted-foreground">{pkg.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={pkg.instructorAvatar} />
                        <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{pkg.instructorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{pkg.usedHours}/{pkg.totalHours}h</div>
                      <div className="text-muted-foreground">
                        Còn {pkg.remainingHours}h
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{formatCurrency(pkg.totalPrice)}</div>
                      <div className="text-muted-foreground">
                        {formatCurrency(pkg.pricePerHour)}/h
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {pkg.hasVehicle ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Car className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">{pkg.vehicleType}</div>
                          <div className="text-muted-foreground">{pkg.vehiclePlate}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Không có</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(pkg.expiryDate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedPackage(pkg);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedPackage(pkg);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Không tìm thấy gói học</h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc tạo gói học mới
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
