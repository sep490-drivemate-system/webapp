"use client";

import { useState } from "react";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap } from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";

const userStats = [
  { label: "Tay lái mới", value: 2543, change: "+12.5%" },
  { label: "Người hướng dẫn", value: 892, change: "+8.2%" },
  { label: "Người kiểm duyệt", value: 34, change: "+2.1%" },
];

const financialStats = [
  {
    label: "Tổng doanh thu",
    value: "542,350 VNĐ",
    change: "+15.3%",
    color: "up",
  },
  {
    label: "Tổng chi trả người hướng dẫn",
    value: "$387,240",
    change: "+12.8%",
    color: "up",
  },
  {
    label: "Tổng hoa hồng của hệ thống",
    value: "$155,110",
    change: "+18.2%",
    color: "neutral",
  },
  {
    label: "Tổng tiền tạm giữ",
    value: "$48,920",
    change: "-5.2%",
    color: "down",
  },
] as const;

const activityData = [
  { name: "Hoàn thành", value: 68, color: "#10b981" },
  { name: "Hủy bỏ", value: 18, color: "#ef4444" },
  { name: "Dời lịch", value: 14, color: "#f59e0b" },
];

const revenueData = [
  { month: "Th1", revenue: 45000, commission: 13500 },
  { month: "Th2", revenue: 52000, commission: 15600 },
  { month: "Th3", revenue: 48000, commission: 14400 },
  { month: "Th4", revenue: 61000, commission: 18300 },
  { month: "Th5", revenue: 55000, commission: 16500 },
  { month: "Th6", revenue: 71000, commission: 21300 },
];

const topPackages = [
  { name: "Gói cơ bản (10h)", purchases: 847, rating: 4.8 },
  { name: "Gói nâng cao - đường dài (20h)", purchases: 652, rating: 4.7 },
  { name: "Gói Tây Ninh - Đường phức tạp (50h)", purchases: 445, rating: 4.9 },
  { name: "Gói tổng hợp kỹ năng (100h)", purchases: 234, rating: 4.6 },
];

const topInstructors = [
  { name: "Nguyễn Văn A", sessions: 256, rating: 4.95 },
  { name: "Trần Thị B", sessions: 198, rating: 4.88 },
  { name: "Phạm Văn C", sessions: 187, rating: 4.92 },
  { name: "Lê Thị D", sessions: 165, rating: 4.85 },
];

const topVehicles = [
  { model: "Toyota Vios 2023", rentals: 342, rating: 4.9 },
  { model: "Honda CR-V 2022", rentals: 298, rating: 4.8 },
  { model: "Kia Cerato 2023", rentals: 267, rating: 4.85 },
  { model: "Mazda 3 2022", rentals: 245, rating: 4.75 },
];

type TimeRange = "day" | "month" | "quarter";

const changeClassMap: Record<(typeof financialStats)[number]["color"], string> =
  {
    up: "text-emerald-500",
    neutral: "text-blue-500",
    down: "text-destructive",
  };

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Admin
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Tổng quan hoạt động hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(["day", "month", "quarter"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range === "day"
                    ? "Ngày"
                    : range === "month"
                    ? "Tháng"
                    : "Quý"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Thống Kê Người Dùng
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {userStats.map((stat) => (
              <Card key={stat.label} className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm text-primary">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Thống Kê Tài Chính
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {financialStats.map((stat) => (
              <Card key={stat.label} className="flex h-full flex-col bg-card">
                <CardHeader className="flex min-h-[72px] flex-col justify-center pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className={`mt-2 text-sm ${changeClassMap[stat.color]}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Tình Trạng Hoạt Động
              </CardTitle>
              <CardDescription>Tỷ lệ buổi tập lái</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {activityData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="font-medium text-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Dòng Tiền & Doanh Thu
              </CardTitle>
              <CardDescription>Theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="rgb(26, 213, 98)"
                    strokeWidth={2}
                    name="Doanh Thu"
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Hoa Hồng"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Gói Dịch Vụ Hàng Đầu
              </CardTitle>
              <CardDescription>Được mua nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.purchases} lần mua
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        ★ {pkg.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Người Hướng Dẫn Hàng Đầu
              </CardTitle>
              <CardDescription>Đánh giá cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topInstructors.map((instructor, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {instructor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {instructor.sessions} buổi dạy
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        ★ {instructor.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Xe Hàng Đầu
              </CardTitle>
              <CardDescription>Được thuê nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVehicles.map((vehicle, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {vehicle.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.rentals} lần thuê
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        ★ {vehicle.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
