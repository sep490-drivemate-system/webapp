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
    b2License: DriverLicenseDocument;
    cccd: CitizenIdDocument;
    professionalCertificate: ProfessionalCertificateDocument;
    healthCertificate: BaseInstructorDocument;
    vehiclePapers: BaseInstructorDocument;
    vehicleInsurance: BaseInstructorDocument;
}

export interface EmergencyContact {
    name?: string;
    phone?: string;
}

export interface InstructorApplication {
    id: string;
    name: string;
    email: string;
    phone: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    documents: InstructorDocuments;
    emergencyContact?: EmergencyContact;
}

export interface InstructorManagementData {
    instructors: InstructorApplication[];
}
