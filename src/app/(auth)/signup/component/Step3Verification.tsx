import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Step3VerificationProps } from "@/types/auth/signup.type"
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { useSliceSelector } from "@/hooks/commonHooks"
import { setInputCode } from "@/features/auth/authSlice"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

export function Step3Verification({
    onNext,
    onBack,
}: Step3VerificationProps) {
    const {
        isLoading,
        dispatch,
        errorMessage,
        inputCode,
        signupData,
        resendCooldown,
        setResendCooldown,
        handleVerificationResend,
        getMaskedContact,
        handleSubmit
    } = useSignUp()

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown, setResendCooldown])
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Xác thực {signupData.method === 'email' ? 'Email' : 'Số điện thoại'}</h1>
                <p className="text-gray-300">
                    Chúng tôi đã gửi mã 6 chữ số đến <br />
                    <span className="font-semibold text-white">{getMaskedContact()}</span>
                </p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, onNext)} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <Input
                        type="text"
                        placeholder="Nhập mã 6 chữ số"
                        value={inputCode}
                        onChange={(e) => dispatch(setInputCode(e.target.value))}
                        className={`text-center text-2xl tracking-widest text-white placeholder:text-gray-400 bg-white/10 border-white/20 ${errorMessage ? "border-red-500 focus:border-red-500" : ""}`}
                        maxLength={6}
                        required
                        autoFocus
                    />
                    {errorMessage && (
                        <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                    )}
                </div>

                <div className="text-center">
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleVerificationResend}
                        disabled={resendCooldown > 0}
                        className="text-gray-300 hover:text-white p-0 h-auto"
                    >
                        {resendCooldown > 0 ? (
                            `Gửi lại sau ${resendCooldown}s`
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Gửi lại mã
                            </>
                        )}
                    </Button>
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
                        disabled={inputCode.length !== 6 || isLoading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="h-4 w-4 animate-spin" />
                                <span>Đang xác thực...</span>
                            </>
                        ) : (
                            <>
                                <span>Xác thực</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
