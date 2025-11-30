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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  X,
  Users,
  UserCheck,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/auth/useRequireAuth";
import { UserRole } from "@/types/auth/user-role.enum";
import { IUserManagement } from "@/types/user/manage-user.type";
import { UserDataTable } from "@/components/commons/dashboard/user-data-table";
import PageHeader from "@/components/commons/Header/header";

const changeClassMap: Record<"up" | "down" | "neutral", string> = {
  up: "text-emerald-500",
  neutral: "text-blue-500",
  down: "text-destructive",
};

// Helper function to determine color based on change percentage
const getChangeColor = (change: string): "up" | "down" | "neutral" => {
  const changeValue = parseFloat(change.replace(/[+%]/g, ""));
  if (changeValue > 0) return "up";
  if (changeValue < 0) return "down";
  return "neutral";
};

// Mock data using IUserManagement interface
const initialUsers: IUserManagement[] = [
  {
    id: "1",
    userName: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "0901234567",
    role: UserRole.Admin,
    status: "Active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    userName: "Trần Thị Bình",
    email: "tranthibinh@example.com",
    phone: "0912345678",
    role: UserRole.Inspector,
    status: "Active",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    userName: "Lê Văn Cường",
    email: "levancuong@example.com",
    phone: "0923456789",
    role: UserRole.Instructor,
    status: "Active",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    userName: "Phạm Thị Dung",
    email: "phamthidung@example.com",
    phone: "0934567890",
    role: UserRole.NoviceDriver,
    status: "Inactive",
    createdAt: new Date("2024-03-25"),
  },
  {
    id: "5",
    userName: "Hoàng Minh Đức",
    email: "hoangminhduc@example.com",
    phone: "0945678901",
    role: UserRole.Instructor,
    status: "Active",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "6",
    userName: "Vũ Thị Hoa",
    email: "vuthihoa@example.com",
    phone: "0956789012",
    role: UserRole.NoviceDriver,
    status: "Active",
    createdAt: new Date("2024-04-12"),
  },
  {
    id: "7",
    userName: "Đỗ Văn Hùng",
    email: "dovanhung@example.com",
    phone: "0967890123",
    role: UserRole.Inspector,
    status: "Active",
    createdAt: new Date("2024-04-18"),
  },
  {
    id: "8",
    userName: "Bùi Thị Lan",
    email: "buithilan@example.com",
    phone: "0978901234",
    role: UserRole.NoviceDriver,
    status: "Suspended",
    createdAt: new Date("2024-04-22"),
  },
  {
    id: "9",
    userName: "Ngô Văn Minh",
    email: "ngovanminh@example.com",
    phone: "0989012345",
    role: UserRole.Instructor,
    status: "Active",
    createdAt: new Date("2024-05-01"),
  },
  {
    id: "10",
    userName: "Lý Thị Nga",
    email: "lythinga@example.com",
    phone: "0990123456",
    role: UserRole.NoviceDriver,
    status: "Active",
    createdAt: new Date("2024-05-08"),
  },
  {
    id: "11",
    userName: "Trương Văn Phúc",
    email: "truongvanphuc@example.com",
    phone: "0901234568",
    role: UserRole.NoviceDriver,
    status: "Inactive",
    createdAt: new Date("2024-05-15"),
  },
  {
    id: "12",
    userName: "Đinh Thị Quỳnh",
    email: "dinhthiquynh@example.com",
    phone: "0912345679",
    role: UserRole.Instructor,
    status: "Active",
    createdAt: new Date("2024-05-20"),
  },
  {
    id: "13",
    userName: "Phan Văn Sơn",
    email: "phanvanson@example.com",
    phone: "0923456780",
    role: UserRole.NoviceDriver,
    status: "Active",
    createdAt: new Date("2024-05-25"),
  },
  {
    id: "14",
    userName: "Mai Thị Tâm",
    email: "maithitam@example.com",
    phone: "0934567891",
    role: UserRole.Inspector,
    status: "Active",
    createdAt: new Date("2024-06-01"),
  },
];

export default function ManagementUserPage() {
  // useRequireAuth([UserRole.Admin, UserRole.Manager]);

  const [users, setUsers] = useState<IUserManagement[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserManagement | null>(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    role: UserRole.NoviceDriver as UserRole,
    status: "Active" as string,
  });

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole =
      roleFilter === "all" || UserRole[user.role] === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all";

  // Reset form
  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      phone: "",
      role: UserRole.NoviceDriver,
      status: "Active",
    });
  };

  // Handle create user
  const handleCreateUser = () => {
    const newUser: IUserManagement = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  // Handle edit user
  const handleEditUser = (user: IUserManagement) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
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
        user.id === editingUser.id ? { ...user, ...formData } : user
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
      <PageHeader
        title="Quản Lý Người Dùng"
        description="Quản lý và theo dõi tất cả người dùng trong hệ thống."
        actionButton={{
          label: "Thêm người dùng",
          onClick: () => setIsCreateDialogOpen(true),
          icon: Plus,
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Tổng người dùng
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {users.length}
              </CardTitle>
              <p
                className={`text-sm ${
                  changeClassMap[getChangeColor("+12.5%")]
                }`}
              >
                +12.5%
              </p>
            </div>
            <span className="rounded-xl p-3 bg-blue-50 text-blue-600">
              <Users className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Người kiểm duyệt
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {users.filter((u) => u.role === UserRole.Inspector).length}
              </CardTitle>
              <p
                className={`text-sm ${changeClassMap[getChangeColor("+2.1%")]}`}
              >
                +2.1%
              </p>
            </div>
            <span className="rounded-xl p-3 bg-purple-50 text-purple-600">
              <UserCheck className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Người hướng dẫn
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {users.filter((u) => u.role === UserRole.Instructor).length}
              </CardTitle>
              <p
                className={`text-sm ${changeClassMap[getChangeColor("+8.2%")]}`}
              >
                +8.2%
              </p>
            </div>
            <span className="rounded-xl p-3 bg-sky-50 text-sky-600">
              <UserCog className="size-5" />
            </span>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Người lái mới
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {users.filter((u) => u.role === UserRole.NoviceDriver).length}
              </CardTitle>
              <p
                className={`text-sm ${
                  changeClassMap[getChangeColor("+15.3%")]
                }`}
              >
                +15.3%
              </p>
            </div>
            <span className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
              <UserPlus className="size-5" />
            </span>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="Admin">Quản trị viên</SelectItem>
                <SelectItem value="Inspector">Người kiểm duyệt</SelectItem>
                <SelectItem value="Instructor">Người hướng dẫn</SelectItem>
                <SelectItem value="NoviceDriver">Người lái mới</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                <SelectItem value="Suspended">Bị đình chỉ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo người dùng mới trong hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Họ tên</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Nhập email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select
                    value={UserRole[formData.role]}
                    onValueChange={(value: string) =>
                      setFormData({
                        ...formData,
                        role: UserRole[value as keyof typeof UserRole],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Quản trị viên</SelectItem>
                      <SelectItem value="Inspector">
                        Người kiểm duyệt
                      </SelectItem>
                      <SelectItem value="Instructor">
                        Người hướng dẫn
                      </SelectItem>
                      <SelectItem value="NoviceDriver">
                        Người lái mới
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Hoạt động</SelectItem>
                      <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                      <SelectItem value="Suspended">Bị đình chỉ</SelectItem>
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

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Bộ lọc đang áp dụng:
              </span>
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
              const user = users.find((u) => u.id === userId);
              if (
                user &&
                window.confirm(
                  `Bạn có chắc chắn muốn xóa người dùng "${user.userName}"? Hành động này không thể hoàn tác.`
                )
              ) {
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
              <Label htmlFor="edit-userName">Họ tên</Label>
              <Input
                id="edit-userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Nhập họ tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Vai trò</Label>
              <Select
                value={UserRole[formData.role]}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    role: UserRole[value as keyof typeof UserRole],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Quản trị viên</SelectItem>
                  <SelectItem value="Inspector">Người kiểm duyệt</SelectItem>
                  <SelectItem value="Instructor">Người hướng dẫn</SelectItem>
                  <SelectItem value="NoviceDriver">Người lái mới</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Hoạt động</SelectItem>
                  <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                  <SelectItem value="Suspended">Bị đình chỉ</SelectItem>
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
