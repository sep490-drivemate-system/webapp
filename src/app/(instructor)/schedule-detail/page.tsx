"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Check,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookingStatus, bookingStatusToText } from "@/types/booking";

interface BookingItem {
  id: string;
  date: string;
  status: BookingStatus;
}

const BOOKINGS_DATA: BookingItem[] = [
  { id: "BKG001", date: "2025-11-14", status: BookingStatus.RoutePlanning },
  { id: "BKG002", date: "2025-11-14", status: BookingStatus.Pending },
  { id: "BKG003", date: "2025-10-15", status: BookingStatus.Upcoming },
  { id: "BKG004", date: "2025-10-15", status: BookingStatus.Ongoing },
  { id: "BKG005", date: "2025-11-16", status: BookingStatus.Completed },
  { id: "BKG006", date: "2025-12-01", status: BookingStatus.Rescheduled },
  { id: "BKG007", date: "2025-10-16", status: BookingStatus.Ongoing },
  { id: "BKG008", date: "2025-11-17", status: BookingStatus.Upcoming },
  { id: "BKG009", date: "2025-11-17", status: BookingStatus.Cancelled },
  { id: "BKG010", date: "2025-11-18", status: BookingStatus.Upcoming },
  { id: "BKG011", date: "2025-10-18", status: BookingStatus.Ongoing },
  { id: "BKG012", date: "2025-12-18", status: BookingStatus.Completed },
];

// Mock saved available dates - in production, fetch from API
const SAVED_AVAILABLE_DATES = ["2025-11-30"];

function AvailabilityCalendar({
  currentDate,

  selectedDates,

  onCurrentDateChange,

  onDateRangeSelect,

  bookedDates,

  bookedDateStatusMap,

  today,

  savedAvailableDates,
}: {
  currentDate: Date;

  selectedDates: Set<string>;

  onCurrentDateChange: (date: Date) => void;

  onDateRangeSelect: (startDate: string, endDate: string) => void;

  bookedDates: Set<string>;

  bookedDateStatusMap: Map<string, Set<BookingStatus>>;

  today: Date;

  savedAvailableDates: string[];
}) {
  const [selectionStart, setSelectionStart] = useState<string | null>(null);

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

  const isDateDisabled = (dateString: string): boolean => {
    const [year, month, day] = dateString.split("-").map(Number);
    const checkDate = new Date(year, month - 1, day);

    // Only allow selecting availability starting tomorrow and never on booked days
    if (checkDate <= today) return true;
    if (bookedDates.has(dateString)) return true;

    return false;
  };

  const handleDateClick = (dateString: string) => {
    if (isDateDisabled(dateString)) return;

    if (selectionStart === null) {
      setSelectionStart(dateString);
    } else {
      const [startYear, startMonth, startDay] = selectionStart

        .split("-")

        .map(Number);

      const [endYear, endMonth, endDay] = dateString.split("-").map(Number);

      const startDate = new Date(startYear, startMonth - 1, startDay);

      const endDate = new Date(endYear, endMonth - 1, endDay);

      if (startDate <= endDate) {
        onDateRangeSelect(selectionStart, dateString);
      } else {
        onDateRangeSelect(dateString, selectionStart);
      }

      setSelectionStart(null);
    }
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

    const headerDays = dayNames.map((day) => (
      <div
        key={day}
        className="text-center py-2 text-xs font-semibold text-slate-600"
      >
        {day}
      </div>
    ));

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

        const isSelected = selectedDates.has(dateString);

        const dayNumber = currentCellDate.getDate();

        const isDisabled = isDateDisabled(dateString);

        const isBooked = bookedDates.has(dateString);

        const isSavedAvailable = savedAvailableDates.includes(dateString);

        const bookedStatuses = bookedDateStatusMap.get(dateString);

        const bookedStatusLabel =
          bookedStatuses && bookedStatuses.size > 0
            ? Array.from(bookedStatuses)
                .map((status) => bookingStatusToText(status))
                .join(", ")
            : null;

        const isStartSelection = dateString === selectionStart;

        calendarDays.push(
          <button
            key={dateString}
            onClick={() => handleDateClick(dateString)}
            disabled={isDisabled}
            className={`

              relative aspect-square rounded-lg font-medium text-sm transition-all

              ${
                isDisabled
                  ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400"
                  : isSelected
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg"
                  : isStartSelection
                  ? "bg-emerald-200 text-emerald-900 shadow-md"
                  : isCurrent
                  ? "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-transparent opacity-40"
              }

              ${!isCurrent && !isSelected && !isStartSelection && "opacity-30"}

              flex flex-col items-center justify-center py-1

            `}
          >
            <span>{dayNumber}</span>

            <div className="flex items-center justify-center gap-1 mt-0.5 h-1.5">
              {isBooked && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-red-500"
                  title={
                    bookedStatusLabel
                      ? `Ngày đã có khách (${bookedStatusLabel})`
                      : "Ngày đã có khách hàng đặt lịch"
                  }
                ></div>
              )}

              {isSelected && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  title="Ngày rảnh vừa chọn"
                ></div>
              )}

              {isSavedAvailable && !isSelected && (
                <div
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                  title="Ngày rảnh đã lưu"
                ></div>
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
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-green-500" />
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

      <div className="grid grid-cols-7 gap-2 mb-2">{headerDays}</div>

      <div className="grid grid-cols-7 gap-2">{calendarDays}</div>

      {/* Legend and Notes */}

      <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>

          <span className="text-slate-600">Ngày rảnh vừa chọn (chờ lưu)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>

          <span className="text-slate-600">Ngày rảnh đã lưu</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>

          <span className="text-slate-600">Ngày đã có khách hàng đặt lịch</span>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <p className="font-semibold text-xs mb-1">Lưu ý:</p>

          <ul className="text-xs space-y-1">
            <li>• Chỉ có thể thêm lịch rảnh từ ngày mai trở đi.</li>

            <li>
              • Không thể xóa lịch rảnh cho những ngày đã có khách hàng đặt
              lịch.
            </li>

            <li>
              • Mọi cập nhật lịch rảnh trong tương lai, người hướng dẫn hoàn
              toàn chịu trách nhiệm.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AvailabilityList({
  dates,

  onRemoveDate,

  savedDates,

  bookedDates,

  bookedDateStatusMap,

  onRemoveSavedDate,

  isSaving,
}: {
  dates: Set<string>;

  onRemoveDate: (date: string) => void;

  savedDates: string[];

  bookedDates: Set<string>;

  bookedDateStatusMap: Map<string, Set<BookingStatus>>;

  onRemoveSavedDate: (date: string) => void;

  isSaving: boolean;
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

  const sortedDates = Array.from(dates).sort();

  const sortedSavedDates = [...savedDates].sort();

  return (
    <div className="space-y-6">
      {/* Newly selected availability */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Ngày rảnh mới ({dates.size})
        </h3>

        {dates.size > 0 ? (
          <div className="space-y-2">
            {sortedDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>

                  <span className="text-slate-700 font-medium">
                    {formatDate(date)}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveDate(date)}
                  disabled={isSaving}
                  className="p-2 hover:bg-emerald-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} className="text-emerald-700" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            Chưa chọn ngày rảnh nào
          </div>
        )}
      </div>

      {/* Saved availability */}
      {sortedSavedDates.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Ngày rảnh đã lưu ({savedDates.length})
          </h3>

          <div className="space-y-2">
            {sortedSavedDates.map((date) => {
              const isBooked = bookedDates.has(date);

              const bookedStatusLabel = (() => {
                const statuses = bookedDateStatusMap.get(date);
                if (!statuses || statuses.size === 0) return null;
                return Array.from(statuses)
                  .map((status) => bookingStatusToText(status))
                  .join(", ");
              })();

              return (
                <div
                  key={date}
                  className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>

                      <span className="text-slate-700 font-medium">
                        {formatDate(date)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveSavedDate(date)}
                      disabled={isSaving || isBooked}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                      title={
                        isBooked
                          ? "Không thể xóa vì đã có khách hàng đặt lịch"
                          : "Xóa ngày rảnh này"
                      }
                    >
                      <Trash2 size={18} className="text-slate-700" />
                    </button>
                  </div>

                  {isBooked && (
                    <div className="inline-flex items-center gap-2 text-xs text-red-600 font-semibold">
                      <X size={14} />
                      <span>
                        Ngày này đã có khách hàng
                        {bookedStatusLabel ? ` (${bookedStatusLabel})` : ""},
                        không thể xóa.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UpdateSchedulePage() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const [savedAvailableDates, setSavedAvailableDates] = useState<string[]>(
    SAVED_AVAILABLE_DATES
  );

  const [isSaving, setIsSaving] = useState(false);

  const [today] = useState(() => {
    const t = new Date();

    t.setHours(0, 0, 0, 0);

    return t;
  });

  const bookedDateStatusMap = useMemo(() => {
    return BOOKINGS_DATA.reduce<Map<string, Set<BookingStatus>>>(
      (acc, booking) => {
        if (!acc.has(booking.date)) {
          acc.set(booking.date, new Set());
        }
        acc.get(booking.date)!.add(booking.status);
        return acc;
      },
      new Map()
    );
  }, []);

  // Get unique booked dates from BOOKINGS_DATA

  const bookedDates = useMemo(
    () => new Set(Array.from(bookedDateStatusMap.keys())),
    [bookedDateStatusMap]
  );

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    const [startYear, startMonth, startDay] = startDate

      .split("-")

      .map(Number);

    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);

    const end = new Date(endYear, endMonth - 1, endDay);

    const newDates = new Set(selectedDates);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();

      const month = String(d.getMonth() + 1).padStart(2, "0");

      const day = String(d.getDate()).padStart(2, "0");

      const dateStr = `${year}-${month}-${day}`;

      newDates.add(dateStr);
    }

    setSelectedDates(newDates);
  };

  const handleRemoveDate = (date: string) => {
    const newDates = new Set(selectedDates);

    newDates.delete(date);

    setSelectedDates(newDates);
  };

  const handleRemoveSavedDate = (date: string) => {
    if (bookedDates.has(date)) return;
    setSavedAvailableDates(savedAvailableDates.filter((d) => d !== date));
  };

  const handleCancel = () => {
    setSelectedDates(new Set());
  };

  const handleUpdate = async () => {
    setIsSaving(true);

    try {
      // Simulate API call - in production, send instructor availability to backend
      const allAvailableDates = [
        ...new Set([...savedAvailableDates, ...selectedDates]),
      ];

      setSavedAvailableDates(allAvailableDates);

      setSelectedDates(new Set());

      // Show success message and redirect

      setTimeout(() => {
        router.push("/schedule-management");
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="space-y-3 mb-8">
          <Card className="rounded-2xl border bg-white p-6 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="space-y-1">
                  <CardTitle className="text-2xl text-foreground">
                    Thiết Lập Lịch Rảnh Huấn Luyện
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Chọn những ngày bạn sẵn sàng huấn luyện cho khách hàng
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}

          <div className="lg:col-span-1">
            <AvailabilityCalendar
              currentDate={currentDate}
              selectedDates={selectedDates}
              onCurrentDateChange={setCurrentDate}
              onDateRangeSelect={handleDateRangeSelect}
              bookedDates={bookedDates}
              bookedDateStatusMap={bookedDateStatusMap}
              today={today}
              savedAvailableDates={savedAvailableDates}
            />
          </div>

          {/* Availability List Section */}

          <div className="lg:col-span-2">
            <AvailabilityList
              dates={selectedDates}
              onRemoveDate={handleRemoveDate}
              savedDates={savedAvailableDates}
              bookedDates={bookedDates}
              bookedDateStatusMap={bookedDateStatusMap}
              onRemoveSavedDate={handleRemoveSavedDate}
              isSaving={isSaving}
            />

            {/* Action Buttons */}

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCancel}
                disabled={isSaving || selectedDates.size === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />

                <span>Hủy</span>
              </button>

              <button
                onClick={handleUpdate}
                disabled={isSaving || selectedDates.size === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />

                    <span>Cập Nhật</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
