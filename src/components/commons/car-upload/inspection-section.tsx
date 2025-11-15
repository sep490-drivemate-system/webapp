"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploadField from "./image-upload-field";

interface InspectionSectionProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function InspectionSection({
  data,
  onUpdate,
}: InspectionSectionProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

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
            label="Mặt Trước"
            onUpload={(base64) => handleImageUpload("frontImage", base64)}
            preview={data.frontImage}
          />
          <ImageUploadField
            label="Mặt Sau"
            onUpload={(base64) => handleImageUpload("backImage", base64)}
            preview={data.backImage}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="insIssuedDate" className="text-foreground">
              Ngày Cấp
            </Label>
            <Input
              id="insIssuedDate"
              type="date"
              value={data.issuedDate || ""}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              className="bg-input text-foreground border-border"
            />
          </div>
          <div>
            <Label htmlFor="insExpiryDate" className="text-foreground">
              Ngày Hết Hạn
            </Label>
            <Input
              id="insExpiryDate"
              type="date"
              value={data.expiryDate || ""}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              className="bg-input text-foreground border-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
