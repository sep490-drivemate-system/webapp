"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RegistrationSection from "./registration-section";
import InsuranceSection from "./insurance-section";
import InspectionSection from "./inspection-section";
import VerificationSection from "./vertification-section";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { registerCar } from "@/features/car/carThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { ICarRegistrationRequest } from "@/types/car/car.type";
import { getManufacturers } from "@/features/car/carThunk";

interface RegistrationData {
  licensePlate?: string;
  brand?: string;
  brandId?: string;
  color?: string;
  seats?: number;
  fuelType?: string;
  model?: string;
  carType?: string;
  year?: number;
  licenseTier?: string;
  description?: string;
  frontImage?: File | string | null;
  backImage?: File | string | null;
  [key: string]: string | number | File | null | undefined;
}

interface InspectionData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  [key: string]: File | string | null | undefined;
}

interface InsuranceData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  expiryDate?: string;
  [key: string]: File | string | null | undefined;
}

interface VerificationData {
  frontImage?: File | string | null;
  backImage?: File | string | null;
  leftSideImage?: File | string | null;
  rightSideImage?: File | string | null;
  interiorImage?: File | string | null;
  [key: string]: File | string | null | undefined;
}

interface FormData {
  registration: RegistrationData;
  inspection: InspectionData;
  insurance: InsuranceData;
  verification: VerificationData;
  rentalPrice: string;
}

export default function DocumentForm({
  onSuccess,
  onError,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    registration: {},
    inspection: {},
    insurance: {},
    verification: {},
    rentalPrice: "",
  });
  const [manufacturers, setManufacturers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch manufacturers on mount
    const fetchManufacturers = async () => {
      try {
        const result = await dispatch(getManufacturers());
        if (getManufacturers.fulfilled.match(result)) {
          setManufacturers(result.payload.value || []);
        }
      } catch (error) {
        console.error("Failed to fetch manufacturers:", error);
      }
    };
    fetchManufacturers();
  }, [dispatch]);

  const handleSectionUpdate = (
    section: string,
    data: RegistrationData | InspectionData | InsuranceData | VerificationData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate Inspection Section
      if (!formData.inspection?.frontImage || !formData.inspection?.backImage) {
        throw new Error(
          "Vui lòng tải lên đầy đủ ảnh giấy đăng kiểm (mặt trước và mặt sau)"
        );
      }

      // Validate Insurance Section
      if (!formData.insurance?.frontImage || !formData.insurance?.backImage) {
        throw new Error(
          "Vui lòng tải lên đầy đủ ảnh bảo hiểm xe (mặt trước và mặt sau)"
        );
      }
      if (!formData.insurance?.expiryDate) {
        throw new Error("Vui lòng nhập ngày hết hạn bảo hiểm xe");
      }

      // Validate Registration Section
      if (!formData.registration?.licensePlate) {
        throw new Error("Vui lòng nhập biển số xe");
      }
      if (!formData.registration?.brand) {
        throw new Error("Vui lòng chọn hãng xe");
      }
      if (!formData.registration?.model) {
        throw new Error("Vui lòng nhập model xe");
      }
      if (!formData.registration?.carType) {
        throw new Error("Vui lòng chọn loại xe");
      }
      if (!formData.registration?.year || formData.registration?.year <= 0) {
        throw new Error("Vui lòng nhập năm sản xuất");
      }
      if (!formData.registration?.color) {
        throw new Error("Vui lòng nhập màu xe");
      }
      if (!formData.registration?.seats || formData.registration?.seats <= 0) {
        throw new Error("Vui lòng nhập số chỗ ngồi");
      }
      if (!formData.registration?.fuelType) {
        throw new Error("Vui lòng chọn loại nhiên liệu");
      }
      if (!formData.registration?.licenseTier) {
        throw new Error("Vui lòng chọn hạng bằng lái");
      }
      if (!formData.registration?.description || formData.registration.description.trim() === "") {
        throw new Error("Vui lòng nhập mô tả về xe");
      }
      if (!formData.rentalPrice || parseFloat(formData.rentalPrice) <= 0) {
        throw new Error("Vui lòng nhập giá thuê theo giờ");
      }

      // Validate Verification Section
      if (
        !formData.verification?.frontImage ||
        !formData.verification?.backImage ||
        !formData.verification?.leftSideImage ||
        !formData.verification?.rightSideImage ||
        !formData.verification?.interiorImage
      ) {
        throw new Error(
          "Vui lòng tải lên đầy đủ 5 ảnh xác thực xe (trước, sau, hông trái, hông phải, nội thất)"
        );
      }

      // Validate manufacturers are loaded
      if (manufacturers.length === 0) {
        throw new Error("Đang tải danh sách hãng xe. Vui lòng đợi một chút và thử lại.");
      }

      // Get instructor ID
      const userInfo = getUserInfo();
      if (!userInfo?.id) {
        throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }

      // Find brand ID from manufacturers list - must be from the list
      const selectedBrand = manufacturers.find(
        (m) => m.id === formData.registration.brandId || m.name === formData.registration.brand
      );
      
      if (!selectedBrand) {
        throw new Error("Vui lòng chọn hãng xe từ danh sách.");
      }

      const brandId = selectedBrand.id;

      // Map fuel type to API format (if needed)
      const fuelTypeMap: Record<string, string> = {
        "Xăng": "Gasoline",
        "Dầu": "Diesel",
        "Điện": "Electric",
        "Hybrid": "Hybrid",
      };
      const fuelType = fuelTypeMap[formData.registration.fuelType] || formData.registration.fuelType;

      // Helper function to extract File from File | string | undefined
      const getFile = (value: File | string | undefined): File | null => {
        if (!value) return null;
        if (value instanceof File) return value;
        return null; // Ignore string values (legacy base64)
      };

      // Prepare registration request data
      const registrationData: ICarRegistrationRequest = {
        InstructorId: userInfo.id,
        Description: formData.registration.description || "",
        HourlyPrice: parseFloat(formData.rentalPrice),
        ThumbnailImage: getFile(formData.verification.frontImage),
        CarFrontImage: getFile(formData.verification.frontImage),
        CarBackImage: getFile(formData.verification.backImage),
        CarLeftImage: getFile(formData.verification.leftSideImage),
        CarRightImage: getFile(formData.verification.rightSideImage),
        InteriorImage: getFile(formData.verification.interiorImage),
        RegistrationFront: getFile(formData.inspection.frontImage),
        RegistrationBack: getFile(formData.inspection.backImage),
        LicenseTier: formData.registration.licenseTier,
        LicensePlate: formData.registration.licensePlate,
        BrandId: brandId,
        Model: formData.registration.model,
        CarType: formData.registration.carType,
        Year: formData.registration.year,
        Color: formData.registration.color,
        Seats: formData.registration.seats,
        FuelType: fuelType,
        InsuranceFront: getFile(formData.insurance.frontImage),
        InsuranceBack: getFile(formData.insurance.backImage),
        InsuranceEndTime: formData.insurance.expiryDate || undefined,
      };

      // Convert to FormData
      const formDataToSend = new FormData();
      
      // Add non-file fields
      formDataToSend.append("InstructorId", registrationData.InstructorId);
      formDataToSend.append("Description", registrationData.Description || "");
      formDataToSend.append("HourlyPrice", registrationData.HourlyPrice.toString());
      formDataToSend.append("LicenseTier", registrationData.LicenseTier);
      formDataToSend.append("LicensePlate", registrationData.LicensePlate);
      if (registrationData.BrandId) {
        formDataToSend.append("BrandId", registrationData.BrandId);
      }
      formDataToSend.append("Model", registrationData.Model);
      formDataToSend.append("CarType", registrationData.CarType);
      formDataToSend.append("Year", registrationData.Year.toString());
      formDataToSend.append("Color", registrationData.Color);
      formDataToSend.append("Seats", registrationData.Seats.toString());
      formDataToSend.append("FuelType", registrationData.FuelType);
      if (registrationData.InsuranceEndTime) {
        formDataToSend.append("InsuranceEndTime", registrationData.InsuranceEndTime);
      }

      // Add file fields
      if (registrationData.ThumbnailImage) {
        formDataToSend.append("ThumbnailImage", registrationData.ThumbnailImage);
      }
      if (registrationData.CarFrontImage) {
        formDataToSend.append("CarFrontImage", registrationData.CarFrontImage);
      }
      if (registrationData.CarBackImage) {
        formDataToSend.append("CarBackImage", registrationData.CarBackImage);
      }
      if (registrationData.CarLeftImage) {
        formDataToSend.append("CarLeftImage", registrationData.CarLeftImage);
      }
      if (registrationData.CarRightImage) {
        formDataToSend.append("CarRightImage", registrationData.CarRightImage);
      }
      if (registrationData.InteriorImage) {
        formDataToSend.append("InteriorImage", registrationData.InteriorImage);
      }
      if (registrationData.RegistrationFront) {
        formDataToSend.append("RegistrationFront", registrationData.RegistrationFront);
      }
      if (registrationData.RegistrationBack) {
        formDataToSend.append("RegistrationBack", registrationData.RegistrationBack);
      }
      if (registrationData.InsuranceFront) {
        formDataToSend.append("InsuranceFront", registrationData.InsuranceFront);
      }
      if (registrationData.InsuranceBack) {
        formDataToSend.append("InsuranceBack", registrationData.InsuranceBack);
      }

      // Log FormData fields for debugging
      console.log("=== FormData Fields ===");
      console.log("Registration Data:", registrationData);
      console.log("\n--- FormData Entries ---");
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log("======================\n");

      // Call API using thunk
      const result = await dispatch(registerCar(formDataToSend));

      if (registerCar.rejected.match(result)) {
        throw new Error(result.payload || "Tải lên dữ liệu xe thất bại");
      }

      onSuccess("Tải lên dữ liệu xe thành công!");
      
      // Redirect to car-management page after a short delay
      setTimeout(() => {
        router.push("/car-management");
      }, 1000);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Tải lên thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="inspection" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger
            value="inspection"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Đăng Kiểm
          </TabsTrigger>
          <TabsTrigger
            value="insurance"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Bảo Hiểm
          </TabsTrigger>
          <TabsTrigger
            value="registration"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Đăng Ký
          </TabsTrigger>
          <TabsTrigger
            value="verification"
            className="text-sm text-foreground data-[state=active]:bg-emerald-600 data-[state=active]:text-primary-foreground"
          >
            Xác Thực
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspection" className="space-y-4">
          <InspectionSection
            data={formData.inspection}
            onUpdate={(data) => handleSectionUpdate("inspection", data)}
          />
        </TabsContent>
        <TabsContent value="insurance" className="space-y-4">
          <InsuranceSection
            data={formData.insurance}
            onUpdate={(data) => handleSectionUpdate("insurance", data)}
          />
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          <RegistrationSection
            data={formData.registration}
            rentalPrice={formData.rentalPrice}
            manufacturers={manufacturers}
            onUpdate={(data) => handleSectionUpdate("registration", data)}
            onPriceUpdate={(price: string) =>
              setFormData((prev) => ({ ...prev, rentalPrice: price }))
            }
          />
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <VerificationSection
            data={formData.verification}
            onUpdate={(data) => handleSectionUpdate("verification", data)}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex gap-3 justify-end border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              inspection: {},
              insurance: {},
              registration: {},
              verification: {},
              rentalPrice: "",
            });
          }}
          className="border-border text-foreground hover:bg-muted"
        >
          Đặt Lại
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground"
        >
          {isSubmitting ? "Đang Tải Lên..." : "Gửi Toàn Bộ Tài Liệu"}
        </Button>
      </div>
    </form>
  );
}
