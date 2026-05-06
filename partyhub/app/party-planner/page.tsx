"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Save, Sparkles, AlertTriangle, ChevronRight, Plus, Users, DollarSign, Wine, Sandwich, Check, Utensils, Star, Info, TrendingUp, GlassWater, Shield, Pen, User, Wallet, Calendar, Gift, ArrowRight, Share, Download } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import BottomNav from "@/components/ui/BottomNav";

const stepsList = [
  { id: 1, icon: Users, label: "People" },
  { id: 2, icon: DollarSign, label: "Budget" },
  { id: 3, icon: Wine, label: "Preferences" },
  { id: 4, icon: Sandwich, label: "Food" },
  { id: 5, icon: Check, label: "Review" },
  { id: 6, icon: Sparkles, label: "Cocktails" },
];

const drinkOptions = [
  { l: "Whisky", img: "/whisky.png" },
  { l: "Vodka", img: "/vodka.png" },
  { l: "Rum", img: "/rum.png" },
  { l: "Gin", img: "/gin.png" },
  { l: "Tequila", img: "/tequila.png" },
  { l: "Beer", img: "/beer.png" },
  { l: "Red Wine", img: "/redwine.png" },
  { l: "White Wine", img: "/whitewine.png" },
  { l: "Champagne", img: "/champagne.png" },
  { l: "Brandy", img: "/brandy.png" },
];

const mockCocktails = [
  { name: "Dusk Old Fashioned", desc: "Whiskey, Bitters, Sugar, Orange Peel", tags: ["Strong", "Classic"], rating: "4.8", popular: "Very Popular", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop" },
  { name: "Berry Smash", desc: "Vodka, Mixed Berries, Lemon, Mint", tags: ["Fruity", "Refreshing"], rating: "4.6", popular: "Popular", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=200&auto=format&fit=crop" },
  { name: "Citrus Margarita", desc: "Tequila, Triple Sec, Lime Juice", tags: ["Zesty", "Classic"], rating: "4.7", popular: "Very Popular", img: "https://images.unsplash.com/photo-1563451559869-70eaeb00f404?q=80&w=200&auto=format&fit=crop" },
  { name: "Midnight Mojito", desc: "White Rum, Mint, Lime, Soda", tags: ["Refreshing", "Light"], rating: "4.5", popular: "Popular", img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=200&auto=format&fit=crop" },
  { name: "Espresso Martini", desc: "Vodka, Coffee Liqueur, Espresso", tags: ["Strong", "Modern"], rating: "4.9", popular: "Trending", img: "https://images.unsplash.com/photo-1625860633266-9ab53f7c4611?q=80&w=200&auto=format&fit=crop" }
];

export default function PartyPlannerPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showBudgetDetails, setShowBudgetDetails] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const { partyData, updatePartyData } = useAppStore();

  async function generatePlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "party-planner", payload: partyData }),
      });
      if (!res.ok) throw new Error("API Request Failed");
      
      const data = await res.json();
      let jsonString = data.result;
      if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
      }
      
      const parsedPlan = JSON.parse(jsonString);
      setAiPlan(parsedPlan);
      setStep(5);
    } catch (err) {
      console.error(err);
      alert("Oops! The AI is taking a break or returned invalid data. Please try again.");
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

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  const isNextDisabled = () => {
    if (step === 1 && (partyData.people < 2 || !partyData.state)) return true;
    if (step === 2 && (partyData.people < 3 && partyData.budget < 500) || (partyData.people >= 3 && partyData.budget < 1000)) return true;
    if (step === 3 && partyData.drinkPrefs.length === 0) return true;
    if (step === 4 && partyData.foodItems.length === 0) return true;
    return false;
  };

  const perPerson = Math.round(partyData.budget / partyData.people);
  
  // Calculate relative percentages strictly from the AI's breakdown to ensure they sum to 100%
  const aiTotalCost = aiPlan ? (aiPlan.budgetBreakdown.drinks || 0) + (aiPlan.budgetBreakdown.food || 0) + (aiPlan.budgetBreakdown.extras || 0) : 1;
  const drinksPct = aiPlan ? Math.round(((aiPlan.budgetBreakdown.drinks || 0) / Math.max(1, aiTotalCost)) * 100) : 0;
  const foodPct = aiPlan ? Math.round(((aiPlan.budgetBreakdown.food || 0) / Math.max(1, aiTotalCost)) * 100) : 0;
  const extrasPct = aiPlan ? Math.round(((aiPlan.budgetBreakdown.extras || 0) / Math.max(1, aiTotalCost)) * 100) : 0;

  return (
    <main className="min-h-screen pb-48 bg-[#0B0B0C] text-white overflow-x-hidden font-sans">
      <div className="px-5 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-95">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-[#E5A94A]">Party Planner</h1>
            {step === 5 && <p className="text-xs text-white/50">Review & Confirm</p>}
            {step === 6 && <p className="text-xs text-white/50">AI Cocktail Suggestions</p>}
          </div>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-95">
            <Save size={18} className="text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between px-2 mb-8 relative">
          <div className="absolute top-5 left-8 right-8 h-[1px] -z-10 border-t border-dashed border-white/20" />
          <div className="absolute top-5 left-8 h-[1px] -z-10 border-t border-dashed border-[#E5A94A] transition-all duration-500" style={{ width: `calc(${((step - 1) / (stepsList.length - 1)) * 100}% - 2rem)` }} />
          {stepsList.map((s, i) => {
            const isPast = s.id < step;
            const isCurrent = s.id === step;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 relative bg-[#0B0B0C] px-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCurrent ? "border-2 border-[#E5A94A] bg-[#1A1A1A]" :
                      isPast ? "border border-white/10 bg-[#0B0B0C]" : "border border-white/10 bg-[#0B0B0C]"
                    }`}
                >
                  <Icon size={18} className={isCurrent ? "text-[#E5A94A]" : "text-white/40"} />
                  {isPast && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E5A94A] rounded-full flex items-center justify-center">
                      <Check size={10} className="text-black stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isCurrent ? "text-[#E5A94A]" : "text-white/40"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: PEOPLE */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-[#141416] rounded-[30px] p-8 border border-[#E5A94A]/20 shadow-[0_0_20px_rgba(229,169,74,0.05)]">
                <h2 className="text-xl font-bold mb-8 text-center text-white">How many people are coming?</h2>

                <div className="flex items-center justify-center gap-8 mb-4">
                  <button onClick={() => updatePartyData({ people: Math.max(1, partyData.people - 1) })} className="w-14 h-14 rounded-full border border-[#E5A94A]/40 flex items-center justify-center text-3xl font-light text-[#E5A94A] transition-colors hover:bg-[#E5A94A]/10">-</button>
                  <div className="text-center w-24">
                    <span className="text-[64px] font-bold text-[#E5A94A] leading-none">{partyData.people}</span>
                  </div>
                  <button onClick={() => updatePartyData({ people: partyData.people + 1 })} className="w-14 h-14 rounded-full bg-[#E5A94A] flex items-center justify-center text-3xl font-light text-black transition-colors hover:opacity-90">+</button>
                </div>
              </div>

              <div className="bg-[#141416] rounded-[30px] p-8 border border-white/5 mt-6">
                <h2 className="text-xl font-bold mb-6 text-center text-white">Which state are you in?</h2>
                <div className="relative">
                  <select
                    value={partyData.state}
                    onChange={(e) => updatePartyData({ state: e.target.value })}
                    className="w-full bg-[#1A1A1C] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#E5A94A] appearance-none"
                  >
                    <option value="" disabled>Select your state...</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra (Mumbai/Pune)</option>
                    <option value="Karnataka">Karnataka (Bangalore)</option>
                    <option value="Goa">Goa</option>
                    <option value="Haryana">Haryana (Gurgaon)</option>
                    <option value="Telangana">Telangana (Hyderabad)</option>
                    <option value="UP">Uttar Pradesh (Noida)</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronRight size={16} className="text-white/40 rotate-90" />
                  </div>
                </div>
                <p className="text-[10px] text-[#E5A94A]/80 mt-3 text-center flex items-center justify-center gap-1"><Info size={10}/> Required to estimate accurate alcohol prices.</p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUDGET */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="border border-[#E5A94A]/20 bg-gradient-to-br from-[#1A0A04] to-[#0B0B0C] rounded-3xl p-6">
                <h2 className="font-bold text-lg mb-4">What's your total budget for the party?</h2>
                <div className="text-5xl font-bold text-[#E5A94A] mb-8">₹{partyData.budget.toLocaleString("en-IN")}</div>

                <div className="relative mb-8">
                  <input
                    type="range" min={partyData.people < 3 ? 500 : 1000} max={50000} step={100}
                    value={partyData.budget}
                    onChange={(e) => updatePartyData({ budget: Number(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none"
                    style={{
                      background: `linear-gradient(to right, #E5A94A ${(partyData.budget - (partyData.people < 3 ? 500 : 1000)) / (50000 - (partyData.people < 3 ? 500 : 1000)) * 100}%, rgba(255,255,255,0.1) ${(partyData.budget - (partyData.people < 3 ? 500 : 1000)) / (50000 - (partyData.people < 3 ? 500 : 1000)) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-2 text-xs text-white/40">
                    <span>₹{partyData.people < 3 ? '500' : '1,000'}</span>
                    <span>₹50,000</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-white/60">💡 That's <strong className="text-[#E5A94A]">~₹{perPerson.toLocaleString("en-IN")}</strong> per person</p>
                </div>
              </div>

              <div className="bg-[#141416] rounded-3xl p-5 border border-white/5">
                <h3 className="font-bold text-sm mb-3">Budget will be split as</h3>
                <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 mb-4">
                  <button onClick={() => updatePartyData({ splitType: "equally" })} className={`flex-1 py-3 text-sm font-semibold rounded-lg ${partyData.splitType === 'equally' ? 'bg-[#1A1A1C] border border-[#E5A94A]/50 text-[#E5A94A]' : 'text-white/50'}`}>Equally</button>
                  <button onClick={() => updatePartyData({ splitType: "custom" })} className={`flex-1 py-3 text-sm font-semibold rounded-lg ${partyData.splitType === 'custom' ? 'bg-[#1A1A1C] border border-[#E5A94A]/50 text-[#E5A94A]' : 'text-white/50'}`}>Custom Split</button>
                </div>

                {partyData.splitType === 'equally' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-xl">👥</span><span className="text-sm">{partyData.people} People</span></div>
                    <div className="text-sm"><strong className="text-[#E5A94A]">₹{perPerson.toLocaleString("en-IN")}</strong> / person</div>
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Host (You)</span>
                      <strong className="text-[#E5A94A]">₹{(partyData.budget * 0.4).toLocaleString("en-IN")} <span className="text-white/40 font-normal">(40%)</span></strong>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full relative">
                      <div className="absolute top-0 left-0 h-full bg-[#E5A94A] rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Guests ({partyData.people - 1})</span>
                      <strong className="text-white">₹{((partyData.budget * 0.6) / Math.max(1, partyData.people - 1)).toLocaleString("en-IN")} <span className="text-white/40 font-normal">/ person</span></strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#141416] rounded-3xl p-4 border border-white/5 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#E5A94A]/10 flex items-center justify-center text-[#E5A94A] border border-[#E5A94A]/30">✨</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#E5A94A]">Recommended for {partyData.people} people</p>
                  <p className="text-xs text-white/50 mt-1">Great choice! This budget works well for a comfortable party.</p>
                </div>
                <button onClick={() => setShowBudgetDetails(!showBudgetDetails)} className="flex items-center gap-1 border border-[#E5A94A]/30 text-[#E5A94A] px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors hover:bg-[#E5A94A]/10">
                  {showBudgetDetails ? 'Hide Details' : 'View Details'} <ChevronRight size={14} className={`transition-transform ${showBudgetDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <AnimatePresence>
                {showBudgetDetails && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-[#141416] rounded-3xl p-5 border border-white/5">
                      <h3 className="font-bold text-sm mb-4">Estimated Breakdown</h3>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div><div className="w-10 h-10 mx-auto rounded-xl bg-[#E5A94A]/10 flex items-center justify-center text-xl border border-[#E5A94A]/20 mb-2">🥃</div><p className="text-[9px] text-white/60 mb-0.5">Drinks (60%)</p><p className="font-bold text-[11px] text-[#E5A94A]">₹{Math.round(partyData.budget * 0.60).toLocaleString("en-IN")}</p></div>
                        <div><div className="w-10 h-10 mx-auto rounded-xl bg-[#E5A94A]/10 flex items-center justify-center text-xl border border-[#E5A94A]/20 mb-2">🧊</div><p className="text-[9px] text-white/60 mb-0.5">Mixers (15%)</p><p className="font-bold text-[11px] text-[#E5A94A]">₹{Math.round(partyData.budget * 0.15).toLocaleString("en-IN")}</p></div>
                        <div><div className="w-10 h-10 mx-auto rounded-xl bg-[#E5A94A]/10 flex items-center justify-center text-xl border border-[#E5A94A]/20 mb-2">🍿</div><p className="text-[9px] text-white/60 mb-0.5">Food (20%)</p><p className="font-bold text-[11px] text-[#E5A94A]">₹{Math.round(partyData.budget * 0.20).toLocaleString("en-IN")}</p></div>
                        <div><div className="w-10 h-10 mx-auto rounded-xl bg-[#E5A94A]/10 flex items-center justify-center text-xl border border-[#E5A94A]/20 mb-2">🌐</div><p className="text-[9px] text-white/60 mb-0.5">Others (5%)</p><p className="font-bold text-[11px] text-[#E5A94A]">₹{Math.round(partyData.budget * 0.05).toLocaleString("en-IN")}</p></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 3: PREFERENCES */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="font-bold text-lg mb-1">What drinks do you and your crew enjoy?</h2>
                <p className="text-sm text-white/50 mb-4">Select all that apply</p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {drinkOptions.map(d => {
                    const isSelected = partyData.drinkPrefs.includes(d.l);
                    return (
                      <button
                        key={d.l}
                        onClick={() => {
                          const newPrefs = isSelected ? partyData.drinkPrefs.filter(x => x !== d.l) : [...partyData.drinkPrefs, d.l];
                          updatePartyData({ drinkPrefs: newPrefs });
                        }}
                        className={`relative rounded-2xl overflow-hidden aspect-square flex flex-col justify-end p-2 border transition-all ${isSelected ? 'border-[#E5A94A]' : 'border-white/10'}`}
                      >
                        <img src={d.img} alt={d.l} className={`absolute inset-0 w-full h-full object-cover transition-transform ${isSelected ? 'scale-105' : ''}`} />
                        {isSelected ? (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#E5A94A] rounded-full flex items-center justify-center z-10 text-black text-[10px] font-bold shadow-md">✓</div>
                        ) : (
                          <div className="absolute top-2 right-2 w-5 h-5 border border-white/40 rounded-full z-10 bg-black/20" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <h3 className="font-bold text-sm mt-6 mb-2">Preferred Drink Segment</h3>
                <p className="text-xs text-white/50 mb-3">Choose the alcohol quality/price range.</p>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {["budget", "mid", "premium", "luxury"].map(seg => (
                    <button
                      key={seg}
                      onClick={() => updatePartyData({ drinkSegment: seg })}
                      className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all capitalize border ${partyData.drinkSegment === seg ? 'bg-[#1A1A1C] text-[#E5A94A] border-[#E5A94A]' : 'bg-transparent text-white/60 border-white/10 hover:border-white/20'}`}
                    >
                      {seg === "budget" ? "Budget / Economy" : seg === "mid" ? "Standard / Mid" : seg === "premium" ? "Premium" : "Luxury / Scotch"}
                    </button>
                  ))}
                </div>

                <h3 className="font-bold text-sm mb-2">Any specific taste preference?</h3>
                <p className="text-xs text-white/50 mb-4">Helps us suggest better drinks for you</p>

                <div className="flex flex-wrap gap-2">
                  {["Sweet", "Sour", "Strong", "Light", "Fruity", "Classic", "Tropical", "Citrusy", "Herbal"].map(t => {
                    const isSelected = partyData.tastePrefs.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const newPrefs = isSelected ? partyData.tastePrefs.filter(x => x !== t) : [...partyData.tastePrefs, t];
                          updatePartyData({ tastePrefs: newPrefs });
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${isSelected ? 'bg-transparent text-[#E5A94A] border border-[#E5A94A]' : 'bg-transparent text-white/60 border border-white/20'}`}
                      >
                        {t} {isSelected && <span className="w-3 h-3 bg-[#E5A94A] rounded-full text-black flex items-center justify-center text-[8px]">✓</span>}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 border border-[#E5A94A]/20 bg-gradient-to-r from-[#1A0A04] to-[#0B0B0C] rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-2xl">✨</div>
                  <div className="flex-1">
                    <p className="font-bold text-[#E5A94A] text-sm">Great choices!</p>
                    <p className="text-xs text-white/60 mt-1">We'll curate the best drinks based on your preferences.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: FOOD */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="border border-[#E5A94A]/20 bg-gradient-to-br from-[#1A0A04] to-[#0B0B0C] rounded-3xl p-6">
                <h2 className="font-bold text-lg mb-1">What's on the menu?</h2>
                <p className="text-sm text-white/50 mb-4">Select food types</p>

                <div className="space-y-3">
                  {[
                    { l: "Snacks / Chakna", e: Utensils, desc: "Peanuts, Chips, Nachos" },
                    { l: "Starters", e: Sandwich, desc: "Tikkas, Kebabs, Fries" },
                    { l: "Main Course", e: Utensils, desc: "Biryani, Curries, Breads" },
                    { l: "Fast Food", e: Sandwich, desc: "Pizzas, Burgers" }
                  ].map(f => {
                    const existing = partyData.foodItems.find(x => x.name === f.l);
                    const isSelected = !!existing;
                    const qty = existing ? existing.qty : 0;
                    const Icon = f.e;

                    return (
                      <div key={f.l} className={`p-4 rounded-2xl flex items-center justify-between transition-all ${isSelected ? 'bg-[#E5A94A]/10 border border-[#E5A94A]/40' : 'bg-[#141416] border border-white/5'}`}>
                        <div className="flex items-center gap-3">
                          <div className="text-[#E5A94A] opacity-80"><Icon size={24} /></div>
                          <div>
                            <p className="font-bold text-sm">{f.l}</p>
                            <p className="text-[10px] text-[#A1A1AA]">{f.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <div className="flex items-center border border-white/20 rounded-lg p-1 bg-black/40">
                              <button onClick={() => {
                                if (qty === 1) {
                                  updatePartyData({ foodItems: partyData.foodItems.filter(x => x.name !== f.l) });
                                } else {
                                  updatePartyData({ foodItems: partyData.foodItems.map(x => x.name === f.l ? { ...x, qty: x.qty - 1 } : x) });
                                }
                              }} className="w-6 h-6 flex items-center justify-center text-white/60">-</button>
                              <span className="w-6 text-center text-xs font-bold text-white">{qty}</span>
                              <button onClick={() => {
                                updatePartyData({ foodItems: partyData.foodItems.map(x => x.name === f.l ? { ...x, qty: x.qty + 1 } : x) });
                              }} className="w-6 h-6 flex items-center justify-center text-[#E5A94A]">+</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updatePartyData({ foodItems: [...partyData.foodItems, { name: f.l, qty: 1 }] })}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50"
                            >+</button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && aiPlan && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pb-12">
               {/* Header Box */}
               <div className="border border-white/5 bg-gradient-to-br from-[#2A0E13]/80 to-[#0B0B0C] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                 <h2 className="font-bold text-xl text-[#E5A94A] mb-3">Your Party Plan is Ready! 🎉</h2>
                 <div className="flex items-center gap-3 text-xs text-white/70">
                   <span className="flex items-center gap-1.5"><Users size={14} className="text-[#E5A94A]" /> {partyData.people} People</span>
                   <span>•</span>
                   <span className="flex items-center gap-1.5"><Wallet size={14} className="text-[#E5A94A]" /> Budget: ₹{partyData.budget.toLocaleString("en-IN")}</span>
                 </div>
               </div>

               {/* Plan Summary */}
               <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                 <div className="flex items-center justify-between mb-5">
                   <h3 className="font-bold text-base">Plan Summary</h3>
                   <button onClick={() => setStep(1)} className="border border-[#E5A94A]/40 text-[#E5A94A] px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors hover:bg-[#E5A94A]/10"><Pen size={12}/> Edit Plan</button>
                 </div>
                 <div className="grid grid-cols-4 gap-2 text-center divide-x divide-white/5">
                   <div className="px-1">
                     <Wine size={20} className="mx-auto text-[#E5A94A] mb-2 opacity-80" />
                     <p className="font-bold text-[13px] mb-0.5">{aiPlan.drinkPlan.length}</p>
                     <p className="text-[9px] text-white/50 flex items-center justify-center gap-1">Drinks List <Info size={8}/></p>
                   </div>
                   <div className="px-1">
                     <User size={20} className="mx-auto text-[#E5A94A] mb-2 opacity-80" />
                     <p className="font-bold text-[13px] mb-0.5">₹{Math.round(aiPlan.totalEstimatedCost / partyData.people).toLocaleString("en-IN")}</p>
                     <p className="text-[9px] text-white/50">Per Person</p>
                   </div>
                   <div className="px-1">
                     <Wallet size={20} className="mx-auto text-[#E5A94A] mb-2 opacity-80" />
                     <p className="font-bold text-[13px] mb-0.5">₹{aiPlan.totalEstimatedCost.toLocaleString("en-IN")}</p>
                     <p className="text-[9px] text-white/50">AI Est. Cost</p>
                   </div>
                   <div className="px-1">
                     <Calendar size={20} className="mx-auto text-[#E5A94A] mb-2 opacity-80" />
                     <p className="font-bold text-[13px] mb-0.5">26 May</p>
                     <p className="text-[9px] text-white/50">Dry Day Check</p>
                     <p className="text-[8px] text-green-500 font-bold mt-1">No Alert</p>
                   </div>
                 </div>
               </div>

               {/* What's Included */}
               <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-base">What's Included</h3>
                   <span className="text-xs text-[#E5A94A] flex items-center gap-1 cursor-pointer">View Details <ChevronRight size={14}/></span>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {(() => {
                     const total = aiPlan.budgetBreakdown.drinks + aiPlan.budgetBreakdown.food + aiPlan.budgetBreakdown.extras;
                     const drinksPct = Math.round((aiPlan.budgetBreakdown.drinks / total) * 100);
                     const foodPct = Math.round((aiPlan.budgetBreakdown.food / total) * 100);
                     const extrasPct = 100 - drinksPct - foodPct;
                     return (
                       <>
                         <div className="bg-[#1A1A1C] p-2.5 rounded-xl border border-white/5">
                           <div className="flex items-center gap-1.5 mb-3"><Wine size={12} className="text-[#E5A94A] opacity-80" /><span className="text-[9px] text-white/60">Drinks</span></div>
                           <div className="flex items-end justify-between mb-2">
                             <span className="font-bold text-xs">{drinksPct}%</span>
                             <span className="text-[9px] text-white/40">₹{(aiPlan.budgetBreakdown.drinks || 0).toLocaleString("en-IN")}</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#E5A94A]" style={{width: `${drinksPct}%`}}></div></div>
                         </div>
                         <div className="bg-[#1A1A1C] p-2.5 rounded-xl border border-white/5">
                           <div className="flex items-center gap-1.5 mb-3"><Sandwich size={12} className="text-[#E5A94A] opacity-80" /><span className="text-[8px] text-white/60 whitespace-nowrap">Food & Snacks</span></div>
                           <div className="flex items-end justify-between mb-2">
                             <span className="font-bold text-xs">{foodPct}%</span>
                             <span className="text-[9px] text-white/40">₹{(aiPlan.budgetBreakdown.food || 0).toLocaleString("en-IN")}</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#E5A94A]" style={{width: `${foodPct}%`}}></div></div>
                         </div>
                         <div className="bg-[#1A1A1C] p-2.5 rounded-xl border border-white/5">
                           <div className="flex items-center gap-1.5 mb-3"><Gift size={12} className="text-[#E5A94A] opacity-80" /><span className="text-[9px] text-white/60">Others</span></div>
                           <div className="flex items-end justify-between mb-2">
                             <span className="font-bold text-xs">{extrasPct}%</span>
                             <span className="text-[9px] text-white/40">₹{(aiPlan.budgetBreakdown.extras || 0).toLocaleString("en-IN")}</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#E5A94A]" style={{width: `${extrasPct}%`}}></div></div>
                         </div>
                       </>
                     );
                   })()}
                 </div>
               </div>

               {/* Drinks Breakdown */}
               <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                 <div className="flex justify-between items-end mb-4">
                   <h3 className="font-bold text-base">Drinks Breakdown</h3>
                   <span className="text-[10px] text-white/50">{aiPlan.drinkPlan.length} Drink Types Suggested</span>
                 </div>
                 
                 <div className="space-y-4 mb-4">
                   {aiPlan.drinkPlan.map((d: any, i: number) => (
                     <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3 w-1/3">
                         <Wine size={14} className="text-[#E5A94A] opacity-80" />
                         <span className="text-xs text-white/80">{d.brand || d.name}</span>
                       </div>
                       <div className="w-1/3 text-center text-xs text-white/60">
                         {d.quantity}
                       </div>
                       <div className="w-1/3 text-right text-xs text-white">
                         ₹{d.estimatedCost.toLocaleString("en-IN")}
                       </div>
                     </div>
                   ))}
                   {aiPlan.extras.map((e: any, i: number) => (
                     <div key={`extra-${i}`} className="flex items-center justify-between">
                       <div className="flex items-center gap-3 w-1/3">
                         <GlassWater size={14} className="text-[#E5A94A] opacity-80" />
                         <span className="text-xs text-white/80 truncate">{e.name}</span>
                       </div>
                       <div className="w-1/3 text-center text-xs text-white/60">{e.quantity}</div>
                       <div className="w-1/3 text-right text-xs text-white">₹{e.estimatedCost.toLocaleString("en-IN")}</div>
                     </div>
                   ))}
                 </div>
                 
                 <div className="border-t border-white/5 pt-4 flex items-center justify-between font-bold">
                   <span className="text-sm">Total Estimate</span>
                   <span className="text-sm text-[#E5A94A]">₹{aiPlan.totalEstimatedCost.toLocaleString("en-IN")}</span>
                 </div>
               </div>

               {/* AI Highlights */}
               <div className="bg-[#141416] rounded-2xl p-5 border border-white/5">
                 <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Sparkles size={16} className="text-[#E5A94A]" /> Safety & Highlights</h3>
                 <div className="space-y-4">
                   {aiPlan.safetyTips.map((tip: string, idx: number) => (
                     <div key={idx} className="flex gap-3 items-start">
                       <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">🛡️</div>
                       <div><p className="text-xs text-white/70 mt-1">{tip}</p></div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* AI Cocktail Suggestions link */}
               {aiPlan.cocktails && aiPlan.cocktails.length > 0 && (
                 <button onClick={() => setStep(6)} className="w-full text-left bg-gradient-to-r from-[#1A0A04] to-[#0B0B0C] border border-[#E5A94A]/20 rounded-2xl p-5 flex items-center gap-4 group transition-all hover:border-[#E5A94A]/40">
                   <div className="text-[#E5A94A]"><Sparkles size={24}/></div>
                   <div className="flex-1">
                     <h3 className="font-bold text-[13px] text-[#E5A94A] group-hover:text-[#E5A94A] transition-colors">AI Cocktail Suggestions</h3>
                     <p className="text-[11px] text-white/50 mt-1">{aiPlan.cocktails.length} drinks recommended using your planned bottles</p>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#E5A94A]/10 group-hover:text-[#E5A94A] group-hover:border-[#E5A94A]/40 transition-all">
                     <ArrowRight size={14} />
                   </div>
                 </button>
               )}
            </motion.div>
          )}

          {/* STEP 6: AI COCKTAILS */}
          {step === 6 && aiPlan?.cocktails && (
            <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-12">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="font-bold text-lg text-white">Curated Cocktails ✨</h2>
                  <p className="text-xs text-white/50">Made using your planned bottles</p>
                </div>
                <div className="flex items-center gap-1 border border-[#E5A94A]/30 text-[#E5A94A] text-[10px] px-2 py-1 rounded-lg bg-[#E5A94A]/10">
                  <span className="font-bold bg-[#E5A94A] text-black w-4 h-4 rounded-full flex items-center justify-center">{aiPlan.cocktails.length}</span> Picks
                </div>
              </div>

              <div className="space-y-3">
                {aiPlan.cocktails.map((c: any, idx: number) => (
                  <div key={idx} className="bg-[#141416] border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E5A94A]"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm text-[#E5A94A]">{c.name}</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#E5A94A]/30 text-[#E5A94A] bg-[#E5A94A]/10 uppercase tracking-wider">{c.base}</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border border-[#E5A94A]/30 bg-[#E5A94A]/10 rounded-2xl p-4 flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥂</span>
                  <div>
                    <p className="font-bold text-[#E5A94A] text-sm">Perfect Mix</p>
                    <p className="text-xs text-white/60">No extra shopping required</p>
                  </div>
                </div>
                <button onClick={() => setStep(5)} className="text-[#E5A94A] text-xs font-bold border border-[#E5A94A]/30 px-3 py-1.5 rounded-lg flex items-center gap-1">Back to Plan <ChevronRight size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action button area */}
        <div className="fixed bottom-[85px] left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-40">
          {step === 5 ? (
             <div className="space-y-3">
               <div className="bg-[#141416] border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 text-[10px] text-white/50 shadow-md">
                 <Shield size={12} className="text-[#E5A94A]" /> Drink Responsibly. Have fun & stay safe!
               </div>
               <div className="flex gap-3">
                 <button className="flex-1 py-3.5 rounded-xl border border-[#E5A94A]/30 text-[#E5A94A] font-bold text-sm flex justify-center items-center gap-2 bg-[#1A1A1C] transition-colors hover:bg-[#E5A94A]/10">
                   <Share size={16} /> Share Plan
                 </button>
                 <button className="flex-1 py-3.5 rounded-xl bg-[#E5A94A] text-black font-bold text-sm flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(229,169,74,0.15)] transition-all hover:opacity-90">
                   <Download size={16} /> Download Checklist
                 </button>
               </div>
             </div>
          ) : (
            <>
              {step === 1 && (
                <p className="text-center text-[10px] text-white/40 mb-3 flex items-center justify-center gap-1">
                  <Shield size={12} className="text-[#4F9CF9] fill-[#4F9CF9]/20" /> We always recommend responsible drinking. Have fun & stay safe!
                </p>
              )}
              <button
                disabled={isNextDisabled() || loading}
                onClick={step === 4 ? generatePlan : step === 6 ? () => alert("Done") : handleNext}
                className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all ${(isNextDisabled() || loading) ? 'bg-white/20 text-white/40' : 'bg-[#E5A94A] shadow-[0_0_20px_rgba(229,169,74,0.15)]'}`}
              >
                {loading ? "Generating Plan..." : step === 4 ? "Continue to Review" : step === 6 ? "Return to Dashboard" : "Continue"}
                {step < 5 && !loading && <ChevronRight size={18} strokeWidth={3} className="ml-1" />}
              </button>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}