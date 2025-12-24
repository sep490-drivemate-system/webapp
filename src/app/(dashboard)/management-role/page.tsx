"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Lock, CheckCircle2 } from "lucide-react";
import { mockRoles } from "@/data/mock-roles";
import { mockPermissions } from "@/data/mock-permissions";
import { IRoleWithPermissions, IPermission, PermissionCategory } from "@/types/role/role-permission.type";
import { UserRole } from "@/types/auth/user-role.enum";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ManagementRolePage() {
    const [roles, setRoles] = useState<IRoleWithPermissions[]>(mockRoles);
    const [selectedRole, setSelectedRole] = useState<IRoleWithPermissions | null>(roles[0]);
    const [permissions] = useState<IPermission[]>(mockPermissions);

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.category]) {
            acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
    }, {} as Record<PermissionCategory, IPermission[]>);

    // Check if role has permission
    const hasPermission = (rolePermissions: string[], permissionId: string) => {
        return rolePermissions.includes(permissionId);
    };

    // Toggle permission for role
    const togglePermission = (roleId: UserRole, permissionId: string) => {
        setRoles(roles.map(role => {
            if (role.role === roleId) {
                const hasIt = role.permissions.includes(permissionId);
                return {
                    ...role,
                    permissions: hasIt
                        ? role.permissions.filter(p => p !== permissionId)
                        : [...role.permissions, permissionId],
                    updatedAt: new Date(),
                };
            }
            return role;
        }));

        // Update selected role if it's the one being modified
        if (selectedRole?.role === roleId) {
            const updatedRole = roles.find(r => r.role === roleId);
            if (updatedRole) {
                const hasIt = updatedRole.permissions.includes(permissionId);
                setSelectedRole({
                    ...updatedRole,
                    permissions: hasIt
                        ? updatedRole.permissions.filter(p => p !== permissionId)
                        : [...updatedRole.permissions, permissionId],
                    updatedAt: new Date(),
                });
            }
        }
    };

    // Calculate total permissions for a role
    const getTotalPermissions = (role: IRoleWithPermissions) => {
        return role.permissions.length;
    };

    return (
        <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý vai trò & quyền</h1>
                    <p className="text-muted-foreground mt-2">
                        Quản lý vai trò người dùng và phân quyền truy cập hệ thống
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng vai trò</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roles.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Vai trò hệ thống
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng quyền</CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{permissions.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Quyền truy cập
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {roles.reduce((sum, role) => sum + role.userCount, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tổng người dùng
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vai trò hệ thống</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {roles.filter(r => r.isSystemRole).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Không thể xóa
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Roles List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Danh sách vai trò</CardTitle>
                        <CardDescription>
                            Chọn vai trò để xem và chỉnh sửa quyền
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-2">
                                {roles.map((role) => (
                                    <div
                                        key={role.role}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                            selectedRole?.role === role.role
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <h3 className="font-semibold">{role.roleName}</h3>
                                            </div>
                                            {role.isSystemRole && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Hệ thống
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {role.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {role.userCount} người dùng
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Lock className="h-3 w-3" />
                                                {getTotalPermissions(role)} quyền
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Permissions Management */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    Quyền của vai trò: {selectedRole?.roleName}
                                </CardTitle>
                                <CardDescription>
                                    Chọn các quyền truy cập cho vai trò này
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {selectedRole ? getTotalPermissions(selectedRole) : 0} / {permissions.length} quyền
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedRole ? (
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-6">
                                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                                        <div key={category}>
                                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-primary" />
                                                {category}
                                            </h3>
                                            <div className="space-y-3 ml-6">
                                                {perms.map((permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                                    >
                                                        <Checkbox
                                                            id={`${selectedRole.role}-${permission.id}`}
                                                            checked={hasPermission(selectedRole.permissions, permission.id)}
                                                            onCheckedChange={() => togglePermission(selectedRole.role, permission.id)}
                                                            disabled={selectedRole.isSystemRole && selectedRole.role === 1} // Admin can't be modified
                                                        />
                                                        <div className="flex-1 space-y-1">
                                                            <Label
                                                                htmlFor={`${selectedRole.role}-${permission.id}`}
                                                                className="text-sm font-medium leading-none cursor-pointer"
                                                            >
                                                                {permission.name}
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground">
                                                                {permission.description}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {permission.action}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="mt-4" />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                                Chọn một vai trò để xem quyền
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Info Note */}
            <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-blue-900">
                                Lưu ý về phân quyền
                            </p>
                            <p className="text-sm text-blue-700">
                                • Vai trò <strong>Admin</strong> có toàn quyền và không thể chỉnh sửa quyền<br />
                                • Các vai trò hệ thống không thể bị xóa<br />
                                • Thay đổi quyền sẽ áp dụng ngay lập tức cho tất cả người dùng có vai trò đó<br />
                                • Cẩn thận khi gỡ bỏ quyền quan trọng
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
