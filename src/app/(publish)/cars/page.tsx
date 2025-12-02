"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Star, Users, Fuel, Settings, Eye, Calendar, Car } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import carsData from "@/data/mock-cars.json";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";

interface Car {
  id: string;
  name: string;
  description: string;
  seats: number;
  brand: string;
  transmission: string;
  fuel: string;
  area: string;
  rating: number;
  reviewCount: number;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  features: string[];
  status: string;
}

const ITEMS_PER_PAGE = 6; // 3 items per row on web, 2 rows = 6 items per page

interface CarFilters {
  seats: string;
  brand: string;
  transmission: string;
  fuel: string;
  area: string;
  rating: string;
}

export default function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>({
    seats: "all",
    brand: "all",
    transmission: "all",
    fuel: "all",
    area: "all",
    rating: "0",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");

  const cars: Car[] = carsData.cars;

  // Get unique values for filters
  const uniqueSeats = [...new Set(cars.map((car) => car.seats))].sort(
    (a, b) => a - b
  );
  const uniqueBrands = [...new Set(cars.map((car) => car.brand))].sort();
  const uniqueTransmissions = [
    ...new Set(cars.map((car) => car.transmission)),
  ].sort();
  const uniqueFuels = [...new Set(cars.map((car) => car.fuel))].sort();
  const uniqueAreas = [...new Set(cars.map((car) => car.area))].sort();

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    const minRating = parseFloat(filters.rating);

    let filtered = cars.filter((car) => {
      return (
        (filters.seats === "all" || car.seats.toString() === filters.seats) &&
        (filters.brand === "all" || car.brand === filters.brand) &&
        (filters.transmission === "all" ||
          car.transmission === filters.transmission) &&
        (filters.fuel === "all" || car.fuel === filters.fuel) &&
        (filters.area === "all" || car.area === filters.area) &&
        car.rating >= minRating
      );
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.pricePerHour - b.pricePerHour;
        case "price-high":
          return b.pricePerHour - a.pricePerHour;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [cars, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
      transmission: "all",
      fuel: "all",
      area: "all",
      rating: "0",
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof CarFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
      key: "transmission",
      label: "Loại xe",
      placeholder: "Chọn loại xe",
      options: [
        { value: "all", label: "Tất cả" },
        ...uniqueTransmissions.map((transmission) => ({
          value: transmission,
          label: transmission,
        })),
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
    {
      key: "area",
      label: "Khu vực",
      placeholder: "Chọn khu vực",
      options: [
        { value: "all", label: "Tất cả" },
        ...uniqueAreas.map((area) => ({ value: area, label: area })),
      ],
    },
    {
      key: "rating",
      label: "Đánh giá tối thiểu",
      placeholder: "Chọn đánh giá",
      options: [
        { value: "0", label: "Tất cả" },
        { value: "4", label: "4+ sao" },
        { value: "4.5", label: "4.5+ sao" },
        { value: "4.8", label: "4.8+ sao" },
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
            />
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCars.map((car) => (
                <Card
                  key={car.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0"
                >
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#10b981] text-white">
                      {car.status === "available" ? "Có sẵn" : "Không có sẵn"}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{car.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {car.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{car.seats} chỗ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4 text-gray-500" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">
                          {car.brand}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({car.reviewCount} đánh giá)
                      </span>
                    </div>

                    <div className="text-lg font-bold mb-3">
                      {formatPrice(car.pricePerHour)}/giờ
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" variant="green" asChild>
                      <Link
                        href={`/details?car=${car.id}`}
                        className="flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* No Results */}
            {filteredCars.length === 0 && (
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
    </div>
  );
}
