"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    handleSignIn,
    isLoading,
    signInData,
    updateEmailOrPhone,
    updatePassword,
  } = useSignIn();

  const videoRef = useRef<HTMLVideoElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl w-full max-w-4xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block overflow-hidden order-1">
            <video
              ref={videoRef}
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
          <form className="p-6 md:p-8 order-2" onSubmit={onSubmit}>
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
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>
              <div className="grid gap-3">
                <Input
                  ref={emailInputRef}
                  id="email"
                  className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/10 hover:!bg-[#10b981]/10 dark:!bg-[#10b981]/10"
                  type="text"
                  placeholder="Email hoặc số điện thoại"
                  value={signInData.emailOrPhone}
                  onChange={(e) => updateEmailOrPhone(e.target.value)}
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="relative">
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/10 hover:!bg-[#10b981]/10 dark:!bg-[#10b981]/10 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={signInData.password}
                    onChange={(e) => updatePassword(e.target.value)}
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10b981] transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center text-white">
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              {/* {error && (
                <div className="text-red-400 text-sm text-center bg-red-100/10 p-2 rounded">
                  {error}
                </div>
              )} */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="flex-grow border-t border-border"></span>
                <span className="px-3 flex items-center gap-2 text-white">
                  Hoặc tiếp tục với
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center justify-center gap-2 px-3 py-1 h-auto"
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                </span>
                <span className="flex-grow border-t border-border"></span>
              </div>

              <div className="text-center text-sm text-gray-300">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  className="underline underline-offset-4 text-white hover:text-gray-300"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
