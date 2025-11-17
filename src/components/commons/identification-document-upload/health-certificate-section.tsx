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
import ImageUploadField from "../image-upload-field";

export default function HealthCertificateSection() {
  const [formData, setFormData] = useState({
    image: "" as string,
    issuedDate: "",
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
        <CardTitle className="text-foreground">Giấy Khám Sức Khỏe</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <ImageUploadField
          label="Ảnh Giấy Khám Sức Khỏe"
          onUpload={(base64: string) => handleImageUpload(base64)}
          preview={formData.image}
        />

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
      </CardContent>
    </Card>
  );
}
