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

export interface InstructorRegistrationResponse {
    success: boolean
    message: string
    data?: {
        instructorId: string
        status: 'pending' | 'approved' | 'rejected'
    }
}
