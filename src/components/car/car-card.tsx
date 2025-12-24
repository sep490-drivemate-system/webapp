import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Eye, Fuel, Star, Users } from "lucide-react";
import { ICar, LicenseTier } from "@/types/car/car.type";

export interface CarCardProps {
  car: ICar;
  actionHref?: string;
  actionLabel?: string;
  onViewDetail?: (id: string) => void;
  className?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const formatLicenseTier = (licenseTier: LicenseTier) => licenseTier ?? "";

export function CarCard({
  car,
  actionHref,
  actionLabel = "Xem chi tiết",
  onViewDetail,
  className = "",
}: CarCardProps) {
  const rating = car.average_rating ?? 0;

  const handleClick = () => {
    if (onViewDetail) {
      onViewDetail(car.id);
    }
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 ${className}`}
    >
      <div className="relative">
        <img
          src={car.thumbnailUrl}
          alt={`${car.brand} ${car.modelName}`}
          className="w-full h-48 object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {car.brand} {car.modelName}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          Biển số: {car.license_plate}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{car.seatCounts} chỗ</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">{car.vehicleType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-gray-500" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-gray-500" />
            <span>{formatLicenseTier(car.licenseTier)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">
            ({car.booking_count ?? 0} lượt đặt)
          </span>
        </div>

        <div className="text-lg font-bold mb-3">
          {formatPrice(car.price)}/giờ
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {actionHref ? (
          <Button className="w-full" variant="green" asChild>
            <Link href={actionHref}>
              <Eye className="h-4 w-4" />
              {actionLabel}
            </Link>
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="green"
            onClick={handleClick}
            disabled={!onViewDetail}
          >
            <Eye className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
