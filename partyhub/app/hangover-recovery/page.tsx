"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import AIResultCard from "@/components/ui/AIResultCard";

const severities = [
  {
    label: "Mild",
    hindi: "Thoda sa sar dard 😐",
    emoji: "😐",
    color: "#00C48C",
    desc: "Slight discomfort, mostly okay",
  },
  {
    label: "Moderate",
    hindi: "Zyaada pi gaye bhai 😵",
    emoji: "😵",
    color: "#F7B731",
    desc: "Headache, nausea, tired",
  },
  {
    label: "Severe",
    hindi: "Bohot bura haal hai 🤮",
    emoji: "🤮",
    color: "#FF2D78",
    desc: "Intense symptoms, need help",
  },
];

const symptoms = [
  { label: "Headache", emoji: "🤕", value: "Headache" },
  { label: "Nausea", emoji: "🤢", value: "Nausea" },
  { label: "Fatigue", emoji: "😴", value: "Fatigue" },
  { label: "Dehydration", emoji: "💧", value: "Dehydration" },
  { label: "Light Sensitivity", emoji: "😎", value: "Light Sensitivity" },
  { label: "Dizziness", emoji: "🌀", value: "Dizziness" },
  { label: "Acidity", emoji: "🔥", value: "Acidity" },
  { label: "Vomiting", emoji: "🤮", value: "Vomiting" },
];

export default function HangoverRecoveryPage() {
  const [severity, setSeverity] = useState("Moderate");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function getTips() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "hangover-recovery",
          payload: {
            severity,
            symptoms: selectedSymptoms,
            region: "India",
          },
        }),
      });

      const data = await res.json();
      setResult(data.result || "Something went wrong");
    } catch {
      setResult("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-32 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 30% 0%, #0A2E2A 0%, #0D0A1A 60%)" }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(#00C48C, transparent)" }}
      />

      <div className="relative z-10 px-5 pt-14">
        <PageHeader
          title="Recovery Mode 💚"
          subtitle="Kal ki party, aaj ka dard"
        />

        {/* Severity selector */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            How bad is it? 🤔
          </p>

          <div className="space-y-3">
            {severities.map((s) => (
              <motion.button
                key={s.label}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSeverity(s.label)}
                className="w-full rounded-3xl p-4 flex items-center gap-4 transition-all"
                style={{
                  background:
                    severity === s.label
                      ? `rgba(${s.color === "#00C48C" ? "0,196,140" : s.color === "#F7B731" ? "247,183,49" : "255,45,120"},0.15)`
                      : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${
                    severity === s.label
                      ? s.color
                      : "rgba(255,255,255,0.08)"
                  }`,
                }}
              >
                <div className="text-4xl">{s.emoji}</div>

                <div className="flex-1 text-left">
                  <p className="font-bold text-base">{s.label}</p>
                  <p className="text-xs text-white/50">{s.hindi}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{s.desc}</p>
                </div>

                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: severity === s.label ? s.color : "rgba(255,255,255,0.2)",
                    background: severity === s.label ? s.color : "transparent",
                  }}
                >
                  {severity === s.label && (
                    <span className="text-white text-[10px] font-black">✓</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            Symptoms / Takleef
          </p>

          <div className="grid grid-cols-2 gap-3">
            {symptoms.map((s) => (
              <motion.button
                key={s.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSymptom(s.value)}
                className="glass rounded-3xl p-4 flex items-center gap-3 transition-all"
                style={
                  selectedSymptoms.includes(s.value)
                    ? {
                        background: "rgba(0,196,140,0.12)",
                        border: "1.5px solid rgba(0,196,140,0.4)",
                      }
                    : {}
                }
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className={`text-sm font-semibold ${
                  selectedSymptoms.includes(s.value) ? "text-emerald-300" : "text-white/70"
                }`}>
                  {s.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="glass rounded-3xl p-4 mb-6 flex gap-3">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-5">
            These are general wellness tips, not medical advice. If you have chest pain,
            confusion, or difficulty breathing — call{" "}
            <span className="text-yellow-400 font-bold">112</span> immediately.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={getTips}
          disabled={loading}
          className="mb-6 disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #00C48C, #0082B3)",
            borderRadius: 18,
            height: 58,
            width: "100%",
            fontWeight: 800,
            fontSize: 17,
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,196,140,0.3)",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                💊
              </motion.span>
              Preparing your recovery plan...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Get Relief Tips
            </span>
          )}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AIResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </main>
  );
}