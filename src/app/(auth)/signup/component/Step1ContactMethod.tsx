import { Button } from "@/components/ui/button"
import { SignupMethod, Step1ContactMethodProps } from "@/types/auth/signup.type"
import { Mail, Phone } from "lucide-react"

export function Step1ContactMethod({ onSelect }: Step1ContactMethodProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Hãy tiếp tục với</h1>
            </div>

            <div className="grid gap-4">
                <Button
                    onClick={() => onSelect(SignupMethod.EMAIL)}
                    variant="outline"
                    className="w-full h-16 flex items-center justify-center gap-3 text-lg bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                    <Mail className="h-6 w-6" />
                    <span>Email</span>
                </Button>
                <div className="text-center text-gray-400">Hoặc</div>
                <Button
                    onClick={() => onSelect(SignupMethod.PHONE)}
                    variant="outline"
                    className="w-full h-16 flex items-center justify-center gap-3 text-lg bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                    <Phone className="h-6 w-6" />
                    <span>Số điện thoại</span>
                </Button>
            </div>
        </div>
    )
}
