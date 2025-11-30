"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TermsList } from "@/components/terms-and-services/terms-list";
import { TermsFormModal } from "@/components/terms-and-services/terms-form-modal";
import PageHeader from "@/components/commons/Header/header";
import { Plus } from "lucide-react";

interface Term {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

// Mock data
const initialTerms: Term[] = [
  {
    id: "1",
    title: "Chính sách hủy lịch",
    description:
      "Khách hàng có thể hủy lịch trước 24 giờ mà không mất phí. Hủy trong vòng 24 giờ sẽ tính 50% phí dịch vụ.",
    type: "1",
    createdAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Yêu cầu về tài liệu tài chính",
    description:
      "Người lái mới phải nộp giấy phép lái xe hợp lệ và bằng cấp chứng chỉ lái xe. Tất cả tài liệu phải được xác thực bởi cơ quan chính phủ.",
    type: "1",
    createdAt: "2025-01-01T10:05:00.000Z",
  },
  {
    id: "3",
    title: "Quy tắc an toàn khi lái xe",
    description:
      "Người lái mới phải tuân thủ tất cả các quy luật giao thông. Đeo dây an toàn, không sử dụng điện thoại khi lái, giữ tốc độ hợp pháp.",
    type: "1",
    createdAt: "2025-01-01T10:10:00.000Z",
  },
  {
    id: "4",
    title: "Quyền và trách nhiệm của người hướng dẫn",
    description:
      "Người hướng dẫn có trách nhiệm giám sát an toàn của người lái. Có quyền yêu cầu dừng lại bất cứ lúc nào nếu thấy nguy hiểm. Phải có bằng cấp hướng dẫn lái xe được công nhân.",
    type: "2",
    createdAt: "2025-01-01T10:15:00.000Z",
  },
  {
    id: "5",
    title: "Mức lương và thanh toán cho người hướng dẫn",
    description:
      "Người hướng dẫn sẽ nhận 80% lệ phí hướng dẫn. Thanh toán được thực hiện hàng tuần vào thứ Sáu. Cần cung cấp thông tin ngân hàng để nhận tiền.",
    type: "2",
    createdAt: "2025-01-01T10:20:00.000Z",
  },
  {
    id: "6",
    title: "Bảo hiểm và bảo vệ người hướng dẫn",
    description:
      "Công ty bảo vệ toàn bộ bảo hiểm trách nhiệm dân sự. Nếu xảy ra tai nạn, người hướng dẫn sẽ được hỗ trợ y tế. Yêu cầu báo cáo sự cố trong vòng 24 giờ.",
    type: "2",
    createdAt: "2025-01-01T10:25:00.000Z",
  },
];

export default function AdminTermsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | undefined>();
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (term: Term) => {
    setSelectedTerm(term);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTerm(undefined);
    setModalOpen(true);
  };

  const handleSubmit = async (termData: Omit<Term, "id" | "createdAt">) => {
    setLoading(true);
    try {
      if (selectedTerm) {
        const response = await fetch("/api/terms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedTerm.id,
            ...termData,
          }),
        });
        if (!response.ok) throw new Error("Failed to update");
      } else {
        const response = await fetch("/api/terms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(termData),
        });
        if (!response.ok) throw new Error("Failed to create");
      }

      setModalOpen(false);
      setSelectedTerm(undefined);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving term:", error);
      alert("Lỗi khi lưu điều khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <PageHeader
          title="Quản lý Điều khoản & Dịch vụ"
          description="Tạo, chỉnh sửa và quản lý các điều khoản dịch vụ"
          actionButton={{
            label: "Tạo điều khoản mới",
            onClick: handleCreateNew,
            icon: Plus,
          }}
          className="mb-6"
        />

        <Card className="p-6">
          <TermsList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        </Card>

        <TermsFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          term={selectedTerm}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
