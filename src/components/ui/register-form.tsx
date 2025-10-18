import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import bgLogin from "@/../public/bg-login.jpg"
import { Step1ContactMethod } from "@/app/(auth)/signup/component/Step1ContactMethod"
import { Step2ContactInput } from "@/app/(auth)/signup/component/Step2ContactInput"
import { Step3Verification } from "@/app/(auth)/signup/component/Step3Verification"
import { Step4BasicInfo } from "@/app/(auth)/signup/component/Step4BasicInfo"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { useSliceSelector } from "@/hooks/commonHooks"
import { AuthState } from "@/features/auth/authSlice"
import { setSignupContact } from "@/features/auth/authSlice"
import { useAppDispatch } from "@/lib/redux/useAppDispatch"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch()
  const {
    currentStep,
    signupData,
    handleMethodSelect,
    handleContactSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleBasicInfoSubmit,
    handleBack,
  } = useSignUp()

  const updateSignupData = (data: { contact: string }) => {
    dispatch(setSignupContact(data.contact))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ContactMethod onSelect={handleMethodSelect} />

      case 2:
        return (
          <Step2ContactInput
            method={signupData.method}
            value={signupData.contact}
            onChange={(value) => updateSignupData({ contact: value })}
            onNext={() => handleContactSubmit(signupData.contact)}
            onBack={handleBack}
          />
        )

      case 3:
        return (
          <Step3Verification
            onNext={handleVerificationSubmit}
            onBack={handleBack}
            onResend={handleResendCode}
          />
        )

      case 4:
        return (
          <Step4BasicInfo
            onNext={handleBasicInfoSubmit}
            onBack={handleBack}
          />
        )

      default:
        return <Step1ContactMethod onSelect={handleMethodSelect} />
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <Image
              src={bgLogin}
              alt="Image"
              fill
              priority
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Header with logo */}
              <div className="flex flex-col items-center text-center">
                <Link href="/" className="flex items-center justify-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    priority
                    className="h-12 w-12 object-contain"
                  />
                  <h1 className="text-xl font-bold m-0 text-white">DriveMate</h1>
                </Link>
              </div>


              {/* Step content */}
              {renderStep()}

              {/* Footer link */}
              <div className="text-center text-sm text-gray-300">
                Bạn đã có tài khoản?{" "}
                <Link href="/signin" className="underline underline-offset-4 text-white hover:text-gray-300">
                  Đăng nhập
                </Link>
                <br />
                Đăng ký trở thành người hướng dẫn?{" "}
                <Link href="/signup-instructor" className="underline underline-offset-4 text-white hover:text-gray-300">
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
