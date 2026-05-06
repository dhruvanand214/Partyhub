"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Clock, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import ProgressBar from "@/components/custom/ProgressBar";
import StepHeader from "@/components/custom/StepHeader";
import SliderInput from "@/components/custom/SliderInput";
import MultiSelectChips from "@/components/custom/MultiSelectChips";
import BottomCTA from "@/components/custom/BottomCTA";
import BottomNav from "@/components/ui/BottomNav";

const steps = [
  { icon: "😌", label: "Mood" },
  { icon: "🎉", label: "Occasion" },
  { icon: "💸", label: "Budget" },
  { icon: "🎯", label: "Prefs" },
  { icon: "⏰", label: "Time" },
  { icon: "✨", label: "Plan" },
];

export default function SoloModePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { soloData, updateSoloData, setPlanOutput, planOutput } = useAppStore();

  async function generatePlan() {
    setLoading(true);
    setPlanOutput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "solo-mode",
          payload: soloData,
        }),
      });

      const data = await res.json();
      setPlanOutput(data.result || "Something went wrong");
      setStep(6);
    } catch {
      setPlanOutput("Failed to connect.");
      setStep(6);
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 5) {
      generatePlan();
    } else if (step < 6) {
      setStep(step + 1);
    }
  }

  const isNextDisabled = () => {
    if (step === 1 && !soloData.mood) return true;
    if (step === 3 && soloData.budget < 500) return true;
    if (step === 4 && soloData.preferences.length === 0) return true;
    if (step === 5 && !soloData.dateTime) return true;
    return false;
  };

  return (
    <main className="min-h-screen pb-48 relative overflow-x-hidden text-white"
      style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(90,15,46,0.15) 0%, #0B0B0C 60%)" }}
    >
      <div className="relative z-10 px-5 pt-14 space-y-6">
        <StepHeader title="Solo Mode" onBack={() => step > 1 ? setStep(step - 1) : null} />
        
        {step < 6 && <ProgressBar steps={steps} currentStep={step} />}

        <AnimatePresence mode="wait">
          {/* STEP 1: MOOD */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold font-serif mb-4">How are you feeling tonight?</h2>
              {[
                { l: "Relaxed", d: "Smooth & unwinding", e: "😌" },
                { l: "Celebratory", d: "High energy, poppin' bottles", e: "🥳" },
                { l: "Chill", d: "Lowkey vibes", e: "😎" },
                { l: "Adventurous", d: "Try something new", e: "🤠" },
                { l: "Romantic", d: "Setting the mood", e: "❤️" },
              ].map(m => (
                <button
                  key={m.l}
                  onClick={() => updateSoloData({ mood: m.l })}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${soloData.mood === m.l ? 'bg-[#5A0F2E]/30 border border-[#7A1840]/60' : 'bg-white/5 border border-white/10'}`}
                >
                  <div className="text-3xl">{m.e}</div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white">{m.l}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{m.d}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 2: OCCASION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold font-serif mb-4">What's the occasion?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Optional, but helps us curate</p>
              
              <div className="grid grid-cols-2 gap-3">
                {["Just Because", "Hard Day at Work", "Treat Yourself", "Pre-game", "Date Night", "Netflix & Chill"].map(o => (
                   <button
                     key={o}
                     onClick={() => updateSoloData({ occasion: o })}
                     className={`p-4 rounded-2xl text-sm font-semibold transition-all ${soloData.occasion === o ? 'bg-[#C68A2B]/20 text-[#E5A94A] border border-[#C68A2B]/50' : 'bg-white/5 text-[#A1A1AA] border border-white/10'}`}
                   >
                     {o}
                   </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">What's your budget?</h2>
              
              <div className="glass rounded-3xl p-6 text-center mt-8">
                <span className="text-5xl font-black text-amber-gradient mb-8 block">
                  ₹{soloData.budget.toLocaleString("en-IN")}
                </span>

                <SliderInput 
                  min={500} max={10000} step={250}
                  value={soloData.budget} 
                  onChange={(val) => updateSoloData({ budget: val })} 
                  minLabel="₹500" maxLabel="₹10,000" 
                />
              </div>
            </motion.div>
          )}
          {/* STEP 4: PREFERENCES */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">Any preferences?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Select all that apply</p>
              
              <MultiSelectChips 
                chips={[
                  { label: "Local Brands", value: "Local Brands", emoji: "🇮🇳" },
                  { label: "Imported", value: "Imported", emoji: "🌍" },
                  { label: "Strong", value: "Strong", emoji: "💪" },
                  { label: "Light", value: "Light", emoji: "🌊" },
                  { label: "Sweet", value: "Sweet", emoji: "🍓" },
                  { label: "Dry", value: "Dry", emoji: "🫒" },
                  { label: "Cocktails", value: "Cocktails", emoji: "🍸" },
                ]}
                selected={soloData.preferences}
                onToggle={(val) => {
                  const isSel = soloData.preferences.includes(val);
                  updateSoloData({ 
                    preferences: isSel 
                      ? soloData.preferences.filter(x => x !== val) 
                      : [...soloData.preferences, val] 
                  });
                }}
              />
            </motion.div>
          )}

          {/* STEP 5: TIME */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">When are we starting?</h2>
              
              <div className="glass rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5A0F2E]/30 flex items-center justify-center">
                    <Clock size={20} className="text-[#7A1840]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm">Time</h2>
                    <p className="text-xs text-[#A1A1AA]">Set the vibe timeline</p>
                  </div>
                </div>

                <input 
                  type="time" 
                  value={soloData.dateTime}
                  onChange={(e) => updateSoloData({ dateTime: e.target.value })}
                  className="input-dtd" 
                />
              </div>
            </motion.div>
          )}

          {/* STEP 6: AI PLAN */}
          {step === 6 && planOutput.data && (() => {
            let aiPlan: any = null;
            try {
              let jsonString = planOutput.data;
              if (jsonString.startsWith("```")) {
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
              }
              aiPlan = JSON.parse(jsonString);
            } catch (e) {
              console.error("Failed to parse solo plan JSON");
            }

            return (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="text-center mb-2">
                  <h2 className="font-bold text-2xl mb-1 text-merlot-gradient" style={{
                    background: "linear-gradient(135deg, #7A1840, #C68A2B)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>Your Night is Set ✨</h2>
                  <p className="text-sm text-[#A1A1AA]">Curated just for you</p>
                </div>
                
                {aiPlan ? (
                  <>
                    {/* Header Summary */}
                    <div className="bg-[#141416] rounded-3xl p-5 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Mood</p>
                        <p className="font-bold text-[#C68A2B]">{aiPlan.mood || soloData.mood}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Budget</p>
                        <p className="font-bold text-white">₹{soloData.budget}</p>
                      </div>
                    </div>

                    {/* Drink Recommendations */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Drinks & Pairings</h3>
                      {aiPlan.recommendations?.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-[#141416] rounded-3xl overflow-hidden border border-[#5A0F2E]/30 relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7A1840] to-[#C68A2B]"></div>
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-[#E5A94A] text-lg">{rec.drinkName}</h4>
                                <p className="text-xs text-white/60">{rec.indianBrand} • {rec.type}</p>
                              </div>
                              <span className="bg-[#C68A2B]/20 text-[#C68A2B] text-[10px] font-bold px-2 py-1 rounded-md">{rec.estimatedPrice}</span>
                            </div>
                            
                            <p className="text-sm text-white/80 mb-4">{rec.whyItFits}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-white/40 uppercase mb-1">Flavor</p>
                                <p className="text-xs">{rec.flavorProfile}</p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-[10px] text-white/40 uppercase mb-1">Pairing</p>
                                <p className="text-xs">{rec.foodPairing}</p>
                              </div>
                            </div>
                            
                            <div className="bg-[#5A0F2E]/20 rounded-xl p-3 border border-[#7A1840]/30">
                              <p className="text-[10px] text-[#C68A2B] uppercase mb-1">How to Serve</p>
                              <p className="text-xs text-white/90">{rec.howToServe}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="bg-[#1A1A1C] rounded-3xl p-5 border border-white/5">
                      <h3 className="font-bold text-sm mb-3 text-[#E5A94A]">Quick Tip 💡</h3>
                      <p className="text-sm text-white/80 mb-5">{aiPlan.quickTip}</p>
                      
                      <div className="space-y-2">
                        {aiPlan.responsibleDrinkingTips?.map((tip: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start text-xs text-white/50">
                            <span className="text-[#7A1840]">✓</span>
                            <p>{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-medium rounded-3xl p-5 border border-[#5A0F2E]/40" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                     <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans">
                       {planOutput.data}
                     </pre>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      <BottomCTA
        label={step === 5 ? "Generate My Plan" : step === 6 ? "Done" : "Continue"}
        onClick={step === 6 ? () => alert("Done") : handleNext}
        disabled={isNextDisabled()}
        loading={loading}
        loadingLabel="Crafting your vibe..."
        className="bottom-24"
      />
      <BottomNav />
    </main>
  );
}