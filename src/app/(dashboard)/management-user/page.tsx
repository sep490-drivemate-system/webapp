"use client";

import { useEffect, useState } from "react";
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
import { UserRole } from "@/types/auth/user-role.enum";
import { IUserManagement } from "@/types/user/manage-user.type";
import { UserDataTable } from "@/components/commons/dashboard/user-data-table";
import PageHeader from "@/components/commons/Header/header";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { createUserForAdminThunk, getAllUser } from "@/features/user/userThunk";
import { Gender } from "@/types/user/gender.enum";

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

export default function ManagementUserPage() {
  // useRequireAuth([UserRole.Admin, UserRole.Manager]);

  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<IUserManagement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserManagement | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
    phoneNumber: "",
    gender: Gender.Male as Gender,
    dateOfBirth: "",
    role: UserRole.Inspector as UserRole,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // Fetch users from API
  useEffect(() => {
    let isMounted = true;

    dispatch(getAllUser())
      .unwrap()
      .then((res: any) => {
        if (!isMounted) return;

        let apiUsers: any[] = [];

        // Trường hợp API theo chuẩn GenericResponse { value: T }
        if (res && typeof res === "object" && "value" in res) {
          const value = (res as any).value;

          if (Array.isArray(value)) {
            apiUsers = value;
          } else if (value && Array.isArray(value.pageContent)) {
            // Trường hợp API trả về dạng phân trang PaginatedGeneric<T>
            apiUsers = value.pageContent;
          }
        }
        // Trường hợp API trả trực tiếp mảng người dùng
        else if (Array.isArray(res)) {
          apiUsers = res;
        }

        if (!Array.isArray(apiUsers)) {
          console.error("getAllUser returned unexpected format:", res);
          apiUsers = [];
        }

        const mappedUsers: IUserManagement[] = apiUsers.map((u: any) => ({
          id: u.userId,
          userName: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          // Backend model không có trường này, tạm thời đặt mặc định
          status: "Active",
          // Nếu backend có ngày tạo trong tương lai, có thể thay thế tại đây
          createdAt: new Date(),
        }));

        setUsers(mappedUsers);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const safeUserName = (user.userName || "").toLowerCase();
    const safeEmail = (user.email || "").toLowerCase();
    const safePhone = user.phone || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      safeUserName.includes(search) ||
      safeEmail.includes(search) ||
      safePhone.includes(searchTerm);

    const matchesRole =
      roleFilter === "all" || String(user.role) === roleFilter;
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
      username: "",
      password: "",
      email: "",
      fullname: "",
      phoneNumber: "",
      gender: Gender.Male,
      dateOfBirth: "",
      role: UserRole.Inspector,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.username.trim()) newErrors.username = "Tên đăng nhập là bắt buộc";
    if (!formData.password.trim()) newErrors.password = "Mật khẩu là bắt buộc";
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
    if (!formData.fullname.trim()) newErrors.fullname = "Họ và tên là bắt buộc";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.dateOfBirth > today) {
        newErrors.dateOfBirth = "Ngày sinh không được lớn hơn ngày hiện tại";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create user (Inspector only)
  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      const res: any = await dispatch(
        createUserForAdminThunk({
          ...formData,
          role: UserRole.Inspector,
        })
      ).unwrap();

      let createdUser: any = null;
      if (res && typeof res === "object" && "value" in res) {
        createdUser = (res as any).value;
      } else {
        createdUser = res;
      }

      if (createdUser) {
        const newUser: IUserManagement = {
          id: createdUser.userId,
          userName: createdUser.fullName,
          email: createdUser.email,
          phone: createdUser.phone,
          role: createdUser.role,
          status: "Active",
          createdAt: new Date(),
        };
        setUsers((prev) => [...prev, newUser]);
      }

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create inspector:", error);

      // Xử lý lỗi từ thunk (ví dụ 409 - email đã tồn tại)
      let message = "";
      if (typeof error === "string") {
        message = error;
      } else if (error instanceof Error) {
        message = error.message;
      } else if (error && typeof (error as any).message === "string") {
        message = (error as any).message;
      } else {
        message = "Tạo người kiểm duyệt thất bại. Vui lòng thử lại.";
      }

      setErrors((prev) => ({
        ...prev,
        email: message,
      }));
    }
  };

  // Handle edit user (giữ nguyên logic hiện tại, không dùng popup tạo)
  const handleEditUser = (user: IUserManagement) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleToggleBlockUser = (user: IUserManagement) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: u.status === "Suspended" ? "Active" : "Suspended",
            }
          : u
      )
    );
  };

  // Handle update user (placeholder - chưa chỉnh sửa thông tin chi tiết ở đây)
  const handleUpdateUser = () => {
    if (!editingUser) return;
    setIsEditDialogOpen(false);
    setEditingUser(null);
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
          label: "Thêm người kiểm duyệt",
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
                <SelectItem value={String(UserRole.Inspector)}>
                  Người kiểm duyệt
                </SelectItem>
                <SelectItem value={String(UserRole.Instructor)}>
                  Người hướng dẫn
                </SelectItem>
                <SelectItem value={String(UserRole.NoviceDriver)}>
                  Người lái mới
                </SelectItem>
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
                <DialogTitle>Thêm người kiểm duyệt</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo mới tài khoản người kiểm duyệt trong hệ
                  thống.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Nhập tên đăng nhập"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
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
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input
                    id="fullname"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullname && (
                    <p className="text-sm text-destructive">
                      {errors.fullname}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    value={Gender[formData.gender]}
                    onValueChange={(value: string) =>
                      setFormData({
                        ...formData,
                        gender: Gender[value as keyof typeof Gender],
                      })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <Input
                    value="Người kiểm duyệt"
                    disabled
                    className="bg-muted/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateUser}>
                  Tạo người kiểm duyệt
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
                  Vai trò:{" "}
                  {roleFilter === String(UserRole.Inspector)
                    ? "Người kiểm duyệt"
                    : roleFilter === String(UserRole.Instructor)
                    ? "Người hướng dẫn"
                    : roleFilter === String(UserRole.NoviceDriver)
                    ? "Người lái mới"
                    : roleFilter}
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
            onView={handleEditUser}
            onToggleBlock={handleToggleBlockUser}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Chức năng xem chi tiết người dùng sẽ được cập nhật sau.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={handleUpdateUser}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
