import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { IInstructors } from "@/types/instructor/instructor-management.types";
import { Package, Star, Eye } from "lucide-react";
import Link from "next/link";

interface InstructorCardProps {
  instructor: IInstructors;
  href?: string;
  cardClassName?: string;
}

const parseExperienceYears = (value: IInstructors["experienceYear"]) => {
  const numericValue =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const getExperienceLevel = (years: number) => {
  if (years <= 5) return "Mới vào nghề";
  if (years <= 10) return "Có kinh nghiệm";
  return "Chuyên gia";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export function InstructorCard({
  instructor,
  href = `/instructors/${instructor.id}`,
  cardClassName = "",
}: InstructorCardProps) {
  const experienceYears = parseExperienceYears(instructor.experienceYear);

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${cardClassName}`}
    >
      <CardContent className="p-6 flex-1 flex flex-col space-y-4 pb-4">
        <div className="flex items-start gap-3 pb-3 border-b flex-shrink-0">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={instructor.avatar} alt={instructor.fullName} />
            <AvatarFallback>{getInitials(instructor.fullName)}</AvatarFallback>
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
              {getExperienceLevel(experienceYears)} • {experienceYears} năm kinh
              nghiệm
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <p className="text-gray-600 text-sm line-clamp-3 min-h-[3.75rem]">
            {instructor.bio || "Chưa có mô tả"}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Package className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600">
            {instructor.packageCount} gói thuê
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 pb-6 px-6">
        <Button className="w-full" variant="green" asChild>
          <Link href={href}>
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
