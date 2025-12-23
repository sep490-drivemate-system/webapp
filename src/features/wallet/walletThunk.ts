import { createThunk } from "../genericCreateThunk";
import { HttpMethod } from "@/types/constants/httpMethod";
import { IWithdrawal } from "@/types/withdrawal/withdrawal.type";

export const WALLET_PATH = "wallet";

export const Withdrawals = createThunk<string | null, IWithdrawal>(
    HttpMethod.POST,
    "withdraw",
    `/${WALLET_PATH}/withdraw`
);

