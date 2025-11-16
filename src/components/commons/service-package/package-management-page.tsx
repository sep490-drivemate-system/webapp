"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageCard } from "@/components/commons/service-package/package-card";

const DUMMY_PACKAGES = [
  {
    id: 1,
    title: "Gói miền Tây",
    skills: ["Lùi xe", "Đỗ xe", "Quan sát"],
    roadTypes: ["Đường trơn trượt", "Đường đông dân cư"],
    duration: "1.5 giờ",
    carOption: "Có thể đi xe của khách hàng hoặc của tôi",
    price: 150000,
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function PackageManagementPage() {
  const [packages, setPackages] = useState(DUMMY_PACKAGES);

  const handleDelete = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="space-y-3">
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl  text-foreground">
                  Danh sách gói dịch vụ
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Quản lý các gói dịch vụ của bạn
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => console.log("Thêm gói mới")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
                >
                  <Plus size={18} />
                  <span>Thêm gói mới</span>
                </button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có gói dịch vụ nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu bằng cách thêm gói dịch vụ đầu tiên của bạn
            </p>
          </div>
        )}

        {/* Packages Grid */}
        {packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onDelete={() => handleDelete(pkg.id)}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
