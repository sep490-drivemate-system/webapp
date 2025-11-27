"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MapPin,
  Trash2,
  Eye,
  Car,
  Calendar,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";

enum VehicleStatus {
  Pending = 1,
  Approved,
}

const getVehicleStatusLabel = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.Approved:
      return "Đã Duyệt";
    case VehicleStatus.Pending:
      return "Chờ Duyệt";
    default:
      return "Không xác định";
  }
};

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  seats: number;
  price: number;
  image: string;
  status: VehicleStatus;
  approvedDate: string | null;
  year: number;
  fuelType: string;
  transmission: string;
  features: string[];
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Vios",
    licensePlate: "51A-123.45",
    seats: 5,
    price: 150000,
    image: "https://img1.oto.com.vn/2022/01/04/1OANJGk2/camry-4e90.jpg",
    status: VehicleStatus.Approved,
    approvedDate: "2025-01-15",
    year: 2023,
    fuelType: "Petrol",
    transmission: "Manual",
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags"],
  },
  {
    id: 2,
    brand: "Honda",
    model: "Accord",
    licensePlate: "51B-456.78",
    seats: 5,
    price: 250000,
    image: "https://img1.oto.com.vn/2022/01/04/1OANJGk2/camry-4e90.jpg",
    status: VehicleStatus.Approved,
    approvedDate: "2025-01-10",
    year: 2024,
    fuelType: "Petrol",
    transmission: "Automatic",
    features: [
      "Air Conditioning",
      "Power Steering",
      "ABS",
      "Airbags",
      "Cruise Control",
    ],
  },
  {
    id: 3,
    brand: "BMW",
    model: "3 Series",
    licensePlate: "51C-789.01",
    seats: 5,
    price: 450000,
    image: "https://img1.oto.com.vn/2022/01/04/1OANJGk2/camry-4e90.jpg",
    status: VehicleStatus.Pending,
    approvedDate: null,
    year: 2024,
    fuelType: "Diesel",
    transmission: "Automatic",
    features: [
      "Air Conditioning",
      "Power Steering",
      "ABS",
      "Airbags",
      "Sunroof",
      "Navigation",
    ],
  },
  {
    id: 4,
    brand: "Kia",
    model: "Cerato",
    licensePlate: "51D-234.56",
    seats: 5,
    price: 180000,
    image: "https://img1.oto.com.vn/2022/01/04/1OANJGk2/camry-4e90.jpg",
    status: VehicleStatus.Approved,
    approvedDate: "2025-01-20",
    year: 2023,
    fuelType: "Petrol",
    transmission: "Manual",
    features: ["Air Conditioning", "Power Steering", "ABS", "Airbags"],
  },
];

interface VehicleCardProps {
  vehicle: Vehicle;
  onDetail: () => void;
  onDelete: () => void;
}

function VehicleCard({ vehicle, onDetail, onDelete }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md pt-0">
      <div className="relative h-48 w-full bg-muted">
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant={
              vehicle.status === VehicleStatus.Approved
                ? "default"
                : "secondary"
            }
            className={
              vehicle.status === VehicleStatus.Approved
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-amber-500 text-white hover:bg-amber-600"
            }
          >
            {getVehicleStatusLabel(vehicle.status)}
          </Badge>
        </div>
        {vehicle.image && !imageError ? (
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
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
            {vehicle.model}
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            {vehicle.licensePlate}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {vehicle.seats} chỗ • {vehicle.year}
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
          <Button
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface VehicleModalProps {
  vehicle: Vehicle | null;
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
            {vehicle.brand} {vehicle.model}
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin xe</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Biển số xe
              </Label>
              <p className="text-base">{vehicle.licensePlate}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Năm sản xuất
              </Label>
              <p className="text-base">{vehicle.year}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Nhiên liệu
              </Label>
              <p className="text-base">{vehicle.fuelType}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Hộp số
              </Label>
              <p className="text-base">{vehicle.transmission}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Số chỗ ngồi
              </Label>
              <p className="text-base">{vehicle.seats}</p>
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
                  vehicle.status === VehicleStatus.Approved
                    ? "default"
                    : "secondary"
                }
                className={
                  vehicle.status === VehicleStatus.Approved
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }
              >
                {getVehicleStatusLabel(vehicle.status)}
              </Badge>
            </div>
            {vehicle.approvedDate && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Ngày duyệt
                </Label>
                <p className="text-base">{vehicle.approvedDate}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground">
              Tính năng
            </Label>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CarManagementPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeleteVehicleId(id);
  };

  const confirmDelete = () => {
    if (deleteVehicleId) {
      setVehicles(vehicles.filter((v) => v.id !== deleteVehicleId));
      setDeleteVehicleId(null);
    }
  };

  const approvedCount = vehicles.filter(
    (v) => v.status === VehicleStatus.Approved
  ).length;
  const pendingCount = vehicles.filter(
    (v) => v.status === VehicleStatus.Pending
  ).length;
  const averagePrice =
    vehicles.length > 0
      ? Math.round(vehicles.reduce((s, v) => s + v.price, 0) / vehicles.length)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-4">
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">Quản Lý Xe Học Lái</CardTitle>
                <CardDescription>
                  Quản lý danh sách xe và theo dõi tình trạng kiểm duyệt
                </CardDescription>
              </div>
              <button
                onClick={() => router.push("/car-upload")}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                <Plus size={18} />
                <span>Thêm Xe Mới</span>
              </button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Xe</CardTitle>
              <Car className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">
                Đã Duyệt
              </CardTitle>
              <Car className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {approvedCount}
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">
                Chờ Duyệt
              </CardTitle>
              <Calendar className="size-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">
                {pendingCount}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Giá Trung Bình
              </CardTitle>
              <DollarSign className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {averagePrice.toLocaleString("vi-VN")} VNĐ
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
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
                onDelete={() => handleDelete(vehicle.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
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
