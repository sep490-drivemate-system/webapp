import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import documentReducer from '@/features/document/documentSlice';
import type { AuthState } from '@/features/auth/authSlice';
import type { DocumentState } from '@/features/document/documentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = {
    auth: AuthState;
    document: DocumentState;
};
export type AppDispatch = typeof store.dispatch;
