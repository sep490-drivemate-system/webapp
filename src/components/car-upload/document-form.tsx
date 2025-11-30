"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RegistrationSection from "./registration-section";
import InsuranceSection from "./insurance-section";
import InspectionSection from "./inspection-section";
import VerificationSection from "./vertification-section";

interface FormData {
  registration: any;
  inspection: any;
  insurance: any;
  verification: any;
  rentalPrice: string;
}

export default function DocumentForm({
  onSuccess,
  onError,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [currentTab, setCurrentTab] = useState("inspection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    registration: {},
    inspection: {},
    insurance: {},
    verification: {},
    rentalPrice: "",
  });

  const handleSectionUpdate = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate Inspection Section
      if (!formData.inspection?.frontImage || !formData.inspection?.backImage) {
        throw new Error(
          "Vui lòng tải lên đầy đủ ảnh giấy đăng kiểm (mặt trước và mặt sau)"
        );
      }

      // Validate Insurance Section
      if (!formData.insurance?.frontImage || !formData.insurance?.backImage) {
        throw new Error(
          "Vui lòng tải lên đầy đủ ảnh bảo hiểm xe (mặt trước và mặt sau)"
        );
      }
      if (!formData.insurance?.expiryDate) {
        throw new Error("Vui lòng nhập ngày hết hạn bảo hiểm xe");
      }

      // Validate Registration Section
      if (!formData.registration?.licensePlate) {
        throw new Error("Vui lòng nhập biển số xe");
      }
      if (!formData.registration?.brand) {
        throw new Error("Vui lòng chọn hãng xe");
      }
      if (!formData.registration?.color) {
        throw new Error("Vui lòng nhập màu xe");
      }
      if (!formData.registration?.seats || formData.registration?.seats <= 0) {
        throw new Error("Vui lòng nhập số chỗ ngồi");
      }
      if (!formData.registration?.fuelType) {
        throw new Error("Vui lòng chọn loại nhiên liệu");
      }
      if (!formData.rentalPrice || parseFloat(formData.rentalPrice) <= 0) {
        throw new Error("Vui lòng nhập giá thuê theo giờ");
      }

      // Validate Verification Section
      if (
        !formData.verification?.frontImage ||
        !formData.verification?.backImage ||
        !formData.verification?.leftSideImage ||
        !formData.verification?.rightSideImage ||
        !formData.verification?.interiorImage
      ) {
        throw new Error(
          "Vui lòng tải lên đầy đủ 5 ảnh xác thực xe (trước, sau, hông trái, hông phải, nội thất)"
        );
      }

      const response = await fetch("/api/upload-vehicle-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Tải lên dữ liệu xe thất bại");
      }

      onSuccess("Tải lên dữ liệu xe thành công!");
      setFormData({
        inspection: {},
        insurance: {},
        registration: {},
        verification: {},
        rentalPrice: "",
      });
      setCurrentTab("inspection");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Tải lên thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="inspection" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger
            value="inspection"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Đăng Kiểm
          </TabsTrigger>
          <TabsTrigger
            value="insurance"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Bảo Hiểm
          </TabsTrigger>
          <TabsTrigger
            value="registration"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Đăng Ký
          </TabsTrigger>
          <TabsTrigger
            value="verification"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Xác Thực
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspection" className="space-y-4">
          <InspectionSection
            data={formData.inspection}
            onUpdate={(data) => handleSectionUpdate("inspection", data)}
          />
        </TabsContent>
        <TabsContent value="insurance" className="space-y-4">
          <InsuranceSection
            data={formData.insurance}
            onUpdate={(data) => handleSectionUpdate("insurance", data)}
          />
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          <RegistrationSection
            data={formData.registration}
            rentalPrice={formData.rentalPrice}
            onUpdate={(data) => handleSectionUpdate("registration", data)}
            onPriceUpdate={(price: string) =>
              setFormData((prev) => ({ ...prev, rentalPrice: price }))
            }
          />
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <VerificationSection
            data={formData.verification}
            onUpdate={(data) => handleSectionUpdate("verification", data)}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex gap-3 justify-end border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentTab("registration")}
          className="border-border text-foreground hover:bg-muted"
        >
          Đặt Lại
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground"
        >
          {isSubmitting ? "Đang Tải Lên..." : "Gửi Toàn Bộ Tài Liệu"}
        </Button>
      </div>
    </form>
  );
}
