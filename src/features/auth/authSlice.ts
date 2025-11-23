import { createSlice } from "@reduxjs/toolkit";
import { sendEmailCode, signIn, signUp, signOut } from "./authThunk";
import { getUserRole, isAccessTokenExpired, clearTokens } from "@/lib/jwt/jwt.utils";
import { BaseState } from "@/types/generic/baseState";
import { SignupMethod, SignupStep, ISignUpRequest } from "@/types/auth/signup.type";
import { ISignInRequest } from "@/types/auth/signin.type";

interface SignupData {
    method: SignupMethod;
    contact: string;
    basicInfo: {
        signUpRequest: ISignUpRequest,
        confirmPassword: string;
    };
}
export interface AuthState extends BaseState {
    // Authentication state
    signInData: ISignInRequest
    isAuthenticated: boolean;
    role: number | null;

    // Signup flow state
    currentStep: SignupStep;
    inputCode: string;
    verificationCode: string;
    signupData: SignupData;
}

const isClient = typeof window !== "undefined";
const tokenExpired = isClient ? isAccessTokenExpired() : true;
if (isClient && tokenExpired) {
    // Clear stale tokens early to avoid inconsistent UI state
    try { clearTokens(); } catch { }
}

const initialState: AuthState = {
    // BaseState properties
    isLoading: false,
    errorMessage: null,
    isSuccess: false,

    // Authentication state
    signInData: {
        password: '',
        emailOrPhone: '',
    },
    isAuthenticated: isClient ? (!!getUserRole() && !tokenExpired) : false,
    role: isClient && !tokenExpired ? (getUserRole() ?? null) : null,

    // Signup flow state
    currentStep: 1,
    inputCode: '',
    verificationCode: '',
    signupData: {
        method: SignupMethod.EMAIL,
        contact: '',
        basicInfo: {
            signUpRequest: {
                userName: '',
                password: '',
                emailOrPhone: '',
            },
            confirmPassword: ''
        }
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
                emailOrPhone: '',
                password: ''
            };
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
        },
        setCurrentStep(state, action) {
            state.currentStep = action.payload;
        },
        setSignupMethod(state, action) {
            state.signupData.method = action.payload;
        },
        setSignupContact(state, action) {
            state.signupData.contact = action.payload;
            state.signupData.basicInfo.signUpRequest.emailOrPhone = action.payload;
        },
        setSignupVerificationCode(state, action) {
            state.verificationCode = action.payload;
        },
        setUserNameChange(state, action) {
            state.signupData.basicInfo.signUpRequest.userName = action.payload;
        },
        setPasswordChange(state, action) {
            state.signupData.basicInfo.signUpRequest.password = action.payload;
        },
        setConfirmPasswordChange(state, action) {
            state.signupData.basicInfo.confirmPassword = action.payload;
        },
        setInputCode(state, action) {
            state.inputCode = action.payload;
        },
        resetSignupFlow(state) {
            state.currentStep = 1;
            state.inputCode = '';
            state.verificationCode = '';
            state.signupData = {
                method: SignupMethod.EMAIL,
                contact: '',
                basicInfo: { signUpRequest: { userName: '', password: '', emailOrPhone: '' }, confirmPassword: '' }
            };
        },
        setSignInEmailOrPhone(state, action) {
            state.signInData.emailOrPhone = action.payload;
        },
        setSignInPassword(state, action) {
            state.signInData.password = action.payload;
        },
        resetSignInData(state) {
            state.signInData = {
                emailOrPhone: '',
                password: ''
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
                state.currentStep = 1;
                state.inputCode = '';
                state.verificationCode = '';
                state.signupData = {
                    method: SignupMethod.EMAIL,
                    contact: '',
                    basicInfo: { signUpRequest: { userName: '', password: '', emailOrPhone: '' }, confirmPassword: '' }
                };
            })
            .addCase(signUp.rejected, (state) => {
                state.isLoading = false;
                // state.errorMessage = action.error?.message || "Đăng ký thất bại";
            })
            .addCase(sendEmailCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.verificationCode = action.payload.value || '';
            })
            .addCase(sendEmailCode.rejected, (state) => {
                state.isLoading = false;
                // state.errorMessage = action.error?.message || "Đăng nhập thất bại";
            })
            .addCase(sendEmailCode.pending, (state) => {
                state.isLoading = true;
                // state.errorMessage = action.error?.message || "Đăng nhập thất bại";
            })
            .addCase(signOut.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.role = null;
                state.isLoading = false;
                state.isSuccess = true;
                state.signInData = {
                    emailOrPhone: '',
                    password: ''
                };
            })
            .addCase(signOut.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.error?.message || "Đăng xuất thất bại";
            });
    },
});

export const {
    signOutLocal,
    setCurrentStep,
    setSignupMethod,
    setSignupContact,
    setSignupVerificationCode,
    setInputCode,
    setUserNameChange,
    setPasswordChange,
    setConfirmPasswordChange,
    resetSignupFlow,
    setSignInEmailOrPhone,
    setSignInPassword,
    resetSignInData
} = authSlice.actions;
export default authSlice.reducer;