import {
  User,
  Clock,
  Package,
  Wallet,
  Settings,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@/hooks/auth/useSignIn";

type TabType =
  | "info"
  | "history"
  | "packages"
  | "wallet"
  | "notifications"
  | "settings";

type MenuItemId = TabType | "logout";

interface ProfileSideBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const menuItems: Array<{ id: MenuItemId; label: string; icon: any }> = [
  { id: "info", label: "Thông tin cá nhân", icon: User },
  { id: "history", label: "Lịch sử giao dịch", icon: Clock },
  { id: "packages", label: "Lịch sử mua gói", icon: Package },
  { id: "wallet", label: "Ví & Nạp tiền", icon: Wallet },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "settings", label: "Cài đặt", icon: Settings },
  { id: "logout", label: "Đăng xuất", icon: LogOut },
];

export default function ProfileSideBar({
  activeTab,
  onTabChange,
}: ProfileSideBarProps) {
  const { handleSignOut } = useSignIn();

  const handleItemClick = (itemId: MenuItemId) => {
    if (itemId === "logout") {
      handleSignOut();
      return;
    }
    onTabChange(itemId as TabType);
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24 shadow-lg border-none">
        <CardContent className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLogout = item.id === "logout";
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive && !isLogout
                    ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-md hover:from-[#059669] hover:to-[#047857]"
                    : isLogout
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && !isLogout && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

