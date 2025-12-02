export type SettingCategory =
  | "cancel-service-package"
  | "cancel-driving-session"
  | "reschedule-driving-session";

export type SettingValueType = "int" | "string";

const SETTING_ROLE_LABELS = {
  NoviceDriver: "Người lái mới",
  Instructor: "Người hướng dẫn",
} as const;

export type SettingRoleKey = keyof typeof SETTING_ROLE_LABELS;

export interface Setting {
  id: string;
  name: string;
  value: string;
  valueType: SettingValueType;
  unitOfMeasurement: number;
  days: number;
}

export type SettingInput = Omit<Setting, "id">;

export const getSettingRoleKeyFromName = (
  name: string
): SettingRoleKey | null => {
  const parts = name.split("_");
  const lastPart = parts[parts.length - 1] as SettingRoleKey | undefined;

  if (!lastPart) return null;
  if (lastPart in SETTING_ROLE_LABELS) {
    return lastPart;
  }

  return null;
};

export const getSettingRoleLabelFromName = (name: string): string => {
  const roleKey = getSettingRoleKeyFromName(name);
  if (!roleKey) {
    return "Không xác định";
  }
  return SETTING_ROLE_LABELS[roleKey];
};

export const getSettingCategoryFromName = (
  name: string
): SettingCategory | null => {
  if (!name) return null;

  if (name.startsWith("CancelServicePackage")) {
    return "cancel-service-package";
  }

  if (name.startsWith("CancelDrivingSession")) {
    return "cancel-driving-session";
  }

  if (name.startsWith("RescheduleDrivingSession")) {
    return "reschedule-driving-session";
  }

  return null;
};

export const getSettingDisplayNameFromName = (name: string): string => {
  switch (name) {
    case "CancelServicePackage_WithinDays_Unused_NoviceDriver":
      return "Hủy gói =< 30 ngày, chưa sử dụng";
    case "CancelServicePackage_OverDays_Unused_NoviceDriver":
      return "Hủy gói > 30 ngày, chưa sử dụng";
    case "CancelServicePackage_WithinDays_PartiallyUsed_Formula_NoviceDriver":
      return "Hủy gói =< 30 ngày, đã sử dụng một phần";
    case "CancelDrivingSession_Refund_OnOrBeforeDays_NoviceDriver":
      return "Hủy buổi huấn luyện >= 1 ngày trước giờ học ";
    case "CancelDrivingSession_Refund_UnderDays_NoviceDriver":
      return "Hủy buổi huấn luyện < 1 ngày trước giờ học";
    case "CancelDrivingSession_Refund_OnOrBeforeDays_Instructor":
      return "Hủy buổi huấn luyện >= 1 ngày trước giờ học ";
    case "CancelDrivingSession_Refund_UnderDays_Instructor":
      return "Hủy buổi huấn luyện < 1 ngày trước giờ học ";
    case "RescheduleDrivingSession_OnOrBeforeDays_NoviceDriver":
      return "Đổi lịch buổi huấn luyện >= 1 ngày trước giờ học";
    case "RescheduleDrivingSession_UnderDays_NoviceDriver":
      return "Đổi lịch buổi huấn luyện < 1 ngày trước giờ học";
    case "RescheduleDrivingSession_OnOrBeforeDays_Instructor":
      return "Đổi lịch buổi huấn luyện ≤ 1 ngày trước giờ học";
    case "RescheduleDrivingSession_UnderDays_Instructor":
      return "Đổi lịch buổi huấn luyện < 1 ngày trước giờ học";
    default:
      return name;
  }
};

export const getSettingDisplayName = (setting: Setting): string => {
  const { name, days } = setting;
  const baseName = getSettingDisplayNameFromName(name);

  return baseName.replace(/\d+ ngày/g, `${days} ngày`);
};

export const getSettingDescriptionFromName = (name: string): string => {
  switch (name) {
    case "CancelServicePackage_WithinDays_Unused_NoviceDriver":
      return "Hoàn lại 100% giá trị gói.";
    case "CancelServicePackage_OverDays_Unused_NoviceDriver":
      return "Hoàn lại 0% giá trị gói.";
    case "CancelServicePackage_WithinDays_PartiallyUsed_Formula_NoviceDriver":
      return "Hoàn lại phần giá trị gói còn lại = (tổng giá trị gói / tổng giờ đi) × số giờ còn lại của gói.";
    case "CancelDrivingSession_Refund_OnOrBeforeDays_NoviceDriver":
      return "Hoàn lại 100% số giờ đã đặt trong buổi huấn luyện vào gói dịch vụ.";
    case "CancelDrivingSession_Refund_UnderDays_NoviceDriver":
      return "Hoàn lại 0% số giờ đã đặt trong buổi huấn luyện vào gói dịch vụ.";
    case "CancelDrivingSession_Refund_OnOrBeforeDays_Instructor":
      return "Hoàn lại 100% số giờ đã đặt trong buổi huấn luyện vào gói dịch vụ cho người lái mới.";
    case "CancelDrivingSession_Refund_UnderDays_Instructor":
      return "Hoàn lại 150% số giờ đã đặt trong buổi huấn luyện vào gói dịch vụ cho người lái mới.";
    case "RescheduleDrivingSession_OnOrBeforeDays_NoviceDriver":
      return "Người lái mới được phép đổi lịch.";
    case "RescheduleDrivingSession_UnderDays_NoviceDriver":
      return "Người lái mới không được đổi lịch.";
    case "RescheduleDrivingSession_OnOrBeforeDays_Instructor":
      return "Người hướng dẫn được phép đổi lịch.";
    case "RescheduleDrivingSession_UnderDays_Instructor":
      return "Người hướng dẫn không được đổi lịch.";
    default:
      return "";
  }
};

export const getSettingDescription = (setting: Setting): string => {
  const { name, value } = setting;
  const baseDescription = getSettingDescriptionFromName(name);

  if (name.includes("CancelServicePackage") || name.includes("CancelDrivingSession_Refund")) {
    let percentValue = value;
    if (!value.includes("%")) {
      percentValue = `${value}%`;
    }
    const percentMatch = percentValue.match(/([\d.]+)%/);
    if (percentMatch) {
      return baseDescription.replace(/[\d.]+%/, `${percentMatch[1]}%`);
    }
  }

  return baseDescription;
};

export const settingsData: Setting[] = [
  {
    id: "1",
    name: "CancelServicePackage_WithinDays_Unused_NoviceDriver",
    value: "100",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 30,
  },
  {
    id: "2",
    name: "CancelServicePackage_OverDays_Unused_NoviceDriver",
    value: "0",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 30,
  },
  {
    id: "3",
    name: "CancelServicePackage_WithinDays_PartiallyUsed_Formula_NoviceDriver",
    value: "Refund = (PackagePrice / TotalPackageHours) * RemainingHours",
    valueType: "string",
    unitOfMeasurement: 0,
    days: 30,
  },
  {
    id: "4",
    name: "CancelDrivingSession_Refund_OnOrBeforeDays_NoviceDriver",
    value: "100%",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 1,
  },
  {
    id: "5",
    name: "CancelDrivingSession_Refund_UnderDays_NoviceDriver",
    value: "0%",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 1,
  },
  {
    id: "6",
    name: "CancelDrivingSession_Refund_OnOrBeforeDays_Instructor",
    value: "100%",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 1,
  },
  {
    id: "7",
    name: "CancelDrivingSession_Refund_UnderDays_Instructor",
    value: "150%",
    valueType: "int",
    unitOfMeasurement: 1,
    days: 1,
  },
  {
    id: "8",
    name: "RescheduleDrivingSession_OnOrBeforeDays_NoviceDriver",
    value: "",
    valueType: "int",
    unitOfMeasurement: 0,
    days: 1,
  },
  {
    id: "9",
    name: "RescheduleDrivingSession_UnderDays_NoviceDriver",
    value: "",
    valueType: "int",
    unitOfMeasurement: 0,
    days: 1,
  },
  {
    id: "10",
    name: "RescheduleDrivingSession_OnOrBeforeDays_Instructor",
    value: "",
    valueType: "int",
    unitOfMeasurement: 0,
    days: 1,
  },
  {
    id: "11",
    name: "RescheduleDrivingSession_UnderDays_Instructor",
    value: "",
    valueType: "int",
    unitOfMeasurement: 0,
    days: 1,
  },
];

