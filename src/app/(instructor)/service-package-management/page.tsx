"use client";

import PageHeader from "@/components/commons/Header/header";
import { Card } from "@/components/ui/card";
import { getInstructorPackages } from "@/features/package/packageThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { IInstructorPackages } from "@/types/instructor/instructor-management.types";
import { Clock, Loader2, Plus, Route, Workflow, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

interface PackageCardProps {
  pkg: IInstructorPackages;
  formatCurrency: (value: number) => string;
}

function PackageCard({ pkg, formatCurrency }: PackageCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="border-l-4 border-emerald-600 bg-gradient-to-r from-emerald-50 to-white p-6">
        <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-600">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Giá
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(pkg.price)}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thời lượng
              </p>
              <p className="text-sm text-gray-900 mt-1">{pkg.duration} giờ</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kỹ năng
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {pkg.drivingSkills.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Route className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Loại đường
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {pkg.roadTypes.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Workflow className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {pkg.isRentalCar ? "Người hướng dẫn và xe" : "Người hướng dẫn"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ServicePackageManagementPage() {
  const [packages, setPackages] = useState<IInstructorPackages[]>([]);
  const router = useRouter();
  const {
    run: fetchInstructorPackages,
    loading: fetchInstructorPackagesLoading,
  } = useThunkAction(getInstructorPackages);

  useEffect(() => {
    const userId = getUserInfo()?.id;
    if (!userId) return;
    fetchInstructorPackages(
      { id: userId },
      {
        onSuccess: (response) => {
          console.log(response?.value);
          setPackages(response?.value ?? []);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }, [fetchInstructorPackages]);

  return (
    <main className="min-h-screen bg-white">
      <PageHeader
        title="Quản Lý Gói Dịch Vụ"
        description="Quản lý các gói dịch vụ của bạn"
        actionButton={{
          label: "Thêm gói mới",
          onClick: () => router.push("/service-package-detail?create=true"),
          icon: Plus,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchInstructorPackagesLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
              <Loader2 className="size-8 animate-spin text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đang tải danh sách gói dịch vụ...
            </h3>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        ) : (
          <>
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

            {packages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
