"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Calendar,
  MapPin,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  RefreshCw,
  Star,
  Phone,
  Navigation,
  Route as RouteIcon,
} from "lucide-react";
import Link from "next/link";
import sessionsData from "@/data/mock-sessions.json";

interface Session {
  id: string;
  packageId: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  pickupLocation: string;
  vehicle: {
    type: string;
    plate: string;
    color: string;
  };
  route: {
    distance: number;
    skills: string[];
    waypoints: string[];
    mapUrl?: string;
  };
  instructorNotes: string | null;
  rating: number | null;
  feedback: string | null;
  actualPrice: number | null;
  createdAt: string;
  completedAt: string | null;
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(sessionsData.sessions as any);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [cancelingSession, setCancelingSession] = useState<Session | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, {
      label: string;
      variant: "default" | "secondary" | "outline" | "destructive";
      color: string;
      icon: any;
    }> = {
      pending: {
        label: "Chờ xác nhận",
        variant: "secondary",
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle
      },
      confirmed: {
        label: "Đã xác nhận",
        variant: "default",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle
      },
      "in-progress": {
        label: "Đang diễn ra",
        variant: "default",
        color: "bg-green-100 text-green-800",
        icon: Navigation
      },
      completed: {
        label: "Hoàn thành",
        variant: "outline",
        color: "bg-gray-100 text-gray-800",
        icon: CheckCircle
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive",
        color: "bg-red-100 text-red-800",
        icon: XCircle
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setShowDetailsDialog(true);
  };

  const handleCancelSession = (session: Session) => {
    setCancelingSession(session);
    setShowCancelDialog(true);
  };

  const confirmCancelSession = () => {
    if (!cancelingSession) return;

    console.log('Canceling session:', cancelingSession.id);

    setSessions(prev => prev.map(s =>
      s.id === cancelingSession.id
        ? { ...s, status: 'cancelled' }
        : s
    ));

    setShowCancelDialog(false);
    setCancelingSession(null);
  };

  const handleReschedule = (session: Session) => {
    setSelectedSession(session);
    setShowRescheduleDialog(true);
  };

  const handleFeedback = (session: Session) => {
    setSelectedSession(session);
    setRating(session.rating || 5);
    setFeedback(session.feedback || "");
    setShowFeedbackDialog(true);
  };

  const submitFeedback = () => {
    if (!selectedSession) return;

    console.log('Submitting feedback:', { rating, feedback });

    setSessions(prev => prev.map(s =>
      s.id === selectedSession.id
        ? { ...s, rating, feedback }
        : s
    ));

    setShowFeedbackDialog(false);
    setSelectedSession(null);
    setRating(5);
    setFeedback("");
  };

  const upcomingSessions = sessions.filter(s =>
    s.status === "pending" || s.status === "confirmed"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedSessions = sessions.filter(s =>
    s.status === "completed"
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const cancelledSessions = sessions.filter(s =>
    s.status === "cancelled"
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const SessionCard = ({ session }: { session: Session }) => {
    const statusInfo = getStatusInfo(session.status);
    const StatusIcon = statusInfo.icon;
    const isUpcoming = session.status === "pending" || session.status === "confirmed";
    const isCompleted = session.status === "completed";

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.instructorAvatar} />
                <AvatarFallback>{session.instructorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{session.instructorName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span>{session.instructorPhone}</span>
                </div>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-gray-700 line-clamp-2">
                {session.pickupLocation}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
              <Car className="h-4 w-4 text-blue-600" />
              <span className="text-blue-900">
                {session.vehicle.type} - {session.vehicle.plate}
              </span>
            </div>

            {session.route.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {session.route.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            {isCompleted && session.rating && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= session.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  Đã đánh giá {session.rating}/5
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleViewDetails(session)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>

          {isUpcoming && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReschedule(session)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Đổi lịch
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelSession(session)}
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
            </>
          )}

          {isCompleted && !session.rating && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleFeedback(session)}
            >
              <Star className="mr-2 h-4 w-4" />
              Đánh giá
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch học của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý các buổi học đã đặt và sắp tới
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {upcomingSessions.length}
                </p>
                <p className="text-sm text-gray-600">Sắp tới</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {completedSessions.length}
                </p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {sessions.reduce((sum, s) => sum + s.duration, 0)}h
                </p>
                <p className="text-sm text-gray-600">Tổng giờ</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {completedSessions.reduce((sum, s) => sum + (s.route?.distance || 0), 0).toFixed(1)} km
                </p>
                <p className="text-sm text-gray-600">Tổng km</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Sắp tới ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Hoàn thành ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Đã hủy ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có buổi học nào sắp tới
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Đặt lịch học từ gói đã mua hoặc tìm người hướng dẫn mới
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/my-packages">Gói của tôi</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/instructors">Tìm người hướng dẫn</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Chưa có buổi học hoàn thành</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <XCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Không có buổi học bị hủy</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Session Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết buổi học</DialogTitle>
            </DialogHeader>

            {selectedSession && (
              <div className="space-y-6">
                {/* Instructor Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedSession.instructorAvatar} />
                    <AvatarFallback>
                      {selectedSession.instructorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedSession.instructorName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{selectedSession.instructorPhone}</span>
                    </div>
                  </div>
                  {getStatusInfo(selectedSession.status).icon && (
                    <Badge className={getStatusInfo(selectedSession.status).color}>
                      {React.createElement(getStatusInfo(selectedSession.status).icon, {
                        className: "h-3 w-3 mr-1"
                      })}
                      {getStatusInfo(selectedSession.status).label}
                    </Badge>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngày học</p>
                    <p className="font-medium">{formatDate(selectedSession.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                    <p className="font-medium">
                      {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)} ({selectedSession.duration}h)
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Điểm đón</p>
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <p>{selectedSession.pickupLocation}</p>
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Phương tiện</p>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                    <Car className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{selectedSession.vehicle.type}</p>
                      <p className="text-sm text-gray-600">
                        Biển số: {selectedSession.vehicle.plate} - Màu: {selectedSession.vehicle.color}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                {selectedSession.route.waypoints.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Lộ trình</p>
                    <div className="p-3 bg-gray-50 rounded space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <RouteIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          Khoảng cách: {selectedSession.route.distance} km
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        {selectedSession.route.waypoints.map((waypoint, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-gray-400">{index + 1}.</span>
                            <span>{waypoint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Kỹ năng luyện tập</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.route.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Instructor Notes */}
                {selectedSession.instructorNotes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Ghi chú từ giáo viên</p>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm">{selectedSession.instructorNotes}</p>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedSession.feedback && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Đánh giá của bạn</p>
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (selectedSession.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{selectedSession.feedback}</p>
                    </div>
                  </div>
                )}

                {/* Price */}
                {selectedSession.actualPrice && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng chi phí:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(selectedSession.actualPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Xác nhận hủy buổi học</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn hủy buổi học này?
              </DialogDescription>
            </DialogHeader>

            {cancelingSession && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium mb-1">{cancelingSession.instructorName}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(cancelingSession.date)} - {formatTime(cancelingSession.startTime)}
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="font-medium mb-2">⚠️ Chính sách hủy:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Hủy trước 12h: Giờ học sẽ được hoàn lại</li>
                    <li>Hủy dưới 12h: Không hoàn lại giờ học</li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Quay lại
              </Button>
              <Button variant="destructive" onClick={confirmCancelSession}>
                Xác nhận hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi lịch học</DialogTitle>
              <DialogDescription>
                Chọn thời gian mới cho buổi học
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded text-sm">
                <p className="font-medium mb-1">Lưu ý:</p>
                <p className="text-xs">Bạn chỉ có thể đổi lịch trước 24 giờ</p>
              </div>

              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chức năng đang phát triển</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đánh giá buổi học</DialogTitle>
              <DialogDescription>
                Chia sẻ trải nghiệm của bạn với người hướng dẫn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-3">Đánh giá của bạn</p>
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 cursor-pointer ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Nhận xét</p>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn về buổi học..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Hủy
              </Button>
              <Button onClick={submitFeedback}>
                Gửi đánh giá
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

