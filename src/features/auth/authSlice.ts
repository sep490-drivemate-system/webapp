import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "./authThunk";
import { BaseState } from "@/types/generic/baseState";

interface AuthState extends BaseState {
    isAuthenticated: boolean;

}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.errorMessage = null;
            })
            .addCase(signIn.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.error?.message || "Đăng nhập thất bại";
            });
    },
});

export const { } = authSlice.actions;
export default authSlice.reducer;