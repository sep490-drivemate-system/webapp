"use client";

import Link from "next/link";
import Image from "next/image";
const links = {
  "Liên hệ": [
    "Hotline: 1900-xxxx",
    "Email: contact@drivemate.vn",
    "Địa chỉ: TP.HCM",
    "Giờ làm việc: 8:00 - 20:00"
  ],
  "Trợ giúp": [
    "Câu hỏi thường gặp",
    "Hướng dẫn đặt lịch",
    "Hướng dẫn thanh toán",
    "Liên hệ hỗ trợ"
  ],
  "Chính sách": [
    "Chính sách bảo mật",
    "Điều khoản sử dụng",
    "Chính sách hoàn tiền",
    "Quy định chung"
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      className="container mx-auto sm:px-6 lg:px-8 space-y-4 p-4 sm:p-5"
    >
      <div className="bg-background/60 rounded-2xl border p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-full lg:col-span-1 space-y-4">
            <div className="flex flex-col">
              <Link href="/" className="flex items-center gap-3 mb-3">
                <Image
                  src="/logo.png"
                  alt="DriveMate Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-12 w-12 object-contain"
                />               
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng kết nối những người lái mới với người hướng dẫn lái xe chuyên nghiệp
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-2 sm:gap-3">
              <h3 className="mb-2 text-base sm:text-lg font-bold">{section}</h3>
              {items.map((item) => (
                <div key={item}>
                  <span className="opacity-60 text-sm block">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom section with copyright */}
        {/* <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © 2024 DriveMate. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
