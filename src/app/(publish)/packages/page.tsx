"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Package as PackageIcon } from "lucide-react";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { SearchBar } from "@/components/commons/search-bar";
import { PaginationControls } from "@/components/commons/pagination-controls";
import {
  PackageFilterSidebar,
  type FilterSection,
} from "@/components/commons/package-filter-sidebar";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import {
  getDrivingSkills,
  getListPackages,
  getRoadTypes,
} from "@/features/package/packageThunk";
import type {
  DrivingSkill,
  Package as DrivingPackage,
  PaginatedPackagesResponse,
  RoadType,
} from "@/types/package/package.type";
import { PackageServiceCard } from "@/components/package/package-service-card";

const ITEMS_PER_PAGE = 6;

interface PackageFilters {
  roadType: string;
  drivingSkill: string;
  isRentalCar: string;
}

export default function PackagesPage() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<PackageFilters>({
    roadType: "all",
    drivingSkill: "all",
    isRentalCar: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [roadTypes, setRoadTypes] = useState<RoadType[]>([]);
  const [drivingSkills, setDrivingSkills] = useState<DrivingSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterSections: FilterSection<PackageFilters>[] = useMemo(
    () => [
      {
        key: "roadType",
        label: "Loại đường",
        placeholder: "Chọn loại đường",
        options: [
          { value: "all", label: "Tất cả" },
          ...roadTypes.map((type) => ({ value: type.id, label: type.name })),
        ],
      },
      {
        key: "drivingSkill",
        label: "Kỹ năng",
        placeholder: "Chọn kỹ năng",
        options: [
          { value: "all", label: "Tất cả" },
          ...drivingSkills.map((skill) => ({
            value: skill.id,
            label: skill.display_name,
          })),
        ],
      },
      {
        key: "isRentalCar",
        label: "Lựa chọn xe",
        placeholder: "Chọn tùy chọn",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "true", label: "Có kèm thuê xe" },
          { value: "false", label: "Không kèm thuê xe" },
        ],
      },
    ],
    [drivingSkills, roadTypes]
  );

  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        const [roadTypeResponse, drivingSkillResponse] = await Promise.all([
          dispatch(getRoadTypes()).unwrap(),
          dispatch(getDrivingSkills()).unwrap(),
        ]);

        const normalize = <T,>(res: unknown): T => (res as { value?: T })?.value ?? (res as T);

        setRoadTypes(normalize<RoadType[]>(roadTypeResponse) ?? []);
        setDrivingSkills(normalize<DrivingSkill[]>(drivingSkillResponse) ?? []);
      } catch (err) {
        console.error("Không thể tải dữ liệu bộ lọc", err);
      }
    };

    fetchFilterMetadata();
  }, [dispatch]);

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
            roadTypes: filters.roadType !== "all" ? [filters.roadType] : undefined,
            drivingSkills:
              filters.drivingSkill !== "all" ? [filters.drivingSkill] : undefined,
            isRentalCar:
              filters.isRentalCar === "true"
                ? true
                : filters.isRentalCar === "false"
                ? false
                : undefined,
          })
        ).unwrap();

        const data = (response?.value ?? response) as
          | DrivingPackage[]
          | PaginatedPackagesResponse
          | undefined;

        if (data && "pageContent" in data) {
          setPackages(data.pageContent ?? []);
          setTotalCount(data.totalCount ?? 0);
        } else if (Array.isArray(data)) {
          setPackages(data);
          setTotalCount(data.length);
        } else {
          setPackages([]);
          setTotalCount(0);
        }
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
    filters.roadType,
    filters.drivingSkill,
    filters.isRentalCar,
    dispatch,
  ]);

  const sortedPackages = useMemo(
    () => [...packages].sort((a, b) => b.bookingCount - a.bookingCount),
    [packages]
  );

  const totalPages =
    totalCount > 0 ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

  const resetFilters = () => {
    setFilters({
      roadType: "all",
      drivingSkill: "all",
      isRentalCar: "all",
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
              sections={filterSections}
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
              {sortedPackages.map((pkg) => (
                <PackageServiceCard key={pkg.id} pkg={pkg} />
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
            {!loading && sortedPackages.length === 0 && (
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
