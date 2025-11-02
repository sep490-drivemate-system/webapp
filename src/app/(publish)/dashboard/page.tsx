"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  Car,
  Route
} from "lucide-react";
import Link from "next/link";
import packagesData from "@/data/mock-packages.json";
import sessionsData from "@/data/mock-sessions.json";

interface Package {
  id: string;
  instructorName: string;
  instructorAvatar: string;
  packageName: string;
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  status: string;
  expiryDate: string;
}

interface Session {
  id: string;
  instructorName: string;
  instructorAvatar: string;
  date: string;
  startTime: string;
  duration: number;
  status: string;
  pickupLocation: string;
}

export default function DashboardPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Load packages
    const activePackages = packagesData.packages.filter(pkg => pkg.status === "active");
    setPackages(activePackages as any);

    // Load sessions
    const now = new Date();
    const upcoming = sessionsData.sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= now && (session.status === "pending" || session.status === "confirmed");
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    
    const recent = sessionsData.sessions
      .filter(session => session.status === "completed")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    setUpcomingSessions(upcoming as any);
    setRecentSessions(recent as any);
  }, []);

  // Calculate stats
  const totalHours = packages.reduce((sum, pkg) => sum + pkg.totalHours, 0);
  const usedHours = packages.reduce((sum, pkg) => sum + pkg.usedHours, 0);
  const totalSessions = sessionsData.sessions.length;
  const completedSessions = sessionsData.sessions.filter(s => s.status === "completed").length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short',
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      pending: { label: "Chờ xác nhận", variant: "secondary" },
      confirmed: { label: "Đã xác nhận", variant: "default" },
      completed: { label: "Hoàn thành", variant: "outline" }
    };
    const config = statusMap[status] || statusMap.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Xin chào, Học viên! 👋
          </h1>
          <p className="text-gray-600">
            Chào mừng bạn quay trở lại với DriveMate
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gói đang học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packages.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalHours} giờ tổng cộng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giờ đã học</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usedHours}h</div>
              <p className="text-xs text-muted-foreground">
                {totalHours - usedHours}h còn lại
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buổi học</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSessions}</div>
              <p className="text-xs text-muted-foreground">
                {totalSessions} tổng số buổi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến độ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalHours > 0 ? Math.round((usedHours / totalHours) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Hoàn thành khóa học
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Packages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gói học đang hoạt động</CardTitle>
                  <CardDescription>Theo dõi tiến độ học tập của bạn</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/my-packages">
                    Xem tất cả
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {packages.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Bạn chưa có gói học nào</p>
                    <Button asChild>
                      <Link href="/instructors">Tìm người hướng dẫn</Link>
                    </Button>
                  </div>
                ) : (
                  packages.map((pkg) => (
                    <Card key={pkg.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={pkg.instructorAvatar} />
                              <AvatarFallback>{pkg.instructorName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{pkg.packageName}</h4>
                              <p className="text-sm text-gray-600">
                                Giáo viên: {pkg.instructorName}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Đang học
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tiến độ</span>
                            <span className="font-medium">
                              {pkg.usedHours}/{pkg.totalHours} giờ
                            </span>
                          </div>
                          <Progress 
                            value={(pkg.usedHours / pkg.totalHours) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Còn {pkg.remainingHours} giờ</span>
                            <span>Hết hạn: {formatDate(pkg.expiryDate)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/my-packages/${pkg.id}`}>
                              Đặt lịch học
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/my-packages/${pkg.id}`}>
                              Chi tiết
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Buổi học gần đây</CardTitle>
                  <CardDescription>Các buổi học đã hoàn thành</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/history">
                    Lịch sử
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có buổi học nào</p>
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.instructorAvatar} />
                          <AvatarFallback>{session.instructorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{session.instructorName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(session.date)}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{session.duration}h</span>
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch sắp tới</CardTitle>
                <CardDescription>Các buổi học sắp diễn ra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có lịch nào</p>
                  </div>
                ) : (
                  upcomingSessions.map((session) => (
                    <Card key={session.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.instructorAvatar} />
                            <AvatarFallback>{session.instructorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{session.instructorName}</p>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 ml-10">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(session.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{session.startTime} ({session.duration}h)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{session.pickupLocation}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-3"
                          asChild
                        >
                          <Link href={`/my-sessions/${session.id}`}>
                            Xem chi tiết
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/instructors">
                    <Car className="mr-2 h-4 w-4" />
                    Tìm người hướng dẫn
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/my-sessions">
                    <Calendar className="mr-2 h-4 w-4" />
                    Quản lý lịch học
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/history">
                    <Route className="mr-2 h-4 w-4" />
                    Xem lịch sử
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/wallet">
                    <Award className="mr-2 h-4 w-4" />
                    Ví của tôi
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Thành tích
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tổng km đã đi</span>
                    <span className="font-bold">245 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đánh giá trung bình</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                      <span className="font-bold">5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kỹ năng đã học</span>
                    <span className="font-bold">6 loại đường</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/progress">
                    Xem chi tiết tiến độ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

