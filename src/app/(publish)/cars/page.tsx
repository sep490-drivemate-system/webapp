"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { getCarById, getCars, getManufacturers } from "@/features/car/carThunk";
import { IBrandCar, ICar, ICarDetail } from "@/types/car/car.type";
import { CarDetailDialog } from "@/components/car/car-detail-dialog";
import { CarCard } from "@/components/car/car-card";
import { CarStatus } from "@/types/constants/enum";

const PAGE_SIZE = 6; 
const SEAT_OPTIONS = [4, 5, 7, 9, 16, 29, 35, 45];
const FUEL_OPTIONS = ["Xăng", "Dầu", "Điện", "Hybrid"];

interface CarFilters {
  seats: string;
  brand: string;
  fuel: string;
}

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
  const { run: fetchManufacturers } = useThunkAction(getManufacturers);
  const [brands, setBrands] = useState<IBrandCar[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [carDetail, setCarDetail] = useState<ICarDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    fetchManufacturers(undefined, {
      onSuccess: (res) => setBrands(res?.value ?? []),
    });
  }, [fetchManufacturers]);

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
        status: CarStatus.Approved,
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

  const brandOptions = useMemo(
    () =>
      [...brands]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((brand) => ({ value: brand.name, label: brand.name })),
    [brands]
  );

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0;

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
        ...SEAT_OPTIONS.map((seats) => ({
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
        ...brandOptions,
      ],
    },
    {
      key: "fuel",
      label: "Nhiên liệu",
      placeholder: "Chọn nhiên liệu",
      options: [
        { value: "all", label: "Tất cả" },
        ...FUEL_OPTIONS.map((fuel) => ({ value: fuel, label: fuel })),
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
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onViewDetail={handleOpenDetail}
                    className="gap-0"
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

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
