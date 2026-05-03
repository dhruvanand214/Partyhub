"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { isAuthenticated } from "@/lib/auth";

const floatingIcons = [
  { emoji: "🥃", x: "10%", y: "20%", delay: 0, size: 36 },
  { emoji: "🍺", x: "78%", y: "18%", delay: 0.5, size: 40 },
  { emoji: "🍷", x: "8%", y: "62%", delay: 1, size: 32 },
  { emoji: "🎉", x: "82%", y: "55%", delay: 0.8, size: 34 },
  { emoji: "🥂", x: "55%", y: "8%", delay: 1.2, size: 30 },
  { emoji: "🎊", x: "20%", y: "78%", delay: 0.3, size: 28 },
];

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const verified = localStorage.getItem("ageVerified");
    if (verified === "true") {
      // Already verified, show dashboard option
    }
  }, []);
  
  function handleAlreadyVerified() {
    if (isAuthenticated()) {
      router.push("/dashboard"); // ✅ Has valid token
    } else {
      router.push("/age-verification"); // ✅ No token = must verify
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 20%, #6B1FAB 0%, #3D0D6B 25%, #8B1A4A 55%, #C44E1A 80%, #1A0C05 100%)",
      }}
    >
      <Confetti count={35} />

      {/* Floating drink icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: icon.x, top: icon.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: icon.delay, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: icon.size }}
          >
            {icon.emoji}
          </motion.div>
        </motion.div>
      ))}

      {/* Top spacer */}
      <div />

      {/* Hero content */}
      <div className="flex flex-col items-center text-center px-8 z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-[36px] flex items-center justify-center relative"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 60px rgba(255,107,53,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl"
            >
              🍸
            </motion.div>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black tracking-tight"
        >
          Cheers India
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-3 text-xl font-medium text-white/70"
        >
          Plan. Party. Perfect.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-sm text-white/50 leading-relaxed max-w-70"
        >
          India's smartest party planning app — drinks, food, dry day checks & recovery tips
        </motion.p>
      </div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full px-6 pb-12 space-y-3 z-10"
      >
        <Link href="/age-verification" className="block">
          <button className="btn-primary">Get Started 🎉</button>
        </Link>
        <Link href="/dashboard" className="block">
          <button onClick={handleAlreadyVerified} className="btn-secondary">Already verified? Log In</button>
        </Link>

        <p className="text-center text-xs text-white/30 pt-2">
          🔞 For adults 21+ only · Drink responsibly
        </p>
      </motion.div>
    </main>
  );
}