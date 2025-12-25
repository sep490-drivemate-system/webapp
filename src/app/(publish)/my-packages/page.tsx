"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  Car,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import packagesData from "@/data/mock-packages.json";

interface Package {
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
  status: string;
  purchaseDate: string;
  expiryDate: string;
  sessions: unknown[];
}

export default function MyPackagesPage() {
  const [packages, setPackages] = useState<Package[]>(packagesData.packages as Package[]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelingPackage, setCancelingPackage] = useState<Package | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    type IconComponent = React.ComponentType<{ className?: string }>;
    const statusMap: Record<string, { 
      label: string; 
      variant: "default" | "secondary" | "outline" | "destructive";
      icon: IconComponent;
    }> = {
      active: { 
        label: "Đang hoạt động", 
        variant: "default",
        icon: CheckCircle
      },
      completed: { 
        label: "Đã hoàn thành", 
        variant: "outline",
        icon: CheckCircle
      },
      expired: { 
        label: "Hết hạn", 
        variant: "destructive",
        icon: XCircle
      },
      cancelled: { 
        label: "Đã hủy", 
        variant: "secondary",
        icon: XCircle
      }
    };
    return statusMap[status] || statusMap.active;
  };

  const handleCancelPackage = (pkg: Package) => {
    setCancelingPackage(pkg);
    setShowCancelDialog(true);
  };

  const confirmCancelPackage = () => {
    if (!cancelingPackage) return;

    // Calculate refund
    const refundAmount = (cancelingPackage.remainingHours / cancelingPackage.totalHours) * cancelingPackage.totalPrice;
    
    console.log('Canceling package:', cancelingPackage.id);
    console.log('Refund amount:', refundAmount);

    // Update package status
    setPackages(prev => prev.map(pkg => 
      pkg.id === cancelingPackage.id 
        ? { ...pkg, status: 'cancelled' } 
        : pkg
    ));

    setShowCancelDialog(false);
    setCancelingPackage(null);
  };

  const activePackages = packages.filter(pkg => pkg.status === "active");
  const completedPackages = packages.filter(pkg => pkg.status === "completed");
  const expiredPackages = packages.filter(pkg => pkg.status === "expired" || pkg.status === "cancelled");

  const PackageCard = ({ pkg }: { pkg: Package }) => {
    const statusInfo = getStatusInfo(pkg.status);
    const StatusIcon = statusInfo.icon;
    const progressPercentage = (pkg.usedHours / pkg.totalHours) * 100;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={pkg.instructorAvatar} />
                <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                <CardDescription>
                  Giáo viên: {pkg.instructorName}
                </CardDescription>
              </div>
            </div>
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiến độ học tập</span>
              <span className="font-medium">
                {pkg.usedHours}/{pkg.totalHours} giờ
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <span className="block font-medium text-green-600">{pkg.usedHours}h</span>
                <span>Đã học</span>
              </div>
              <div>
                <span className="block font-medium text-orange-600">{pkg.pendingHours}h</span>
                <span>Chờ xác nhận</span>
              </div>
              <div>
                <span className="block font-medium text-blue-600">{pkg.remainingHours}h</span>
                <span>Còn lại</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Kỹ năng:</p>
            <div className="flex flex-wrap gap-1">
              {pkg.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          {pkg.hasVehicle && (
            <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
              <Car className="h-4 w-4 text-blue-600" />
              <div>
                <span className="font-medium">{pkg.vehicleType}</span>
                <span className="text-gray-600"> - {pkg.vehiclePlate}</span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Ngày mua</p>
              <p className="font-medium">{formatDate(pkg.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Hết hạn</p>
              <p className="font-medium">{formatDate(pkg.expiryDate)}</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng giá trị:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(pkg.totalPrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">
              {formatPrice(pkg.pricePerHour)}/giờ
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          {pkg.status === "active" && (
            <>
              <Button className="flex-1" asChild>
                <Link href={`/booking/schedule?packageId=${pkg.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt lịch học
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/my-packages/${pkg.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleCancelPackage(pkg)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {pkg.status !== "active" && (
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/my-packages/${pkg.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gói học của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các gói học đã mua
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{activePackages.length}</p>
                <p className="text-sm text-gray-600">Đang học</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {packages.reduce((sum, pkg) => sum + pkg.usedHours, 0)}h
                </p>
                <p className="text-sm text-gray-600">Đã học</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {packages.reduce((sum, pkg) => sum + pkg.remainingHours, 0)}h
                </p>
                <p className="text-sm text-gray-600">Còn lại</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{completedPackages.length}</p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Đang học ({activePackages.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Hoàn thành ({completedPackages.length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Hết hạn ({expiredPackages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activePackages.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có gói học đang hoạt động
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tìm người hướng dẫn và bắt đầu hành trình học lái xe của bạn
                    </p>
                    <Button asChild>
                      <Link href="/instructors">
                        <Plus className="mr-2 h-4 w-4" />
                        Tìm người hướng dẫn
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedPackages.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có gói học hoàn thành</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedPackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-6">
            {expiredPackages.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Không có gói học hết hạn</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredPackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Cancel Package Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Xác nhận hủy gói học
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn hủy gói học này?
              </DialogDescription>
            </DialogHeader>

            {cancelingPackage && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{cancelingPackage.packageName}</h4>
                  <p className="text-sm text-gray-600">
                    Giáo viên: {cancelingPackage.instructorName}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Thông tin hoàn tiền:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng giá trị gói:</span>
                      <span className="font-medium">
                        {formatPrice(cancelingPackage.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số giờ đã sử dụng:</span>
                      <span>{cancelingPackage.usedHours} giờ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số giờ còn lại:</span>
                      <span>{cancelingPackage.remainingHours} giờ</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Số tiền hoàn lại:</span>
                      <span className="font-bold text-green-600">
                        {formatPrice(
                          (cancelingPackage.remainingHours / cancelingPackage.totalHours) * 
                          cancelingPackage.totalPrice
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <p className="font-medium mb-1">⚠️ Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Gói đã mua sau 1 tháng không thể hủy</li>
                    <li>Số tiền hoàn lại sẽ được chuyển vào ví của bạn</li>
                    <li>Hành động này không thể hoàn tác</li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
              >
                Quay lại
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmCancelPackage}
              >
                Xác nhận hủy gói
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

