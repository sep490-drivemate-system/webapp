import { UserRole } from "../auth/user-role.enum";

export enum PermissionCategory {
    USER_MANAGEMENT = "Quản lý người dùng",
    INSTRUCTOR_MANAGEMENT = "Quản lý giảng viên",
    CAR_MANAGEMENT = "Quản lý xe",
    BOOKING_MANAGEMENT = "Quản lý đặt lịch",
    POLICY_MANAGEMENT = "Quản lý chính sách",
    REPORT_MANAGEMENT = "Quản lý báo cáo",
    SYSTEM_SETTINGS = "Cài đặt hệ thống",
}

export enum PermissionAction {
    VIEW = "Xem",
    CREATE = "Tạo",
    EDIT = "Sửa",
    DELETE = "Xóa",
    APPROVE = "Phê duyệt",
    EXPORT = "Xuất dữ liệu",
}

export interface IPermission {
    id: string;
    name: string;
    category: PermissionCategory;
    action: PermissionAction;
    description: string;
}

export interface IRoleWithPermissions {
    role: UserRole;
    roleName: string;
    description: string;
    permissions: string[];
    userCount: number;
    isSystemRole: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRoleStats {
    totalRoles: number;
    totalPermissions: number;
    activeUsers: number;
}
