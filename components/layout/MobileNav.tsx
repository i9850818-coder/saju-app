"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-violet-200 mobile-nav-safe">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 min-h-[56px] transition-colors ${
                active ? "text-violet-600" : "text-violet-400 active:text-violet-600"
              }`}
            >
              <span className={`text-xl transition-transform ${active ? "scale-110" : ""}`}>
                {item.emoji}
              </span>
              <span className="text-[10px] font-medium leading-tight">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
