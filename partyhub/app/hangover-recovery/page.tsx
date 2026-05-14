"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import ProgressBar from "@/components/custom/ProgressBar";
import StepHeader from "@/components/custom/StepHeader";
import MultiSelectChips from "@/components/custom/MultiSelectChips";
import BottomCTA from "@/components/custom/BottomCTA";
import BottomNav from "@/components/ui/BottomNav";
import PaywallModal from "@/components/ui/PaywallModal";

const steps = [
  { icon: "🤕", label: "Symptoms" },
  { icon: "📉", label: "Level" },
  { icon: "⏰", label: "Time" },
  { icon: "🍲", label: "Food" },
  { icon: "🍋", label: "Items" },
  { icon: "📋", label: "Plan" },
];

export default function HangoverRecoveryPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { recoveryData, updateRecoveryData, setPlanOutput, planOutput } = useAppStore();

  async function generatePlan() {
    setLoading(true);
    setPlanOutput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "hangover-recovery",
          payload: recoveryData,
        }),
      });

      const data = await res.json();
      
      if (res.status === 402) {
        setShowPaywall(true);
        return;
      }
      
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
    if (step === 1 && recoveryData.symptoms.length === 0) return true;
    if (step === 2 && !recoveryData.drinkingLevel) return true;
    if (step === 3 && !recoveryData.lastDrinkTime) return true;
    if (step === 4 && !recoveryData.foodPref) return true;
    return false;
  };

  return (
    <>
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      <main className="min-h-screen pb-48 relative overflow-x-hidden text-white"
        style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(82,82,91,0.2) 0%, #0B0B0C 60%)" }}
      >
      <div className="relative z-10 px-5 pt-14 space-y-6">
        <StepHeader title="Recovery Mode" onBack={() => step > 1 ? setStep(step - 1) : null} />
        
        {step < 6 && <ProgressBar steps={steps} currentStep={step} />}

        <AnimatePresence mode="wait">
          {/* STEP 1: SYMPTOMS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">How are you feeling?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Select all that apply</p>
              
              <MultiSelectChips 
                chips={[
                  { label: "Headache", value: "Headache", emoji: "🤕" },
                  { label: "Nausea", value: "Nausea", emoji: "🤢" },
                  { label: "Fatigue", value: "Fatigue", emoji: "😴" },
                  { label: "Thirsty", value: "Thirsty", emoji: "💧" },
                  { label: "Dizzy", value: "Dizzy", emoji: "🌀" },
                  { label: "Stomach ache", value: "Stomach ache", emoji: "🤮" },
                  { label: "Dehydrated", value: "Dehydrated", emoji: "🏜️" },
                  { label: "Can't focus", value: "Can't focus", emoji: "😵" },
                ]}
                selected={recoveryData.symptoms}
                onToggle={(val) => {
                  const isSel = recoveryData.symptoms.includes(val);
                  updateRecoveryData({ 
                    symptoms: isSel 
                      ? recoveryData.symptoms.filter(x => x !== val) 
                      : [...recoveryData.symptoms, val] 
                  });
                }}
              />

              <div className="glass rounded-2xl p-4 mt-6 flex gap-3 border-[#C68A2B]/20">
                <AlertTriangle size={18} className="text-[#C68A2B] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  These are general wellness tips, not medical advice. If you have severe symptoms, please seek medical help immediately.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LEVEL */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">How was your night?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Helps us personalize your plan</p>
              
              <div className="space-y-3">
                {[
                  { l: "Light drinking", d: "1-3 drinks" },
                  { l: "Moderate", d: "4-6 drinks" },
                  { l: "Heavy", d: "7-10 drinks" },
                  { l: "Very heavy", d: "10+ drinks" },
                  { l: "Can't remember", d: "I'm not sure 🥴" },
                ].map(l => (
                   <button
                     key={l.l}
                     onClick={() => updateRecoveryData({ drinkingLevel: l.l })}
                     className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${recoveryData.drinkingLevel === l.l ? 'bg-[#52525B]/40 border border-[#A1A1AA]/50' : 'bg-white/5 border border-white/10'}`}
                   >
                     <div className="text-left">
                       <p className="font-bold text-sm text-white">{l.l}</p>
                       <p className="text-[10px] text-[#A1A1AA]">{l.d}</p>
                     </div>
                     {recoveryData.drinkingLevel === l.l && (
                       <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                         <span className="text-black text-[10px] font-black">✓</span>
                       </div>
                     )}
                   </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: TIME */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">When did you stop drinking?</h2>
              
              <div className="space-y-3">
                {["Less than 4 hours ago", "4 - 8 hours ago", "8 - 12 hours ago", "12 - 24 hours ago", "More than 24 hours ago"].map(t => (
                   <button
                     key={t}
                     onClick={() => updateRecoveryData({ lastDrinkTime: t })}
                     className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${recoveryData.lastDrinkTime === t ? 'bg-[#52525B]/40 border border-[#A1A1AA]/50 text-white' : 'bg-white/5 border border-white/10 text-[#A1A1AA]'}`}
                   >
                     {t}
                   </button>
                ))}
              </div>
            </motion.div>
          )}
          {/* STEP 4: FOOD */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">What can you eat right now?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Choose what you feel like having</p>
              
              <div className="space-y-3">
                {[
                  { l: "Something light", d: "Easy to digest", e: "🍋" },
                  { l: "Something warm", d: "Soup / broth / tea", e: "🥣" },
                  { l: "Fruits", d: "Fresh & hydrating", e: "🍉" },
                  { l: "Protein", d: "To regain energy", e: "🥚" },
                  { l: "Surprise me", d: "AI will decide", e: "✨" },
                ].map(f => (
                   <button
                     key={f.l}
                     onClick={() => updateRecoveryData({ foodPref: f.l })}
                     className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${recoveryData.foodPref === f.l ? 'bg-[#52525B]/40 border border-[#A1A1AA]/50' : 'bg-white/5 border border-white/10'}`}
                   >
                     <div className="text-2xl">{f.e}</div>
                     <div className="text-left">
                       <p className="font-bold text-sm text-white">{f.l}</p>
                       <p className="text-[10px] text-[#A1A1AA]">{f.d}</p>
                     </div>
                   </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: ITEMS */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold font-serif mb-2">What do you have available?</h2>
              <p className="text-sm text-[#A1A1AA] mb-4">Select ingredients you have</p>
              
              <MultiSelectChips 
                chips={[
                  { label: "Banana", value: "Banana", emoji: "🍌" },
                  { label: "Eggs", value: "Eggs", emoji: "🥚" },
                  { label: "Ginger", value: "Ginger", emoji: "🫚" },
                  { label: "Honey", value: "Honey", emoji: "🍯" },
                  { label: "Lemon", value: "Lemon", emoji: "🍋" },
                  { label: "Yogurt", value: "Yogurt", emoji: "🥛" },
                  { label: "Oats", value: "Oats", emoji: "🥣" },
                  { label: "Spinach", value: "Spinach", emoji: "🥬" },
                  { label: "Water", value: "Water", emoji: "💧" },
                  { label: "Coconut Water", value: "Coconut Water", emoji: "🥥" },
                ]}
                selected={recoveryData.ingredients}
                onToggle={(val) => {
                  const isSel = recoveryData.ingredients.includes(val);
                  updateRecoveryData({ 
                    ingredients: isSel 
                      ? recoveryData.ingredients.filter(x => x !== val) 
                      : [...recoveryData.ingredients, val] 
                  });
                }}
              />
            </motion.div>
          )}

          {/* STEP 6: PLAN */}
          {step === 6 && planOutput.data && (() => {
            let aiPlan: any = null;
            try {
              let jsonString = planOutput.data;
              if (jsonString.startsWith("```")) {
                jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
              }
              aiPlan = JSON.parse(jsonString);
            } catch (e) {
              console.error("Failed to parse recovery plan JSON");
            }

            return (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="text-center mb-2">
                  <h2 className="font-bold text-2xl mb-1 text-blue-gradient" style={{
                    background: "linear-gradient(135deg, #4A90E2, #50E3C2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>Your Recovery Plan ✨</h2>
                  <p className="text-sm text-[#A1A1AA]">Personalized to help you bounce back</p>
                </div>
                
                {aiPlan ? (
                  <>
                    <div className="bg-[#141416] rounded-3xl p-5 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Severity</p>
                        <p className="font-bold text-[#50E3C2] capitalize">{aiPlan.severity || "Moderate"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Timeline</p>
                        <p className="font-bold text-white">{aiPlan.recoveryTimeline || "Few hours"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Immediate Actions */}
                      <div className="bg-[#141416] rounded-3xl p-5 border border-white/5 border-l-4 border-l-[#4A90E2]">
                        <h3 className="font-bold text-sm mb-3 text-white flex items-center gap-2">🚨 Immediate Actions</h3>
                        <div className="space-y-2">
                          {aiPlan.immediateActions?.map((act: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start text-xs text-white/80">
                              <span className="text-[#4A90E2] mt-0.5">•</span>
                              <p>{act}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Remedies */}
                      <div className="bg-[#141416] rounded-3xl p-5 border border-white/5 border-l-4 border-l-[#50E3C2]">
                        <h3 className="font-bold text-sm mb-3 text-white flex items-center gap-2">🌿 Indian Home Remedies</h3>
                        <div className="space-y-2">
                          {aiPlan.indianHomeRemedies?.map((rem: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start text-xs text-white/80">
                              <span className="text-[#50E3C2] mt-0.5">✓</span>
                              <p>{rem}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Food & Drink */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#141416] rounded-2xl p-4 border border-white/5">
                          <h3 className="font-bold text-xs mb-2 text-[#E5A94A]">Eat 🍞</h3>
                          <div className="space-y-1">
                            {aiPlan.foods?.map((f: string, i: number) => (
                              <p key={i} className="text-[11px] text-white/70">• {f}</p>
                            ))}
                          </div>
                        </div>
                        <div className="bg-[#141416] rounded-2xl p-4 border border-white/5">
                          <h3 className="font-bold text-xs mb-2 text-[#4A90E2]">Drink 💧</h3>
                          <div className="space-y-1">
                            {aiPlan.drinks?.map((d: string, i: number) => (
                              <p key={i} className="text-[11px] text-white/70">• {d}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Avoid */}
                      <div className="bg-[#2A0E13] rounded-3xl p-5 border border-[#7A1840]/30">
                        <h3 className="font-bold text-sm mb-3 text-[#E55A5A] flex items-center gap-2">❌ What to Avoid</h3>
                        <div className="space-y-2">
                          {aiPlan.avoid?.map((av: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start text-xs text-white/80">
                              <span className="text-[#E55A5A] mt-0.5">⨯</span>
                              <p>{av}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-medium rounded-3xl p-5 border border-white/20" style={{ maxHeight: "60vh", overflowY: "auto" }}>
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
        label={step === 5 ? "Generate Recovery Plan" : step === 6 ? "Done" : "Next"}
        onClick={step === 6 ? () => alert("Done") : handleNext}
        disabled={isNextDisabled()}
        loading={loading}
        loadingLabel="Brewing the cure..."
        variant="ghost"
        className="bottom-24"
      />
      <BottomNav />
    </main>
    </>
  );
}