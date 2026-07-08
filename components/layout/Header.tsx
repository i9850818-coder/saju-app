"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-violet-900/40">
      <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          onClick={() => setOpen(false)}
        >
          <span className="text-2xl">🔮</span>
          <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-violet-600 text-white"
                  : "text-violet-300 hover:text-white hover:bg-violet-900/50"
              }`}
            >
              {item.emoji} {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-violet-300 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-card border-t border-violet-900/40">
          <nav className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${
                  pathname === item.href
                    ? "text-violet-300 bg-violet-900/30"
                    : "text-violet-200 hover:text-white hover:bg-violet-900/20"
                }`}
              >
                <span className="text-2xl w-8 text-center">{item.emoji}</span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-violet-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
