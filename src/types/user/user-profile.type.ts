import { UserRole } from "../auth/user-role.enum";

export interface IUserProfile {
  id: string;
  userName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  dateOfBirth?: string;
  address?: string;
  licenseNumber?: string;
  licenseType?: string;
  createdAt: string;
  stats: {
    totalSessions: number;
    totalHours: number;
    carsRented: number;
    packagesCompleted: number;
  };
}

export interface IBookingHistory {
  id: string;
  type: "package" | "car" | "session";
  title: string;
  date: string;
  status: "completed" | "ongoing" | "cancelled" | "upcoming";
  price: number;
  instructor?: string;
  car?: string;
  duration?: string;
  image?: string;
}

export interface IUserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showProfile: boolean;
    showBookingHistory: boolean;
  };
}
