"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const MAIN_MENU = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/mentor", label: "Mentor" },
  { path: "/blog", label: "Blog" },
  { path: "/news", label: "News" },
];

function Logo() {
  return (
    <Link href="/" className="flex font-bold items-center">
      <span className="flex items-center justify-center size-6 sm:size-7 lg:size-8 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun-dim size-4 sm:size-5 lg:size-6 text-white"><circle cx="12" cy="12" r="4"></circle><path d="M12 4h.01"></path><path d="M20 12h.01"></path><path d="M12 20h.01"></path><path d="M4 12h.01"></path><path d="M17.657 6.343h.01"></path><path d="M17.657 17.657h.01"></path><path d="M6.343 17.657h.01"></path><path d="M6.343 6.343h.01"></path></svg>
      </span>
      <h5 className="text-base sm:text-lg lg:text-xl">DriveMate</h5>
    </Link>
  );
}

function NavMenu({ menu, activePath }: { menu: { path: string; label: string }[]; activePath: string }) {
  return (
    <nav aria-label="Main" className="group/navigation-menu relative max-w-max flex-1 items-center justify-center mx-auto hidden lg:block">
      <div style={{ position: "relative" }}>
        <ul className="group flex flex-1 list-none items-center justify-center gap-1 space-x-0" dir="ltr">
          {menu.map((item) => (
            <li key={item.path} className="relative">
              <Link
                href={item.path}
                className={`group inline-flex h-9 w-max items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${activePath === item.path
                  ? "bg-[#00598a] text-white dark:bg-[#004b6a]"
                  : "hover:bg-[#006fa8] hover:text-white dark:hover:bg-[#005a7a]"
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

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-8 sm:size-9">
      <div className="flex items-center gap-2 dark:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon size-4 sm:size-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
        <span className="block lg:hidden text-xs sm:text-sm">Dark</span>
      </div>
      <div className="dark:flex items-center gap-2 hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun size-4 sm:size-5"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        <span className="block lg:hidden text-xs sm:text-sm">Light</span>
      </div>
      <span className="sr-only">Change theme</span>
    </button>
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
    <div className="relative" ref={ref}>
      <button
        className="h-8 sm:h-10 rounded-md flex items-center justify-center"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
          <Link
            href="/signin"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ menu, activePath, open, onClose }: { menu: { path: string; label: string }[]; activePath: string; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block w-full max-w-sm px-6 py-3 rounded-md text-lg font-medium text-center transition-colors ${activePath === item.path ? "bg-accent text-accent-foreground" : "text-white hover:bg-accent hover:text-accent-foreground"}`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          <Link href="/signin" className="block px-6 py-3 rounded-md text-lg font-medium text-white hover:bg-accent hover:text-accent-foreground text-center transition-colors" onClick={onClose}>Sign in</Link>
          <Link href="/signup" className="block px-6 py-3 rounded-md text-lg font-medium text-white hover:bg-accent hover:text-accent-foreground text-center transition-colors" onClick={onClose}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed z-40 p-3 sm:p-4 lg:p-5 w-full">
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="bg-background/40 flex items-center justify-between rounded-2xl border p-2 sm:p-3 backdrop-blur-sm shadow-sm">
          <Logo />
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu cursor-pointer size-5 sm:size-6" type="button"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
            </button>
          </div>
          <NavMenu menu={MAIN_MENU} activePath={pathname} />
          <div className="hidden items-center lg:flex gap-2">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <UserDropdown />
          </div>
        </div>
      </div>
      <MobileMenu menu={MAIN_MENU} activePath={pathname} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
