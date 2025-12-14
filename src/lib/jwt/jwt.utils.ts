import { IJwtPayload } from "@/types/auth/jwt-payload.type";
import { UserRole } from "@/types/auth/user-role.enum";
import { jwtDecode } from "jwt-decode";

export const ACCESS_TOKEN_KEY = "access_token";

export const handleTokenStorage = (
  accessToken: string
): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
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
  if (!payload?.role) return null;

  switch (payload.role.toLowerCase()) {
    case "demo":
      return UserRole.Demo;
    case "admin":
      return UserRole.Admin;
    case "inspector":
      return UserRole.Inspector;
    case "novicedriver":
      return UserRole.NoviceDriver;
    case "instructor":
      return UserRole.Instructor;
    default:
      console.log("Unknown role:", payload.role);
      return null;
  }
};

export const getUserInfo = () => {
  const payload = decodeAccessToken();
  if (!payload) return null;

  return {
    userName: payload.username,
    email: payload.email,
    role: getUserRole(),
    id: payload.id,
    // createdAt: payload.createdAt
  };
};
