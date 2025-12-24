"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getInstructorPolicy } from "@/features/policy/policyThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { IPolicy } from "@/types/policy";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ContractPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<IPolicy[]>([]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const { runSafe: runGetInstructorPolicy } = useThunkAction(getInstructorPolicy);

  const allChecked = useMemo(
    () => policies.every((policy) => accepted.includes(policy.id)),
    [accepted, policies]
  );

  const togglePolicy = (policyId: string, checked: boolean) => {
    setAccepted((prev) =>
      checked ? [...prev, policyId] : prev.filter((id) => id !== policyId)
    );
  };

  const handleConfirm = () => {
    if (!allChecked) return;
    router.push("/waiting-confirm?contractSigned=true");
  };

  useEffect(() => {
    const fetchInstructorPolicy = async () => {
      const result = await runGetInstructorPolicy();
      if (result && result.data?.value) {
        setPolicies(result.data.value);
        console.log(result.data.value);
      }
    };
    fetchInstructorPolicy();
  }, [runGetInstructorPolicy]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(16, 185, 129, 0.1);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.4);
        border-radius: 10px;
        transition: background 0.2s ease;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.6);
      }
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(16, 185, 129, 0.4) rgba(16, 185, 129, 0.1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="gradient-background w-full min-h-screen flex justify-center items-center py-4 md:py-8">
      <div className="w-full max-w-2xl px-4 h-full">
        <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl w-full mx-auto max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] flex flex-col">
          <CardContent className="p-6 md:p-10 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col gap-6 h-full min-h-0">
              <div className="flex flex-col items-center text-center flex-shrink-0">
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
                <p className="text-[#10b981] text-base md:text-lg font-medium mt-2">
                  Vui lòng đọc và xác nhận các chính sách
                </p>
              </div>

              <div className="custom-scrollbar flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pr-2">
                {policies.map((policy) => (
                  <label
                    key={policy.id}
                    className="flex gap-3 items-start rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-3 md:p-4 hover:bg-[#10b981]/15 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Checkbox
                      checked={accepted.includes(policy.id)}
                      onCheckedChange={(value) =>
                        togglePolicy(policy.id, Boolean(value))
                      }
                      className="mt-1 border-[#10b981] text-[#10b981] data-[state=checked]:bg-[#10b981] data-[state=checked]:text-white flex-shrink-0"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="text-sm text-white dark:text-gray-300 leading-relaxed break-words">
                        {policy.detail}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                type="button"
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white py-5 md:py-6 text-base font-medium flex-shrink-0"
                disabled={!allChecked}
              >
                Tôi đã đọc và đồng ý
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
