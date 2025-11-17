"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "../image-upload-field";

export default function DriverLicenseSection() {
  const [formData, setFormData] = useState({
    frontImage: "" as string,
    backImage: "" as string,
    licenseNumber: "",
    issuedDate: "",
    expiredDate: "",
    licenseClass: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (field: string, base64: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: base64,
    }));
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-foreground">Bằng Lái Xe</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadField
            label="Ảnh Mặt Trước"
            onUpload={(base64: string) =>
              handleImageUpload("frontImage", base64)
            }
            preview={formData.frontImage}
          />
          <ImageUploadField
            label="Ảnh Mặt Sau"
            onUpload={(base64: string) =>
              handleImageUpload("backImage", base64)
            }
            preview={formData.backImage}
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Số Giấy Phép Lái Xe <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nhập số giấy phép"
              value={formData.licenseNumber}
              onChange={(e) =>
                handleInputChange("licenseNumber", e.target.value)
              }
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Hạng Giấy Phép Lái Xe <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.licenseClass}
              onValueChange={(value) =>
                handleInputChange("licenseClass", value)
              }
            >
              <SelectTrigger className="border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Chọn hạng bằng lái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1">Hạng A1</SelectItem>
                <SelectItem value="A2">Hạng A2</SelectItem>
                <SelectItem value="A">Hạng A</SelectItem>
                <SelectItem value="B1">Hạng B1</SelectItem>
                <SelectItem value="B2">Hạng B2</SelectItem>
                <SelectItem value="B">Hạng B</SelectItem>
                <SelectItem value="C1">Hạng C1</SelectItem>
                <SelectItem value="C">Hạng C</SelectItem>
                <SelectItem value="D1">Hạng D1</SelectItem>
                <SelectItem value="D">Hạng D</SelectItem>
                <SelectItem value="E">Hạng E</SelectItem>
                <SelectItem value="F">Hạng F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ngày Cấp <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.issuedDate}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ngày Hết Hạn <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.expiredDate}
              onChange={(e) => handleInputChange("expiredDate", e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
