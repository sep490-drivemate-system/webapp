"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  FileText,
  Navigation,
  List,
  PlayCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/commons/Header/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Extended driving session with route planning status
interface IDrivingSessionExtended {
  id: string;
  packageId: string;
  instructorId: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  vehicleId?: string;
  vehicleName?: string;
  status:
    | "planing"
    | "pending_confirmation"
    | "up_coming"
    | "in_progress"
    | "completed"
    | "reschedule"
    | "cancelled";
  createdAt: string;
  packageName?: string;
  instructorAvatar?: string;
  hasRoute?: boolean;
}

// Mock driving sessions data
const drivingSessions: IDrivingSessionExtended[] = [
  {
    id: "session-1",
    packageId: "user-pkg-1",
    instructorId: "1",
    instructorName: "Nguyễn Văn An",
    date: "2025-11-15",
    startTime: "08:00",
    endTime: "11:00",
    duration: 3,
    location: "123 Nguyễn Huệ, Q1, TP.HCM",
    status: "planing",
    createdAt: "2025-11-10T10:00:00Z",
    packageName: "Gói Thành Phố Cơ Bản",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    hasRoute: false,
  },
  {
    id: "session-2",
    packageId: "user-pkg-1",
    instructorId: "1",
    instructorName: "Nguyễn Văn An",
    date: "2025-11-18",
    startTime: "14:00",
    endTime: "16:00",
    duration: 2,
    location: "456 Lê Lợi, Q1, TP.HCM",
    status: "pending_confirmation",
    createdAt: "2025-11-12T14:30:00Z",
    packageName: "Gói Thành Phố Cơ Bản",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    hasRoute: false,
  },
  {
    id: "session-3",
    packageId: "user-pkg-2",
    instructorId: "2",
    instructorName: "Trần Thị Bình",
    date: "2025-11-12",
    startTime: "09:00",
    endTime: "12:00",
    duration: 3,
    location: "789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
    status: "reschedule",
    createdAt: "2025-11-08T09:15:00Z",
    packageName: "Gói Cao Tốc + Xe",
    instructorAvatar: "https://i.pravatar.cc/150?img=2",
    vehicleId: "vehicle-1",
    vehicleName: "Toyota Vios 2023",
    hasRoute: true,
  },
  {
    id: "session-4",
    packageId: "user-pkg-1",
    instructorId: "1",
    instructorName: "Nguyễn Văn An",
    date: "2025-11-05",
    startTime: "08:00",
    endTime: "11:00",
    duration: 3,
    location: "123 Nguyễn Huệ, Q1, TP.HCM",
    status: "completed",
    createdAt: "2025-10-25T10:00:00Z",
    packageName: "Gói Thành Phố Cơ Bản",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    vehicleId: "vehicle-1",
    vehicleName: "Toyota Vios 2023",
    hasRoute: true,
  },
  {
    id: "session-5",
    packageId: "user-pkg-2",
    instructorId: "2",
    instructorName: "Trần Thị Bình",
    date: "2025-11-20",
    startTime: "15:00",
    endTime: "17:00",
    duration: 2,
    location: "321 Võ Văn Tần, Q3, TP.HCM",
    status: "planing",
    createdAt: "2025-11-15T11:20:00Z",
    packageName: "Gói Cao Tốc + Xe",
    instructorAvatar: "https://i.pravatar.cc/150?img=2",
    hasRoute: false,
  },
];

export default function DrivingSessionManagementPage() {
  const router = useRouter();
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

  const getFilteredSessions = () => {
    if (selectedTab === "all") {
      return drivingSessions;
    }
    return drivingSessions.filter((session) => session.status === selectedTab);
  };

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

  const handlePlanRoute = (sessionId: string, location: string) => {
    // Navigate to route planning page
    router.push(
      `/route-planning?sessionId=${sessionId}&pickupLocation=${encodeURIComponent(
        location
      )}`
    );
  };

  const handleViewRoute = (sessionId: string) => {
    // Navigate to route notification page
    router.push(`/route-notification?routeId=${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    // Convert from yyyy-mm-dd to dd/mm/yyyy
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredSessions = getFilteredSessions();

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
      {/* Header Section */}
      <PageHeader
        title="Buổi huấn luyện của tôi"
        description="Quản lý lịch trình huấn luyện và theo dõi tiến trình của học viên"
        className="space-y-4"
      />

      {/* Filter Section */}
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

      {/* Content Section */}
      <section>
        {filteredSessions.length === 0 ? (
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
            {filteredSessions.map((session) => {
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
                        <Avatar className="h-12 w-12 border-2 border-border">
                          <AvatarImage
                            src={
                              session.instructorAvatar ||
                              `https://i.pravatar.cc/150?img=${session.instructorId}`
                            }
                            alt={session.instructorName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {session.instructorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1">
                            {session.instructorName}
                          </CardTitle>
                          {session.packageName && (
                            <CardDescription className="text-sm truncate">
                              {session.packageName}
                            </CardDescription>
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
                        <span className="text-sm line-clamp-2">
                          {session.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <FileText className="h-4 w-4 flex-shrink-0" />
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
