import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

interface Step4BasicInfoProps {
    onNext: (data: BasicInfoData) => void
    onBack: () => void
    loading?: boolean
}

export interface BasicInfoData {
    username: string
    password: string
    confirmPassword: string
}

export function Step4BasicInfo({ onNext, onBack, loading = false }: Step4BasicInfoProps) {
    const [formData, setFormData] = useState<BasicInfoData>({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<Partial<BasicInfoData>>({})

    const handleChange = (field: keyof BasicInfoData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<BasicInfoData> = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập họ tên'
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onNext(formData)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Thông tin cơ bản</h1>
                <p className="text-gray-300">Hoàn thiện thông tin để tạo tài khoản</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-3">
                    <div>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Tên người dùng"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errors.username && (
                            <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20"
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
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
                        disabled={loading}
                        className="flex-1 bg-[#0074c2] hover:bg-[#00598a]"
                    >
                        {loading ? "Đang tạo tài khoản..." : "Hoàn thành đăng ký"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
