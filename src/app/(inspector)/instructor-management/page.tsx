"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllInstructorApplications,
  handleInstructorApplication,
} from "@/features/instructor/instructorThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  DrivingLicenseTier,
  InstructorApplication,
  InstructorStatus,
} from "@/types/instructor/instructor-management.types";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react";
import React, { useMemo, useState } from "react";

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

const drivingLicenseTierToString = (tier: DrivingLicenseTier): string => {
  switch (tier) {
    case DrivingLicenseTier.B:
      return "B";
    case DrivingLicenseTier.C1:
      return "C1";
    case DrivingLicenseTier.C:
      return "C";
    case DrivingLicenseTier.D1:
      return "D1";
    case DrivingLicenseTier.D2:
      return "D2";
    case DrivingLicenseTier.D:
      return "D";
    case DrivingLicenseTier.BE:
      return "BE";
    case DrivingLicenseTier.C1E:
      return "C1E";
    case DrivingLicenseTier.CE:
      return "CE";
    case DrivingLicenseTier.D1E:
      return "D1E";
    case DrivingLicenseTier.D2E:
      return "D2E";
    case DrivingLicenseTier.DE:
      return "DE";
    default:
      return "Chưa cập nhật";
  }
};

export default function ManagementInstructorPage() {
  const {
    runSafe: runGetAllInstructorApplications,
    loading: getAllInstructorApplicationsLoading,
  } = useThunkAction(getAllInstructorApplications);
  const { runSafe: runHandleInstructorApplication } = useThunkAction(
    handleInstructorApplication
  );
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorApplication | null>(null);
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredApplications = useMemo(() => {
    if (!applications || applications.length === 0) return [];
    return (
      applications
        .filter((instructorApplication) => {
          const matchesSearch =
            (instructorApplication.fullname
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false) ||
            (instructorApplication.email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ??
              false) ||
            (instructorApplication.phone?.includes(searchTerm) ?? false);
          const matchesStatus =
            statusFilter === "all" ||
            statusToString(instructorApplication.applicationStatus) ===
              statusFilter;
          return matchesSearch && matchesStatus;
        })
        .sort(
          (a, b) =>
            new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime()
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
    const fetchInstructorApplications = async () => {
      const res = await runGetAllInstructorApplications();
      if (res.ok) {
        const fetchedApplications = Array.isArray(res.data?.value)
          ? (res.data?.value as InstructorApplication[])
          : [];
        console.log(
          "Instructor applications fetched successfully",
          fetchedApplications
        );
        setApplications(fetchedApplications);
      } else {
        setApplications([]);
      }
    };
    fetchInstructorApplications();
  }, [runGetAllInstructorApplications]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const stats = useMemo(() => {
    const apps = Array.isArray(applications) ? applications : [];
    return {
      total: apps.length,
      pending: apps.filter(
        (app) => app.applicationStatus === InstructorStatus.Pending
      ).length,
      approved: apps.filter(
        (app) => app.applicationStatus === InstructorStatus.Approved
      ).length,
      rejected: apps.filter(
        (app) => app.applicationStatus === InstructorStatus.Rejected
      ).length,
    };
  }, [applications]);

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

  const handleApprove = async (id: string) => {
    const res = await runHandleInstructorApplication({
      applicationId: id,
      action: "approve",
      note: "",
    });
    if (res.ok) {
      console.log("Instructor application approved successfully");
      setApplications((prev) =>
        prev.map((instructor) =>
          instructor.applicationId === id
            ? { ...instructor, applicationStatus: InstructorStatus.Approved }
            : instructor
        )
      );
    }
  };

  const handleReject = async (id: string) => {
    const res = await runHandleInstructorApplication({
      applicationId: id,
      action: "reject",
      note: "",
    });
    if (res.ok) {
      console.log("Instructor application rejected successfully");
      setApplications((prev) =>
        prev.map((instructor) =>
          instructor.applicationId === id
            ? { ...instructor, applicationStatus: InstructorStatus.Rejected }
            : instructor
        )
      );
    }
  };

  if (getAllInstructorApplicationsLoading) {
    return (
      <div className="flex flex-col gap-4 h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner variant="circle" className="size-10" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản Lý Người Hướng Dẫn"
        description="Theo dõi, duyệt hoặc yêu cầu bổ sung hồ sơ ứng viên giảng viên."
        className="space-y-4"
      />
      <Card className="rounded-3xl border bg-background shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Tổng đơn đăng ký"
              value={stats.total}
              icon={<FileText className="size-5" />}
              accent="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Chờ duyệt"
              value={stats.pending}
              icon={<Clock className="size-5" />}
              accent="bg-amber-50 text-amber-600"
            />
            <StatCard
              label="Đã duyệt"
              value={stats.approved}
              icon={<CheckCircle className="size-5" />}
              accent="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              label="Từ chối"
              value={stats.rejected}
              icon={<XCircle className="size-5" />}
              accent="bg-rose-50 text-rose-600"
            />
          </div>
        </CardContent>
      </Card>

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
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
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
                    colSpan={7}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Không tìm thấy ứng viên phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((instructorApplication, index) => {
                  return (
                    <TableRow
                      key={instructorApplication.applicationId}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="text-center text-sm font-semibold text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {instructorApplication.fullname}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`tel:${instructorApplication.phone}`}
                          className="text-primary"
                        >
                          {instructorApplication.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm underline">
                        {instructorApplication.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(instructorApplication.submitDate)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          instructorApplication.applicationStatus
                        )}
                      </TableCell>
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
                                  setSelectedInstructor(instructorApplication);
                                }}
                              >
                                <Eye className="mr-2 size-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              {instructorApplication.applicationStatus ===
                                InstructorStatus.Pending && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleApprove(
                                        instructorApplication.applicationId
                                      )
                                    }
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle className="mr-2 size-4" />
                                    Duyệt hồ sơ
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleReject(
                                        instructorApplication.applicationId
                                      )
                                    }
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
                Chi tiết đơn đăng ký - {selectedInstructor.fullname}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Họ và tên"
                    value={selectedInstructor.fullname}
                  />
                  <InfoItem
                    label="Ngày nộp"
                    value={formatDate(selectedInstructor.submitDate)}
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
                    value={statusToString(selectedInstructor.applicationStatus)}
                  >
                    {getStatusBadge(selectedInstructor.applicationStatus)}
                  </InfoItem>
                </div>
              </div>

              <div className="space-y-5">
                <SectionShell title="Căn Cước Công Dân">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InfoItem
                      label="Họ và tên"
                      value={selectedInstructor.fullname ?? "Chưa cập nhật"}
                    />
                    <InfoItem
                      label="Ngày sinh"
                      value={
                        selectedInstructor.birthDate
                          ? formatDate(selectedInstructor.birthDate)
                          : "Chưa cập nhật"
                      }
                    />
                    <InfoItem
                      label="Giới tính"
                      value={
                        selectedInstructor.gender
                          ? selectedInstructor.gender === "Male"
                            ? "Nam"
                            : "Nữ"
                          : "Chưa cập nhật"
                      }
                    />
                  </div>
                </SectionShell>

                <SectionShell title="Giấy Phép Lái Xe">
                  <ImagePair
                    firstLabel="ẢNH MẶT TRƯỚC"
                    firstSrc={selectedInstructor.drivingLicenseFront ?? null}
                    secondLabel="ẢNH MẶT SAU"
                    secondSrc={selectedInstructor.drivingLicenseFront ?? null}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      label="Hạng lái xe"
                      value={drivingLicenseTierToString(
                        selectedInstructor.drivingLicenseTier
                      )}
                    />
                  </div>
                </SectionShell>

                <SectionShell title="Chứng Chỉ Hành Nghề">
                  <div className="grid gap-4 md:grid-cols-1">
                    <ImageTile
                      label="ẢNH CHỨNG CHỈ"
                      src={selectedInstructor.teachingLicenseFront ?? null}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoItem
                        label="Hạng lái xe được đào tạo"
                        value={drivingLicenseTierToString(
                          selectedInstructor.teachingLicenseTier
                        )}
                      />
                    </div>
                  </div>
                </SectionShell>

                <SectionShell title="Giấy Khám Sức Khỏe">
                  <ImageTile
                    label="ẢNH GIẤY KHÁM SỨC KHỎE"
                    src={selectedInstructor.healthCheckup ?? null}
                  />
                </SectionShell>

                <SectionShell title="Lý Lịch Tư Pháp">
                  <ImageTile
                    label="ẢNH LÝ LỊCH TƯ PHÁP"
                    src={selectedInstructor.personalProfile ?? null}
                  />
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardDescription className="text-sm font-medium">
            {label}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
        </div>
        {icon && (
          <span
            className={`rounded-xl p-3 ${accent || "bg-blue-50 text-blue-600"}`}
          >
            {icon}
          </span>
        )}
      </CardHeader>
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
        // eslint-disable-next-line @next/next/no-img-element
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
