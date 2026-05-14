"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import BottomCTA from "@/components/custom/BottomCTA";
import BottomNav from "@/components/ui/BottomNav";

const modes = [
  {
    id: "party" as const,
    icon: "🥂",
    title: "Party Planner",
    subtitle: "Plan for a group",
    desc: "AI calculates exact quantities of drinks, food & budget for your whole crew. Perfect for house parties, get-togethers & celebrations.",
    tags: ["Group friendly", "Budget split", "AI-powered"],
    href: "/party-planner",
    accent: "#C68A2B",
    bgGlow: "rgba(198,138,43,0.12)",
  },
  {
    id: "solo" as const,
    icon: "🥃",
    title: "Solo Mode",
    subtitle: "Just for me",
    desc: "Get personalised drink recommendations based on your mood, occasion & budget. Your night, your vibe.",
    tags: ["Mood-based", "Personalised", "Playlist vibes"],
    href: "/solo-mode",
    accent: "#7A1840",
    bgGlow: "rgba(90,15,46,0.2)",
  },
  {
    id: "recovery" as const,
    icon: "💊",
    title: "Hangover Recovery",
    subtitle: "Feel better, faster",
    desc: "Personalised recovery plan with hydration tips, Indian home remedies, food & supplements to get you back on your feet.",
    tags: ["Indian remedies", "Step-by-step", "Science-backed"],
    href: "/hangover-recovery",
    accent: "#52525B",
    bgGlow: "rgba(82,82,91,0.15)",
  },
];

export default function ModePage() {
  const router = useRouter();
  const { setMode } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    const mode = modes.find((m) => m.id === selected);
    if (!mode) return;
    setMode(mode.id);
    router.push(mode.href);
  }

  return (
    <main
      className="min-h-screen flex flex-col pb-48"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1A0A04 0%, #0B0B0C 60%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(198,138,43,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 px-5 pt-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ChevronLeft size={18} className="text-white/80" />
            </motion.button>
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Choose Your Mode
              </h1>
              <p className="text-xs text-[#A1A1AA] mt-0.5">What's the plan for tonight?</p>
            </div>
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border border-white/10"
              }
            }}
          />
        </div>

        {/* Mode cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {modes.map((mode, i) => {
              const isSelected = selected === mode.id;

              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(mode.id)}
                  className="w-full rounded-2xl p-5 text-left relative overflow-hidden"
                  style={{
                    background: isSelected ? mode.bgGlow : "rgba(255,255,255,0.04)",
                    border: isSelected
                      ? `1.5px solid ${mode.accent}66`
                      : "1.5px solid rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 32px ${mode.bgGlow}` : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-black"
                      style={{
                        background: `linear-gradient(135deg, ${mode.accent}, #E5A94A)`,
                      }}
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${mode.accent}22`,
                        border: `1px solid ${mode.accent}44`,
                      }}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-white">{mode.title}</h2>
                      <p className="text-xs text-[#A1A1AA]">{mode.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#A1A1AA] leading-relaxed mb-3">
                    {mode.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {mode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: isSelected ? `${mode.accent}22` : "rgba(255,255,255,0.06)",
                          color: isSelected ? mode.accent : "#A1A1AA",
                          border: isSelected
                            ? `1px solid ${mode.accent}44`
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* AI-powered tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#C68A2B" }}
          />
          <p className="text-xs text-[#52525B]">
            AI-powered recovery plan just for you ✨
          </p>
        </motion.div>
      </div>

      <BottomCTA
        label="Continue"
        onClick={handleContinue}
        disabled={!selected}
        className="bottom-24"
      />
      <BottomNav />
    </main>
  );
}
