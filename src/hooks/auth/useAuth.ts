import { signOutLocal } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(signOutLocal());
    router.push("/signin");
  };
  return { isAuthenticated, role, router, dispatch, handleSignOut };
};
