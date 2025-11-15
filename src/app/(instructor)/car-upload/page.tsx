"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DocumentForm from "@/components/commons/car-upload/document-form";
import BulkUploadForm from "@/components/commons/car-upload/bulk-upload-form";

export default function CarUploadPage() {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleFormSuccess = (message: string) => {
    setUploadStatus("success");
    setStatusMessage(message);
    setTimeout(() => setUploadStatus("idle"), 3000);
  };

  const handleFormError = (error: string) => {
    setUploadStatus("error");
    setStatusMessage(error);
    setTimeout(() => setUploadStatus("idle"), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                Hệ Thống Upload Tài Liệu Xe
              </CardTitle>
              <CardDescription>
                Upload giấy đăng kiểm xe, bảo hiểm, giấy đăng ký và ảnh xác thực
                xe của bạn
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Status Messages */}
      {uploadStatus !== "idle" && (
        <Card
          className={
            uploadStatus === "success"
              ? "border-emerald-500 bg-emerald-50"
              : "border-destructive bg-destructive/10"
          }
        >
          <CardContent className="pt-6">
            <p
              className={
                uploadStatus === "success"
                  ? "text-emerald-700"
                  : "text-destructive"
              }
            >
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <section>
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Nhập Liệu Thủ Công</TabsTrigger>
            <TabsTrigger value="bulk">Upload Hàng Loạt (JSON)</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-6">
            <DocumentForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6 mt-6">
            <BulkUploadForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
