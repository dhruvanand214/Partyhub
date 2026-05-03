"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import AIResultCard from "@/components/ui/AIResultCard";

const moods = [
  {
    label: "Energetic",
    hindi: "Josh mein hoon! ⚡",
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #FF6B35, #FF2D78)",
    glow: "rgba(255,107,53,0.4)",
    desc: "High-energy, party drinks",
  },
  {
    label: "Chill",
    hindi: "Aaram se hoon 😌",
    emoji: "😌",
    gradient: "linear-gradient(135deg, #2F80FF, #7B2FFF)",
    glow: "rgba(47,128,255,0.4)",
    desc: "Smooth & relaxing",
  },
  {
    label: "Adventurous",
    hindi: "Kuch naya try karein 🤩",
    emoji: "🤩",
    gradient: "linear-gradient(135deg, #F7B731, #00C48C)",
    glow: "rgba(247,183,49,0.4)",
    desc: "Exotic, new experiences",
  },
  {
    label: "Sophisticated",
    hindi: "Classy feel chahiye 🧐",
    emoji: "🧐",
    gradient: "linear-gradient(135deg, #7B2FFF, #0082B3)",
    glow: "rgba(123,47,255,0.4)",
    desc: "Premium & refined",
  },
];

const budgetOptions = [
  { label: "Budget 💰", sublabel: "₹200-₹500", value: "low" },
  { label: "Mid-Range 🎯", sublabel: "₹500-₹1500", value: "medium" },
  { label: "Premium ✨", sublabel: "₹1500-₹5000", value: "premium" },
];

const prefOptions = [
  "Local Brands 🇮🇳", "Imported 🌍", "Strong 💪",
  "Light & Easy 🌊", "Sweet & Fruity 🍓", "Dry & Bitter 🫒",
  "On the Rocks 🧊", "Cocktail Style 🍸",
];

export default function SoloModePage() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function togglePref(p: string) {
    setPrefs((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }

  async function getRecommendations() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "solo-mode",
          payload: { mood, budget, preferences: prefs, region: "India" },
        }),
      });

      const data = await res.json();
      setResult(data.result || "Something went wrong");
      setStep(4);
    } catch {
      setResult("Failed to connect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-32 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 20% 0%, #3D1060 0%, #0D0A1A 55%)" }}
    >
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(#7B2FFF, transparent)" }}
      />

      <div className="relative z-10 px-5 pt-14">
        <PageHeader
          title="Solo Mode 🥃"
          subtitle={`Step ${Math.min(step, 3)} of 3`}
        />

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{
                background: step >= s
                  ? "linear-gradient(90deg, #7B2FFF, #2F80FF)"
                  : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Mood */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-2xl font-black mb-2">Aaj ka mood? 🤔</h2>
              <p className="text-white/50 text-sm mb-6">
                How are you feeling tonight?
              </p>

              <div className="grid grid-cols-2 gap-4">
                {moods.map((m) => (
                  <motion.button
                    key={m.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMood(m.label); setStep(2); }}
                    className="rounded-3xl p-5 text-left relative overflow-hidden"
                    style={{
                      background: m.gradient,
                      boxShadow: mood === m.label ? `0 0 30px ${m.glow}` : `0 8px 24px ${m.glow}`,
                      border: mood === m.label ? "2px solid white" : "2px solid transparent",
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)" }}
                    />
                    <div className="text-4xl mb-3">{m.emoji}</div>
                    <h3 className="text-lg font-black">{m.label}</h3>
                    <p className="text-xs text-white/70 mt-1">{m.hindi}</p>
                    <p className="text-[10px] text-white/50 mt-1">{m.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-2xl font-black mb-2">Kitna kharcha? 💸</h2>
              <p className="text-white/50 text-sm mb-6">
                What's your budget for tonight?
              </p>

              <div className="space-y-4">
                {budgetOptions.map((b) => (
                  <motion.button
                    key={b.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setBudget(b.value); setStep(3); }}
                    className="w-full glass rounded-3xl p-5 flex items-center justify-between transition-all"
                    style={
                      budget === b.value
                        ? { border: "2px solid rgba(255,107,53,0.6)", background: "rgba(255,107,53,0.1)" }
                        : {}
                    }
                  >
                    <div className="text-left">
                      <p className="font-bold text-lg">{b.label}</p>
                      <p className="text-white/50 text-sm">{b.sublabel}</p>
                    </div>
                    <div className="text-3xl">
                      {b.value === "low" ? "🍺" : b.value === "medium" ? "🥃" : "🍾"}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-2xl font-black mb-2">Preferences 🎯</h2>
              <p className="text-white/50 text-sm mb-6">
                Select all that apply
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {prefOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePref(p)}
                    className={`chip rounded-2xl px-4 py-2.5 text-sm font-semibold ${
                      prefs.includes(p) ? "text-white" : "glass text-white/60"
                    }`}
                    style={
                      prefs.includes(p)
                        ? { background: "linear-gradient(135deg, #7B2FFF, #2F80FF)" }
                        : {}
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={getRecommendations}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      🔮
                    </motion.span>
                    Getting AI picks...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Get My Drink Picks
                  </span>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === 4 && result && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass rounded-3xl p-4 mb-4">
                <div className="flex gap-3 text-sm">
                  <span className="glass-strong rounded-xl px-3 py-1.5 text-white/70">
                    😌 {mood}
                  </span>
                  <span className="glass-strong rounded-xl px-3 py-1.5 text-white/70">
                    💰 {budget}
                  </span>
                </div>
              </div>

              <AIResultCard result={result} />

              <button
                onClick={() => { setStep(1); setMood(""); setBudget(""); setPrefs([]); setResult(""); }}
                className="btn-secondary mt-4"
              >
                Start Over 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </main>
  );
}