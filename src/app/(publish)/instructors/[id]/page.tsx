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
  MapPin, 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  Clock,
  User
} from "lucide-react";
import Link from "next/link";
import instructorsData from "@/data/mock-instructors-enhanced.json";

interface Instructor {
  id: string;
  name: string;
  bio: string;
  experience: number;
  area: string;
  rating: number;
  reviewCount: number;
  status: string;
  avatar: string;
  specialties: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  phone: string;
  email: string;
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

// Mock reviews data for instructors
const mockInstructorReviews: Review[] = [
  {
    id: "1",
    userName: "Nguyễn Thị E",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Thầy dạy rất tận tâm và kiên nhẫn. Giúp em tự tin hơn khi lái xe. Phương pháp giảng dạy dễ hiểu và thực tế.",
    date: "2024-01-20",
    verified: true
  },
  {
    id: "2",
    userName: "Trần Văn F",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Excellent instructor! Very professional and patient. Highly recommended for beginners.",
    date: "2024-01-18",
    verified: true
  },
  {
    id: "3",
    userName: "Lê Thị G",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    comment: "Thầy dạy tốt, có kinh nghiệm. Tuy nhiên lịch học hơi bận nên khó sắp xếp.",
    date: "2024-01-15",
    verified: false
  },
  {
    id: "4",
    userName: "Phạm Văn H",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Rất hài lòng với cách dạy của thầy. Sau khóa học, em đã tự tin lái xe một mình.",
    date: "2024-01-12",
    verified: true
  },
  {
    id: "5",
    userName: "Hoàng Thị I",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Thầy rất chuyên nghiệp, giảng dạy chi tiết từng bước. Recommend cho mọi người!",
    date: "2024-01-10",
    verified: true
  }
];

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.id as string;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookingType, setBookingType] = useState("hourly");
  const [duration, setDuration] = useState("2");
  
  const instructor: Instructor | undefined = instructorsData.instructors.find(i => i.id === instructorId);
  
  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy người hướng dẫn</h1>
          <Link href="/instructors">
            <Button>Quay lại danh sách người hướng dẫn</Button>
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
        return instructor.pricePerHour * durationNum;
      case "daily":
        return instructor.pricePerDay * durationNum;
      case "monthly":
        return instructor.pricePerMonth * durationNum;
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

  const getExperienceLevel = (years: number) => {
    if (years <= 5) return "Mới vào nghề";
    if (years <= 10) return "Có kinh nghiệm";
    return "Chuyên gia";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/instructors">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách người hướng dẫn
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructor Profile */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-32 w-32 mx-auto md:mx-0">
                      <AvatarImage src={instructor.avatar} alt={instructor.name} />
                      <AvatarFallback className="text-2xl">{getInitials(instructor.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{instructor.name}</h1>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-lg">{instructor.rating}</span>
                          <span className="text-gray-500">({instructor.reviewCount} đánh giá)</span>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Đã được duyệt
                        </Badge>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(instructor.pricePerHour)}/giờ
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(instructor.pricePerDay)}/ngày
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{instructor.bio}</p>

                    {/* Instructor Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Award className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Kinh nghiệm</div>
                          <div className="font-medium">{instructor.experience} năm</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Khu vực</div>
                          <div className="font-medium">{instructor.area}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <User className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Trình độ</div>
                          <div className="font-medium">{getExperienceLevel(instructor.experience)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="font-semibold mb-3">Chuyên môn</h3>
                      <div className="flex flex-wrap gap-2">
                        {instructor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Số điện thoại</div>
                      <div className="font-medium">{instructor.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{instructor.email}</div>
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
                  Đánh giá từ học viên ({mockInstructorReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInstructorReviews.map((review) => (
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
                  Đặt lịch học
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
                      {bookingType === "hourly" && formatPrice(instructor.pricePerHour)}
                      {bookingType === "daily" && formatPrice(instructor.pricePerDay)}
                      {bookingType === "monthly" && formatPrice(instructor.pricePerMonth)}
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
                  Đặt lịch ngay
                </Button>

                {/* Quick Contact */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Liên hệ trực tiếp</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi điện
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
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
