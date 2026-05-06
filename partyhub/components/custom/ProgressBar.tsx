"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  icon: string;
  label: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-6">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={i} className="flex items-center flex-1">
            {/* Node */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  borderColor: isDone
                    ? "#C68A2B"
                    : isActive
                    ? "#C68A2B"
                    : "rgba(255,255,255,0.2)",
                  backgroundColor: isDone
                    ? "#C68A2B"
                    : isActive
                    ? "rgba(198,138,43,0.15)"
                    : "rgba(255,255,255,0.04)",
                }}
                transition={{ duration: 0.25 }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: isDone ? "#C68A2B" : isActive ? "#C68A2B" : "rgba(255,255,255,0.2)",
                  backgroundColor: isDone ? "#C68A2B" : isActive ? "rgba(198,138,43,0.15)" : "rgba(255,255,255,0.04)",
                }}
              >
                {isDone ? (
                  <Check size={14} className="text-black" strokeWidth={3} />
                ) : (
                  <span className={`text-sm ${isActive ? "opacity-100" : "opacity-40"}`}>
                    {step.icon}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#C68A2B]" : isDone ? "text-[#C68A2B]/60" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (except after last) */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-[1.5px] mx-1 mt-[-14px] rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                  style={{ background: "linear-gradient(90deg, #C68A2B, #E5A94A)" }}
                />
                <div
                  className="h-full w-full"
                  style={{ background: "rgba(255,255,255,0.08)", marginTop: "-1.5px" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
