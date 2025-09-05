import { Button } from "@/components/ui/button"
import { Mail, Phone, UserCheck } from "lucide-react"

interface Step1ContactMethodProps {
    onSelect: (method: 'email' | 'phone' | 'instructor') => void
}

export function Step1ContactMethod({ onSelect }: Step1ContactMethodProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Hãy tiếp tục với</h1>
            </div>

            <div className="grid gap-4">
                <Button
                    onClick={() => onSelect('email')}
                    variant="outline"
                    className="w-full h-16 flex items-center justify-center gap-3 text-lg bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                    <Mail className="h-6 w-6" />
                    <span>Email</span>
                </Button>
                <div className="text-center text-gray-400">Hoặc</div>
                <Button
                    onClick={() => onSelect('phone')}
                    variant="outline"
                    className="w-full h-16 flex items-center justify-center gap-3 text-lg bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                    <Phone className="h-6 w-6" />
                    <span>Số điện thoại</span>
                </Button>
                <div className="text-center text-gray-400">Hoặc</div>
                <Button
                    onClick={() => onSelect('instructor')}
                    variant="outline"
                    className="w-full h-16 flex items-center justify-center gap-3 text-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 text-white"
                >
                    <UserCheck className="h-6 w-6" />
                    <span>Đăng ký trở thành người hướng dẫn</span>
                </Button>
            </div>
        </div>
    )
}
