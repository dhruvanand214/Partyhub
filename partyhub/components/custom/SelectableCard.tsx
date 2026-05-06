"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  glowColor?: string;
  disabled?: boolean;
}

export default function SelectableCard({
  selected,
  onClick,
  children,
  className = "",
  glowColor = "rgba(198,138,43,0.3)",
  disabled = false,
}: SelectableCardProps) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative w-full rounded-2xl overflow-hidden text-left transition-all duration-200 ${className}`}
      style={{
        background: selected
          ? "rgba(198,138,43,0.08)"
          : "rgba(255,255,255,0.04)",
        border: selected
          ? "1.5px solid rgba(198,138,43,0.5)"
          : "1.5px solid rgba(255,255,255,0.08)",
        boxShadow: selected ? `0 0 24px ${glowColor}` : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Selection check badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C68A2B, #E5A94A)" }}
        >
          <Check size={11} className="text-black" strokeWidth={3} />
        </motion.div>
      )}

      {children}
    </motion.button>
  );
}
