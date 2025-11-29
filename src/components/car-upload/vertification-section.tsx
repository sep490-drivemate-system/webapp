"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "../commons/image-upload-field";

interface VerificationSectionProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function VerificationSection({
  data,
  onUpdate,
}: VerificationSectionProps) {
  const handleImageUpload = (field: string, base64: string) => {
    onUpdate({
      ...data,
      [field]: base64,
    });
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
            onUpload={(base64) => handleImageUpload("frontImage", base64)}
            preview={data.frontImage}
          />
          <ImageUploadField
            label="Ảnh Bên Hông"
            onUpload={(base64) => handleImageUpload("sideImage", base64)}
            preview={data.sideImage}
          />
          <ImageUploadField
            label="Ảnh Phía Sau"
            onUpload={(base64) => handleImageUpload("backImage", base64)}
            preview={data.backImage}
          />
          <ImageUploadField
            label="Ảnh Nội Thất"
            onUpload={(base64) => handleImageUpload("interiorImage", base64)}
            preview={data.interiorImage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
