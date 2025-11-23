export interface IJwtPayload {
  username?: string;
  email?: string;
  role: string;
  id?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}
