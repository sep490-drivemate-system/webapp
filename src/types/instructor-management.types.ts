export interface BaseInstructorDocument {
    front?: string;
    back?: string;
    verified: boolean;
}

export interface CitizenIdDocument extends BaseInstructorDocument {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface DriverLicenseDocument extends BaseInstructorDocument {
    licenseClass?: string;
}

export interface ProfessionalCertificateDocument extends BaseInstructorDocument {
    vehicleClass?: string;
}

export interface InstructorDocuments {
    b2License?: DriverLicenseDocument;
    drivingLicense?: DriverLicenseDocument; // Alternative name for b2License
    cccd?: CitizenIdDocument;
    professionalCertificate?: ProfessionalCertificateDocument;
    healthCertificate?: BaseInstructorDocument;
    criminalRecord?: BaseInstructorDocument;
    vehiclePapers?: BaseInstructorDocument;
    vehicleInsurance?: BaseInstructorDocument;
}

export interface EmergencyContact {
    name?: string;
    phone?: string;
}

export enum InstructorStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3,
}

export interface InstructorApplication {
    id: string;
    name: string;
    phone: string;
    email?: string; // Optional email field
    emergencyContact?: EmergencyContact; // Thông tin liên hệ khẩn cấp
    submittedAt: string;
    status: InstructorStatus;
    documents: InstructorDocuments;
}

export interface InstructorManagementData {
    instructors: InstructorApplication[];
}
