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

export interface IPackagePurchase {
  id: string;
  packageName: string;
  packageType: string;
  purchaseDate: string;
  price: number;
  status: "active" | "completed" | "expired";
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  instructor?: string;
  startDate: string;
  endDate: string;
  image?: string;
}

export interface IWalletTransaction {
  id: string;
  type: "deposit" | "payment" | "refund";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
  paymentMethod?: string;
  transactionCode?: string;
}

export interface IUserWallet {
  balance: number;
  currency: string;
  transactions: IWalletTransaction[];
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
