"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StepProgress, type Step } from "@/components/ui/step-progress";
import Link from "next/link";
import Image from "next/image";

export default function WaitingConfirmPage() {
  // Mặc định: step 1 completed, step 2 active (pending)
  const [steps] = useState<Step[]>([
    {
      id: 1,
      title: "Nộp hồ sơ",
      status: "completed",
    },
    {
      id: 2,
      title: "Xét duyệt hồ sơ",
      status: "active",
      description:
        "Chúng tôi sẽ liên hệ lại với bạn trong vòng 1-2 ngày làm việc qua ứng dụng và email.",
    },
    {
      id: 3,
      title: "Ký hợp đồng online",
      status: "inactive",
    },
    {
      id: 4,
      title: "Chào mừng bạn đã trở thành một phần của Drivemate",
      status: "inactive",
    },
  ]);

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
