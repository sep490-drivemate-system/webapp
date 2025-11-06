"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Eye, Calendar, Award, CheckCircle } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

const ITEMS_PER_PAGE = 6; // 3 items per row on web, 2 rows = 6 items per page

export default function InstructorsPage() {
  const [filters, setFilters] = useState({
    area: "all",
    rating: 0,
    experience: "all"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");

  const instructors: Instructor[] = instructorsData.instructors;

  // Get unique values for filters
  const uniqueAreas = [...new Set(instructors.map(instructor => instructor.area))].sort();

  // Filter and sort instructors
  const filteredInstructors = useMemo(() => {
    let filtered = instructors.filter(instructor => {
      return (
        instructor.status === "approved" &&
        (filters.area === "all" || instructor.area === filters.area) &&
        (instructor.rating >= filters.rating) &&
        (filters.experience === "all" ||
          (filters.experience === "beginner" && instructor.experience <= 5) ||
          (filters.experience === "experienced" && instructor.experience > 5 && instructor.experience <= 10) ||
          (filters.experience === "expert" && instructor.experience > 10))
      );
    });

    // Sort instructors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return b.experience - a.experience;
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
  }, [instructors, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInstructors = filteredInstructors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      area: "all",
      rating: 0,
      experience: "all"
    });
    setCurrentPage(1);
  };

  const getExperienceLevel = (years: number) => {
    if (years <= 5) return "Mới vào nghề";
    if (years <= 10) return "Có kinh nghiệm";
    return "Chuyên gia";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách người hướng dẫn</h1>
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
                  {/* Area Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Khu vực</label>
                    <Select value={filters.area} onValueChange={(value) => setFilters({ ...filters, area: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueAreas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Kinh nghiệm</label>
                    <Select value={filters.experience} onValueChange={(value) => setFilters({ ...filters, experience: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="beginner">Mới vào nghề (≤5 năm)</SelectItem>
                        <SelectItem value="experienced">Có kinh nghiệm (6-10 năm)</SelectItem>
                        <SelectItem value="expert">Chuyên gia (&gt;10 năm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Đánh giá tối thiểu</label>
                    <Select value={filters.rating.toString()} onValueChange={(value) => setFilters({ ...filters, rating: parseFloat(value) })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đánh giá" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Tất cả</SelectItem>
                        <SelectItem value="4">4+ sao</SelectItem>
                        <SelectItem value="4.5">4.5+ sao</SelectItem>
                        <SelectItem value="4.8">4.8+ sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructors Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600 text-sm">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredInstructors.length)} trong {filteredInstructors.length} người hướng dẫn
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="experience">Kinh nghiệm nhiều nhất</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="reviews">Nhiều đánh giá nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedInstructors.map((instructor) => (
                <Card key={instructor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  <CardContent className="p-6 flex-1 flex flex-col space-y-4 pb-4">
                    {/* Header with Avatar and Badge */}
                    <div className="flex items-start gap-3 pb-3 border-b flex-shrink-0">
                      <Avatar className="h-14 w-14 flex-shrink-0">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{instructor.name}</h3>
                      </div>

                    </div>

                    {/* Bio */}
                    <div className="flex-shrink-0">
                      <p className="text-gray-600 text-sm line-clamp-3 min-h-[3.75rem]">
                        {instructor.bio}
                      </p>
                    </div>

                    {/* Location and Experience Level */}
                    <div className="space-y-2 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{instructor.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{getExperienceLevel(instructor.experience)}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex-1 flex flex-col gap-2 min-h-[3rem]">
                      <p className="text-xs text-gray-500">Chuyên môn:</p>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {instructor.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{instructor.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{instructor.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({instructor.reviewCount} đánh giá)</span>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0">
                      <div className="text-xl font-bold text-blue-600">
                        {formatPrice(instructor.pricePerHour)}/giờ
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 pb-4 px-6 flex gap-2 flex-shrink-0">
                    <Button className="flex-1" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Đặt ngay
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructors/${instructor.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
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
            {filteredInstructors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy người hướng dẫn phù hợp</h3>
                  <p>Thử điều chỉnh bộ lọc để tìm thấy người hướng dẫn phù hợp hơn</p>
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
