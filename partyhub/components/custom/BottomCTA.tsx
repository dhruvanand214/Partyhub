"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

interface BottomCTAProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  sublabel?: string;
  variant?: "amber" | "ghost";
  className?: string;
}

export default function BottomCTA({
  label,
  onClick,
  disabled = false,
  loading = false,
  loadingLabel = "Loading...",
  sublabel,
  variant = "amber",
  className = "",
}: BottomCTAProps) {
  const isDisabled = disabled || loading;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-safe z-50 ${className || "bottom-0"}`}
      style={{
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        background:
          "linear-gradient(to top, #0B0B0C 70%, transparent 100%)",
        paddingTop: "1.5rem",
      }}
    >
      {sublabel && (
        <p className="text-center text-xs text-[#52525B] mb-2">{sublabel}</p>
      )}
      <motion.button
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        className="btn-amber flex items-center justify-center gap-2.5"
        style={
          variant === "ghost"
            ? {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F5F5F5",
                boxShadow: "none",
              }
            : {}
        }
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            <ArrowRight size={18} />
          </>
        )}
      </motion.button>
    </div>
  );
}
