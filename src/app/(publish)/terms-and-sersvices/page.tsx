"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import TermsCard from "@/components/terms-and-services/term-card";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TermsItem {
  id: string;
  title: string;
  description: string;
  type: 1 | 2; // 1 = new driver, 2 = mentor
}

// Mock data - replace with API call
const mockTermsData: TermsItem[] = [
  {
    id: "1",
    title: "Tuân thủ luật giao thông",
    description:
      "Tất cả người dùng phải tuân thủ các quy định về giao thông bao gồm tốc độ, đèn giao thông, và các quy tắc an toàn trên đường.",
    type: 1,
  },
  {
    id: "2",
    title: "Bảo hiểm xe hợp lệ",
    description:
      "Bạn phải có bảo hiểm xe hợp lệ trước khi tham gia vào bất kỳ hoạt động lái xe nào trên nền tảng.",
    type: 1,
  },
  {
    id: "3",
    title: "Chịu trách nhiệm toàn bộ hành động",
    description:
      "Người lái mới chịu trách nhiệm toàn bộ hành động của mình trên đường. Người hướng dẫn không chịu trách nhiệm pháp lý.",
    type: 1,
  },
  {
    id: "4",
    title: "Không sử dụng điện thoại khi lái xe",
    description:
      "Không được sử dụng điện thoại di động hoặc thiết bị khác có thể gây xao lãng khi lái xe.",
    type: 1,
  },
  {
    id: "5",
    title: "Đăng ký và xác minh tài khoản",
    description:
      "Tất cả người hướng dẫn phải đăng ký tài khoản hợp lệ và cung cấp bằng lái xe hữu hiệu.",
    type: 2,
  },
  {
    id: "6",
    title: "Kinh nghiệm lái xe tối thiểu",
    description:
      "Người hướng dẫn phải có ít nhất 5 năm kinh nghiệm lái xe an toàn mà không có vi phạm giao thông nghiêm trọng.",
    type: 2,
  },
  {
    id: "7",
    title: "Hành vi chuyên nghiệp",
    description:
      "Người hướng dẫn phải duy trì hành vi chuyên nghiệp, lịch sự và giáo dục có hiệu quả cho người lái mới.",
    type: 2,
  },
  {
    id: "8",
    title: "Bảo mật dữ liệu cá nhân",
    description:
      "Không chia sẻ hoặc tiết lộ thông tin cá nhân của người lái mới cho bất kỳ bên thứ ba nào mà không có sự đồng ý.",
    type: 2,
  },
];

function TermsConditions() {
  const [userType, setUserType] = useState<1 | 2>(1);

  const filteredTerms = mockTermsData.filter((term) => term.type === userType);

  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <PageSectionHeader
          title="Điều Khoản & Dịch Vụ"
          description="Nền tảng bảo trợ tay lái cho người lái mới và người hướng dẫn"
        />

        {/* User Type Tabs */}
        <Tabs
          value={String(userType)}
          onValueChange={(value) => setUserType(value === "1" ? 1 : 2)}
          className="mb-12 w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="w-full" value="1">
              Người Lái Mới
            </TabsTrigger>
            <TabsTrigger className="w-full" value="2">
              Người Hướng Dẫn
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Info Box */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-12">
          <p className="text-foreground/80 leading-relaxed">
            {userType === 1
              ? "Những quy tắc dưới đây giúp đảm bảo an toàn cho bạn khi sử dụng nền tảng Drivemate - nền tảng bảo trợ tay lái. Vui lòng đọc kỹ và tuân thủ tất cả các quy định."
              : "Những yêu cầu dưới đây giúp duy trì chất lượng của nền tảng và đảm bảo an toàn cho tất cả người tham gia."}
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
          {filteredTerms.map((term) => (
            <TermsCard key={term.id} term={term} userType={userType} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Không có điều khoản nào cho danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TermsAndServicesPage() {
  return <TermsConditions />;
}
