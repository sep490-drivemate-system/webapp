"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, Mail, Camera, Check, X } from "lucide-react";
import ProfileSideBar from "@/components/profile/profile-side-bar";
import ProfileContent from "@/components/profile/profile-content";
import mockData from "@/data/mock-user-profile.json";
import { IUserProfile, EditUserPayload } from "@/types/user/user-profile.type";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { editUser, getUserById } from "@/features/user/userThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { IUserInfo } from "@/types/user/user-profile.type";

const profile = mockData.profile as IUserProfile;

type TabType =
  | "info"
  | "history"
  | "packages"
  | "wallet"
  | "notifications"
  | "settings";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      const jwtUser = getUserInfo();
      if (!jwtUser?.id) {
        setUserError("Không tìm thấy thông tin người dùng");
        return;
      }

      setIsUserLoading(true);
      try {
        const response = await dispatch(
          getUserById({ id: jwtUser.id })
        ).unwrap();

        if (cancelled) return;
        const fetchedUser = response.value ?? null;
        setUserInfo(fetchedUser);
        setAvatarPreview(fetchedUser?.avatarUrl ?? profile.avatar ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch user info", err);
          setUserError("Không thể tải thông tin người dùng");
        }
      } finally {
        if (!cancelled) {
          setIsUserLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const resolvedAvatar = avatarPreview ?? profile.avatar ?? "";

  const handleSaveAvatar = async () => {
    if (!userInfo?.userId) {
      setUserError("Không tìm thấy thông tin người dùng");
      return;
    }
    if (!avatarPreview && !avatarFile) {
      setAvatarError("Vui lòng chọn ảnh đại diện");
      return;
    }

    const payload: EditUserPayload = {
      id: userInfo.userId,
      ProfileAvatar: avatarFile ?? avatarPreview ?? "",
    };

    setAvatarSaving(true);
    setAvatarError(null);
    try {
      await dispatch(editUser(payload)).unwrap();
      setIsEditingAvatar(false);
      setUserInfo((prev) =>
        prev
          ? {
            ...prev,
            avatarUrl: avatarPreview ?? prev.avatarUrl,
          }
          : prev
      );
      setAvatarFile(null);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Cập nhật ảnh đại diện không thành công";
      setAvatarError(message);
    } finally {
      setAvatarSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Profile Header Section */}
        <div className="m-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Avatar Section */}
              <div className="relative group flex-shrink-0">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 ring-4 ring-[#10b981]/20">
                  {resolvedAvatar ? (
                    <Image
                      src={resolvedAvatar}
                      alt={userInfo?.fullName ?? profile.userName}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#10b981] bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {isEditingAvatar ? (
                  <div className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleSaveAvatar}
                      disabled={avatarSaving}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-xl ring-4 ring-white"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setAvatarPreview(
                          userInfo?.avatarUrl ?? profile.avatar ?? null
                        );
                        setAvatarFile(null);
                        setAvatarError(null);
                        setIsEditingAvatar(false);
                      }}
                      className="rounded-full p-2 shadow-xl ring-4 ring-white"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingAvatar(true);
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-full p-3 shadow-xl hover:from-[#059669] hover:to-[#047857] transition-all hover:scale-110 active:scale-95 ring-4 ring-white"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarPreview(reader.result as string);
                        setIsEditingAvatar(true);
                        setAvatarError(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              {avatarError && (
                <div className="text-sm text-red-600 mt-2">{avatarError}</div>
              )}

              {/* User Info Section */}
              <div className="flex-1 w-full text-center sm:text-left flex items-center sm:items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {userInfo?.fullName ?? profile.userName}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <span className="text-sm sm:text-base font-medium">
                      {userInfo?.email ?? profile.email}
                    </span>
                    {userError && (
                      <span className="text-xs text-red-500">{userError}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProfileSideBar activeTab={activeTab} onTabChange={setActiveTab} />

          <ProfileContent
            activeTab={activeTab}
            userInfo={userInfo}
            userLoading={isUserLoading}
          />
        </div>
      </div>
    </div>
  );
}
