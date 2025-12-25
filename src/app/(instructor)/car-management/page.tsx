"use client";

import {
  Calendar,
  Car,
  DollarSign,
  Eye,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageHeader from "@/components/commons/Header/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getCarsForInstructor } from "@/features/car/carThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { ICar } from "@/types/car/car.type";
import { CarStatus } from "@/types/constants/enum";

const getVehicleStatusLabel = (status: CarStatus) => {
  switch (status) {
    case CarStatus.Approved:
      return "Đã Duyệt";
    case CarStatus.Pending:
      return "Chờ Duyệt";
    case CarStatus.Rejected:
      return "Bị từ chối";
    default:
      return "Không xác định";
  }
};

interface VehicleCardProps {
  vehicle: ICar;
  onDetail: () => void;
}

function VehicleCard({ vehicle, onDetail }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md pt-0">
      <div className="relative h-48 w-full bg-muted">
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant={
              vehicle.status === CarStatus.Approved
                ? "default"
                : "secondary"
            }
            className={
              vehicle.status === CarStatus.Approved
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }
          >
            {getVehicleStatusLabel(vehicle.status)}
          </Badge>
        </div>
        {vehicle.thumbnailUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.thumbnailUrl}
            alt={`${vehicle.brand} ${vehicle.modelName}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <Car className="size-16 text-gray-400" />
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg">{vehicle.brand}</CardTitle>
          <CardDescription className="text-base font-medium">
            {vehicle.modelName}
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            {vehicle.license_plate}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {vehicle.seatCounts} chỗ
          </span>
          <span className="font-semibold text-primary">
            {vehicle.price.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={onDetail}>
            <Eye className="size-4" />
            Xem
          </Button>
      
        </div>
      </CardContent>
    </Card>
  );
}

interface VehicleModalProps {
  vehicle: ICar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function VehicleModal({ vehicle, open, onOpenChange }: VehicleModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle.brand} {vehicle.modelName}
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin xe</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Biển số xe
              </Label>
              <p className="text-base">{vehicle.license_plate}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Năm sản xuất
              </Label>
              <p className="text-base">{vehicle.seatCounts}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Nhiên liệu
              </Label>
              <p className="text-base">{vehicle.fuel}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Hộp số
              </Label>
              <p className="text-base">{vehicle.vehicleType}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Số chỗ ngồi
              </Label>
              <p className="text-base">{vehicle.seatCounts}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Giá
              </Label>
              <p className="text-base font-semibold text-primary">
                {vehicle.price.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Trạng thái
              </Label>
              <Badge
                variant={
                  vehicle.status === CarStatus.Approved
                    ? "default"
                    : "secondary"
                }
                className={
                  vehicle.status === CarStatus.Approved
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }
              >
                {getVehicleStatusLabel(vehicle.status)}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CarManagementPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<ICar[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<ICar | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const { run: fetchCarsForInstructor, loading: fetchCarsLoading } =
    useThunkAction(getCarsForInstructor);

  const confirmDelete = () => {
    if (deleteVehicleId) {
      setVehicles(vehicles.filter((v) => v.id !== deleteVehicleId));
      setDeleteVehicleId(null);
    }
  };

  const approvedCount = vehicles.filter(
    (v) => v.status === CarStatus.Approved
  ).length;
  const pendingCount = vehicles.filter(
    (v) => v.status === CarStatus.Pending
  ).length;
  const averagePrice =
    vehicles.length > 0
      ? Math.round(vehicles.reduce((s, v) => s + v.price, 0) / vehicles.length)
      : 0;

  useEffect(() => {
    const fetchVehicles = async () => {
      const userId = getUserInfo()?.id;
      if (!userId) {
        console.log("No user ID found");
        return;
      }
      
      fetchCarsForInstructor(
        { id: userId },
        {
          onSuccess: (response) => {
            console.log("Success response:", response);
            console.log("Response.value:", response?.value);
            console.log("Response.success:", response?.success);
            setVehicles(response?.value ?? []);
          },
          onError: (error) => {
            console.error("Error fetching vehicles:", error);
            setVehicles([]);
          },
        }
      );
    };
    fetchVehicles();
  }, [fetchCarsForInstructor]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const userId = getUserInfo()?.id;
        if (userId) {
          fetchCarsForInstructor(
            { id: userId },
            {
              onSuccess: (response) => {
                setVehicles(response?.value ?? []);
              },
              onError: (error) => {
                console.error("Error reloading vehicles:", error);
              },
            }
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchCarsForInstructor]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <PageHeader
          title="Quản Lý Xe Học Lái"
          description="Quản lý danh sách xe và theo dõi tình trạng kiểm duyệt"
          actionButton={{
            label: "Thêm Xe Mới",
            onClick: () => router.push("/car-upload"),
            icon: Plus,
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardDescription className="text-sm font-medium">
                  Tổng Xe
                </CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {vehicles.length}
                </CardTitle>
              </div>
              <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
                <Car className="size-5" />
              </span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardDescription className="text-sm font-medium">
                  Đã Duyệt
                </CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {approvedCount}
                </CardTitle>
              </div>
              <span className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
                <Car className="size-5" />
              </span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardDescription className="text-sm font-medium">
                  Chờ Duyệt
                </CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {pendingCount}
                </CardTitle>
              </div>
              <span className="rounded-xl p-3 bg-amber-50 text-amber-600">
                <Calendar className="size-5" />
              </span>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardDescription className="text-sm font-medium">
                  Giá Trung Bình
                </CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {averagePrice.toLocaleString("vi-VN")} VNĐ
                </CardTitle>
              </div>
              <span className="rounded-xl p-3 bg-sky-50 text-sky-600">
                <DollarSign className="size-5" />
              </span>
            </CardHeader>
          </Card>
        </div>
      </section>

      {fetchCarsLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary mb-4" />
            <CardTitle className="mb-2">Đang tải danh sách xe...</CardTitle>
            <CardDescription className="text-center">
              Vui lòng đợi trong giây lát
            </CardDescription>
          </CardContent>
        </Card>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-muted p-4">
              <MapPin className="size-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">Chưa có xe nào</CardTitle>
            <CardDescription className="mb-6 text-center">
              Thêm xe của bạn để bắt đầu quản lý
            </CardDescription>
            <Button onClick={() => router.push("/car-upload")}>
              <Plus className="size-4" />
              Thêm Xe Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onDetail={() => {
                  setSelectedVehicle(vehicle);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      <VehicleModal
        vehicle={selectedVehicle}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />

      <AlertDialog
        open={deleteVehicleId !== null}
        onOpenChange={(open) => !open && setDeleteVehicleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
