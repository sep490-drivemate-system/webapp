"use client";

import React, { useEffect } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  CreditCard,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/redux/useAppDispatch";
import { getUserEmergencyContact } from "@/features/document/documentThunk";

type PersonalFormValues = {
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  licensePhoto: string;
  licensePhotoFile: File | null;
};

type PersonalSectionProps = {
  editingFields: Record<string, boolean>;
  toggleFieldEditing: (fieldName: string) => void;
  saveField: (fieldName: string) => void;
  cancelFieldEditing: (fieldName: string) => void;
  formValues: PersonalFormValues & Record<string, unknown>;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  showPassword: Record<string, boolean>;
  setShowPassword: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  isLoading?: boolean;
  userId?: string;
};

const ProfileContentPersonal = ({
  editingFields,
  toggleFieldEditing,
  saveField,
  cancelFieldEditing,
  formValues,
  setFormValues,
  showPassword,
  setShowPassword,
  isLoading,
  userId,
}: PersonalSectionProps) => {
  const dispatch = useAppDispatch();
  const { emergencyContact, isLoading: documentLoading } = useAppSelector(
    (state) => state.document
  );

  const loading = isLoading || documentLoading;
  const disableField = (field: string) => loading || !editingFields[field];

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserEmergencyContact({ id: userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!emergencyContact) return;
    setFormValues((prev: PersonalFormValues) => ({
      ...prev,
      emergencyContactName: emergencyContact.name,
      emergencyContactPhone: emergencyContact.phone,
    }));
  }, [emergencyContact, setFormValues]);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-white" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="userName" className="text-gray-700 font-medium">
                  Họ và tên
                </Label>
                {!editingFields.userName ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEditing("userName")}
                    className="h-7 px-2 gap-1"
                    disabled={isLoading}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveField("userName")}
                      className="h-7 px-2 text-green-600 hover:text-green-700"
                      disabled={isLoading}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelFieldEditing("userName")}
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="userName"
                  value={formValues.userName}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      userName: e.target.value,
                    })
                  }
                  disabled={disableField("userName")}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  disabled
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Số điện thoại
                </Label>
                {!editingFields.phone ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEditing("phone")}
                    className="h-7 px-2 gap-1"
                    disabled={isLoading}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveField("phone")}
                      className="h-7 px-2 text-green-600 hover:text-green-700"
                      disabled={isLoading}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelFieldEditing("phone")}
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formValues.phone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    const limited = digitsOnly.slice(0, 10);
                    setFormValues({ ...formValues, phone: limited });
                  }}
                  disabled={disableField("phone")}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mật khẩu
                </Label>
                {!editingFields.password ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEditing("password")}
                    className="h-7 px-2 gap-1"
                    disabled={isLoading}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveField("password")}
                      className="h-7 px-2 text-green-600 hover:text-green-700"
                      disabled={isLoading}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelFieldEditing("password")}
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              {editingFields.password ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="password"
                      type={
                        showPassword.password === true ? "text" : "password"
                      }
                      value={formValues.password}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          password: e.target.value,
                        })
                      }
                      placeholder="Nhập mật khẩu mới"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword.password === true ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="confirmPassword"
                      type={
                        showPassword.confirmPassword === true
                          ? "text"
                          : "password"
                      }
                      value={formValues.confirmPassword}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Nhập lại mật khẩu"
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword.confirmPassword === true ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formValues.password &&
                    formValues.confirmPassword &&
                    formValues.password !== formValues.confirmPassword && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Mật khẩu không khớp
                      </div>
                    )}
                </div>
              ) : (
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    value="••••••••"
                    disabled
                    className="pl-10"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-white" />
            Liên hệ khẩn cấp
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contact Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="emergencyContactName"
                  className="text-gray-700 font-medium"
                >
                  Tên người liên hệ
                </Label>
                {!editingFields.emergencyContactName ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEditing("emergencyContactName")}
                    className="h-7 px-2 gap-1"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveField("emergencyContactName")}
                      className="h-7 px-2 text-green-600 hover:text-green-700"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelFieldEditing("emergencyContactName")}
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="emergencyContactName"
                  value={formValues.emergencyContactName}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      emergencyContactName: e.target.value,
                    })
                  }
                  disabled={!editingFields.emergencyContactName}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Emergency Contact Phone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="emergencyContactPhone"
                  className="text-gray-700 font-medium"
                >
                  Số điện thoại
                </Label>
                {!editingFields.emergencyContactPhone ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEditing("emergencyContactPhone")}
                    className="h-7 px-2 gap-1"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveField("emergencyContactPhone")}
                      className="h-7 px-2 text-green-600 hover:text-green-700"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        cancelFieldEditing("emergencyContactPhone")
                      }
                      className="h-7 px-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="emergencyContactPhone"
                  value={formValues.emergencyContactPhone}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      emergencyContactPhone: e.target.value,
                    })
                  }
                  disabled={!editingFields.emergencyContactPhone}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-white" />
            Bằng lái xe
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="licensePhoto"
                className="text-gray-700 font-medium"
              >
                Ảnh mặt trước
              </Label>
              {!editingFields.licensePhoto ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFieldEditing("licensePhoto")}
                  className="h-7 px-2 gap-1"
                  disabled={loading}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveField("licensePhoto")}
                    className="h-7 px-2 text-green-600 hover:text-green-700"
                    disabled={loading}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelFieldEditing("licensePhoto")}
                    className="h-7 px-2 text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            {editingFields.licensePhoto ? (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#10b981] transition-colors">
                  <input
                    type="file"
                    id="licensePhotoInput"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setFormValues({
                          ...formValues,
                          licensePhoto: previewUrl,
                          licensePhotoFile: file,
                        });
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="licensePhotoInput"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click để chọn ảnh hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 10MB
                    </span>
                  </label>
                </div>
                {formValues.licensePhoto && (
                  <div className="relative w-full max-w-md mx-auto">
                    <img
                      src={formValues.licensePhoto}
                      alt="License preview"
                      className="w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                {formValues.licensePhoto ? (
                  <img
                    src={formValues.licensePhoto}
                    alt="License"
                    className="w-full max-w-md mx-auto h-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Chưa có ảnh bằng lái xe</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContentPersonal;
