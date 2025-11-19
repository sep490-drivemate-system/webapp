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
  AlertTriangle,
  RefreshCw,
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
  const [reapplyDocument, setReapplyDocument] = useState<{
    instructorId: string;
    docType: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredApplications = useMemo(() => {
    return applications.filter((instructor) => {
      const matchesSearch =
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || instructor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
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

  const handleReapplyDocument = (instructorId: string, docType: string) => {
    setReapplyDocument({ instructorId, docType });
    // TODO: Implement reapply logic with image upload
  };

  const handleVerifyDocument = (instructorId: string, docType: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === instructorId
          ? {
              ...app,
              documents: {
                ...app.documents,
                [docType]: {
                  ...app.documents[docType as keyof typeof app.documents],
                  verified: true,
                },
              },
            }
          : app
      )
    );
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
                <TableHead>Liên hệ</TableHead>
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
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>{instructor.email}</p>
                          <a
                            href={`tel:${instructor.phone}`}
                            className="text-primary"
                          >
                            {instructor.phone}
                          </a>
                        </div>
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
                                <div className="grid gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-2">
                                  <div className="space-y-2 text-sm">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                      Thông tin cá nhân
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Họ tên:
                                      </span>{" "}
                                      {instructor.name}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {instructor.email}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Ngày nộp:
                                      </span>{" "}
                                      {formatDate(instructor.submittedAt)}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                      Trạng thái
                                    </p>
                                    {getStatusBadge(instructor.status)}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h3 className="text-base font-semibold">
                                    Tổng quan giấy tờ
                                  </h3>
                                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(instructor.documents).map(
                                      ([key, doc]) => (
                                        <div
                                          key={key}
                                          className="rounded-xl border bg-card p-4 text-center shadow-sm"
                                        >
                                          <div className="mb-3">
                                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg border bg-muted text-lg font-semibold text-muted-foreground">
                                              {key === "b2License"
                                                ? "B2"
                                                : key === "cccd"
                                                ? "CC"
                                                : key ===
                                                  "professionalCertificate"
                                                ? "PC"
                                                : key === "healthCertificate"
                                                ? "HC"
                                                : key === "vehiclePapers"
                                                ? "VP"
                                                : "BH"}
                                            </div>
                                            <p className="text-sm font-medium">
                                              {key === "b2License"
                                                ? "Bằng B2"
                                                : key === "cccd"
                                                ? "CCCD"
                                                : key ===
                                                  "professionalCertificate"
                                                ? "Chứng chỉ"
                                                : key === "healthCertificate"
                                                ? "Khám sức khỏe"
                                                : key === "vehiclePapers"
                                                ? "Giấy tờ xe"
                                                : "Bảo hiểm"}
                                            </p>
                                          </div>
                                          <div className="space-y-2">
                                            {doc.verified ? (
                                              <Badge className="bg-emerald-50 text-emerald-700">
                                                <CheckCircle className="mr-1 size-3" />
                                                Đã xác thực
                                              </Badge>
                                            ) : (
                                              <div className="space-y-2">
                                                <Badge className="bg-amber-50 text-amber-700">
                                                  <Clock className="mr-1 size-3" />
                                                  Chưa xác thực
                                                </Badge>
                                                <div className="flex justify-center gap-2">
                                                  <Button
                                                    size="icon"
                                                    variant="outline"
                                                    aria-label="Xác thực giấy tờ"
                                                    className="h-7 w-7 text-emerald-600"
                                                    onClick={() =>
                                                      handleVerifyDocument(
                                                        instructor.id,
                                                        key
                                                      )
                                                    }
                                                  >
                                                    <CheckCircle className="size-4" />
                                                  </Button>
                                                  <Button
                                                    size="icon"
                                                    variant="outline"
                                                    aria-label="Yêu cầu nộp lại"
                                                    className="h-7 w-7 text-amber-600"
                                                    onClick={() =>
                                                      handleReapplyDocument(
                                                        instructor.id,
                                                        key
                                                      )
                                                    }
                                                  >
                                                    <RefreshCw className="size-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <div className="rounded-xl border bg-muted/20 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span className="text-sm font-medium">
                                        Tổng kết giấy tờ
                                      </span>
                                      <Badge
                                        className={`${
                                          docStatus.allVerified
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}
                                      >
                                        {docStatus.allVerified ? (
                                          <>
                                            <CheckCircle className="mr-1 size-3" />
                                            Đã xác thực đầy đủ (
                                            {docStatus.verified}/
                                            {docStatus.total})
                                          </>
                                        ) : (
                                          <>
                                            <AlertTriangle className="mr-1 size-3" />
                                            Chưa đầy đủ ({docStatus.verified}/
                                            {docStatus.total})
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {instructor.status === "pending" && (
                                  <div className="flex justify-end gap-3 border-t pt-4">
                                    <Button
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                      onClick={() => {
                                        handleReject(instructor.id);
                                        setSelectedInstructor(null);
                                      }}
                                    >
                                      <XCircle className="mr-2 size-4" />
                                      Từ chối
                                    </Button>
                                    <Button
                                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                                      disabled={!docStatus.allVerified}
                                      onClick={() => {
                                        handleApprove(instructor.id);
                                        setSelectedInstructor(null);
                                      }}
                                    >
                                      <CheckCircle className="mr-2 size-4" />
                                      Duyệt
                                    </Button>
                                  </div>
                                )}
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

      <Dialog
        open={!!reapplyDocument}
        onOpenChange={() => setReapplyDocument(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nộp lại giấy tờ</DialogTitle>
          </DialogHeader>
          {reapplyDocument && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                <p className="text-muted-foreground">
                  Bạn đang yêu cầu nộp lại:
                </p>
                <p className="text-base font-semibold">
                  {reapplyDocument.docType === "b2License"
                    ? "Bằng lái xe B2"
                    : reapplyDocument.docType === "cccd"
                    ? "Căn cước công dân"
                    : reapplyDocument.docType === "professionalCertificate"
                    ? "Chứng chỉ hành nghề"
                    : reapplyDocument.docType === "healthCertificate"
                    ? "Giấy khám sức khỏe"
                    : reapplyDocument.docType === "vehiclePapers"
                    ? "Giấy tờ xe"
                    : "Bảo hiểm xe"}
                </p>
              </div>
              <div className="space-y-4">
                <UploadPlaceholder label="Chụp ảnh mặt trước" />
                {(reapplyDocument.docType === "b2License" ||
                  reapplyDocument.docType === "cccd") && (
                  <UploadPlaceholder label="Chụp ảnh mặt sau" />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReapplyDocument(null)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    console.log("Reapplying document:", reapplyDocument);
                    setReapplyDocument(null);
                  }}
                >
                  Nộp lại
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

function UploadPlaceholder({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 text-center text-sm text-muted-foreground">
        <AlertTriangle className="mb-3 size-8 text-muted-foreground/60" />
        Nhấp để chọn ảnh hoặc kéo thả vào đây
        <input type="file" accept="image/*" className="hidden" />
      </div>
    </div>
  );
}
