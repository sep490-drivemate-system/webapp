import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { signUp } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import { SignupSchema } from "@/schemas/auth/signup.schema";
import { useThunkAction } from "@/lib/redux/useThunkAction";

export const useSignUp = () => {
    const { runSafe: runSignUp, loading } = useThunkAction(signUp);
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    const handleSignUp = async (data: SignupSchema) => {
        const res = await runSignUp(data);
        if (res.ok) {
            router.push("/");
        }
    };

    return {
        ...auth,
        isLoading: auth.isLoading || loading,
        handleSignUp,
    };
};
