"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmergencyContactSection() {
  const [formData, setFormData] = useState({
    contactName: "",
    contactPhone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-foreground">
          Người Liên Hệ Khẩn Cấp
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tên Người Liên Hệ Khẩn Cấp <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nhập tên người liên hệ khẩn cấp"
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Số Điện Thoại Người Liên Hệ Khẩn Cấp{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.contactPhone}
              onChange={(e) =>
                handleInputChange("contactPhone", e.target.value)
              }
              className="border-slate-300 dark:border-slate-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
