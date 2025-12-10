import { createSlice } from "@reduxjs/toolkit";
import { sendEmailCode, signIn, signUp } from "./authThunk";
import {
  getUserRole,
  isAccessTokenExpired,
  clearTokens,
} from "@/lib/jwt/jwt.utils";
import { BaseState } from "@/types/generic/baseState";
import {
  ISignUpRequest,
} from "@/types/auth/signup.type";
import { ISignInRequest } from "@/types/auth/signin.type";

export interface AuthState extends BaseState {
  // Authentication state
  signInData: ISignInRequest;
  isAuthenticated: boolean;
  role: number | null;

  // Signup flow state
  inputCode: string;
  verificationCode: string;
  signupData: ISignUpRequest;
}

const isClient = typeof window !== "undefined";
const tokenExpired = isClient ? isAccessTokenExpired() : true;
if (isClient && tokenExpired) {
  // Clear stale tokens early to avoid inconsistent UI state
  try {
    clearTokens();
  } catch {}
}

const initialState: AuthState = {
  // BaseState properties
  isLoading: false,
  errorMessage: null,
  isSuccess: false,

  // Authentication state
  signInData: {
    password: "",
    emailOrPhone: "",
  },
  isAuthenticated: isClient ? !!getUserRole() && !tokenExpired : false,
  role: isClient && !tokenExpired ? getUserRole() ?? null : null,

  // Signup flow state
  inputCode: "",
  verificationCode: "",
  signupData: {
    phoneNumber: "",
    email: "",
    password: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOutLocal(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = null;
      state.signInData = {
        emailOrPhone: "",
        password: "",
      };
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
    setSignupVerificationCode(state, action) {
      state.verificationCode = action.payload;
    },
    setInputCode(state, action) {
      state.inputCode = action.payload;
    },
    resetSignupFlow(state) {
      state.inputCode = "";
      state.verificationCode = "";
      state.signupData = {
        phoneNumber: "",
        email: "",
        password: "",
      };
    },
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setSignInEmailOrPhone(state, action) {
      state.signInData.emailOrPhone = action.payload;
    },
    setSignInPassword(state, action) {
      state.signInData.password = action.payload;
    },
    resetSignInData(state) {
      state.signInData = {
        emailOrPhone: "",
        password: "",
      };
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
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inputCode = "";
        state.verificationCode = "";
        state.signupData = {
          phoneNumber: "",
          email: "",
          password: "",
        };
      })
      .addCase(signUp.rejected, (state) => {
        state.isLoading = false;
        // state.errorMessage = action.error?.message || "Đăng ký thất bại";
      })
      .addCase(sendEmailCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.verificationCode = action.payload.value || "";
      })
      .addCase(sendEmailCode.rejected, (state) => {
        state.isLoading = false;
        // state.errorMessage = action.error?.message || "Đăng nhập thất bại";
      })
      .addCase(sendEmailCode.pending, (state) => {
        state.isLoading = true;
        // state.errorMessage = action.error?.message || "Đăng nhập thất bại";
      });
  },
});

export const {
  signOutLocal,
  setSignupVerificationCode,
  setInputCode,
  resetSignupFlow,
  setSignupData,
  setSignInEmailOrPhone,
  setSignInPassword,
  resetSignInData,
} = authSlice.actions;
export default authSlice.reducer;
