import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { signIn, signUp } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import type { SigninSchema } from "@/schemas/auth/signin.schema";
import { SignupSchema } from "@/schemas/auth/signup.schema";

export const useSignUp = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    const handleSignUp = async (data: SignupSchema) => {
        const result = await dispatch(signUp(data));

        if (signUp.fulfilled.match(result)) {
            router.push("/");
        }
    };

    return {
        ...auth,
        handleSignUp,
    };
};
