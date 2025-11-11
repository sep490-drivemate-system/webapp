import { IRoleWithPermissions } from "@/types/role/role-permission.type";
import { UserRole } from "@/types/auth/user-role.enum";

export const mockRoles: IRoleWithPermissions[] = [
    {
        role: UserRole.Admin,
        roleName: "Admin",
        description: "Quản trị viên có toàn quyền truy cập và quản lý hệ thống",
        permissions: [
            // All permissions
            "perm_user_view", "perm_user_create", "perm_user_edit", "perm_user_delete",
            "perm_instructor_view", "perm_instructor_create", "perm_instructor_edit", "perm_instructor_approve",
            "perm_car_view", "perm_car_create", "perm_car_edit", "perm_car_delete",
            "perm_booking_view", "perm_booking_create", "perm_booking_edit", "perm_booking_approve",
            "perm_policy_view", "perm_policy_edit",
            "perm_report_view", "perm_report_export",
            "perm_system_view", "perm_system_edit",
        ],
        userCount: 2,
        isSystemRole: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        role: UserRole.Inspector,
        roleName: "Inspector",
        description: "Người kiểm duyệt có quyền phê duyệt giảng viên và đặt lịch",
        permissions: [
            "perm_user_view",
            "perm_instructor_view", "perm_instructor_approve",
            "perm_car_view",
            "perm_booking_view", "perm_booking_approve",
            "perm_policy_view",
            "perm_report_view",
        ],
        userCount: 3,
        isSystemRole: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        role: UserRole.Instructor,
        roleName: "Instructor",
        description: "Giảng viên có quyền xem và quản lý lịch dạy của mình",
        permissions: [
            "perm_booking_view",
            "perm_car_view",
            "perm_policy_view",
        ],
        userCount: 5,
        isSystemRole: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        role: UserRole.NoviceDriver,
        roleName: "Novice Driver",
        description: "Học viên có quyền đặt lịch và xem thông tin",
        permissions: [
            "perm_instructor_view",
            "perm_car_view",
            "perm_booking_view", "perm_booking_create",
            "perm_policy_view",
        ],
        userCount: 8,
        isSystemRole: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
];
