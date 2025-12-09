"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Fuel, Eye, Car, Loader2 } from "lucide-react";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { getCarById, getCars } from "@/features/car/carThunk";
import { ICar, ICarDetail } from "@/types/car/car.type";
import { CarStatus } from "@/types/constants/enum";
import { CarDetailDialog } from "@/components/car/car-detail-dialog";

const PAGE_SIZE = 6; // 3 items per row on web, 2 rows = 6 items per page

interface CarFilters {
  seats: string;
  brand: string;
  fuel: string;
}

const statusLabelMap: Record<CarStatus, string> = {
  [CarStatus.Approved]: "Đã duyệt",
  [CarStatus.Pending]: "Chờ duyệt",
  [CarStatus.Rejected]: "Bị từ chối",
};

const statusClassMap: Record<CarStatus, string> = {
  [CarStatus.Approved]: "bg-emerald-500 text-white",
  [CarStatus.Pending]: "bg-amber-400 text-gray-900",
  [CarStatus.Rejected]: "bg-rose-500 text-white",
};

export default function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>({
    seats: "all",
    brand: "all",
    fuel: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<ICar[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { run: fetchCars, loading } = useThunkAction(getCars);
  const { run: fetchCarDetail, loading: detailLoading } =
    useThunkAction(getCarById);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [carDetail, setCarDetail] = useState<ICarDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const seatsParam =
      filters.seats !== "all" ? Number.parseInt(filters.seats, 10) : undefined;
    const brandParam = filters.brand !== "all" ? filters.brand : undefined;
    const fuelParam = filters.fuel !== "all" ? filters.fuel : undefined;

    setError(null);

    fetchCars(
      {
        page: currentPage,
        size: PAGE_SIZE,
        seats: Number.isNaN(seatsParam as number) ? undefined : seatsParam,
        brand: brandParam,
        fuel: fuelParam,
      },
      {
        onSuccess: (res) => {
          setCars(res?.value?.pageContent ?? []);
          setTotalCount(res?.value?.totalCount ?? 0);
        },
        onError: () => {
          setCars([]);
          setTotalCount(0);
          setError("Không thể tải danh sách xe. Vui lòng thử lại.");
        },
      }
    );
  }, [fetchCars, filters, currentPage]);

  const uniqueSeats = useMemo(
    () => [...new Set(cars.map((car) => car.seatCounts))].sort((a, b) => a - b),
    [cars]
  );
  const uniqueBrands = useMemo(
    () => [...new Set(cars.map((car) => car.brand))].sort(),
    [cars]
  );
  const uniqueFuels = useMemo(
    () => [...new Set(cars.map((car) => car.fuel))].sort(),
    [cars]
  );

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      seats: "all",
      brand: "all",
      fuel: "all",
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof CarFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const loadCarDetail = (carId: string) => {
    setSelectedCarId(carId);
    setCarDetail(null);
    setDetailError(null);
    fetchCarDetail(
      { id: carId },
      {
        onSuccess: (res) => {
          setCarDetail(res?.value ?? null);
          if (!res?.value) {
            setDetailError("Không tìm thấy thông tin xe.");
          }
        },
        onError: () => {
          setDetailError(
            "Không thể tải thông tin chi tiết xe. Vui lòng thử lại."
          );
        },
      }
    );
  };

  const handleOpenDetail = (carId: string) => {
    setDetailOpen(true);
    loadCarDetail(carId);
  };

  const carFilterSections: FilterSection<CarFilters>[] = [
    {
      key: "seats",
      label: "Số chỗ ngồi",
      placeholder: "Chọn số chỗ",
      options: [
        { value: "all", label: "Tất cả" },
        ...uniqueSeats.map((seats) => ({
          value: seats.toString(),
          label: `${seats} chỗ`,
        })),
      ],
    },
    {
      key: "brand",
      label: "Hãng xe",
      placeholder: "Chọn hãng xe",
      options: [
        { value: "all", label: "Tất cả" },
        ...uniqueBrands.map((brand) => ({ value: brand, label: brand })),
      ],
    },
    {
      key: "fuel",
      label: "Nhiên liệu",
      placeholder: "Chọn nhiên liệu",
      options: [
        { value: "all", label: "Tất cả" },
        ...uniqueFuels.map((fuel) => ({ value: fuel, label: fuel })),
      ],
    },
  ];

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <PageSectionHeader
          title="Danh sách xe tập lái"
          description="Khám phá các xe tập lái chất lượng, phù hợp với nhu cầu và khu vực của bạn."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PackageFilterSidebar
              filters={filters}
              sections={carFilterSections}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              title="Bộ lọc xe"
              resetLabel="Xóa bộ lọc"
            />
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-8 text-rose-600">{error}</div>
            )}

            {!loading && cars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {cars.map((car) => {
                  const statusLabel = statusLabelMap[car.status] ?? car.status;
                  const statusClass = statusClassMap[car.status] ?? "";
                  const rating = car.average_rating ?? 0;

                  return (
                    <Card
                      key={car.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0"
                    >
                      <div className="relative">
                        <img
                          src={car.thumbnailUrl}
                          alt={`${car.brand} ${car.modelName}`}
                          className="w-full h-48 object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${statusClass}`}
                        >
                          {statusLabel}
                        </Badge>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {car.brand} {car.modelName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Biển số: {car.license_plate}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{car.seatCounts} chỗ</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {car.vehicleType}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-4 w-4 text-gray-500" />
                            <span>{car.fuel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span>{car.licenseTier}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({car.booking_count ?? 0} lượt đặt)
                          </span>
                        </div>

                        <div className="text-lg font-bold mb-3">
                          {formatPrice(car.price)}/giờ
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          variant="green"
                          onClick={() => handleOpenDetail(car.id)}
                        >
                          <Eye className="h-4 w-4" />
                          Xem chi tiết
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* No Results */}
            {!loading && cars.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy xe phù hợp
                  </h3>
                  <p>Thử điều chỉnh bộ lọc để tìm thấy xe phù hợp hơn</p>
                </div>
                <Button onClick={resetFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CarDetailDialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setSelectedCarId(null);
            setCarDetail(null);
            setDetailError(null);
          }
        }}
        car={carDetail}
        loading={detailLoading}
        error={detailError}
        onRetry={selectedCarId ? () => loadCarDetail(selectedCarId) : undefined}
      />
    </div>
  );
}
