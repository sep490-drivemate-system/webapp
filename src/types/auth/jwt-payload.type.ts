export interface IJwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  role: string | number;
}
