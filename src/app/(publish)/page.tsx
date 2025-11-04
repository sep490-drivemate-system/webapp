"use client";

import { ArrowRight, Users, Car, Award, MapPin, Star, Clock, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import instructorsData from "@/data/mock-instructors-enhanced.json";
import carsData from "@/data/mock-cars.json";

export default function HomePage() {
  const instructors = instructorsData.instructors.filter(i => i.status === "approved").slice(0, 4);
  const cars = carsData.cars.filter(c => c.status === "available").slice(0, 4);

  // Mock packages data
  const featuredPackages = [
    {
      id: "pkg_001",
      name: "Gói luyện tập cơ bản",
      description: "Phù hợp cho người mới bắt đầu",
      hours: 20,
      price: 4000000,
      pricePerHour: 200000,
      instructor: instructors[0],
      skills: ["Đường đô thị", "Khu dân cư"],
      hasVehicle: true,
      popular: true
    },
    {
      id: "pkg_002",
      name: "Gói nâng cao",
      description: "Luyện tập kỹ năng nâng cao",
      hours: 40,
      price: 8800000,
      pricePerHour: 220000,
      instructor: instructors[1],
      skills: ["Quốc lộ", "Cao tốc"],
      hasVehicle: true,
      popular: false
    },
    {
      id: "pkg_003",
      name: "Gói luyện cao tốc",
      description: "Chuyên luyện đường cao tốc",
      hours: 15,
      price: 4500000,
      pricePerHour: 300000,
      instructor: instructors[2],
      skills: ["Cao tốc", "Vượt xe"],
      hasVehicle: false,
      popular: false
    },
    {
      id: "pkg_004",
      name: "Gói luyện đường đèo",
      description: "Luyện kỹ năng đường núi",
      hours: 12,
      price: 3600000,
      pricePerHour: 300000,
      instructor: instructors[3],
      skills: ["Đường đèo", "Cua gấp"],
      hasVehicle: true,
      popular: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
                Bổ túc lái xe an toàn cùng người hướng dẫn chuyên nghiệp
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                DriveMate kết nối bạn với những giáo viên lái xe có kinh nghiệm nhất.
                Học lái xe hiệu quả, an toàn với lịch trình linh hoạt theo nhu cầu của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/packages">
                    Xem gói dịch vụ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/instructors">
                    Tìm người hướng dẫn
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Giáo viên lái xe đang hướng dẫn học viên"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Gói dịch vụ nổi bật</h2>
              <p className="text-gray-600">Chọn gói phù hợp với nhu cầu của bạn</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/packages">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={pkg.popular ? "default" : "secondary"} className="text-xs">
                      {pkg.popular ? "Phổ biến" : "Gói học"}
                    </Badge>
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={pkg.instructor.avatar} />
                      <AvatarFallback>{pkg.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{pkg.instructor.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{pkg.instructor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{pkg.hours} giờ</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pkg.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-2xl font-bold text-blue-600">{formatPrice(pkg.price)}</p>
                    <p className="text-xs text-gray-600">{formatPrice(pkg.pricePerHour)}/giờ</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" size="sm" asChild>
                    <Link href="/packages">Đặt ngay</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/packages">
                Xem tất cả gói dịch vụ
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Instructors Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Người hướng dẫn nổi bật</h2>
              <p className="text-gray-600">Đội ngũ giáo viên giàu kinh nghiệm</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/instructors">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={instructor.avatar} alt={instructor.name} />
                      <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                        <Award className="h-4 w-4" />
                        <span>{instructor.experience} năm kinh nghiệm</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{instructor.rating}</span>
                        <span className="text-sm text-gray-500">({instructor.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{instructor.bio}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{instructor.area}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(instructor.pricePerHour)}/giờ
                    </div>
                    <Button className="w-full" size="sm" asChild>
                      <Link href={`/instructors/${instructor.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/instructors">
                Xem tất cả người hướng dẫn
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Xe tập nổi bật</h2>
              <p className="text-gray-600">Đa dạng phương tiện cho bạn lựa chọn</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/cars">
                Xem tất cả
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900">
                    {car.brand}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{car.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{car.rating}</span>
                      <span className="text-gray-500">({car.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{car.area}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Badge variant="outline" className="text-xs">{car.transmission}</Badge>
                    <Badge variant="outline" className="text-xs">{car.fuel}</Badge>
                    <Badge variant="outline" className="text-xs">{car.seats} chỗ</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xl font-bold text-blue-600">{formatPrice(car.pricePerHour)}/giờ</p>
                    <p className="text-xs text-gray-600">{formatPrice(car.pricePerDay)}/ngày</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" size="sm" asChild>
                    <Link href={`/cars/${car.id}`}>Xem chi tiết</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/cars">
                Xem tất cả xe tập
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};


