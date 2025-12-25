"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "../commons/image-upload-field";

interface VerificationData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  leftSideImage?: File | string | null;
  rightSideImage?: File | string | null;
  interiorImage?: File | string | null;
  [key: string]: File | string | null | undefined;
}

interface VerificationSectionProps {
  data: VerificationData;
  onUpdate: (data: VerificationData) => void;
}

export default function VerificationSection({
  data,
  onUpdate,
}: VerificationSectionProps) {
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
        <CardTitle className="text-foreground">Ảnh Xác Thực Xe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadField
            label="Ảnh Phía Trước"
            onUpload={(file) => handleImageUpload("frontImage", file)}
            preview={getPreviewUrl(data.frontImage)}
          />
          <ImageUploadField
            label="Ảnh Phía Sau"
            onUpload={(file) => handleImageUpload("backImage", file)}
            preview={getPreviewUrl(data.backImage)}
          />
          <ImageUploadField
            label="Ảnh Bên Hông Trái"
            onUpload={(file) => handleImageUpload("leftSideImage", file)}
            preview={getPreviewUrl(data.leftSideImage)}
          />
          <ImageUploadField
            label="Ảnh Bên Hông Phải"
            onUpload={(file) => handleImageUpload("rightSideImage", file)}
            preview={getPreviewUrl(data.rightSideImage)}
          />
          <ImageUploadField
            label="Ảnh Nội Thất"
            onUpload={(file) => handleImageUpload("interiorImage", file)}
            preview={getPreviewUrl(data.interiorImage)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
