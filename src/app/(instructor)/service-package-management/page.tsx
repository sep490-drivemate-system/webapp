import { PackageManagementPage } from "@/components/commons/service-package/package-management-page";

export const metadata = {
  title: "Quản lý Gói Dịch Vụ",
  description: "Quản lý các gói dịch vụ của bạn một cách hiệu quả",
};

export default function Home() {
  return <PackageManagementPage />;
}
