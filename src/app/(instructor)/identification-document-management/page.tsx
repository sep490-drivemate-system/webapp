"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DocumentStatus = "approved" | "pending" | "rejected";

interface DocumentField {
  label: string;
  value: string;
}

interface DocumentFile {
  label: string;
  fileName: string;
  note?: string;
}

interface DocumentRecord {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  updatedAt: string;
  reviewer?: string;
  notes?: string;
  fields: DocumentField[];
  files: DocumentFile[];
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Bị từ chối",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
};

const mockDocumentRecords: DocumentRecord[] = [
  {
    id: "citizenId",
    title: "Căn Cước Công Dân",
    description:
      "Thông tin nhận dạng bắt buộc để xác thực tài khoản người hướng dẫn.",
    status: "approved",
    updatedAt: "20/10/2024 - 14:32",
    reviewer: "Nguyễn Văn B",
    fields: [
      { label: "Số CCCD", value: "079203001234" },
      { label: "Giới tính", value: "Nam" },
      { label: "Ngày sinh", value: "12/03/1992" },
      { label: "Ngày cấp", value: "08/08/2021" },
      { label: "Ngày hết hạn", value: "08/08/2031" },
      { label: "Nơi cấp", value: "Công an TP. Hồ Chí Minh" },
      {
        label: "Địa chỉ thường trú",
        value: "123 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh",
      },
    ],
    files: [
      { label: "Ảnh mặt trước", fileName: "cccd_front.png" },
      { label: "Ảnh mặt sau", fileName: "cccd_back.png" },
    ],
  },
  {
    id: "legalHistory",
    title: "Lý Lịch Tư Pháp",
    description: "Giấy xác nhận không có tiền án tiền sự trong vòng 06 tháng.",
    status: "approved",
    updatedAt: "18/10/2024 - 09:10",
    reviewer: "Trần Thị C",
    fields: [
      { label: "Ngày cấp", value: "15/09/2024" },
      { label: "Số hồ sơ", value: "LLTP-45879" },
    ],
    files: [{ label: "Ảnh/Scan tài liệu", fileName: "legal_history.pdf" }],
  },
  {
    id: "healthCertificate",
    title: "Giấy Khám Sức Khỏe",
    description: "Bản khám sức khỏe tổng quát đủ điều kiện lái xe.",
    status: "pending",
    updatedAt: "05/11/2024 - 16:48",
    fields: [
      { label: "Ngày cấp", value: "01/11/2024" },
      { label: "Cơ sở y tế", value: "Bệnh viện Đa khoa Quốc tế" },
    ],
    files: [{ label: "Ảnh/Scan tài liệu", fileName: "suc_khoe.pdf" }],
    notes:
      "Chờ kiểm tra bổ sung chữ ký bác sĩ. Vui lòng theo dõi email nếu cần cập nhật.",
  },
  {
    id: "driverLicense",
    title: "Bằng Lái Xe",
    description: "Bản sao bằng lái xe hiện hành của người hướng dẫn.",
    status: "approved",
    updatedAt: "12/10/2024 - 11:05",
    reviewer: "Phạm Quang D",
    fields: [
      { label: "Hạng bằng lái", value: "B2" },
      { label: "Số GPLX", value: "790230045678" },
      { label: "Ngày cấp", value: "10/06/2020" },
      { label: "Ngày hết hạn", value: "10/06/2030" },
    ],
    files: [
      { label: "Ảnh mặt trước", fileName: "gplx_front.jpg" },
      { label: "Ảnh mặt sau", fileName: "gplx_back.jpg" },
    ],
  },
  {
    id: "trainingCertificate",
    title: "Chứng Chỉ Hành Nghề",
    description:
      "Chứng chỉ đào tạo nghiệp vụ đảm bảo chuyên môn giảng dạy lái xe.",
    status: "rejected",
    updatedAt: "25/09/2024 - 08:20",
    reviewer: "Lê Minh E",
    fields: [
      { label: "Lớp đào tạo", value: "B2 nâng cao" },
      { label: "Ngày cấp", value: "12/07/2022" },
      { label: "Đơn vị cấp", value: "Trung tâm Đào tạo Lái xe ABC" },
    ],
    files: [{ label: "Ảnh/Scan tài liệu", fileName: "training_cert.pdf" }],
    notes: "Ảnh mờ, đề nghị tải lại file chất lượng cao hơn.",
  },
];

export default function IdentificationDocumentManagementPage() {
  const router = useRouter();

  const summaryStats = useMemo(() => {
    const approved = mockDocumentRecords.filter(
      (doc) => doc.status === "approved"
    ).length;
    const pending = mockDocumentRecords.filter(
      (doc) => doc.status === "pending"
    ).length;
    const rejected = mockDocumentRecords.filter(
      (doc) => doc.status === "rejected"
    ).length;

    return [
      { label: "Tổng tài liệu", value: mockDocumentRecords.length },
      { label: "Đã duyệt", value: approved },
      { label: "Chờ duyệt", value: pending },
      { label: "Bị từ chối", value: rejected },
    ];
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <Card className="rounded-2xl border bg-white p-6 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl text-foreground">
                  Quản Lý Tài Liệu Cá Nhân
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Xem lại toàn bộ tài liệu đã tải lên và trạng thái xét duyệt
                </CardDescription>
              </div>
              <button
                onClick={() => router.push("/identification-document-upload")}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
              >
                <Plus size={18} />
                <span>Tải tài liệu cá nhân</span>
              </button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border-dashed border-muted">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wide">
                {stat.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Document detail cards */}
      <section className="space-y-6">
        {mockDocumentRecords.map((record) => {
          const status = statusConfig[record.status];

          return (
            <Card key={record.id} className="border-border">
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-xl text-foreground">
                    {record.title}
                  </CardTitle>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {record.description}
                </CardDescription>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Cập nhật lần cuối: {record.updatedAt}</span>
                  {record.reviewer && (
                    <span>Người duyệt: {record.reviewer}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Files */}
                {record.files.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {record.files.map((file) => (
                      <div
                        key={file.label}
                        className="rounded-lg border border-dashed border-border p-4 bg-muted/30"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {file.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.fileName || "Chưa cung cấp tệp"}
                        </p>
                        {file.note && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {file.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.fields.map((field) => (
                    <div
                      key={`${record.id}-${field.label}`}
                      className="rounded-lg border border-border p-4 bg-background"
                    >
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {field.label}
                      </p>
                      <p className="text-base font-semibold text-foreground mt-1">
                        {field.value || "—"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {record.notes && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    {record.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
