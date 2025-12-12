"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Policy = {
  id: string;
  title: string;
  description: string;
};

const policies: Policy[] = [
  {
    id: "safety",
    title: "An toàn & tuân thủ",
    description:
      "Cam kết tuân thủ luật giao thông và hướng dẫn an toàn của DriveMate.",
  },
  {
    id: "privacy",
    title: "Bảo mật thông tin",
    description:
      "Đồng ý chia sẻ thông tin cá nhân cho mục đích xác thực và hỗ trợ dịch vụ.",
  },
  {
    id: "conduct",
    title: "Ứng xử văn minh",
    description:
      "Tôn trọng người học/người hướng dẫn, không có hành vi quấy rối hay phân biệt đối xử.",
  },
  {
    id: "payment",
    title: "Thanh toán & hoàn phí",
    description:
      "Chấp nhận chính sách thanh toán, hoàn/huỷ theo điều khoản của DriveMate.",
  },
];

export default function ContractPage() {
  const [accepted, setAccepted] = useState<string[]>([]);

  const allChecked = useMemo(
    () => policies.every((policy) => accepted.includes(policy.id)),
    [accepted]
  );

  const togglePolicy = (policyId: string, checked: boolean) => {
    setAccepted((prev) =>
      checked ? [...prev, policyId] : prev.filter((id) => id !== policyId)
    );
  };

  const handleConfirm = () => {
    // TODO: integrate submission flow (e.g., API or navigation)
    console.log("Accepted policies:", accepted);
  };

  return (
    <div className="gradient-background w-full h-screen max-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl w-full max-w-4xl mx-auto">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="bg-muted relative hidden md:block overflow-hidden order-1">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
              >
                <source src="/drivemate_video.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="p-6 md:p-8 order-2">
              <div className="flex flex-col gap-6">
                {/* Header with logo */}
                <div className="flex flex-col items-center text-center">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-3"
                  >
                    <Image
                      src="/logo.png"
                      alt="DRIVEMATE Logo"
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </Link>
                  <p className="text-[#10b981]">
                    Vui lòng đọc và xác nhận các chính sách
                  </p>
                </div>

                {/* Policies list */}
                <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
                  {policies.map((policy) => (
                    <label
                      key={policy.id}
                      className="flex gap-3 items-start rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-3 hover:bg-[#10b981]/15 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        checked={accepted.includes(policy.id)}
                        onCheckedChange={(value) =>
                          togglePolicy(policy.id, Boolean(value))
                        }
                        className="mt-1 border-[#10b981] text-[#10b981] data-[state=checked]:bg-[#10b981] data-[state=checked]:text-white"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-white dark:text-gray-300">
                          {policy.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Confirm Button */}
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                  disabled={!allChecked}
                >
                  Tôi đã đọc và đồng ý
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
