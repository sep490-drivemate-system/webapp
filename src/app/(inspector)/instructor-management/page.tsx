"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InstructorApplication,
  InstructorStatus,
} from "@/types/instructor-management.types";
import mockData from "@/data/mock-instructors.json";

// Helper functions to convert between enum and string
const statusToString = (status: InstructorStatus): string => {
  switch (status) {
    case InstructorStatus.Pending:
      return "pending";
    case InstructorStatus.Approved:
      return "approved";
    case InstructorStatus.Rejected:
      return "rejected";
    default:
      return "pending";
  }
};

const stringToStatus = (status: string): InstructorStatus => {
  switch (status) {
    case "pending":
      return InstructorStatus.Pending;
    case "approved":
      return InstructorStatus.Approved;
    case "rejected":
      return InstructorStatus.Rejected;
    default:
      return InstructorStatus.Pending;
  }
};

export default function ManagementInstructorPage() {
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorApplication | null>(null);
  const [applications, setApplications] = useState<InstructorApplication[]>(
    (mockData.instructors as any[]).map((instructor) => ({
      ...instructor,
      status: stringToStatus(instructor.status),
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredApplications = useMemo(() => {
    return (
      applications
        .filter((instructor) => {
          const matchesSearch =
            instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (instructor.email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false) ||
            instructor.phone.includes(searchTerm);
          const matchesStatus =
            statusFilter === "all" ||
            statusToString(instructor.status) === statusFilter;
          return matchesSearch && matchesStatus;
        })
        // Sort by submitted date (latest first) so the newest appears at STT 1
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        )
    );
  }, [applications, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    endIndex
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter(
        (app) => app.status === InstructorStatus.Pending
      ).length,
      approved: applications.filter(
        (app) => app.status === InstructorStatus.Approved
      ).length,
      rejected: applications.filter(
        (app) => app.status === InstructorStatus.Rejected
      ).length,
    }),
    [applications]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (status: InstructorStatus) => {
    switch (status) {
      case InstructorStatus.Pending:
        return (
          <Badge className="bg-amber-50 text-amber-700">
            <Clock className="mr-1 size-3" />
            Chờ duyệt
          </Badge>
        );
      case InstructorStatus.Approved:
        return (
          <Badge className="bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 size-3" />
            Đã duyệt
          </Badge>
        );
      case InstructorStatus.Rejected:
        return (
          <Badge className="bg-red-50 text-red-700">
            <XCircle className="mr-1 size-3" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusToString(status)}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((instructor) =>
        instructor.id === id
          ? { ...instructor, status: InstructorStatus.Approved }
          : instructor
      )
    );
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((instructor) =>
        instructor.id === id
          ? { ...instructor, status: InstructorStatus.Rejected }
          : instructor
      )
    );
  };

  const checkDocumentStatus = (documents: any) => {
    const totalDocs = Object.keys(documents).length;
    const verifiedDocs = Object.values(documents).filter(
      (doc: any) => doc.verified
    ).length;
    return {
      total: totalDocs,
      verified: verifiedDocs,
      allVerified: verifiedDocs === totalDocs,
    };
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-background shadow-sm">
        <CardHeader className="space-y-4 border-b bg-muted/20 p-6">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Quản lý người hướng dẫn
            </CardTitle>
            <CardDescription>
              Theo dõi, duyệt hoặc yêu cầu bổ sung hồ sơ ứng viên giảng viên.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Tổng đơn đăng ký"
              value={stats.total}
              icon={<FileText className="size-4 text-muted-foreground" />}
            />
            <StatCard
              label="Chờ duyệt"
              value={stats.pending}
              accent="text-amber-600"
              icon={<Clock className="size-4 text-amber-500" />}
            />
            <StatCard
              label="Đã duyệt"
              value={stats.approved}
              accent="text-emerald-600"
              icon={<CheckCircle className="size-4 text-emerald-500" />}
            />
            <StatCard
              label="Từ chối"
              value={stats.rejected}
              accent="text-red-600"
              icon={<XCircle className="size-4 text-red-500" />}
            />
          </div>
        </CardContent>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as "all" | "pending" | "approved" | "rejected"
              )
            }
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="overflow-x-auto rounded-2xl border">
          <Table>
            <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <TableRow>
                <TableHead className="text-center font-semibold">STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Không tìm thấy ứng viên phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((instructor, index) => {
                  const {
                    cccd,
                    b2License,
                    professionalCertificate,
                    healthCertificate,
                  } = instructor.documents;
                  const docStatus = checkDocumentStatus(instructor.documents);
                  const globalIndex = startIndex + index;
                  return (
                    <TableRow key={instructor.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                        {globalIndex + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{instructor.name}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`tel:${instructor.phone}`}
                          className="text-primary"
                        >
                          {instructor.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm underline">
                        {instructor.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(instructor.submittedAt)}
                      </TableCell>
                      <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Thao tác"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() => {
                                  setSelectedInstructor(instructor);
                                }}
                              >
                                <Eye className="mr-2 size-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {instructor.status ===
                                InstructorStatus.Pending && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(instructor.id)}
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle className="mr-2 size-4" />
                                    Duyệt hồ sơ
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReject(instructor.id)}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 size-4" />
                                    Từ chối hồ sơ
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Hiển thị {paginatedApplications.length}/
            {filteredApplications.length} ứng viên.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Số hàng</span>
              <Select
                value={`${itemsPerPage}`}
                onValueChange={(value) => setItemsPerPage(Number(value))}
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
      </section>

      {/* Dialog for viewing instructor details */}
      {selectedInstructor && (
        <Dialog
          open={!!selectedInstructor}
          onOpenChange={(open) => !open && setSelectedInstructor(null)}
        >
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Chi tiết đơn đăng ký - {selectedInstructor.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Họ và tên" value={selectedInstructor.name} />
                  <InfoItem
                    label="Ngày nộp"
                    value={formatDate(selectedInstructor.submittedAt)}
                  />
                  <InfoItem
                    label="Email"
                    value={selectedInstructor.email ?? "Chưa cập nhật"}
                  >
                    <a
                      href={`mailto:${selectedInstructor.email}`}
                      className="text-primary underline"
                    >
                      {selectedInstructor.email}
                    </a>
                  </InfoItem>
                  <InfoItem
                    label="Số điện thoại"
                    value={selectedInstructor.phone}
                  >
                    <a
                      href={`tel:${selectedInstructor.phone}`}
                      className="text-primary"
                    >
                      {selectedInstructor.phone}
                    </a>
                  </InfoItem>
                  <InfoItem
                    label="Trạng thái"
                    value={statusToString(selectedInstructor.status)}
                  >
                    {getStatusBadge(selectedInstructor.status)}
                  </InfoItem>
                </div>
              </div>

              <div className="space-y-5">
                <SectionShell title="Căn Cước Công Dân">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InfoItem
                      label="Họ và tên"
                      value={
                        selectedInstructor.documents.cccd?.fullName ??
                        "Chưa cập nhật"
                      }
                    />
                    <InfoItem
                      label="Ngày sinh"
                      value={
                        selectedInstructor.documents.cccd?.dateOfBirth
                          ? formatDate(
                              selectedInstructor.documents.cccd.dateOfBirth
                            )
                          : "Chưa cập nhật"
                      }
                    />
                    <InfoItem
                      label="Giới tính"
                      value={
                        selectedInstructor.documents.cccd?.gender ??
                        "Chưa cập nhật"
                      }
                    />
                  </div>
                </SectionShell>

                <SectionShell title="Giấy Phép Lái Xe">
                  <ImagePair
                    firstLabel="ẢNH MẶT TRƯỚC"
                    firstSrc={
                      selectedInstructor.documents.b2License?.front ?? null
                    }
                    secondLabel="ẢNH MẶT SAU"
                    secondSrc={
                      selectedInstructor.documents.b2License?.back ?? null
                    }
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      label="Hạng lái xe"
                      value={
                        selectedInstructor.documents.b2License?.licenseClass ??
                        "Chưa cập nhật"
                      }
                    />
                  </div>
                </SectionShell>

                <SectionShell title="Chứng Chỉ Hành Nghề">
                  <div className="grid gap-4 md:grid-cols-1">
                    <ImageTile
                      label="ẢNH CHỨNG CHỈ"
                      src={
                        selectedInstructor.documents.professionalCertificate
                          ?.front ?? null
                      }
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoItem
                        label="Hạng lái xe được đào tạo"
                        value={
                          selectedInstructor.documents.professionalCertificate
                            ?.vehicleClass ?? "Chưa cập nhật"
                        }
                      />
                    </div>
                  </div>
                </SectionShell>

                <SectionShell title="Giấy Khám Sức Khỏe">
                  <ImageTile
                    label="ẢNH GIẤY KHÁM SỨC KHỎE"
                    src={
                      selectedInstructor.documents.healthCertificate?.front ??
                      null
                    }
                  />
                </SectionShell>

                <SectionShell title="Lý Lịch Tư Pháp">
                  <ImageTile
                    label="ẢNH LÝ LỊCH TƯ PHÁP"
                    src={
                      selectedInstructor.documents.criminalRecord?.front ?? null
                    }
                  />
                </SectionShell>

                <SectionShell title="Thông Tin Liên Hệ Khẩn Cấp">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      label="Tên người liên hệ"
                      value={
                        selectedInstructor.emergencyContact?.name ??
                        "Chưa cập nhật"
                      }
                    />
                    <InfoItem
                      label="Số điện thoại người liên hệ"
                      value={
                        selectedInstructor.emergencyContact?.phone ??
                        "Chưa cập nhật"
                      }
                    >
                      {selectedInstructor.emergencyContact?.phone ? (
                        <a
                          href={`tel:${selectedInstructor.emergencyContact.phone}`}
                          className="text-primary"
                        >
                          {selectedInstructor.emergencyContact.phone}
                        </a>
                      ) : (
                        "Chưa cập nhật"
                      )}
                    </InfoItem>
                  </div>
                </SectionShell>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="border-none bg-white shadow-inner">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-xs uppercase">{label}</CardDescription>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${accent ?? ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function SectionShell({
  title,
  badge,
  badgeTone,
  children,
}: {
  title: string;
  badge?: string;
  badgeTone?: "success" | "warning";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {badge && (
          <Badge
            className={
              badgeTone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          >
            {badge}
          </Badge>
        )}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </Label>
      {children ?? <p className="text-sm font-medium">{value}</p>}
    </div>
  );
}

function ImagePair({
  firstLabel,
  firstSrc,
  secondLabel,
  secondSrc,
}: {
  firstLabel: string;
  firstSrc: string | null;
  secondLabel: string;
  secondSrc: string | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ImageTile label={firstLabel} src={firstSrc} />
      <ImageTile label={secondLabel} src={secondSrc} />
    </div>
  );
}

function ImageTile({ label, src }: { label: string; src: string | null }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {src ? (
        <img
          src={src}
          alt={label}
          className="h-48 w-full rounded-lg border object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
          Chưa tải
        </div>
      )}
    </div>
  );
}
