"use client";

import Link from "next/link";
  import Image from "next/image";
const links = {
  Contact: ["Github", "Twitter", "Instagram"],
  Platforms: ["iOS", "Android", "Web"],
  Help: ["Contact Us", "FAQ", "Feedback"],
  Socials: ["Twitch", "Discord", "Dribbble"],
};

export default function Footer() {
  return (
    <footer id="footer" className="container mx-auto sm:px-6 lg:px-8 space-y-4 p-4 sm:p-5">
      <div className="bg-background/60 rounded-2xl border p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-full space-y-4 xl:col-span-2">
            <div className="flex flex-col  text-center">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-12 w-12 object-contain"
                />
                <h1 className="text-xl font-bold m-0 text-black">DriveMate</h1>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Meet our AI-powered SaaS solution to lighten your workload, increase efficiency and make more accurate decisions.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-2 sm:gap-3">
              <h3 className="mb-2 text-base sm:text-lg font-bold">{section}</h3>
              {items.map((item) => (
                <div key={item}>
                  <a
                    className="opacity-60 hover:opacity-100 transition-opacity text-sm sm:text-base"
                    href="#"
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © 2024 DriveMate. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
