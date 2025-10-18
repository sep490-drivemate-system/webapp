import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Camera, X, Mail, AlertCircle } from "lucide-react"
import { useState } from "react"
import { DocumentType, InstructorRegistrationData, InstructorSignupRequest } from "../../../../types/auth/signup-instructor.types"

interface InstructorStep5DocumentsProps {
    onNext: (data: InstructorSignupRequest) => void
    onBack: () => void
    loading?: boolean
}

const documentTypes: DocumentType[] = [
    {
        id: "b2_license",
        name: "Bằng lái xe",
        description: "GPLX hạng B2 trở lên và còn hạn",
        required: true
    },
    {
        id: "cccd",
        name: "CCCD/CMND",
        description: "Căn cước công dân hoặc Chứng minh nhân dân",
        required: true
    },
    {
        id: "professional_certificate",
        name: "Chứng chỉ hành nghề",
        description: "Chứng chỉ hành nghề lái xe",
        required: true
    },
    // {
    //     id: "health_certificate",
    //     name: "Giấy khám sức khỏe",
    //     description: "Giấy khám sức khỏe đáp ứng hạng B2 trở lên",
    //     required: true
    // },
    // {
    //     id: "vehicle_papers",
    //     name: "Giấy tờ về xe",
    //     description: "Đăng kiểm, đăng ký xe",
    //     required: true
    // },
    // {
    //     id: "vehicle_insurance",
    //     name: "Bảo hiểm xe",
    //     description: "Bảo hiểm bắt buộc TNDS loại hình kinh doanh",
    //     required: true
    // }
]

export function InstructorStep5Documents({ onNext, onBack, loading = false }: InstructorStep5DocumentsProps) {
    const [documents, setDocuments] = useState<DocumentType[]>(documentTypes)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const handleImageUpload = (docId: string, side: 'front' | 'back', file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            setDocuments(prev =>
                prev.map(doc =>
                    doc.id === docId
                        ? {
                            ...doc,
                            [side === 'front' ? 'frontImage' : 'backImage']: imageUrl,
                            [side === 'front' ? 'frontFile' : 'backFile']: file
                        }
                        : doc
                )
            )
        }
        reader.readAsDataURL(file)
    }

    const removeImage = (docId: string, side: 'front' | 'back') => {
        setDocuments(prev =>
            prev.map(doc =>
                doc.id === docId
                    ? { ...doc, [side === 'front' ? 'frontImage' : 'backImage']: undefined }
                    : doc
            )
        )
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleEmailChange = (value: string) => {
        setEmail(value)
        if (emailError) {
            setEmailError('')
        }
    }

    const isAllDocumentsComplete = documents.every(doc =>
        doc.frontFile && (doc.id === 'cccd' || doc.id === 'b2_license' ? !!doc.backFile : true)
    )

    const isFormComplete = isAllDocumentsComplete && email.trim() && validateEmail(email)

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            setEmailError('Vui lòng nhập địa chỉ email hợp lệ')
            return
        }

        const findDoc = (id: string) => documents.find(d => d.id === id)
        const b2 = findDoc('b2_license')
        const cccd = findDoc('cccd')
        const prof = findDoc('professional_certificate')
        const health = findDoc('health_certificate')
        const vehiclePapers = findDoc('vehicle_papers')
        const vehicleInsurance = findDoc('vehicle_insurance')

        const dto: InstructorSignupRequest = {
            email,
            b2LicenseFront: b2?.frontFile as File,
            b2LicenseBack: b2?.backFile as File,
            cccdFront: cccd?.frontFile as File,
            cccdBack: cccd?.backFile as File,
            professionalCertificate: prof?.frontFile as File,
            healthCertificate: health?.frontFile as File,
            vehiclePapers: vehiclePapers?.frontFile as File,
            vehicleInsurance: vehicleInsurance?.frontFile as File,
        }

        onNext(dto)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Upload giấy tờ</h1>
                <p className="text-gray-300">Vui lòng upload các giấy tờ cần thiết (mặt trước và mặt sau)</p>
            </div>

            {/* Email input section */}
            <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-white mb-1">Thông tin liên lạc quan trọng</h3>
                            <p className="text-sm text-white">Email này sẽ được sử dụng để liên lạc và gửi thông báo quan trọng</p>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-white flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email liên lạc <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            className="text-white placeholder:text-gray-400 bg-white/10 border-white/20 mt-2"
                            required
                        />
                        {emailError && (
                            <p className="text-red-400 text-sm mt-1">{emailError}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                    <Card key={doc.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-white">{doc.name}</h3>
                                    <p className="text-sm text-gray-300">{doc.description}</p>
                                </div>
                                {doc.required && (
                                    <span className="text-red-400 text-xs">* Bắt buộc</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Mặt trước */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Mặt trước</label>
                                    <div className="relative">
                                        {doc.frontImage ? (
                                            <div className="relative">
                                                <img
                                                    src={doc.frontImage}
                                                    alt={`${doc.name} mặt trước`}
                                                    className="w-full h-24 object-cover rounded border border-white/20"
                                                />
                                                <button
                                                    onClick={() => removeImage(doc.id, 'front')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/30 rounded cursor-pointer hover:border-white/50 transition-colors">
                                                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-400">Upload</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) handleImageUpload(doc.id, 'front', file)
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Mặt sau (chỉ cho CCCD và Bằng lái) */}
                                {(doc.id === 'cccd' || doc.id === 'b2_license') && (
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-2">Mặt sau</label>
                                        <div className="relative">
                                            {doc.backImage ? (
                                                <div className="relative">
                                                    <img
                                                        src={doc.backImage}
                                                        alt={`${doc.name} mặt sau`}
                                                        className="w-full h-24 object-cover rounded border border-white/20"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(doc.id, 'back')}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/30 rounded cursor-pointer hover:border-white/50 transition-colors">
                                                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                                    <span className="text-xs text-gray-400">Upload</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) handleImageUpload(doc.id, 'back', file)
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                    onClick={handleSubmit}
                    disabled={!isFormComplete || loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                >
                    {loading ? "Đang xử lý..." : "Hoàn thành đăng ký"}
                </Button>
            </div>
        </div>
    )
}
