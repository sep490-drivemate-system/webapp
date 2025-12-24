import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface InstructorStep4CooperativeProps {
    onNext: () => void
    onBack: () => void
}

export function InstructorStep4Cooperative({ onNext, onBack }: InstructorStep4CooperativeProps) {
    const cooperativeInfo = [
        "Có Giấy xác nhận xã viên hợp tác xã kèm Phụ đính 1, 2",
        "Có Phù hiệu xe hợp đồng, Tem phản quang và Biển số vàng"
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Bạn đã tham gia Hợp tác xã vận tải nào chưa?
                </h1>
            </div>

            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <ul className="space-y-3">
                    {cooperativeInfo.map((info, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-200">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{info}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>

                <Button
                    onClick={onNext}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                >
                    Có, tiếp tục
                </Button>
            </div>
        </div>
    )
}
