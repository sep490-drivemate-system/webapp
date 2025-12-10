"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getListInstructors } from "@/features/instructor/instructorThunk";
import type { IInstructors } from "@/types/instructor/instructor-management.types";
import { InstructorCard } from "@/components/instructor/instructor-card";

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
                return (
                  <InstructorCard key={instructor.id} instructor={instructor} />
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
