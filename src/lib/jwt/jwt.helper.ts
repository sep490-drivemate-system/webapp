import { jwtDecode } from "jwt-decode";
import { IJwtPayload } from "@/types/auth/jwt-payload.type";

export class JwtHelper {
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  decode(): IJwtPayload | null {
    return jwtDecode<IJwtPayload>(this.accessToken);
  }

  getPayload(): IJwtPayload | null {
    return this.decode();
  }

  isExpired(): boolean {
    const payload = this.decode();
    if (!payload || !payload.exp) return true;

    const now = Date.now() / 1000;
    return payload.exp < now;
  }

  getAccessToken(): string {
    return this.accessToken;
  }
  getRefreshToken(): string {
    return this.refreshToken;
  }

  getSubject(): string | undefined {
    return this.decode()?.sub;
  }
}
