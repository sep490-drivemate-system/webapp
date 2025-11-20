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
} from "lucide-react";
import { InstructorApplication } from "@/types/instructor-management.types";
import mockData from "@/data/mock-instructors.json";

export default function ManagementInstructorPage() {
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorApplication | null>(null);
  const [applications, setApplications] = useState<InstructorApplication[]>(
    mockData.instructors as InstructorApplication[]
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
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.phone.includes(searchTerm);
          const matchesStatus =
            statusFilter === "all" || instructor.status === statusFilter;
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
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700">
            <Clock className="mr-1 size-3" />
            Chờ duyệt
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 size-3" />
            Đã duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-700">
            <XCircle className="mr-1 size-3" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    console.log("Approving instructor:", id);
    // TODO: Implement approve logic
  };

  const handleReject = (id: string) => {
    console.log("Rejecting instructor:", id);
    // TODO: Implement reject logic
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
                        <div className="flex justify-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Xem chi tiết"
                                onClick={() =>
                                  setSelectedInstructor(instructor)
                                }
                              >
                                <Eye className="size-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Chi tiết đơn đăng ký - {instructor.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="rounded-xl border bg-muted/30 p-5">
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoItem
                                      label="Họ và tên"
                                      value={instructor.name}
                                    />
                                    <InfoItem
                                      label="Ngày nộp"
                                      value={formatDate(instructor.submittedAt)}
                                    />
                                    <InfoItem
                                      label="Email"
                                      value={instructor.email}
                                    >
                                      <a
                                        href={`mailto:${instructor.email}`}
                                        className="text-primary underline"
                                      >
                                        {instructor.email}
                                      </a>
                                    </InfoItem>
                                    <InfoItem
                                      label="Số điện thoại"
                                      value={instructor.phone}
                                    >
                                      <a
                                        href={`tel:${instructor.phone}`}
                                        className="text-primary"
                                      >
                                        {instructor.phone}
                                      </a>
                                    </InfoItem>
                                    <InfoItem
                                      label="Trạng thái"
                                      value={instructor.status}
                                    >
                                      {getStatusBadge(instructor.status)}
                                    </InfoItem>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <SectionShell title="Căn Cước Công Dân">
                                    <div className="grid gap-4 sm:grid-cols-3">
                                      <InfoItem
                                        label="Họ và tên"
                                        value={cccd.fullName ?? "Chưa cập nhật"}
                                      />
                                      <InfoItem
                                        label="Ngày sinh"
                                        value={
                                          cccd.dateOfBirth
                                            ? formatDate(cccd.dateOfBirth)
                                            : "Chưa cập nhật"
                                        }
                                      />
                                      <InfoItem
                                        label="Giới tính"
                                        value={cccd.gender ?? "Chưa cập nhật"}
                                      />
                                    </div>
                                  </SectionShell>

                                  <SectionShell title="Giấy Phép Lái Xe">
                                    <ImagePair
                                      firstLabel="ẢNH MẶT TRƯỚC"
                                      firstSrc={b2License.front ?? null}
                                      secondLabel="ẢNH MẶT SAU"
                                      secondSrc={b2License.back ?? null}
                                    />
                                    <div className="grid gap-4 sm:grid-cols-2">
                                      <InfoItem
                                        label="Hạng lái xe"
                                        value={
                                          b2License.licenseClass ??
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
                                          professionalCertificate.front ?? null
                                        }
                                      />
                                      <div className="grid gap-4 sm:grid-cols-2">
                                        <InfoItem
                                          label="Hạng lái xe được đào tạo"
                                          value={
                                            professionalCertificate.vehicleClass ??
                                            "Chưa cập nhật"
                                          }
                                        />
                                      </div>
                                    </div>
                                  </SectionShell>

                                  <SectionShell title="Giấy Khám Sức Khỏe">
                                    <ImageTile
                                      label="ẢNH GIẤY KHÁM SỨC KHỎE"
                                      src={healthCertificate.front ?? null}
                                    />
                                  </SectionShell>

                                  <SectionShell title="Thông Tin Liên Hệ Khẩn Cấp">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                      <InfoItem
                                        label="Tên người liên hệ"
                                        value={
                                          instructor.emergencyContact?.name ??
                                          "Chưa cập nhật"
                                        }
                                      />
                                      <InfoItem
                                        label="Số điện thoại người liên hệ"
                                        value={
                                          instructor.emergencyContact?.phone ??
                                          "Chưa cập nhật"
                                        }
                                      >
                                        {instructor.emergencyContact?.phone ? (
                                          <a
                                            href={`tel:${instructor.emergencyContact.phone}`}
                                            className="text-primary"
                                          >
                                            {instructor.emergencyContact.phone}
                                          </a>
                                        ) : (
                                          "Chưa cập nhật"
                                        )}
                                      </InfoItem>
                                    </div>
                                  </SectionShell>
                                </div>

                                {/* Thao tác duyệt/từ chối đã được xử lý ngay trên danh sách */}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {instructor.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Duyệt hồ sơ"
                                className="text-emerald-600"
                                disabled={!docStatus.allVerified}
                                onClick={() => handleApprove(instructor.id)}
                              >
                                <CheckCircle className="size-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label="Từ chối hồ sơ"
                                className="text-red-600"
                                onClick={() => handleReject(instructor.id)}
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </>
                          )}
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
