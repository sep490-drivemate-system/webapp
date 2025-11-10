"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Settings,
  Clock,
  Car,
  BookOpen,
  Award,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  ChevronRight,
  TrendingUp,
  Shield,
  LogOut,
  Check,
  Wallet,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import mockData from "@/data/mock-user-profile.json";
import { IUserProfile, IBookingHistory, IPackagePurchase, IUserWallet } from "@/types/user/user-profile.type";

const profile = mockData.profile as IUserProfile;
const bookingHistory = mockData.bookingHistory as IBookingHistory[];
const packagePurchases = mockData.packagePurchases as IPackagePurchase[];
const wallet = mockData.wallet as IUserWallet;
const settings = mockData.settings;

type TabType = "info" | "history" | "packages" | "wallet" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotif, setEmailNotif] = useState(settings.notifications.email);
  const [smsNotif, setSmsNotif] = useState(settings.notifications.sms);
  const [pushNotif, setPushNotif] = useState(settings.notifications.push);

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
      completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 border-green-200" },
      ongoing: { label: "Đang diễn ra", className: "bg-blue-100 text-blue-800 border-blue-200" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
      upcoming: { label: "Sắp tới", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
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

  const menuItems = [ 
    { id: "info" as TabType, label: "Thông tin cá nhân", icon: User },
    { id: "history" as TabType, label: "Lịch sử đặt chỗ", icon: Clock },
    { id: "packages" as TabType, label: "Lịch sử mua gói", icon: Package },
    { id: "wallet" as TabType, label: "Ví & Nạp tiền", icon: Wallet },
    { id: "settings" as TabType, label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Profile Header Card */}
        <Card className="mb-8 overflow-hidden border-none shadow-xl">
          <div className="relative bg-[#1AD562] p-8 pb-24 mt-0">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hồ Sơ Của Tôi</h1>
              </div>
              <Button variant="secondary" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
          <div className="relative px-8 mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.userName}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#1AD562] text-white rounded-full p-2.5 shadow-lg hover:bg-[#16B854] transition-all hover:scale-110">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.userName}</h2>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#1AD562]" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#1AD562]" />
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-none">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#1AD562] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* Personal Information Tab */}
            {activeTab === "info" && (
              <Card className="border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-white" />
                    Thông tin cá nhân
                  </CardTitle>
                  <Button
                    variant={isEditing ? "outline" : "green"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Check className="w-4 h-4" />
                        Lưu
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="userName" className="text-gray-700 font-medium">
                        Họ và tên
                      </Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="userName"
                          defaultValue={profile.userName}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={profile.email}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="phone"
                          defaultValue={profile.phone}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-gray-700 font-medium">
                        Ngày sinh
                      </Label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="dob"
                          type="date"
                          defaultValue={profile.dateOfBirth}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-gray-700 font-medium">
                        Địa chỉ
                      </Label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="address"
                          defaultValue={profile.address}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license" className="text-gray-700 font-medium">
                        Số giấy phép lái xe
                      </Label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="license"
                          defaultValue={profile.licenseNumber}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseType" className="text-gray-700 font-medium">
                        Loại bằng
                      </Label>
                      <div className="relative">
                        <Award className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="licenseType"
                          defaultValue={profile.licenseType}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                                  Giảng viên: <span className="font-medium">{booking.instructor}</span>
                                </p>
                              )}
                              {booking.car && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Car className="w-3.5 h-3.5" />
                                  Xe: <span className="font-medium">{booking.car}</span>
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
                              <p className="text-sm text-gray-600 mb-2">{pkg.packageType}</p>
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
                                  Giảng viên: <span className="font-medium">{pkg.instructor}</span>
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-[#1AD562] to-[#16B854] h-full transition-all"
                                    style={{
                                      width: `${(pkg.usedHours / pkg.totalHours) * 100}%`,
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
                          <p className="text-3xl font-bold">{formatPrice(wallet.balance)}</p>
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
                              .filter((t) => t.type === "deposit" && t.status === "completed")
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
                                .filter((t) => t.type === "payment" && t.status === "completed")
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
                                  <span className="font-mono">{transaction.transactionCode}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                transaction.amount > 0 ? "text-green-600" : "text-red-600"
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
                          <p className="font-medium text-gray-900">Thông báo qua Email</p>
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
                          <p className="font-medium text-gray-900">Thông báo qua SMS</p>
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
                      <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                        Mật khẩu hiện tại
                      </Label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-700 font-medium">
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
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
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
        </div>
      </div>
    </div>
  );
}
