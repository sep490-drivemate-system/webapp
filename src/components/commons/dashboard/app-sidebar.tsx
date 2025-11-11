"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    // Get user role from JWT token
    const role = getUserRole();
    setUserRole(role);
  }, []);

  // Filter navigation items based on user role
  const getFilteredNavItems = () => {
    if (userRole === UserRole.Admin) {
      // Admin has access to all navigation items
      return {
        navMain: data.navMain,
        documents: data.documents
      };
    } else if (userRole === UserRole.Inspector) {
      // Inspector only has access to NavDocuments
      return {
        navMain: [], // No access to main navigation
        documents: data.documents
      };
    } else {
      // For development or when no role is set, show all items
      // In production, you might want to redirect to login instead
      return {
        navMain: data.navMain,
        documents: data.documents
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
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">DriveMate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Show NavMain only for Admin */}
        {/* {filteredNav.navMain.length > 0 && (
         
        )} */}
        <NavMain items={filteredNav.navMain} />
        {/* Show NavDocuments for Admin and Inspector */}
        {/* {filteredNav.documents.length > 0 && (
        
        )} */}
        <NavDocuments items={filteredNav.documents} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
