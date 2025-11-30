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

import { DocumentTypeList } from "./document-type-list";

import { DEFAULT_DOCUMENT_TYPES, type DocumentType } from "@/lib/types";

import { Settings, FileText, Users, Car } from "lucide-react";

export function DocumentConfigPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(
    DEFAULT_DOCUMENT_TYPES
  );

  const handleSaveDocumentType = (type: DocumentType) => {
    const index = documentTypes.findIndex((t) => t.id === type.id);
    if (index >= 0) {
      // Update existing
      const updated = [...documentTypes];
      updated[index] = type;
      setDocumentTypes(updated);
    } else {
      // Create new
      setDocumentTypes([...documentTypes, type]);
    }
  };

  const handleDeleteDocumentType = (id: string) => {
    setDocumentTypes(documentTypes.filter((t) => t.id !== id));
  };

  const handleRefresh = () => {
    // Refresh logic if needed
  };

  const personalCount = documentTypes.filter(
    (t) => t.categoryType === "personal"
  ).length;
  const vehicleCount = documentTypes.filter(
    (t) => t.categoryType === "vehicle"
  ).length;

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Cấu hình Loại Giấy Tờ</CardTitle>
              <CardDescription>
                Quản lý các loại giấy tờ, thêm/xóa trường, và cấu hình dữ liệu
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    Loại giấy tờ cá nhân
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {personalCount}
                  </CardTitle>
                </div>
                <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
                  <Users className="size-5" />
                </span>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    Loại giấy tờ xe
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {vehicleCount}
                  </CardTitle>
                </div>
                <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
                  <Car className="size-5" />
                </span>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Quản Lý Loại Giấy Tờ</CardTitle>
              <CardDescription>
                Tạo, chỉnh sửa và quản lý các loại giấy tờ cá nhân và xe
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger
                value="personal"
                className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
              >
                Giấy Tờ Cá Nhân ({personalCount})
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
              >
                Giấy Tờ Xe ({vehicleCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-6">
              <DocumentTypeList
                documentTypes={documentTypes}
                categoryType="personal"
                onSave={handleSaveDocumentType}
                onDelete={handleDeleteDocumentType}
                onRefresh={handleRefresh}
              />
            </TabsContent>

            <TabsContent value="vehicle" className="space-y-4 mt-6">
              <DocumentTypeList
                documentTypes={documentTypes}
                categoryType="vehicle"
                onSave={handleSaveDocumentType}
                onDelete={handleDeleteDocumentType}
                onRefresh={handleRefresh}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
