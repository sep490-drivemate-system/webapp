"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Star, 
  Users, 
  Fuel, 
  Settings, 
  MapPin, 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  User,
  Car as CarIcon,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import carsData from "@/data/mock-cars.json";
import instructorsData from "@/data/mock-instructors-enhanced.json";

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
  images?: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  features: string[];
  status: string;
}

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
  type: 'car' | 'instructor';
  targetId: string;
}

// Mock reviews data for both cars and instructors
const mockReviews: Review[] = [
  // Car reviews
  {
    id: "1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Xe rất tốt, sạch sẽ và tiết kiệm nhiên liệu. Phù hợp cho người mới học lái xe.",
    date: "2024-01-15",
    verified: true,
    type: "car",
    targetId: "CAR001"
  },
  {
    id: "2",
    userName: "Trần Thị B",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    comment: "Xe chạy êm, điều hòa mát. Tuy nhiên cần cải thiện thêm về vệ sinh nội thất.",
    date: "2024-01-10",
    verified: true,
    type: "car",
    targetId: "CAR001"
  },
  // Instructor reviews
  {
    id: "3",
    userName: "Nguyễn Thị E",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Thầy dạy rất tận tâm và kiên nhẫn. Giúp em tự tin hơn khi lái xe.",
    date: "2024-01-20",
    verified: true,
    type: "instructor",
    targetId: "INST001"
  },
  {
    id: "4",
    userName: "Trần Văn F",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    comment: "Excellent instructor! Very professional and patient. Highly recommended for beginners.",
    date: "2024-01-18",
    verified: true,
    type: "instructor",
    targetId: "INST001"
  }
];

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('car');
  const instructorId = searchParams.get('instructor');
  
  const [activeTab, setActiveTab] = useState<'car' | 'instructor'>('car');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingType, setBookingType] = useState("hourly");
  const [duration, setDuration] = useState("2");
  
  // Always load both car and instructor data - use provided IDs or defaults
  const car: Car | undefined = carId ? 
    carsData.cars.find(c => c.id === carId) : 
    carsData.cars[0]; // Default to first car if no car specified
    
  const instructor: Instructor | undefined = instructorId ? 
    instructorsData.instructors.find(i => i.id === instructorId) : 
    instructorsData.instructors.find(i => i.status === "approved"); // Default to first approved instructor

  // Set initial active tab based on URL parameters
  useEffect(() => {
    if (instructorId && !carId) {
      setActiveTab('instructor');
    } else if (carId && !instructorId) {
      setActiveTab('car');
    } else if (carId && instructorId) {
      setActiveTab('car'); // Default to car if both are present
    }
  }, [carId, instructorId]);

  // Initialize selectedDate on client side to prevent hydration mismatch
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  if (!car && !instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h1>
          <div className="space-x-4">
            <Link href="/cars">
              <Button>Danh sách xe</Button>
            </Link>
            <Link href="/instructors">
              <Button variant="outline">Danh sách người hướng dẫn</Button>
            </Link>
          </div>
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
    const currentItem = activeTab === 'car' ? car : instructor;
    if (!currentItem) return 0;

    switch (bookingType) {
      case "hourly":
        return currentItem.pricePerHour * durationNum;
      case "daily":
        return currentItem.pricePerDay * durationNum;
      case "monthly":
        return currentItem.pricePerMonth * durationNum;
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

  const getCurrentReviews = () => {
    const currentId = activeTab === 'car' ? carId : instructorId;
    return mockReviews.filter(review => 
      review.type === activeTab && review.targetId === currentId
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Link href="/cars">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Danh sách xe
              </Button>
            </Link>
            <Link href="/instructors">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Danh sách người hướng dẫn
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Selector and Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'car' | 'instructor')}>
          <div className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="car" disabled={!car} className="flex items-center gap-2">
                <CarIcon className="h-4 w-4" />
                Chi tiết xe
              </TabsTrigger>
              <TabsTrigger value="instructor" disabled={!instructor} className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Chi tiết người hướng dẫn
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <TabsContent value="car" className="mt-0">
                {car && (
                  <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CarIcon className="h-5 w-5" />
                    Chi tiết xe tập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {(car.images || [car.image]).map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative">
                                <img
                                  src={image}
                                  alt={`${car.name} - Hình ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                {index === 0 && (
                                  <Badge className="absolute top-2 right-2 bg-green-500">
                                    {car.status === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                                  </Badge>
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{car.rating}</span>
                        <span className="text-gray-500">({car.reviewCount} đánh giá)</span>
                      </div>
                      <p className="text-gray-600 mb-4">{car.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Số chỗ</div>
                          <div className="font-medium text-sm">{car.seats} chỗ</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Loại xe</div>
                          <div className="font-medium text-sm">{car.transmission}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Fuel className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Nhiên liệu</div>
                          <div className="font-medium text-sm">{car.fuel}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Khu vực</div>
                          <div className="font-medium text-sm">{car.area}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Tính năng</h4>
                      <div className="flex flex-wrap gap-2">
                        {car.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="instructor" className="mt-0">
                {instructor && (
                  <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Chi tiết người hướng dẫn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={instructor.avatar} alt={instructor.name} />
                      <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{instructor.rating}</span>
                        <span className="text-gray-500">({instructor.reviewCount} đánh giá)</span>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Đã được duyệt
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{instructor.bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Award className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Kinh nghiệm</div>
                        <div className="font-medium text-sm">{instructor.experience} năm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Khu vực</div>
                        <div className="font-medium text-sm">{instructor.area}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Trình độ</div>
                        <div className="font-medium text-sm">{getExperienceLevel(instructor.experience)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Điện thoại</div>
                        <div className="font-medium text-sm">{instructor.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="font-medium text-sm">{instructor.email}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Chuyên môn</h4>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Reviews Section - Always show but content changes based on active tab */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Đánh giá {activeTab === 'car' ? 'xe' : 'người hướng dẫn'} ({getCurrentReviews().length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCurrentReviews().map((review) => (
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
                  {getCurrentReviews().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có đánh giá nào cho {activeTab === 'car' ? 'xe này' : 'người hướng dẫn này'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Booking Packages */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Gói thuê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Selection Info */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    Đang chọn: {activeTab === 'car' ? 'Xe tập' : 'Người hướng dẫn'}
                  </div>
                  <div className="text-sm text-blue-700">
                    {activeTab === 'car' ? car?.name : instructor?.name}
                  </div>
                </div>

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
                      {activeTab === 'car' && car && (
                        <>
                          {bookingType === "hourly" && formatPrice(car.pricePerHour)}
                          {bookingType === "daily" && formatPrice(car.pricePerDay)}
                          {bookingType === "monthly" && formatPrice(car.pricePerMonth)}
                        </>
                      )}
                      {activeTab === 'instructor' && instructor && (
                        <>
                          {bookingType === "hourly" && formatPrice(instructor.pricePerHour)}
                          {bookingType === "daily" && formatPrice(instructor.pricePerDay)}
                          {bookingType === "monthly" && formatPrice(instructor.pricePerMonth)}
                        </>
                      )}
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
                  Đặt {activeTab === 'car' ? 'xe' : 'lịch học'} ngay
                </Button>

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
        </Tabs>
      </div>
    </div>
  );
}
