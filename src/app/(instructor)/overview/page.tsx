"use client";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getStatisticsInstructor, getStatisticOverviewPriceInstructor } from "@/features/instructor/instructorThunk";
import { StatisticTimeType } from "@/types/instructor/instructor-management.types";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Box,
  CalendarDays,
  ChevronDown,
  Filter,
  Navigation,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/Header/header";

type TimeRange = "week" | "month" | "year";

const chartColors = ["#2563eb", "#0ea5e9", "#f97316", "#10b981", "#f43f5e"];

type PackageStats = {
  name: string;
  hours: number;
  buyers: number;
  sessions: number;
};

type StudentStats = {
  id: number;
  name: string;
  phone: string;
  package: string;
  sessions: number;
  completed: number;
  rescheduled: number;
  cancelled: number;
};

type OverviewData = {
  label: string;
  packageData: PackageStats[];
  students: StudentStats[];
  grossRevenue: number;
};

const overviewDataByRange: Record<TimeRange, OverviewData> = {
  week: {
    label: "tuần hiện tại",
    packageData: [
      { name: "Gói Đường Ban Đêm (40h)", hours: 40, buyers: 6, sessions: 18 },
      { name: "Gói Đường Cao Tốc (10h)", hours: 10, buyers: 5, sessions: 16 },
      { name: "Gói Miền Tây (7h)", hours: 7, buyers: 3, sessions: 9 },
      { name: "Gói Sơ Cấp (20h)", hours: 20, buyers: 8, sessions: 24 },
    ],
    students: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0901234567",
        package: "Gói Đường Cao Tốc",
        sessions: 3,
        completed: 2,
        rescheduled: 1,
        cancelled: 0,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "0912345678",
        package: "Gói Miền Tây",
        sessions: 2,
        completed: 2,
        rescheduled: 0,
        cancelled: 0,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "0923456789",
        package: "Gói Sơ Cấp",
        sessions: 4,
        completed: 3,
        rescheduled: 0,
        cancelled: 1,
      },
    ],
    grossRevenue: 3_000_000,
  },
  month: {
    label: "tháng hiện tại",
    packageData: [
      { name: "Gói Đường Ban Đêm (40h)", hours: 40, buyers: 24, sessions: 72 },
      { name: "Gói Đường Cao Tốc (10h)", hours: 10, buyers: 18, sessions: 65 },
      { name: "Gói Miền Tây (7h)", hours: 7, buyers: 12, sessions: 36 },
      { name: "Gói Sơ Cấp (20h)", hours: 20, buyers: 30, sessions: 90 },
    ],
    students: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0901234567",
        package: "Gói Đường Cao Tốc",
        sessions: 8,
        completed: 6,
        rescheduled: 1,
        cancelled: 1,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "0912345678",
        package: "Gói Miền Tây",
        sessions: 5,
        completed: 5,
        rescheduled: 0,
        cancelled: 0,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "0923456789",
        package: "Gói Sơ Cấp",
        sessions: 10,
        completed: 9,
        rescheduled: 0,
        cancelled: 1,
      },
    ],
    grossRevenue: 12_000_000,
  },
  year: {
    label: "năm hiện tại",
    packageData: [
      {
        name: "Gói Đường Ban Đêm (40h)",
        hours: 40,
        buyers: 120,
        sessions: 360,
      },
      { name: "Gói Đường Cao Tốc (10h)", hours: 10, buyers: 96, sessions: 320 },
      { name: "Gói Miền Tây (7h)", hours: 7, buyers: 72, sessions: 216 },
      { name: "Gói Sơ Cấp (20h)", hours: 20, buyers: 150, sessions: 450 },
    ],
    students: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0901234567",
        package: "Gói Đường Cao Tốc",
        sessions: 40,
        completed: 34,
        rescheduled: 3,
        cancelled: 3,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "0912345678",
        package: "Gói Miền Tây",
        sessions: 26,
        completed: 25,
        rescheduled: 0,
        cancelled: 1,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "0923456789",
        package: "Gói Sơ Cấp",
        sessions: 50,
        completed: 46,
        rescheduled: 1,
        cancelled: 3,
      },
    ],
    grossRevenue: 120_000_000,
  },
};

const sessionTemplate = [
  { completed: 8, cancelled: 1, rescheduled: 2 },
  { completed: 12, cancelled: 0, rescheduled: 1 },
  { completed: 10, cancelled: 2, rescheduled: 3 },
  { completed: 14, cancelled: 1, rescheduled: 0 },
  { completed: 20, cancelled: 3, rescheduled: 2 },
  { completed: 16, cancelled: 1, rescheduled: 1 },
  { completed: 18, cancelled: 2, rescheduled: 2 },
];

// Commission rate is now calculated from API data

const formatDateLabel = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};

const getCurrentWeekSessions = () => {
  const today = new Date();
  const currentWeekday = (today.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - currentWeekday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const template = sessionTemplate[index % sessionTemplate.length];
    return {
      label: formatDateLabel(date),
      completed: template.completed,
      rescheduled: template.rescheduled,
      cancelled: template.cancelled,
    };
  });
};

const getCurrentMonthSessions = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const template = sessionTemplate[index % sessionTemplate.length];
    return {
      label: `${index + 1}`.padStart(2, "0"),
      completed: template.completed,
      rescheduled: template.rescheduled,
      cancelled: template.cancelled,
    };
  });
};

const getCurrentYearSessions = () => {
  return Array.from({ length: 12 }, (_, index) => {
    const template = sessionTemplate[index % sessionTemplate.length];
    return {
      label: `T${index + 1}`,
      completed: template.completed * 4,
      rescheduled: template.rescheduled * 4,
      cancelled: template.cancelled * 4,
    };
  });
};

const getSessionsByRange = (timeRange: TimeRange) => {
  switch (timeRange) {
    case "week":
      return getCurrentWeekSessions();
    case "month":
      return getCurrentMonthSessions();
    case "year":
      return getCurrentYearSessions();
    default:
      return getCurrentWeekSessions();
  }
};

type KpiCard = {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent: string;
};

export default function InstructorOverviewPage() {
  const dispatch = useAppDispatch();
  const { statistics, revenueStatistics, isLoading, errorMessage } = useAppSelector(
    (state) => state.instructor
  );

  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Filter states matching dashboard
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("week");

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

  const [selectedWeek, setSelectedWeek] = useState(
    getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );

  // Fetch statistics when filters change
  useEffect(() => {
    const filter: {
      year?: number;
      month?: number;
      week?: number;
      type?: StatisticTimeType;
    } = {};

    if (viewMode === "year") {
      filter.year = selectedYear;
      filter.type = StatisticTimeType.Yearly;
    } else if (viewMode === "month") {
      filter.year = selectedYear;
      filter.month = selectedMonth;
      filter.type = StatisticTimeType.Monthly;
    } else if (viewMode === "week") {
      filter.year = selectedYear;
      filter.month = selectedMonth;
      filter.week = selectedWeek;
      filter.type = StatisticTimeType.Weekly;
    }

    dispatch(getStatisticsInstructor(filter));
    
    // Get instructorId from JWT token
    const userInfo = getUserInfo();
    const instructorId = userInfo?.id;
    if (instructorId) {
      dispatch(getStatisticOverviewPriceInstructor({ instructorId }));
    }
  }, [dispatch, viewMode, selectedYear, selectedMonth, selectedWeek]);

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
      const currentWeek = getCurrentWeekOfMonth(
        year,
        month,
        currentDate.getDate()
      );
      return Array.from({ length: currentWeek }, (_, i) => i + 1);
    } else if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      // For past months, show all weeks
      return Array.from({ length: totalWeeks }, (_, i) => i + 1);
    } else {
      // For future months (shouldn't happen), show no weeks
      return [];
    }
  };

  // Sync viewMode with timeRange when viewMode changes
  const handleViewModeChange = (mode: "year" | "month" | "week") => {
    setViewMode(mode);
    // Map viewMode to timeRange
    if (mode === "week") setTimeRange("week");
    else if (mode === "month") setTimeRange("month");
    else if (mode === "year") setTimeRange("year");
  };

  // Format time range description based on selected values
  const getTimeRangeDescription = () => {
    switch (viewMode) {
      case "week":
        return `Tuần ${selectedWeek}, Tháng ${selectedMonth}/${selectedYear}`;
      case "month":
        return `Tháng ${selectedMonth}/${selectedYear}`;
      case "year":
        return `Năm ${selectedYear}`;
      default:
        return "Tuần hiện tại";
    }
  };

  // Transform API data to UI format
  const transformedData = useMemo(() => {
    if (!statistics) {
      // Fallback to mock data if API hasn't loaded yet
      const baseData = overviewDataByRange[timeRange];
      return {
        packageData: baseData.packageData,
        students: baseData.students,
      };
    }

    // Transform topPersonalPackages to packageData format
    const packageData = statistics.topPersonalPackages.map((pkg) => ({
      name: pkg.name,
      hours: 0, // Not available in API
      buyers: pkg.bookCount,
      sessions: pkg.bookCount, // Using bookCount as approximation
    }));

    // Transform recentPurchases to students format
    const students = statistics.recentPurchases.map((purchase, idx) => ({
      id: idx + 1,
      name: purchase.fullname,
      phone: purchase.phoneNumber,
      package: purchase.packageName,
      sessions: 0, // Not directly available, will need to calculate from other data
      completed: 0,
      rescheduled: 0,
      cancelled: 0,
    }));

    return {
      packageData,
      students,
    };
  }, [statistics, timeRange]);

  const packageData = transformedData.packageData;
  const students = transformedData.students;

  // Calculate revenue from API
  const grossRevenue = revenueStatistics?.totalRevenue ?? 0;
  const commission = revenueStatistics?.totalDeduction ?? 0;
  const netRevenue = revenueStatistics?.revenueAfterDeduction ?? 0;
  const commissionRate = grossRevenue > 0 ? commission / grossRevenue : 0.15;

  // Calculate totals from API
  const totalPackages = statistics?.totalPackageCount ?? 0;
  const totalSessions = useMemo(() => {
    if (!statistics?.totalSessionByStatusCount) return 0;
    return Object.values(statistics.totalSessionByStatusCount).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [statistics]);
  
  // Get session counts from API - note: backend uses capitalized keys
  const totalCancelled = statistics?.totalSessionByStatusCount?.Cancelled ?? 0;
  const totalRescheduled = statistics?.totalSessionByStatusCount?.Reschedule ?? 0;

  const kpis: KpiCard[] = [
    {
      title: "Tổng số gói dịch vụ",
      value: `${totalPackages}`,
      sub: "Đang hoạt động",
      icon: Box,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tổng số buổi huấn luyện",
      value: `${totalSessions}`,
      sub: `${totalCancelled} hủy · ${totalRescheduled} dời `,
      icon: Navigation,
      accent: "bg-sky-50 text-sky-600",
    },
    {
      title: "Doanh thu thực nhận",
      value: `${netRevenue.toLocaleString("vi-VN")} đ`,
      sub: `Hoa hồng ${(commissionRate * 100).toFixed(0)}%`,
      icon: TrendingUp,
      accent: "bg-emerald-50 text-emerald-600",
    },
  ];

  const pieData = useMemo(
    () => {
      if (statistics?.topPersonalPackages) {
        return statistics.topPersonalPackages.map((pkg, idx) => ({
          name: pkg.name,
          value: pkg.bookCount,
          fill: chartColors[idx % chartColors.length],
        }));
      }
      return packageData.map((pkg, idx) => ({
        name: pkg.name,
        value: pkg.buyers,
        fill: chartColors[idx % chartColors.length],
      }));
    },
    [statistics, packageData]
  );

  // Transform totalSessionByDay to sessionsData format based on viewMode (matching mobile logic)
  const sessionsData = useMemo(() => {
    // Handle both totalSessionByDay and totalSessionByday (backend typo)
    const dayData = (statistics?.totalSessionByDay as Record<string, Record<string, number>> | undefined) || 
                    ((statistics as { totalSessionByday?: Record<string, Record<string, number>> })?.totalSessionByday) || 
                    {};
    
    const sessions: Array<{
      label: string;
      completed: number;
      cancelled: number;
      rescheduled: number;
    }> = [];

    if (viewMode === "year") {
      // Display 12 months in the year
      for (let month = 1; month <= 12; month++) {
        const monthKey = month.toString();
        const dataItem = dayData[monthKey];
        const completed = dataItem?.Completed ?? 0;
        const cancelled = dataItem?.Cancelled ?? 0;
        const rescheduled = dataItem?.Reschedule ?? 0;
        sessions.push({
          label: `T${month}`,
          completed,
          cancelled,
          rescheduled,
        });
      }
    } else if (viewMode === "month") {
      // Display all days in the month
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = day.toString();
        const dataItem = dayData[dayKey];
        const completed = dataItem?.Completed ?? 0;
        const cancelled = dataItem?.Cancelled ?? 0;
        const rescheduled = dataItem?.Reschedule ?? 0;
        sessions.push({
          label: `${day}`.padStart(2, "0"),
          completed,
          cancelled,
          rescheduled,
        });
      }
    } else {
      // Week view - display 7 days in the week
      // Calculate start date of the week (Monday)
      const today = new Date(selectedYear, selectedMonth - 1, 1);
      const firstMonday = new Date(today);
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
      const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
      firstMonday.setDate(today.getDate() + daysToMonday);

      // Calculate week based on selectedWeek (week 1, 2, 3, 4)
      const weekStartDate = new Date(firstMonday);
      weekStartDate.setDate(firstMonday.getDate() + (selectedWeek - 1) * 7);

      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(weekStartDate);
        currentDate.setDate(weekStartDate.getDate() + dayOffset);
        const day = currentDate.getDate();
        const dayKey = day.toString();
        const dataItem = dayData[dayKey];
        const completed = dataItem?.Completed ?? 0;
        const cancelled = dataItem?.Cancelled ?? 0;
        const rescheduled = dataItem?.Reschedule ?? 0;
        
        sessions.push({
          label: formatDateLabel(currentDate),
          completed,
          cancelled,
          rescheduled,
        });
      }
    }

    if (sessions.length === 0) {
      // Fallback to mock data
      return getSessionsByRange(timeRange);
    }

    return sessions;
  }, [statistics, viewMode, selectedYear, selectedMonth, selectedWeek, timeRange]);

  const sessionTotals = useMemo(() => {
    if (statistics?.totalSessionByStatusCount) {
      return {
        completed: statistics.totalSessionByStatusCount.Completed || 0,
        rescheduled: statistics.totalSessionByStatusCount.Reschedule || 0,
        cancelled: statistics.totalSessionByStatusCount.Cancelled || 0,
      };
    }
    return sessionsData.reduce(
      (totals, session) => ({
        completed: totals.completed + session.completed,
        rescheduled: totals.rescheduled + session.rescheduled,
        cancelled: totals.cancelled + session.cancelled,
      }),
      { completed: 0, rescheduled: 0, cancelled: 0 }
    );
  }, [statistics, sessionsData]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Doanh Thu, Người Lái Mới & Gói Dịch Vụ"
        description="Theo dõi hiệu suất buổi huấn luyện, doanh thu và danh sách người lái mới."
      />
      {isLoading && (
        <div className="text-center py-4 text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      )}
      {errorMessage && (
        <div className="text-center py-4 text-destructive">
          Lỗi: {errorMessage}
        </div>
      )}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Đang xem theo:{" "}
            <span className="font-medium text-foreground">
              {getTimeRangeDescription()}
            </span>
          </span>
          <div className="relative">
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log(
                  "Filter button clicked, current state:",
                  isFilterOpen
                );
                setIsFilterOpen(!isFilterOpen);
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc {isFilterOpen ? "(Mở)" : "(Đóng)"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4"
                style={{ backgroundColor: "white", border: "1px solid #ccc" }}
              >
                <div className="space-y-4">
                  {/* View Mode Selection */}
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block">
                      Xem theo:
                    </label>
                    <div className="flex gap-2">
                      {(["year", "month", "week"] as const).map((mode) => (
                        <Button
                          key={mode}
                          variant={viewMode === mode ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleViewModeChange(mode)}
                          className="flex-1"
                        >
                          {mode === "year"
                            ? "Năm"
                            : mode === "month"
                            ? "Tháng"
                            : "Tuần"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Period Selectors */}
                  <div className="space-y-3">
                    {/* Year Selector - Always visible */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Năm:
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          const newYear = Number(e.target.value);
                          setSelectedYear(newYear);

                          // Reset month to latest available month for the selected year
                          if (viewMode !== "year") {
                            const availableMonths = getAvailableMonths(newYear);
                            const latestMonth =
                              availableMonths[availableMonths.length - 1] || 1;
                            setSelectedMonth(latestMonth);

                            // Reset week to latest available week for the selected month
                            if (viewMode === "week") {
                              const availableWeeks = getAvailableWeeks(
                                newYear,
                                latestMonth
                              );
                              const latestWeek =
                                availableWeeks[availableWeeks.length - 1] || 1;
                              setSelectedWeek(latestWeek);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        {getAvailableYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month Selector - Show only if viewMode is month or week */}
                    {(viewMode === "month" || viewMode === "week") && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Tháng:
                        </label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => {
                            const newMonth = Number(e.target.value);
                            setSelectedMonth(newMonth);

                            // Reset week to latest available week for the selected month
                            if (viewMode === "week") {
                              const availableWeeks = getAvailableWeeks(
                                selectedYear,
                                newMonth
                              );
                              const latestWeek =
                                availableWeeks[availableWeeks.length - 1] || 1;
                              setSelectedWeek(latestWeek);
                            }
                          }}
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                        >
                          {getAvailableMonths(selectedYear).map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Week Selector - Show only if viewMode is week */}
                    {viewMode === "week" && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Tuần:
                        </label>
                        <select
                          value={selectedWeek}
                          onChange={(e) =>
                            setSelectedWeek(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                        >
                          {getAvailableWeeks(selectedYear, selectedMonth).map(
                            (week) => (
                              <option key={week} value={week}>
                                {week}
                              </option>
                            )
                          )}
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

      <section className="grid gap-4 grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardDescription>{kpi.title}</CardDescription>
                  <CardTitle className="text-3xl font-semibold">
                    {kpi.value}
                  </CardTitle>
                  {kpi.sub && (
                    <p className="text-sm text-muted-foreground">{kpi.sub}</p>
                  )}
                </div>
                <span className={`rounded-xl p-3 ${kpi.accent}`}>
                  <Icon className="size-5" />
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Gói dịch vụ được ưa chuộng</CardTitle>
                <CardDescription>
                  Top gói theo số lượng người lái mới đăng ký trong{" "}
                  {getTimeRangeDescription()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} người lái mới`}
                    contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {packageData.map((pkg, idx) => {
                const isActive = selectedPackage === idx;
                const totalBuyers = packageData.reduce(
                  (sum, item) => sum + item.buyers,
                  0
                );
                return (
                  <button
                    key={pkg.name}
                    onClick={() => setSelectedPackage(isActive ? null : idx)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex size-3 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[idx % chartColors.length],
                        }}
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {pkg.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.buyers} người lái mới · {pkg.sessions} buổi
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {Math.round((pkg.buyers / totalBuyers) * 100)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Buổi huấn luyện</CardTitle>
                <CardDescription>
                  Số liệu hoàn thành, dời lịch và hủy theo{" "}
                  {getTimeRangeDescription()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    name="Hoàn thành"
                    stackId="sessions"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rescheduled"
                    name="Dời lịch"
                    stackId="sessions"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="cancelled"
                    name="Hủy"
                    stackId="sessions"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                <p className="text-xs font-medium text-emerald-700">
                  Hoàn thành
                </p>
                <p className="text-2xl font-semibold text-emerald-900">
                  {sessionTotals.completed}
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                <p className="text-xs font-medium text-amber-700">Dời lịch</p>
                <p className="text-2xl font-semibold text-amber-900">
                  {sessionTotals.rescheduled}
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4">
                <p className="text-xs font-medium text-rose-700">Hủy</p>
                <p className="text-2xl font-semibold text-rose-900">
                  {sessionTotals.cancelled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Doanh thu</CardTitle>
                <CardDescription>
                  Thực nhận sau khi trừ hoa hồng hệ thống trong{" "}
                  {getTimeRangeDescription()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-foreground">
                {grossRevenue.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <div className="rounded-xl border bg-rose-50 p-4">
              <p className="text-sm text-rose-600">
                Hoa hồng ({(commissionRate * 100).toFixed(0)}%)
              </p>
              <p className="text-2xl font-semibold text-rose-600">
                {commission.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <div className="rounded-xl border bg-emerald-50 p-4">
              <p className="text-sm text-emerald-600">Doanh thu thực nhận</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {netRevenue.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Danh sách người lái mới</CardTitle>
                <CardDescription>
                  Theo dõi tiến độ từng người lái mới để tối ưu lịch tập lái
                  theo {getTimeRangeDescription()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-2xl border">
              <Table>
                <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <TableRow>
                    <TableHead className="text-center font-semibold">
                      STT
                    </TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead className="text-center">Buổi tập lái</TableHead>
                    <TableHead className="text-center">Hoàn thành</TableHead>
                    <TableHead className="text-center">Đã dời</TableHead>
                    <TableHead className="text-center">Đã hủy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        Không tìm thấy người lái mới nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student, index) => (
                      <TableRow key={student.id} className="hover:bg-muted/30">
                        <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.phone}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.package}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-foreground">
                          {student.sessions}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-50 text-emerald-700">
                            {student.completed}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-amber-600">
                          {student.rescheduled > 0 ? student.rescheduled : "-"}
                        </TableCell>
                        <TableCell className="text-center text-rose-600">
                          {student.cancelled > 0 ? student.cancelled : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
