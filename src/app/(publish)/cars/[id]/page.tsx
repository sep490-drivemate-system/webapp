"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Users, 
  Fuel, 
  Settings, 
  MapPin, 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Shield
} from "lucide-react";
import Link from "next/link";
import carsData from "@/data/mock-cars.json";

interface Car {
  id: string;
  name: string;
  description: string;
  seats: number;
  brand: string;
  transmission: string;
  fuel: string;
  area: string;
  rating: number;
  reviewCount: number;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  features: string[];
  status: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Xe rất tốt, sạch sẽ và tiết kiệm nhiên liệu. Phù hợp cho người mới học lái xe. Chủ xe nhiệt tình hướng dẫn.",
    date: "2024-01-15",
    verified: true
  },
  {
    id: "2",
    userName: "Trần Thị B",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    comment: "Xe chạy êm, điều hòa mát. Tuy nhiên cần cải thiện thêm về vệ sinh nội thất.",
    date: "2024-01-10",
    verified: true
  },
  {
    id: "3",
    userName: "Lê Văn C",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Tuyệt vời! Xe mới, đầy đủ tính năng. Rất hài lòng với dịch vụ.",
    date: "2024-01-08",
    verified: false
  },
  {
    id: "4",
    userName: "Phạm Thị D",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    comment: "Xe tốt, giá hợp lý. Sẽ thuê lại lần sau.",
    date: "2024-01-05",
    verified: true
  }
];

export default function CarDetailPage() {
  const params = useParams();
  const carId = params.id as string;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookingType, setBookingType] = useState("hourly");
  const [duration, setDuration] = useState("2");
  
  const car: Car | undefined = carsData.cars.find(c => c.id === carId);
  
  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy xe</h1>
          <Link href="/cars">
            <Button>Quay lại danh sách xe</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateTotalPrice = () => {
    const durationNum = parseInt(duration);
    switch (bookingType) {
      case "hourly":
        return car.pricePerHour * durationNum;
      case "daily":
        return car.pricePerDay * durationNum;
      case "monthly":
        return car.pricePerMonth * durationNum;
      default:
        return 0;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/cars">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách xe
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images and Basic Info */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-64 md:h-80 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    {car.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{car.name}</h1>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-lg">{car.rating}</span>
                        <span className="text-gray-500">({car.reviewCount} đánh giá)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(car.pricePerHour)}/giờ
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(car.pricePerDay)}/ngày
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{car.description}</p>

                  {/* Car Specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Số chỗ</div>
                        <div className="font-medium">{car.seats} chỗ</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Loại xe</div>
                        <div className="font-medium">{car.transmission}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Fuel className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Nhiên liệu</div>
                        <div className="font-medium">{car.fuel}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Khu vực</div>
                        <div className="font-medium">{car.area}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-3">Tính năng</h3>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Đánh giá ({mockReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.userName}</span>
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
                            <span className="text-sm text-gray-500">{review.date}</span>
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
                  Đặt xe ngay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Booking Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Loại thuê</label>
                  <Tabs value={bookingType} onValueChange={setBookingType}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="hourly" className="text-xs">Theo giờ</TabsTrigger>
                      <TabsTrigger value="daily" className="text-xs">Theo ngày</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs">Theo tháng</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Thời gian ({bookingType === "hourly" ? "giờ" : bookingType === "daily" ? "ngày" : "tháng"})
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
                  <label className="text-sm font-medium mb-2 block">Ngày bắt đầu</label>
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
                      {bookingType === "hourly" && formatPrice(car.pricePerHour)}
                      {bookingType === "daily" && formatPrice(car.pricePerDay)}
                      {bookingType === "monthly" && formatPrice(car.pricePerMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời gian:</span>
                    <span>{duration} {bookingType === "hourly" ? "giờ" : bookingType === "daily" ? "ngày" : "tháng"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full" size="lg">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Đặt xe ngay
                </Button>

                {/* Contact Info */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Liên hệ hỗ trợ</h4>
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
