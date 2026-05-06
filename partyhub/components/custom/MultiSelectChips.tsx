"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface Chip {
  label: string;
  value: string;
  emoji?: string;
}

interface MultiSelectChipsProps {
  chips: Chip[];
  selected: string[];
  onToggle: (value: string) => void;
  maxSelect?: number;
}

export default function MultiSelectChips({
  chips,
  selected,
  onToggle,
  maxSelect,
}: MultiSelectChipsProps) {
  function handleToggle(value: string) {
    const isSelected = selected.includes(value);
    if (!isSelected && maxSelect && selected.length >= maxSelect) return;
    onToggle(value);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isSelected = selected.includes(chip.value);
        return (
          <motion.button
            key={chip.value}
            whileTap={{ scale: 0.93 }}
            onClick={() => handleToggle(chip.value)}
            className="chip flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium"
            style={{
              background: isSelected
                ? "rgba(198,138,43,0.12)"
                : "rgba(255,255,255,0.05)",
              border: isSelected
                ? "1.5px solid rgba(198,138,43,0.5)"
                : "1.5px solid rgba(255,255,255,0.1)",
              color: isSelected ? "#E5A94A" : "rgba(245,245,245,0.6)",
            }}
          >
            {chip.emoji && <span className="text-base">{chip.emoji}</span>}
            <span>{chip.label}</span>
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, width: 0, opacity: 0 }}
                  animate={{ scale: 1, width: "auto", opacity: 1 }}
                  exit={{ scale: 0, width: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden flex items-center"
                >
                  <Check size={12} strokeWidth={3} className="text-[#C68A2B]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
