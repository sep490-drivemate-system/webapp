export interface IJwtPayload {
  UserName?: string;
  Email?: string;
  HashedPassword?: string;
  UpdateAt?: string;
  IsDelete?: string;
  Role: string; // Backend trả về "Admin", "Instructor", etc.
  Id?: string;
  CreatedAt?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}
