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
import { useStatistic } from "@/hooks/admin/useStatistic";
import {
  IBookingStatistic,
  ITransactionStatistic,
  IUserStatistic,
} from "@/types/statistic/statistic.type";
import {
  Calendar,
  ChevronDown,
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

const sessionStatusMapping: {
  [key: string]: { label: string; color: string };
} = {
  Planning: { label: "Đã đặt chờ", color: "#f59e0b" },
  InProgress: { label: "Đang diễn ra", color: "#3b82f6" },
  Completed: { label: "Hoàn thành", color: "#10b981" },
  Cancelled: { label: "Bị hủy", color: "#ef4444" },
  Upcoming: { label: "Sắp diễn ra", color: "#8b5cf6" },
};

const bookingStatusMapping: {
  [key: string]: { label: string; color: string };
} = {
  Purchased: { label: "Gói đã thanh toán", color: "#10b981" },
  CancellationWithoutRefund: { label: "Hủy không hoàn tiền", color: "#ef4444" },
  CancellationWithRefund: { label: "Hủy có hoàn tiền", color: "#f59e0b" },
  InUse: { label: "Đang sử dụng", color: "#3b82f6" },
  Used: { label: "Hoàn thành", color: "#8b5cf6" },
};

function AdminDashboard() {
  const [viewMode, setViewMode] = useState<"year" | "month" | "week">("month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const getCurrentWeekOfMonth = (year: number, month: number, day?: number) => {
    const targetDate = day ? new Date(year, month - 1, day) : new Date();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay();
    const currentDay = targetDate.getDate();

    return Math.ceil((currentDay + firstWeekday) / 7);
  };

  const [selectedWeek, setSelectedWeek] = useState(
    getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );

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

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const getAvailableMonths = (year: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year === currentYear) {
      return Array.from({ length: currentMonth }, (_, i) => i + 1);
    } else if (year < currentYear) {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    } else {
      return [];
    }
  };

  const getAvailableWeeks = (year: number, month: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstWeekday = firstDayOfMonth.getDay();

    const totalWeeks = Math.ceil((lastDayOfMonth + firstWeekday) / 7);

    if (year === currentYear && month === currentMonth) {
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
      return Array.from({ length: totalWeeks }, (_, i) => i + 1);
    } else {
      return [];
    }
  };

  const currentTimeRange = viewMode;

  const filteredRevenueData = useMemo(() => {
    const earningGraph = transactionStatisticData?.earning_graph ?? {};
    const profitGraph = transactionStatisticData?.profit_graph ?? {};

    const getValue = (
      graph: { [key: string]: number },
      key: string
    ): number => {
      if (graph[key] !== undefined && graph[key] !== null) {
        return graph[key];
      }

      const numKey = parseInt(key);
      if (
        !isNaN(numKey) &&
        graph[numKey as unknown as string] !== undefined &&
        graph[numKey as unknown as string] !== null
      ) {
        return graph[numKey as unknown as string];
      }

      const paddedKey = key.padStart(2, "0");
      if (graph[paddedKey] !== undefined && graph[paddedKey] !== null) {
        return graph[paddedKey];
      }

      return 0;
    };

    let allKeys: string[] = [];
    let labelFormatter: (key: string) => string = (key) => key;

    switch (currentTimeRange) {
      case "week": {
        allKeys = Array.from({ length: 7 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          if (numKey === 7) return "CN";
          return !isNaN(numKey) ? `T${numKey + 1}` : key;
        };
        break;
      }
      case "month": {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        allKeys = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        labelFormatter = (key) => key;
        break;
      }
      case "year": {
        allKeys = Array.from({ length: 12 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `Th${numKey}` : key;
        };
        break;
      }
      default: {
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

    return allKeys.map((key) => ({
      month: labelFormatter(key),
      revenue: getValue(earningGraph, key),
      commission: getValue(profitGraph, key),
    }));
  }, [selectedYear, selectedMonth, transactionStatisticData, currentTimeRange]);

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
  }, [userStatisticData]);

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

  const filteredActivityData = useMemo(() => {
    const bookingByStatusCount =
      bookingStatisticData?.booking_by_status_count ?? {};
    const statusOrder = [
      "Purchased",
      "InUse",
      "Used",
      "CancellationWithRefund",
      "CancellationWithoutRefund",
    ];

    return statusOrder
      .map((status) => {
        const count = bookingByStatusCount[status] ?? 0;
        const mapping = bookingStatusMapping[status];
        if (!mapping || count === 0) return null;
        return {
          name: mapping.label,
          value: count,
          color: mapping.color,
        };
      })
      .filter(
        (item): item is { name: string; value: number; color: string } =>
          item !== null
      );
  }, [bookingStatisticData]);

  const filteredTopPackages = useMemo(() => {
    const topPackagesData = bookingStatisticData?.top_packages ?? [];
    return topPackagesData.map((pkg) => ({
      name: pkg.package_name,
      purchases: pkg.book_count,
      rating: pkg.average_rating,
    }));
  }, [bookingStatisticData]);

  const filteredTopVehicles = useMemo(() => {
    const topCarsData = bookingStatisticData?.top_car ?? [];
    return topCarsData.map((car) => ({
      model: car.car,
      rentals: car.book_count,
      rating: car.average_rating,
    }));
  }, [bookingStatisticData]);

  const sessionStatusData = useMemo(() => {
    const sessionByStatusCount =
      bookingStatisticData?.session_by_status_count ?? {};
    const statusOrder = [
      "Planning",
      "InProgress",
      "Completed",
      "Cancelled",
      "Upcoming",
    ];

    return statusOrder
      .map((status) => {
        const count = sessionByStatusCount[status] ?? 0;
        const mapping = sessionStatusMapping[status];
        if (!mapping || count === 0) return null;
        return {
          name: mapping.label,
          value: count,
          color: mapping.color,
        };
      })
      .filter(
        (item): item is { name: string; value: number; color: string } =>
          item !== null
      );
  }, [bookingStatisticData]);

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

      const data = await getUserStatisticData(params);
      if (data) {
        setUserStatisticData(data);
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

      const data = await getTransactionStatisticData(params);
      if (data) {
        setTransactionStatisticData(data);
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

      const data = await getBookingStatisticData(params);
      if (data) {
        setBookingStatisticData(data);
      }
    };

    fetchBookingStatisticData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, selectedYear, selectedMonth, selectedWeek]);

  const bookingTimeData = useMemo(() => {
    const bookingCountByDay = bookingStatisticData?.booking_count_by_day ?? {};

    const getValue = (
      graph: { [key: string]: number },
      key: string
    ): number => {
      if (graph[key] !== undefined && graph[key] !== null) {
        return graph[key];
      }

      const numKey = parseInt(key);
      if (
        !isNaN(numKey) &&
        graph[numKey as unknown as string] !== undefined &&
        graph[numKey as unknown as string] !== null
      ) {
        return graph[numKey as unknown as string];
      }

      const paddedKey = key.padStart(2, "0");
      if (graph[paddedKey] !== undefined && graph[paddedKey] !== null) {
        return graph[paddedKey];
      }

      return 0;
    };

    let allKeys: string[] = [];
    let labelFormatter: (key: string) => string = (key) => key;

    switch (currentTimeRange) {
      case "week": {
        allKeys = Array.from({ length: 7 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          if (numKey === 7) return "CN";
          return !isNaN(numKey) ? `T${numKey + 1}` : key;
        };
        break;
      }
      case "month": {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        allKeys = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        labelFormatter = (key) => key;
        break;
      }
      case "year": {
        allKeys = Array.from({ length: 12 }, (_, i) => String(i + 1));
        labelFormatter = (key) => {
          const numKey = parseInt(key);
          return !isNaN(numKey) ? `Th${numKey}` : key;
        };
        break;
      }
      default: {
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

    return allKeys.map((key) => ({
      month: labelFormatter(key),
      bookingCount: getValue(bookingCountByDay, key),
    }));
  }, [bookingStatisticData, currentTimeRange, selectedYear, selectedMonth]);

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
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

              {isFilterOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4"
                  style={{ backgroundColor: "white", border: "1px solid #ccc" }}
                >
                  <div className="space-y-4">
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
                              if (mode === "year") {
                              } else if (mode === "month") {
                                const availableMonths =
                                  getAvailableMonths(tempSelectedYear);
                                const latestMonth =
                                  availableMonths[availableMonths.length - 1] ||
                                  1;
                                setTempSelectedMonth(latestMonth);
                              } else if (mode === "week") {
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

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Năm:
                        </label>
                        <select
                          value={tempSelectedYear}
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            setTempSelectedYear(newYear);

                            if (tempViewMode !== "year") {
                              const availableMonths =
                                getAvailableMonths(newYear);
                              const latestMonth =
                                availableMonths[availableMonths.length - 1] ||
                                1;
                              setTempSelectedMonth(latestMonth);

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

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
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
                          setViewMode(tempViewMode);
                          setSelectedYear(tempSelectedYear);
                          setSelectedMonth(tempSelectedMonth);
                          setSelectedWeek(tempSelectedWeek);
                          setIsFilterOpen(false);
                        }}
                        className="flex-1"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
                      const icons = [
                        TrendingUp,
                        DollarSign,
                        Wallet,
                        CreditCard,
                      ];
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
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          width={80}
                          tickFormatter={(value: number) => {
                            if (value >= 1000000000) {
                              return `${(value / 1000000000).toFixed(1)}T`;
                            } else if (value >= 1000000) {
                              return `${(value / 1000000).toFixed(1)}M`;
                            } else if (value >= 1000) {
                              return `${(value / 1000).toFixed(1)}K`;
                            }
                            return value.toString();
                          }}
                        />
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
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Tình Trạng Hoạt Động gói huấn luyện</CardTitle>
                    <CardDescription>Tỷ lệ gói huấn luyện</CardDescription>
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
                ) : filteredActivityData.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Không có dữ liệu
                    </p>
                  </div>
                ) : (
                  <>
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
                          formatter={(value) => [`${value} gói`, ""]}
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
                            {item.value} gói
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Thống Kê Trạng Thái gói huấn luyện</CardTitle>
                    <CardDescription>
                      Tình trạng các gói huấn luyện
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
                ) : sessionStatusData.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Không có dữ liệu
                    </p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card mt-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Mua gói huấn luyện</CardTitle>
                  <CardDescription>
                    Số lượng mua gói huấn luyện {getTimeRangeDescription()}
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
                  <div
                    style={{
                      minWidth: Math.max(500, bookingTimeData.length * 40),
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart
                        data={bookingTimeData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
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
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                          cursor={{
                            stroke: "hsl(var(--primary))",
                            strokeWidth: 1,
                          }}
                          formatter={(value) => [
                            `${value} gói`,
                            "Số lượng mua gói",
                          ]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                        />
                        <Area
                          type="monotone"
                          dataKey="bookingCount"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorBooking)"
                          strokeWidth={3}
                          name="Số lượng mua gói"
                          dot={{
                            fill: "#3b82f6",
                            strokeWidth: 2,
                            stroke: "#ffffff",
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                            stroke: "#3b82f6",
                            strokeWidth: 2,
                            fill: "#ffffff",
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                {getBookingStatisticLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                ) : filteredTopPackages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Không có dữ liệu
                    </p>
                  </div>
                ) : (
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
                            <span style={{ color: "#DC0A21" }}>
                              {pkg.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {getBookingStatisticLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                ) : filteredTopVehicles.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Không có dữ liệu
                    </p>
                  </div>
                ) : (
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
                              {vehicle.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  // useRequireAuth([UserRole.Admin]);
  return <AdminDashboard />;
}
