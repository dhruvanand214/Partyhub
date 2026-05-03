"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Wine, HeartPulse, CalendarOff, Zap, TrendingUp } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";

const modes = [
  {
    title: "Party Planner",
    subtitle: "Plan the perfect desi party 🎉",
    href: "/party-planner",
    icon: Users,
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF2D78 100%)",
    glow: "rgba(255,107,53,0.35)",
    tag: "Most Popular",
    emoji: "🥂",
  },
  {
    title: "Solo Mode",
    subtitle: "What's your vibe tonight?",
    href: "/solo-mode",
    icon: Wine,
    gradient: "linear-gradient(135deg, #7B2FFF 0%, #2F80FF 100%)",
    glow: "rgba(123,47,255,0.35)",
    tag: "Chill",
    emoji: "🥃",
  },
  {
    title: "Hangover Recovery",
    subtitle: "Kal ki party, aaj ka dard 😅",
    href: "/hangover-recovery",
    icon: HeartPulse,
    gradient: "linear-gradient(135deg, #00C48C 0%, #0082B3 100%)",
    glow: "rgba(0,196,140,0.35)",
    tag: "Wellness",
    emoji: "💊",
  },
  {
    title: "Dry Day Checker",
    subtitle: "Sharab milegi ya nahi? Check now",
    href: "/dry-day",
    icon: CalendarOff,
    gradient: "linear-gradient(135deg, #F7B731 0%, #FC5C7D 100%)",
    glow: "rgba(247,183,49,0.35)",
    tag: "India Only",
    emoji: "📅",
  },
];

const stats = [
  { icon: Zap, label: "Parties Planned", value: "2.1L+", color: "text-orange-400" },
  { icon: TrendingUp, label: "Happy Hosts", value: "50K+", color: "text-purple-400" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen pb-32 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #2D1060 0%, #0D0A1A 50%)",
      }}
    >
      {/* BG orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(#FF6B35, transparent)" }}
      />

      <div className="relative z-10 px-5 pt-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-white/50 text-sm font-medium">Namaste! 🙏</p>
            <h1 className="text-3xl font-black mt-0.5">
              <span className="gradient-text">Cheers India</span> 🍸
            </h1>
          </div>

          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-2xl">
            👤
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-7"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass rounded-3xl p-4">
                <Icon size={18} className={s.color} />
                <p className={`text-2xl font-black mt-2 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Mode cards */}
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
          What are you planning?
        </p>

        <div className="space-y-4">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <Link href={mode.href}>
                  <div
                    className="mode-card rounded-3xl p-5 relative overflow-hidden"
                    style={{
                      background: mode.gradient,
                      boxShadow: `0 12px 40px ${mode.glow}`,
                    }}
                  >
                    {/* Shine overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
                      }}
                    />

                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        {/* Tag */}
                        <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-bold mb-3">
                          {mode.tag}
                        </span>

                        <h2 className="text-2xl font-black leading-tight">{mode.title}</h2>
                        <p className="mt-1 text-sm text-white/80">{mode.subtitle}</p>
                      </div>

                      <div className="ml-4 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon size={26} />
                        </div>
                        <span className="text-3xl">{mode.emoji}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 glass rounded-3xl p-4 text-center"
        >
          <p className="text-xs text-white/40 leading-5">
            🇮🇳 Made for India · 🔞 21+ only · 🚗 Never drink & drive
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </main>
  );
}