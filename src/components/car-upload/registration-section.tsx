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

interface RegistrationSectionProps {
  data: any;
  rentalPrice: string;
  onUpdate: (data: any) => void;
  onPriceUpdate: (price: string) => void;
}

const carBrands = [
  "Toyota",
  "Hyundai",
  "Mazda",
  "Kia",
  "Honda",
  "Ford",
  "Mitsubishi",
  "Nissan",
  "VinFast",
  "Suzuki",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
];

const fuelTypes = ["Xăng", "Dầu", "Điện", "Hybrid"];

export default function RegistrationSection({
  data,
  rentalPrice,
  onUpdate,
  onPriceUpdate,
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
                value={data.brand || ""}
                onValueChange={(value) => handleInputChange("brand", value)}
              >
                <SelectTrigger className="w-full bg-input text-foreground border-border">
                  <SelectValue placeholder="Chọn hãng xe" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
