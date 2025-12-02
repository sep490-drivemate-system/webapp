"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "@/components/commons/image-upload-field";
import Link from "next/link";
import Image from "next/image";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";

export default function IdentificationDocumentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Ảnh đại diện
    avatar: "",
    // Căn cước công dân
    citizenIdFront: "",
    citizenIdBack: "",
    citizenIdFullName: "",
    citizenIdDateOfBirth: "",
    citizenIdGender: "",
    // Giấy phép lái xe
    driverLicenseFront: "",
    driverLicenseBack: "",
    driverLicenseClass: "",
    // Chứng chỉ hành nghề
    trainingCertificate: "",
    trainingClass: "",
    // Giấy khám sức khỏe
    healthCertificate: "",
    // Thông tin liên hệ khẩn cấp
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Format date from yyyy-MM-dd to DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    // If already in yyyy-MM-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      try {
        const date = parse(dateStr, "yyyy-MM-dd", new Date());
        return format(date, "dd/MM/yyyy");
      } catch {
        return dateStr;
      }
    }
    // If already in DD/MM/YYYY format, return as is
    return dateStr;
  };

  // Parse date from DD/MM/YYYY to yyyy-MM-dd for storage
  const parseDateForStorage = (dateStr: string): string => {
    if (!dateStr) return "";
    // If already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Try parsing DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      try {
        const date = parse(dateStr, "dd/MM/yyyy", new Date());
        return format(date, "yyyy-MM-dd");
      } catch {
        return dateStr;
      }
    }
    // Return as is if format doesn't match
    return dateStr;
  };

  const handleImageUpload = (field: string, base64: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: base64,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit form data
      console.log("Submitting form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to waiting confirm page
      router.push("/waiting-confirm");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi gửi tài liệu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gradient-background w-full min-h-screen flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border-none shadow-lg rounded-2xl w-full max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Header with logo */}
              <div className="relative flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="DRIVEMATE Logo"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </Link>
                <p className="absolute left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold">
                  Tải lên tài liệu xác thực
                </p>
                <div className="w-[120px]"></div>
              </div>

              {/* Ảnh đại diện */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Ảnh Đại Diện
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ImageUploadField
                    label="Ảnh đại diện"
                    onUpload={(base64) => handleImageUpload("avatar", base64)}
                    preview={formData.avatar}
                    labelClassName="text-white"
                    uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                  />
                </CardContent>
              </Card>

              {/* Căn cước công dân */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Căn Cước Công Dân
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageUploadField
                      label="Ảnh Mặt Trước"
                      onUpload={(base64) =>
                        handleImageUpload("citizenIdFront", base64)
                      }
                      preview={formData.citizenIdFront}
                      labelClassName="text-white"
                      uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                    />
                    <ImageUploadField
                      label="Ảnh Mặt Sau"
                      onUpload={(base64) =>
                        handleImageUpload("citizenIdBack", base64)
                      }
                      preview={formData.citizenIdBack}
                      labelClassName="text-white"
                      uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Họ và Tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={formData.citizenIdFullName}
                        onChange={(e) =>
                          handleInputChange("citizenIdFullName", e.target.value)
                        }
                        className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Ngày Sinh <span className="text-red-500">*</span>
                      </label>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <div className="relative">
                          <Input
                            type="text"
                            value={formatDateForDisplay(
                              formData.citizenIdDateOfBirth
                            )}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const parsedValue =
                                parseDateForStorage(inputValue);
                              handleInputChange(
                                "citizenIdDateOfBirth",
                                parsedValue
                              );
                            }}
                            placeholder="DD/MM/YYYY"
                            className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10 pr-10"
                            required
                          />
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white hover:text-[#10b981] transition-colors cursor-pointer z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsCalendarOpen(true);
                              }}
                            >
                              <CalendarIcon className="w-5 h-5" />
                            </button>
                          </PopoverTrigger>
                        </div>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={
                              formData.citizenIdDateOfBirth
                                ? (() => {
                                    // Try to parse the date - support yyyy-MM-dd format
                                    const dateStr =
                                      formData.citizenIdDateOfBirth;
                                    const date = new Date(dateStr);
                                    // Check if date is valid
                                    if (!isNaN(date.getTime())) {
                                      return date;
                                    }
                                    // Try parsing DD/MM/YYYY format
                                    const parts = dateStr.split("/");
                                    if (parts.length === 3) {
                                      const day = parseInt(parts[0], 10);
                                      const month = parseInt(parts[1], 10) - 1;
                                      const year = parseInt(parts[2], 10);
                                      const parsedDate = new Date(
                                        year,
                                        month,
                                        day
                                      );
                                      if (!isNaN(parsedDate.getTime())) {
                                        return parsedDate;
                                      }
                                    }
                                    return undefined;
                                  })()
                                : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = format(
                                  date,
                                  "yyyy-MM-dd"
                                );
                                handleInputChange(
                                  "citizenIdDateOfBirth",
                                  formattedDate
                                );
                                setIsCalendarOpen(false);
                              }
                            }}
                            disabled={(date) => date > new Date()}
                            className="rounded-md border"
                            classNames={{
                              caption_label: "text-[#10b981]",
                              weekday: cn(
                                "text-[#10b981] rounded-md flex-1 font-normal text-[0.8rem] select-none"
                              ),
                              day: "text-[#10b981] hover:bg-[#10b981]/10",
                              day_selected:
                                "bg-[#10b981] text-white hover:bg-[#10b981] hover:text-white",
                              day_today: "bg-[#10b981]/20 text-[#10b981]",
                              button_previous:
                                "text-[#10b981] hover:bg-[#10b981]/10",
                              button_next:
                                "text-[#10b981] hover:bg-[#10b981]/10",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Giới Tính <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.citizenIdGender}
                        onValueChange={(value) =>
                          handleInputChange("citizenIdGender", value)
                        }
                      >
                        <SelectTrigger className="text-[#10b981] border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#10b981]/20 backdrop-blur-md border-[#10b981]/50">
                          <SelectItem
                            value="male"
                            className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                          >
                            Nam
                          </SelectItem>
                          <SelectItem
                            value="female"
                            className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                          >
                            Nữ
                          </SelectItem>
                          <SelectItem
                            value="other"
                            className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                          >
                            Khác
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Giấy phép lái xe */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Giấy Phép Lái Xe
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageUploadField
                      label="Ảnh Mặt Trước"
                      onUpload={(base64) =>
                        handleImageUpload("driverLicenseFront", base64)
                      }
                      preview={formData.driverLicenseFront}
                      labelClassName="text-white"
                      uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                    />
                    <ImageUploadField
                      label="Ảnh Mặt Sau"
                      onUpload={(base64) =>
                        handleImageUpload("driverLicenseBack", base64)
                      }
                      preview={formData.driverLicenseBack}
                      labelClassName="text-white"
                      uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Hạng Giấy Phép Lái Xe{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.driverLicenseClass}
                      onValueChange={(value) =>
                        handleInputChange("driverLicenseClass", value)
                      }
                    >
                      <SelectTrigger className="text-[#10b981] border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10">
                        <SelectValue placeholder="Chọn hạng bằng lái" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#10b981]/20 backdrop-blur-md border-[#10b981]/50">
                        <SelectItem
                          value="A1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A1
                        </SelectItem>
                        <SelectItem
                          value="A2"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A2
                        </SelectItem>
                        <SelectItem
                          value="A"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A
                        </SelectItem>
                        <SelectItem
                          value="B1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B1
                        </SelectItem>
                        <SelectItem
                          value="B2"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B2
                        </SelectItem>
                        <SelectItem
                          value="B"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B
                        </SelectItem>
                        <SelectItem
                          value="C1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng C1
                        </SelectItem>
                        <SelectItem
                          value="C"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng C
                        </SelectItem>
                        <SelectItem
                          value="D1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng D1
                        </SelectItem>
                        <SelectItem
                          value="D"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng D
                        </SelectItem>
                        <SelectItem
                          value="E"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng E
                        </SelectItem>
                        <SelectItem
                          value="F"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng F
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Chứng chỉ hành nghề */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Chứng Chỉ Hành Nghề
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <ImageUploadField
                    label="Ảnh Chứng Chỉ Hành Nghề"
                    onUpload={(base64) =>
                      handleImageUpload("trainingCertificate", base64)
                    }
                    preview={formData.trainingCertificate}
                    labelClassName="text-white"
                    uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                  />
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Hạng Xe Được Đào Tạo Giảng Dạy{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.trainingClass}
                      onValueChange={(value) =>
                        handleInputChange("trainingClass", value)
                      }
                    >
                      <SelectTrigger className="text-[#10b981] border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10">
                        <SelectValue placeholder="Chọn hạng xe" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#10b981]/20 backdrop-blur-md border-[#10b981]/50">
                        <SelectItem
                          value="A1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A1
                        </SelectItem>
                        <SelectItem
                          value="A2"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A2
                        </SelectItem>
                        <SelectItem
                          value="A"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng A
                        </SelectItem>
                        <SelectItem
                          value="B1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B1
                        </SelectItem>
                        <SelectItem
                          value="B2"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B2
                        </SelectItem>
                        <SelectItem
                          value="B"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng B
                        </SelectItem>
                        <SelectItem
                          value="C1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng C1
                        </SelectItem>
                        <SelectItem
                          value="C"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng C
                        </SelectItem>
                        <SelectItem
                          value="D1"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng D1
                        </SelectItem>
                        <SelectItem
                          value="D"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng D
                        </SelectItem>
                        <SelectItem
                          value="E"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng E
                        </SelectItem>
                        <SelectItem
                          value="F"
                          className="text-[#10b981] focus:bg-[#10b981]/30 focus:text-white hover:bg-[#10b981]/20"
                        >
                          Hạng F
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Giấy khám sức khỏe */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Giấy Khám Sức Khỏe
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ImageUploadField
                    label="Ảnh Giấy Khám Sức Khỏe"
                    onUpload={(base64) =>
                      handleImageUpload("healthCertificate", base64)
                    }
                    preview={formData.healthCertificate}
                    labelClassName="text-white"
                    uploadAreaClassName="border-2 border-dashed border-[#10b981]/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#10b981]/10 hover:bg-[#10b981]/20"
                  />
                </CardContent>
              </Card>

              {/* Thông tin liên hệ khẩn cấp */}
              <Card className="border-[#10b981]/50 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-[#10b981] text-lg">
                    Thông Tin Liên Hệ Khẩn Cấp
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Tên Người Liên Hệ Khẩn Cấp{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Nhập tên người liên hệ khẩn cấp"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          handleInputChange(
                            "emergencyContactName",
                            e.target.value
                          )
                        }
                        className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Số Điện Thoại Người Liên Hệ Khẩn Cấp{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          handleInputChange(
                            "emergencyContactPhone",
                            e.target.value
                          )
                        }
                        className="text-[#10b981] placeholder:text-gray-400 border-[#10b981]/50 focus:border-[#10b981] focus:ring-[#10b981] !bg-[#10b981]/10 focus:!bg-[#10b981]/20 hover:!bg-[#10b981]/10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
