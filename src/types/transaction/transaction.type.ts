export enum TransactionStatus {
    Pending = 1,
    Processing = 2,
    Completed = 3,
    Fail = 4,
    Cancelled = 5,
    Refunded = 6,
    Deposit = 7
}

export interface Transaction {
    title: string,
    value: number,
    date: Date | string, 
    status: TransactionStatus,
    statusText: string,
}

export interface StatusFilterOption {
    key: TransactionStatus | "all";
    label: string;
}

export interface FilterState {
    timeRange: string;
    amount: string;
    status: string;
}

export interface MonthOption {
    id: string;
    label: string;
    value: string;
}

export interface AmountOption {
    id: string;
    label: string;
    value: number;
}
