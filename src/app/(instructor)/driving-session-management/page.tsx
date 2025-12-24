"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Navigation,
  List,
  PlayCircle,
  RefreshCw,
  Loader2,
  Car,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/commons/Header/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getAllSessions } from "@/features/booking/bookingThunk";
import { IBookingSession, SessionStatus } from "@/types/booking/booking.type";
import { useThunkAction } from "@/lib/redux/useThunkAction";

const mapSessionStatusToString = (status: SessionStatus): string => {
  switch (status) {
    case SessionStatus.Planning:
      return "planing";
    case SessionStatus.Upcoming:
      return "up_coming";
    case SessionStatus.InProgress:
      return "in_progress";
    case SessionStatus.Completed:
      return "completed";
    case SessionStatus.Reschedule:
      return "reschedule";
    case SessionStatus.Cancelled:
      return "cancelled";
    default:
      return "planing";
  }
};

const mapStringToSessionStatus = (
  status: string
): SessionStatus | undefined => {
  switch (status) {
    case "planing":
      return SessionStatus.Planning;
    case "up_coming":
      return SessionStatus.Upcoming;
    case "in_progress":
      return SessionStatus.InProgress;
    case "completed":
      return SessionStatus.Completed;
    case "reschedule":
      return SessionStatus.Reschedule;
    case "cancelled":
      return SessionStatus.Cancelled;
    default:
      return undefined;
  }
};

type UISession = {
  id: string;
  packageName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  vehicleName: string | null;
  status: string;
  createdAt: string;
  displayStartLocationName: string;
  displayEndLocationName: string;
};

const convertSessionToUIFormat = (session: IBookingSession): UISession => {
  return {
    id: session.id,
    packageName: session.packageName,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
    duration: session.duration,
    location: session.displayStartLocationName,
    vehicleName: session.vehicleName,
    status: mapSessionStatusToString(session.status),
    createdAt: session.createdAt,
    displayStartLocationName: session.displayStartLocationName,
    displayEndLocationName: session.displayEndLocationName,
  };
};

export default function DrivingSessionManagementPage() {
  const dispatch = useAppDispatch();
  const { allSessions, isLoading, errorMessage } = useAppSelector(
    (state) => state.booking
  );
  const { runSafe: runGetAllSessions } = useThunkAction(getAllSessions);

  const [selectedTab, setSelectedTab] = useState<
    | "all"
    | "planing"
    | "pending_confirmation"
    | "up_coming"
    | "in_progress"
    | "completed"
    | "reschedule"
    | "cancelled"
  >("all");

  useEffect(() => {
    const getAllSessions = async () => {
      const status = mapStringToSessionStatus(selectedTab);
      const result = await runGetAllSessions(status ? { status } : undefined);
      console.log("getAllSessions", result.data?.value ?? []);
    };
    getAllSessions();
  }, [selectedTab]);

  const filteredSessions = useMemo(() => {
    const convertedSessions = allSessions.map(convertSessionToUIFormat);

    if (selectedTab === "all") {
      return convertedSessions;
    }

    return convertedSessions.filter(
      (session: UISession) => session.status === selectedTab
    );
  }, [allSessions, selectedTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planing":
        return "bg-blue-500";
      case "pending_confirmation":
        return "bg-yellow-500";
      case "up_coming":
        return "bg-emerald-500";
      case "in_progress":
        return "bg-cyan-500";
      case "completed":
        return "bg-green-600";
      case "reschedule":
        return "bg-orange-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "all":
        return "Tất cả";
      case "planing":
        return "Lên lộ trình";
      case "pending_confirmation":
        return "Đợi xác nhận";
      case "up_coming":
        return "Sắp diễn ra";
      case "in_progress":
        return "Đang diễn ra";
      case "completed":
        return "Hoàn thành";
      case "reschedule":
        return "Đổi lịch";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "all":
        return List;
      case "planing":
        return Navigation;
      case "pending_confirmation":
        return AlertCircle;
      case "up_coming":
        return Calendar;
      case "in_progress":
        return PlayCircle;
      case "completed":
        return CheckCircle;
      case "reschedule":
        return RefreshCw;
      case "cancelled":
        return X;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-");
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  const getEmptyStateMessage = () => {
    switch (selectedTab) {
      case "all":
        return "Chưa có buổi huấn luyện nào";
      case "planing":
        return "Chưa có buổi huấn luyện cần lên lộ trình";
      case "pending_confirmation":
        return "Chưa có buổi huấn luyện chờ xác nhận";
      case "up_coming":
        return "Chưa có buổi huấn luyện sắp diễn ra";
      case "in_progress":
        return "Chưa có buổi huấn luyện đang diễn ra";
      case "completed":
        return "Chưa có buổi huấn luyện hoàn thành";
      case "reschedule":
        return "Chưa có buổi huấn luyện cần đổi lịch";
      case "cancelled":
        return "Chưa có buổi huấn luyện đã hủy";
      default:
        return "Chưa có buổi huấn luyện nào";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Buổi Huấn Luyện"
        description="Quản lý lịch trình huấn luyện và theo dõi tiến trình của người lái mới"
        className="space-y-4"
      />
      <section>
        <div className="flex justify-end items-center gap-4">
          <Label
            htmlFor="status-filter"
            className="text-sm font-medium whitespace-nowrap"
          >
            Lọc theo trạng thái:
          </Label>
          <Select
            value={selectedTab}
            onValueChange={(value) =>
              setSelectedTab(
                value as
                  | "all"
                  | "planing"
                  | "pending_confirmation"
                  | "up_coming"
                  | "in_progress"
                  | "completed"
                  | "reschedule"
                  | "cancelled"
              )
            }
          >
            <SelectTrigger id="status-filter" className="w-[250px]">
              <SelectValue placeholder="Chọn trạng thái">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getStatusIcon(selectedTab);
                    return <Icon className="size-4" />;
                  })()}
                  <span>{getStatusText(selectedTab)}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <List className="size-4" />
                  <span>Tất cả</span>
                </div>
              </SelectItem>
              <SelectItem value="planing">
                <div className="flex items-center gap-2">
                  <Navigation className="size-4" />
                  <span>Lên lộ trình</span>
                </div>
              </SelectItem>
              <SelectItem value="pending_confirmation">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  <span>Đợi xác nhận</span>
                </div>
              </SelectItem>
              <SelectItem value="up_coming">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>Sắp diễn ra</span>
                </div>
              </SelectItem>
              <SelectItem value="in_progress">
                <div className="flex items-center gap-2">
                  <PlayCircle className="size-4" />
                  <span>Đang diễn ra</span>
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4" />
                  <span>Hoàn thành</span>
                </div>
              </SelectItem>
              <SelectItem value="reschedule">
                <div className="flex items-center gap-2">
                  <RefreshCw className="size-4" />
                  <span>Đổi lịch</span>
                </div>
              </SelectItem>
              <SelectItem value="cancelled">
                <div className="flex items-center gap-2">
                  <X className="size-4" />
                  <span>Đã hủy</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section>
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
              <CardTitle className="mb-2 text-xl">
                Đang tải dữ liệu...
              </CardTitle>
            </CardContent>
          </Card>
        ) : errorMessage ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 rounded-full bg-muted p-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="mb-2 text-xl text-destructive">
                {errorMessage}
              </CardTitle>
            </CardContent>
          </Card>
        ) : filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 rounded-full bg-muted p-6">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2 text-xl">
                {getEmptyStateMessage()}
              </CardTitle>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {filteredSessions.map((session: UISession) => {
              const StatusIcon = getStatusIcon(session.status);
              const statusColor = getStatusColor(session.status);

              return (
                <Card
                  key={session.id}
                  className="overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 min-w-0">
                          {session.packageName && (
                            <CardTitle className="text-lg mb-1">
                              {session.packageName}
                            </CardTitle>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`${statusColor} text-white flex items-center gap-1.5 px-3 py-1`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">
                          {getStatusText(session.status)}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(session.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          {session.startTime} - {session.endTime} (
                          {session.duration} giờ)
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-sm line-clamp-2">
                            Điểm bắt đầu: {session.displayStartLocationName}
                          </span>
                          {session.displayEndLocationName && (
                            <span className="text-sm line-clamp-2 block mt-1">
                              Điểm kết thúc: {session.displayEndLocationName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Car className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          Xe: {session.vehicleName || "Xe của khách hàng"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
