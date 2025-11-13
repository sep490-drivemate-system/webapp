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
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap, Star, StarIcon, Car, MapPin, Calendar, XCircle } from "lucide-react";
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

// New mock data for additional statistics
const roadTypeData = [
  { name: "Đường đô thị", value: 1245, color: "#3b82f6" },
  { name: "Quốc lộ", value: 892, color: "#10b981" },
  { name: "Đường cao tốc", value: 567, color: "#f59e0b" },
  { name: "Đường tỉnh", value: 434, color: "#ef4444" },
  { name: "Đường đèo", value: 298, color: "#8b5cf6" },
  { name: "Đường trường", value: 234, color: "#06b6d4" },
];

const sessionDurationData = [
  { day: "T2", avgDuration: 2.5, totalSessions: 145 },
  { day: "T3", avgDuration: 2.8, totalSessions: 167 },
  { day: "T4", avgDuration: 3.2, totalSessions: 189 },
  { day: "T5", avgDuration: 2.9, totalSessions: 201 },
  { day: "T6", avgDuration: 3.5, totalSessions: 234 },
  { day: "T7", avgDuration: 4.1, totalSessions: 298 },
  { day: "CN", avgDuration: 3.8, totalSessions: 267 },
];

const refundReasonData = [
  { name: "Hủy sớm (>12h)", value: 45, color: "#10b981" },
  { name: "Hủy muộn (<12h)", value: 25, color: "#f59e0b" },
  { name: "Instructor hủy", value: 20, color: "#ef4444" },
  { name: "Hủy gói", value: 10, color: "#8b5cf6" },
];

const geographicalData = [
  { area: "Quận 1", instructors: 45, bookings: 234, revenue: 156000 },
  { area: "Quận 2", instructors: 38, bookings: 198, revenue: 142000 },
  { area: "Quận 3", instructors: 42, bookings: 212, revenue: 148000 },
  { area: "Thủ Đức", instructors: 67, bookings: 345, revenue: 234000 },
  { area: "Quận 7", instructors: 34, bookings: 167, revenue: 123000 },
  { area: "Bình Thạnh", instructors: 29, bookings: 145, revenue: 98000 },
  { area: "Tân Bình", instructors: 31, bookings: 156, revenue: 112000 },
];

type TimeRange = "week" | "month" | "quarter" | "year";

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

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);

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
    switch (timeRange) {
      case "week": {
        // Show 7 days of the selected week
        return Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const baseRevenue = 8000 + (day % 3) * 2000;
          const revenue = baseRevenue + Math.random() * 3000;
          const commission = revenue * 0.3;
          return {
            month: `T${day + 1}`,
            revenue: Math.round(revenue),
            commission: Math.round(commission),
          };
        });
      }
      case "month": {
        // Show days in selected month
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        return Array.from({ length: Math.min(daysInMonth, 30) }, (_, i) => {
          const day = i + 1;
          const baseRevenue = 2000 + (day % 7) * 500;
          const revenue = baseRevenue * (15 + Math.random() * 10);
          const commission = revenue * 0.3;
          return {
            month: `${day}`,
            revenue: Math.round(revenue),
            commission: Math.round(commission),
          };
        });
      }
      case "quarter": {
        // Show 3 months of selected quarter
        const startMonth = (selectedQuarter - 1) * 3 + 1;
        return Array.from({ length: 3 }, (_, i) => {
          const monthNum = startMonth + i;
          const baseRevenue = 50000 + (monthNum % 6) * 8000;
          const revenue = baseRevenue + Math.random() * 20000;
          const commission = revenue * 0.3;
          return {
            month: `T${monthNum}`,
            revenue: Math.round(revenue),
            commission: Math.round(commission),
          };
        });
      }
      case "year": {
        // Show 12 months of selected year
        return Array.from({ length: 12 }, (_, i) => {
          const monthIndex = i;
          // Use existing revenueData if available for current year, otherwise generate
          if (selectedYear === new Date().getFullYear() && i < revenueData.length) {
            return revenueData[i];
          }
          const baseRevenue = 50000 + (monthIndex % 6) * 5000;
          const revenue = baseRevenue + Math.random() * 15000;
          return {
            month: `T${monthIndex + 1}`,
            revenue: Math.round(revenue),
            commission: Math.round(revenue * 0.3),
          };
        });
      }
      default:
        return revenueData;
    }
  }, [timeRange, selectedYear, selectedMonth, selectedQuarter, selectedWeek]);

  // Filter user stats based on timeRange
  const filteredUserStats = useMemo(() => {
    const baseValue =
      timeRange === "week" ? 50 : timeRange === "month" ? 200 : timeRange === "quarter" ? 800 : 3000;
    const multiplier =
      timeRange === "week" ? 7 : timeRange === "month" ? 30 : timeRange === "quarter" ? 90 : 365;

    return userStats.map((stat, index) => {
      const variation = (index % 3) * 0.1;
      const value = Math.round(baseValue * (1 + variation));
      const change =
        timeRange === "week"
          ? "+8.2%"
          : timeRange === "month"
          ? "+12.5%"
          : timeRange === "quarter"
          ? "+15.8%"
          : "+18.3%";
      const color = getChangeColor(change);
      return {
        ...stat,
        value,
        change,
        color,
      };
    });
  }, [timeRange]);

  // Filter financial stats based on timeRange
  const filteredFinancialStats = useMemo(() => {
    const baseMultiplier =
      timeRange === "week" ? 0.25 : timeRange === "month" ? 1 : timeRange === "quarter" ? 3 : 12;

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
  }, [timeRange]);

  // Filter activity data based on timeRange (percentages remain the same)
  const filteredActivityData = useMemo(() => {
    return activityData;
  }, [timeRange]);

  // Filter top packages based on timeRange
  const filteredTopPackages = useMemo(() => {
    const multiplier =
      timeRange === "week"
        ? 0.25
        : timeRange === "month"
        ? 1
        : timeRange === "quarter"
        ? 3
        : 12;
    return topPackages.map((pkg) => ({
      ...pkg,
      purchases: Math.round(pkg.purchases * multiplier),
    }));
  }, [timeRange]);

  // Filter top instructors based on timeRange
  const filteredTopInstructors = useMemo(() => {
    const multiplier =
      timeRange === "week"
        ? 0.25
        : timeRange === "month"
        ? 1
        : timeRange === "quarter"
        ? 3
        : 12;
    return topInstructors.map((instructor) => ({
      ...instructor,
      sessions: Math.round(instructor.sessions * multiplier),
    }));
  }, [timeRange]);

  // Filter top vehicles based on timeRange
  const filteredTopVehicles = useMemo(() => {
    const multiplier =
      timeRange === "week"
        ? 0.25
        : timeRange === "month"
        ? 1
        : timeRange === "quarter"
        ? 3
        : 12;
    return topVehicles.map((vehicle) => ({
      ...vehicle,
      rentals: Math.round(vehicle.rentals * multiplier),
    }));
  }, [timeRange]);

  // Get dynamic description text
  const getDescriptionText = () => {
    switch (timeRange) {
      case "week":
        return `Tổng quan hoạt động hệ thống trong tuần ${selectedWeek} tháng ${selectedMonth}/${selectedYear}`;
      case "month":
        return `Tổng quan hoạt động hệ thống trong tháng ${selectedMonth}/${selectedYear}`;
      case "quarter":
        return `Tổng quan hoạt động hệ thống trong quý ${selectedQuarter}/${selectedYear}`;
      case "year":
        return `Tổng quan hoạt động hệ thống trong năm ${selectedYear}`;
      default:
        return "Tổng quan hoạt động hệ thống";
    }
  };

  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case "week":
        return `Tuần ${selectedWeek}, Tháng ${selectedMonth}/${selectedYear}`;
      case "month":
        return `Tháng ${selectedMonth}/${selectedYear}`;
      case "quarter":
        return `Quý ${selectedQuarter}/${selectedYear}`;
      case "year":
        return `Năm ${selectedYear}`;
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {(["week", "month", "quarter", "year"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="capitalize"
                  >
                    {range === "week"
                      ? "Tuần"
                      : range === "month"
                      ? "Tháng"
                      : range === "quarter"
                      ? "Quý"
                      : "Năm"}
                  </Button>
                ))}
              </div>

              {/* Time Period Selectors - Grid Layout */}
              <div className="grid grid-cols-4 gap-4 items-center min-h-[40px]">
                {/* Year Selector - Always in first position */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Năm:</span>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="flex-1 px-2 py-1 border rounded-md text-sm bg-background"
                  >
                    {Array.from({ length: timeRange === "year" ? 10 : 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>

                {/* Quarter Selector - Second position */}
                <div className={`flex items-center gap-2 ${timeRange !== "quarter" ? "opacity-50 pointer-events-none" : ""}`}>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Quý:</span>
                  <select 
                    value={selectedQuarter} 
                    onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                    className="flex-1 px-2 py-1 border rounded-md text-sm bg-background"
                    disabled={timeRange !== "quarter"}
                  >
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </select>
                </div>

                {/* Month Selector - Third position */}
                <div className={`flex items-center gap-2 ${timeRange !== "month" && timeRange !== "week" ? "opacity-50 pointer-events-none" : ""}`}>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Tháng:</span>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="flex-1 px-2 py-1 border rounded-md text-sm bg-background"
                    disabled={timeRange !== "month" && timeRange !== "week"}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* Week Selector - Fourth position */}
                <div className={`flex items-center gap-2 ${timeRange !== "week" ? "opacity-50 pointer-events-none" : ""}`}>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Tuần:</span>
                  <select 
                    value={selectedWeek} 
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="flex-1 px-2 py-1 border rounded-md text-sm bg-background"
                    disabled={timeRange !== "week"}
                  >
                    {Array.from({ length: 4 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
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

        {/* Dòng Tiền & Doanh Thu - Full Width */}
        <Card className="bg-card">
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
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={filteredRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      name="Doanh Thu"
                      dot={{ 
                        fill: "#10b981", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 4 
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="commission"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCommission)"
                      strokeWidth={2}
                      name="Lợi Nhuận"
                      dot={{ 
                        fill: "#3b82f6", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 4 
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3 Cards Row */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
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

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Phân Bố Loại Đường
              </CardTitle>
              <CardDescription>Được chọn nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roadTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {roadTypeData.map((entry, index) => (
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
                {roadTypeData.slice(0, 4).map((item) => (
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
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Khung Giờ Booking
              </CardTitle>
              <CardDescription>Phân bố theo giờ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Sáng (6-12h)", value: 35, color: "#3b82f6" },
                      { name: "Chiều (12-18h)", value: 45, color: "#10b981" },
                      { name: "Tối (18-20h)", value: 20, color: "#f59e0b" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      { name: "Sáng (6-12h)", value: 35, color: "#3b82f6" },
                      { name: "Chiều (12-18h)", value: 45, color: "#10b981" },
                      { name: "Tối (18-20h)", value: 20, color: "#f59e0b" },
                    ].map((entry, index) => (
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
                {[
                  { name: "Sáng (6-12h)", value: 35, color: "#3b82f6" },
                  { name: "Chiều (12-18h)", value: 45, color: "#10b981" },
                  { name: "Tối (18-20h)", value: 20, color: "#f59e0b" },
                ].map((item) => (
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
        </div>

        {/* 2 Charts Row */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Gói Có Xe vs Không Có Xe
              </CardTitle>
              <CardDescription>Tỷ lệ lựa chọn phương tiện</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: "Th1", coXe: 68, khongCoXe: 32 },
                    { month: "Th2", coXe: 72, khongCoXe: 28 },
                    { month: "Th3", coXe: 65, khongCoXe: 35 },
                    { month: "Th4", coXe: 70, khongCoXe: 30 },
                    { month: "Th5", coXe: 75, khongCoXe: 25 },
                    { month: "Th6", coXe: 68, khongCoXe: 32 },
                  ]}>
                    <defs>
                      <linearGradient id="colorCoXe" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorKhongCoXe" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="coXe"
                      stackId="1"
                      stroke="#10b981"
                      fill="url(#colorCoXe)"
                      strokeWidth={2}
                      dot={{ 
                        fill: "#10b981", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 4 
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="khongCoXe"
                      stackId="1"
                      stroke="#ef4444"
                      fill="url(#colorKhongCoXe)"
                      strokeWidth={2}
                      dot={{ 
                        fill: "#ef4444", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 4 
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Thời Gian Session & Booking
              </CardTitle>
              <CardDescription>Theo ngày trong tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessionDurationData}>
                    <defs>
                      <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgDuration"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorDuration)"
                      strokeWidth={2}
                      dot={{ 
                        fill: "#3b82f6", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 4 
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}
