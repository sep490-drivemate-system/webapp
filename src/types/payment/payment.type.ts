export enum PaymentStatus {
    Pending = 1,
    Processing = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5,
    Refunded = 6,
    Deposit = 7,
}


export interface PaymentStats {
    totalPending: number;
    totalProcessing: number;
    totalCompleted: number;
    totalFailed: number;
    totalCancelled: number;
    totalRefunded: number;
    totalDeposit: number;
    totalAmountPending: number;
    totalAmountProcessing: number;
    totalAmountCompleted: number;
    totalAmountFailed: number;
    totalAmountCancelled: number;
    totalAmountRefunded: number;
    totalAmountDeposit: number;
}


