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
  Navigation,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const chartColors = ["#2563eb", "#0ea5e9", "#f97316", "#10b981", "#f43f5e"];

const packageData = [
  { name: "Gói Đường Ban Đêm (40h)", hours: 40, buyers: 24, sessions: 72 },
  { name: "Gói Đường Cao Tốc (10h)", hours: 10, buyers: 18, sessions: 65 },
  { name: "Gói Miền Tây (7h)", hours: 7, buyers: 12, sessions: 36 },
  { name: "Gói Sơ Cấp (20h)", hours: 20, buyers: 30, sessions: 90 },
];

const sessionTemplate = [
  { completed: 8, cancelled: 1, rescheduled: 2 },
  { completed: 12, cancelled: 0, rescheduled: 1 },
  { completed: 10, cancelled: 2, rescheduled: 3 },
  { completed: 14, cancelled: 1, rescheduled: 0 },
  { completed: 20, cancelled: 3, rescheduled: 2 },
  { completed: 16, cancelled: 1, rescheduled: 1 },
  { completed: 18, cancelled: 2, rescheduled: 2 },
];

const students = [
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
];

const grossRevenue = 12_000_000;
const commissionRate = 0.15;
const commission = Math.round(grossRevenue * commissionRate);
const netRevenue = grossRevenue - commission;

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

type KpiCard = {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent: string;
};

export default function InstructorOverviewPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

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
      sub: `${totalCancelled} hủy · ${totalRescheduled} dời`,
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
    []
  );

  const weeklySessions = useMemo(() => getCurrentWeekSessions(), []);

  const sessionTotals = useMemo(() => {
    return weeklySessions.reduce(
      (totals, session) => ({
        completed: totals.completed + session.completed,
        rescheduled: totals.rescheduled + session.rescheduled,
        cancelled: totals.cancelled + session.cancelled,
      }),
      { completed: 0, rescheduled: 0, cancelled: 0 }
    );
  }, [weeklySessions]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tổng quan hoạt động
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Quản lý doanh thu, khách hàng và gói dịch vụ
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi hiệu suất buổi tập lái, doanh thu và danh sách khách hàng
              theo thời gian thực.
            </p>
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
                <CardTitle>Gói dịch vụ được ưa chuộng</CardTitle>
                <CardDescription>
                  Top gói theo số lượng học viên đăng ký
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
                <CardTitle>Buổi tập lái theo tuần</CardTitle>
                <CardDescription>
                  Số liệu hoàn thành, dời lịch và hủy trong tuần hiện tại
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySessions}>
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
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>
              Thực nhận sau khi trừ hoa hồng hệ thống
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
            Danh sách khách hàng
          </h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi tiến độ từng học viên để tối ưu lịch tập lái.
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
