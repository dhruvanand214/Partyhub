"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, Menu, MapPin, Calendar as CalendarIcon } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useEffect, useState } from "react";

export default function Home() {
  const [dryDay, setDryDay] = useState<{ date: string, name: string, location: string } | null>(null);

  useEffect(() => {
    fetch('/api/dry-days')
      .then(res => res.json())
      .then(data => setDryDay(data))
      .catch(err => console.error("Failed to fetch dry day:", err));
  }, []);

  // Format date to "26th May" format
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 ? 0 : day % 10) - (day % 100 - day % 10 === 10 ? day % 10 : 0)] || "th";
    return `${day}${suffix} ${month}`;
  };
  return (
    <main className="min-h-screen pb-32 bg-[#0B0B0C] text-white font-sans overflow-x-hidden relative selection:bg-[#E5A94A]/30">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E5A94A]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-[#E5A94A]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="px-5 pt-12">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Dusk Till Dawn" className="h-10 object-contain" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="text-[#E5A94A] font-serif font-bold text-xl tracking-wider">DUSK TILL DAWN</div>';
            }} />
          </div>
          <button className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            <Menu size={20} className="text-[#E5A94A]" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="mb-10 relative">
          <div className="w-[60%]">
            <h1 className="text-4xl font-serif font-bold leading-[1.1] mb-4">
              Start the <span className="text-[#E5A94A]">Party.</span><br/>
              We've Got the <span className="text-[#E5A94A]">Plan.</span>
            </h1>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">
              Your intelligent nightlife companion.<br/>
              Plan better. Drink smarter. Recover faster.
            </p>
          </div>
          
          {/* Whiskey Glass floating image on the right */}
          <div className="absolute top-0 right-[-20px] w-[180px] h-[180px] pointer-events-none opacity-80 mix-blend-screen">
            <img src="https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-full filter contrast-125 sepia-[.3]" style={{ maskImage: 'radial-gradient(black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(black 40%, transparent 70%)' }} />
          </div>

          <div className="space-y-3 relative z-10">
            <Link href="/mode" className="w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-black text-sm" style={{ background: "linear-gradient(90deg, #E5A94A 0%, #C68A2B 100%)" }}>
              Get Started <ArrowRight size={18} />
            </Link>
            <button className="w-full h-14 rounded-xl border border-[#E5A94A]/30 flex items-center justify-center gap-2 font-semibold text-[#E5A94A] text-sm bg-[#E5A94A]/5">
              <Play size={16} fill="currentColor" /> See How It Works
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-[#141416] rounded-2xl border border-white/5 flex items-center justify-between p-5 mb-12">
          <div className="text-center flex-1 border-r border-white/5">
            <div className="flex items-center justify-center gap-1 mb-1 text-[#E5A94A]">
              <span className="text-xl">🌟</span>
            </div>
            <p className="font-bold text-base text-white">10K+</p>
            <p className="text-[10px] text-white/50">Parties Planned</p>
          </div>
          <div className="text-center flex-1 border-r border-white/5">
            <div className="flex items-center justify-center gap-1 mb-1 text-[#E5A94A]">
              <span className="text-xl">👥</span>
            </div>
            <p className="font-bold text-base text-white">25K+</p>
            <p className="text-[10px] text-white/50">Happy Users</p>
          </div>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1 mb-1 text-[#E5A94A]">
              <MapPin size={18} />
            </div>
            <p className="font-bold text-base text-white">50+</p>
            <p className="text-[10px] text-white/50">Cities Covered</p>
          </div>
        </div>

        {/* Modes Section */}
        <div className="mb-10 text-center">
          <p className="text-[#E5A94A] text-[9px] font-bold tracking-[0.2em] uppercase mb-2">Three Modes. Endless Nights.</p>
          <h2 className="text-2xl font-serif font-bold mb-6">Every Night, Covered.</h2>

          <div className="space-y-4 text-left">
            {/* Party Planner Card */}
            <Link href="/party-planner" className="block bg-[#141416] border border-white/5 rounded-3xl p-4 flex items-center relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-1/2">
                 <img src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
              </div>
              <div className="w-14 h-14 rounded-full bg-[#E5A94A]/10 border border-[#E5A94A]/20 flex items-center justify-center text-[#E5A94A] text-2xl shrink-0 mr-4 relative z-10">
                🥂
              </div>
              <div className="flex-1 relative z-10 pr-10">
                <h3 className="font-bold text-sm text-white mb-1">Party Planner</h3>
                <p className="text-[10px] text-white/50 leading-relaxed max-w-[140px]">Plan group parties in minutes. Get quantities, budget split, mixers, snacks & more.</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 absolute right-4 z-10 bg-black/40 backdrop-blur-sm">
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Solo Mode Card */}
            <Link href="/solo-mode" className="block bg-[#141416] border border-white/5 rounded-3xl p-4 flex items-center relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-1/2">
                 <img src="https://images.unsplash.com/photo-1542282811-943ef1a6777f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5A94A] text-2xl shrink-0 mr-4 relative z-10">
                🥃
              </div>
              <div className="flex-1 relative z-10 pr-10">
                <h3 className="font-bold text-sm text-white mb-1">Solo Mode</h3>
                <p className="text-[10px] text-white/50 leading-relaxed max-w-[140px]">Personalized drink suggestions based on your mood and vibe.</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 absolute right-4 z-10 bg-black/40 backdrop-blur-sm">
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Hangover Recovery Card */}
            <Link href="/hangover-recovery" className="block bg-[#141416] border border-white/5 rounded-3xl p-4 flex items-center relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-1/2">
                 <img src="https://images.unsplash.com/photo-1528654486510-3023e3eab3de?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} />
              </div>
              <div className="w-14 h-14 rounded-full bg-[#5A0F2E]/20 border border-[#5A0F2E]/40 flex items-center justify-center text-2xl shrink-0 mr-4 relative z-10">
                💊
              </div>
              <div className="flex-1 relative z-10 pr-10">
                <h3 className="font-bold text-sm text-white mb-1">Hangover Recovery</h3>
                <p className="text-[10px] text-white/50 leading-relaxed max-w-[140px]">Smart recovery tips, hydration plans and remedies to get you back on track.</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 absolute right-4 z-10 bg-black/40 backdrop-blur-sm">
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        {/* Dry Day Alert */}
        {dryDay && (
          <div className="bg-gradient-to-r from-[#2A0E13] to-[#141416] border border-[#5A0F2E]/30 rounded-2xl p-4 flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="text-[#E5A94A] opacity-80"><CalendarIcon size={24} /></div>
              <div>
                <p className="text-xs font-bold text-white">Dry Day Alert: {dryDay.name}</p>
                <p className="text-[10px] text-white/50">{dryDay.location} – {formatDate(dryDay.date)}</p>
              </div>
            </div>
            <button className="text-[#E5A94A] text-[10px] font-bold flex items-center gap-1">
              View Details <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* Footer Graphic area */}
        <div className="relative pt-6 pb-12 overflow-hidden rounded-3xl border border-white/5 bg-[#0B0B0C]">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(198,138,43,0.1),transparent_50%)]" />
           <div className="relative z-10 px-6">
             <p className="text-[#E5A94A] text-[9px] font-bold tracking-[0.2em] uppercase mb-2">Smart Plans. Zero Stress.</p>
             <h2 className="text-2xl font-serif font-bold leading-tight w-[60%]">
               Intelligent Plans for Unforgettable Nights.
             </h2>
           </div>
           
           <div className="absolute right-[-20px] bottom-[-20px] opacity-80 w-[160px]">
             {/* Neon Cocktail Graphic Representation */}
             <svg viewBox="0 0 100 100" className="w-full h-full text-[#E5A94A] drop-shadow-[0_0_15px_rgba(229,169,74,0.6)]">
               <path d="M20,20 L80,20 L50,60 L50,90 M35,90 L65,90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <circle cx="70" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
               <path d="M70,10 L70,30 M60,20 L80,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
             </svg>
           </div>
        </div>

      </div>

      <BottomNav />
    </main>
  );
}