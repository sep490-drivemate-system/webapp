import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface Step3VerificationProps {
    method: 'email' | 'phone' | 'instructor'
    contact: string
    onNext: () => void
    onBack: () => void
    onResend: () => void
    loading?: boolean
}

export function Step3Verification({
    method,
    contact,
    onNext,
    onBack,
    onResend,
    loading = false
}: Step3VerificationProps) {
    const [code, setCode] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (code.length === 6) {
            onNext()
        }
    }

    const handleResend = () => {
        if (resendCooldown === 0) {
            onResend()
            setResendCooldown(60) // 60 seconds cooldown
        }
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
        setCode(value)
    }

    const maskedContact = method === 'email'
        ? contact.replace(/(.{2}).*(@.*)/, '$1***$2')
        : contact.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Xác thực {method === 'email' ? 'Email' : 'Số điện thoại'}</h1>
                <p className="text-gray-300">
                    Chúng tôi đã gửi mã 6 chữ số đến <br />
                    <span className="font-semibold text-white">{maskedContact}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <Input
                        type="text"
                        placeholder="Nhập mã 6 chữ số"
                        value={code}
                        onChange={handleCodeChange}
                        className="text-center text-2xl tracking-widest text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                        maxLength={6}
                        required
                        autoFocus
                    />
                </div>

                <div className="text-center">
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleResend}
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
                        disabled={code.length !== 6 || loading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {loading ? "Đang xác thực..." : "Xác thực"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
