"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Eye,
  Calendar,
  Award,
  CheckCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import instructorsData from "@/data/mock-instructors-enhanced.json";
import packagesData from "@/data/mock-packages.json";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";

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

interface InstructorFilters {
  area: string;
  rating: string;
  experience: string;
}

const ITEMS_PER_PAGE = 6; // 3 items per row on web, 2 rows = 6 items per page

export default function InstructorsPage() {
  const [filters, setFilters] = useState<InstructorFilters>({
    area: "all",
    rating: "0",
    experience: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");

  const instructors: Instructor[] = instructorsData.instructors;

  // Get unique values for filters
  const uniqueAreas = [
    ...new Set(instructors.map((instructor) => instructor.area)),
  ].sort();

  // Filter and sort instructors
  const filteredInstructors = useMemo(() => {
    const minRating = parseFloat(filters.rating);

    let filtered = instructors.filter((instructor) => {
      return (
        instructor.status === "approved" &&
        (filters.area === "all" || instructor.area === filters.area) &&
        instructor.rating >= minRating &&
        (filters.experience === "all" ||
          (filters.experience === "beginner" && instructor.experience <= 5) ||
          (filters.experience === "experienced" &&
            instructor.experience > 5 &&
            instructor.experience <= 10) ||
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
  const paginatedInstructors = filteredInstructors.slice(
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
      area: "all",
      rating: "0",
      experience: "all",
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof InstructorFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const instructorFilterSections: FilterSection<InstructorFilters>[] = [
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
      key: "experience",
      label: "Kinh nghiệm",
      placeholder: "Chọn mức kinh nghiệm",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "beginner", label: "Mới vào nghề (≤5 năm)" },
        { value: "experienced", label: "Có kinh nghiệm (6-10 năm)" },
        { value: "expert", label: "Chuyên gia (>10 năm)" },
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

  const getExperienceLevel = (years: number) => {
    if (years <= 5) return "Mới vào nghề";
    if (years <= 10) return "Có kinh nghiệm";
    return "Chuyên gia";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPackageCount = (instructorId: string) => {
    return packagesData.packages.filter(
      (pkg) => pkg.instructorId === instructorId
    ).length;
  };

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <PageSectionHeader
          title="Danh sách người hướng dẫn"
          description="Tìm kiếm người hướng dẫn phù hợp với khu vực, kinh nghiệm và ngân sách của bạn."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PackageFilterSidebar
              filters={filters}
              sections={instructorFilterSections}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          {/* Instructors Grid */}
          <div className="lg:col-span-3">
            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedInstructors.map((instructor) => (
                <Card
                  key={instructor.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  <CardContent className="p-6 flex-1 flex flex-col space-y-4 pb-4">
                    {/* Header with Avatar and Badge */}
                    <div className="flex items-start gap-3 pb-3 border-b flex-shrink-0">
                      <Avatar className="h-14 w-14 flex-shrink-0">
                        <AvatarImage
                          src={instructor.avatar}
                          alt={instructor.name}
                        />
                        <AvatarFallback>
                          {getInitials(instructor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate mb-1">
                          {instructor.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-sm">
                              {instructor.rating}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            ({instructor.reviewCount} lượt thuê)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="flex-shrink-0">
                      <p className="text-gray-600 text-sm line-clamp-3 min-h-[3.75rem]">
                        {instructor.bio}
                      </p>
                    </div>

                    {/* Package Count */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">
                        {getPackageCount(instructor.id)} gói thuê
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 pb-6 px-6">
                    <Button className="w-full" variant="green" asChild>
                      <Link href={`/instructors/${instructor.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
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
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* No Results */}
            {filteredInstructors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy người hướng dẫn phù hợp
                  </h3>
                  <p>
                    Thử điều chỉnh bộ lọc để tìm thấy người hướng dẫn phù hợp
                    hơn
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
