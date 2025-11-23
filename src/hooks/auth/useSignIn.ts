import { useAppSelector, useAppDispatch } from "@/lib/redux/useAppDispatch";
import { signIn, signOut } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import {
    getUserRole,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    handleTokenStorage,
    getUserInfo
} from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { setSignInEmailOrPhone, setSignInPassword, resetSignInData, signOutLocal } from "@/features/auth/authSlice";

export const useSignIn = () => {
    const { runSafe: runSignIn, loading: signInLoading } = useThunkAction(signIn);
    const { runSafe: runSignOut, loading: signOutLoading } = useThunkAction(signOut);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const handleSignIn = async () => {
        const signInData = auth.signInData;
        const res = await runSignIn(signInData);
        if (res.ok) {
            dispatch(resetSignInData());
            const role = getUserRole();
            if (role === UserRole.Admin) router.push("/dashboard");
            else if (role === UserRole.Inspector) router.push("/instructor-management");
            else router.push("/");
        }
    };

    const updateEmailOrPhone = (value: string) => {
        dispatch(setSignInEmailOrPhone(value));
    };

    const updatePassword = (value: string) => {
        dispatch(setSignInPassword(value));
    };

    // Token management utilities
    const saveTokens = (accessToken: string, refreshToken: string) => {
        handleTokenStorage(accessToken, refreshToken);
    };

    const getCurrentTokens = () => {
        return {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken()
        };
    };

    const removeTokens = () => {
        clearTokens();
        dispatch(resetSignInData());
    };

    const isTokenAvailable = () => {
        const tokens = getCurrentTokens();
        return !!(tokens.accessToken && tokens.refreshToken);
    };

    // Logout functionality
    const handleLogout = async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            // Call API to logout with refreshToken
            const res = await runSignOut({ refreshToken });
            if (res.ok) {
                // Redirect to login page after successful logout
                router.push("/signin");
            }
        } else {
            // If no refreshToken, just clear local state
            dispatch(signOutLocal());
            router.push("/signin");
        }
    };

    // Local logout (without API call)
    const handleLocalLogout = () => {
        dispatch(signOutLocal());
        router.push("/signin");
    };

    return {
        ...auth,
        isLoading: auth.isLoading || signInLoading || signOutLoading,
        handleSignIn,
        updateEmailOrPhone,
        updatePassword,
        // Logout functions
        handleLogout,
        handleLocalLogout,
        // Token utilities
        saveTokens,
        getCurrentTokens,
        removeTokens,
        isTokenAvailable,
    };
};
