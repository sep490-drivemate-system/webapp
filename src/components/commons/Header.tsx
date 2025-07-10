"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Menu, X } from "lucide-react";
import logo from "@/../public/bg-auth.jpg";
import ProfilePicture from "@/../public/bg-auth.jpg";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const isAuthenticated = !!token;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
    }
    setShowProfileMenu(false);
    router.push("/auth");
  };

  const mainMenuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Service" },
    { path: "/suppliers", label: "Center" },
    { path: "/mentors", label: "Mentor" },
    { path: "/blogs", label: "Blog" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">EvenTop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {mainMenuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-white px-4 py-2 rounded-md hover:bg-white/10 ${
                  isActive(item.path) ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowAuthOptions((prev) => !prev)}
                  className="flex items-center text-white hover:text-gray-300"
                >
                  <User className="h-6 w-6" />
                  <span>Tài khoản</span>
                </button>
                {showAuthOptions && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      href="/auth?type=login"
                      className="block px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/auth?type=register"
                      className="block px-2 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="focus:outline-none"
                  >
                    <Image
                      src={ProfilePicture}
                      alt="Profile"
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  </button>
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Thông tin cá nhân
                      </Link>
                      <Link
                        href="/history"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Lịch sử
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainMenuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "text-white bg-gray-900"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth?type=login"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth?type=register"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/planning"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Lịch trình
                </Link>
                <Link
                  href="/cart"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Giỏ hàng
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
