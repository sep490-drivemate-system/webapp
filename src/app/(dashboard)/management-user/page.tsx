"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Filter, X } from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";
import { UserDataTable, type User } from "@/components/commons/dashboard/user-data-table";

// Using User type from UserDataTable component

// Mock data
const initialUsers: User[] = [
    {
        id: "1",
        name: "Nguyễn Văn An",
        email: "nguyenvanan@example.com",
        phone: "0901234567",
        role: "Admin",
        status: "Active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        name: "Trần Thị Bình",
        email: "tranthibinh@example.com",
        phone: "0912345678",
        role: "Manager",
        status: "Active",
        createdAt: "2024-02-20",
    },
    {
        id: "3",
        name: "Lê Văn Cường",
        email: "levancuong@example.com",
        phone: "0923456789",
        role: "Instructor",
        status: "Active",
        createdAt: "2024-03-10",
    },
    {
        id: "4",
        name: "Phạm Thị Dung",
        email: "phamthidung@example.com",
        phone: "0934567890",
        role: "Student",
        status: "Inactive",
        createdAt: "2024-03-25",
    },
    {
        id: "5",
        name: "Hoàng Minh Đức",
        email: "hoangminhduc@example.com",
        phone: "0945678901",
        role: "Instructor",
        status: "Active",
        createdAt: "2024-04-05",
    },
    {
        id: "6",
        name: "Vũ Thị Hoa",
        email: "vuthihoa@example.com",
        phone: "0956789012",
        role: "Student",
        status: "Active",
        createdAt: "2024-04-12",
    },
    {
        id: "7",
        name: "Đỗ Văn Hùng",
        email: "dovanhung@example.com",
        phone: "0967890123",
        role: "Manager",
        status: "Active",
        createdAt: "2024-04-18",
    },
    {
        id: "8",
        name: "Bùi Thị Lan",
        email: "buithilan@example.com",
        phone: "0978901234",
        role: "Student",
        status: "Suspended",
        createdAt: "2024-04-22",
    },
    {
        id: "9",
        name: "Ngô Văn Minh",
        email: "ngovanminh@example.com",
        phone: "0989012345",
        role: "Instructor",
        status: "Active",
        createdAt: "2024-05-01",
    },
    {
        id: "10",
        name: "Lý Thị Nga",
        email: "lythinga@example.com",
        phone: "0990123456",
        role: "Student",
        status: "Active",
        createdAt: "2024-05-08",
    },
    {
        id: "11",
        name: "Trương Văn Phúc",
        email: "truongvanphuc@example.com",
        phone: "0901234568",
        role: "Student",
        status: "Inactive",
        createdAt: "2024-05-15",
    },
    {
        id: "12",
        name: "Đinh Thị Quỳnh",
        email: "dinhthiquynh@example.com",
        phone: "0912345679",
        role: "Instructor",
        status: "Active",
        createdAt: "2024-05-20",
    },
    {
        id: "13",
        name: "Phan Văn Sơn",
        email: "phanvanson@example.com",
        phone: "0923456780",
        role: "Student",
        status: "Active",
        createdAt: "2024-05-25",
    },
    {
        id: "14",
        name: "Mai Thị Tâm",
        email: "maithitam@example.com",
        phone: "0934567891",
        role: "Manager",
        status: "Active",
        createdAt: "2024-06-01",
    },
];

export default function ManagementUserPage() {
    // useRequireAuth([UserRole.Admin, UserRole.Manager]);

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Student" as User["role"],
        status: "Active" as User["status"],
    });

    // Filter users based on search term and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
    };

    // Check if any filters are active
    const hasActiveFilters = searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all";

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "Student",
            status: "Active",
        });
    };

    // Handle create user
    const handleCreateUser = () => {
        const newUser: User = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);
        setIsCreateDialogOpen(false);
        resetForm();
    };

    // Handle edit user
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
        });
        setIsEditDialogOpen(true);
    };

    // Handle update user
    const handleUpdateUser = () => {
        if (!editingUser) return;

        setUsers(
            users.map((user) =>
                user.id === editingUser.id
                    ? { ...user, ...formData }
                    : user
            )
        );
        setIsEditDialogOpen(false);
        setEditingUser(null);
        resetForm();
    };

    // Handle delete user
    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((user) => user.id !== userId));
    };


    return (
        <div className="flex flex-1 flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin người dùng trong hệ thống
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter((u) => u.status === "Active").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter((u) => u.role === "Instructor").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Học viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter((u) => u.role === "Student").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Add User */}


            {/* Users Table */}
            <Card>

                <CardContent>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        {/* Search Bar */}
                        <div className="flex flex-1 items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchTerm("")}
                                    className="h-9 px-2 shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Add User Button */}
                        <div className="flex justify-end">

                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm người dùng
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Thêm người dùng mới</DialogTitle>
                                        <DialogDescription>
                                            Nhập thông tin để tạo người dùng mới trong hệ thống.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Họ tên
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Nhập họ tên"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="Nhập email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Số điện thoại
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">
                                                Vai trò
                                            </Label>
                                            <Select
                                                value={formData.role}
                                                onValueChange={(value: User["role"]) =>
                                                    setFormData({ ...formData, role: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Manager">Manager</SelectItem>
                                                    <SelectItem value="Instructor">Instructor</SelectItem>
                                                    <SelectItem value="Student">Student</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">
                                                Trạng thái
                                            </Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value: User["status"]) =>
                                                    setFormData({ ...formData, status: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleCreateUser}>
                                            Tạo người dùng
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
                            {searchTerm && (
                                <Badge variant="secondary" className="text-xs">
                                    Tìm kiếm: "{searchTerm}"
                                </Badge>
                            )}
                            {roleFilter !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Vai trò: {roleFilter}
                                </Badge>
                            )}
                            {statusFilter !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Trạng thái: {statusFilter}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardContent className="p-0">
                    <UserDataTable
                        data={filteredUsers}
                        onEdit={handleEditUser}
                        onDelete={(userId) => {
                            const user = users.find(u => u.id === userId);
                            if (user && window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"? Hành động này không thể hoàn tác.`)) {
                                handleDeleteUser(userId);
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin người dùng trong hệ thống.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">
                                Họ tên
                            </Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập họ tên"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">
                                Email
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">
                                Số điện thoại
                            </Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">
                                Vai trò
                            </Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: User["role"]) =>
                                    setFormData({ ...formData, role: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Instructor">Instructor</SelectItem>
                                    <SelectItem value="Student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: User["status"]) =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdateUser}>
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
