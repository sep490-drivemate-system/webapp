"use client";

import { useState, useMemo } from "react";

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
import { TrendingUp, Users, Zap, Star, StarIcon } from "lucide-react";
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
  { month: "Th7", revenue: 68000, commission: 20400 },
  { month: "Th8", revenue: 75000, commission: 22500 },
  { month: "Th9", revenue: 72000, commission: 21600 },
  { month: "Th10", revenue: 80000, commission: 24000 },
  { month: "Th11", revenue: 78000, commission: 23400 },
  { month: "Th12", revenue: 85000, commission: 25500 },
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

// Helper function to determine color based on change percentage
const getChangeColor = (change: string): "up" | "down" | "neutral" => {
  const changeValue = parseFloat(change.replace(/[+%]/g, ""));
  if (changeValue > 0) return "up";
  if (changeValue < 0) return "down";
  return "neutral";
};

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  // Get current date info
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // Generate filtered data based on timeRange
  const filteredRevenueData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();

    switch (timeRange) {
      case "day": {
        // Show days in current month
        return Array.from({ length: daysInCurrentMonth }, (_, i) => {
          const day = i + 1;
          // Generate sample data based on day (you can replace with real data)
          const baseRevenue = 2000 + (day % 7) * 500;
          const revenue = baseRevenue * 20;
          const commission = revenue * 0.3;
          return {
            month: `Ngày ${day}`,
            revenue: Math.round(revenue),
            commission: Math.round(commission),
          };
        });
      }
      case "month": {
        // Show months in current year
        return Array.from({ length: 12 }, (_, i) => {
          const monthIndex = i;
          // Use existing revenueData if available, otherwise generate sample data
          if (i < revenueData.length) {
            return revenueData[i];
          }
          const baseRevenue = 50000 + (monthIndex % 6) * 5000;
          return {
            month: `Th${monthIndex + 1}`,
            revenue: baseRevenue,
            commission: Math.round(baseRevenue * 0.3),
          };
        });
      }
      case "quarter": {
        // Show years: current year and 5 years back (total 6 years)
        const years = [];
        const startYear = year - 5;

        for (let y = startYear; y <= year; y++) {
          // Generate sample data for each year
          const baseRevenue = 600000 + (y - startYear) * 50000;
          years.push({
            month: `${y}`,
            revenue: baseRevenue,
            commission: Math.round(baseRevenue * 0.3),
          });
        }
        return years;
      }
      default:
        return revenueData;
    }
  }, [timeRange, daysInCurrentMonth]);

  // Filter user stats based on timeRange
  const filteredUserStats = useMemo(() => {
    const baseValue =
      timeRange === "day" ? 100 : timeRange === "month" ? 1000 : 5000;
    const multiplier =
      timeRange === "day" ? daysInCurrentMonth : timeRange === "month" ? 12 : 6;

    return userStats.map((stat, index) => {
      const variation = (index % 3) * 0.1;
      const value = Math.round(baseValue * multiplier * (1 + variation));
      const change =
        timeRange === "day"
          ? "+15.2%"
          : timeRange === "month"
          ? "+12.5%"
          : "+18.3%";
      const color = getChangeColor(change);
      return {
        ...stat,
        value,
        change,
        color,
      };
    });
  }, [timeRange, daysInCurrentMonth]);

  // Filter financial stats based on timeRange
  const filteredFinancialStats = useMemo(() => {
    const baseMultiplier =
      timeRange === "day" ? daysInCurrentMonth : timeRange === "month" ? 12 : 6;

    return financialStats.map((stat) => {
      const baseValue =
        stat.label === "Tổng doanh thu"
          ? 542350
          : stat.label === "Tổng chi trả người hướng dẫn"
          ? 387240
          : stat.label === "Tổng hoa hồng của hệ thống"
          ? 155110
          : 48920;
      const multiplier =
        baseMultiplier *
        (stat.label === "Tổng doanh thu"
          ? 1
          : stat.label === "Tổng chi trả người hướng dẫn"
          ? 0.7
          : stat.label === "Tổng hoa hồng của hệ thống"
          ? 0.3
          : 0.1);
      const value = Math.round(baseValue * multiplier);
      const formattedValue = value.toLocaleString("vi-VN") + " VNĐ";
      const color = getChangeColor(stat.change);

      return {
        ...stat,
        value: formattedValue,
        color,
      };
    });
  }, [timeRange, daysInCurrentMonth]);

  // Filter activity data based on timeRange (percentages remain the same)
  const filteredActivityData = useMemo(() => {
    return activityData;
  }, [timeRange]);

  // Filter top packages based on timeRange
  const filteredTopPackages = useMemo(() => {
    const multiplier =
      timeRange === "day"
        ? daysInCurrentMonth / 30
        : timeRange === "month"
        ? 1
        : 6;
    return topPackages.map((pkg) => ({
      ...pkg,
      purchases: Math.round(pkg.purchases * multiplier),
    }));
  }, [timeRange, daysInCurrentMonth]);

  // Filter top instructors based on timeRange
  const filteredTopInstructors = useMemo(() => {
    const multiplier =
      timeRange === "day"
        ? daysInCurrentMonth / 30
        : timeRange === "month"
        ? 1
        : 6;
    return topInstructors.map((instructor) => ({
      ...instructor,
      sessions: Math.round(instructor.sessions * multiplier),
    }));
  }, [timeRange, daysInCurrentMonth]);

  // Filter top vehicles based on timeRange
  const filteredTopVehicles = useMemo(() => {
    const multiplier =
      timeRange === "day"
        ? daysInCurrentMonth / 30
        : timeRange === "month"
        ? 1
        : 6;
    return topVehicles.map((vehicle) => ({
      ...vehicle,
      rentals: Math.round(vehicle.rentals * multiplier),
    }));
  }, [timeRange, daysInCurrentMonth]);

  // Get dynamic description text
  const getDescriptionText = () => {
    switch (timeRange) {
      case "day":
        return `Tổng quan hoạt động hệ thống trong ${daysInCurrentMonth} ngày của tháng hiện tại`;
      case "month":
        return "Tổng quan hoạt động hệ thống trong 12 tháng của năm hiện tại";
      case "quarter":
        return "Tổng quan hoạt động hệ thống trong 6 năm vừa qua";
      default:
        return "Tổng quan hoạt động hệ thống";
    }
  };

  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case "day":
        return "Theo ngày";
      case "month":
        return "Theo tháng";
      case "quarter":
        return "Theo năm";
      default:
        return "Theo tháng";
    }
  };

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
                {getDescriptionText()}
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
                    : "Năm"}
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
            {filteredUserStats.map((stat) => (
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
                  <p className={`mt-2 text-sm ${changeClassMap[stat.color]}`}>
                    {stat.change}
                  </p>
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
            {filteredFinancialStats.map((stat) => (
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
                    data={filteredActivityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {filteredActivityData.map((entry, index) => (
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
                {filteredActivityData.map((item) => (
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
              <CardDescription>{getTimeRangeDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div
                  style={{
                    minWidth: Math.max(600, filteredRevenueData.length * 60),
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredRevenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="hsl(var(--muted-foreground))"
                        angle={-45}
                        textAnchor="end"
                        height={80}
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
                </div>
              </div>
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
                {filteredTopPackages.map((pkg, idx) => (
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
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star
                          fill="#FDCC0D"
                          className="h-4 w-4"
                          style={{ color: "#FDCC0D" }}
                        />
                        <span style={{ color: "#DC0A21" }}>{pkg.rating}</span>
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
                {filteredTopInstructors.map((instructor, idx) => (
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
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star
                          fill="#FDCC0D"
                          className="h-4 w-4"
                          style={{ color: "#FDCC0D" }}
                        />
                        <span style={{ color: "#DC0A21" }}>
                          {instructor.rating}
                        </span>
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
                {filteredTopVehicles.map((vehicle, idx) => (
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
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <StarIcon
                          fill="#FDCC0D"
                          className="h-4 w-4"
                          style={{ color: "#FDCC0D" }}
                        />
                        <span style={{ color: "#DC0A21" }}>
                          {vehicle.rating}
                        </span>
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
