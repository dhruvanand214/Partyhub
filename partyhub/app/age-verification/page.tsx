"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle } from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - 18 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function AgeVerificationPage() {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function verify() {
    setError("");

    if (!day || !month || !year) {
      setError("Please enter your complete date of birth.");
      return;
    }

    if (!accepted) {
      setError("Please accept the terms and conditions to continue.");
      return;
    }

    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 21) {
      setError(`You must be 21 years or older to use this app. You are ${age} years old.`);
      return;
    }

    setLoading(true);
    localStorage.setItem("ageVerified", "true");

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <main className="min-h-screen px-5 py-8 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 0%, #2D1060 0%, #0D0A1A 60%)",
      }}
    >
      {/* BG orb */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(#7B2FFF, transparent)" }}
      />

      <div className="relative z-10 max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Icon */}
          <div className="pt-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,196,140,0.2), rgba(0,130,179,0.2))",
                border: "1px solid rgba(0,196,140,0.3)",
              }}
            >
              <ShieldCheck size={40} className="text-emerald-400" />
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-3xl font-black">Age Verification</h1>
            <p className="mt-3 text-white/60 leading-relaxed text-sm">
              This app contains alcohol-related content. As per Indian law, you must be
              <span className="text-white font-semibold"> 21 years or older</span> to use this app.
            </p>
          </div>

          {/* DOB selectors */}
          <div className="glass rounded-3xl p-5 space-y-4">
            <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">
              Date of Birth
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-2 block">Day</label>
                <select value={day} onChange={(e) => setDay(e.target.value)}>
                  <option value="">DD</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-2 block">Month</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">MM</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m.slice(0, 3)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-2 block">Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">YYYY</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Terms */}
          <label className="flex gap-3 cursor-pointer">
            <div
              onClick={() => setAccepted(!accepted)}
              className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${
                accepted
                  ? "bg-gradient-to-br from-orange-500 to-pink-500 border-transparent"
                  : "border-white/20"
              }`}
            >
              {accepted && <span className="text-white text-xs font-black">✓</span>}
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              I confirm that I am 21 years or older, and I agree to the{" "}
              <span className="text-orange-400 underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="text-orange-400 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </label>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-start rounded-2xl p-4"
              style={{ background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.2)" }}
            >
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          {/* CTA */}
          <button
            onClick={verify}
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Confirm Age & Continue"}
          </button>

          <p className="text-center text-xs text-white/25 leading-5">
            🔒 Your data is encrypted and never shared.{"\n"}
            One-time verification stored locally on your device.
          </p>
        </motion.div>
      </div>
    </main>
  );
}