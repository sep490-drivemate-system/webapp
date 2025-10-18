import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Step4BasicInfoProps } from "@/types/auth/signup.type"
import { useSignUp } from "@/hooks/auth/useSignUp"
import { setConfirmPasswordChange, setPasswordChange, setUserNameChange } from "@/features/auth/authSlice"
import { Spinner } from "@/components/ui/shadcn-io/spinner"


export function Step4BasicInfo({ onBack }: Step4BasicInfoProps) {
    const { errorMessage, isLoading, signupData, dispatch, handleBasicInfoSubmit } = useSignUp()


    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Thông tin cơ bản</h1>
                <p className="text-gray-300">Hoàn thiện thông tin để tạo tài khoản</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleBasicInfoSubmit(signupData.basicInfo.signUpRequest) }} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <div>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Tên người dùng"
                            value={signupData.basicInfo.signUpRequest.userName}
                            onChange={(e) => dispatch(setUserNameChange(e.target.value))}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errorMessage && (
                            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={signupData.basicInfo.signUpRequest.password}
                            onChange={(e) => dispatch(setPasswordChange(e.target.value))}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errorMessage && (
                            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={signupData.basicInfo.confirmPassword || ''}
                            onChange={(e) => dispatch(setConfirmPasswordChange(e.target.value))}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errorMessage && (
                            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
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
                        disabled={isLoading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="h-4 w-4 animate-spin" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <span>Hoàn thành đăng ký</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>

                </div>
            </form>
        </div>
    )
}
