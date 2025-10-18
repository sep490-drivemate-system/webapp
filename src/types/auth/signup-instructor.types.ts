// Type cho dữ liệu đăng ký người hướng dẫn (FormData)
export interface InstructorRegistrationData {
    email: string
    documents: {
        b2_license_front: string
        b2_license_back: string
        cccd_front: string
        cccd_back: string
        professional_certificate: string
        health_certificate: string
        vehicle_papers: string
        vehicle_insurance: string
    }
}

// Interface cho backend .NET - Request
export interface InstructorSignupRequest {
    email: string
    b2LicenseFront: File
    b2LicenseBack: File
    cccdFront: File
    cccdBack: File
    professionalCertificate: File
    healthCertificate: File
    vehiclePapers: File
    vehicleInsurance: File
}

// Interface cho backend .NET - Response
export interface InstructorSignupResponse {
    success: boolean
    message: string
    data?: {
        instructorId: string
        status: 'pending' | 'approved' | 'rejected'
        submittedAt: string
    }
    errors?: {
        field: string
        message: string
    }[]
}

// Type cho từng loại giấy tờ
export interface DocumentType {
    id: string
    name: string
    description: string
    frontImage?: string
    backImage?: string
    frontFile?: File
    backFile?: File
    required: boolean
}

// Type cho response từ API
export interface InstructorRegistrationResponse {
    success: boolean
    message: string
    data?: {
        instructorId: string
        status: 'pending' | 'approved' | 'rejected'
    }
}
