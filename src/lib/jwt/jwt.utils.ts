import { IJwtPayload } from "@/types/auth/jwt-payload.type";
import { UserRole } from "@/types/auth/user-role.enum";

export const handleTokenStorage = (
  accessToken: string,
  refreshToken: string
): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getUserRole = (): UserRole => {
  const payload = JSON.parse(
    localStorage.getItem("accessToken") || "{}"
  ) as IJwtPayload;
  return Number(payload?.role) as UserRole;
};
