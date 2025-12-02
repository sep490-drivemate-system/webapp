"use client";

import {
  CalendarClock,
  CircleUser,
  LogIn,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAIN_MENU = [
  { path: "/", label: "Trang chủ" },
  { path: "/packages", label: "Gói dịch vụ" },
  { path: "/instructors", label: "Người hướng dẫn" },
  { path: "/cars", label: "Xe tập" },
  { path: "/blogs", label: "Bài viết" },
  { path: "/terms-and-sersvices", label: "Điều khoản và dịch vụ" },
  { path: "/", label: "Về chúng tôi" },
];

function Logo({ sizeClass = "h-16 w-16" }: { sizeClass?: string }) {
  return (
    <Link href="/" className={`flex items-center shrink-0`}>
      <div className={`relative left-10 ${sizeClass}`}>
        <Image
          src="/logo.png"
          alt="DriveMate Logo"
          objectFit="cover"
          width={200}
          height={200}
          priority
          className="scale-200"
        />
      </div>
    </Link>
  );
}

function NavMenu({
  menu,
  activePath,
}: {
  menu: { path: string; label: string }[];
  activePath: string;
}) {
  return (
    <nav
      aria-label="Main"
      className="group/navigation-menu relative max-w-max flex-1 items-center justify-center mx-auto hidden lg:block"
    >
      <div style={{ position: "relative" }}>
        <ul
          className="group flex flex-1 list-none items-center justify-center gap-1 space-x-0"
          dir="ltr"
        >
          {menu.map((item) => (
            <li key={item.path} className="relative">
              <Link
                href={item.path}
                className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                  activePath === item.path
                    ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg hover:shadow-xl hover:from-[#059669] hover:to-[#047857] active:scale-95"
                    : "hover:bg-gradient-to-r hover:from-[#10b981] hover:to-[#059669] hover:text-white hover:shadow-lg active:scale-95"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative right-5" ref={ref}>
      <button
        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-150 ${
          open
            ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg hover:shadow-xl hover:from-[#059669] hover:to-[#047857] active:scale-95"
            : "hover:bg-gradient-to-r hover:from-[#10b981] hover:to-[#059669] hover:text-white hover:shadow-lg active:scale-95"
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <CircleUser className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-50" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <UserRound className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-left">Hồ sơ cá nhân</span>
          </Link>
          <Link
            href="/bookings"
            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <CalendarClock className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-left">Lịch sử đặt</span>
          </Link>
          <div className="border-t my-1"></div>
          <Link
            href="/signin"
            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <LogIn className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-left">Đăng nhập</span>
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <UserRoundPlus className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-left">Đăng ký</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  menu,
  activePath,
  open,
  onClose,
}: {
  menu: { path: string; label: string }[];
  activePath: string;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block w-full max-w-sm px-6 py-3 rounded-md text-lg font-medium text-center transition-colors ${
              activePath === item.path
                ? "bg-accent text-accent-foreground"
                : "text-white hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          <Link
            href="/signin"
            className="block px-6 py-3 rounded-md text-lg font-medium text-white hover:bg-accent hover:text-accent-foreground text-center transition-colors"
            onClick={onClose}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="block px-6 py-3 rounded-md text-lg font-medium text-white hover:bg-accent hover:text-accent-foreground text-center transition-colors"
            onClick={onClose}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed z-40 p-3 sm:p-4 lg:p-5 w-full">
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="bg-background/40 flex items-center justify-between rounded-2xl border p-2 sm:p-3 backdrop-blur-sm shadow-sm">
          <Logo />
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu cursor-pointer size-5 sm:size-6"
                type="button"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <NavMenu menu={MAIN_MENU} activePath={pathname} />
          <div className="hidden items-center lg:flex gap-2">
            <UserDropdown />
          </div>
        </div>
      </div>
      <MobileMenu
        menu={MAIN_MENU}
        activePath={pathname}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
