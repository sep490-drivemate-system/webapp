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
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Zap, Star, StarIcon, Car, MapPin, Calendar, XCircle, Filter, ChevronDown, CreditCard } from "lucide-react";
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

// New mock data for session status statistics
const sessionStatusData = [
  { name: "Hoàn thành", value: 1245, color: "#10b981" },
  { name: "Đang diễn ra", value: 89, color: "#3b82f6" },
  { name: "Đã đặt chờ", value: 234, color: "#f59e0b" },
  { name: "Bị hủy", value: 156, color: "#ef4444" },
];

// Mock data for cancel & refund statistics (Pie Chart format)
const cancelRefundData = [
  { 
    name: "Hủy >=12h (Hoàn 100%)", 
    value: 68, // 45 + 23
    color: "#10b981",
    details: "Novice: 45, Instructor: 23"
  },
  { 
    name: "Hủy <12h (Không hoàn)", 
    value: 40, // 28 + 12
    color: "#ef4444",
    details: "Novice: 28, Instructor: 12"
  },
  { 
    name: "Instructor hủy <12h (+50%)", 
    value: 15,
    color: "#f59e0b",
    details: "Đền bù 150% cho Novice"
  },
  { 
    name: "Đổi lịch >24h (Miễn phí)", 
    value: 101, // 67 + 34
    color: "#8b5cf6",
    details: "Novice: 67, Instructor: 34"
  },
];

// Mock data for booking time (when sessions are booked)
const bookingTimeData = [
  { month: "Th1", bookingCount: 145 },
  { month: "Th2", bookingCount: 167 },
  { month: "Th3", bookingCount: 189 },
  { month: "Th4", bookingCount: 201 },
  { month: "Th5", bookingCount: 234 },
  { month: "Th6", bookingCount: 298 },
  { month: "Th7", bookingCount: 267 },
  { month: "Th8", bookingCount: 312 },
  { month: "Th9", bookingCount: 289 },
  { month: "Th10", bookingCount: 334 },
  { month: "Th11", bookingCount: 298 },
  { month: "Th12", bookingCount: 356 },
];

// Mock data for session execution time (actual session duration)
const sessionExecutionData = [
  { day: "T2", avgExecutionTime: 2.3, completedSessions: 142 },
  { day: "T3", avgExecutionTime: 2.6, completedSessions: 159 },
  { day: "T4", avgExecutionTime: 2.9, completedSessions: 178 },
  { day: "T5", avgExecutionTime: 2.7, completedSessions: 195 },
  { day: "T6", avgExecutionTime: 3.2, completedSessions: 221 },
  { day: "T7", avgExecutionTime: 3.8, completedSessions: 287 },
  { day: "CN", avgExecutionTime: 3.5, completedSessions: 251 },
];

// Mock data for system transaction history
const transactionHistoryData = [
  {
    id: "TXN001",
    date: "2024-11-13 14:30",
    type: "Thanh toán gói",
    novice: "Nguyễn Văn A",
    instructor: "Trần Thị B",
    amount: 2500000,
    commission: 750000,
    status: "Hoàn thành",
    method: "VNPay"
  },
  {
    id: "TXN002",
    date: "2024-11-13 13:15",
    type: "Hoàn tiền",
    novice: "Lê Văn C",
    instructor: "Phạm Thị D",
    amount: -1200000,
    commission: 0,
    status: "Đã hoàn",
    method: "Chuyển khoản"
  },
  {
    id: "TXN003",
    date: "2024-11-13 12:45",
    type: "Đền bù hủy muộn",
    novice: "Hoàng Văn E",
    instructor: "Võ Thị F",
    amount: 600000,
    commission: 0,
    status: "Đang xử lý",
    method: "Ví DriveMate"
  },
  {
    id: "TXN004",
    date: "2024-11-13 11:20",
    type: "Thanh toán session",
    novice: "Đặng Văn G",
    instructor: "Bùi Thị H",
    amount: 500000,
    commission: 150000,
    status: "Hoàn thành",
    method: "Momo"
  },
  {
    id: "TXN005",
    date: "2024-11-13 10:30",
    type: "Thanh toán gói",
    novice: "Vũ Văn I",
    instructor: "Đinh Thị K",
    amount: 3500000,
    commission: 1050000,
    status: "Hoàn thành",
    method: "VNPay"
  },
  {
    id: "TXN006",
    date: "2024-11-13 09:15",
    type: "Rút tiền",
    novice: "-",
    instructor: "Ngô Văn L",
    amount: -2000000,
    commission: -50000,
    status: "Đã chuyển",
    method: "Ngân hàng"
  },
  {
    id: "TXN007",
    date: "2024-11-13 08:45",
    type: "Phí phạt",
    novice: "Trịnh Văn M",
    instructor: "-",
    amount: 200000,
    commission: 200000,
    status: "Hoàn thành",
    method: "Tự động"
  },
  {
    id: "TXN008",
    date: "2024-11-12 16:30",
    type: "Thanh toán gói",
    novice: "Phan Thị N",
    instructor: "Lý Văn O",
    amount: 1800000,
    commission: 540000,
    status: "Hoàn thành",
    method: "ZaloPay"
  }
];



type TimeRange = "week" | "month" | "year";

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
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("month");
  const [timeRange, setTimeRange] = useState("month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get current date dynamically
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  
  // Calculate current week of the month dynamically
  const getCurrentWeekOfMonth = (year: number, month: number, day?: number) => {
    const targetDate = day ? new Date(year, month - 1, day) : new Date();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentDay = targetDate.getDate();
    
    // Calculate which week of the month this day falls into
    return Math.ceil((currentDay + firstWeekday) / 7);
  };
  
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  
  // Calculate available years (current year and previous years)
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };
  
  // Calculate available months for selected year
  const getAvailableMonths = (year: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year === currentYear) {
      // For current year, only show months up to current month
      return Array.from({ length: currentMonth }, (_, i) => i + 1);
    } else if (year < currentYear) {
      // For past years, show all 12 months
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      // For future years (shouldn't happen), show no months
      return [];
    }
  };
  
  // Calculate available weeks for selected month/year
  const getAvailableWeeks = (year: number, month: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Get the last day of the selected month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay();
    
    // Calculate total weeks in this month
    const totalWeeks = Math.ceil((lastDayOfMonth + firstWeekday) / 7);
    
    if (year === currentYear && month === currentMonth) {
      // For current month, only show weeks up to current week
      const currentWeek = getCurrentWeekOfMonth(year, month, currentDate.getDate());
      return Array.from({ length: currentWeek }, (_, i) => i + 1);
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      // For past months, show all weeks
      return Array.from({ length: totalWeeks }, (_, i) => i + 1);
    } else {
      // For future months (shouldn't happen), show no weeks
      return [];
    }
  };

  // Use viewMode as the current time range
  const currentTimeRange = viewMode;

  // Generate filtered data based on timeRange
  const filteredRevenueData = useMemo(() => {
    switch (currentTimeRange) {
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
  }, [viewMode, selectedYear, selectedMonth, selectedWeek]);

  // Filter user stats based on timeRange
  const filteredUserStats = useMemo(() => {
    const baseValue =
      currentTimeRange === "week" ? 50 : currentTimeRange === "month" ? 200 : 3000;
    const multiplier =
      currentTimeRange === "week" ? 7 : currentTimeRange === "month" ? 30 : 365;

    return userStats.map((stat, index) => {
      const variation = (index % 3) * 0.1;
      const value = Math.round(baseValue * (1 + variation));
      const change =
        currentTimeRange === "week"
          ? "+8.2%"
          : currentTimeRange === "month"
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
  }, [timeRange]);

  // Filter financial stats based on timeRange
  const filteredFinancialStats = useMemo(() => {
    const baseMultiplier =
      currentTimeRange === "week" ? 0.25 : currentTimeRange === "month" ? 1 : 12;

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
  }, [viewMode]);

  // Filter activity data based on timeRange (percentages remain the same)
  const filteredActivityData = useMemo(() => {
    return activityData;
  }, [viewMode]);

  // Filter top packages based on timeRange
  const filteredTopPackages = useMemo(() => {
    const multiplier =
      currentTimeRange === "week"
        ? 0.25
        : currentTimeRange === "month"
        ? 1
        : 12;
    return topPackages.map((pkg) => ({
      ...pkg,
      purchases: Math.round(pkg.purchases * multiplier),
    }));
  }, [viewMode]);

  // Filter top instructors based on timeRange
  const filteredTopInstructors = useMemo(() => {
    const multiplier =
      currentTimeRange === "week"
        ? 0.25
        : currentTimeRange === "month"
        ? 1
        : 12;
    return topInstructors.map((instructor) => ({
      ...instructor,
      sessions: Math.round(instructor.sessions * multiplier),
    }));
  }, [viewMode]);

  // Filter top vehicles based on timeRange
  const filteredTopVehicles = useMemo(() => {
    const multiplier =
      currentTimeRange === "week"
        ? 0.25
        : currentTimeRange === "month"
        ? 1
        : 12;
    return topVehicles.map((vehicle) => ({
      ...vehicle,
      rentals: Math.round(vehicle.rentals * multiplier),
    }));
  }, [viewMode]);


  const getTimeRangeDescription = () => {
    switch (currentTimeRange) {
      case "week":
        return `Tuần ${selectedWeek}, Tháng ${selectedMonth}/${selectedYear}`;
      case "month":
        return `Tháng ${selectedMonth}/${selectedYear}`;
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
                Tổng Quan Hệ Thống
              </h1>
            </div>
            <div className="relative">
              {/* Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Filter button clicked, current state:", isFilterOpen);
                  setIsFilterOpen(!isFilterOpen);
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Bộ lọc {isFilterOpen ? '(Mở)' : '(Đóng)'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4" style={{backgroundColor: 'white', border: '1px solid #ccc'}}>
                  <div className="space-y-4">
                    {/* View Mode Selection */}
                    <div>
                      <label className="text-sm font-medium text-black mb-2 block">Xem theo:</label>
                      <div className="flex gap-2">
                        {(["year", "month", "week"] as const).map((mode) => (
                          <Button
                            key={mode}
                            variant={viewMode === mode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode(mode)}
                            className="flex-1"
                          >
                            {mode === "year" ? "Năm" : mode === "month" ? "Tháng" : "Tuần"}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Time Period Selectors */}
                    <div className="space-y-3">
                      {/* Year Selector - Always visible */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Năm:</label>
                        <select 
                          value={selectedYear} 
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            setSelectedYear(newYear);
                            
                            // Reset month to latest available month for the selected year
                            if (viewMode !== "year") {
                              const availableMonths = getAvailableMonths(newYear);
                              const latestMonth = availableMonths[availableMonths.length - 1] || 1;
                              setSelectedMonth(latestMonth);
                              
                              // Reset week to latest available week for the selected month
                              if (viewMode === "week") {
                                const availableWeeks = getAvailableWeeks(newYear, latestMonth);
                                const latestWeek = availableWeeks[availableWeeks.length - 1] || 1;
                                setSelectedWeek(latestWeek);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                        >
                          {getAvailableYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      {/* Month Selector - Show only if viewMode is month or week */}
                      {(viewMode === "month" || viewMode === "week") && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Tháng:</label>
                          <select 
                            value={selectedMonth} 
                            onChange={(e) => {
                              const newMonth = Number(e.target.value);
                              setSelectedMonth(newMonth);
                              
                              // Reset week to latest available week for the selected month
                              if (viewMode === "week") {
                                const availableWeeks = getAvailableWeeks(selectedYear, newMonth);
                                const latestWeek = availableWeeks[availableWeeks.length - 1] || 1;
                                setSelectedWeek(latestWeek);
                              }
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableMonths(selectedYear).map((month) => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Week Selector - Show only if viewMode is week */}
                      {viewMode === "week" && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Tuần:</label>
                          <select 
                            value={selectedWeek} 
                            onChange={(e) => setSelectedWeek(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableWeeks(selectedYear, selectedMonth).map((week) => (
                              <option key={week} value={week}>{week}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Apply/Close buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1"
                      >
                        Đóng
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Click outside to close */}
              {isFilterOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsFilterOpen(false)}
                />
              )}
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
                <Calendar className="h-5 w-5 text-primary" />
                Thống Kê Trạng Thái Session
              </CardTitle>
              <CardDescription>Tình trạng các buổi học</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sessionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value, name) => [
                      `${value} buổi`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {sessionStatusData.map((item) => (
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
                      {item.value} buổi
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-primary" />
                Thống Kê Cancel & Refund
              </CardTitle>
              <CardDescription>Phân tích hủy lịch và hoàn tiền</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cancelRefundData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {cancelRefundData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value, name) => [
                      `${value} trường hợp`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {cancelRefundData.map((item) => (
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
        </div>

        {/* 2 Charts Row */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Thời Gian Đặt Lịch Session
              </CardTitle>
              <CardDescription>Số lượng booking theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={bookingTimeData}>
                    <defs>
                      <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      horizontal={true}
                      vertical={true}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      axisLine={true}
                      tickLine={true}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value) => [`${value} booking`, "Số lượng đặt lịch"]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="bookingCount"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorBooking)"
                      strokeWidth={3}
                      name="Số lượng booking"
                      dot={{ 
                        fill: "#3b82f6", 
                        strokeWidth: 2, 
                        stroke: "#ffffff",
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: "#3b82f6", 
                        strokeWidth: 2,
                        fill: "#ffffff"
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
                <Zap className="h-5 w-5 text-primary" />
                Thời Gian Thực Thi Session
              </CardTitle>
              <CardDescription>Thời gian thực tế thực hiện session theo ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessionExecutionData}>
                    <defs>
                      <linearGradient id="colorExecution" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
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
                      formatter={(value) => [`${value} giờ`, "Thời gian trung bình"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgExecutionTime"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorExecution)"
                      strokeWidth={2}
                      dot={{ 
                        fill: "#10b981", 
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

        {/* Lịch Sử Giao Dịch Hệ Thống */}
        <Card className="mt-8 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Lịch Sử Giao Dịch Hệ Thống
            </CardTitle>
            <CardDescription>Các giao dịch gần đây trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mã GD</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Thời gian</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Loại</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Novice</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Instructor</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Số tiền</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Hoa hồng</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Trạng thái</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Phương thức</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistoryData.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Thanh toán gói' ? 'bg-blue-100 text-blue-800' :
                          transaction.type === 'Hoàn tiền' ? 'bg-red-100 text-red-800' :
                          transaction.type === 'Đền bù hủy muộn' ? 'bg-orange-100 text-orange-800' :
                          transaction.type === 'Thanh toán session' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'Rút tiền' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{transaction.novice}</td>
                      <td className="py-3 px-4 text-sm">{transaction.instructor}</td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        transaction.commission >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.commission >= 0 ? '+' : ''}{transaction.commission.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Đã hoàn' ? 'bg-blue-100 text-blue-800' :
                          transaction.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-muted-foreground">{transaction.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Hiển thị {transactionHistoryData.length} giao dịch gần đây
              </p>
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}
