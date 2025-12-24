"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUploadField from "@/components/commons/image-upload-field";

export default function LegalHistorySection() {
  const [formData, setFormData] = useState({
    image: "" as string,
  });

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        image: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-foreground">Lý Lịch Tư Pháp</CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <ImageUploadField
          label="Ảnh Lý Lịch Tư Pháp"
          onUpload={(file: File | null) => handleImageUpload(file)}
          preview={formData.image}
        />
      </CardContent>
    </Card>
  );
}
