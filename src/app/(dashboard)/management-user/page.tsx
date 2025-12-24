"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UserRole } from "@/types/auth/user-role.enum";
import { UserDataTable } from "@/components/commons/dashboard/user-data-table";
import PageHeader from "@/components/commons/Header/header";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import {
  createUserForAdminThunk,
  getAllUser,
  banUserForAdmin,
  unbanUserForAdmin,
} from "@/features/user/userThunk";
import { Gender } from "@/types/user/gender.enum";
import { UserManagement } from "@/types/user/user-profile.type";
import { AccountStatus } from "@/types/user/status.enum";
import { useDebouncedValue } from "@/hooks/commonHooks";

export default function ManagementUserPage() {
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<UserManagement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banningUser, setBanningUser] =
    useState<UserManagement | null>(null);
  const [banReason, setBanReason] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    email: "",
    fullname: "",
    phoneNumber: "",
    gender: Gender.Male as Gender,
    dateOfBirth: "",
    role: UserRole.Inspector as UserRole,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const fetchUsers = async (searchKey?: string) => {
    try {
      const payload = searchKey && searchKey.trim() 
        ? { searchKey: searchKey.trim() } 
        : undefined;
      const res: any = await dispatch(getAllUser(payload)).unwrap();
      const apiUsers =
        res?.value?.pageContent || res?.value || res || [];

      const mappedUsers: UserManagement[] = apiUsers.map((u: any) => ({
        userId: u.userId,
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role,
        avatarUrl: u.avatarUrl || "",
        licenseTier: u.licenseTier,
        birthDate: u.birthDate || "",
        instructor: u.instructor || null,
        noviceDriver: u.noviceDriver || null,
        accountStatus: u.accountStatus ?? AccountStatus.Normal,
      }));

      console.log(mappedUsers)

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  };

  useEffect(() => {
    fetchUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filteredUsers = users.filter((user) => {
    if (user.role === UserRole.Admin) {
      return false;
    }
    return true;
  });

  const resetForm = () => {
    setFormData({
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
    const newErrors: typeof errors = {};

    if (!formData.email.trim())
      newErrors.email = "Email là bắt buộc";
    if (!formData.password.trim())
      newErrors.password = "Mật khẩu là bắt buộc";
    if (!formData.fullname.trim())
      newErrors.fullname = "Họ và tên là bắt buộc";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
        createUserForAdminThunk({
          ...formData,
          role: UserRole.Inspector,
        })
      ).unwrap();

      await fetchUsers();

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setErrors({
        email: err?.message || "Tạo người dùng thất bại",
      });
    }
  };

  const handleToggleBlock = (user: UserManagement) => {
    setBanningUser(user);
    setBanReason("");
    setIsBanDialogOpen(true);
  };

  const handleConfirmBanUnban = async () => {
    if (!banningUser) return;

    const isBanned = banningUser.accountStatus === AccountStatus.Banned;
    if (!isBanned && !banReason.trim()) return;

    try {
      if (isBanned) {
        await dispatch(
          unbanUserForAdmin({
            id: banningUser.userId,
          })
        ).unwrap();
      } else {
        await dispatch(
          banUserForAdmin({
            id: banningUser.userId,
            reason: banReason.trim(),
          })
        ).unwrap();
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.userId === banningUser.userId
            ? {
                ...u,
                accountStatus: isBanned
                  ? AccountStatus.Normal
                  : AccountStatus.Banned,
              }
            : u
        )
      );

      await fetchUsers();

      setIsBanDialogOpen(false);
      setBanningUser(null);
      setBanReason("");
    } catch (err: any) {
      console.error("Ban/Unban user failed:", err);
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <PageHeader
        title="Quản Lý Người Dùng"
        description="Quản lý và theo dõi người dùng."
        actionButton={{
          label: "Thêm người kiểm duyệt",
          onClick: () => setIsCreateDialogOpen(true),
          icon: Plus,
        }}
      />

      <Input
        placeholder="Tìm kiếm theo tên, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <UserDataTable
        data={filteredUsers}
        onToggleBlock={handleToggleBlock}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người kiểm duyệt</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}

            <Input
              placeholder="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}

            <Input
              placeholder="Họ và tên"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
            {errors.fullname && (
              <p className="text-sm text-destructive">
                {errors.fullname}
              </p>
            )}

            <Input
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumber: e.target.value,
                })
              }
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber}
              </p>
            )}

            <Input
              type="date"
              value={formData.dateOfBirth}
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

          <DialogFooter>
            <Button onClick={handleCreateUser}>Tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {banningUser?.accountStatus === AccountStatus.Banned
                ? "Bỏ chặn người dùng"
                : "Chặn người dùng"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Người dùng: <span className="font-medium">{banningUser?.fullName}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium">{banningUser?.email}</span>
              </p>
            </div>

            {banningUser?.accountStatus !== AccountStatus.Banned && (
              <div>
                <Label htmlFor="reason">Lý do</Label>
                <Textarea
                  id="reason"
                  placeholder="Nhập lý do chặn..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBanDialogOpen(false);
                setBanningUser(null);
                setBanReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmBanUnban}
              disabled={
                banningUser?.accountStatus !== AccountStatus.Banned &&
                !banReason.trim()
              }
              variant={
                banningUser?.accountStatus === AccountStatus.Banned
                  ? "default"
                  : "destructive"
              }
            >
              {banningUser?.accountStatus === AccountStatus.Banned
                ? "Bỏ chặn"
                : "Chặn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
