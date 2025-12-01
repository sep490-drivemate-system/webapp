"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PackageConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfigFormData {
  skills: string[];
  roadTypes: string[];
  vehicleOptions: string[];
}

export function PackageConfigDialog({
  open,
  onOpenChange,
}: PackageConfigDialogProps) {
  const [formData, setFormData] = useState<ConfigFormData>({
    skills: [""],
    roadTypes: [""],
    vehicleOptions: [""],
  });

  const handleArrayChange = (
    field: keyof Pick<
      ConfigFormData,
      "skills" | "roadTypes" | "vehicleOptions"
    >,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleAddItem = (
    field: keyof Pick<ConfigFormData, "skills" | "roadTypes" | "vehicleOptions">
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveItem = (
    field: keyof Pick<
      ConfigFormData,
      "skills" | "roadTypes" | "vehicleOptions"
    >,
    index: number
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      if (arr.length === 1) {
        arr[0] = "";
      } else {
        arr.splice(index, 1);
      }
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = () => {
    // TODO: Gửi cấu hình lên backend khi có API
    console.log("Package config data:", formData);
    onOpenChange(false);
  };

  const renderArrayField = (
    label: string,
    placeholder: string,
    field: keyof Pick<ConfigFormData, "skills" | "roadTypes" | "vehicleOptions">
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {formData[field].map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveItem(field, index)}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddItem(field)}
        >
          Thêm mục
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cấu hình gói dịch vụ</DialogTitle>
          <DialogDescription>
            Thiết lập các danh sách tùy chọn dùng chung cho các gói dịch vụ
            trong hệ thống.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderArrayField(
            "Kỹ năng học được",
            "Nhập kỹ năng (ví dụ: Lùi xe, Đỗ xe, Qua đường...)",
            "skills"
          )}

          {renderArrayField(
            "Loại đường",
            "Nhập loại đường (ví dụ: Đường cao tốc, Đường đèo, Đường thành phố...)",
            "roadTypes"
          )}

          {renderArrayField(
            "Tùy chọn xe",
            "Nhập tùy chọn xe (ví dụ: Xe của tôi hoặc xe của người lái mới...)",
            "vehicleOptions"
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu cấu hình</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
