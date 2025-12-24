"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Clock, Eye } from "lucide-react";
import type { Package } from "@/types/package/package.type";

export interface PackageServiceCardProps {
  pkg: Package;
  actionHref?: string;
  actionLabel?: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function PackageServiceCard({
  pkg,
  actionHref = `/instructors/${pkg.instructorId}`,
  actionLabel = "Xem chi tiết",
}: PackageServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
            {pkg.name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
        <div className="flex items-center gap-3 pb-3 border-b flex-shrink-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={pkg.instructorAvatar} alt={pkg.instructorName} />
            <AvatarFallback>{(pkg.instructorName || "U")[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{pkg.instructorName}</p>
            <p className="text-xs text-gray-600">
              {pkg.bookingCount} lượt đặt • {pkg.carCount} xe
            </p>
          </div>
        </div>

        <div className="space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{pkg.duration} giờ</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Car className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>
              {pkg.isRentalCar
                ? "Có kèm thuê xe"
                : "Không kèm thuê xe"}
            </span>
          </div>
        </div>

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

        <div className="pt-3 border-t flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Giá gói
              </span>
              <span className="text-2xl font-extrabold text-emerald-600">
                {formatPrice(pkg.price)}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-semibold text-emerald-700 border-emerald-200 bg-emerald-50"
            >
              {pkg.bookingCount} lượt đặt
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full gap-2" variant="green">
          <Link href={actionHref}>
            <Eye className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PackageServiceCard;
