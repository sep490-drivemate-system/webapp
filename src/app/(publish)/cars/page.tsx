"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, Users, Fuel, Settings, Eye, Calendar, Car } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import carsData from "@/data/mock-cars.json";

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

export default function CarsPage() {
  const [filters, setFilters] = useState({
    seats: "all",
    brand: "all",
    transmission: "all",
    fuel: "all",
    area: "all",
    priceRange: [0, 300000],
    rating: 0
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");

  const cars: Car[] = carsData.cars;

  // Get unique values for filters
  const uniqueSeats = [...new Set(cars.map(car => car.seats))].sort((a, b) => a - b);
  const uniqueBrands = [...new Set(cars.map(car => car.brand))].sort();
  const uniqueTransmissions = [...new Set(cars.map(car => car.transmission))].sort();
  const uniqueFuels = [...new Set(cars.map(car => car.fuel))].sort();
  const uniqueAreas = [...new Set(cars.map(car => car.area))].sort();

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let filtered = cars.filter(car => {
      return (
        (filters.seats === "all" || car.seats.toString() === filters.seats) &&
        (filters.brand === "all" || car.brand === filters.brand) &&
        (filters.transmission === "all" || car.transmission === filters.transmission) &&
        (filters.fuel === "all" || car.fuel === filters.fuel) &&
        (filters.area === "all" || car.area === filters.area) &&
        (car.pricePerHour >= filters.priceRange[0] && car.pricePerHour <= filters.priceRange[1]) &&
        (car.rating >= filters.rating)
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
  const paginatedCars = filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      seats: "all",
      brand: "all",
      transmission: "all",
      fuel: "all",
      area: "all",
      priceRange: [0, 300000],
      rating: 0
    });
    setCurrentPage(1);
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách xe tập lái</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bộ lọc</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Seats Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số chỗ ngồi</label>
                    <Select value={filters.seats} onValueChange={(value) => setFilters({ ...filters, seats: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số chỗ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueSeats.map(seats => (
                          <SelectItem key={seats} value={seats.toString()}>{seats} chỗ</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hãng xe</label>
                    <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hãng xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transmission Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Loại xe</label>
                    <Select value={filters.transmission} onValueChange={(value) => setFilters({ ...filters, transmission: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueTransmissions.map(transmission => (
                          <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fuel Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nhiên liệu</label>
                    <Select value={filters.fuel} onValueChange={(value) => setFilters({ ...filters, fuel: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhiên liệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueFuels.map(fuel => (
                          <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0">
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      {car.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{car.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{car.description}</p>

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
                        <span className="font-medium text-gray-700">{car.brand}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="text-gray-500 text-sm">({car.reviewCount} đánh giá)</span>
                    </div>

                    <div className="text-lg font-bold mb-3">
                      {formatPrice(car.pricePerHour)}/giờ
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white" asChild>
                      <Link href={`/details?car=${car.id}`} className="flex items-center justify-center gap-2">
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
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* No Results */}
            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy xe phù hợp</h3>
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
