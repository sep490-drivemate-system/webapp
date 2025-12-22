import { UserRole } from "../auth/user-role.enum";

export interface IUserManagement {
    id: string;
    userName: string;
    email: string;
    phone: string;
    role: UserRole;
    createdAt: Date;
    status: string;
}