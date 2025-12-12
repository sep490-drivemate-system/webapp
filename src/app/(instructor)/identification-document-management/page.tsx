"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/commons/Header/header";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import {
  getUserById,
  editUser,
  updateInstructor,
} from "@/features/user/userThunk";
import { getInstructorById } from "@/features/instructor/instructorThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { IUserInfo } from "@/types/user/user-profile.type";
import { IInstructors } from "@/types/instructor/instructor-management.types";
import {
  getInstructorApplication,
  getUserEmergencyContact,
} from "@/features/document/documentThunk";
import {
  ApplicantDocument,
  EmergencyContact,
} from "@/types/document/document.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface DocumentField {
  label: string;
  value: string;
}

interface DocumentFile {
  label: string;
  imageUrl: string | null;
}

interface DocumentRecord {
  id: string;
  title: string;
  fields: DocumentField[];
  files: DocumentFile[];
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateString;
  }
};

// Helper function to map ApplicantDocument to DocumentRecord[]
const mapApplicantDocumentToRecords = (
  applicantDoc: ApplicantDocument | null
): DocumentRecord[] => {
  if (!applicantDoc) return [];

  const records: DocumentRecord[] = [];

  // Helper function to format gender
  const formatGender = (gender: string | null | undefined): string => {
    if (!gender) return "—";
    if (gender === "Male") return "Nam";
    if (gender === "Female") return "Nữ";
    return gender;
  };

  // Căn Cước Công Dân
  records.push({
    id: "citizenId",
    title: "Căn Cước Công Dân",
    fields: [
      { label: "Họ và tên", value: applicantDoc.fullname || "—" },
      { label: "Ngày sinh", value: formatDate(applicantDoc.birthDate) },
      { label: "Giới tính", value: formatGender(applicantDoc.gender) },
    ],
    files: [],
  });

  // Lý Lịch Tư Pháp (có thể dùng personalProfile nếu có 2 ảnh, hoặc để trống)
  records.push({
    id: "legalHistory",
    title: "Lý Lịch Tư Pháp",
    fields: [],
    files: applicantDoc.personalProfile
      ? [
          {
            label: "Ảnh lý lịch tư pháp",
            imageUrl: applicantDoc.personalProfile,
          },
        ]
      : [],
  });

  // Giấy Khám Sức Khỏe
  records.push({
    id: "healthCertificate",
    title: "Giấy Khám Sức Khỏe",
    fields: [],
    files: applicantDoc.healthCheckup
      ? [
          {
            label: "Ảnh giấy khám sức khỏe",
            imageUrl: applicantDoc.healthCheckup,
          },
        ]
      : [],
  });

  // Bằng Lái Xe
  const driverLicenseFiles: DocumentFile[] = [];
  if (applicantDoc.drivingLicenseFront) {
    driverLicenseFiles.push({
      label: "Ảnh mặt trước",
      imageUrl: applicantDoc.drivingLicenseFront,
    });
  }
  if (applicantDoc.drivingLicenseBack) {
    driverLicenseFiles.push({
      label: "Ảnh mặt sau",
      imageUrl: applicantDoc.drivingLicenseBack,
    });
  }

  records.push({
    id: "driverLicense",
    title: "Bằng Lái Xe",
    fields: applicantDoc.drivingLicenseTier
      ? [
          {
            label: "Hạng bằng lái",
            value: `B${applicantDoc.drivingLicenseTier}`,
          },
        ]
      : [],
    files: driverLicenseFiles,
  });

  // Chứng Chỉ Hành Nghề
  records.push({
    id: "trainingCertificate",
    title: "Chứng Chỉ Hành Nghề",
    fields: applicantDoc.teachingLicenseTier
      ? [
          {
            label: "Hạng lái xe giảng dạy",
            value: `B${applicantDoc.teachingLicenseTier}`,
          },
        ]
      : [],
    files: applicantDoc.teachingLicenseFront
      ? [
          {
            label: "Ảnh chứng chỉ hành nghề",
            imageUrl: applicantDoc.teachingLicenseFront,
          },
        ]
      : [],
  });

  return records;
};

export default function IdentificationDocumentManagementPage() {
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [instructorInfo, setInstructorInfo] = useState<IInstructors | null>(
    null
  );
  const [emergencyContact, setEmergencyContact] =
    useState<EmergencyContact | null>(null);
  const [applicantDocument, setApplicantDocument] =
    useState<ApplicantDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isEmergencyNameDialogOpen, setIsEmergencyNameDialogOpen] =
    useState(false);
  const [isEmergencyPhoneDialogOpen, setIsEmergencyPhoneDialogOpen] =
    useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isBioDialogOpen, setIsBioDialogOpen] = useState(false);

  // Form values
  const [phoneValue, setPhoneValue] = useState("");
  const [emergencyNameValue, setEmergencyNameValue] = useState("");
  const [emergencyPhoneValue, setEmergencyPhoneValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const jwtUser = getUserInfo();
      if (!jwtUser?.id) {
        setError("Không tìm thấy thông tin người dùng");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch user data
        const userResponse = await dispatch(
          getUserById({ id: jwtUser.id })
        ).unwrap();

        if (cancelled) return;

        const fetchedUser = userResponse.value ?? null;
        setUserInfo(fetchedUser);

        // Fetch emergency contact
        try {
          const emergencyContactResponse = await dispatch(
            getUserEmergencyContact({ id: jwtUser.id })
          ).unwrap();

          if (cancelled) return;
          const contacts = emergencyContactResponse.value ?? [];
          setEmergencyContact(contacts.length > 0 ? contacts[0] : null);
        } catch (emergencyErr) {
          console.error("Failed to fetch emergency contact", emergencyErr);
          // Don't set error for emergency contact fetch failure
        }

        // Fetch instructor data if instructor ID exists
        if (fetchedUser?.instructor?.instructorId) {
          try {
            const instructorResponse = await dispatch(
              getInstructorById({ id: fetchedUser.instructor.instructorId })
            ).unwrap();

            if (cancelled) return;
            setInstructorInfo(instructorResponse.value ?? null);

            // Fetch instructor application documents
            try {
              const applicantResponse = await dispatch(
                getInstructorApplication({
                  id: fetchedUser.instructor.instructorId,
                })
              ).unwrap();

              if (cancelled) return;
              setApplicantDocument(applicantResponse.value ?? null);
            } catch (applicantErr) {
              console.error(
                "Failed to fetch instructor application",
                applicantErr
              );
              // Don't set error for applicant document fetch failure
            }
          } catch (instructorErr) {
            console.error("Failed to fetch instructor info", instructorErr);
            // Don't set error for instructor fetch failure, just log it
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch user info", err);
          setError("Không thể tải thông tin người dùng");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // Function to refresh user data
  const refreshUserData = async () => {
    const jwtUser = getUserInfo();
    if (!jwtUser?.id) return;

    try {
      const userResponse = await dispatch(
        getUserById({ id: jwtUser.id })
      ).unwrap();
      setUserInfo(userResponse.value ?? null);

      // Refresh emergency contact
      try {
        const emergencyContactResponse = await dispatch(
          getUserEmergencyContact({ id: jwtUser.id })
        ).unwrap();
        const contacts = emergencyContactResponse.value ?? [];
        setEmergencyContact(contacts.length > 0 ? contacts[0] : null);
      } catch (emergencyErr) {
        console.error("Failed to fetch emergency contact", emergencyErr);
      }

      // Refresh instructor data if instructor ID exists
      if (userResponse.value?.instructor?.instructorId) {
        try {
          const instructorResponse = await dispatch(
            getInstructorById({
              id: userResponse.value.instructor.instructorId,
            })
          ).unwrap();
          setInstructorInfo(instructorResponse.value ?? null);
        } catch (instructorErr) {
          console.error("Failed to refresh instructor info", instructorErr);
        }
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  // Handler for avatar update
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!userInfo?.userId || !avatarFile) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        editUser({
          id: userInfo.userId,
          ProfileAvatar: avatarFile,
        })
      ).unwrap();

      toast.success("Cập nhật ảnh đại diện thành công");
      setIsAvatarDialogOpen(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refreshUserData();
    } catch (err: any) {
      toast.error(err || "Cập nhật ảnh đại diện thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for phone update
  const handleUpdatePhone = async () => {
    if (!userInfo?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    const trimmedPhone = phoneValue.trim();
    if (!trimmedPhone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    // Validate: chỉ cho nhập 10 số
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Số điện thoại phải có đúng 10 chữ số");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        editUser({
          id: userInfo.userId,
          PhoneNumber: trimmedPhone,
        })
      ).unwrap();

      toast.success("Cập nhật số điện thoại thành công");
      setIsPhoneDialogOpen(false);
      setPhoneValue("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err || "Cập nhật số điện thoại thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for emergency contact name update
  const handleUpdateEmergencyName = async () => {
    if (!userInfo?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    if (!emergencyNameValue.trim()) {
      toast.error("Vui lòng nhập tên người liên hệ");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        editUser({
          id: userInfo.userId,
          EmergencyContactName: emergencyNameValue.trim(),
        })
      ).unwrap();

      toast.success("Cập nhật tên người liên hệ thành công");
      setIsEmergencyNameDialogOpen(false);
      setEmergencyNameValue("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err || "Cập nhật tên người liên hệ thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for emergency contact phone update
  const handleUpdateEmergencyPhone = async () => {
    if (!userInfo?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    const trimmedPhone = emergencyPhoneValue.trim();
    if (!trimmedPhone) {
      toast.error("Vui lòng nhập số điện thoại người liên hệ");
      return;
    }

    // Validate: chỉ cho nhập 10 số
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Số điện thoại phải có đúng 10 chữ số");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        editUser({
          id: userInfo.userId,
          EmergencyContactPhone: trimmedPhone,
        })
      ).unwrap();

      toast.success("Cập nhật số điện thoại người liên hệ thành công");
      setIsEmergencyPhoneDialogOpen(false);
      setEmergencyPhoneValue("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err || "Cập nhật số điện thoại người liên hệ thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for password update
  const handleUpdatePassword = async () => {
    if (!userInfo?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    if (!passwordValue.trim()) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (passwordValue.trim() !== confirmPasswordValue.trim()) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordValue.trim().length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        editUser({
          id: userInfo.userId,
          Password: passwordValue.trim(),
        })
      ).unwrap();

      toast.success("Cập nhật mật khẩu thành công");
      setIsPasswordDialogOpen(false);
      setPasswordValue("");
      setConfirmPasswordValue("");
    } catch (err: any) {
      toast.error(err || "Cập nhật mật khẩu thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for bio update
  const handleUpdateBio = async () => {
    if (!userInfo?.instructor?.instructorId) {
      toast.error("Không tìm thấy thông tin giảng viên");
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(
        updateInstructor({
          id: userInfo.instructor.instructorId,
          bio: bioValue.trim() || undefined,
        })
      ).unwrap();

      toast.success("Cập nhật mô tả thành công");
      setIsBioDialogOpen(false);
      setBioValue("");
      await refreshUserData();
    } catch (err: any) {
      toast.error(err || "Cập nhật mô tả thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const displayName = userInfo?.fullName || "—";
  const displayEmail = userInfo?.email || "—";
  const displayPhone = userInfo?.phone || "—";
  const displayAvatar = userInfo?.avatarUrl || null;
  const displayBio = instructorInfo?.bio || "—";
  const displayEmergencyContactName = emergencyContact?.name || "—";
  const displayEmergencyContactPhone = emergencyContact?.phone || "—";

  const documentRecords = mapApplicantDocumentToRecords(applicantDocument);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Quản Lý Tài Liệu Cá Nhân"
        description="Xem và chỉnh sửa tài liệu đã tải lên "
      />

      {/* User profile & emergency contact */}
      <section className="space-y-6">
        {/* Thông tin cá nhân */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold">
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <>
                {/* Ảnh đại diện và thông tin cơ bản */}
                <div className="flex flex-col lg:flex-row gap-8 pb-8 border-b border-border/60">
                  {/* Ảnh đại diện */}
                  <div className="flex flex-col items-center lg:items-start gap-4 lg:min-w-[200px]">
                    <Avatar className="h-36 w-36 border-2 border-border shadow-lg">
                      <AvatarImage
                        src={avatarPreview || displayAvatar || undefined}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-muted to-muted/60">
                        {displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Dialog
                      open={isAvatarDialogOpen}
                      onOpenChange={setIsAvatarDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full lg:w-auto"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Cập nhật ảnh
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                          <DialogDescription>
                            Chọn ảnh đại diện mới từ máy tính của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="avatar">Chọn ảnh</Label>
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleAvatarChange}
                            />
                          </div>
                          {avatarPreview && (
                            <div className="flex justify-center">
                              <Avatar className="h-24 w-24">
                                <AvatarImage
                                  src={avatarPreview}
                                  alt="Preview"
                                  className="object-cover"
                                />
                              </Avatar>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAvatarDialogOpen(false);
                              setAvatarFile(null);
                              setAvatarPreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            disabled={isUpdating}
                          >
                            Hủy
                          </Button>
                          <Button
                            onClick={handleUpdateAvatar}
                            disabled={!avatarFile || isUpdating}
                          >
                            {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Thông tin cơ bản */}
                  <div className="flex-1 grid gap-4 sm:grid-cols-2">
                    <InfoItem label="Họ và tên" value={displayName} />
                    <InfoItem label="Email" value={displayEmail} />
                    <EditableInfoItem
                      label="Số điện thoại"
                      value={displayPhone}
                      dialogTitle="Cập nhật số điện thoại"
                      dialogDescription="Nhập số điện thoại mới của bạn"
                      inputValue={phoneValue}
                      onInputChange={setPhoneValue}
                      onUpdate={handleUpdatePhone}
                      isDialogOpen={isPhoneDialogOpen}
                      onDialogOpenChange={setIsPhoneDialogOpen}
                      isUpdating={isUpdating}
                      inputType="tel"
                      placeholder="Nhập số điện thoại"
                      maxLength={10}
                      pattern="[0-9]*"
                    />
                    <PasswordInfoItem
                      onUpdate={handleUpdatePassword}
                      isDialogOpen={isPasswordDialogOpen}
                      onDialogOpenChange={setIsPasswordDialogOpen}
                      passwordValue={passwordValue}
                      onPasswordChange={setPasswordValue}
                      confirmPasswordValue={confirmPasswordValue}
                      onConfirmPasswordChange={setConfirmPasswordValue}
                      isUpdating={isUpdating}
                    />
                  </div>
                </div>

                {/* Mô tả */}
                <div className="space-y-2 rounded-lg border border-border/60 p-5 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                      Mô tả
                    </p>
                    {userInfo?.instructor?.instructorId && (
                      <Dialog
                        open={isBioDialogOpen}
                        onOpenChange={(open) => {
                          if (open && !bioValue) {
                            setBioValue(displayBio !== "—" ? displayBio : "");
                          }
                          setIsBioDialogOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cập nhật mô tả</DialogTitle>
                            <DialogDescription>
                              Nhập mô tả về bản thân và kinh nghiệm của bạn
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="bio-input">Mô tả</Label>
                              <Textarea
                                id="bio-input"
                                value={bioValue}
                                onChange={(e) => setBioValue(e.target.value)}
                                placeholder="Nhập mô tả về bản thân và kinh nghiệm..."
                                disabled={isUpdating}
                                className="min-h-32"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsBioDialogOpen(false);
                                setBioValue("");
                              }}
                              disabled={isUpdating}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleUpdateBio}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <p className="text-base text-foreground mt-2 whitespace-pre-wrap leading-relaxed">
                    {displayBio}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Liên hệ khẩn cấp */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Liên hệ khẩn cấp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <EditableInfoItem
                  label="Tên người liên hệ"
                  value={displayEmergencyContactName}
                  dialogTitle="Cập nhật tên người liên hệ"
                  dialogDescription="Nhập tên người liên hệ khẩn cấp"
                  inputValue={emergencyNameValue}
                  onInputChange={setEmergencyNameValue}
                  onUpdate={handleUpdateEmergencyName}
                  isDialogOpen={isEmergencyNameDialogOpen}
                  onDialogOpenChange={setIsEmergencyNameDialogOpen}
                  isUpdating={isUpdating}
                  inputType="text"
                  placeholder="Nhập tên người liên hệ"
                />
                <EditableInfoItem
                  label="Số điện thoại"
                  value={displayEmergencyContactPhone}
                  dialogTitle="Cập nhật số điện thoại người liên hệ"
                  dialogDescription="Nhập số điện thoại người liên hệ khẩn cấp"
                  inputValue={emergencyPhoneValue}
                  onInputChange={setEmergencyPhoneValue}
                  onUpdate={handleUpdateEmergencyPhone}
                  isDialogOpen={isEmergencyPhoneDialogOpen}
                  onDialogOpenChange={setIsEmergencyPhoneDialogOpen}
                  isUpdating={isUpdating}
                  inputType="tel"
                  placeholder="Nhập số điện thoại"
                  maxLength={10}
                  pattern="[0-9]*"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Document detail cards */}
      <section className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Đang tải tài liệu...</p>
          </div>
        ) : documentRecords.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Chưa có tài liệu nào</p>
          </div>
        ) : (
          documentRecords.map((record) => {
            return (
              <Card key={record.id} className="border-border">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-xl text-foreground">
                      {record.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Files */}
                  {record.files.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {record.files.map((file) => (
                        <figure
                          key={file.label}
                          className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-3"
                        >
                          <figcaption className="text-sm font-semibold text-foreground">
                            {file.label}
                          </figcaption>
                          {file.imageUrl ? (
                            <img
                              src={file.imageUrl}
                              alt={file.label}
                              className="h-48 w-full rounded-lg object-cover border border-border/60"
                            />
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                              Chưa cung cấp ảnh
                            </div>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.fields.map((field) => (
                      <div
                        key={`${record.id}-${field.label}`}
                        className="rounded-lg border border-border p-4 bg-background"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {field.label}
                        </p>
                        <p className="text-base font-semibold text-foreground mt-1">
                          {field.value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Notes removed as per requirement */}
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}

function EditableInfoItem({
  label,
  value,
  dialogTitle,
  dialogDescription,
  inputValue,
  onInputChange,
  onUpdate,
  isDialogOpen,
  onDialogOpenChange,
  isUpdating,
  inputType = "text",
  placeholder,
  maxLength,
  pattern,
}: {
  label: string;
  value: string;
  dialogTitle: string;
  dialogDescription: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onUpdate: () => void;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  isUpdating: boolean;
  inputType?: string;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
}) {
  // Initialize input value when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && !inputValue) {
      onInputChange(value !== "—" ? value : "");
    }
    onDialogOpenChange(open);
  };

  // Handle input change with validation for phone numbers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // For phone numbers, only allow digits
    if (inputType === "tel" && pattern === "[0-9]*") {
      newValue = newValue.replace(/\D/g, "");
    }

    // Apply maxLength if specified
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    onInputChange(newValue);
  };

  return (
    <div className="space-y-1 rounded-lg border border-border/60 p-3 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Pencil className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-input">{label}</Label>
                <Input
                  id="edit-input"
                  type={inputType}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  disabled={isUpdating}
                  maxLength={maxLength}
                  pattern={pattern}
                />
                {inputType === "tel" && maxLength === 10 && (
                  <p className="text-xs text-muted-foreground">
                    Vui lòng nhập đúng 10 chữ số
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onDialogOpenChange(false);
                  onInputChange("");
                }}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button onClick={onUpdate} disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-base font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}

function PasswordInfoItem({
  onUpdate,
  isDialogOpen,
  onDialogOpenChange,
  passwordValue,
  onPasswordChange,
  confirmPasswordValue,
  onConfirmPasswordChange,
  isUpdating,
}: {
  onUpdate: () => void;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  passwordValue: string;
  onPasswordChange: (value: string) => void;
  confirmPasswordValue: string;
  onConfirmPasswordChange: (value: string) => void;
  isUpdating: boolean;
}) {
  const handleOpenChange = (open: boolean) => {
    if (open) {
      onPasswordChange("");
      onConfirmPasswordChange("");
    }
    onDialogOpenChange(open);
  };

  return (
    <div className="space-y-1 rounded-lg border border-border/60 p-3 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Mật khẩu
        </p>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Pencil className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cập nhật mật khẩu</DialogTitle>
              <DialogDescription>
                Nhập mật khẩu mới và xác nhận mật khẩu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-input">Mật khẩu mới</Label>
                <Input
                  id="password-input"
                  type="password"
                  value={passwordValue}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-input">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirm-password-input"
                  type="password"
                  value={confirmPasswordValue}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  placeholder="Nhập lại mật khẩu để xác nhận"
                  disabled={isUpdating}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onDialogOpenChange(false);
                  onPasswordChange("");
                  onConfirmPasswordChange("");
                }}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button onClick={onUpdate} disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-base font-semibold text-foreground">••••••••</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-lg border border-border/60 p-3 bg-white">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}
