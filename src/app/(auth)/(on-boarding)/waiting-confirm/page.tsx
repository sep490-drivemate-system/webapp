"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StepProgress, type Step } from "@/components/ui/step-progress";
import Link from "next/link";
import Image from "next/image";
import { getIntructorApplicationByInstructorId } from "@/features/instructor/instructorThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { InstructorApplication } from "@/types/instructor/instructor-management.types";

export default function WaitingConfirmPage() {
  const { runSafe: runGetIntructorApplicationByInstructorId } = useThunkAction(getIntructorApplicationByInstructorId);
  const [application, setApplication] = useState<InstructorApplication | null>(null);

  // Tính toán steps dựa trên applicationStatus
  const steps = useMemo<Step[]>(() => {
    const applicationStatus = application?.applicationStatus;
    
    // Mặc định: step 1 completed, step 2 active (pending)
    let step1Status: Step["status"] = "completed";
    let step2Status: Step["status"] = "active";
    let step3Status: Step["status"] = "inactive";
    let step4Status: Step["status"] = "inactive";

    if (applicationStatus === 1) {
      // applicationStatus = 1: Step 1 completed, Step 2 pending
      step1Status = "completed";
      step2Status = "active";
      step3Status = "inactive";
      step4Status = "inactive";
    } else if (applicationStatus === 2) {
      // applicationStatus = 2: Step 2 completed, Step 3 pending
      step1Status = "completed";
      step2Status = "completed";
      step3Status = "active";
      step4Status = "inactive";
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
      },
      {
        id: 4,
        title: "Chào mừng bạn đã trở thành một phần của Drivemate",
        status: step4Status,
      },
    ];
  }, [application?.applicationStatus]);

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
              {/* Header with logo */}
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

              {/* Progress Steps */}
              <StepProgress steps={steps} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
