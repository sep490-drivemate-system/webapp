export interface InstructorRegistrationRequest {
  Fullname: string;
  RawPassword: string;
  Email: string;
  PhoneNumber: string;
  Avatar: File;
  BirthDate: string;
  Gender: string;
  DrivingLicenseFront: File;
  DrivingLicenseBack: File;
  DrivingLicenseTier: string;
  TeachingLicenseFront: File;
  TeachingTier: string;
  HealthCheckup: File;
  PersonalProfile: File;
}

export interface InstructorRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    instructorId: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
  };
  errors?: {
    field: string;
    message: string;
  }[];
}

