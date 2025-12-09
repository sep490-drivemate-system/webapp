import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState } from "@/types/generic/baseState";

export interface UserState extends BaseState {
}

const initialState: UserState = {
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.errorMessage = action.payload;
            if (action.payload) {
                state.isLoading = false;
            }
        },
        setSuccess: (state, action: PayloadAction<boolean>) => {
            state.isSuccess = action.payload;
        },
    },
});

export const {
    setLoading,
    setError,
    setSuccess,
} = userSlice.actions;

export default userSlice.reducer;
