import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { signOut } from '@/features/auth/authSlice';
import documentReducer from '@/features/document/documentSlice';
import transactionReducer from '@/features/transaction/transactionSlice';
import bookingReducer from '@/features/booking/bookingSlice';
import blogReducer from '@/features/blog/blogSlice';
import policyReducer from '@/features/policy/policySlice';

const appReducer = combineReducers({
        auth: authReducer,
        document: documentReducer,
        transaction: transactionReducer,
        booking: bookingReducer,
        blog: blogReducer,
        policy: policyReducer,
});

const rootReducer = (
    state: ReturnType<typeof appReducer> | undefined,
    action: AnyAction
) => {
    if (action.type === signOut.type) {
        state = undefined;
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
