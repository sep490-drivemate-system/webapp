"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

interface BulkUploadFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function BulkUploadForm({
  onSuccess,
  onError,
}: BulkUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      onError("Vui lòng chọn file JSON");
      return;
    }

    if (!file.name.endsWith(".json")) {
      onError("Vui lòng tải lên file JSON hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("JSON phải là một mảng các bản ghi xe");
      }

      const response = await fetch("/api/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: data }),
      });

      if (!response.ok) {
        throw new Error("Tải lên bản ghi thất bại");
      }

      onSuccess(`Tải lên thành công ${data.length} bản ghi xe`);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Tải lên thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        registration: {
          ownerName: "Nguyễn Văn A",
          licensePlate: "30A-123456",
          brandName: "Toyota",
          modelName: "Camry",
          color: "Đen",
          seats: "5",
          issuedDate: "2020-01-15",
          fuelType: "xăng",
          frontImage: "base64_encoded_image_data_here",
          backImage: "base64_encoded_image_data_here",
        },
        inspection: {
          frontImage: "base64_encoded_image_data_here",
          backImage: "base64_encoded_image_data_here",
          issuedDate: "2023-01-15",
          expiryDate: "2026-01-15",
        },
        insurance: {
          frontImage: "base64_encoded_image_data_here",
          backImage: "base64_encoded_image_data_here",
          issuedDate: "2023-01-15",
          expiryDate: "2024-01-15",
        },
        verification: {
          frontImage: "base64_encoded_image_data_here",
          sideImage: "base64_encoded_image_data_here",
          backImage: "base64_encoded_image_data_here",
          interiorImage: "base64_encoded_image_data_here",
        },
        rentalPrice: "500000",
      },
    ];

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(template, null, 2))
    );
    element.setAttribute("download", "vehicle-upload-template.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Upload Hàng Loạt</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tải lên nhiều bản ghi xe cùng lúc bằng file JSON
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Download Template */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="border-border text-foreground hover:bg-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải Mẫu JSON
            </Button>
            <p className="text-sm text-muted-foreground">
              Lấy mẫu để điền thông tin xe của bạn
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Chọn File JSON
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-foreground font-medium">
                {fileName || "Nhấp để chọn file hoặc kéo và thả"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                File JSON (.json)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFileName("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="border-border text-foreground hover:bg-muted"
            >
              Xóa
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !fileName}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Đang Tải Lên..." : "Tải Lên Bản Ghi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
