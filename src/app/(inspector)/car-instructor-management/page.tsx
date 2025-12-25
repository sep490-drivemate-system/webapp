"use client";

import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  XCircle,
} from "lucide-react";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import {
  getCarDocumentsForInspector,
  getCars,
  moderateCarForInspector,
} from "@/features/car/carThunk";
import {
  CarDocuments,
  ICar,
  PaginatedCarsResponse,
} from "@/types/car/car.type";
import { CarStatus } from "@/types/constants/enum";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Helper function để normalize và xử lý trạng thái xe từ API
const getCarStatusInfo = (status: CarStatus | string) => {
  const statusStr = status?.toString().toLowerCase() || "";

  // Kiểm tra các trường hợp có thể xảy ra từ API
  if (
    statusStr === CarStatus.Approved.toLowerCase() ||
    statusStr === "approved" ||
    statusStr === "approve"
  ) {
    return {
      label: "Đã duyệt",
      className: "bg-green-50 text-green-700 border border-green-200",
      statusType: "approved" as const,
    };
  }
  if (
    statusStr === CarStatus.Pending.toLowerCase() ||
    statusStr === "pending"
  ) {
    return {
      label: "Chờ duyệt",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      statusType: "pending" as const,
    };
  }
  if (
    statusStr === CarStatus.Rejected.toLowerCase() ||
    statusStr === "rejected" ||
    statusStr === "reject"
  ) {
    return {
      label: "Từ chối",
      className: "bg-red-50 text-red-700 border border-red-200",
      statusType: "rejected" as const,
    };
  }
  // Fallback: hiển thị giá trị gốc nếu không khớp
  return {
    label: status?.toString() || "Không xác định",
    className: "bg-gray-50 text-gray-700 border border-gray-200",
    statusType: "unknown" as const,
  };
};
interface CarDetailModalProps {
  car: ICar | null;
  carDocuments: CarDocuments[] | null;
  loadingDocuments: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CarDetailModal({
  car,
  carDocuments,
  loadingDocuments,
  open,
  onOpenChange,
}: CarDetailModalProps) {
  if (!car) return null;

  const registrationDoc = carDocuments?.find((doc) =>
    doc.documentType?.toLowerCase().includes("registration")
  );
  const insuranceDoc = carDocuments?.find((doc) =>
    doc.documentType?.toLowerCase().includes("insurance")
  );
  const hasDocuments = Boolean(registrationDoc || insuranceDoc);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Chi tiết xe - {car.brand} {car.modelName} - {car.license_plate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-6">
          {car.thumbnailUrl && (
            <div className="rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={car.thumbnailUrl}
                alt={`${car.brand} ${car.modelName}`}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-2">
            <InfoItem label="Hãng xe" value={car.brand} />
            <InfoItem label="Model" value={car.modelName} />
            <InfoItem label="Số chỗ ngồi" value={`${car.seatCounts} chỗ`} />
            <InfoItem
              label="Giá thuê/giờ"
              value={`${car.price.toLocaleString("vi-VN")} VND`}
            />
            <InfoItem label="Nhiên liệu" value={car.fuel} />
            <InfoItem label="Loại xe" value={car.vehicleType} />
            <InfoItem label="Hạng bằng lái" value={car.licenseTier} />
          </div>

          <div className="space-y-4 rounded-lg border bg-muted/30 p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-foreground">
                Tài liệu xe
              </h4>
              {loadingDocuments && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải...
                </div>
              )}
            </div>

            {hasDocuments ? (
              <div className="space-y-6">
                {registrationDoc && (
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">
                      Giấy đăng ký xe
                    </Label>
                    <ImagePair
                      firstLabel="ẢNH MẶT TRƯỚC"
                      firstSrc={registrationDoc.frontImageUrl ?? null}
                      secondLabel="ẢNH MẶT SAU"
                      secondSrc={registrationDoc.backImageUrl ?? null}
                    />
                  </div>
                )}

                {insuranceDoc && (
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">
                      Bảo hiểm xe
                    </Label>
                    <ImagePair
                      firstLabel="ẢNH MẶT TRƯỚC"
                      firstSrc={insuranceDoc.frontImageUrl ?? null}
                      secondLabel="ẢNH MẶT SAU"
                      secondSrc={insuranceDoc.backImageUrl ?? null}
                    />
                  </div>
                )}
              </div>
            ) : !loadingDocuments ? (
              <p className="text-sm text-muted-foreground">
                Chưa có tài liệu cho xe này.
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
      {children || <p className="text-sm font-medium">{value}</p>}
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

interface CarRowProps {
  car: ICar;
  orderNumber: number;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function CarRow({
  car,
  orderNumber,
  onView,
  onApprove,
  onReject,
}: CarRowProps) {
  const statusInfo = getCarStatusInfo(car.status);

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/50">
      <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
        {orderNumber}
      </td>
      <td className="px-4 py-3 text-sm font-medium">{car.brand}</td>
      <td className="px-4 py-3 text-sm">{car.modelName}</td>
      <td className="px-4 py-3 text-sm">{car.seatCounts} chỗ</td>
      <td className="px-4 py-3 text-sm">
        {car.price.toLocaleString("vi-VN")} VND
      </td>
      <td className="px-4 py-3">
        <Badge
          className={`${statusInfo.className} px-3 py-1 text-xs font-medium`}
        >
          {statusInfo.label}
        </Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Thao tác">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onView}>
                <Eye className="mr-2 size-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {getCarStatusInfo(car.status).statusType === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onApprove}
                    className="text-emerald-600"
                  >
                    <CheckCircle className="mr-2 size-4" />
                    Duyệt xe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onReject} className="text-red-600">
                    <XCircle className="mr-2 size-4" />
                    Từ chối xe
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

export default function ReviewerCarDocumentsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | CarStatus.Approved | CarStatus.Pending | CarStatus.Rejected
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [carDocuments, setCarDocuments] = useState<CarDocuments[] | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [actioningCarId, setActioningCarId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [moderateError, setModerateError] = useState<string | null>(null);

  const { run: fetchCars, loading } = useThunkAction(getCars);
  const { run: fetchCarDocuments, loading: loadingDocuments } = useThunkAction(
    getCarDocumentsForInspector
  );
  const { run: moderateCar, loading: moderating } = useThunkAction(
    moderateCarForInspector
  );

  useEffect(() => {
    setError(null);
    fetchCars(
      {
        page: currentPage,
        size: itemsPerPage,
        brand: searchTerm.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      },
      {
        onSuccess: (res) => {
          const response = res?.value as PaginatedCarsResponse | undefined;
          if (response) {
            setCars(response.pageContent ?? []);
            setTotalCount(response.totalCount ?? 0);
          } else {
            setCars([]);
            setTotalCount(0);
          }
        },
        onError: () => {
          setCars([]);
          setTotalCount(0);
          setError("Không thể tải danh sách xe. Vui lòng thử lại.");
        },
      }
    );
  }, [fetchCars, currentPage, itemsPerPage, searchTerm, statusFilter]);

  const filteredCars = useMemo(() => cars, [cars]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const stats = useMemo(() => {
    return {
      total: totalCount,
      pending: cars.filter(
        (c) => getCarStatusInfo(c.status).statusType === "pending"
      ).length,
      approved: cars.filter(
        (c) => getCarStatusInfo(c.status).statusType === "approved"
      ).length,
      rejected: cars.filter(
        (c) => getCarStatusInfo(c.status).statusType === "rejected"
      ).length,
    };
  }, [cars, totalCount]);

  const handleApprove = (id: string) => {
    setActioningCarId(id);
    setActionType("approve");
  };

  const handleReject = (id: string) => {
    setActioningCarId(id);
    setActionType("reject");
  };

  const confirmAction = () => {
    if (actioningCarId === null || !actionType) return;

    setModerateError(null);
    const action = actionType === "approve" ? "approve" : "decline";

    moderateCar(
      {
        id: actioningCarId,
        action: action,
      },
      {
        onSuccess: () => {
          fetchCars(
            {
              page: currentPage,
              size: itemsPerPage,
            },
            {
              onSuccess: (res) => {
                const response = res?.value as
                  | PaginatedCarsResponse
                  | undefined;
                if (response) {
                  setCars(response.pageContent ?? []);
                  setTotalCount(response.totalCount ?? 0);
                }
              },
              onError: () => {
                setError("Không thể tải lại danh sách xe.");
              },
            }
          );
          setActioningCarId(null);
          setActionType(null);
        },
        onError: (err) => {
          setModerateError(
            actionType === "approve"
              ? "Không thể duyệt xe. Vui lòng thử lại."
              : "Không thể từ chối xe. Vui lòng thử lại."
          );
          console.error("Moderate car error:", err);
        },
      }
    );
  };

  const handleView = (car: ICar) => {
    setSelectedCar(car);
    setShowDocumentModal(true);
    setCarDocuments(null);
    fetchCarDocuments(
      { id: car.id },
      {
        onSuccess: (res) => {
          const docs = (res?.value as CarDocuments[] | undefined) ?? [];
          setCarDocuments(docs);
        },
        onError: () => {
          setCarDocuments([]);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Duyệt Tài Liệu Xe"
        description="Kiểm tra, duyệt hoặc từ chối tài liệu xe do giảng viên gửi lên."
        className="space-y-4"
      />
      <Card className="rounded-3xl border bg-background shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Tổng xe"
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
          )}
        </CardContent>
      </Card>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo hãng xe..."
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as
                  | "all"
                  | CarStatus.Pending
                  | CarStatus.Approved
                  | CarStatus.Rejected
              )
            }
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value={CarStatus.Pending}>Chờ duyệt</SelectItem>
              <SelectItem value={CarStatus.Approved}>Đã duyệt</SelectItem>
              <SelectItem value={CarStatus.Rejected}>Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="overflow-x-auto rounded-2xl border">
          <Table className="w-full text-left text-sm">
            <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <TableRow>
                <TableHead className="px-4 py-3 font-semibold">STT</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Hãng xe
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">Model</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Số chỗ ngồi
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Giá/giờ
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredCars.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    Không tìm thấy xe phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCars.map((car, index) => (
                  <CarRow
                    key={car.id}
                    car={car}
                    orderNumber={(currentPage - 1) * itemsPerPage + index + 1}
                    onView={() => handleView(car)}
                    onApprove={() => handleApprove(car.id)}
                    onReject={() => handleReject(car.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Hiển thị {filteredCars.length}/{totalCount} xe.
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
                Trang {currentPage}/{totalPages}
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

      <CarDetailModal
        car={selectedCar}
        carDocuments={carDocuments}
        loadingDocuments={loadingDocuments}
        open={showDocumentModal}
        onOpenChange={(open) => {
          setShowDocumentModal(open);
          if (!open) {
            setCarDocuments(null);
          }
        }}
      />

      <AlertDialog
        open={actioningCarId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActioningCarId(null);
            setActionType(null);
            setModerateError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? "Bạn có chắc chắn muốn duyệt xe này?"
                : "Bạn có chắc chắn muốn từ chối xe này?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {moderateError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {moderateError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={moderating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className={
                actionType === "approve"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              onClick={confirmAction}
              disabled={moderating}
            >
              {moderating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : actionType === "approve" ? (
                "Duyệt"
              ) : (
                "Từ chối"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
