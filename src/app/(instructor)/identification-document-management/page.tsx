"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageHeader from "@/components/commons/Header/header";

interface DocumentField {
  label: string;
  value: string;
}

interface DocumentFile {
  label: string;
  imageUrl: string | null;
}

interface DocumentRecord {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  reviewer?: string;
  fields: DocumentField[];
  files: DocumentFile[];
}

const userProfile = {
  fullName: "Nguyễn Văn An",
  email: "an.nguyen@example.com",
  phone: "0901 234 567",
  emergencyContact: {
    name: "Trần Thị Bình",
    phone: "0912 345 678",
  },
};

const mockDocumentRecords: DocumentRecord[] = [
  {
    id: "citizenId",
    title: "Căn Cước Công Dân",
    description:
      "Thông tin nhận dạng bắt buộc để xác thực tài khoản người hướng dẫn.",
    updatedAt: "20/10/2024 - 14:32",
    fields: [
      { label: "Họ và tên", value: "Nguyễn Văn An" },
      { label: "Ngày sinh", value: "12/03/1992" },
      { label: "Giới tính", value: "Nam" },
    ],
    files: [],
  },
  {
    id: "legalHistory",
    title: "Lý Lịch Tư Pháp",
    description: "Giấy xác nhận không có tiền án tiền sự trong vòng 06 tháng.",
    updatedAt: "18/10/2024 - 09:10",
    fields: [],
    files: [
      {
        label: "Ảnh lý lịch tư pháp",
        imageUrl: "/images/mock/legal-history.jpg",
      },
    ],
  },
  {
    id: "healthCertificate",
    title: "Giấy Khám Sức Khỏe",
    description: "Bản khám sức khỏe tổng quát đủ điều kiện lái xe.",
    updatedAt: "05/11/2024 - 16:48",
    fields: [],
    files: [
      {
        label: "Ảnh giấy khám sức khỏe",
        imageUrl: "/images/mock/health-check.jpg",
      },
    ],
  },
  {
    id: "driverLicense",
    title: "Bằng Lái Xe",
    description: "Bản sao bằng lái xe hiện hành của người hướng dẫn.",
    updatedAt: "12/10/2024 - 11:05",
    fields: [{ label: "Hạng bằng lái", value: "B2" }],
    files: [
      {
        label: "Ảnh mặt trước",
        imageUrl: "/images/mock/driver-license-front.jpg",
      },
      {
        label: "Ảnh mặt sau",
        imageUrl: "/images/mock/driver-license-back.jpg",
      },
    ],
  },
  {
    id: "trainingCertificate",
    title: "Chứng Chỉ Hành Nghề",
    description:
      "Chứng chỉ đào tạo nghiệp vụ đảm bảo chuyên môn giảng dạy lái xe.",
    updatedAt: "25/09/2024 - 08:20",
    fields: [{ label: "Hạng lái xe giảng dạy", value: "B2 nâng cao" }],
    files: [
      {
        label: "Ảnh chứng chỉ hành nghề",
        imageUrl: "/images/mock/training-cert.jpg",
      },
    ],
  },
];

export default function IdentificationDocumentManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Quản Lý Tài Liệu Cá Nhân"
        description="Xem lại toàn bộ tài liệu đã tải lên và trạng thái xét duyệt"
      />

      {/* User profile & emergency contact */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border/60">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Thông tin được sử dụng để xác minh hồ sơ người hướng dẫn.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Họ và tên" value={userProfile.fullName} />
            <InfoItem label="Email" value={userProfile.email} />
            <InfoItem label="Số điện thoại" value={userProfile.phone} />
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>Liên hệ khẩn cấp</CardTitle>
            <CardDescription>
              Sử dụng trong trường hợp cần liên lạc gấp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              label="Tên người liên hệ"
              value={userProfile.emergencyContact.name}
            />
            <InfoItem
              label="Số điện thoại"
              value={userProfile.emergencyContact.phone}
            />
          </CardContent>
        </Card>
      </section>

      {/* Document detail cards */}
      <section className="space-y-6">
        {mockDocumentRecords.map((record) => {
          return (
            <Card key={record.id} className="border-border">
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-xl text-foreground">
                    {record.title}
                  </CardTitle>
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
                      <figure
                        key={file.label}
                        className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-3"
                      >
                        <figcaption className="text-sm font-semibold text-foreground">
                          {file.label}
                        </figcaption>
                        {file.imageUrl ? (
                          <img
                            src={file.imageUrl}
                            alt={file.label}
                            className="h-48 w-full rounded-lg object-cover border border-border/60"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                            Chưa cung cấp ảnh
                          </div>
                        )}
                      </figure>
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

                {/* Notes removed as per requirement */}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-lg border border-border/60 p-3 bg-white">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}
