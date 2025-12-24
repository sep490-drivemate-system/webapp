export interface IDrivingSession {
    id: string;
    packageId: string;
    instructorId: string;
    instructorName: string;
    displayName?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    location: string;
    vehicleId?: string;
    startingLatitude?: number;
    startingLongtitude?: number;
    vehicleName?: string;
    status: "planing" | "upcoming" | "in_progress" | "completed" | "reschedule" | "cancelled";
    createdAt: string;
}

export interface IUserPackage {
    id: string;
    packageId: string;
    packageName: string;
    price?: number; 
    instructorId: string;
    instructorName: string;
    instructorAvatar: string;
    totalHours: number;
    usedHours: number;
    remainingHours: number;
    purchaseDate: string;
    status: "paid" | "in_progress" | "completed" | "refunded" | "not_refund";
    sessions: IDrivingSession[];
}



export interface IInstructorBusyTime {
    instructorId: string;
    date: string;
    busySlots: {
        startTime: string;
        endTime: string;
    }[];
}

export enum BookingStatus {
    All = 0,
    Purchased = 1,
    InUse = 2,
    Used = 3,
    CancellationWithRefund = 4,
    CancellationWithoutRefund = 5,
}

export interface IUserPackageAPI {
    id: string;
    nameInstructor: string;
    instructorId:string;
    namePackake: string;
    carId:string;
    carPrice:number;
    bookingStatus: BookingStatus;
    avatarInstructor: string;
    buyDate: string;
    duration: number;
    durationInUse: number;
    precentInUse: number;
    remainingTime: number;
}

export interface IGetUserPackagesParams {
    bookingStatus?: BookingStatus;
}
