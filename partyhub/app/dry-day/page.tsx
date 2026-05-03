"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarOff, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import PageHeader from "@/components/ui/PageHeader";

const indianStates = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal",
];

// Known dry states in India
const DRY_STATES = ["Gujarat", "Bihar", "Nagaland", "Mizoram", "Manipur"];

interface DryDayResult {
  isDryDay: boolean;
  reason: string;
  confidence: string;
  note: string;
  state: string;
  date: string;
}

export default function DryDayPage() {
  const [state, setState] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DryDayResult | null>(null);
  const [rawResult, setRawResult] = useState("");

  const isDryState = DRY_STATES.includes(state);

  async function checkDryDay() {
    setLoading(true);
    setResult(null);
    setRawResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "dry-day",
          payload: { state, date },
        }),
      });

      const data = await res.json();
      const raw = data.result || "";
      setRawResult(raw);

      // Try to parse JSON
      try {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        const parsed = JSON.parse(match ? match[1] : raw);
        setResult(parsed);
      } catch {
        setResult(null);
      }
    } catch {
      setRawResult("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-32 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 70% 0%, #2A1A0A 0%, #0D0A1A 55%)" }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(#F7B731, transparent)" }}
      />

      <div className="relative z-10 px-5 pt-14">
        <PageHeader
          title="Dry Day Checker 📅"
          subtitle="Sharab milegi ya nahi?"
        />

        {/* Dry state warning */}
        {isDryState && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 mb-6 flex gap-3"
            style={{
              background: "rgba(255,45,120,0.12)",
              border: "1.5px solid rgba(255,45,120,0.3)",
            }}
          >
            <span className="text-2xl">🚫</span>
            <div>
              <p className="font-bold text-pink-300">{state} is a Dry State</p>
              <p className="text-xs text-white/50 mt-1">
                Alcohol is permanently prohibited. Please verify with local authorities.
              </p>
            </div>
          </motion.div>
        )}

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <span className="text-lg">🗺️</span>
              </div>
              <div>
                <p className="font-bold text-sm">State / Rajya</p>
                <p className="text-xs text-white/40">Select your state</p>
              </div>
            </div>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              {indianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="glass rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <CalendarOff size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="font-bold text-sm">Date / Tarikh</p>
                <p className="text-xs text-white/40">Check for this date</p>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-glass"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <button
          onClick={checkDryDay}
          disabled={!state || !date || loading}
          className="mb-6 disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #F7B731, #FC5C7D)",
            borderRadius: 18,
            height: 58,
            width: "100%",
            fontWeight: 800,
            fontSize: 17,
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(247,183,49,0.3)",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🔍
              </motion.span>
              Checking...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Check Dry Day
            </span>
          )}
        </button>

        {/* Result card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl p-6"
              style={{
                background: result.isDryDay
                  ? "linear-gradient(135deg, rgba(255,45,120,0.15), rgba(255,107,53,0.1))"
                  : "linear-gradient(135deg, rgba(0,196,140,0.15), rgba(0,130,179,0.1))",
                border: `1.5px solid ${result.isDryDay ? "rgba(255,45,120,0.3)" : "rgba(0,196,140,0.3)"}`,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {result.isDryDay ? (
                  <XCircle size={40} className="text-pink-400 shrink-0" />
                ) : (
                  <CheckCircle2 size={40} className="text-emerald-400 shrink-0" />
                )}
                <div>
                  <p className="text-2xl font-black">
                    {result.isDryDay ? "🚫 Dry Day!" : "✅ Open Day!"}
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">
                    {result.state} · {result.date}
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-3">
                {result.reason}
              </p>

              {result.note && (
                <div className="rounded-2xl p-3 mt-3"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <p className="text-xs text-white/50">
                    ⚠️ {result.note}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <div
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: result.confidence === "high"
                      ? "rgba(0,196,140,0.2)"
                      : result.confidence === "medium"
                        ? "rgba(247,183,49,0.2)"
                        : "rgba(255,45,120,0.2)",
                    color: result.confidence === "high" ? "#00C48C" : result.confidence === "medium" ? "#F7B731" : "#FF2D78",
                  }}
                >
                  {result.confidence?.toUpperCase()} CONFIDENCE
                </div>
                <p className="text-xs text-white/30">
                  Always verify with local excise dept.
                </p>
              </div>
            </motion.div>
          )}

          {!result && rawResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-5"
            >
              <p className="text-sm text-white/70 leading-relaxed">{rawResult}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info note */}
        <div className="glass rounded-3xl p-4 mt-6">
          <p className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider">
            🇮🇳 Common National Dry Days in India
          </p>
          {[
            "🗳️ Election days (as notified by EC)",
            "🇮🇳 Republic Day — 26 January",
            "🇮🇳 Independence Day — 15 August",
            "✊ Gandhi Jayanti — 2 October",
            "📅 State-specific declared holidays",
          ].map((item) => (
            <p key={item} className="text-xs text-white/50 py-1.5 border-b border-white/5 last:border-0">
              {item}
            </p>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}