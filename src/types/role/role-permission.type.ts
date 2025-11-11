import { UserRole } from "../auth/user-role.enum";

// Permission categories
export enum PermissionCategory {
    USER_MANAGEMENT = "Quản lý người dùng",
    INSTRUCTOR_MANAGEMENT = "Quản lý giảng viên",
    CAR_MANAGEMENT = "Quản lý xe",
    BOOKING_MANAGEMENT = "Quản lý đặt lịch",
    POLICY_MANAGEMENT = "Quản lý chính sách",
    REPORT_MANAGEMENT = "Quản lý báo cáo",
    SYSTEM_SETTINGS = "Cài đặt hệ thống",
}

// Permission actions
export enum PermissionAction {
    VIEW = "Xem",
    CREATE = "Tạo",
    EDIT = "Sửa",
    DELETE = "Xóa",
    APPROVE = "Phê duyệt",
    EXPORT = "Xuất dữ liệu",
}

// Permission interface
export interface IPermission {
    id: string;
    name: string;
    category: PermissionCategory;
    action: PermissionAction;
    description: string;
}

// Role with permissions
export interface IRoleWithPermissions {
    role: UserRole;
    roleName: string;
    description: string;
    permissions: string[]; // Array of permission IDs
    userCount: number;
    isSystemRole: boolean; // Cannot be deleted
    createdAt: Date;
    updatedAt: Date;
}

// Role statistics
export interface IRoleStats {
    totalRoles: number;
    totalPermissions: number;
    activeUsers: number;
}
