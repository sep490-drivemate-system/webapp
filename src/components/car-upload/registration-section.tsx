"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IBrandCar } from "@/types/car/car.type";

interface RegistrationData {
  licensePlate?: string;
  brandId?: string;
  brand?: string;
  color?: string;
  seats?: number;
  fuelType?: string;
  model?: string;
  carType?: string;
  year?: number;
  licenseTier?: string;
  description?: string;
  frontImage?: File | string | null;
  backImage?: File | string | null;
  [key: string]: string | number | File | null | undefined;
}

interface RegistrationSectionProps {
  data: RegistrationData;
  rentalPrice: string;
  onUpdate: (data: RegistrationData) => void;
  onPriceUpdate: (price: string) => void;
  manufacturers?: IBrandCar[];
}

const fuelTypes = ["Xăng", "Dầu", "Điện", "Hybrid"];

const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Pickup", "Van", "Minivan"];

const licenseTiers = ["B", "C1", "C", "D1", "D2", "D", "BE", "C1E", "CE", "D1E", "D2E", "DE"];

export default function RegistrationSection({
  data,
  rentalPrice,
  onUpdate,
  onPriceUpdate,
  manufacturers = [],
}: RegistrationSectionProps) {
  const handleInputChange = (field: string, value: string | number) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Giấy Đăng Ký Xe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Information */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-foreground">
            Thông Tin Xe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="brand" className="text-foreground pb-2">
                Hãng Xe
              </Label>
              <Select
                value={data.brandId || data.brand || ""}
                onValueChange={(value) => {
                  // Find the manufacturer by ID (value is manufacturer.id)
                  const manufacturer = manufacturers.find((m) => m.id === value);
                  if (manufacturer) {
                    // Store both ID and name for validation
                    onUpdate({
                      ...data,
                      brandId: manufacturer.id,
                      brand: manufacturer.name,
                    });
                  }
                }}
                disabled={manufacturers.length === 0}
              >
                <SelectTrigger className="w-full bg-input text-foreground border-border">
                  <SelectValue placeholder={manufacturers.length === 0 ? "Đang tải danh sách hãng xe..." : "Chọn hãng xe"} />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                min="1"
                value={data.seats || ""}
                onChange={(e) =>
                  handleInputChange("seats", parseInt(e.target.value) || 0)
                }
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="fuelType" className="text-foreground pb-2">
                Nhiên Liệu Xe
              </Label>
              <Select
                value={data.fuelType || ""}
                onValueChange={(value) => handleInputChange("fuelType", value)}
              >
                <SelectTrigger className="w-full bg-input text-foreground border-border">
                  <SelectValue placeholder="Chọn loại nhiên liệu" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rentalPrice" className="text-foreground pb-2">
                Giá Thuê Theo Giờ (VNĐ)
              </Label>
              <Input
                id="rentalPrice"
                type="number"
                placeholder="Ví dụ: 500000"
                value={rentalPrice}
                onChange={(e) => onPriceUpdate(e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-foreground pb-2">
                Model Xe
              </Label>
              <Input
                id="model"
                placeholder="Ví dụ: Camry"
                value={data.model || ""}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="carType" className="text-foreground pb-2">
                Loại Xe
              </Label>
              <Select
                value={data.carType || ""}
                onValueChange={(value) => handleInputChange("carType", value)}
              >
                <SelectTrigger className="w-full bg-input text-foreground border-border">
                  <SelectValue placeholder="Chọn loại xe" />
                </SelectTrigger>
                <SelectContent>
                  {carTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year" className="text-foreground pb-2">
                Năm Sản Xuất
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="Ví dụ: 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={data.year || ""}
                onChange={(e) =>
                  handleInputChange("year", parseInt(e.target.value) || 0)
                }
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor="licenseTier" className="text-foreground pb-2">
                Hạng Bằng Lái
              </Label>
              <Select
                value={data.licenseTier || ""}
                onValueChange={(value) => handleInputChange("licenseTier", value)}
              >
                <SelectTrigger className="w-full bg-input text-foreground border-border">
                  <SelectValue placeholder="Chọn hạng bằng lái" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTiers.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-foreground pb-2">
              Mô Tả <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              placeholder="Nhập mô tả về xe..."
              value={data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-md bg-input text-foreground border border-border resize-y"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
