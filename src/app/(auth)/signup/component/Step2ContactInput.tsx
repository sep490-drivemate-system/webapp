import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface Step2ContactInputProps {
    method: 'email' | 'phone' | 'instructor'
    value: string
    onChange: (value: string) => void
    onNext: () => void
    onBack: () => void
    loading?: boolean
}

export function Step2ContactInput({
    method,
    value,
    onChange,
    onNext,
    onBack,
    loading = false
}: Step2ContactInputProps) {
    const isEmail = method === 'email'
    const placeholder = isEmail ? "Nhập địa chỉ email của bạn" : "Nhập số điện thoại của bạn"
    const label = isEmail ? "Email" : "Số điện thoại"

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            onNext()
        }
    }

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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <Input
                        type={isEmail ? "email" : "tel"}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                        required
                        autoFocus
                    />
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
                        disabled={!value.trim() || loading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {loading ? "Đang gửi..." : "Tiếp tục"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
