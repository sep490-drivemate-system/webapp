
export enum WithdrawStatus {
    Approved,
    Rejected,
}

export interface IWithdrawal {
    status: WithdrawStatus;
    transactionId: string;
    reason: string;
    email: string;
    fullName: string;
    paymentMethod: BankType;
}


export enum BankType {
    VnPay = 1,
    ZaloPay = 2,
    PayOs = 3,
}

