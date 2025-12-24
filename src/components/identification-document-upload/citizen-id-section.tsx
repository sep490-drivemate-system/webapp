"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "../commons/image-upload-field";

export default function CitizenIdSection() {
  const [formData, setFormData] = useState({
    frontImage: "" as string,
    backImage: "" as string,
    fullName: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (field: string, file: File | null) => {
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
        <CardTitle className="text-foreground">Căn Cước Công Dân</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadField
            label="Ảnh Mặt Trước"
            onUpload={(file) => handleImageUpload("frontImage", file)}
            preview={formData.frontImage}
          />
          <ImageUploadField
            label="Ảnh Mặt Sau"
            onUpload={(file) => handleImageUpload("backImage", file)}
            preview={formData.backImage}
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ngày Sinh <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Giới Tính <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className="border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
