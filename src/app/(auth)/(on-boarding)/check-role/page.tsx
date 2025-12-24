"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { useAppSelector } from "@/lib/redux/useAppDispatch";

type Role = {
  id: string;
  title: string;
  value: string;
};

const roles: Role[] = [
  {
    id: "1",
    title: "Người lái mới",
    value: "new-driver",
  },
  {
    id: "2",
    title: "Người hướng dẫn",
    value: "instructor",
  },
];

export default function CheckRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { handleRegisterNoviceDriver } = useSignUp();
  const auth = useAppSelector((state) => state.auth);

  const handleContinue = async () => {
    if (!selectedRole) return;

    if (selectedRole === "new-driver") {
      console.log(auth.signupData);
      const result = await handleRegisterNoviceDriver(auth.signupData);
      if (result.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/signin"), 1500);
      }
    } else if (selectedRole === "instructor") {
      router.push("/indentification-document");
    }
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
                    Bạn muốn đăng ký với tư cách là
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full h-12 text-[#10b981] border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10 dark:!bg-[#10b981]/10">
                      <SelectValue placeholder="Đăng ký với tư cách" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#10b981]/20 backdrop-blur-md border-[#10b981]/50">
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.value}
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20 cursor-pointer"
                        >
                          {role.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                  disabled={!selectedRole}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl">
                ✓
              </div>
              <p className="text-lg font-semibold">Đăng ký thành công</p>
              <p className="text-sm text-gray-600">
                Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
