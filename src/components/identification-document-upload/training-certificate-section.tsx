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

export default function TrainingCertificateSection() {
  const [formData, setFormData] = useState({
    image: "" as string,
    trainingClass: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (base64: string) => {
    setFormData((prev) => ({
      ...prev,
      image: base64,
    }));
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-foreground">
          Chứng Chỉ Hành Nghề Dạy Lái Xe
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <ImageUploadField
          label="Ảnh Chứng Chỉ Hành Nghề"
          onUpload={(base64: string) => handleImageUpload(base64)}
          preview={formData.image}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Hạng Xe Được Đào Tạo Giảng Dạy{" "}
            <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.trainingClass}
            onValueChange={(value) => handleInputChange("trainingClass", value)}
          >
            <SelectTrigger className="border-slate-300 dark:border-slate-600">
              <SelectValue placeholder="Chọn hạng xe" />
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
