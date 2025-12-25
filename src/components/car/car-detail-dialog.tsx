"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICarDetail } from "@/types/car/car.type";
import { Car as CarIcon, Fuel, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getUserById } from "@/features/user/userThunk";
import { getCarReviews } from "@/features/reviews/reviewThunk";
import { CarReview } from "@/types/reviews/reviews.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CarDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: ICarDetail | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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

export function CarDetailDialog({
  open,
  onOpenChange,
  car,
  loading,
  error,
  onRetry,
}: CarDetailDialogProps) {
  const dispatch = useAppDispatch();
  const [instructorName, setInstructorName] = useState<string | null>(null);
  const [instructorNameLoading, setInstructorNameLoading] = useState(false);
  const [reviews, setReviews] = useState<CarReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInstructorName = async () => {
      if (!car?.instructor_id) {
        setInstructorName(null);
        return;
      }

      setInstructorNameLoading(true);
      try {
        const response = await dispatch(
          getUserById({ id: car.instructor_id })
        ).unwrap();

        if (!cancelled) {
          setInstructorName(response.value?.fullName ?? car.instructor_id);
        }
      } catch (err) {
        console.error("Failed to fetch instructor name", err);
        if (!cancelled) {
          setInstructorName(null);
        }
      } finally {
        if (!cancelled) {
          setInstructorNameLoading(false);
        }
      }
    };

    fetchInstructorName();

    return () => {
      cancelled = true;
    };
  }, [car?.instructor_id, dispatch]);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      if (!car?.id) {
        setReviews([]);
        return;
      }

      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await dispatch(
          getCarReviews({ id: car.id })
        ).unwrap();

        if (!cancelled) {
          setReviews(response.value || []);
        }
      } catch (err) {
        console.error("Failed to fetch car reviews", err);
        if (!cancelled) {
          setReviewsError("Không thể tải đánh giá");
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [car?.id, dispatch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết xe</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải thông tin xe...
          </div>
        )}

        {!loading && error && (
          <div className="space-y-3">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Thử lại
              </Button>
            )}
          </div>
        )}

        {!loading && !error && car && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 shadow-sm">
                {car.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={car.thumbnailUrl}
                    alt={car.modelName}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Chưa có hình ảnh
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-slate-900">
                      {car.modelName}
                    </div>
                    <div className="text-sm text-slate-600">
                      Biển số: {car.license_plate}
                    </div>
                  </div>
                  <Card className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg ring-2 ring-[#bbf7d0] min-w-[220px]">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wide">
                        Giá thuê
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold">
                        {formatPrice(car.price)}
                      </div>
                      <div className="text-[11px] text-blue-50">/giờ</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-900">
                    Mô tả
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 shadow-inner">
                    {car.dsescription || "Chưa có mô tả"}
                  </div>
                </div>
              </div>

              <Card className="border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CarIcon className="h-4 w-4" />
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Hãng xe" value={car.brand} />
                  <DetailRow label="Loại xe" value={car.vehicleType} />
                  <DetailRow label="Số ghế" value={`${car.seatCounts} chỗ`} />
                  <DetailRow
                    label="Nhiên liệu"
                    value={
                      <span className="inline-flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-slate-400" />
                        {car.fuel}
                      </span>
                    }
                  />
                  {car.booking_count !== undefined && car.booking_count > 0 && (
                    <DetailRow label="Số lượt thuê" value={car.booking_count} />
                  )}

                  <DetailRow label="Hạng bằng lái" value={car.licenseTier} />
                  <DetailRow
                    label="Chủ xe/ người hướng dẫn"
                    value={
                      instructorNameLoading ? (
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải...
                        </span>
                      ) : (
                        instructorName ?? car.instructor_id ?? "Không xác định"
                      )
                    }
                  />
                </CardContent>
              </Card>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-900">
                  Hình ảnh khác
                </div>
                {car.images?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.images.map((img, index) => (
                      <div
                        key={img || index}
                        className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 shadow-sm"
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={`Ảnh xe ${index + 1}`}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-500">
                            Không có ảnh
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    Không có hình ảnh bổ sung.
                  </div>
                )}
              </div>

              <Separator />

              <Card className="border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Star className="h-4 w-4" />
                    Đánh giá ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải đánh giá...
                    </div>
                  )}

                  {reviewsError && (
                    <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                      {reviewsError}
                    </div>
                  )}

                  {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 text-center">
                      Chưa có đánh giá nào.
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
                                src={review.avatarUrl}
                                alt={review.username}
                              />
                              <AvatarFallback>
                                {getInitials(review.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {review.username}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDate(review.feedbackDate)}
                                </span>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
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
        )}
      </DialogContent>
    </Dialog>
  );
}

type DetailRowProps = {
  label: string;
  value: React.ReactNode;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm">
      <span className="font-medium text-slate-700">{label}:</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}
