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
import { FileJson, Download } from "lucide-react";

interface JsonUploadSectionProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function JsonUploadSection({
  onSuccess,
  onError,
}: JsonUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const sampleData = {
    citizenId: {
      frontImage: "base64_image_string",
      backImage: "base64_image_string",
      citizenIdNumber: "123456789012",
      issuedDate: "2015-01-01",
      expiredDate: "2025-01-01",
      issuedPlace: "Công An TP. Hồ Chí Minh",
      permanentAddress: "123 Đường ABC, TP. Hồ Chí Minh",
      gender: "male",
      dateOfBirth: "1990-01-01",
    },
    legalHistory: {
      image: "base64_image_string",
      issuedDate: "2020-01-01",
    },
    healthCertificate: {
      image: "base64_image_string",
      issuedDate: "2023-01-01",
    },
    driverLicense: {
      frontImage: "base64_image_string",
      backImage: "base64_image_string",
      licenseNumber: "DL123456",
      issuedDate: "2015-01-01",
      expiredDate: "2025-01-01",
      licenseClass: "B",
    },
    trainingCertificate: {
      image: "base64_image_string",
      issuedDate: "2021-01-01",
      trainingClass: "B",
    },
  };

  const handleDownloadTemplate = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "personal-documents-template.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      setValidationError("Vui lòng chọn file JSON");
      return;
    }

    setValidationError(null);
    setFileName(file.name);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setValidationError("Vui lòng chọn file JSON");
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      // Validate JSON structure
      const requiredFields = [
        "citizenId",
        "legalHistory",
        "healthCertificate",
        "driverLicense",
        "trainingCertificate",
      ];
      const missingFields = requiredFields.filter((field) => !jsonData[field]);

      if (missingFields.length > 0) {
        setValidationError(`Thiếu các trường: ${missingFields.join(", ")}`);
        return;
      }

      // Process data
      onSuccess("Dữ liệu JSON đã được tải lên và xử lý thành công!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFileName("");
    } catch (error) {
      if (error instanceof SyntaxError) {
        setValidationError(
          "File JSON không hợp lệ. Vui lòng kiểm tra định dạng."
        );
      } else {
        onError("Lỗi khi xử lý file. Vui lòng thử lại.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileJson className="h-5 w-5" />
          Upload Hàng Loạt
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tải lên toàn bộ thông tin tài liệu cá nhân bằng file JSON đã định dạng
          sẵn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              className="border-border text-foreground hover:bg-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải Mẫu JSON
            </Button>
            <p className="text-sm text-muted-foreground">
              Tải mẫu JSON và điền thông tin tài liệu cá nhân của bạn
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Chọn File JSON
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:bg-secondary transition-colors"
            >
              <FileJson className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium text-foreground">
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
              onChange={handleFileChange}
              className="hidden"
            />
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          {/* submit button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setValidationError(null);
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
              disabled={isProcessing || !fileName}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isProcessing ? "Đang Tải Lên..." : "Tải Lên JSON"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
