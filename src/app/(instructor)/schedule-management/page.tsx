"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Route,
  Car,
  Clock,
  SquarePen,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingStatus, bookingStatusToText } from "@/types/booking";
import PageHeader from "@/components/commons/Header/header";

interface BookingItem {
  id: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: BookingStatus;
  route: string;
  vehicle: string;
}

const BOOKINGS_DATA: BookingItem[] = [
  {
    id: "BKG001",
    studentName: "Nguyễn Văn B",
    date: "2025-11-14",
    startTime: "07:00",
    endTime: "09:00",
    totalHours: 2,
    status: BookingStatus.RoutePlanning,
    route: "Quận 9 - Quận 1",
    vehicle: "KIA Carnival 2024",
  },
  {
    id: "BKG002",
    studentName: "Trần Thị C",
    date: "2025-11-14",
    startTime: "10:00",
    endTime: "12:30",
    totalHours: 2.5,
    status: BookingStatus.Pending,
    route: "Quận 2 - Quận 7",
    vehicle: "Xe khách hàng",
  },
  {
    id: "BKG003",
    studentName: "Lê Văn D",
    date: "2025-10-15",
    startTime: "08:00",
    endTime: "11:00",
    totalHours: 3,
    status: BookingStatus.Upcoming,
    route: "Tân Hòa, Quận 9 - Cống Quỳnh, Quận 1",
    vehicle: "KIA Carnival 2024",
  },
  {
    id: "BKG004",
    studentName: "Phạm Thị E",
    date: "2025-10-15",
    startTime: "13:30",
    endTime: "16:00",
    totalHours: 2.5,
    status: BookingStatus.Ongoing,
    route: "Quận 7 - Quận 1",
    vehicle: "Toyota Vios",
  },
  {
    id: "BKG005",
    studentName: "Võ Văn F",
    date: "2025-11-16",
    startTime: "17:00",
    endTime: "20:00",
    totalHours: 3,
    status: BookingStatus.Completed,
    route: "Quận 2 - Quận 3",
    vehicle: "Honda City",
  },
  {
    id: "BKG006",
    studentName: "Nguyễn Thị G",
    date: "2025-12-01",
    startTime: "08:30",
    endTime: "11:30",
    totalHours: 3,
    status: BookingStatus.Rescheduled,
    route: "Quận 4 - Quận 5",
    vehicle: "Mazda 3",
  },
  {
    id: "BKG007",
    studentName: "Hồ Văn H",
    date: "2025-10-16",
    startTime: "14:00",
    endTime: "17:30",
    totalHours: 3.5,
    status: BookingStatus.Ongoing,
    route: "Quận 1 - Quận 3",
    vehicle: "Hyundai Accent",
  },
  {
    id: "BKG008",
    studentName: "Đặng Thị I",
    date: "2025-11-17",
    startTime: "09:00",
    endTime: "12:00",
    totalHours: 3,
    status: BookingStatus.Upcoming,
    route: "Quận 4 - Quận 7",
    vehicle: "Xe khách hàng",
  },
  {
    id: "BKG009",
    studentName: "Lê Văn K",
    date: "2025-11-17",
    startTime: "13:00",
    endTime: "15:30",
    totalHours: 2.5,
    status: BookingStatus.Cancelled,
    route: "Quận 5 - Quận 8",
    vehicle: "Toyota Camry",
  },
  {
    id: "BKG010",
    studentName: "Phạm Thị L",
    date: "2025-11-18",
    startTime: "08:30",
    endTime: "11:30",
    totalHours: 3,
    status: BookingStatus.Upcoming,
    route: "Quận 10 - Quận 11",
    vehicle: "Honda Civic",
  },
  {
    id: "BKG011",
    studentName: "Võ Văn O",
    date: "2025-10-18",
    startTime: "13:30",
    endTime: "16:30",
    totalHours: 3,
    status: BookingStatus.Ongoing,
    route: "Quận 6 - Quận 9",
    vehicle: "Nissan Altima",
  },
  {
    id: "BKG012",
    studentName: "Bùi Thị P",
    date: "2025-12-18",
    startTime: "18:00",
    endTime: "20:00",
    totalHours: 2,
    status: BookingStatus.Completed,
    route: "Quận 12 - Thủ Đức",
    vehicle: "KIA Sorento",
  },
];

const BUSY_DATES = ["2025-11-30", "2025-11-31"];

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.RoutePlanning:
      return {
        bg: "bg-violet-50",
        border: "border-violet-200",
        badge: "bg-violet-100 text-violet-700",
        dot: "bg-violet-500",
      };
    case BookingStatus.Pending:
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
        dot: "bg-amber-500",
      };
    case BookingStatus.Upcoming:
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-700",
        dot: "bg-slate-500",
      };
    case BookingStatus.Ongoing:
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-700",
        dot: "bg-green-500",
      };
    case BookingStatus.Completed:
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
      };
    case BookingStatus.Rescheduled:
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        badge: "bg-orange-100 text-orange-700",
        dot: "bg-orange-500",
      };
    case BookingStatus.Cancelled:
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-500",
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-700",
        dot: "bg-slate-500",
      };
  }
};

const getStatusText = (status: BookingStatus) => bookingStatusToText(status);

const formatTimeRange = (booking: BookingItem) =>
  `${booking.startTime} - ${booking.endTime}`;

const formatTotalHours = (hours: number) =>
  Number.isInteger(hours) ? `${hours} giờ` : `${hours.toFixed(1)} giờ`;

function BookingCard({ booking }: { booking: BookingItem }) {
  const colors = getStatusColor(booking.status);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow cursor-pointer ${colors.border}`}
    >
      {/* Header */}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {booking.studentName}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-600">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-600" />
              <span className="text-sm font-semibold">
                {formatTimeRange(booking)}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors.badge}`}
        >
          {getStatusText(booking.status)}
        </span>
      </div>

      {/* Details */}

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <Route size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-600">{booking.route}</span>
        </div>

        <div className="flex items-start gap-3">
          <Car size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-600">{booking.vehicle}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-sm text-slate-500">Tổng thời gian</span>
        <span className="font-semibold text-slate-900">
          {formatTotalHours(booking.totalHours)}
        </span>
      </div>
    </div>
  );
}

function ScheduleCalendar({
  currentDate,

  selectedDate,

  onCurrentDateChange,

  onSelectedDateChange,

  bookings,
}: {
  currentDate: Date;

  selectedDate: string;

  onCurrentDateChange: (date: Date) => void;

  onSelectedDateChange: (date: string) => void;

  bookings: BookingItem[];
}) {
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);

    newDate.setMonth(newDate.getMonth() - 1);

    onCurrentDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);

    newDate.setMonth(newDate.getMonth() + 1);

    onCurrentDateChange(newDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);

    const dayOfWeek = firstDay.getDay();

    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    startDate.setDate(startDate.getDate() - daysToSubtract);

    const dayNames = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "CN",
    ];

    // Day headers

    const headerDays = dayNames.map((day) => (
      <div
        key={day}
        className="text-center py-2 text-xs font-semibold text-slate-600"
      >
        {day}
      </div>
    ));

    // Generate calendar days

    const calendarDays: React.ReactNode[] = [];

    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const currentCellDate = new Date(startDate);

        currentCellDate.setDate(startDate.getDate() + week * 7 + day);

        const year = currentCellDate.getFullYear();

        const monthStr = String(currentCellDate.getMonth() + 1).padStart(
          2,
          "0"
        );

        const dayNum = String(currentCellDate.getDate()).padStart(2, "0");

        const dateString = `${year}-${monthStr}-${dayNum}`;

        const isCurrent = currentCellDate.getMonth() === currentDate.getMonth();

        const isSelected = dateString === selectedDate;

        const dayNumber = currentCellDate.getDate();

        const hasBookings = bookings.some(
          (booking) => booking.date === dateString
        );
        const isBusyDay = BUSY_DATES.includes(dateString);

        calendarDays.push(
          <button
            key={dateString}
            onClick={() => onSelectedDateChange(dateString)}
            className={`
              relative aspect-square rounded-lg font-medium text-sm transition-all
              ${
                isSelected
                  ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg scale-105"
                  : isCurrent
                  ? "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
                  : "bg-slate-100 text-slate-400 border border-transparent"
              }
              ${!isCurrent && "opacity-30"}
              flex flex-col items-center justify-center py-1
            `}
          >
            <span>{dayNumber}</span>

            <div className="flex items-center justify-center gap-1 mt-0.5 h-1.5">
              {hasBookings && (
                <div className="w-1.5 h-1.5 rounded-full bg-text-[#10b981]"></div>
              )}
            </div>
          </button>
        );
      }
    }

    return { headerDays, calendarDays };
  };

  const { headerDays, calendarDays } = renderCalendar();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Calendar Header */}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-[#10b981]" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900">
          {currentDate.toLocaleDateString("vi-VN", {
            month: "long",

            year: "numeric",
          })}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-green-500" />
        </button>
      </div>

      {/* Day Headers */}

      <div className="grid grid-cols-7 gap-2 mb-2">{headerDays}</div>

      {/* Calendar Days */}

      <div className="grid grid-cols-7 gap-2">{calendarDays}</div>

      {/* Legend */}

      <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-sm text-slate-600">
            Ngày có buổi huấn luyện
          </span>
        </div>
      </div>
    </div>
  );
}

function ScheduleBookingList({
  selectedDate,

  bookings,
}: {
  selectedDate: string;

  bookings: BookingItem[];
}) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",

      month: "2-digit",

      year: "numeric",

      weekday: "long",
    });
  };

  return (
    <div className="space-y-6">
      {/* Selected Date Header */}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-[#10b981]" />

          <h2 className="text-xl font-semibold text-slate-900">
            {formatDate(selectedDate)}
          </h2>
        </div>

        <p className="text-sm text-slate-600 mt-2">
          {bookings.length} buổi huấn luyện
        </p>
      </div>

      {/* Bookings List */}

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Calendar size={48} className="text-slate-300 mb-4" />

              <p className="text-slate-600 font-medium">
                Không có buổi huấn luyện nào trong ngày này
              </p>

              <p className="text-slate-500 text-sm mt-2">
                Hãy chọn ngày khác để xem lịch
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    setSelectedDate(todayString);
  }, []);

  const getBookingsForSelectedDate = () => {
    return BOOKINGS_DATA.filter(
      (booking) => booking.date === selectedDate
    ).sort((a, b) => {
      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      return toMinutes(a.startTime) - toMinutes(b.startTime);
    });
  };

  const router = useRouter();

  const handleUpdateSchedule = () => {
    router.push("/schedule-detail");
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-autopy-8">
        {/* Header with Update Button */}
        <PageHeader
          title="Lịch Huấn Luyện"
          description="Quản lý lịch trình huấn luyện của bạn"
          actionButton={{
            label: "Thiết lập lịch rảnh huấn luyện",
            onClick: handleUpdateSchedule,
            icon: SquarePen,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* Calendar Section */}

          <div className="lg:col-span-1">
            <ScheduleCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onCurrentDateChange={setCurrentDate}
              onSelectedDateChange={setSelectedDate}
              bookings={BOOKINGS_DATA}
            />
          </div>

          {/* Bookings List Section */}

          <div className="lg:col-span-2">
            <ScheduleBookingList
              selectedDate={selectedDate}
              bookings={getBookingsForSelectedDate()}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
