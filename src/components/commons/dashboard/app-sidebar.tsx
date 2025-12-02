"use client";

import { NavDocuments } from "@/components/commons/dashboard/nav-documents";
import { NavInstructor } from "@/components/commons/dashboard/nav-instructor";
import { NavMain } from "@/components/commons/dashboard/nav-main";
import { NavUser } from "@/components/commons/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/redux/useAppDispatch";
import { UserRole } from "@/types/auth/user-role.enum";
import {
  IconArticle,
  IconBell,
  IconCalendar,
  IconCamera,
  IconCar,
  IconChartBar,
  IconDashboard,
  IconFile,
  IconFileAi,
  IconFileDescription,
  IconHistory,
  IconKey,
  IconNavigation,
  IconNews,
  IconPackage,
  IconSettings,
  IconUserCog,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
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
      title: "Quản lý gói dịch vụ",
      url: "/management-package",
      icon: IconPackage,
    },
    {
      title: "Quản lý tài liệu",
      url: "/management-document",
      icon: IconArticle,
    },
    {
      title: "Quản lý điều khoản dịch vụ",
      url: "/management-terms-and-services",
      icon: IconKey,
    },
    {
      title: "Quản lý cài đặt hệ thống",
      url: "/management-setting",
      icon: IconSettings,
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
  documents: [
    {
      name: "Quản lý người hướng dẫn",
      url: "/instructor-management",
      icon: IconUsersGroup,
    },
    {
      name: "Quản lý xe tập lái",
      url: "/car-instructor-management",
      icon: IconCar,
    },
    {
      name: "Quản lý tin tức và bài viết",
      url: "/blogs-management",
      icon: IconNews,
    },
  ],

  navInstructor: [
    {
      name: "Tổng quan",
      url: "/overview",
      icon: IconDashboard,
    },

    {
      name: "Lịch huấn luyện",
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
      url: "/notification-management",
      icon: IconBell,
    },
    {
      name: "Lịch sử giao dịch",
      url: "/transaction-management",
      icon: IconHistory,
    },
    {
      name: "Giấy tờ tùy thân",
      url: "/identification-document-management",
      icon: IconFile,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAppSelector((state) => state.auth);

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
        {role === UserRole.Admin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <NavMain items={data.navMain} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {role === UserRole.Inspector && (
          <SidebarGroup>
            <SidebarGroupContent>
              <NavDocuments items={data.documents} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {role === UserRole.Instructor && (
          <SidebarGroup>
            <SidebarGroupContent>
              <NavInstructor items={data.navInstructor} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
