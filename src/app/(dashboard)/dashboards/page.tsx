"use client";

import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/commons/Header/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStatistic } from "@/hooks/admin/useStatistic";
import {
  IBookingStatistic,
  ITransactionStatistic,
  IUserStatistic,
} from "@/types/statistic/statistic.type";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  DollarSign,
  Filter,
  Star,
  StarIcon,
  TrendingUp,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
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

const activityData = [
  { name: "Hoàn thành", value: 68, color: "#10b981" },
  { name: "Hủy bỏ", value: 18, color: "#ef4444" },
  { name: "Dời lịch", value: 14, color: "#f59e0b" },
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
    details: "Novice: 45, Instructor: 23",
  },
  {
    name: "Hủy <12h (Không hoàn)",
    value: 40, // 28 + 12
    color: "#ef4444",
    details: "Novice: 28, Instructor: 12",
  },
  {
    name: "Instructor hủy <12h (+50%)",
    value: 15,
    color: "#f59e0b",
    details: "Đền bù 150% cho Novice",
  },
  {
    name: "Đổi lịch >24h (Miễn phí)",
    value: 101, // 67 + 34
    color: "#8b5cf6",
    details: "Novice: 67, Instructor: 34",
  },
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
    method: "VNPay",
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
    method: "Chuyển khoản",
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
    method: "Ví DriveMate",
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
    method: "Momo",
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
    method: "VNPay",
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
    method: "Ngân hàng",
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
    method: "Tự động",
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
    method: "ZaloPay",
  },
];

function AdminDashboard() {
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    getUserStatisticData,
    getUserStatisticLoading,
    getTransactionStatisticData,
    getTransactionStatisticLoading,
    getBookingStatisticData,
    getBookingStatisticLoading,
  } = useStatistic();
  const [userStatisticData, setUserStatisticData] =
    useState<IUserStatistic | null>(null);
  const [transactionStatisticData, setTransactionStatisticData] =
    useState<ITransactionStatistic | null>(null);
  const [bookingStatisticData, setBookingStatisticData] =
    useState<IBookingStatistic | null>(null);
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

  // Temporary states for filter (only applied when user clicks "Áp dụng")
  const [tempViewMode, setTempViewMode] = useState<"year" | "month" | "week">(
    "month"
  );
  const [tempSelectedYear, setTempSelectedYear] = useState(now.getFullYear());
  const [tempSelectedMonth, setTempSelectedMonth] = useState(
    now.getMonth() + 1
  );
  const [tempSelectedWeek, setTempSelectedWeek] = useState(
    getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );

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

  // Use viewMode as the current time range
  const currentTimeRange = viewMode;

  // Generate filtered data based on timeRange and API data
  const filteredRevenueData = useMemo(() => {
    // Get API data
    const earningGraph = transactionStatisticData?.earning_graph ?? {};
    const profitGraph = transactionStatisticData?.profit_graph ?? {};

    // Helper function to get value from graph, default to 0 if not found
    const getValue = (graph: { [key: string]: number }, key: string): number => {
      const value = graph[key];
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "number" &&
        !isNaN(value)
      ) {
        return value;
      }
      return 0;
    };

    // Generate all keys based on currentTimeRange
    let allKeys: string[] = [];
    let labelFormatter: (key: string) => string = (key) => key;

    switch (currentTimeRange) {
      case "week": {
        // Show 7 days of the week (keys: "1", "2", ..., "7")
        allKeys = Array.from({ length: 7 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `T${numKey + 1}` : key;
        };
        break;
      }
      case "month": {
        // Show all days in selected month (keys: "1", "2", ..., "31")
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        allKeys = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        labelFormatter = (key) => key; // Just show the day number
        break;
      }
      case "year": {
        // Show 12 months (keys: "1", "2", ..., "12")
        allKeys = Array.from({ length: 12 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `Th${numKey}` : key;
        };
        break;
      }
      default: {
        // Fallback: use keys from API if available, otherwise empty
        allKeys = Array.from(
          new Set([...Object.keys(earningGraph), ...Object.keys(profitGraph)])
        ).sort((a, b) => {
          const numA = parseInt(a);
          const numB = parseInt(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        });
        labelFormatter = (key) => key;
      }
    }

    // Map all keys to chart data, using API data if available, otherwise 0
    return allKeys.map((key) => ({
      month: labelFormatter(key),
      revenue: getValue(earningGraph, key),
      commission: getValue(profitGraph, key),
    }));
  }, [
    viewMode,
    selectedYear,
    selectedMonth,
    selectedWeek,
    transactionStatisticData,
    currentTimeRange,
  ]);

  // Filter user stats based on timeRange and API data
  const filteredUserStats = useMemo(() => {
    const stats = [
      {
        label: "Tổng người dùng",
        value:
          (userStatisticData?.totalInspectorCount ?? 0) +
          (userStatisticData?.totalInstructorCount ?? 0) +
          (userStatisticData?.totalDriverCount ?? 0),
      },
      {
        label: "Người kiểm duyệt",
        value: userStatisticData?.totalInspectorCount ?? 0,
      },
      {
        label: "Người hướng dẫn",
        value: userStatisticData?.totalInstructorCount ?? 0,
      },
      {
        label: "Người lái mới",
        value: userStatisticData?.totalDriverCount ?? 0,
      },
    ];

    return stats;
  }, [userStatisticData, currentTimeRange]);

  // Filter financial stats based on API data
  const filteredFinancialStats = useMemo(() => {
    const stats = [
      {
        label: "Tổng doanh thu",
        value: transactionStatisticData?.earning ?? 0,
      },
      {
        label: "Tổng chi trả người hướng dẫn",
        value: transactionStatisticData?.instructors_payment ?? 0,
      },
      {
        label: "Tổng hoa hồng của hệ thống",
        value: transactionStatisticData?.profit ?? 0,
      },
      {
        label: "Tổng tiền tạm giữ",
        value: transactionStatisticData?.holding ?? 0,
      },
    ];

    return stats.map((stat) => {
      const formattedValue = stat.value.toLocaleString("vi-VN") + " VNĐ";
      return {
        ...stat,
        value: formattedValue,
      };
    });
  }, [transactionStatisticData]);

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

  // Pagination logic for transaction history
  const totalPages = useMemo(
    () => Math.ceil(transactionHistoryData.length / itemsPerPage),
    [itemsPerPage]
  );
  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );
  const endIndex = useMemo(
    () => startIndex + itemsPerPage,
    [startIndex, itemsPerPage]
  );
  const paginatedTransactions = useMemo(
    () => transactionHistoryData.slice(startIndex, endIndex),
    [startIndex, endIndex]
  );
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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

  // Fetch user statistic data when filters change
  useEffect(() => {
    const fetchUserStatisticData = async () => {
      let params: {
        type: number;
        year?: number;
        month?: number;
        week?: number;
      } = {
        type: 0,
      };

      // Map viewMode to type: week = 0, month = 1, year = 2
      if (viewMode === "week") {
        params = {
          type: 0,
          year: selectedYear,
          month: selectedMonth,
          week: selectedWeek,
        };
      } else if (viewMode === "month") {
        params = {
          type: 1,
          year: selectedYear,
          month: selectedMonth,
        };
      } else if (viewMode === "year") {
        params = {
          type: 2,
          year: selectedYear,
        };
      }

      console.log("[Dashboard] Fetching user statistic with params:", params);
      console.log("[Dashboard] Current state:", {
        viewMode,
        selectedYear,
        selectedMonth,
        selectedWeek,
      });

      const data = await getUserStatisticData(params);
      console.log("[Dashboard] API response:", data);

      if (data) {
        console.log("[Dashboard] Setting user statistic data:", data);
        setUserStatisticData(data);
      } else {
        console.warn("[Dashboard] No data returned from API");
      }
    };

    fetchUserStatisticData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth, selectedWeek]);

  useEffect(() => {
    const fetchTransactionStatisticData = async () => {
      let params: {
        type: number;
        year?: number;
        month?: number;
        week?: number;
      } = {
        type: 0,
      };

      if (viewMode === "week") {
        params = {
          type: 0,
          year: selectedYear,
          month: selectedMonth,
          week: selectedWeek,
        };
      } else if (viewMode === "month") {
        params = {
          type: 1,
          year: selectedYear,
          month: selectedMonth,
        };
      } else if (viewMode === "year") {
        params = {
          type: 2,
          year: selectedYear,
        };
      }

      console.log(
        "[Dashboard] Fetching transaction statistic with params:",
        params
      );
      console.log("[Dashboard] Current state:", {
        viewMode,
        selectedYear,
        selectedMonth,
        selectedWeek,
      });

      const data = await getTransactionStatisticData(params);
      console.log("[Dashboard] API response:", data);

      if (data) {
        console.log("[Dashboard] Setting transaction statistic data:", data);
        setTransactionStatisticData(data);
      } else {
        console.warn("[Dashboard] No data returned from API");
      }
    };

    fetchTransactionStatisticData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth, selectedWeek]);

  useEffect(() => {
    const fetchBookingStatisticData = async () => {
      let params: {
        type: number;
        year?: number;
        month?: number;
        week?: number;
      } = {
        type: 0,
      };

      if (viewMode === "week") {
        params = {
          type: 0,
          year: selectedYear,
          month: selectedMonth,
          week: selectedWeek,
        };
      } else if (viewMode === "month") {
        params = {
          type: 1,
          year: selectedYear,
          month: selectedMonth,
        };
      } else if (viewMode === "year") {
        params = {
          type: 2,
          year: selectedYear,
        };
      }

      console.log(
        "[Dashboard] Fetching booking statistic with params:",
        params
      );
      console.log("[Dashboard] Current state:", {
        viewMode,
        selectedYear,
        selectedMonth,
        selectedWeek,
      });

      const data = await getBookingStatisticData(params);
      console.log("[Dashboard] API response:", data);

      if (data) {
        console.log("[Dashboard] Setting booking statistic data:", data);
        setBookingStatisticData(data);
      } else {
        console.warn("[Dashboard] No data returned from API");
      }
    };

    fetchBookingStatisticData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth, selectedWeek]);

  // Generate booking time data from API
  const bookingTimeData = useMemo(() => {
    const bookingCountByDay = bookingStatisticData?.booking_count_by_day ?? {};

    // Helper function to get value from graph, default to 0 if not found
    const getValue = (graph: { [key: string]: number }, key: string): number => {
      const value = graph[key];
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "number" &&
        !isNaN(value)
      ) {
        return value;
      }
      return 0;
    };

    // Generate all keys based on currentTimeRange
    let allKeys: string[] = [];
    let labelFormatter: (key: string) => string = (key) => key;

    switch (currentTimeRange) {
      case "week": {
        // Show 7 days of the week (keys: "1", "2", ..., "7")
        allKeys = Array.from({ length: 7 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `T${numKey + 1}` : key;
        };
        break;
      }
      case "month": {
        // Show all days in selected month (keys: "1", "2", ..., "31")
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        allKeys = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        labelFormatter = (key) => key; // Just show the day number
        break;
      }
      case "year": {
        // Show 12 months (keys: "1", "2", ..., "12")
        allKeys = Array.from({ length: 12 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `Th${numKey}` : key;
        };
        break;
      }
      default: {
        // Fallback: use keys from API if available, otherwise empty
        allKeys = Object.keys(bookingCountByDay).sort((a, b) => {
          const numA = parseInt(a);
          const numB = parseInt(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        });
        labelFormatter = (key) => key;
      }
    }

    // Map all keys to chart data, using API data if available, otherwise 0
    return allKeys.map((key) => ({
      month: labelFormatter(key),
      bookingCount: getValue(bookingCountByDay, key),
    }));
  }, [
    bookingStatisticData,
    currentTimeRange,
    selectedYear,
    selectedMonth,
    selectedWeek,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8">
        <PageHeader
          title="Tổng Quan Hệ Thống"
          description="Theo dõi và quản lý toàn bộ hoạt động của hệ thống."
        />
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
                  // When opening filter, sync temp states with current states
                  if (!isFilterOpen) {
                    setTempViewMode(viewMode);
                    setTempSelectedYear(selectedYear);
                    setTempSelectedMonth(selectedMonth);
                    setTempSelectedWeek(selectedWeek);
                  }
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
                            variant={
                              tempViewMode === mode ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              setTempViewMode(mode);
                              // Reset month/week when changing view mode
                              if (mode === "year") {
                                // No need to reset for year mode
                              } else if (mode === "month") {
                                // Reset week when switching to month mode
                                const availableMonths =
                                  getAvailableMonths(tempSelectedYear);
                                const latestMonth =
                                  availableMonths[availableMonths.length - 1] ||
                                  1;
                                setTempSelectedMonth(latestMonth);
                              } else if (mode === "week") {
                                // Reset week when switching to week mode
                                const availableMonths =
                                  getAvailableMonths(tempSelectedYear);
                                const latestMonth =
                                  availableMonths[availableMonths.length - 1] ||
                                  1;
                                setTempSelectedMonth(latestMonth);
                                const availableWeeks = getAvailableWeeks(
                                  tempSelectedYear,
                                  latestMonth
                                );
                                const latestWeek =
                                  availableWeeks[availableWeeks.length - 1] ||
                                  1;
                                setTempSelectedWeek(latestWeek);
                              }
                            }}
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
                          value={tempSelectedYear}
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            setTempSelectedYear(newYear);

                            // Reset month to latest available month for the selected year
                            if (tempViewMode !== "year") {
                              const availableMonths =
                                getAvailableMonths(newYear);
                              const latestMonth =
                                availableMonths[availableMonths.length - 1] ||
                                1;
                              setTempSelectedMonth(latestMonth);

                              // Reset week to latest available week for the selected month
                              if (tempViewMode === "week") {
                                const availableWeeks = getAvailableWeeks(
                                  newYear,
                                  latestMonth
                                );
                                const latestWeek =
                                  availableWeeks[availableWeeks.length - 1] ||
                                  1;
                                setTempSelectedWeek(latestWeek);
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
                      {(tempViewMode === "month" ||
                        tempViewMode === "week") && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Tháng:
                          </label>
                          <select
                            value={tempSelectedMonth}
                            onChange={(e) => {
                              const newMonth = Number(e.target.value);
                              setTempSelectedMonth(newMonth);

                              // Reset week to latest available week for the selected month
                              if (tempViewMode === "week") {
                                const availableWeeks = getAvailableWeeks(
                                  tempSelectedYear,
                                  newMonth
                                );
                                const latestWeek =
                                  availableWeeks[availableWeeks.length - 1] ||
                                  1;
                                setTempSelectedWeek(latestWeek);
                              }
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableMonths(tempSelectedYear).map(
                              (month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}

                      {/* Week Selector - Show only if viewMode is week */}
                      {tempViewMode === "week" && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">
                            Tuần:
                          </label>
                          <select
                            value={tempSelectedWeek}
                            onChange={(e) =>
                              setTempSelectedWeek(Number(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                          >
                            {getAvailableWeeks(
                              tempSelectedYear,
                              tempSelectedMonth
                            ).map((week) => (
                              <option key={week} value={week}>
                                {week}
                              </option>
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
                        onClick={() => {
                          // Reset temp states to current states when closing
                          setTempViewMode(viewMode);
                          setTempSelectedYear(selectedYear);
                          setTempSelectedMonth(selectedMonth);
                          setTempSelectedWeek(selectedWeek);
                          setIsFilterOpen(false);
                        }}
                        className="flex-1"
                      >
                        Đóng
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          // Apply temp states to actual states
                          setViewMode(tempViewMode);
                          setSelectedYear(tempSelectedYear);
                          setSelectedMonth(tempSelectedMonth);
                          setSelectedWeek(tempSelectedWeek);
                          setIsFilterOpen(false);
                          // API will be called automatically via useEffect when states change
                        }}
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

        <main className="px-8">
          <section className="mb-8">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Người Dùng</CardTitle>
                    <CardDescription>
                      Tổng quan về số lượng người dùng trong hệ thống
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getUserStatisticLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {filteredUserStats.map((stat, index) => {
                      const icons = [Users, UserCheck, UserCog, UserPlus];
                      const accents = [
                        "bg-blue-50 text-blue-600",
                        "bg-purple-50 text-purple-600",
                        "bg-sky-50 text-sky-600",
                        "bg-emerald-50 text-emerald-600",
                      ];
                      const Icon = icons[index % icons.length];
                      const accent = accents[index % accents.length];
                      return (
                        <Card key={stat.label} className="bg-card">
                          <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardDescription className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                              </CardDescription>
                              <CardTitle className="text-2xl font-semibold">
                                {stat.value}
                              </CardTitle>
                            </div>
                            <span className={`rounded-xl p-3 ${accent}`}>
                              <Icon className="size-5" />
                            </span>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Tài Chính</CardTitle>
                    <CardDescription>
                      Tổng quan về doanh thu và chi phí của hệ thống
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getTransactionStatisticLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {filteredFinancialStats.map((stat, index) => {
                      const icons = [TrendingUp, DollarSign, Wallet, CreditCard];
                      const accents = [
                        "bg-emerald-50 text-emerald-600",
                        "bg-blue-50 text-blue-600",
                        "bg-amber-50 text-amber-600",
                        "bg-rose-50 text-rose-600",
                      ];
                      const Icon = icons[index % icons.length];
                      const accent = accents[index % accents.length];
                      return (
                        <Card
                          key={stat.label}
                          className="flex h-full flex-col bg-card"
                        >
                          <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-1">
                              <CardDescription className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                              </CardDescription>
                              <CardTitle className="text-2xl font-semibold">
                                {stat.value}
                              </CardTitle>
                            </div>
                            <span className={`rounded-xl p-3 ${accent}`}>
                              <Icon className="size-5" />
                            </span>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Dòng Tiền & Doanh Thu - Full Width */}
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Dòng Tiền & Doanh Thu</CardTitle>
                  <CardDescription>{getTimeRangeDescription()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {getTransactionStatisticLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Đang tải dữ liệu...
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <div
                    style={{
                      minWidth: Math.max(600, filteredRevenueData.length * 60),
                    }}
                  >
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={filteredRevenueData}>
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorCommission"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
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
                          formatter={(value: number | string, name: string) => {
                            const numValue =
                              typeof value === "number"
                                ? value
                                : typeof value === "string"
                                ? parseFloat(value)
                                : 0;
                            return [
                              `${numValue.toLocaleString("vi-VN")} VNĐ`,
                              name,
                            ];
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
                            r: 4,
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
                            r: 4,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3 Cards Row */}
          {/* <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Tình Trạng Hoạt Động Buổi Huấn Luyện</CardTitle>
                    <CardDescription>Tỷ lệ buổi huấn luyện</CardDescription>
                  </div>
                </div>
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Trạng Thái Buổi Huấn Luyện</CardTitle>
                    <CardDescription>
                      Tình trạng các buổi huấn luyện
                    </CardDescription>
                  </div>
                </div>
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
                      formatter={(value, name) => [`${value} buổi`, name]}
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
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>
                      Thống Kê Hủy & Hoàn Lại Buổi Huấn Luyện
                    </CardTitle>
                    <CardDescription>
                      Phân tích hủy lịch và hoàn thời gian huấn luyện
                    </CardDescription>
                  </div>
                </div>
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
                      formatter={(value, name) => [`${value} trường hợp`, name]}
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
          </div> */}

          {/* 2 Charts Row */}
          {/* <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Đặt Lịch Buổi Huấn Luyện </CardTitle>
                    <CardDescription>
                      Số lượng đặt lịch buổi huấn luyện theo tháng
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getBookingStatisticLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={bookingTimeData}>
                      <defs>
                        <linearGradient
                          id="colorBooking"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
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
                        formatter={(value) => [
                          `${value} booking`,
                          "Số lượng đặt lịch",
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="bookingCount"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorBooking)"
                        strokeWidth={3}
                        name="Số lượng đặt lịch"
                        dot={{
                          fill: "#3b82f6",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                          stroke: "#3b82f6",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thực Thi Buổi Huấn Luyện</CardTitle>
                    <CardDescription>
                      Thời gian thực tế thực hiện buổi huấn luyện theo ngày
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sessionExecutionData}>
                      <defs>
                        <linearGradient
                          id="colorExecution"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.1}
                          />
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
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value) => [
                          `${value} giờ`,
                          "Thời gian trung bình",
                        ]}
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
                          r: 4,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Gói Dịch Vụ Hàng Đầu</CardTitle>
                    <CardDescription>Được mua nhiều nhất</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTopPackages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {pkg.name}
                        </p>
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
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Người Hướng Dẫn Hàng Đầu</CardTitle>
                    <CardDescription>Đánh giá cao nhất</CardDescription>
                  </div>
                </div>
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
                          {instructor.sessions} buổi huấn luyện
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
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Xe Hàng Đầu</CardTitle>
                    <CardDescription>Được thuê nhiều nhất</CardDescription>
                  </div>
                </div>
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
          </div> */}

          {/* Lịch Sử Giao Dịch Hệ Thống */}
          {/* <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Lịch Sử Giao Dịch Hệ Thống</CardTitle>
                    <CardDescription>
                      Các giao dịch gần đây trong hệ thống
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
                        <TableHead>Mã giao dịch</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Người lái mới</TableHead>
                        <TableHead>Người huấn luyện</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead className="text-right">Hoa hồng</TableHead>
                        <TableHead className="text-center">
                          Trạng thái
                        </TableHead>
                        <TableHead className="text-center">
                          Phương thức
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            className="py-8 text-center text-sm text-muted-foreground"
                          >
                            Không tìm thấy giao dịch nào.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedTransactions.map((transaction, index) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-muted/30"
                          >
                            <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {transaction.id}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {transaction.date}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.type === "Thanh toán gói"
                                    ? "bg-blue-100 text-blue-800"
                                    : transaction.type === "Hoàn tiền"
                                    ? "bg-red-100 text-red-800"
                                    : transaction.type === "Đền bù hủy muộn"
                                    ? "bg-orange-100 text-orange-800"
                                    : transaction.type === "Thanh toán session"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.type === "Rút tiền"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {transaction.novice}
                            </TableCell>
                            <TableCell className="text-sm">
                              {transaction.instructor}
                            </TableCell>
                            <TableCell
                              className={`text-sm text-right font-medium ${
                                transaction.amount >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.amount >= 0 ? "+" : ""}
                              {transaction.amount.toLocaleString("vi-VN")} VNĐ
                            </TableCell>
                            <TableCell
                              className={`text-sm text-right font-medium ${
                                transaction.commission >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.commission >= 0 ? "+" : ""}
                              {transaction.commission.toLocaleString(
                                "vi-VN"
                              )}{" "}
                              VNĐ
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.status === "Hoàn thành"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "Đã hoàn"
                                    ? "bg-blue-100 text-blue-800"
                                    : transaction.status === "Đang xử lý"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-center text-muted-foreground">
                              {transaction.method}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    Hiển thị {paginatedTransactions.length}/
                    {transactionHistoryData.length} giao dịch.
                  </div>
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Số hàng
                      </span>
                      <Select
                        value={`${itemsPerPage}`}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8 w-20 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[5, 10, 20, 30, 50].map((size) => (
                            <SelectItem key={size} value={`${size}`}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex"
                        onClick={goToFirstPage}
                        disabled={!canGoPrevious}
                      >
                        <ChevronsLeft className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPreviousPage}
                        disabled={!canGoPrevious}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Trang {currentPage}/{totalPages || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNextPage}
                        disabled={!canGoNext}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hidden sm:flex"
                        onClick={goToLastPage}
                        disabled={!canGoNext}
                      >
                        <ChevronsRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section> */}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}
