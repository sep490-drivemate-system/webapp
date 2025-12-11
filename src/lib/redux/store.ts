import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import documentReducer from '@/features/document/documentSlice';
import transactionReducer from '@/features/transaction/transactionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
        transaction: transactionReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
