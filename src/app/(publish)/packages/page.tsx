"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Car, Package as PackageIcon, Eye } from "lucide-react";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { SearchBar } from "@/components/commons/search-bar";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getListPackages } from "@/features/package/packageThunk";
import type { Package as DrivingPackage } from "@/types/package/package.type";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;

interface PackageFilters {
  roadType: string;
  allowSelfCar: string;
  priceRange: string;
  duration: string;
}

const ROAD_TYPES = [
  "Đường nội thành/Đô thị",
  "Đường trường/Cao tốc",
  "Đường đồi núi/Địa hình phức tạp",
  "Đường khu vực dân cư/Đường hẹp",
  "Đường đang thi công/Mặt đường xấu",
  "Đường đô thị (Trong thành phố))",
];

const PACKAGE_FILTER_SECTIONS: FilterSection<PackageFilters>[] = [
  {
    key: "roadType",
    label: "Loại đường",
    placeholder: "Chọn loại đường",
    options: [
      { value: "all", label: "Tất cả" },
      ...ROAD_TYPES.map((type) => ({ value: type, label: type })),
    ],
  },
  {
    key: "allowSelfCar",
    label: "Hình thức xe",
    placeholder: "Chọn tùy chọn",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "yes", label: "Tự mang xe" },
      { value: "no", label: "Dùng xe của giáo viên" },
    ],
  },
  {
    key: "priceRange",
    label: "Khoảng giá",
    placeholder: "Chọn khoảng giá",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "low", label: "< 300.000đ" },
      { value: "medium", label: "300.000 - 800.000đ" },
      { value: "high", label: "> 800.000đ" },
    ],
  },
  {
    key: "duration",
    label: "Thời lượng",
    placeholder: "Chọn thời lượng",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "short", label: "≤ 20 giờ" },
      { value: "medium", label: "21-40 giờ" },
      { value: "long", label: "> 40 giờ" },
    ],
  },
];

export default function PackagesPage() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<PackageFilters>({
    roadType: "all",
    allowSelfCar: "all",
    priceRange: "all",
    duration: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dispatch(
          getListPackages({
            pageNumber: currentPage,
            pageSize: ITEMS_PER_PAGE,
            searchKey: searchQuery || undefined,
            allowSelfCar:
              filters.allowSelfCar === "yes"
                ? true
                : filters.allowSelfCar === "no"
                ? false
                : undefined,
            roadTypes:
              filters.roadType !== "all" ? [filters.roadType] : undefined,
          })
        ).unwrap();

        const data = response.value;
        setPackages(data?.pageContent ?? []);
        setTotalCount(data?.totalCount ?? 0);
      } catch (err) {
        const message =
          typeof err === "string" ? err : "Không thể tải danh sách gói dịch vụ";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [
    currentPage,
    searchQuery,
    filters.allowSelfCar,
    filters.roadType,
    dispatch,
  ]);

  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        const matchesPrice =
          filters.priceRange === "all" ||
          (filters.priceRange === "low" && pkg.price < 300000) ||
          (filters.priceRange === "medium" &&
            pkg.price >= 300000 &&
            pkg.price <= 800000) ||
          (filters.priceRange === "high" && pkg.price > 800000);

        const matchesDuration =
          filters.duration === "all" ||
          (filters.duration === "short" && pkg.duration <= 20) ||
          (filters.duration === "medium" &&
            pkg.duration > 20 &&
            pkg.duration <= 40) ||
          (filters.duration === "long" && pkg.duration > 40);

        return matchesPrice && matchesDuration;
      })
      .sort((a, b) => b.bookingCount - a.bookingCount);
  }, [packages, filters.duration, filters.priceRange]);

  const totalPages =
    totalCount > 0 ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      roadType: "all",
      allowSelfCar: "all",
      priceRange: "all",
      duration: "all",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePackageFilterChange = (
    key: keyof PackageFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 ">
        <PageSectionHeader
          title="Danh sách gói dịch vụ"
          description="Khám phá và lựa chọn gói luyện tập phù hợp với nhu cầu, ngân sách và mục tiêu học lái xe của bạn."
        />

        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm gói dịch vụ"
          className="!mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <PackageFilterSidebar
              filters={filters}
              sections={PACKAGE_FILTER_SECTIONS}
              onFilterChange={handlePackageFilterChange}
              onReset={resetFilters}
            />
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            {loading && (
              <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
                Đang tải danh sách gói dịch vụ...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {filteredPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                        {pkg.name}
                      </h3>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pb-3 border-b flex-shrink-0">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={pkg.instructorAvatar}
                          alt={pkg.instructorName}
                        />
                        <AvatarFallback>
                          {(pkg.instructorName || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {pkg.instructorName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {pkg.bookingCount} lượt đặt • {pkg.carCount} xe
                        </p>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-2 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium">{pkg.duration} giờ</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Car className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>
                          {pkg.allowSelfCar
                            ? "Có thể thuê xe tập"
                            : "Không thể thuê xe tập (tự túc xe)"}
                        </span>
                      </div>
                    </div>

                    {/* Skills & Road Types */}
                    <div className="flex-1 flex flex-col gap-2 min-h-[4rem]">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Kỹ năng:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.skills.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {pkg.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pkg.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Loại đường:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.roadTypes.slice(0, 2).map((road, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {road}
                            </Badge>
                          ))}
                          {pkg.roadTypes.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{pkg.roadTypes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-3 border-t flex-shrink-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            Giá gói
                          </span>
                          <span className="text-2xl font-extrabold text-emerald-600">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold text-emerald-700 border-emerald-200 bg-emerald-50"
                        >
                          {pkg.bookingCount} lượt đặt
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full gap-2" variant="green">
                      <Link href={`/instructors/${pkg.instructorId}`}>
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* No Results */}
            {!loading && filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <PackageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy gói phù hợp
                  </h3>
                  <p>
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm để tìm gói phù hợp hơn
                  </p>
                </div>
                <Button onClick={resetFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
