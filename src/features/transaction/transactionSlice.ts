import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState } from "@/types/generic/baseState";
import { Transaction } from "@/types/transaction/transaction.type";
import { getUserTransactions } from "./transactionThunk";

export interface TransactionState extends BaseState {
    transactions: Transaction[];
}

const initialState: TransactionState = {
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
    transactions: [],
};

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
        clearTransactions: (state) => {
            state.transactions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserTransactions.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(getUserTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const response = action.payload as any;
                
                let transactions: any[] = [];
                
                if (Array.isArray(response)) {
                    transactions = response;
                } else if (response?.value?.pageContent && Array.isArray(response.value.pageContent)) {
                    transactions = response.value.pageContent;
                } else if (Array.isArray(response?.value)) {
                    transactions = response.value;
                }
                
                state.transactions = transactions.map((transaction: any) => ({
                    ...transaction,
                    date: transaction.date instanceof Date 
                        ? transaction.date.toISOString()
                        : transaction.date,
                }));
            })
            .addCase(getUserTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.errorMessage = action.payload || action.error.message || 'Không thể tải danh sách giao dịch';
            });
    },
});

export const {
    clearError,
    clearSuccess,
    clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;

