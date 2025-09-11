import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { signIn } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { ISignInRequest } from "@/types/auth/signin.type";

export const useSignIn = () => {
    const { runSafe: runSignIn, loading } = useThunkAction(signIn);
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    const handleSignIn = async (data: ISignInRequest) => {
        const res = await runSignIn(data);
        if (res.ok) {
            const role = getUserRole();
            if (role === UserRole.Admin) router.push("/dashboard");
            else router.push("/");
        }
    };

    return {
        ...auth,
        isLoading: auth.isLoading || loading,
        handleSignIn,
    };
};
