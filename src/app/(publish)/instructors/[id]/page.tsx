"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CarDetailDialog } from "@/components/car/car-detail-dialog";
import {
  Star,
  Calendar as CalendarIcon,
  Award,
  CheckCircle,
  User,
  Package,
  Car,
} from "lucide-react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { GenericResponse } from "@/types/generic/genericResponse";
import {
  IInstructorPackages,
  IInstructors,
} from "@/types/instructor/instructor-management.types";
import { Gender } from "@/types/user/gender.enum";
import { Loader2 } from "lucide-react";
import { ICar, ICarDetail } from "@/types/car/car.type";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { getCarById, getCarsForInstructor } from "@/features/car/carThunk";
import { getInstructorReviews } from "@/features/reviews/reviewThunk";
import { InstructorRevew } from "@/types/reviews/reviews.type";

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.id as string;
  const [instructor, setInstructor] = useState<IInstructors | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<IInstructorPackages[]>([]);
  const [packagesLoading, setPackagesLoading] = useState<boolean>(false);
  const [packagesError, setPackagesError] = useState<string | null>(null);
  const [cars, setCars] = useState<ICar[]>([]);
  const [carsError, setCarsError] = useState<string | null>(null);
  const [carDetailOpen, setCarDetailOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [carDetail, setCarDetail] = useState<ICarDetail | null>(null);
  const [carDetailError, setCarDetailError] = useState<string | null>(null);
  const { run: fetchCarsForInstructor, loading: carsLoading } =
    useThunkAction(getCarsForInstructor);
  const { run: fetchCarDetail, loading: carDetailLoading } =
    useThunkAction(getCarById);
  const { run: fetchInstructorReviews, loading: reviewsLoading } =
    useThunkAction(getInstructorReviews);

  const [reviews, setReviews] = useState<InstructorRevew[]>([]);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get<GenericResponse<IInstructors>>(
          `/instructors/${instructorId}`
        );
        if (response.data?.value) {
          setInstructor(response.data.value);
        } else {
          setError("Không tìm thấy người hướng dẫn");
        }
      } catch (err) {
        setError("Không thể tải thông tin người hướng dẫn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (instructorId) {
      fetchInstructor();
    }
  }, [instructorId]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);
        setPackagesError(null);
        const response = await axiosInstance.get<
          GenericResponse<IInstructorPackages[]>
        >(`/package/instructor/${instructorId}`);
        if (response.data?.value) {
          setPackages(response.data.value);
        } else {
          setPackages([]);
        }
      } catch (err) {
        setPackagesError("Không thể tải gói dịch vụ. Vui lòng thử lại.");
      } finally {
        setPackagesLoading(false);
      }
    };

    if (instructorId) {
      fetchPackages();
    }
  }, [instructorId]);

  useEffect(() => {
    if (!instructorId) return;
    setCarsError(null);
    fetchCarsForInstructor(
      { id: instructorId },
      {
        onSuccess: (res) => {
          setCars(res?.value ?? []);
        },
        onError: () => {
          setCars([]);
          setCarsError("Không thể tải danh sách xe. Vui lòng thử lại.");
        },
      }
    );
  }, [fetchCarsForInstructor, instructorId]);

  useEffect(() => {
    if (!instructorId) return;
    setReviewsError(null);
    fetchInstructorReviews(
      { id: instructorId },
      {
        onSuccess: (res) => {
          const apiReviews = res?.value ?? [];
          setReviews(apiReviews);
        },
        onError: () => {
          setReviews([]);
          setReviewsError(
            "Không thể tải đánh giá cho người hướng dẫn. Vui lòng thử lại."
          );
        },
      }
    );
  }, [fetchInstructorReviews, instructorId]);

  const experienceYears = useMemo(() => {
    const parsed = Number(instructor?.experienceYear ?? 0);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [instructor]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateTotalPrice = () => {
    return 0;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleBuyPackage = (pkg: IInstructorPackages) => {
    console.log("Buy package", pkg.id);
  };

  const loadCarDetail = (carId: string) => {
    setCarDetail(null);
    setCarDetailError(null);
    fetchCarDetail(
      { id: carId },
      {
        onSuccess: (res) => {
          const detail = res?.value ?? null;
          if (detail) {
            setCarDetail(detail);
          } else {
            setCarDetailError("Không tìm thấy thông tin xe.");
          }
        },
        onError: () => {
          setCarDetailError("Không thể tải chi tiết xe. Vui lòng thử lại.");
        },
      }
    );
  };

  const handleViewCarDetail = (carId: string) => {
    setCarDetailOpen(true);
    setSelectedCarId(carId);
    loadCarDetail(carId);
  };

  const handleRetryCarDetail = () => {
    if (selectedCarId) {
      loadCarDetail(selectedCarId);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getExperienceLevel = (years: number) => {
    if (years <= 5) return "Mới vào nghề";
    if (years <= 10) return "Có kinh nghiệm";
    return "Chuyên gia";
  };

  const getCarCount = () => {
    return cars?.length ?? 0;
  };

  const getPackageCount = () => {
    if (packages?.length) return packages.length;
    if (typeof instructor?.packageCount === "number")
      return instructor.packageCount;
    return 0;
  };

  const renderGender = (gender?: Gender) => {
    switch (gender) {
      case Gender.Male:
        return "Nam";
      case Gender.Female:
        return "Nữ";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-500">Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  if (!instructor || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">
            {error ?? "Không tìm thấy người hướng dẫn"}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CarDetailDialog
        open={carDetailOpen}
        onOpenChange={(open) => {
          setCarDetailOpen(open);
          if (!open) {
            setSelectedCarId(null);
            setCarDetail(null);
            setCarDetailError(null);
          }
        }}
        car={carDetail}
        loading={carDetailLoading}
        error={carDetailError}
        onRetry={handleRetryCarDetail}
      />
      <div className="w-full max-w-none px-3 sm:px-4 lg:px-6 xl:px-10 pt-30 pb-12">
        <div className="px-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border shadow-md bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative mx-auto md:mx-0">
                    <div className="absolute inset-0 rounded-full blur-3xl bg-blue-500/10" />
                    <Avatar className="relative h-32 w-32 ring-4 ring-blue-50 shadow-xl">
                      <AvatarImage
                        src={instructor.avatar}
                        alt={instructor.fullName}
                      />
                      <AvatarFallback className="text-2xl bg-slate-100 text-slate-700">
                        {getInitials(instructor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="space-y-2">
                        <h1 className="text-3xl font-bold leading-tight text-slate-900">
                          {instructor.fullName}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-slate-900">
                              {instructor.averageRating?.toFixed(1) ?? "0.0"}
                            </span>
                            <span className="text-slate-500">
                              ({reviews.length} đánh giá)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                            <Award className="h-4 w-4 text-blue-300" />
                            <span>{experienceYears} năm kinh nghiệm</span>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                            <User className="h-4 w-4 text-purple-300" />
                            <span>{renderGender(instructor.gender)}</span>
                          </div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            Đã được duyệt
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3"></div>
                    </div>

                    <p className="text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      {instructor.bio}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Lượt đặt
                        </div>
                        <div className="font-semibold text-slate-900">
                          {instructor.bookingCount}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <div className="text-xs uppercase tracking-wide text-slate-500">
                          Gói thuê
                        </div>
                        <div className="font-semibold text-slate-900">
                          {instructor.packageCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gói dịch vụ ({getPackageCount()})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {packagesLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải danh sách gói...
                  </div>
                )}

                {packagesError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {packagesError}
                  </div>
                )}

                {!packagesLoading &&
                  !packagesError &&
                  packages.length === 0 && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                      Người hướng dẫn chưa có gói dịch vụ nào.
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {pkg.name}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs uppercase tracking-wide text-slate-500">
                            Giá
                          </div>
                          <div className="text-xl font-semibold text-blue-600">
                            {formatPrice(pkg.price)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800">
                            Thời lượng:
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700"
                          >
                            {pkg.duration} giờ
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800">
                            Phương tiện:
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700"
                          >
                            {pkg.isRentalCar
                              ? "Có thể thuê xe tập"
                              : "Không thể thuê xe tập (tự túc xe)"}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="font-medium text-slate-800">
                            Kỹ năng
                          </div>
                          {pkg.drivingSkills?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {pkg.drivingSkills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">
                              Chưa có thông tin
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-slate-800">
                            Loại đường
                          </div>
                          {pkg.roadTypes?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {pkg.roadTypes.map((road) => (
                                <Badge key={road} variant="outline">
                                  {road}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">
                              Chưa có thông tin
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="text-xs text-slate-500">
                          Hướng dẫn viên: {instructor.fullName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Phương tiện cho thuê kèm gói dịch vụ ({getCarCount()})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {carsLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải danh sách xe...
                  </div>
                )}

                {carsError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {carsError}
                  </div>
                )}

                {!carsLoading && !carsError && cars.length === 0 && (
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                    Người hướng dẫn chưa có phương tiện cho thuê.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative h-48 w-full">
                        <img
                          src={car.thumbnailUrl}
                          alt={car.modelName}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <Badge className="bg-white/90 text-slate-900">
                            {car.seatCounts} chỗ
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700"
                          >
                            {car.vehicleType}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {car.modelName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-wide text-slate-500">
                              Giá thuê
                            </div>
                            <div className="text-xl font-semibold text-blue-600">
                              {formatPrice(car.price)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-2">
                          <Button
                            variant="green"
                            size="sm"
                            onClick={() => handleViewCarDetail(car.id)}
                            disabled={
                              carDetailLoading && selectedCarId === car.id
                            }
                          >
                            {carDetailLoading && selectedCarId === car.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang tải
                              </>
                            ) : (
                              "Xem chi tiết"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Đánh giá từ học viên về người hướng dẫn ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải đánh giá...
                  </div>
                )}

                {reviewsError && !reviewsLoading && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                    {reviewsError}
                  </div>
                )}

                {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                    Người hướng dẫn chưa có đánh giá nào.
                  </div>
                )}

                {!reviewsLoading && !reviewsError && reviews.length > 0 && (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.avatar}
                              alt={review.name}
                            />
                            <AvatarFallback>
                              {getInitials(review.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {review.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.created)}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
      </div>
        </div>
    </div> 
  );
}
