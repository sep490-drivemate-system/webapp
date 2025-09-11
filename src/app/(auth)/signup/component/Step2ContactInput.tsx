import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SignupMethod, Step2ContactInputProps } from "@/types/auth/signup.type"
import { useState } from "react"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

export function Step2ContactInput({
    onChange,
    onNext,
    onBack,
}: Step2ContactInputProps) {
    const { signupData, isLoading, errorMessage } = useSignUp()
    const isEmail = signupData.method === SignupMethod.EMAIL
    const placeholder = isEmail ? "Nhập địa chỉ email của bạn" : "Nhập số điện thoại của bạn"
    const label = isEmail ? "Email" : "Số điện thoại"

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Nhập {label}</h1>
                <p className="text-gray-300">
                    {isEmail
                        ? "Gửi mã xác thực qua email"
                        : "Gửi mã xác thực qua SMS"
                    }
                </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <Input
                        type={isEmail ? "email" : "tel"}
                        placeholder={placeholder}
                        value={signupData.contact}
                        onChange={(e) => onChange(e.target.value)}
                        className={`text-white placeholder:text-gray-400 bg-white/10 border-white/20 ${errorMessage ? "border-red-500 focus:border-red-500" : ""
                            }`}
                        required
                        autoFocus
                    />
                    {errorMessage && (
                        <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>

                    <Button
                        type="submit"
                        disabled={!signupData.contact.trim() || isLoading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="h-4 w-4 animate-spin" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <span>Tiếp tục</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
