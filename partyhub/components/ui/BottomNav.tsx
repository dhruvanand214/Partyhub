"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Star, Activity, Info } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/mode", icon: Home, label: "Hub" },
  { href: "/solo-mode", icon: User, label: "Solo" },
  { href: "/party-planner", icon: Star, label: "Party", isCenter: true },
  { href: "/hangover-recovery", icon: Activity, label: "Recovery" },
  { href: "/", icon: Info, label: "About" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        background: "rgba(11,11,12,0.92)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-end justify-around px-2 pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #C68A2B, #E5A94A)",
                    boxShadow: "0 0 24px rgba(198,138,43,0.5), 0 -4px 0 #0B0B0C",
                    border: "3px solid #0B0B0C",
                  }}
                >
                  <item.icon size={22} className="text-black" strokeWidth={2.5} />
                </motion.div>
                <span className="text-[10px] font-medium mt-1 text-[#C68A2B]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 px-3"
            >
              <motion.div whileTap={{ scale: 0.85 }}>
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? "#C68A2B" : "#52525B" }}
                />
              </motion.div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#C68A2B" : "#52525B" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}