"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "../commons/image-upload-field";

interface InspectionSectionProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function InspectionSection({
  data,
  onUpdate,
}: InspectionSectionProps) {
  const handleImageUpload = (field: string, base64: string) => {
    onUpdate({
      ...data,
      [field]: base64,
    });
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
            onUpload={(base64) => handleImageUpload("frontImage", base64)}
            preview={data.frontImage}
          />
          <ImageUploadField
            label="Ảnh Mặt Sau"
            onUpload={(base64) => handleImageUpload("backImage", base64)}
            preview={data.backImage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
