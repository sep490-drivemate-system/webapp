import { ICar, LicenseTier } from "../car/car.type";
import { gender } from "../constants/enum";
import { Gender } from "../user/gender.enum";

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
  dateUntilAutoRejection: string;
}

export interface InstructorManagementData {
  instructors: InstructorApplication[];
}

export interface IInstructorPackages {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  instructorId: string;
  drivingSkills: string[];
  roadTypes: string[];
  isRentalCar: boolean;
}

export interface IInstructorCar {
  id: string;
  thumbnailUrl: string;
  modelName: string;
  licenseTier: LicenseTier;
  price: number;
  seatCount: number;
  vehicleType: string | null;
}


export interface IInstructors {
  id: string;
  fullName: string;
  bio: string;
  avatar: string;
  gender: Gender;
  experienceYear: string;
  averageRating: number;
  bookingCount: number;
  packageCount: number;
}

// Paginated response từ backend
export interface PaginatedInstructorsResponse {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  pageContent: IInstructors[];
}

// Request params cho API
export interface GetInstructorsParams {
  searchKey?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface IInstructor {
  id: string;
  name: string;
  avatar: string;

  experienceYears: number;
  rating: number;
  bio: string;
  totalBookings: number;
  gender: gender;
  packages?: IInstructorPackages[]; // Optional packages array
  price?: number; // Optional price for some instructors
  vehicels?: any[]; // Optional vehicles (typo in data, keeping for compatibility)
}

// Type for InstructorItem component (with price for display)
export type Instructor = IInstructor & {
  price: number;
};

export interface InstructorApplicant {
  applicationId: string;
  instructorId: string;
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  submitDate: string;
  dateUntilAutoRejection: string;
  avatar: string;
  drivingLicenseFront: string;
  drivingLicenseBack: string;
  teachingLicenseFront: string;
  teachingLicenseTier: number;
  drivingLicenseTier: number;
  healthCheckup: string;
  personalProfile: string;
  applicationStatus: number;
  trackingHistories: string[];
}

export interface IStatisticsInstructor {
  totalRevenue: number;
  totalDeduction: number;
  revenueAfterDeduction: number;
  totalFundsWithdrawn: number;
}

export interface IInstructorStatistic {
  totalPackageCount: number;
  totalCarCount: number;
  totalUpcomingSessionCount: number;
  recentPurchases: IRecentPackagePurchases[];
  totalSessionByStatusCount: Record<string, number>;
  totalSessionByDay: Record<string, Record<string, number>>; // Based on "from and to"
  topPersonalPackages: ITopPersonalPackage[];
  topPersonalCars: ITopPersonalCar[];
}

export interface IRecentPackagePurchases {
  fullname: string;
  phoneNumber: string;
  avatarUrl: string;
  packageName: string;
  boughtTime: string; // ISO 8601 date string
  // Navigational ids
  noviceDriverUserId: string; // UUID as string
  packageId: string; // UUID as string
}

export interface ITopPersonalPackage {
  id: string; // UUID as string
  name: string;
  bookCount: number;
  percentage: number;
}

export interface ITopPersonalCar {
  id: string; // UUID as string
  name: string;
  bookCount: number;
  percentage: number;
}




export interface IInstructorStatistic {
  totalPackageCount: number;
  totalCarCount: number;
  totalUpcomingSessionCount: number;
  recentPurchases: IRecentPackagePurchases[];
  totalSessionByStatusCount: Record<string, number>;
  totalSessionByDay: Record<string, Record<string, number>>; // Based on "from and to"
  topPersonalPackages: ITopPersonalPackage[];
  topPersonalCars: ITopPersonalCar[];
}

export interface IInstructorStatisticFilter {
  year?: number;
  month?: number;
  week?: number;
  type?: StatisticTimeType;
}

export enum StatisticTimeType {
  Weekly = 0,
  Monthly = 1,
  Yearly = 2,
}
