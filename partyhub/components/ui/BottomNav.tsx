"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Wine, Heart, CalendarOff } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/party-planner", icon: Users, label: "Party" },
  { href: "/solo-mode", icon: Wine, label: "Solo" },
  { href: "/hangover-recovery", icon: Heart, label: "Recovery" },
  { href: "/dry-day", icon: CalendarOff, label: "Dry Day" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-107.5 z-50">
      <div className="mx-3 mb-4 glass rounded-3xl px-2 py-3 bottom-nav">
        <nav className="flex justify-around items-center">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all"
              >
                <div
                  className={`p-2 rounded-2xl transition-all ${
                    active
                      ? "bg-linear-to-br from-orange-500 to-pink-500 shadow-glow"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-white/40"}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    active ? "text-orange-400" : "text-white/30"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}