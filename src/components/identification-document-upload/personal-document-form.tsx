"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CitizenIdSection from "./citizen-id-section";
import LegalHistorySection from "./legal-history-section";
import HealthCertificateSection from "./health-certificate-section";
import DriverLicenseSection from "./driver-license-section";
import TrainingCertificateSection from "./training-certificate-section";
import EmergencyContactSection from "./emergency-contact";

interface PersonalDocumentFormProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function PersonalDocumentForm({
  onSuccess,
  onError,
}: PersonalDocumentFormProps) {
  const [activeTab, setActiveTab] = useState("citizen-id");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Validate form data here
      onSuccess("Tài liệu đã được tải lên thành công!");
    } catch {
      onError("Lỗi khi tải lên tài liệu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger
            value="citizen-id"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            CCCD
          </TabsTrigger>
          <TabsTrigger
            value="legal-history"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Lý Lịch Tư Pháp
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Sức Khỏe
          </TabsTrigger>
          <TabsTrigger
            value="driver-license"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Bằng Lái
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Chứng Chỉ Hành Nghề
          </TabsTrigger>
          <TabsTrigger
            value="emergency-contact"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Liên Hệ Khẩn Cấp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="citizen-id" className="space-y-4 mt-6">
          <CitizenIdSection />
        </TabsContent>

        <TabsContent value="legal-history" className="space-y-4 mt-6">
          <LegalHistorySection />
        </TabsContent>

        <TabsContent value="health" className="space-y-4 mt-6">
          <HealthCertificateSection />
        </TabsContent>

        <TabsContent value="driver-license" className="space-y-4 mt-6">
          <DriverLicenseSection />
        </TabsContent>

        <TabsContent value="training" className="space-y-4 mt-6">
          <TrainingCertificateSection />
        </TabsContent>

        <TabsContent value="emergency-contact" className="space-y-4 mt-6">
          <EmergencyContactSection />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button variant="outline" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Gửi Tài Liệu"}
        </Button>
      </div>
    </div>
  );
}
