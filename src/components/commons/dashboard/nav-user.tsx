"use client";

import { useEffect, useState } from "react";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch } from "@/lib/redux/useAppDispatch";
import { getUserById } from "@/features/user/userThunk";
import { getUserInfo } from "@/lib/jwt/jwt.utils";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export function NavUser({
  user,
}: {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { handleSignOut } = useAuth();
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      const jwtUser = getUserInfo();
      if (!jwtUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await dispatch(
          getUserById({ id: jwtUser.id })
        ).unwrap();

        if (cancelled) return;

        const fetchedUser = response.value;
        if (fetchedUser) {
          setUserData({
            name: fetchedUser.fullName || "",
            email: fetchedUser.email || "",
            avatar: fetchedUser.avatarUrl || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch user info", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const displayUser = userData ||
    user || {
      name: "",
      email: "",
      avatar: "",
    };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full grayscale">
                <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                <AvatarFallback className="rounded-full">
                  {displayUser.name
                    ? displayUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "CN"
                    : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {displayUser.name || (isLoading ? "Đang tải..." : "")}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayUser.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"></div>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
