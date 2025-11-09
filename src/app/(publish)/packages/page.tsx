"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Clock,
  Car,
  Filter,
  Search,
  Package
} from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import instructorsData from "@/data/mock-instructors-enhanced.json";

interface Instructor {
  id: string;
  name: string;
  bio: string;
  experience: number;
  area: string;
  rating: number;
  reviewCount: number;
  status: string;
  avatar: string;
  specialties: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  phone: string;
  email: string;
}

// Mock package data based on instructors
interface PackageType {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRating: number;
  instructorReviews: number;
  packageName: string;
  description: string;
  totalHours: number;
  pricePerHour: number;
  totalPrice: number;
  hasVehicle: boolean;
  vehicleType?: string;
  skills: string[];
  roadTypes: string[];
  area: string;
  discount?: number;
  popular?: boolean;
}

const ITEMS_PER_PAGE = 9;

// Road type options
const ROAD_TYPES = [
  "Đường khu dân cư",
  "Đường đô thị",
  "Quốc lộ",
  "Đường cao tốc",
  "Đường đèo",
  "Đường trường",
  "Đường qua khu đông dân cư",
  "Đường đang thi công",
  "Đường trơn trượt"
];

export default function PackagesPage() {
  const [filters, setFilters] = useState({
    area: "all",
    roadType: "all",
    hasVehicle: "all",
    priceRange: "all",
    hours: "all"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const instructors: Instructor[] = instructorsData.instructors;

  // Generate mock packages from instructors
  const packages: PackageType[] = useMemo(() => {
    const mockPackages: PackageType[] = [];

    instructors.forEach((instructor, idx) => {
      // Basic package
      mockPackages.push({
        id: `pkg_${instructor.id}_basic`,
        instructorId: instructor.id,
        instructorName: instructor.name,
        instructorAvatar: instructor.avatar,
        instructorRating: instructor.rating,
        instructorReviews: instructor.reviewCount,
        packageName: "Gói luyện tập cơ bản",
        description: "Phù hợp cho người mới bắt đầu, tập trung vào kỹ năng cơ bản",
        totalHours: 20,
        pricePerHour: instructor.pricePerHour,
        totalPrice: instructor.pricePerHour * 20,
        hasVehicle: true,
        vehicleType: "Toyota Vios 2023",
        skills: instructor.specialties.slice(0, 2),
        roadTypes: ["Đường khu dân cư", "Đường đô thị"],
        area: instructor.area,
        popular: idx % 3 === 0
      });

      // Advanced package
      if (instructor.experience > 5) {
        mockPackages.push({
          id: `pkg_${instructor.id}_advanced`,
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorAvatar: instructor.avatar,
          instructorRating: instructor.rating,
          instructorReviews: instructor.reviewCount,
          packageName: "Gói nâng cao",
          description: "Luyện tập các kỹ năng nâng cao, đường phức tạp",
          totalHours: 40,
          pricePerHour: instructor.pricePerHour * 1.1,
          totalPrice: instructor.pricePerHour * 1.1 * 40,
          hasVehicle: true,
          vehicleType: "Honda City 2023",
          skills: instructor.specialties,
          roadTypes: ["Quốc lộ", "Đường cao tốc", "Đường đô thị"],
          area: instructor.area,
          discount: 10
        });
      }

      // Highway package
      if (instructor.experience > 8) {
        mockPackages.push({
          id: `pkg_${instructor.id}_highway`,
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorAvatar: instructor.avatar,
          instructorRating: instructor.rating,
          instructorReviews: instructor.reviewCount,
          packageName: "Gói luyện cao tốc",
          description: "Chuyên luyện kỹ năng lái xe trên đường cao tốc",
          totalHours: 15,
          pricePerHour: instructor.pricePerHour * 1.2,
          totalPrice: instructor.pricePerHour * 1.2 * 15,
          hasVehicle: false,
          skills: ["Cao tốc", "Giữ làn", "Vượt xe"],
          roadTypes: ["Đường cao tốc", "Quốc lộ"],
          area: instructor.area
        });
      }
    });

    return mockPackages;
  }, [instructors]);

  // Get unique values for filters
  const uniqueAreas = [...new Set(packages.map(pkg => pkg.area))].sort();

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = searchQuery === "" ||
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesArea = filters.area === "all" || pkg.area === filters.area;

      const matchesRoadType = filters.roadType === "all" ||
        pkg.roadTypes.includes(filters.roadType);

      const matchesVehicle = filters.hasVehicle === "all" ||
        (filters.hasVehicle === "yes" && pkg.hasVehicle) ||
        (filters.hasVehicle === "no" && !pkg.hasVehicle);

      const matchesPrice = filters.priceRange === "all" ||
        (filters.priceRange === "low" && pkg.pricePerHour < 200000) ||
        (filters.priceRange === "medium" && pkg.pricePerHour >= 200000 && pkg.pricePerHour < 300000) ||
        (filters.priceRange === "high" && pkg.pricePerHour >= 300000);

      const matchesHours = filters.hours === "all" ||
        (filters.hours === "short" && pkg.totalHours <= 20) ||
        (filters.hours === "medium" && pkg.totalHours > 20 && pkg.totalHours <= 40) ||
        (filters.hours === "long" && pkg.totalHours > 40);

      return matchesSearch && matchesArea && matchesRoadType && matchesVehicle && matchesPrice && matchesHours;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.instructorRating - a.instructorRating;
        case "price-low":
          return a.totalPrice - b.totalPrice;
        case "price-high":
          return b.totalPrice - a.totalPrice;
        case "rating":
          return b.instructorRating - a.instructorRating;
        case "hours-low":
          return a.totalHours - b.totalHours;
        case "hours-high":
          return b.totalHours - a.totalHours;
        default:
          return 0;
      }
    });

    return filtered;
  }, [packages, filters, sortBy, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      area: "all",
      roadType: "all",
      hasVehicle: "all",
      priceRange: "all",
      hours: "all"
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách gói dịch vụ</h1>

        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm gói thuê"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Bộ lọc
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Xóa
                  </Button>
                </div>

                <div className="space-y-6">

                  {/* Road Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Loại đường</label>
                    <Select value={filters.roadType} onValueChange={(value) => setFilters({ ...filters, roadType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {ROAD_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vehicle Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Xe tập</label>
                    <Select value={filters.hasVehicle} onValueChange={(value) => setFilters({ ...filters, hasVehicle: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Có xe hay không" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="yes">Có xe tập</SelectItem>
                        <SelectItem value="no">Không có xe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  {/* Hours Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số giờ</label>
                    <Select value={filters.hours} onValueChange={(value) => setFilters({ ...filters, hours: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="short">≤ 20 giờ</SelectItem>
                        <SelectItem value="medium">21-40 giờ</SelectItem>
                        <SelectItem value="long">&gt; 40 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">{pkg.packageName}</h3>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pb-3 border-b flex-shrink-0">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={pkg.instructorAvatar} alt={pkg.instructorName} />
                        <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{pkg.instructorName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{pkg.instructorRating}</span>
                          <span className="text-gray-400">({pkg.instructorReviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-2 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium">{pkg.totalHours} giờ</span>
                        <span className="text-gray-500">•</span>
                      </div>
                      {pkg.hasVehicle ? (
                        <div className="flex items-center gap-2 text-sm">                          
                          <span className="text-green-700 font-medium">Người hướng dẫn + Xe</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Chỉ người hướng dẫn</span>
                        </div>
                      )}
                    </div>

                    {/* Skills & Road Types */}
                    <div className="flex-1 flex flex-col gap-2 min-h-[4rem]">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Kỹ năng:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                        <p className="text-xs text-gray-500 mb-1">Loại đường:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.roadTypes.slice(0, 2).map((road, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
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
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <span className="text-2xl font-bold ">
                            {formatPrice(pkg.totalPrice)}
                          </span>
                        </div>
                      </div>

                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-4 px-6 flex gap-2 flex-shrink-0">
                    <Button variant="green" className="flex-1" size="sm">
                      Mua ngay
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructors/${pkg.instructorId}`}>
                        Chi tiết
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

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
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
                    );
                  })}

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
            {filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy gói phù hợp</h3>
                  <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm để tìm gói phù hợp hơn</p>
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
