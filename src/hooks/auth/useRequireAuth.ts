"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { UserRole } from "@/types/auth/user-role.enum";

export function useRequireAuth(
    allowedRoles?: UserRole[],
) {
    const { isAuthenticated, role } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/signin");
            return;
        }

        if (
            allowedRoles &&
            role != null &&
            !(allowedRoles as unknown as number[]).includes(role)
        ) {
            router.replace("/forbidden");
        }
    }, [
        isAuthenticated,
        role,
        allowedRoles,
        router,
    ]);

    return { isAuthenticated, role };
}


