"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, IndianRupee, ChefHat, Sparkles, MapPin } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import PageHeader from "@/components/ui/PageHeader";
import AIResultCard from "@/components/ui/AIResultCard";

const drinkOptions = [
  { label: "Whisky 🥃", value: "Whisky" },
  { label: "Beer 🍺", value: "Beer" },
  { label: "Rum 🍹", value: "Rum" },
  { label: "Wine 🍷", value: "Wine" },
  { label: "Vodka 🫧", value: "Vodka" },
  { label: "Desi Daru 🌾", value: "Desi Daru" },
  { label: "Cocktails 🍸", value: "Cocktails" },
  { label: "Mocktails 🥤", value: "Mocktails" },
];

const foodOptions = [
  { label: "Chakna/Snacks 🍿", value: "Chakna" },
  { label: "Biryani 🍛", value: "Biryani" },
  { label: "Starters 🍢", value: "Starters" },
  { label: "Full Thali 🍱", value: "Full Thali" },
  { label: "Tandoori 🔥", value: "Tandoori" },
  { label: "Pizza/Fusion 🍕", value: "Pizza/Fusion" },
];

const indianStates = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal",
];

const budgetPresets = [
  { label: "₹1,000", value: 1000 },
  { label: "₹3,000", value: 3000 },
  { label: "₹5,000", value: 5000 },
  { label: "₹10,000", value: 10000 },
];

export default function PartyPlannerPage() {
  const [guests, setGuests] = useState(10);
  const [budget, setBudget] = useState(3000);
  const [drinkPrefs, setDrinkPrefs] = useState<string[]>([]);
  const [foodPrefs, setFoodPrefs] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function toggle(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function generatePlan() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "party-planner",
          payload: { guests, budget, drinkPreferences: drinkPrefs, foodPreferences: foodPrefs, state },
        }),
      });

      const data = await res.json();
      setResult(data.result || data.error || "Something went wrong");
    } catch {
      setResult("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-32 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 80% 0%, #3D1060 0%, #0D0A1A 55%)" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(#FF6B35, transparent)" }}
      />

      <div className="relative z-10 px-5 pt-14 space-y-6">
        <PageHeader
          title="Party Planner 🎉"
          subtitle="AI-powered party calculator for Indians"
        />

        {/* Guest Count */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Users size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-sm">Number of Guests</p>
              <p className="text-xs text-white/40">Kitne log aa rahe hain?</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-14 h-14 rounded-2xl glass-strong text-2xl font-black active:scale-95 transition-transform"
            >
              −
            </button>

            <div className="text-center">
              <span className="text-6xl font-black gradient-text">{guests}</span>
              <p className="text-xs text-white/40 mt-1">guests</p>
            </div>

            <button
              onClick={() => setGuests(guests + 1)}
              className="w-14 h-14 rounded-2xl text-2xl font-black active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #FF6B35, #FF2D78)" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Budget */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <IndianRupee size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-sm">Budget</p>
              <p className="text-xs text-white/40">Party ka total kharcha</p>
            </div>
          </div>

          <div className="text-center mb-5">
            <span className="text-4xl font-black gradient-text-purple">
              ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="50000"
            step="500"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full mb-4"
          />

          {/* Preset buttons */}
          <div className="grid grid-cols-4 gap-2">
            {budgetPresets.map((p) => (
              <button
                key={p.value}
                onClick={() => setBudget(p.value)}
                className={`chip rounded-2xl py-2 text-xs font-bold transition-all ${
                  budget === p.value
                    ? "text-white"
                    : "glass text-white/50"
                }`}
                style={budget === p.value ? { background: "linear-gradient(135deg, #7B2FFF, #2F80FF)" } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drink Preferences */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🥃</span>
            <div>
              <p className="font-bold text-sm">Drink Preferences</p>
              <p className="text-xs text-white/40">Kya peeyenge?</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {drinkOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value, drinkPrefs, setDrinkPrefs)}
                className={`chip rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  drinkPrefs.includes(opt.value)
                    ? "text-white shadow-glow"
                    : "glass text-white/60"
                }`}
                style={
                  drinkPrefs.includes(opt.value)
                    ? { background: "linear-gradient(135deg, #FF6B35, #FF2D78)" }
                    : {}
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Preferences */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🍛</span>
            <div>
              <p className="font-bold text-sm">Food / Khana</p>
              <p className="text-xs text-white/40">Saath mein kya khayenge?</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {foodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value, foodPrefs, setFoodPrefs)}
                className={`chip rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  foodPrefs.includes(opt.value)
                    ? "text-white"
                    : "glass text-white/60"
                }`}
                style={
                  foodPrefs.includes(opt.value)
                    ? { background: "linear-gradient(135deg, #F7B731, #FC5C7D)" }
                    : {}
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* State Selector */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <MapPin size={18} className="text-teal-400" />
            </div>
            <div>
              <p className="font-bold text-sm">State / Raaj</p>
              <p className="text-xs text-white/40">For local brand & tax calculation</p>
            </div>
          </div>

          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Select your state</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* CTA */}
        <button
          onClick={generatePlan}
          disabled={loading || drinkPrefs.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⚙️
              </motion.span>
              Planning your party...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Generate Party Plan
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