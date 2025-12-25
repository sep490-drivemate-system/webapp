"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getRecommendedPackages } from "@/features/package/packageThunk";
import { getRecommendedInstructors } from "@/features/instructor/instructorThunk";
import { getRecommendedCars } from "@/features/car/carThunk";
import type { Package as DrivingPackage } from "@/types/package/package.type";
import { PackageServiceCard } from "@/components/package/package-service-card";
import type { IInstructors } from "@/types/instructor/instructor-management.types";
import { InstructorCard } from "@/components/instructor/instructor-card";
import { CarCard } from "@/components/car/car-card";
import { ICar } from "@/types/car/car.type";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [recommendedPackages, setRecommendedPackages] = useState<
    DrivingPackage[]
  >([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);
  const [recommendedInstructors, setRecommendedInstructors] = useState<
    IInstructors[]
  >([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructorsError, setInstructorsError] = useState<string | null>(null);
  const [recommendedCars, setRecommendedCars] = useState<ICar[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoadingRecommended(true);
      setRecommendedError(null);
      try {
        const response = await dispatch(getRecommendedPackages()).unwrap();
        setRecommendedPackages(response?.value ?? []);
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : "Không thể tải danh sách gói dịch vụ nổi bật";
        setRecommendedError(message);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, [dispatch]);

  const topRecommended = useMemo(
    () => recommendedPackages.slice(0, 3),
    [recommendedPackages]
  );

  useEffect(() => {
    const fetchRecommendedInstructors = async () => {
      setLoadingInstructors(true);
      setInstructorsError(null);
      try {
        const response = await dispatch(getRecommendedInstructors()).unwrap();
        setRecommendedInstructors(response?.value ?? []);
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : "Không thể tải danh sách người hướng dẫn nổi bật";
        setInstructorsError(message);
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchRecommendedInstructors();
  }, [dispatch]);

  const topInstructors = useMemo(
    () => recommendedInstructors.slice(0, 4),
    [recommendedInstructors]
  );

  const topCars = useMemo(() => recommendedCars.slice(0, 4), [recommendedCars]);

  useEffect(() => {
    const fetchRecommendedCars = async () => {
      setLoadingCars(true);
      setCarsError(null);
      try {
        const response = await dispatch(getRecommendedCars()).unwrap();
        setRecommendedCars(response?.value ?? []);
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : "Không thể tải danh sách xe nổi bật";
        setCarsError(message);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchRecommendedCars();
  }, [dispatch]);

  return (
    <div className="bg-gray-50">
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
                Bổ túc lái xe an toàn cùng người hướng dẫn chuyên nghiệp
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                DriveMate kết nối bạn với những giáo viên lái xe có kinh nghiệm
                nhất. Học lái xe hiệu quả, an toàn với lịch trình linh hoạt theo
                nhu cầu của bạn.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Giáo viên lái xe đang hướng dẫn học viên"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Gói dịch vụ nổi bật
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/packages">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {recommendedError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {recommendedError}
            </div>
          )}
          {loadingRecommended && (
            <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
              Đang tải các gói dịch vụ nổi bật...
            </div>
          )}
          {!loadingRecommended &&
            topRecommended.length === 0 &&
            !recommendedError && (
              <div className="mb-4 rounded-md bg-gray-50 p-4 text-gray-700">
                Chưa có gói dịch vụ nổi bật để hiển thị
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRecommended.map((pkg) => (
              <PackageServiceCard
                key={pkg.id}
                pkg={pkg}
                actionHref={`/instructors/${pkg.instructorId}`}
                actionLabel="Xem chi tiết"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Người hướng dẫn nổi bật
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/instructors">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {instructorsError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {instructorsError}
            </div>
          )}
          {loadingInstructors && (
            <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
              Đang tải danh sách người hướng dẫn nổi bật...
            </div>
          )}
          {!loadingInstructors &&
            topInstructors.length === 0 &&
            !instructorsError && (
              <div className="mb-4 rounded-md bg-gray-50 p-4 text-gray-700">
                Chưa có người hướng dẫn nổi bật để hiển thị
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topInstructors.map((instructor) => (
              <InstructorCard
                key={instructor.id}
                instructor={instructor}
                cardClassName="hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Xe tập nổi bật
              </h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/cars">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {carsError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
              {carsError}
            </div>
          )}
          {loadingCars && (
            <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
              Đang tải danh sách xe nổi bật...
            </div>
          )}
          {!loadingCars && topCars.length === 0 && !carsError && (
            <div className="mb-4 rounded-md bg-gray-50 p-4 text-gray-700">
              Chưa có xe nổi bật để hiển thị
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                actionHref={`/cars/${car.id}`}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
