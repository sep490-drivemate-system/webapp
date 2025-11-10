"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PackageType } from "@/app/(dashboard)/management-package/page";

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pkg: PackageType) => void;
  mode: "create" | "edit";
  initialData?: PackageType | null;
}

interface FormData {
  instructorId: string;
  instructorName: string;
  packageName: string;
  totalHours: number;
  pricePerHour: number;
  hasVehicle: boolean;
  vehicleType: string;
  vehiclePlate: string;
  skills: string[];
  expiryDate: string;
}

export function PackageFormDialog({ open, onOpenChange, onSubmit, mode, initialData }: PackageFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    instructorId: "",
    instructorName: "",
    packageName: "",
    totalHours: 0,
    pricePerHour: 0,
    hasVehicle: false,
    vehicleType: "",
    vehiclePlate: "",
    skills: [],
    expiryDate: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        instructorId: initialData.instructorId,
        instructorName: initialData.instructorName,
        packageName: initialData.packageName,
        totalHours: initialData.totalHours,
        pricePerHour: initialData.pricePerHour,
        hasVehicle: initialData.hasVehicle,
        vehicleType: initialData.vehicleType || "",
        vehiclePlate: initialData.vehiclePlate || "",
        skills: initialData.skills,
        expiryDate: initialData.expiryDate.split('T')[0],
      });
    } else {
      resetForm();
    }
  }, [mode, initialData, open]);

  const resetForm = () => {
    setFormData({
      instructorId: "",
      instructorName: "",
      packageName: "",
      totalHours: 0,
      pricePerHour: 0,
      hasVehicle: false,
      vehicleType: "",
      vehiclePlate: "",
      skills: [],
      expiryDate: "",
    });
  };

  const handleSubmit = () => {
    if (mode === "create") {
      const newPackage: PackageType = {
        id: `pkg_${Date.now()}`,
        instructorId: formData.instructorId,
        instructorName: formData.instructorName,
        instructorAvatar: "https://i.pravatar.cc/150?img=1",
        packageName: formData.packageName,
        totalHours: formData.totalHours,
        usedHours: 0,
        pendingHours: 0,
        remainingHours: formData.totalHours,
        pricePerHour: formData.pricePerHour,
        totalPrice: formData.totalHours * formData.pricePerHour,
        hasVehicle: formData.hasVehicle,
        vehicleType: formData.hasVehicle ? formData.vehicleType : null,
        vehiclePlate: formData.hasVehicle ? formData.vehiclePlate : null,
        skills: formData.skills,
        status: "active",
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        sessions: []
      };
      onSubmit(newPackage);
    } else if (mode === "edit" && initialData) {
      const updatedPackage: PackageType = {
        ...initialData,
        packageName: formData.packageName,
        totalHours: formData.totalHours,
        remainingHours: formData.totalHours - initialData.usedHours,
        pricePerHour: formData.pricePerHour,
        totalPrice: formData.totalHours * formData.pricePerHour,
        hasVehicle: formData.hasVehicle,
        vehicleType: formData.hasVehicle ? formData.vehicleType : null,
        vehiclePlate: formData.hasVehicle ? formData.vehiclePlate : null,
        skills: formData.skills,
        expiryDate: new Date(formData.expiryDate).toISOString(),
      };
      onSubmit(updatedPackage);
    }
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo gói học mới" : "Chỉnh sửa gói học"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Điền thông tin để tạo gói học mới" 
              : "Cập nhật thông tin gói học"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructorName">Tên giảng viên</Label>
                <Input
                  id="instructorName"
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  placeholder="Nhập tên giảng viên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorId">Mã giảng viên</Label>
                <Input
                  id="instructorId"
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  placeholder="Nhập mã giảng viên"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="packageName">Tên gói học</Label>
            <Input
              id="packageName"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              placeholder="Ví dụ: Gói luyện tập cơ bản"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalHours">Tổng số giờ</Label>
              <Input
                id="totalHours"
                type="number"
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) || 0 })}
                placeholder="40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Giá mỗi giờ (VNĐ)</Label>
              <Input
                id="pricePerHour"
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })}
                placeholder="200000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Ngày hết hạn</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="hasVehicle"
              checked={formData.hasVehicle}
              onCheckedChange={(checked) => setFormData({ ...formData, hasVehicle: checked })}
            />
            <Label htmlFor="hasVehicle">Có xe đi kèm</Label>
          </div>
          {formData.hasVehicle && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Loại xe</Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  placeholder="Toyota Vios 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">Biển số xe</Label>
                <Input
                  id="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                  placeholder="30A-12345"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="skills">Kỹ năng (phân cách bằng dấu phẩy)</Label>
            <Textarea
              id="skills"
              value={formData.skills.join(", ")}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
              placeholder="Đường đô thị, Quốc lộ, Đường khu dân cư"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {mode === "create" ? "Tạo gói học" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
