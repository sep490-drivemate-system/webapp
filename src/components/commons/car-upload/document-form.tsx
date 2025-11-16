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
      if (!formData.registration?.ownerName) {
        throw new Error("Vui lòng điền phần giấy đăng kiểm");
      }
      if (!formData.inspection?.frontImage) {
        throw new Error("Vui lòng điền phần bảo hiểm xe");
      }
      if (!formData.insurance?.frontImage) {
        throw new Error("Vui lòng điền phần giấy đăng ký xe");
      }
      if (!formData.verification?.frontImage) {
        throw new Error("Vui lòng điền phần ảnh xác thực xe");
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
      setCurrentTab("registration");
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
