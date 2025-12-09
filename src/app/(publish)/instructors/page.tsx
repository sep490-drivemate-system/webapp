"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Eye, Award, Package } from "lucide-react";
import Link from "next/link";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getListInstructors } from "@/features/instructor/instructorThunk";
import type { IInstructors } from "@/types/instructor/instructor-management.types";

interface InstructorFilters {
  rating: string;
  experience: string;
}

const ITEMS_PER_PAGE = 6;

export default function InstructorsPage() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<InstructorFilters>({
    rating: "0",
    experience: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState<IInstructors[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dispatch(
          getListInstructors({
            pageNumber: currentPage,
            pageSize: ITEMS_PER_PAGE,
          })
        ).unwrap();

        const data = response.value;
        setInstructors(data?.pageContent ?? []);
        setTotalCount(data?.totalCount ?? 0);
      } catch (err) {
        const message =
          typeof err === "string"
            ? err
            : "Không thể tải danh sách người hướng dẫn";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [currentPage, dispatch]);

  const parseExperienceYears = (value: string) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const filteredInstructors = useMemo(() => {
    const minRating = parseFloat(filters.rating);

    return instructors
      .filter((instructor) => {
        const experienceYears = parseExperienceYears(instructor.experienceYear);

        return (
          (instructor.averageRating ?? 0) >= minRating &&
          (filters.experience === "all" ||
            (filters.experience === "beginner" && experienceYears <= 5) ||
            (filters.experience === "experienced" &&
              experienceYears > 5 &&
              experienceYears <= 10) ||
            (filters.experience === "expert" && experienceYears > 10))
        );
      })
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  }, [filters, instructors]);

  const totalPages =
    totalCount > 0 ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

  const paginatedInstructors = filteredInstructors;

  const resetFilters = () => {
    setFilters({
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
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            {loading && (
              <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
                Đang tải danh sách người hướng dẫn...
              </div>
            )}

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedInstructors.map((instructor) => {
                const experienceYears = parseExperienceYears(
                  instructor.experienceYear
                );

                return (
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
                            alt={instructor.fullName}
                          />
                          <AvatarFallback>
                            {getInitials(instructor.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate mb-1">
                            {instructor.fullName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-sm">
                                {instructor.averageRating?.toFixed(1) ?? "0"}
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              ({instructor.bookingCount} lượt đặt)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {getExperienceLevel(experienceYears)} •{" "}
                            {experienceYears} năm kinh nghiệm
                          </p>
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
                          {instructor.packageCount} gói thuê
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
                );
              })}
            </div>

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* No Results */}
            {!loading && paginatedInstructors.length === 0 && (
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
