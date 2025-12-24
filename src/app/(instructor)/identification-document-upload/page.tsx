"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PersonalDocumentForm from "@/components/identification-document-upload/personal-document-form";

export default function Home() {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSuccess = (message: string) => {
    setUploadStatus("success");
    setStatusMessage(message);
    setTimeout(() => setUploadStatus("idle"), 3000);
  };

  const handleError = (error: string) => {
    setUploadStatus("error");
    setStatusMessage(error);
    setTimeout(() => setUploadStatus("idle"), 3000);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="space-y-1">
                <CardTitle className="text-2xl text-foreground">
                  Tải Lên Tài Liệu Cá Nhân
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Quản lý và tải lên tài liệu cá nhân của bạn một cách an toàn
                  và chuyên nghiệp
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>

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
      <section>
        <Tabs defaultValue="manual" className="w-full">
          <TabsContent value="manual" className="space-y-6 mt-6">
            <PersonalDocumentForm
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
