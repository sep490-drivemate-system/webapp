import { IJwtPayload } from "@/types/auth/jwt-payload.type";
import { UserRole } from "@/types/auth/user-role.enum";
import { jwtDecode } from "jwt-decode";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const handleTokenStorage = (
  accessToken: string,
  refreshToken: string
): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const decodeAccessToken = (): IJwtPayload | null => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return jwtDecode<IJwtPayload>(token);
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (): boolean => {
  const payload = decodeAccessToken();
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
};

export const getUserRole = (): UserRole | null => {
  const payload = decodeAccessToken();
  if (!payload) return null;
  const roleValue = typeof payload.role === "string" ? Number(payload.role) : payload.role;
  if (Number.isNaN(roleValue)) return null;
  return roleValue as UserRole;
};
