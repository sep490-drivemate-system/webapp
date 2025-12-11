"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  Car,
  BookOpen,
  Award,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Check,
  Wallet,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RefreshCw,
  BarChart3,
  X,
  Edit,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import mockData from "@/data/mock-user-profile.json";
import {
  IUserProfile,
  IBookingHistory,
  IPackagePurchase,
  IUserWallet,
  IUserInfo,
  EditUserPayload,
} from "@/types/user/user-profile.type";
import ProfileContentPersonal from "./profile-content-personal";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { editUser } from "@/features/user/userThunk";
import { updateNoviceDriverLicense } from "@/features/document/documentThunk";

type TabType =
  | "info"
  | "history"
  | "packages"
  | "wallet"
  | "notifications"
  | "settings";

interface ProfileContentProps {
  activeTab: TabType;
  userInfo?: IUserInfo | null;
  userLoading?: boolean;
}

const profile = mockData.profile as IUserProfile;
const bookingHistory = mockData.bookingHistory as IBookingHistory[];
const packagePurchases = mockData.packagePurchases as IPackagePurchase[];
const wallet = mockData.wallet as IUserWallet;
const settings = mockData.settings;

export default function ProfileContent({
  activeTab,
  userInfo,
  userLoading,
}: ProfileContentProps) {
  const dispatch = useAppDispatch();

  // Individual field editing states
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {}
  );
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form values
  const [formValues, setFormValues] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    licensePhoto: "",
    licensePhotoFile: null as File | null,
  });

  useEffect(() => {
    if (!userInfo) return;
    setFormValues((prev) => ({
      ...prev,
      userName: userInfo.fullName ?? prev.userName,
      email: userInfo.email ?? prev.email,
      phone: userInfo.phone ?? prev.phone,
    }));
  }, [userInfo]);

  useEffect(() => {
    const drivingLicense = userInfo?.noviceDriver?.drivingLicense;
    if (!drivingLicense) return;
    setFormValues((prev) => ({
      ...prev,
      licensePhoto: drivingLicense,
      licensePhotoFile: null,
    }));
  }, [userInfo]);

  const [emailNotif, setEmailNotif] = useState(settings.notifications.email);
  const [smsNotif, setSmsNotif] = useState(settings.notifications.sms);
  const [pushNotif, setPushNotif] = useState(settings.notifications.push);

  const toggleFieldEditing = (fieldName: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const saveField = async (fieldName: string) => {
    if (!userInfo?.userId) {
      setSaveError("Không tìm thấy người dùng để cập nhật");
      return;
    }

    const payload: EditUserPayload = { id: userInfo.userId };
    setSaveError(null);

    if (fieldName === "userName") {
      payload.Fullname = formValues.userName;
    } else if (fieldName === "email") {
      payload.Email = formValues.email;
    } else if (fieldName === "phone") {
      payload.PhoneNumber = formValues.phone;
    } else if (fieldName === "password") {
      if (formValues.password !== formValues.confirmPassword) {
        setSaveError("Mật khẩu không khớp");
        return;
      }
      if (!formValues.password) {
        setSaveError("Vui lòng nhập mật khẩu mới");
        return;
      }
      payload.Password = formValues.password;
    } else if (fieldName === "emergencyContactName") {
      payload.EmergencyContactName = formValues.emergencyContactName;
    } else if (fieldName === "emergencyContactPhone") {
      payload.EmergencyContactPhone = formValues.emergencyContactPhone;
    } else if (fieldName === "licensePhoto") {
      const noviceId = userInfo.noviceDriver?.noviceDriverId;
      if (!noviceId) {
        setSaveError("Không tìm thấy hồ sơ học viên để cập nhật bằng lái");
        return;
      }
      if (!formValues.licensePhotoFile) {
        setSaveError("Vui lòng chọn ảnh mới trước khi lưu");
        return;
      }
      setIsSaving(true);
      try {
        const res = await dispatch(
          updateNoviceDriverLicense({
            id: noviceId,
            image: formValues.licensePhotoFile,
          })
        ).unwrap();

        const updatedImage = res?.value?.image ?? formValues.licensePhoto;
        setFormValues((prev) => ({
          ...prev,
          licensePhoto: updatedImage ?? "",
          licensePhotoFile: null,
        }));
        toggleFieldEditing(fieldName);
      } catch (err) {
        const message =
          (err as { message?: string })?.message ||
          "Cập nhật ảnh bằng lái xe không thành công";
        setSaveError(message);
      } finally {
        setIsSaving(false);
      }
      return;
    } else {
      toggleFieldEditing(fieldName);
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(editUser(payload)).unwrap();
      toggleFieldEditing(fieldName);
      if (fieldName === "password") {
        setFormValues((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Cập nhật thông tin không thành công";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelFieldEditing = (fieldName: string) => {
    setSaveError(null);
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));
    setFormValues((prev) => {
      const updated = { ...prev };
      switch (fieldName) {
        case "userName":
          updated.userName = userInfo?.fullName ?? profile.userName;
          break;
        case "email":
          updated.email = userInfo?.email ?? profile.email;
          break;
        case "phone":
          updated.phone = userInfo?.phone ?? profile.phone;
          break;
        case "password":
          updated.password = "";
          updated.confirmPassword = "";
          break;
        case "emergencyContactName":
          updated.emergencyContactName = prev.emergencyContactName;
          break;
        case "emergencyContactPhone":
          updated.emergencyContactPhone = prev.emergencyContactPhone;
          break;
        case "licensePhoto":
          updated.licensePhoto =
            userInfo?.noviceDriver?.drivingLicense ?? prev.licensePhoto ?? "";
          updated.licensePhotoFile = null;
          break;
        default:
          break;
      }
      return updated;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      ongoing: {
        label: "Đang diễn ra",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800 border-red-200",
      },
      upcoming: {
        label: "Sắp tới",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };
    const variant = variants[status] || variants.completed;
    return (
      <Badge className={`${variant.className} border`} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "package":
        return <BookOpen className="w-5 h-5" />;
      case "car":
        return <Car className="w-5 h-5" />;
      case "session":
        return <Clock className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Personal Information Tab */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {saveError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {saveError}
            </div>
          )}
          <ProfileContentPersonal
            editingFields={editingFields}
            toggleFieldEditing={toggleFieldEditing}
            saveField={saveField}
            cancelFieldEditing={cancelFieldEditing}
            formValues={formValues}
            setFormValues={setFormValues}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={userLoading || isSaving}
            userId={userInfo?.userId}
          />
        </div>
      )}

      {/* Booking History Tab */}
      {activeTab === "history" && (
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1AD562]" />
              Lịch sử đặt chỗ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {bookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-xl p-5 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        {getTypeIcon(booking.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900">
                          {booking.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#1AD562]" />
                            {formatDate(booking.date)}
                          </span>
                          {booking.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#1AD562]" />
                              {booking.duration}
                            </span>
                          )}
                        </div>
                        {booking.instructor && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Giảng viên:{" "}
                            <span className="font-medium">
                              {booking.instructor}
                            </span>
                          </p>
                        )}
                        {booking.car && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5" />
                            Xe:{" "}
                            <span className="font-medium">{booking.car}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2 sm:min-w-[140px]">
                      {getStatusBadge(booking.status)}
                      <p className="text-xl font-bold text-[#1AD562]">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Purchases Tab */}
      {activeTab === "packages" && (
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1AD562]" />
              Lịch sử mua gói
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {packagePurchases.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border rounded-xl p-5 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {pkg.packageName}
                          </h3>
                          <Badge
                            className={`ml-2 ${
                              pkg.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : pkg.status === "completed"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            } border`}
                            variant="secondary"
                          >
                            {pkg.status === "active"
                              ? "Đang hoạt động"
                              : pkg.status === "completed"
                              ? "Đã hoàn thành"
                              : "Hết hạn"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {pkg.packageType}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#1AD562]" />
                            Mua: {formatDate(pkg.purchaseDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#1AD562]" />
                            {pkg.totalHours} giờ
                          </span>
                        </div>
                        {pkg.instructor && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                            <User className="w-3.5 h-3.5" />
                            Giảng viên:{" "}
                            <span className="font-medium">
                              {pkg.instructor}
                            </span>
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#1AD562] to-[#16B854] h-full transition-all"
                              style={{
                                width: `${
                                  (pkg.usedHours / pkg.totalHours) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {pkg.usedHours}/{pkg.totalHours}h
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Còn lại: {pkg.remainingHours} giờ
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2 sm:min-w-[140px]">
                      <p className="text-xl font-bold text-purple-600">
                        {formatPrice(pkg.price)}
                      </p>
                      <div className="text-xs text-gray-500 text-right">
                        <p>Từ: {formatDate(pkg.startDate)}</p>
                        <p>Đến: {formatDate(pkg.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Tab */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#1AD562] to-[#16B854] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Số dư ví</p>
                    <p className="text-3xl font-bold">
                      {formatPrice(wallet.balance)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="gap-2 bg-white text-[#1AD562] hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  Nạp tiền
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Tổng nạp</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(
                      wallet.transactions
                        .filter(
                          (t) =>
                            t.type === "deposit" && t.status === "completed"
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-100 mb-1">Tổng chi</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(
                      Math.abs(
                        wallet.transactions
                          .filter(
                            (t) =>
                              t.type === "payment" && t.status === "completed"
                          )
                          .reduce((sum, t) => sum + t.amount, 0)
                      )
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Plus className="w-5 h-5 text-[#1AD562]" />
              <span className="font-medium">Nạp tiền</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-green-50 hover:border-green-300"
            >
              <RefreshCw className="w-5 h-5 text-green-600" />
              <span className="font-medium">Rút tiền</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300"
            >
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Báo cáo</span>
            </Button>
          </div>

          {/* Transaction History */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1AD562]" />
                Lịch sử giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {wallet.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === "deposit"
                          ? "bg-green-100"
                          : transaction.type === "payment"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : transaction.type === "payment" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <RefreshCw className="w-5 h-5 text-[#1AD562]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {transaction.description}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </>
                        )}
                        {transaction.transactionCode && (
                          <>
                            <span>•</span>
                            <span className="font-mono">
                              {transaction.transactionCode}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatPrice(transaction.amount)}
                      </p>
                      <Badge
                        className={`mt-1 ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        } border text-xs`}
                        variant="secondary"
                      >
                        {transaction.status === "completed"
                          ? "Thành công"
                          : transaction.status === "pending"
                          ? "Đang xử lý"
                          : "Thất bại"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1AD562]" />
                Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Notification Item 1 */}
                <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Lịch học sắp tới
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                          Mới
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Bạn có buổi học lái xe vào ngày mai (15/11/2024) lúc
                        14:00 với giảng viên Nguyễn Văn Hùng.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>2 giờ trước</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Item 2 */}
                <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex-shrink-0">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Gói học của bạn sắp hết hạn
                        </h3>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
                          Quan trọng
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Gói học lái xe B2 nâng cao của bạn sẽ hết hạn vào ngày
                        20/12/2024. Bạn còn 25 giờ học chưa sử dụng.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>1 ngày trước</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Item 3 */}
                <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex-shrink-0">
                      <Wallet className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Giao dịch thành công
                        </h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200 border">
                          Đã đọc
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Bạn đã nạp thành công 5.000.000 VNĐ vào ví DriveMate. Mã
                        giao dịch: TXN001234567
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>3 ngày trước</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Item 4 */}
                <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white opacity-75">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex-shrink-0">
                      <Car className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Xác nhận đặt xe
                        </h3>
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                          Đã đọc
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Đặt xe Toyota Vios 2024 của bạn đã được xác nhận. Buổi
                        học sẽ diễn ra vào ngày 05/11/2024 lúc 14:00.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>1 tuần trước</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Item 5 */}
                <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white opacity-75">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex-shrink-0">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Ưu đãi đặc biệt
                        </h3>
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                          Đã đọc
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Giảm 20% cho gói học lái xe B2 nâng cao. Ưu đãi chỉ áp
                        dụng đến hết tháng này. Đăng ký ngay!
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>2 tuần trước</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty State (if no notifications) */}
                {/* Uncomment this if you want to show empty state
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg font-medium mb-2">
                    Chưa có thông báo
                  </p>
                  <p className="text-gray-400 text-sm">
                    Tất cả thông báo của bạn sẽ hiển thị ở đây
                  </p>
                </div>
                */}
              </div>

              {/* Load More Button */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    // Load more notifications
                  }}
                >
                  Xem thêm thông báo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1AD562]" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-[#1AD562]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Thông báo qua Email
                    </p>
                    <p className="text-sm text-gray-600">
                      Nhận thông báo về lịch học và ưu đãi qua email
                    </p>
                  </div>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Thông báo qua SMS
                    </p>
                    <p className="text-sm text-gray-600">
                      Nhận tin nhắn nhắc nhở về lịch học
                    </p>
                  </div>
                </div>
                <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Thông báo đẩy</p>
                    <p className="text-sm text-gray-600">
                      Nhận thông báo đẩy trên thiết bị di động
                    </p>
                  </div>
                </div>
                <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#1AD562]" />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-gray-700 font-medium"
                >
                  Mật khẩu hiện tại
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="currentPassword"
                    type={
                      showPassword.currentPassword === true
                        ? "text"
                        : "password"
                    }
                    placeholder="Nhập mật khẩu hiện tại"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        currentPassword: !prev.currentPassword,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.currentPassword === true ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-700 font-medium"
                >
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Xác nhận mật khẩu mới
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Đổi mật khẩu
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
