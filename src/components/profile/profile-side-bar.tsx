import {
  User,
  Clock,
  Package,
  Wallet,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type TabType =
  | "info"
  | "history"
  | "packages"
  | "wallet"
  | "notifications"
  | "settings";

interface ProfileSideBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const menuItems = [
  { id: "info" as TabType, label: "Thông tin cá nhân", icon: User },
  { id: "history" as TabType, label: "Lịch sử giao dịch", icon: Clock },
  { id: "packages" as TabType, label: "Lịch sử mua gói", icon: Package },
  { id: "wallet" as TabType, label: "Ví & Nạp tiền", icon: Wallet },
  { id: "notifications" as TabType, label: "Thông báo", icon: Bell },
  { id: "settings" as TabType, label: "Cài đặt", icon: Settings },
];

export default function ProfileSideBar({
  activeTab,
  onTabChange,
}: ProfileSideBarProps) {
  return (
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
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-md hover:from-[#059669] hover:to-[#047857]"
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
  );
}
