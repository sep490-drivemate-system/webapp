"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUploadField from "../commons/image-upload-field";
import { ChevronDown } from "lucide-react";

interface RegistrationSectionProps {
  data: any;
  rentalPrice: string;
  onUpdate: (data: any) => void;
  onPriceUpdate: (price: string) => void;
}

export default function RegistrationSection({
  data,
  rentalPrice,
  onUpdate,
  onPriceUpdate,
}: RegistrationSectionProps) {
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const fuelTypes = ["xăng", "dầu", "điện", "hybrid"];

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

  const handleFuelSelect = (fuel: string) => {
    handleInputChange("fuelType", fuel);
    setShowFuelDropdown(false);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Giấy Đăng Ký Xe</CardTitle>
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

        {/* Owner Info */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-foreground">
            Thông Tin Chủ Sở Hữu
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="ownerName" className="text-foreground pb-2">
                Họ và Tên
              </Label>
              <Input
                id="ownerName"
                placeholder="Nhập họ và tên chủ sở hữu"
                value={data.ownerName || ""}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="licensePlate" className="text-foreground pb-2">
                Biển Số Xe
              </Label>
              <Input
                id="licensePlate"
                placeholder="Ví dụ: 30A-123456"
                value={data.licensePlate || ""}
                onChange={(e) =>
                  handleInputChange("licensePlate", e.target.value)
                }
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-foreground">
            Thông Tin Xe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="brand" className="text-foreground pb-2">
                Tên Hãng Xe
              </Label>
              <Input
                id="brand"
                placeholder="Ví dụ: Toyota"
                value={data.brandName || ""}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-foreground pb-2">
                Tên Mẫu Xe
              </Label>
              <Input
                id="model"
                placeholder="Ví dụ: Camry"
                value={data.modelName || ""}
                onChange={(e) => handleInputChange("modelName", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-foreground pb-2">
                Màu Xe
              </Label>
              <Input
                id="color"
                placeholder="Ví dụ: Đen"
                value={data.color || ""}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="seats" className="text-foreground pb-2">
                Số Chỗ Ngồi
              </Label>
              <Input
                id="seats"
                placeholder="Ví dụ: 5"
                type="number"
                value={data.seats || ""}
                onChange={(e) => handleInputChange("seats", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
          </div>
        </div>

        {/* Fuel & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="issuedDate" className="text-foreground pb-2">
              Ngày Cấp
            </Label>
            <Input
              id="issuedDate"
              type="date"
              value={data.issuedDate || ""}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              className="bg-input text-foreground border-border"
            />
          </div>

          {/* Fuel Type Dropdown */}
          <div>
            <Label htmlFor="fuelType" className="text-foreground pb-2">
              Loại Nhiên Liệu
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFuelDropdown(!showFuelDropdown)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground flex items-center justify-between hover:bg-secondary transition-colors"
              >
                <span>{data.fuelType || "Chọn loại nhiên liệu"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFuelDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showFuelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10">
                  {fuelTypes.map((fuel) => (
                    <button
                      key={fuel}
                      type="button"
                      onClick={() => handleFuelSelect(fuel)}
                      className="w-full text-left px-3 py-2 text-foreground hover:bg-secondary transition-colors first:rounded-t-md last:rounded-b-md"
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rental Price */}
        <div className="border-t border-border pt-4">
          <Label
            htmlFor="rentalPrice"
            className="text-foreground font-semibold"
          >
            Giá Thuê Theo Giờ (VNĐ)
          </Label>
          <Input
            id="rentalPrice"
            type="number"
            placeholder="Ví dụ: 500000"
            value={rentalPrice}
            onChange={(e) => onPriceUpdate(e.target.value)}
            className="bg-input text-foreground border-border mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
