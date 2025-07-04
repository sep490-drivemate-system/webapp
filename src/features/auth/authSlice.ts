import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "./authThunk";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
    isSuccess: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    errorMessage: null,
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.isError = false;
            state.errorMessage = null;
            state.isSuccess = false;
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
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
                state.isError = true;
                state.errorMessage = action.error?.message || "Đăng nhập thất bại";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;