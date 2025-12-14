import { useAppSelector, useAppDispatch } from "@/lib/redux/useAppDispatch";
import { signIn } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import {
    getUserRole,
    getAccessToken,
    clearTokens,
    handleTokenStorage,
    getUserInfo
} from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { ISignInRequest, ISignInResponse } from "@/types/auth/signin.type";
import { setSignInEmailOrPhone, setSignInPassword, resetSignInData, signOut } from "@/features/auth/authSlice";

export const useSignIn = () => {
    const { runSafe: runSignIn, loading: signInLoading } = useThunkAction(signIn);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const handleSignIn = async () => {
        const signInData = auth.signInData;
        const res = await runSignIn(signInData);
        if (res.ok) {
            dispatch(resetSignInData());
            const role = getUserRole();
            if (role === UserRole.Admin) router.push("/dashboards");
            else if (role === UserRole.Inspector) router.push("/instructor-management");
            else if (role === UserRole.Instructor) router.push("/overview");
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
        handleTokenStorage(accessToken);
    };

    const getCurrentTokens = () => {
        return {
            accessToken: getAccessToken(),
        };
    };

    const removeTokens = () => {
        clearTokens();
        dispatch(resetSignInData());
    };

    const isTokenAvailable = () => {
        const tokens = getCurrentTokens();
        return !!(tokens.accessToken);
    };

    const handleSignOut = async () => {
        dispatch(signOut());
        router.push("/signin");
    };

    const handleLocalLogout = () => {
        dispatch(signOut());
        router.push("/signin");
    };

    return {
        ...auth,
        isLoading: auth.isLoading || signInLoading,
        handleSignIn,
        updateEmailOrPhone,
        updatePassword,
        handleSignOut,
        handleLocalLogout,
        saveTokens,
        getCurrentTokens,
        removeTokens,
        isTokenAvailable,
    };
};
