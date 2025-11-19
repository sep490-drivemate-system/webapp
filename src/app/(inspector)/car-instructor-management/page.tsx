"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VehicleDocument {
  id: number;
  instructorId: number;
  instructorName: string;
  phoneNumber: string;
  email: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: {
    inspection: {
      frontImage: string | null;
      backImage: string | null;
      issueDate: string | null;
      expirationDate: string | null;
    };
    insurance: {
      frontImage: string | null;
      backImage: string | null;
      issueDate: string | null;
      expirationDate: string | null;
    };
    registration: {
      frontImage: string | null;
      backImage: string | null;
      ownerName: string | null;
      licensePlate: string | null;
      vehicleBrand: string | null;
      vehicleModel: string | null;
      seats: number | null;
      issueDate: string | null;
      fuelType: string | null;
      hourlyRentalPrice: number | null;
    };
    verification: {
      frontView: string | null;
      backView: string | null;
      sideView: string | null;
      interiorView: string | null;
    };
  };
  rejectionReason?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const mockDocuments: VehicleDocument[] = [
  {
    id: 1,
    instructorId: 101,
    instructorName: "Nguyễn Văn A",
    phoneNumber: "0912345678",
    email: "nguyena@example.com",
    vehicleBrand: "Toyota",
    vehicleModel: "Vios",
    licensePlate: "51A-123.45",
    submittedDate: "2025-01-18",
    status: "pending",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: "/inspection-back.jpg",
        issueDate: "2023-05-15",
        expirationDate: "2025-05-15",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-06-01",
        expirationDate: "2025-06-01",
      },
      registration: {
        frontImage: "/registration-front.jpg",
        backImage: "/registration-back.jpg",
        ownerName: "Nguyễn Văn A",
        licensePlate: "51A-123.45",
        vehicleBrand: "Toyota",
        vehicleModel: "Vios",
        seats: 5,
        issueDate: "2022-03-20",
        fuelType: "Xăng",
        hourlyRentalPrice: 150000,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: "/car-side-view.png",
        interiorView: "/modern-car-interior.png",
      },
    },
  },
  {
    id: 2,
    instructorId: 102,
    instructorName: "Trần Thị B",
    phoneNumber: "0987654321",
    email: "tranb@example.com",
    vehicleBrand: "Honda",
    vehicleModel: "Accord",
    licensePlate: "51B-456.78",
    submittedDate: "2025-01-16",
    status: "pending",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: "/inspection-back.jpg",
        issueDate: "2023-07-10",
        expirationDate: "2025-07-10",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-08-05",
        expirationDate: "2025-08-05",
      },
      registration: {
        frontImage: "/registration-front.jpg",
        backImage: "/registration-back.jpg",
        ownerName: "Trần Thị B",
        licensePlate: "51B-456.78",
        vehicleBrand: "Honda",
        vehicleModel: "Accord",
        seats: 5,
        issueDate: "2021-09-12",
        fuelType: "Xăng",
        hourlyRentalPrice: 180000,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: "/car-side-view.png",
        interiorView: "/modern-car-interior.png",
      },
    },
  },
  {
    id: 3,
    instructorId: 103,
    instructorName: "Lê Minh C",
    phoneNumber: "0911111111",
    email: "leminc@example.com",
    vehicleBrand: "BMW",
    vehicleModel: "3 Series",
    licensePlate: "51C-789.01",
    submittedDate: "2025-01-14",
    status: "approved",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: "/inspection-back.jpg",
        issueDate: "2023-04-22",
        expirationDate: "2025-04-22",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-05-10",
        expirationDate: "2025-05-10",
      },
      registration: {
        frontImage: "/registration-front.jpg",
        backImage: "/registration-back.jpg",
        ownerName: "Lê Minh C",
        licensePlate: "51C-789.01",
        vehicleBrand: "BMW",
        vehicleModel: "3 Series",
        seats: 5,
        issueDate: "2020-11-08",
        fuelType: "Xăng",
        hourlyRentalPrice: 250000,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: "/car-side-view.png",
        interiorView: "/modern-car-interior.png",
      },
    },
  },
  {
    id: 4,
    instructorId: 104,
    instructorName: "Phạm Đức D",
    phoneNumber: "0922222222",
    email: "phamd@example.com",
    vehicleBrand: "Kia",
    vehicleModel: "Cerato",
    licensePlate: "51D-234.56",
    submittedDate: "2025-01-20",
    status: "pending",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: null,
        issueDate: "2023-09-18",
        expirationDate: "2025-09-18",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-10-03",
        expirationDate: "2025-10-03",
      },
      registration: {
        frontImage: null,
        backImage: null,
        ownerName: null,
        licensePlate: null,
        vehicleBrand: null,
        vehicleModel: null,
        seats: null,
        issueDate: null,
        fuelType: null,
        hourlyRentalPrice: null,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: null,
        interiorView: "/modern-car-interior.png",
      },
    },
  },
  {
    id: 5,
    instructorId: 105,
    instructorName: "Đặng Hoàng E",
    phoneNumber: "0933333333",
    email: "danghoanged@example.com",
    vehicleBrand: "Mazda",
    vehicleModel: "3",
    licensePlate: "51E-567.89",
    submittedDate: "2025-01-12",
    status: "rejected",
    rejectionReason: "Giấy đăng ký xe hết hạn",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: "/inspection-back.jpg",
        issueDate: "2023-02-14",
        expirationDate: "2024-02-14",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-03-01",
        expirationDate: "2024-03-01",
      },
      registration: {
        frontImage: "/registration-front.jpg",
        backImage: "/registration-back.jpg",
        ownerName: "Đặng Hoàng E",
        licensePlate: "51E-567.89",
        vehicleBrand: "Mazda",
        vehicleModel: "3",
        seats: 5,
        issueDate: "2020-01-22",
        fuelType: "Xăng",
        hourlyRentalPrice: 160000,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: "/car-side-view.png",
        interiorView: "/modern-car-interior.png",
      },
    },
  },
  {
    id: 6,
    instructorId: 106,
    instructorName: "Hoàng Thế F",
    phoneNumber: "0944444444",
    email: "hoangf@example.com",
    vehicleBrand: "Hyundai",
    vehicleModel: "Elantra",
    licensePlate: "51F-890.12",
    submittedDate: "2025-01-10",
    status: "approved",
    documents: {
      inspection: {
        frontImage: "/inspection-front.jpg",
        backImage: "/inspection-back.jpg",
        issueDate: "2023-11-09",
        expirationDate: "2025-11-09",
      },
      insurance: {
        frontImage: "/insurance-front.jpg",
        backImage: "/insurance-back.jpg",
        issueDate: "2023-12-15",
        expirationDate: "2025-12-15",
      },
      registration: {
        frontImage: "/registration-front.jpg",
        backImage: "/registration-back.jpg",
        ownerName: "Hoàng Thế F",
        licensePlate: "51F-890.12",
        vehicleBrand: "Hyundai",
        vehicleModel: "Elantra",
        seats: 5,
        issueDate: "2019-07-30",
        fuelType: "Xăng",
        hourlyRentalPrice: 140000,
      },
      verification: {
        frontView: "/car-front-view.png",
        backView: "/car-back-view.jpg",
        sideView: "/car-side-view.png",
        interiorView: "/modern-car-interior.png",
      },
    },
  },
];

interface DocumentViewerModalProps {
  document: VehicleDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DocumentViewerModal({
  document,
  open,
  onOpenChange,
}: DocumentViewerModalProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài liệu</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {document.vehicleBrand} {document.vehicleModel} -{" "}
            {document.licensePlate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pb-6">
          <div className="grid gap-4 rounded-lg border bg-muted/30 p-5 sm:grid-cols-2">
            <InfoItem label="Người hướng dẫn" value={document.instructorName} />
            <InfoItem
              label="Ngày nộp"
              value={formatDate(document.submittedDate)}
            />
            <InfoItem label="Số điện thoại" value={document.phoneNumber}>
              <a href={`tel:${document.phoneNumber}`} className="text-primary">
                {document.phoneNumber}
              </a>
            </InfoItem>
            <InfoItem label="Email" value={document.email}>
              <a
                href={`mailto:${document.email}`}
                className="text-primary break-all"
              >
                {document.email}
              </a>
            </InfoItem>
          </div>

          <InspectionDocumentSection document={document} />
          <InsuranceDocumentSection document={document} />
          <RegistrationDocumentSection document={document} />
          <VerificationImagesSection document={document} />

          {document.status === "rejected" && document.rejectionReason && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="text-sm font-semibold text-destructive">
                Lý do từ chối
              </h4>
              <p className="text-sm text-destructive">
                {document.rejectionReason}
              </p>
            </div>
          )}
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

function SectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function InspectionDocumentSection({
  document,
}: {
  document: VehicleDocument;
}) {
  const { inspection } = document.documents;
  return (
    <SectionShell title="Giấy đăng kiểm xe">
      <ImagePair
        firstLabel="Ảnh mặt trước"
        firstSrc={inspection.frontImage}
        secondLabel="Ảnh mặt sau"
        secondSrc={inspection.backImage}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoItem
          label="Ngày cấp"
          value={inspection.issueDate ?? "Chưa cập nhật"}
        />
        <InfoItem
          label="Ngày hết hạn"
          value={inspection.expirationDate ?? "Chưa cập nhật"}
        />
      </div>
    </SectionShell>
  );
}

function InsuranceDocumentSection({ document }: { document: VehicleDocument }) {
  const { insurance } = document.documents;
  return (
    <SectionShell title="Bảo hiểm xe">
      <ImagePair
        firstLabel="Ảnh mặt trước"
        firstSrc={insurance.frontImage}
        secondLabel="Ảnh mặt sau"
        secondSrc={insurance.backImage}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoItem
          label="Ngày cấp"
          value={insurance.issueDate ?? "Chưa cập nhật"}
        />
        <InfoItem
          label="Ngày hết hạn"
          value={insurance.expirationDate ?? "Chưa cập nhật"}
        />
      </div>
    </SectionShell>
  );
}

function RegistrationDocumentSection({
  document,
}: {
  document: VehicleDocument;
}) {
  const { registration } = document.documents;
  return (
    <SectionShell title="Giấy đăng ký xe">
      <ImagePair
        firstLabel="Ảnh mặt trước"
        firstSrc={registration.frontImage}
        secondLabel="Ảnh mặt sau"
        secondSrc={registration.backImage}
      />

      <div className="rounded-lg border bg-muted/20 p-4">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Thông tin chủ sở hữu
        </Label>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Họ và tên"
            value={registration.ownerName ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Biển số xe"
            value={registration.licensePlate ?? "Chưa cập nhật"}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Thông tin xe
        </Label>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label="Tên hãng xe"
            value={registration.vehicleBrand ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Tên mẫu xe"
            value={registration.vehicleModel ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Số chỗ ngồi"
            value={registration.seats?.toString() ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Ngày cấp"
            value={registration.issueDate ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Loại nhiên liệu"
            value={registration.fuelType ?? "Chưa cập nhật"}
          />
          <InfoItem
            label="Giá thuê theo giờ"
            value={
              registration.hourlyRentalPrice
                ? `${registration.hourlyRentalPrice.toLocaleString()} VND`
                : "Chưa cập nhật"
            }
          />
        </div>
      </div>
    </SectionShell>
  );
}

function VerificationImagesSection({
  document,
}: {
  document: VehicleDocument;
}) {
  const { verification } = document.documents;
  return (
    <SectionShell title="Ảnh xác minh xe">
      <div className="grid gap-4 md:grid-cols-2">
        <ImageTile label="Ảnh phía trước" src={verification.frontView} />
        <ImageTile label="Ảnh phía sau" src={verification.backView} />
        <ImageTile label="Ảnh bên hông" src={verification.sideView} />
        <ImageTile label="Ảnh nội thất" src={verification.interiorView} />
      </div>
    </SectionShell>
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

interface DocumentRowProps {
  document: VehicleDocument;
  orderNumber: number;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function DocumentRow({
  document,
  orderNumber,
  onView,
  onApprove,
  onReject,
}: DocumentRowProps) {
  const statusStyles =
    document.status === "pending"
      ? "bg-amber-50 text-amber-700"
      : document.status === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700";

  const statusLabel =
    document.status === "pending"
      ? "Chờ duyệt"
      : document.status === "approved"
      ? "Đã duyệt"
      : "Từ chối";

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/50">
      <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
        {orderNumber}
      </td>
      <td className="px-4 py-3 text-sm font-medium">
        {document.instructorName}
      </td>
      <td className="px-4 py-3 text-sm">
        <a
          href={`tel:${document.phoneNumber}`}
          className="flex items-center gap-1 text-primary"
        >
          {document.phoneNumber}
        </a>
      </td>
      <td className="px-4 py-3 text-sm">
        <a
          href={`mailto:${document.email}`}
          className="break-all text-primary underline"
        >
          {document.email}
        </a>
      </td>
      <td className="px-4 py-3 text-sm">
        {formatDate(document.submittedDate)}
      </td>
      <td className="px-4 py-3">
        <Badge className={`${statusStyles} px-3 py-1 text-xs`}>
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Xem tài liệu"
            onClick={onView}
          >
            <Eye className="size-4" />
          </Button>
          {document.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                aria-label="Duyệt tài liệu"
                onClick={onApprove}
              >
                <CheckCircle className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-red-200 text-red-600 hover:bg-red-50"
                aria-label="Từ chối tài liệu"
                onClick={onReject}
              >
                <XCircle className="size-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ReviewerCarDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<VehicleDocument[]>(mockDocuments);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] =
    useState<VehicleDocument | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [actioningDocumentId, setActioningDocumentId] = useState<number | null>(
    null
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedDocuments = useMemo(
    () =>
      [...documents].sort(
        (a, b) =>
          new Date(b.submittedDate).getTime() -
          new Date(a.submittedDate).getTime()
      ),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    return sortedDocuments.filter((doc) => {
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      const matchesSearch =
        doc.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.phoneNumber.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [sortedDocuments, statusFilter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const stats = useMemo(
    () => ({
      total: documents.length,
      pending: documents.filter((d) => d.status === "pending").length,
      approved: documents.filter((d) => d.status === "approved").length,
      rejected: documents.filter((d) => d.status === "rejected").length,
    }),
    [documents]
  );

  const handleApprove = (id: number) => {
    setActioningDocumentId(id);
    setActionType("approve");
  };

  const handleReject = (id: number) => {
    setActioningDocumentId(id);
    setActionType("reject");
  };

  const confirmAction = () => {
    if (actioningDocumentId === null || !actionType) return;
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === actioningDocumentId
          ? {
              ...doc,
              status: actionType === "approve" ? "approved" : "rejected",
            }
          : doc
      )
    );
    setActioningDocumentId(null);
    setActionType(null);
  };

  const handleView = (document: VehicleDocument) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-background shadow-sm">
        <CardHeader className="space-y-4 border-b bg-muted/20 p-6">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Duyệt tài liệu xe
            </CardTitle>
            <CardDescription>
              Kiểm tra, duyệt hoặc từ chối tài liệu xe do giảng viên gửi lên.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Tổng xe"
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
              placeholder="Tìm theo tên, số điện thoại hoặc biển số..."
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
          <Table className="w-full text-left text-sm">
            <TableHeader className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <TableRow>
                <TableHead className="px-4 py-3 font-semibold">STT</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Người hướng dẫn
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Điện thoại
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">Email</TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Ngày nộp
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    Không tìm thấy tài liệu phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDocuments.map((document, index) => (
                  <DocumentRow
                    key={document.id}
                    document={document}
                    orderNumber={startIndex + index + 1}
                    onView={() => handleView(document)}
                    onApprove={() => handleApprove(document.id)}
                    onReject={() => handleReject(document.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground sm:text-sm">
            Hiển thị {paginatedDocuments.length}/{filteredDocuments.length} tài
            liệu.
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

      <DocumentViewerModal
        document={selectedDocument}
        open={showDocumentModal}
        onOpenChange={setShowDocumentModal}
      />

      <AlertDialog
        open={actioningDocumentId !== null}
        onOpenChange={(open) => !open && setActioningDocumentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? "Bạn có chắc chắn muốn duyệt tài liệu này?"
                : "Bạn có chắc chắn muốn từ chối tài liệu này?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className={
                actionType === "approve"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              onClick={confirmAction}
            >
              {actionType === "approve" ? "Duyệt" : "Từ chối"}
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
