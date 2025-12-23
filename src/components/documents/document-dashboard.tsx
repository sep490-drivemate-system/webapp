"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentConfigPage } from "./document-config-page";
import { StatsCards } from "./stats-card";
import { DocumentSummary } from "./document-sumary";
import { Car, BarChart3, FileCheck } from "lucide-react";
import PageHeader from "@/components/commons/Header/header";

export function DocumentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Quản Lý Hệ Thống Giấy Tờ"
          description="Quản lý và cấu hình các loại giấy tờ của người hướng dẫn"
          className="mb-8"
        />

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary">
            <TabsTrigger
              value="dashboard"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <span className="hidden sm:inline">Tổng Quan</span>
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <span className="hidden sm:inline">Cấu Hình</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Loại Giấy Tờ Cá Nhân</CardTitle>
                    <CardDescription>
                      Tổng hợp số liệu về giấy tờ cá nhân
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StatsCards
                  totalUsers={0}
                  verifiedDocs={0}
                  pendingDocs={0}
                  rejectedDocs={0}
                />
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Loại Giấy Tờ Xe</CardTitle>
                    <CardDescription>
                      Tổng hợp số liệu về giấy tờ xe
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StatsCards
                  totalUsers={0}
                  verifiedDocs={0}
                  pendingDocs={0}
                  rejectedDocs={0}
                  totalIcon={Car}
                />
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Tóm Tắt Loại Giấy Tờ</CardTitle>
                    <CardDescription>
                      Danh sách các loại giấy tờ trong hệ thống
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DocumentSummary />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <DocumentConfigPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
