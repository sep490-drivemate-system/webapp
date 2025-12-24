"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StepProgress, type Step } from "@/components/ui/step-progress";
import Link from "next/link";
import Image from "next/image";
import { getIntructorApplicationByInstructorId } from "@/features/instructor/instructorThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { InstructorApplication } from "@/types/instructor/instructor-management.types";

export default function WaitingConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { runSafe: runGetIntructorApplicationByInstructorId } = useThunkAction(getIntructorApplicationByInstructorId);
  const [application, setApplication] = useState<InstructorApplication | null>(null);
  const contractSigned = searchParams.get("contractSigned") === "true";

  const handleSignInClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem("instructorId");
    router.push("/signin");
  }, [router]);

  const steps = useMemo<Step[]>(() => {
    const applicationStatus = application?.applicationStatus;
    let step1Status: Step["status"] = "completed";
    let step2Status: Step["status"] = "active";
    let step3Status: Step["status"] = "inactive";
    let step4Status: Step["status"] = "inactive";
    if (contractSigned) {
      step1Status = "completed";
      step2Status = "completed";
      step3Status = "completed";
      step4Status = "completed";
    } else if (applicationStatus === 1) {
      step1Status = "completed";
      step2Status = "active";
      step3Status = "inactive";
      step4Status = "inactive";
    } else if (applicationStatus === 2) {
      step1Status = "completed";
      step2Status = "completed";
      step3Status = "active";
      step4Status = "inactive";
    } else if (applicationStatus === 3) {
      step1Status = "completed";
      step2Status = "completed";
      step3Status = "completed";
      step4Status = "completed";
    }

    return [
      {
        id: 1,
        title: "Nộp hồ sơ",
        status: step1Status,
      },
      {
        id: 2,
        title: "Xét duyệt hồ sơ",
        status: step2Status,
        description:
          step2Status === "active"
            ? "Chúng tôi sẽ liên hệ lại với bạn trong vòng 1-2 ngày làm việc qua ứng dụng và email."
            : undefined,
      },
      {
        id: 3,
        title: "Ký hợp đồng online",
        status: step3Status,
        description:
          step3Status === "active"
            ? "Vui lòng ký hợp đồng online để hoàn tất quá trình đăng ký."
            : undefined,
        linkText: step3Status === "active" ? "Ký hợp đồng ngay" : undefined,
        linkHref: step3Status === "active" ? "/contract" : undefined,
      },
      {
        id: 4,
        title: "Chào mừng bạn đã trở thành một phần của Drivemate",
        status: step4Status,
        linkText: step4Status === "completed" ? "Đăng nhập ngay" : undefined,
        linkHref: step4Status === "completed" ? "/signin" : undefined,
        onLinkClick: step4Status === "completed" ? handleSignInClick : undefined,
      },
    ];
  }, [application?.applicationStatus, contractSigned, handleSignInClick]);

  useEffect(() => {
    const fetchIntructorApplication = async () => {
      const result = await runGetIntructorApplicationByInstructorId({ instructorId: localStorage.getItem("instructorId")! });
      if (result && result.data?.value) {
        setApplication(result.data.value);
      }
    };
    fetchIntructorApplication();
  }, [runGetIntructorApplicationByInstructorId]);

  return (
    <div className="gradient-background w-full min-h-screen flex justify-center items-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl w-full max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center text-center gap-4">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3"
                >
                  <Image
                    src="/logo.png"
                    alt="DRIVEMATE Logo"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </Link>
                <h1 className="text-white text-xl font-semibold">
                  Chúng tôi đã nhận được đơn đăng ký của bạn
                </h1>
              </div>
              <StepProgress steps={steps} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
