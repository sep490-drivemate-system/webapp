import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { Transaction } from "@/types/transaction/transaction.type";
import { TransactionFilter, Transactions } from "@/types/transaction/transaction.filter.type";
import { PaginatedGeneric } from "@/types/generic/genericResponse";

export const TRANSACTION_PATH = "transaction";

export const getUserTransactions = createThunk<Transaction[], void>(
    HttpMethod.GET,
    "getUserTransactions",
    `/${TRANSACTION_PATH}/user`
);

export const getTransactions = createThunk<
    PaginatedGeneric<Transactions>,
    TransactionFilter
>(
    HttpMethod.GET,
    "getTransactions",
    `/${TRANSACTION_PATH}`,
    {
        config: (payload) => {
            const params: Record<string, string> = {};
            if (payload.PageNumber) {
                params.PageNumber = payload.PageNumber.toString();
            }
            if (payload.PageSize) {
                params.PageSize = payload.PageSize.toString();
            }
            if (payload.status) {
                params.status = payload.status.toString();
            }
            return {
                params: Object.keys(params).length > 0 ? params : undefined
            };
        }
    }
);

