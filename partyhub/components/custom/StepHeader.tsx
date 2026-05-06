"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
}

export default function StepHeader({
  title,
  subtitle,
  rightSlot,
  backHref,
  onBack,
}: StepHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  }

  return (
    <div className="flex items-center justify-between mb-5">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handleBack}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        aria-label="Go back"
      >
        <ChevronLeft size={18} className="text-white/80" />
      </motion.button>

      <div className="text-center flex-1 mx-3">
        <h1
          className="text-base font-semibold text-white/90 tracking-wide"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="w-9 h-9 flex items-center justify-center">
        {rightSlot ?? null}
      </div>
    </div>
  );
}
