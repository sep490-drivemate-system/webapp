"use client";

import Link from "next/link";
const links = {
  "Liên hệ": [
    "Hotline: 1900-xxxx",
    "Email: contact@drivemate.vn",
    "Địa chỉ: TP.HCM",
    "Giờ làm việc: 8:00 - 20:00",
  ],
  "Trợ giúp": [
    "Câu hỏi thường gặp",
    "Hướng dẫn đặt lịch",
    "Hướng dẫn thanh toán",
    "Liên hệ hỗ trợ",
  ],
  "Chính sách": [
    "Điều khoản và dịch vụ",
    "Chính sách bảo mật",
    "Chính sách hoàn tiền",
    "Quy định chung",
  ],
};

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-emerald-100">
      <div className="container mx-auto sm:px-6 lg:px-8 space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-full lg:col-span-1 space-y-4">
            <div className="flex flex-col">
              <Link href="/" className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-extrabold tracking-[0.2em] text-emerald-700">
                  DRIVEMATE
                </span>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng kết nối những người lái mới với người hướng dẫn lái xe
              chuyên nghiệp
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-2 sm:gap-3">
              <h3 className="mb-2 text-base sm:text-lg font-bold">{section}</h3>
              {items.map((item) => {
                // Check if item should be a link
                const isTermsLink = item === "Điều khoản và dịch vụ";
                
                if (isTermsLink) {
                  return (
                    <Link
                      key={item}
                      href="/terms-and-sersvices"
                      className="opacity-60 hover:opacity-100 text-sm block transition-opacity"
                    >
                      {item}
                    </Link>
                  );
                }
                
                return (
                  <div key={item}>
                    <span className="opacity-60 text-sm block">{item}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
