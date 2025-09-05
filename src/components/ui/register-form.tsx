import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link"
import Image from "next/image"
import bgLogin from "@/../public/bg-login.jpg"
import { useState } from "react"
import { Step1ContactMethod } from "@/app/(auth)/signup/component/Step1ContactMethod"
import { Step2ContactInput } from "@/app/(auth)/signup/component/Step2ContactInput"
import { Step3Verification } from "@/app/(auth)/signup/component/Step3Verification"
import { Step4BasicInfo, BasicInfoData } from "@/app/(auth)/signup/component/Step4BasicInfo"

type SignupStep = 1 | 2 | 3 | 4

interface SignupData {
  method: 'email' | 'phone' | 'instructor'
  contact: string
  verificationCode: string
  basicInfo: BasicInfoData
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1)
  const [signupData, setSignupData] = useState<SignupData>({
    method: 'email',
    contact: '',
    verificationCode: '',
    basicInfo: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  })
  const [loading, setLoading] = useState(false)

  const handleMethodSelect = (method: 'email' | 'phone' | 'instructor') => {
    if (method === 'instructor') {
      // Redirect to instructor signup page
      window.location.href = '/signup-instructor'
      return
    }
    setSignupData(prev => ({ ...prev, method }))
    setCurrentStep(2)
  }

  const handleContactSubmit = (contact: string) => {
    setSignupData(prev => ({ ...prev, contact }))
    setCurrentStep(3)
    // Here you would typically send verification code
    console.log(`Sending verification code to ${contact}`)
  }

  const handleVerificationSubmit = () => {
    setCurrentStep(4)
    // Here you would typically verify the code
    console.log('Verifying code...')
  }

  const handleResendCode = () => {
    // Here you would resend the verification code
    console.log('Resending verification code...')
  }

  const handleBasicInfoSubmit = (basicInfo: BasicInfoData) => {
    setLoading(true)
    // Here you would complete the signup process
    console.log('Completing signup with data:', { ...signupData, basicInfo })

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Redirect to success page or login
      console.log('Signup completed successfully!')
    }, 2000)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep)
    }
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
            onChange={(value) => setSignupData(prev => ({ ...prev, contact: value }))}
            onNext={() => handleContactSubmit(signupData.contact)}
            onBack={handleBack}
            loading={loading}
          />
        )

      case 3:
        return signupData.method === 'instructor' ? (
          <div className="text-center text-white">
            <p>Redirecting to instructor registration...</p>
          </div>
        ) : (
          <Step3Verification
            method={signupData.method as 'email' | 'phone'}
            contact={signupData.contact}
            onNext={handleVerificationSubmit}
            onBack={handleBack}
            onResend={handleResendCode}
            loading={loading}
          />
        )

      case 4:
        return (
          <Step4BasicInfo
            onNext={handleBasicInfoSubmit}
            onBack={handleBack}
            loading={loading}
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
                <a href="/signin" className="underline underline-offset-4 text-white hover:text-gray-300">
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
