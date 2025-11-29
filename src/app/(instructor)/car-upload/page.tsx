"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DocumentForm from "@/components/car-upload/document-form";
import PageHeader from "@/components/commons/Header/header";

export default function CarUploadPage() {
  const router = useRouter();
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
      <PageHeader
        title="Tải Lên Tài Liệu Xe"
        description="Tải lên giấy đăng kiểm xe, bảo hiểm, giấy đăng ký và ảnh xác thực xe của bạn"
        leftAction={
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

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

      {/* Manual Upload */}
      <section>
        <Tabs defaultValue="form" className="w-full">
          <TabsContent value="form" className="space-y-6 mt-6">
            <DocumentForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
