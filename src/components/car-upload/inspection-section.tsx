"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "../commons/image-upload-field";

interface InspectionData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  [key: string]: File | string | null | undefined;
}

interface InspectionSectionProps {
  data: InspectionData;
  onUpdate: (data: InspectionData) => void;
}

export default function InspectionSection({
  data,
  onUpdate,
}: InspectionSectionProps) {
  const handleImageUpload = (field: string, file: File | null) => {
    onUpdate({
      ...data,
      [field]: file,
    });
  };

  const getPreviewUrl = (file: File | null | string | undefined): string | undefined => {
    if (!file) return undefined;
    if (typeof file === "string") return file; // Support legacy base64 strings
    return URL.createObjectURL(file);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Giấy Đăng Kiểm Xe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadField
            label="Ảnh Mặt Trước"
            onUpload={(file) => handleImageUpload("frontImage", file)}
            preview={getPreviewUrl(data.frontImage)}
          />
          <ImageUploadField
            label="Ảnh Mặt Sau"
            onUpload={(file) => handleImageUpload("backImage", file)}
            preview={getPreviewUrl(data.backImage)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
