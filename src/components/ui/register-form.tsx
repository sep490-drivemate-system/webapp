"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { handleSendEmailCode, isLoading: authLoading } = useSignUp();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Optimize video playback
    const optimizeVideo = () => {
      // Set playback quality hints
      if ("requestVideoFrameCallback" in video) {
        // Modern browsers support this
      }

      // Preload and play
      video.load();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video is playing smoothly
            video.playbackRate = 1.0;
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      }
    };

    // Wait for video to be ready
    if (video.readyState >= 2) {
      // Video is already loaded
      optimizeVideo();
    } else {
      video.addEventListener("loadeddata", optimizeVideo, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", optimizeVideo);
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else {
      const password = formData.password;
      const hasMinLength = password.length >= 6;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      
      if (!hasMinLength) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else if (!hasUpperCase) {
        newErrors.password = "Mật khẩu phải có ít nhất 1 ký tự viết hoa";
      } else if (!hasSpecialChar) {
        newErrors.password = "Mật khẩu phải có ít nhất 1 ký tự đặc biệt";
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Validate terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Bạn phải đồng ý với điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      try {
        const result = await handleSendEmailCode({
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
        });

        if (result.ok) {
          // Điều hướng sang trang nhập OTP kèm email để hiển thị
          router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
        } else {
          setErrors({
            submit:
              "Không thể gửi mã OTP. Vui lòng kiểm tra lại thông tin và thử lại.",
          });
        }
      } catch (error) {
        console.error("Signup failed:", error);
        setErrors({
          submit: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale transform-gpu will-change-transform"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <source src="/drivemate_video.mp4" type="video/mp4" />
            </video>
          </div>
          <form className="p-6 md:p-8 order-2" onSubmit={handleSubmit}>
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
                <p className="text-[#10b981]">Đăng ký tài khoản mới</p>
              </div>

              {/* Form fields */}
              <div className="grid gap-3">
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] bg-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] bg-transparent"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] bg-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10b981] transition-colors"
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] bg-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10b981] transition-colors"
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    handleChange("acceptTerms", checked as boolean)
                  }
                  className="mt-1 border-[#10b981]/50 data-[state=checked]:bg-[#10b981] data-[state=checked]:border-[#10b981]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-300 leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bằng cách tiếp tục, tôi đồng ý với việc DriveMate có thể sử
                  dụng và tiết lộ thông tin do tôi cung cấp theo{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 text-[#10b981] hover:text-[#059669]"
                  >
                    Thông báo về quyền riêng tư
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 text-[#10b981] hover:text-[#059669]"
                  >
                    Điều khoản và điều kiện
                  </Link>
                  .
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-400 text-sm -mt-2">
                  {errors.acceptTerms}
                </p>
              )}

              {errors.submit && (
                <p className="text-red-400 text-sm text-center bg-red-100/10 p-2 rounded">
                  {errors.submit}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                disabled={isLoading || authLoading}
              >
                {isLoading ? "Đang lưu thông tin..." : "Tiếp theo"}
              </Button>

              {/* Footer link */}
              <div className="text-center text-sm text-gray-300">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/signin"
                  className="underline underline-offset-4 text-white hover:text-gray-300"
                >
                  Đăng nhập
                </Link>
                <br />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
