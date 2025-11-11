import { IPermission, PermissionCategory, PermissionAction } from "@/types/role/role-permission.type";

export const mockPermissions: IPermission[] = [
    // User Management
    {
        id: "perm_user_view",
        name: "Xem danh sách người dùng",
        category: PermissionCategory.USER_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem danh sách và thông tin người dùng trong hệ thống",
    },
    {
        id: "perm_user_create",
        name: "Tạo người dùng mới",
        category: PermissionCategory.USER_MANAGEMENT,
        action: PermissionAction.CREATE,
        description: "Tạo tài khoản người dùng mới",
    },
    {
        id: "perm_user_edit",
        name: "Chỉnh sửa người dùng",
        category: PermissionCategory.USER_MANAGEMENT,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa thông tin người dùng",
    },
    {
        id: "perm_user_delete",
        name: "Xóa người dùng",
        category: PermissionCategory.USER_MANAGEMENT,
        action: PermissionAction.DELETE,
        description: "Xóa tài khoản người dùng khỏi hệ thống",
    },

    // Instructor Management
    {
        id: "perm_instructor_view",
        name: "Xem danh sách giảng viên",
        category: PermissionCategory.INSTRUCTOR_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem danh sách và thông tin giảng viên",
    },
    {
        id: "perm_instructor_create",
        name: "Thêm giảng viên",
        category: PermissionCategory.INSTRUCTOR_MANAGEMENT,
        action: PermissionAction.CREATE,
        description: "Thêm giảng viên mới vào hệ thống",
    },
    {
        id: "perm_instructor_edit",
        name: "Chỉnh sửa giảng viên",
        category: PermissionCategory.INSTRUCTOR_MANAGEMENT,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa thông tin giảng viên",
    },
    {
        id: "perm_instructor_approve",
        name: "Phê duyệt giảng viên",
        category: PermissionCategory.INSTRUCTOR_MANAGEMENT,
        action: PermissionAction.APPROVE,
        description: "Phê duyệt hồ sơ giảng viên",
    },

    // Car Management
    {
        id: "perm_car_view",
        name: "Xem danh sách xe",
        category: PermissionCategory.CAR_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem danh sách và thông tin xe",
    },
    {
        id: "perm_car_create",
        name: "Thêm xe mới",
        category: PermissionCategory.CAR_MANAGEMENT,
        action: PermissionAction.CREATE,
        description: "Thêm xe mới vào hệ thống",
    },
    {
        id: "perm_car_edit",
        name: "Chỉnh sửa thông tin xe",
        category: PermissionCategory.CAR_MANAGEMENT,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa thông tin xe",
    },
    {
        id: "perm_car_delete",
        name: "Xóa xe",
        category: PermissionCategory.CAR_MANAGEMENT,
        action: PermissionAction.DELETE,
        description: "Xóa xe khỏi hệ thống",
    },

    // Booking Management
    {
        id: "perm_booking_view",
        name: "Xem danh sách đặt lịch",
        category: PermissionCategory.BOOKING_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem danh sách đặt lịch",
    },
    {
        id: "perm_booking_create",
        name: "Tạo đặt lịch",
        category: PermissionCategory.BOOKING_MANAGEMENT,
        action: PermissionAction.CREATE,
        description: "Tạo lịch đặt mới",
    },
    {
        id: "perm_booking_edit",
        name: "Chỉnh sửa đặt lịch",
        category: PermissionCategory.BOOKING_MANAGEMENT,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa thông tin đặt lịch",
    },
    {
        id: "perm_booking_approve",
        name: "Phê duyệt đặt lịch",
        category: PermissionCategory.BOOKING_MANAGEMENT,
        action: PermissionAction.APPROVE,
        description: "Phê duyệt hoặc từ chối đặt lịch",
    },

    // Policy Management
    {
        id: "perm_policy_view",
        name: "Xem chính sách",
        category: PermissionCategory.POLICY_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem các chính sách hệ thống",
    },
    {
        id: "perm_policy_edit",
        name: "Chỉnh sửa chính sách",
        category: PermissionCategory.POLICY_MANAGEMENT,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa các tham số chính sách",
    },

    // Report Management
    {
        id: "perm_report_view",
        name: "Xem báo cáo",
        category: PermissionCategory.REPORT_MANAGEMENT,
        action: PermissionAction.VIEW,
        description: "Xem các báo cáo thống kê",
    },
    {
        id: "perm_report_export",
        name: "Xuất báo cáo",
        category: PermissionCategory.REPORT_MANAGEMENT,
        action: PermissionAction.EXPORT,
        description: "Xuất báo cáo ra file",
    },

    // System Settings
    {
        id: "perm_system_view",
        name: "Xem cài đặt hệ thống",
        category: PermissionCategory.SYSTEM_SETTINGS,
        action: PermissionAction.VIEW,
        description: "Xem cài đặt hệ thống",
    },
    {
        id: "perm_system_edit",
        name: "Chỉnh sửa cài đặt",
        category: PermissionCategory.SYSTEM_SETTINGS,
        action: PermissionAction.EDIT,
        description: "Chỉnh sửa cài đặt hệ thống",
    },
];
