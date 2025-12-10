"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@/hooks/auth/useSignUp";

export function OtpForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const {
    handleInputCodeChange,
    handleVerificationSubmitWithCode,
    handleVerificationResend,
    resendCooldown,
    isLoading: authLoading,
  } = useSignUp();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    handleInputCodeChange(newOtp.join(""));
    if (otpError) {
      setOtpError("");
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData
      .slice(0, 6)
      .split("")
      .filter((char) => /^\d$/.test(char));

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);
      handleInputCodeChange(newOtp.join(""));
      if (otpError) {
        setOtpError("");
      }

      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOTP = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    otpValue?: string
  ) => {
    e?.preventDefault();
    
    const otpString = otpValue || otp.join("");
    
    // Validate OTP length
    if (otpString.length !== 6) {
      setOtpError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    // Update Redux state with current OTP
    handleInputCodeChange(otpString);
    
    // Small delay to ensure Redux state is updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Verify OTP
    const isValid = handleVerificationSubmitWithCode();
    
    if (!isValid) {
      setOtpError("Mã OTP không chính xác. Vui lòng thử lại.");
      return;
    }

    // OTP is valid, navigate to next page
    router.push("/check-role");
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    try {
      await handleVerificationResend();

      // Reset OTP fields
      setOtp(["", "", "", "", "", ""]);
      handleInputCodeChange("");
      setOtpError("");
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    return email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
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
                <p className="text-[#10b981]"> Xác minh tài khoản với mã OTP</p>
              </div>

              {/* Title */}
              <div className="flex flex-col items-center text-center gap-2">
                <p className="text-gray-300 text-sm">
                  Chúng tôi đã gửi một mã có 6 chữ số đến email{" "}
                  <span className="text-[#10b981] font-medium">
                    {maskEmail(email)}
                  </span>
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={`otp-input-${index}`}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyPress(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-semibold text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10 dark:!bg-[#10b981]/10"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-400 text-sm text-center -mt-1">
                  {otpError}
                </p>
              )}

              {/* Resend Code */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-300">Bạn không nhận được mã?</span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending || resendCooldown > 0}
                  className="text-[#10b981] hover:text-[#059669] underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending
                    ? "Đang gửi..."
                    : resendCooldown > 0
                      ? `Gửi lại mã (${resendCooldown}s)`
                      : "Gửi lại mã"}
                </button>
              </div>

              {/* Verify Button */}
              <Button
                type="button"
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                disabled={
                  authLoading || otp.some((digit) => digit === "")
                }
              >
                {authLoading ? "Đang xác minh..." : "Xác minh"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
