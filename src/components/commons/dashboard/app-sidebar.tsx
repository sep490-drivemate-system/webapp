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
  IconHotelService,
  IconInnerShadowTop,
  IconKey,
  IconListDetails,
  IconNavigation,
  IconNews,
  IconReport,
  IconRulerMeasure,
  IconRulerOff,
  IconSearch,
  IconServicemark,
  IconSettings,
  IconShieldLock,
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
import { NavUser } from "@/components/commons/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

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
      title: "Vai trò & Quyền",
      url: "/management-role",
      icon: IconUsers,
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
      title: "Quản lý xe tập lái",
      url: "/management-car",
      icon: IconCar,
    },
    {
      title: "Quản lý điều khoản dịch vụ",
      url: "/dashboard/documents/word-assistant",
      icon: IconKey,
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
      name: "Giấy tờ tùy thân",
      url: "/identification-document-management",
      icon: IconFile,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <SidebarGroup>
          <SidebarGroupContent>
            <NavMain items={data.navMain} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NavDocuments items={data.documents} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NavInstructor items={data.navInstructor} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
