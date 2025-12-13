"use client";

import PageHeader from "@/components/commons/Header/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getDrivingSkills,
  getRoadTypes,
  createInstructorPackage,
} from "@/features/package/packageThunk";
import { useThunkAction } from "@/lib/redux/useThunkAction";
import { DrivingSkill, RoadType } from "@/types/package/package.type";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_PACKAGE = {
  title: "Gói miền Tây",
  description: "",
  skills: ["Lùi xe", "Đỗ xe", "Quan sát"],
  roadTypes: ["Đường trơn trượt", "Đường đông dân cư"],
  duration: "01:30",
  carOption: "Người hướng dẫn và xe",
  price: "150000",
};

const EMPTY_PACKAGE = {
  title: "",
  description: "",
  skills: [] as string[],
  roadTypes: [] as string[],
  duration: "",
  carOption: "",
  price: "",
};

const CAR_OPTIONS = [
  "Người hướng dẫn và xe",
  "Người hướng dẫn",
];

const formatDuration = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
};

const formatCurrencyVND = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const convertDurationToHours = (duration: string): number => {
  if (!duration) return 0;
  const [hours, minutes] = duration.split(":").map(Number);
  const totalHours = hours + (minutes || 0) / 60;
  return totalHours;
};

export default function ServicePackageDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("id");
  const isCreate = searchParams.get("create") === "true";
  const [drivingSkills, setDrivingSkills] = useState<DrivingSkill[]>([]);
  const [roadTypes, setRoadTypes] = useState<RoadType[]>([]);
  const { run: fetchDrivingSkills, loading: fetchDrivingSkillsLoading } =
    useThunkAction(getDrivingSkills);
  const { run: fetchRoadTypes, loading: fetchRoadTypesLoading } =
    useThunkAction(getRoadTypes);
  const { run: createPackage, loading: createPackageLoading } =
    useThunkAction(createInstructorPackage);

  const [form, setForm] = useState(isCreate ? EMPTY_PACKAGE : DEFAULT_PACKAGE);
  const [saved, setSaved] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  // Load package data if editing (when packageId is provided)
  useEffect(() => {
    if (packageId && !isCreate) {
      // TODO: Fetch package data from API using packageId
      // For now, using DEFAULT_PACKAGE as placeholder
      setForm(DEFAULT_PACKAGE);
    }
  }, [packageId, isCreate]);

  const handleChange = (field: string, value: string | string[]) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const handleRoadToggle = (road: string) => {
    setForm((f) => ({
      ...f,
      roadTypes: f.roadTypes.includes(road)
        ? f.roadTypes.filter((r) => r !== road)
        : [...f.roadTypes, road],
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!form.title.trim()) {
      alert("Vui lòng nhập tên gói dịch vụ");
      return;
    }
    if (!form.price.trim()) {
      alert("Vui lòng nhập giá tiền");
      return;
    }
    if (!form.duration.trim()) {
      alert("Vui lòng nhập thời lượng");
      return;
    }
    if (form.skills.length === 0) {
      alert("Vui lòng chọn ít nhất một kỹ năng");
      return;
    }
    if (form.roadTypes.length === 0) {
      alert("Vui lòng chọn ít nhất một loại đường");
      return;
    }
    if (!form.carOption) {
      alert("Vui lòng chọn tùy chọn xe");
      return;
    }

    // Convert form data to API format
    const priceNumber = parseFloat(form.price.replace(/\./g, ""));
    const durationHours = convertDurationToHours(form.duration);
    const isRentalCar = form.carOption === "Người hướng dẫn và xe";

    const packageData = {
      name: form.title,
      description: form.description || "",
      duration: durationHours,
      roadTypes: form.roadTypes,
      drivingSkills: form.skills,
      price: priceNumber,
      isRentalCar: isRentalCar,
      packageCars: [], // Empty array for now, can be extended later
    };

    console.log(packageData);

    createPackage(packageData, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);

        // If creating, navigate back after save
        if (isCreate) {
          setTimeout(() => {
            router.push("/service-package-management");
          }, 2000);
        }
      },
      onError: (error) => {
        console.error("Error creating package:", error);
        alert("Có lỗi xảy ra khi lưu gói dịch vụ. Vui lòng thử lại.");
      },
    });
  };

  const handleReset = () => {
    setForm(isCreate ? EMPTY_PACKAGE : DEFAULT_PACKAGE);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const getSkillsDisplayText = () => {
    if (form.skills.length === 0) return "";
    if (form.skills.length === 1) {
      const skill = drivingSkills.find((s) => s.id === form.skills[0]);
      return skill?.display_name || form.skills[0];
    }
    return `${form.skills.length} kỹ năng đã chọn`;
  };

  const getRoadTypesDisplayText = () => {
    if (form.roadTypes.length === 0) return "";
    if (form.roadTypes.length === 1) {
      const roadType = roadTypes.find((r) => r.id === form.roadTypes[0]);
      return roadType?.name || form.roadTypes[0];
    }
    return `${form.roadTypes.length} loại đường đã chọn`;
  };

  useEffect(() => {
    fetchDrivingSkills(undefined, {
      onSuccess: (response) => {
        setDrivingSkills(response?.value ?? []);
      },
      onError: (error) => {
        console.error("Error fetching driving skills:", error);
      },
    });
  }, [fetchDrivingSkills]);

  useEffect(() => {
    fetchRoadTypes(undefined, {
      onSuccess: (response) => {
        setRoadTypes(response?.value ?? []);
      },
      onError: (error) => {
        console.error("Error fetching road types:", error);
      },
    });
  }, [fetchRoadTypes]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <PageHeader
        title={
          isCreate ? "Tạo chi tiết gói dịch vụ" : "Xem chi tiết gói dịch vụ"
        }
        description={
          isCreate
            ? "Tạo gói dịch vụ mới cho khách hàng"
            : "Xem và chỉnh sửa thông tin gói dịch vụ"
        }
        leftAction={
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">
              Đã lưu chỉnh sửa thành công!
            </p>
          </div>
        )}

        {/* Form Card */}
        <Card className="border border-gray-200 overflow-visible">
          <div className="p-6 space-y-6">
            {/* Package Name */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-base font-semibold text-gray-900"
              >
                Tên gói dịch vụ <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tên gói dịch vụ"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="border-gray-300 rounded-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-base font-semibold text-gray-900"
              >
                Mô tả
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả gói dịch vụ (tùy chọn)"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border-gray-300 rounded-lg min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-base font-semibold text-gray-900"
              >
                Giá tiền (VNĐ) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="price"
                type="text"
                placeholder="VD: 150.000"
                value={form.price}
                onChange={(e) =>
                  handleChange("price", formatCurrencyVND(e.target.value))
                }
                className="border-gray-300 rounded-lg"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-base font-semibold text-gray-900"
              >
                Thời lượng <span className="text-red-600">*</span>
              </Label>
              <Input
                id="duration"
                type="text"
                placeholder="hh:mm"
                maxLength={5}
                value={form.duration}
                onChange={(e) =>
                  handleChange("duration", formatDuration(e.target.value))
                }
                className="border-gray-300 rounded-lg"
              />
            </div>

            {/* Skills Dropdown */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900">
                Kỹ năng học được <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("skills")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
                >
                  <span
                    className={
                      getSkillsDisplayText() ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {getSkillsDisplayText() || "Chọn kỹ năng học được"}
                  </span>
                  {openDropdowns.skills ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openDropdowns.skills && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {fetchDrivingSkillsLoading ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Đang tải...
                      </div>
                    ) : drivingSkills.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </div>
                    ) : (
                      drivingSkills.map((skill) => {
                        const isSelected = form.skills.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            onClick={() => handleSkillToggle(skill.id)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-600 border-emerald-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-900">
                              {skill.display_name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Road Types Dropdown */}
            <div className="space-y-2 relative z-40">
              <Label className="text-base font-semibold text-gray-900">
                Loại đường <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("roadTypes")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
                >
                  <span
                    className={
                      getRoadTypesDisplayText()
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {getRoadTypesDisplayText() || "Chọn loại đường"}
                  </span>
                  {openDropdowns.roadTypes ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openDropdowns.roadTypes && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {fetchRoadTypesLoading ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Đang tải...
                      </div>
                    ) : roadTypes.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </div>
                    ) : (
                      roadTypes.map((roadType) => {
                        const isSelected = form.roadTypes.includes(roadType.id);
                        return (
                          <button
                            key={roadType.id}
                            onClick={() => handleRoadToggle(roadType.id)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-600 border-emerald-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-900">
                              {roadType.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Car Option */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-900">
                Tùy chọn xe <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("carOption")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
                >
                  <span
                    className={
                      form.carOption ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {form.carOption || "Chọn tùy chọn xe"}
                  </span>
                  {openDropdowns.carOption ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openDropdowns.carOption && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {CAR_OPTIONS.map((option) => {
                      const isSelected = form.carOption === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            handleChange("carOption", option);
                            setOpenDropdowns((prev) => ({
                              ...prev,
                              carOption: false,
                            }));
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-emerald-600 border-emerald-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
            >
              Đặt lại
            </Button>
            <Button
              onClick={handleSave}
              disabled={createPackageLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {createPackageLoading
                ? "Đang lưu..."
                : isCreate
                ? "Tạo"
                : "Lưu"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
