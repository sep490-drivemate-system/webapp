import { IPaginatedOption } from "../generic/paginatedOption";
import { TransactionStatus } from "./transaction.type";

export interface TransactionFilter extends IPaginatedOption {
    status?: TransactionStatus;
}

export interface Transactions {
    id: string;
    transactionValue: number;
    status: TransactionStatus;
    transactionNote: string;
    referenceCode: string;
    updatedAt: string;
    fromWalletId: string;
    fullName: string;
    email: string;
}
