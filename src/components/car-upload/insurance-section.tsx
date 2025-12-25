"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadField from "../commons/image-upload-field";

interface InsuranceData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  expiryDate?: string;
  [key: string]: File | string | null | undefined;
}

interface InsuranceSectionProps {
  data: InsuranceData;
  onUpdate: (data: InsuranceData) => void;
}

export default function InsuranceSection({
  data,
  onUpdate,
}: InsuranceSectionProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

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
        <CardTitle className="text-foreground">Bảo Hiểm Xe</CardTitle>
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

        {/* Expiry Date */}
        <div>
          <Label htmlFor="inspExpiryDate" className="text-foreground pb-2">
            Ngày Hết Hạn
          </Label>
          <Input
            id="inspExpiryDate"
            type="date"
            value={data.expiryDate || ""}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            className="bg-input text-foreground border-border"
          />
        </div>
      </CardContent>
    </Card>
  );
}
