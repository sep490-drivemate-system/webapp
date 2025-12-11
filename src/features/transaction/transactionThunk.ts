import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { Transaction } from "@/types/transaction/transaction.type";

export const TRANSACTION_PATH = "transaction";

/**
 * Get user transactions
 * GET /transaction/user
 */
export const getUserTransactions = createThunk<Transaction[], void>(
    HttpMethod.GET,
    "getUserTransactions",
    `/${TRANSACTION_PATH}/user`
);

