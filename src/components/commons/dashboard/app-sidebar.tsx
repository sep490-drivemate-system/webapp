"use client";

import * as React from "react";
import {
  IconBell,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFile,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHistory,
  IconInnerShadowTop,
  IconListDetails,
  IconNavigation,
  IconReport,
  IconSearch,
  IconSettings,
  IconStar,
  IconStarFilled,
  IconUsers,
} from "@tabler/icons-react";
import { IconUserCog } from "@tabler/icons-react";
import { IconPackage } from "@tabler/icons-react";
import { IconArticle } from "@tabler/icons-react";
import { IconBook } from "@tabler/icons-react";
import { IconUsersGroup } from "@tabler/icons-react";
import { IconCar } from "@tabler/icons-react";
import { NavDocuments } from "@/components/commons/dashboard/nav-documents";
import { NavMain } from "@/components/commons/dashboard/nav-main";
import { NavInstructor } from "@/components/commons/dashboard/nav-instructor";
import { NavSecondary } from "@/components/commons/dashboard/nav-secondary";
import { NavUser } from "@/components/commons/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getUserRole } from "@/lib/jwt/jwt.utils";
import { UserRole } from "@/types/auth/user-role.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboards",
      icon: IconDashboard,
    },
    {
      title: "Quản lý người dùng",
      url: "/management-user",
      icon: IconUserCog,
    },
    {
      title: "Vai trò & Quyền",
      url: "/management-role",
      icon: IconUsers,
    },
    {
      title: "Quản lý gói thuê",
      url: "/management-package",
      icon: IconPackage,
    },
    {
      title: "Quản lý tài liệu",
      url: "/management-document",
      icon: IconArticle,
    },
    {
      title: "Quản lý xe",
      url: "/management-car",
      icon: IconCar,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/dashboard/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/capture/active",
        },
        {
          title: "Archived",
          url: "/dashboard/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "/dashboard/proposal",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/proposal/active",
        },
        {
          title: "Archived",
          url: "/dashboard/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "/dashboard/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/dashboard/prompts/active",
        },
        {
          title: "Archived",
          url: "/dashboard/prompts/archived",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "/dashboard/settings",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "/dashboard/help",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "/dashboard/search",
  //     icon: IconSearch,
  //   },
  // ],
  documents: [
    {
      name: "Quản lý người hướng dẫn",
      url: "/management-instructor",
      icon: IconUsersGroup,
    },
    {
      name: "Quản lý bài viết",
      url: "/management-article",
      icon: IconBook,
    },
    {
      name: "Reports",
      url: "/dashboard/documents/reports",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/dashboard/documents/word-assistant",
      icon: IconFileWord,
    },
  ],

  navInstructor: [
    {
      name: "Tổng quan",
      url: "/overview",
      icon: IconDashboard,
    },

    {
      name: "Lịch làm việc",
      url: "/schedule-management",
      icon: IconCalendar,
    },
    {
      name: "Quản lý xe học lái",
      url: "/car-management",
      icon: IconCar,
    },
    {
      name: "Quản lý gói dịch vụ",
      url: "/service-package-management",
      icon: IconPackage,
    },
    {
      name: "Quản lý buổi huấn luyện",
      url: "/driving-session-management",
      icon: IconNavigation,
    },
    {
      name: "Thông báo",
      url: "/",
      icon: IconBell,
    },
    {
      name: "Lịch sử giao dịch",
      url: "/",
      icon: IconHistory,
    },
    {
      name: "Đánh giá",
      url: "/",
      icon: IconStar,
    },
    {
      name: "Giấy tờ tùy thân",
      url: "/identification-document-management",
      icon: IconFile,
    },
  ],
};

const DEV_ROLE_OVERRIDE_KEY = "dev_role_override";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    // Check for dev role override first, then fall back to JWT token
    const overrideRole = localStorage.getItem(DEV_ROLE_OVERRIDE_KEY);
    if (overrideRole !== null) {
      const role = parseInt(overrideRole, 10) as UserRole;
      setUserRole(role);
    } else {
      // Get user role from JWT token
      const role = getUserRole();
      setUserRole(role);
    }
  }, []);

  const handleRoleChange = (role: string) => {
    const roleValue = parseInt(role, 10) as UserRole;
    localStorage.setItem(DEV_ROLE_OVERRIDE_KEY, role);
    setUserRole(roleValue);
  };

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    if (userRole === UserRole.Admin) {
      // Admin only has access to NavMain
      return {
        navMain: data.navMain,
        documents: [],
        navInstructor: [],
      };
    } else if (userRole === UserRole.Inspector) {
      // Inspector only has access to NavDocuments
      return {
        navMain: [],
        documents: data.documents,
        navInstructor: [],
      };
    } else if (userRole === UserRole.Instructor) {
      // Instructor only has access to NavInstructor
      return {
        navMain: [],
        documents: [],
        navInstructor: data.navInstructor,
      };
    } else {
      // For development or when no role is set, show all items
      // In production, you might want to redirect to login instead
      return {
        navMain: data.navMain,
        documents: data.documents,
        navInstructor: data.navInstructor,
      };
    }
  };

  const filteredNav = getFilteredNavItems();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconChartBar className="!size-5 text-[#1AD562]" />
                <span className="text-base font-semibold text-[#1AD562]">
                  DriveMate System
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Show NavMain only for Admin */}
        {userRole === UserRole.Admin && <NavMain items={filteredNav.navMain} />}
        {/* Show NavDocuments only for Inspector */}
        {userRole === UserRole.Inspector && (
          <NavDocuments items={filteredNav.documents} />
        )}
        {/* Show NavInstructor only for Instructor */}
        {userRole === UserRole.Instructor && (
          <NavInstructor items={filteredNav.navInstructor} />
        )}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        {/* Role Switcher for Development */}
        <div className="px-2 py-2 border-t">
          <div className="px-2 py-1 text-xs text-muted-foreground mb-1">
            Dev: Switch Role
          </div>
          <Select
            value={userRole?.toString() || ""}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.Admin.toString()}>Admin</SelectItem>
              <SelectItem value={UserRole.Inspector.toString()}>
                Inspector
              </SelectItem>
              <SelectItem value={UserRole.Instructor.toString()}>
                Instructor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
