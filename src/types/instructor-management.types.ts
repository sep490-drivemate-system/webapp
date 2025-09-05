export interface InstructorDocument {
    front: string;
    back?: string;
    verified: boolean;
}

export interface InstructorDocuments {
    b2License: InstructorDocument;
    cccd: InstructorDocument;
    professionalCertificate: InstructorDocument;
    healthCertificate: InstructorDocument;
    vehiclePapers: InstructorDocument;
    vehicleInsurance: InstructorDocument;
}

export interface InstructorApplication {
    id: string;
    name: string;
    email: string;
    phone: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    documents: InstructorDocuments;
}

export interface InstructorManagementData {
    instructors: InstructorApplication[];
}
