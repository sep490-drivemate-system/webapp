"use client";

import { useState, useEffect, useMemo } from "react";

import TermsCard from "@/components/terms-and-services/term-card";
import { PageSectionHeader } from "@/components/commons/page-section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getNewDriverPolicy, getInstructorPolicy } from "@/features/policy/policyThunk";

interface TermsItem {
  id: string;
  title: string;
  description: string;
  type: 1 | 2; // 1 = new driver, 2 = mentor
}

function TermsConditions() {
  const dispatch = useAppDispatch();
  const { newDriverPolicies, instructorPolicies, isLoading } = useAppSelector(
    (state) => state.policy
  );

  const [userType, setUserType] = useState<1 | 2>(1);

  // Fetch policies on mount
  useEffect(() => {
    dispatch(getNewDriverPolicy())
      .unwrap()
      .catch((error) => {
        console.error("Không thể tải điều khoản người lái mới", error);
      });

    dispatch(getInstructorPolicy())
      .unwrap()
      .catch((error) => {
        console.error("Không thể tải điều khoản người hướng dẫn", error);
      });
  }, [dispatch]);

  // Transform policies to TermsItem format
  const termsData = useMemo(() => {
    const allTerms: TermsItem[] = [];

    // Transform new driver policies (type 1)
    newDriverPolicies.forEach((policy) => {
      allTerms.push({
        id: policy.id,
        title: policy.title,
        description: policy.detail,
        type: 1,
      });
    });

    // Transform instructor policies (type 2)
    instructorPolicies.forEach((policy) => {
      allTerms.push({
        id: policy.id,
        title: policy.title,
        description: policy.detail,
        type: 2,
      });
    });

    return allTerms;
  }, [newDriverPolicies, instructorPolicies]);

  const filteredTerms = termsData.filter((term) => term.type === userType);

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
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Đang tải điều khoản...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default function TermsAndServicesPage() {
  return <TermsConditions />;
}
