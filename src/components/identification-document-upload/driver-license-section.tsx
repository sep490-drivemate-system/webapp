"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "@/components/commons/image-upload-field";

export default function DriverLicenseSection() {
  const [formData, setFormData] = useState({
    frontImage: "" as string,
    backImage: "" as string,
    licenseClass: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (field: string, file: File | null) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        [field]: base64,
      }));
    };
    reader.readAsDataURL(file);
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
            onUpload={(file: File | null) =>
              handleImageUpload("frontImage", file)
            }
            preview={formData.frontImage}
          />
          <ImageUploadField
            label="Ảnh Mặt Sau"
            onUpload={(file: File | null) =>
              handleImageUpload("backImage", file)
            }
            preview={formData.backImage}
          />
        </div>

        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Hạng Giấy Phép Lái Xe <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.licenseClass}
            onValueChange={(value) => handleInputChange("licenseClass", value)}
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
      </CardContent>
    </Card>
  );
}
