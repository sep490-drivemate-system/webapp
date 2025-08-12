import { createSlice } from "@reduxjs/toolkit";
import { signIn } from "./authThunk";
import { getUserRole, isAccessTokenExpired, clearTokens } from "@/lib/jwt/jwt.utils";
import { BaseState } from "@/types/generic/baseState";

interface AuthState extends BaseState {
    isAuthenticated: boolean;
    role: number | null;
}

const isClient = typeof window !== "undefined";
const tokenExpired = isClient ? isAccessTokenExpired() : true;
if (isClient && tokenExpired) {
    // Clear stale tokens early to avoid inconsistent UI state
    try { clearTokens(); } catch { }
}

const initialState: AuthState = {
    isAuthenticated: isClient ? (!!getUserRole() && !tokenExpired) : false,
    role: isClient && !tokenExpired ? (getUserRole() ?? null) : null,
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signOut(state) {
            state.isAuthenticated = false;
            state.role = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.errorMessage = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
        },
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
                state.role = getUserRole() ?? null;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.error?.message || "Đăng nhập thất bại";
            });
    },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;