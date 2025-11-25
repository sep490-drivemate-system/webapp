"use client";

import { useMemo, useState } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
        phone: "090xxxxxxx",
        package: "Gói Đường Cao Tốc",
        sessions: 3,
        completed: 2,
        rescheduled: 1,
        cancelled: 0,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "091xxxxxxx",
        package: "Gói Miền Tây",
        sessions: 2,
        completed: 2,
        rescheduled: 0,
        cancelled: 0,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "092xxxxxxx",
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
        phone: "090xxxxxxx",
        package: "Gói Đường Cao Tốc",
        sessions: 8,
        completed: 6,
        rescheduled: 1,
        cancelled: 1,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "091xxxxxxx",
        package: "Gói Miền Tây",
        sessions: 5,
        completed: 5,
        rescheduled: 0,
        cancelled: 0,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "092xxxxxxx",
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
        phone: "090xxxxxxx",
        package: "Gói Đường Cao Tốc",
        sessions: 40,
        completed: 34,
        rescheduled: 3,
        cancelled: 3,
      },
      {
        id: 2,
        name: "Lê Thị B",
        phone: "091xxxxxxx",
        package: "Gói Miền Tây",
        sessions: 26,
        completed: 25,
        rescheduled: 0,
        cancelled: 1,
      },
      {
        id: 3,
        name: "Phạm C",
        phone: "092xxxxxxx",
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

const commissionRate = 0.15;

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

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
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const currentData = overviewDataByRange[timeRange];
  const packageData = currentData.packageData;
  const students = currentData.students;
  const grossRevenue = currentData.grossRevenue;
  const commission = Math.round(grossRevenue * commissionRate);
  const netRevenue = grossRevenue - commission;

  const totalPackages = packageData.length;
  const totalSessions = students.reduce(
    (sum, student) => sum + student.sessions,
    0
  );
  const totalCancelled = students.reduce(
    (sum, student) => sum + student.cancelled,
    0
  );
  const totalRescheduled = students.reduce(
    (sum, student) => sum + student.rescheduled,
    0
  );

  const kpis: KpiCard[] = [
    {
      title: "Tổng số gói dịch vụ",
      value: `${totalPackages}`,
      sub: "Đang hoạt động",
      icon: Box,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tổng số buổi tập lái",
      value: `${totalSessions}`,
      sub: `${totalCancelled} hủy · ${totalRescheduled} dời (${currentData.label})`,
      icon: Navigation,
      accent: "bg-sky-50 text-sky-600",
    },
    {
      title: "Doanh thu ròng",
      value: `${(netRevenue / 1_000_000).toLocaleString("vi-VN")} triệu`,
      sub: `Hoa hồng ${commissionRate * 100}%`,
      icon: TrendingUp,
      accent: "bg-emerald-50 text-emerald-600",
    },
  ];

  const pieData = useMemo(
    () =>
      packageData.map((pkg, idx) => ({
        name: pkg.name,
        value: pkg.buyers,
        fill: chartColors[idx % chartColors.length],
      })),
    [packageData]
  );

  const sessionsData = useMemo(
    () => getSessionsByRange(timeRange),
    [timeRange]
  );

  const sessionTotals = useMemo(() => {
    return sessionsData.reduce(
      (totals, session) => ({
        completed: totals.completed + session.completed,
        rescheduled: totals.rescheduled + session.rescheduled,
        cancelled: totals.cancelled + session.cancelled,
      }),
      { completed: 0, rescheduled: 0, cancelled: 0 }
    );
  }, [sessionsData]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Tổng quan hoạt động
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                Quản lý doanh thu, khách hàng và gói dịch vụ
              </h1>
              <p className="text-sm text-muted-foreground">
                Theo dõi hiệu suất buổi tập lái, doanh thu và danh sách khách
                hàng theo {currentData.label}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Đang xem theo:{" "}
                <span className="font-medium text-foreground">
                  {timeRange === "week"
                    ? "Tuần hiện tại"
                    : timeRange === "month"
                    ? "Tháng hiện tại"
                    : "Năm hiện tại"}
                </span>
              </span>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Bộ lọc</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                {isFilterOpen && (
                  <>
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border bg-white p-3 shadow-lg">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Chọn khoảng thời gian
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant={timeRange === "week" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setTimeRange("week");
                            setIsFilterOpen(false);
                          }}
                        >
                          Tuần hiện tại
                        </Button>
                        <Button
                          variant={
                            timeRange === "month" ? "default" : "outline"
                          }
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setTimeRange("month");
                            setIsFilterOpen(false);
                          }}
                        >
                          Tháng hiện tại
                        </Button>
                        <Button
                          variant={timeRange === "year" ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setTimeRange("year");
                            setIsFilterOpen(false);
                          }}
                        >
                          Năm hiện tại
                        </Button>
                      </div>
                    </div>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsFilterOpen(false)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              <div>
                <CardTitle>
                  Gói dịch vụ được ưa chuộng theo {currentData.label}
                </CardTitle>
                <CardDescription>
                  Top gói theo số lượng học viên đăng ký trong{" "}
                  {currentData.label}
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
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} học viên`}
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
                          {pkg.buyers} khách hàng · {pkg.sessions} buổi
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

      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <div>
                <CardTitle>Buổi tập lái theo {currentData.label}</CardTitle>
                <CardDescription>
                  Số liệu hoàn thành, dời lịch và hủy theo{" "}
                  {timeRange === "year"
                    ? "12 tháng trong năm hiện tại"
                    : currentData.label}
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

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo {currentData.label}</CardTitle>
            <CardDescription>
              Thực nhận sau khi trừ hoa hồng hệ thống trong {currentData.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(grossRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-rose-50 p-4">
              <p className="text-sm text-rose-600">
                Hoa hồng ({commissionRate * 100}%)
              </p>
              <p className="text-2xl font-semibold text-rose-600">
                {formatCurrency(commission)}
              </p>
            </div>
            <div className="rounded-xl border bg-emerald-50 p-4">
              <p className="text-sm text-emerald-600">Doanh thu ròng</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {formatCurrency(netRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Danh sách khách hàng theo {currentData.label}
          </h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi tiến độ từng học viên để tối ưu lịch tập lái theo{" "}
            {currentData.label}.
          </p>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Gói dịch vụ</TableHead>
                  <TableHead className="text-center">Buổi tập lái</TableHead>
                  <TableHead className="text-center">Hoàn thành</TableHead>
                  <TableHead className="text-center">Đã dời</TableHead>
                  <TableHead className="text-center">Đã hủy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {student.name
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.phone}
                          </p>
                        </div>
                      </div>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
