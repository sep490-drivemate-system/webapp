import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { signIn } from "@/features/auth/authThunk";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import type { SigninSchema } from "@/schemas/auth/signin.schema";

export const useSignIn = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);

    const handleSignIn = async (data: SigninSchema) => {
        const result = await dispatch(signIn(data));

        if (signIn.fulfilled.match(result)) {
            const role = getUserRole();
            if (role === UserRole.Trainee) router.push("/");
            else if (role === UserRole.DrivingCenter) router.push("/center/dashboard");
            else if (role === UserRole.Mentor) router.push("/mentor/dashboard");
            else router.push("/admin/dashboard");
        }
    };

    return {
        ...auth,
        handleSignIn,
    };
};
