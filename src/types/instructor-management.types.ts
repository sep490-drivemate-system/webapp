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

export interface ProfessionalCertificateDocument
  extends BaseInstructorDocument {
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
  ReApplying = 4,
}

export enum DrivingLicenseTier {
  B,
  C1,
  C,
  D1,
  D2,
  D,
  BE,
  C1E,
  CE,
  D1E,
  D2E,
  DE,
}

export interface InstructorApplication {
  applicationId: string;
  applicationStatus: number;
  instructorId: string;
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  submitDate: string;
  avatar: string;
  drivingLicenseFront: string;
  drivingLicenseBack: string;
  teachingLicenseFront: string;
  teachingLicenseTier: number;
  drivingLicenseTier: number;
  healthCheckup: string;
  personalProfile: string;
  trackingHistories: string[];
}

export interface InstructorManagementData {
  instructors: InstructorApplication[];
}
