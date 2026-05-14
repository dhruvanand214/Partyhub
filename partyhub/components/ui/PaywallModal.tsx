"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-[#141416] border border-[#E5A94A]/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Top glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#E5A94A]/10 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X size={16} />
          </button>

          <div className="p-6 pt-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5A94A] to-[#C68A2B] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(229,169,74,0.3)]">
              <Sparkles size={32} className="text-black" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
              Unlock Dawn Pro
            </h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              You've reached your limit of 3 free plans for this month. Upgrade to get unlimited AI planning and premium features.
            </p>

            <div className="space-y-3 mb-8 text-left bg-[#1A1A1C] p-4 rounded-2xl border border-white/5">
              {[
                "Unlimited Party, Solo & Recovery Plans",
                "Advanced Cocktail Recipes",
                "Save & Share Plans with friends",
                "Ad-free experience"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#E5A94A] shrink-0" />
                  <span className="text-sm text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                // In Phase 3, this will trigger Razorpay
                alert("Razorpay integration coming in the next phase!");
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E5A94A] to-[#C68A2B] text-black font-bold shadow-[0_0_20px_rgba(229,169,74,0.4)] active:scale-95 transition-all"
            >
              Upgrade Now — ₹99/mo
            </button>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
