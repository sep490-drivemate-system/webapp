"use client";

import Link from "next/link";

const links = {
  Contact: ["Github", "Twitter", "Instagram"],
  Platforms: ["iOS", "Android", "Web"],
  Help: ["Contact Us", "FAQ", "Feedback"],
  Socials: ["Twitch", "Discord", "Dribbble"],
};

export default function Footer() {
  return (
    <footer id="footer" className="container space-y-4 p-5">
      <div className="bg-muted rounded-2xl border p-10">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4 xl:grid-cols-6">
          {/* Brand */}
          <div className="col-span-full space-y-4 xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <span className="flex items-center justify-center size-7 lg:size-8 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary">
                {/* Sun icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun-dim size-5 lg:size-6 text-white"><circle cx="12" cy="12" r="4"></circle><path d="M12 4h.01"></path><path d="M20 12h.01"></path><path d="M12 20h.01"></path><path d="M4 12h.01"></path><path d="M17.657 6.343h.01"></path><path d="M17.657 17.657h.01"></path><path d="M6.343 17.657h.01"></path><path d="M6.343 6.343h.01"></path></svg>
              </span>
              <h5 className="text-lg lg:text-xl">Cosmic</h5>
            </Link>
            <p className="text-muted-foreground">
              Meet our AI-powered SaaS solution to lighten your workload, increase efficiency and make more accurate decisions.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-2">
              <h3 className="mb-2 text-lg font-bold">{section}</h3>
              {items.map((item) => (
                <div key={item}>
                  <a className="opacity-60 hover:opacity-100" href="#">{item}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
