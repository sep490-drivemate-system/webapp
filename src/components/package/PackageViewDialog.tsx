"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Car, 
  User, 
  Package, 
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { PackageType } from "@/app/(dashboard)/management-package/page";

interface PackageViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: PackageType | null;
}

export function PackageViewDialog({ open, onOpenChange, package: pkg }: PackageViewDialogProps) {
  if (!pkg) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getSessionStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Hoàn thành", variant: "secondary" as const },
      pending: { label: "Chờ xử lý", variant: "default" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const progressPercentage = pkg.totalHours > 0 
    ? ((pkg.usedHours / pkg.totalHours) * 100).toFixed(1) 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi tiết gói học</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Package Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{pkg.packageName}</h3>
              <p className="text-sm text-muted-foreground">Mã gói: {pkg.id}</p>
              {getStatusBadge(pkg.status)}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(pkg.totalPrice)}</div>
              <p className="text-sm text-muted-foreground">{formatCurrency(pkg.pricePerHour)}/giờ</p>
            </div>
          </div>

          <Separator />

          {/* Instructor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={pkg.instructorAvatar} />
              <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Giảng viên</span>
              </div>
              <p className="text-lg font-semibold">{pkg.instructorName}</p>
              <p className="text-sm text-muted-foreground">Mã GV: {pkg.instructorId}</p>
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng giờ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pkg.totalHours}h</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đã sử dụng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{pkg.usedHours}h</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đang chờ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pkg.pendingHours}h</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Còn lại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{pkg.remainingHours}h</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiến độ sử dụng</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Vehicle Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Thông tin xe</span>
            </div>
            {pkg.hasVehicle ? (
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loại xe</p>
                    <p className="font-medium">{pkg.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Biển số</p>
                    <p className="font-medium">{pkg.vehiclePlate}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Không có xe đi kèm</p>
            )}
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Kỹ năng</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pkg.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ngày mua</span>
              </div>
              <p className="text-sm">{formatDate(pkg.purchaseDate)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ngày hết hạn</span>
              </div>
              <p className="text-sm">{formatDate(pkg.expiryDate)}</p>
            </div>
          </div>

          {/* Sessions */}
          {pkg.sessions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Lịch sử buổi học ({pkg.sessions.length})</span>
                </div>
                <div className="space-y-2">
                  {pkg.sessions.map((session) => (
                    <div 
                      key={session.sessionId}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <p className="font-medium">{new Date(session.date).toLocaleDateString('vi-VN')}</p>
                          <p className="text-muted-foreground">{session.sessionId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{session.duration}h</span>
                        {getSessionStatusBadge(session.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
