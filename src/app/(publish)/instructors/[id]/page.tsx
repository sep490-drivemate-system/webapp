"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { CarDetailDialog } from "@/components/car/car-detail-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  ArrowLeft,
  Calendar as CalendarIcon,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  Clock,
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
import { IconTent } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { ICar, ICarDetail } from "@/types/car/car.type";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { getCarById, getCarsForInstructor } from "@/features/car/carThunk";

type InstructorDetail = IInstructors & {
  phone?: string;
  email?: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerMonth?: number;
  specialties?: string[];
  area?: string;
  reviewCount?: number;
  carCount?: number;
};

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Mock reviews data for instructors
const mockInstructorReviews: Review[] = [
  {
    id: "1",
    userName: "Nguyễn Thị E",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment:
      "Thầy dạy rất tận tâm và kiên nhẫn. Giúp em tự tin hơn khi lái xe. Phương pháp giảng dạy dễ hiểu và thực tế.",
    date: "2024-01-20",
    verified: true,
  },
  {
    id: "2",
    userName: "Trần Văn F",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment:
      "Excellent instructor! Very professional and patient. Highly recommended for beginners.",
    date: "2024-01-18",
    verified: true,
  },
  {
    id: "3",
    userName: "Lê Thị G",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    comment:
      "Thầy dạy tốt, có kinh nghiệm. Tuy nhiên lịch học hơi bận nên khó sắp xếp.",
    date: "2024-01-15",
    verified: false,
  },
  {
    id: "4",
    userName: "Phạm Văn H",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment:
      "Rất hài lòng với cách dạy của thầy. Sau khóa học, em đã tự tin lái xe một mình.",
    date: "2024-01-12",
    verified: true,
  },
  {
    id: "5",
    userName: "Hoàng Thị I",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment:
      "Thầy rất chuyên nghiệp, giảng dạy chi tiết từng bước. Recommend cho mọi người!",
    date: "2024-01-10",
    verified: true,
  },
];

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.id as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [bookingType, setBookingType] = useState("hourly");
  const [duration, setDuration] = useState("2");
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
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
    const durationNum = parseInt(duration);
    const pricePerHour = instructor?.pricePerHour ?? 0;
    const pricePerDay = instructor?.pricePerDay ?? 0;
    const pricePerMonth = instructor?.pricePerMonth ?? 0;
    switch (bookingType) {
      case "hourly":
        return pricePerHour * durationNum;
      case "daily":
        return pricePerDay * durationNum;
      case "monthly":
        return pricePerMonth * durationNum;
      default:
        return 0;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleBuyPackage = (pkg: IInstructorPackages) => {
    // TODO: integrate checkout/booking flow
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
    if (cars?.length) return cars.length;
    if (typeof instructor?.carCount === "number") return instructor.carCount;
    return 0;
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
      <div className="container mx-auto px-4 pt-30 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructor Profile */}
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
                              ({instructor.reviewCount ?? 0} đánh giá)
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

            {/* service packages section */}
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
                        <Button
                          onClick={() => handleBuyPackage(pkg)}
                          variant="green"
                          className="shrink-0"
                        >
                          Mua gói
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* car section */}
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

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Đánh giá từ học viên ({mockInstructorReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInstructorReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={review.userAvatar}
                            alt={review.userName}
                          />
                          <AvatarFallback>
                            {getInitials(review.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Đã xác thực
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Đặt lịch học
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Booking Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Loại thuê
                  </label>
                  <Tabs value={bookingType} onValueChange={setBookingType}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="hourly" className="text-xs">
                        Theo giờ
                      </TabsTrigger>
                      <TabsTrigger value="daily" className="text-xs">
                        Theo ngày
                      </TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs">
                        Theo tháng
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Thời gian (
                    {bookingType === "hourly"
                      ? "giờ"
                      : bookingType === "daily"
                      ? "ngày"
                      : "tháng"}
                    )
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingType === "hourly" && (
                        <>
                          <SelectItem value="1">1 giờ</SelectItem>
                          <SelectItem value="2">2 giờ</SelectItem>
                          <SelectItem value="3">3 giờ</SelectItem>
                          <SelectItem value="4">4 giờ</SelectItem>
                          <SelectItem value="6">6 giờ</SelectItem>
                          <SelectItem value="8">8 giờ</SelectItem>
                        </>
                      )}
                      {bookingType === "daily" && (
                        <>
                          <SelectItem value="1">1 ngày</SelectItem>
                          <SelectItem value="2">2 ngày</SelectItem>
                          <SelectItem value="3">3 ngày</SelectItem>
                          <SelectItem value="7">1 tuần</SelectItem>
                          <SelectItem value="14">2 tuần</SelectItem>
                        </>
                      )}
                      {bookingType === "monthly" && (
                        <>
                          <SelectItem value="1">1 tháng</SelectItem>
                          <SelectItem value="2">2 tháng</SelectItem>
                          <SelectItem value="3">3 tháng</SelectItem>
                          <SelectItem value="6">6 tháng</SelectItem>
                          <SelectItem value="12">1 năm</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ngày bắt đầu
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đơn giá:</span>
                    <span>
                      {bookingType === "hourly" &&
                        formatPrice(instructor.pricePerHour ?? 0)}
                      {bookingType === "daily" &&
                        formatPrice(instructor.pricePerDay ?? 0)}
                      {bookingType === "monthly" &&
                        formatPrice(instructor.pricePerMonth ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời gian:</span>
                    <span>
                      {duration}{" "}
                      {bookingType === "hourly"
                        ? "giờ"
                        : bookingType === "daily"
                        ? "ngày"
                        : "tháng"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full" size="lg">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Đặt lịch ngay
                </Button>

                {/* Quick Contact */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Liên hệ trực tiếp</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi điện
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Gửi email
                    </Button>
                  </div>
                </div>

                {/* Support Info */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Hỗ trợ khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>1900 1234</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>support@drivemate.vn</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
