"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  Car, 
  Award, 
  CheckCircle, 
  Filter,
  Search,
  TrendingUp,
  Users,
  Calendar,
  Package
} from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
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

// Mock package data based on instructors
interface PackageType {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRating: number;
  instructorReviews: number;
  packageName: string;
  description: string;
  totalHours: number;
  pricePerHour: number;
  totalPrice: number;
  hasVehicle: boolean;
  vehicleType?: string;
  skills: string[];
  roadTypes: string[];
  area: string;
  discount?: number;
  popular?: boolean;
}

const ITEMS_PER_PAGE = 9;

// Road type options
const ROAD_TYPES = [
  "Đường khu dân cư",
  "Đường đô thị",
  "Quốc lộ",
  "Đường cao tốc",
  "Đường đèo",
  "Đường trường",
  "Đường qua khu đông dân cư",
  "Đường đang thi công",
  "Đường trơn trượt"
];

export default function PackagesPage() {
  const [filters, setFilters] = useState({
    area: "all",
    roadType: "all",
    hasVehicle: "all",
    priceRange: "all",
    hours: "all"
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const instructors: Instructor[] = instructorsData.instructors;

  // Generate mock packages from instructors
  const packages: PackageType[] = useMemo(() => {
    const mockPackages: PackageType[] = [];
    
    instructors.forEach((instructor, idx) => {
      // Basic package
      mockPackages.push({
        id: `pkg_${instructor.id}_basic`,
        instructorId: instructor.id,
        instructorName: instructor.name,
        instructorAvatar: instructor.avatar,
        instructorRating: instructor.rating,
        instructorReviews: instructor.reviewCount,
        packageName: "Gói luyện tập cơ bản",
        description: "Phù hợp cho người mới bắt đầu, tập trung vào kỹ năng cơ bản",
        totalHours: 20,
        pricePerHour: instructor.pricePerHour,
        totalPrice: instructor.pricePerHour * 20,
        hasVehicle: true,
        vehicleType: "Toyota Vios 2023",
        skills: instructor.specialties.slice(0, 2),
        roadTypes: ["Đường khu dân cư", "Đường đô thị"],
        area: instructor.area,
        popular: idx % 3 === 0
      });

      // Advanced package
      if (instructor.experience > 5) {
        mockPackages.push({
          id: `pkg_${instructor.id}_advanced`,
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorAvatar: instructor.avatar,
          instructorRating: instructor.rating,
          instructorReviews: instructor.reviewCount,
          packageName: "Gói nâng cao",
          description: "Luyện tập các kỹ năng nâng cao, đường phức tạp",
          totalHours: 40,
          pricePerHour: instructor.pricePerHour * 1.1,
          totalPrice: instructor.pricePerHour * 1.1 * 40,
          hasVehicle: true,
          vehicleType: "Honda City 2023",
          skills: instructor.specialties,
          roadTypes: ["Quốc lộ", "Đường cao tốc", "Đường đô thị"],
          area: instructor.area,
          discount: 10
        });
      }

      // Highway package
      if (instructor.experience > 8) {
        mockPackages.push({
          id: `pkg_${instructor.id}_highway`,
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorAvatar: instructor.avatar,
          instructorRating: instructor.rating,
          instructorReviews: instructor.reviewCount,
          packageName: "Gói luyện cao tốc",
          description: "Chuyên luyện kỹ năng lái xe trên đường cao tốc",
          totalHours: 15,
          pricePerHour: instructor.pricePerHour * 1.2,
          totalPrice: instructor.pricePerHour * 1.2 * 15,
          hasVehicle: false,
          skills: ["Cao tốc", "Giữ làn", "Vượt xe"],
          roadTypes: ["Đường cao tốc", "Quốc lộ"],
          area: instructor.area
        });
      }
    });

    return mockPackages;
  }, [instructors]);

  // Get unique values for filters
  const uniqueAreas = [...new Set(packages.map(pkg => pkg.area))].sort();

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = searchQuery === "" || 
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesArea = filters.area === "all" || pkg.area === filters.area;
      
      const matchesRoadType = filters.roadType === "all" || 
        pkg.roadTypes.includes(filters.roadType);
      
      const matchesVehicle = filters.hasVehicle === "all" || 
        (filters.hasVehicle === "yes" && pkg.hasVehicle) ||
        (filters.hasVehicle === "no" && !pkg.hasVehicle);
      
      const matchesPrice = filters.priceRange === "all" ||
        (filters.priceRange === "low" && pkg.pricePerHour < 200000) ||
        (filters.priceRange === "medium" && pkg.pricePerHour >= 200000 && pkg.pricePerHour < 300000) ||
        (filters.priceRange === "high" && pkg.pricePerHour >= 300000);
      
      const matchesHours = filters.hours === "all" ||
        (filters.hours === "short" && pkg.totalHours <= 20) ||
        (filters.hours === "medium" && pkg.totalHours > 20 && pkg.totalHours <= 40) ||
        (filters.hours === "long" && pkg.totalHours > 40);

      return matchesSearch && matchesArea && matchesRoadType && matchesVehicle && matchesPrice && matchesHours;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.instructorRating - a.instructorRating;
        case "price-low":
          return a.totalPrice - b.totalPrice;
        case "price-high":
          return b.totalPrice - a.totalPrice;
        case "rating":
          return b.instructorRating - a.instructorRating;
        case "hours-low":
          return a.totalHours - b.totalHours;
        case "hours-high":
          return b.totalHours - a.totalHours;
        default:
          return 0;
      }
    });

    return filtered;
  }, [packages, filters, sortBy, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFilters = () => {
    setFilters({
      area: "all",
      roadType: "all",
      hasVehicle: "all",
      priceRange: "all",
      hours: "all"
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách gói dịch vụ</h1>
          <p className="text-gray-600">Chọn gói học phù hợp với nhu cầu và mục tiêu của bạn</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm gói học, giáo viên, kỹ năng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Bộ lọc
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Xóa
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Area Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Khu vực</label>
                    <Select value={filters.area} onValueChange={(value) => setFilters({...filters, area: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueAreas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Road Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Loại đường</label>
                    <Select value={filters.roadType} onValueChange={(value) => setFilters({...filters, roadType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {ROAD_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vehicle Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Xe tập</label>
                    <Select value={filters.hasVehicle} onValueChange={(value) => setFilters({...filters, hasVehicle: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Có xe hay không" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="yes">Có xe tập</SelectItem>
                        <SelectItem value="no">Không có xe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mức giá/giờ</label>
                    <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức giá" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="low">&lt; 200K</SelectItem>
                        <SelectItem value="medium">200K - 300K</SelectItem>
                        <SelectItem value="high">&gt; 300K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hours Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số giờ</label>
                    <Select value={filters.hours} onValueChange={(value) => setFilters({...filters, hours: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="short">≤ 20 giờ</SelectItem>
                        <SelectItem value="medium">21-40 giờ</SelectItem>
                        <SelectItem value="long">&gt; 40 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPackages.length)} trong {filteredPackages.length} gói
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="hours-low">Ít giờ nhất</SelectItem>
                  <SelectItem value="hours-high">Nhiều giờ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={pkg.popular ? "default" : "secondary"} className="flex items-center gap-1">
                        {pkg.popular ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            Phổ biến
                          </>
                        ) : (
                          <>
                            <Package className="h-3 w-3" />
                            Gói học
                          </>
                        )}
                      </Badge>
                      {pkg.discount && (
                        <Badge variant="destructive">-{pkg.discount}%</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={pkg.instructorAvatar} alt={pkg.instructorName} />
                        <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{pkg.instructorName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{pkg.instructorRating}</span>
                          <span>({pkg.instructorReviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{pkg.totalHours} giờ</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{pkg.area}</span>
                      </div>
                      {pkg.hasVehicle && (
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span>{pkg.vehicleType}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
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

                    {/* Road Types */}
                    <div className="flex flex-wrap gap-1">
                      {pkg.roadTypes.slice(0, 2).map((road, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {road}
                        </Badge>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="pt-3 border-t">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(pkg.totalPrice)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatPrice(pkg.pricePerHour)}/giờ
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Đặt ngay
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/instructors/${pkg.instructorId}`}>
                        Chi tiết
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* No Results */}
            {filteredPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy gói phù hợp</h3>
                  <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm để tìm gói phù hợp hơn</p>
                </div>
                <Button onClick={resetFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Đảm bảo chất lượng</h4>
                  <p className="text-sm text-gray-600">
                    Tất cả giáo viên đều được xác minh và đánh giá
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Linh hoạt lịch học</h4>
                  <p className="text-sm text-gray-600">
                    Tự do sắp xếp thời gian học phù hợp với bạn
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Hoàn tiền dễ dàng</h4>
                  <p className="text-sm text-gray-600">
                    Chính sách hoàn tiền rõ ràng và minh bạch
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
