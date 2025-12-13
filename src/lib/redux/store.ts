import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import documentReducer from '@/features/document/documentSlice';
import transactionReducer from '@/features/transaction/transactionSlice';
import bookingReducer from '@/features/booking/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
        transaction: transactionReducer,
        booking: bookingReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
