'use client';
import HeroAsciiOne from "@/components/ui/hero-ascii-one";
import { useState, useEffect } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

function AnimatedAIChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'user', text: 'Explain the concept of manufactured consent.' },
  ]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Manufactured consent is the practice of shaping public opinion through media control, shifting narratives to align with elite interests. It relies on filtration, framing, and fear.' 
      }]);
      setIsTyping(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto border border-white/20 bg-black p-4 md:p-6 font-mono text-sm relative">
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/30" />
      
      <div className="flex flex-col space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3 items-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-8 h-8 border border-white/40 flex items-center justify-center flex-shrink-0 text-[10px]">
                AI
              </div>
            )}
            <div className={`px-4 py-3 max-w-[85%] ${msg.role === 'user' ? 'bg-white text-black' : 'bg-black border border-white/20 text-white'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 border border-white/40 flex items-center justify-center flex-shrink-0 text-[10px]">
              AI
            </div>
            <div className="px-4 py-3 bg-black border border-white/20 text-white flex items-center">
              PROCESSING<span className="cursor-blink ml-1">█</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-white/20 pt-4 mt-4 flex items-center justify-between opacity-50">
        <span>INPUT_LOCKED</span>
        <span className="text-[10px]">DEMO_MODE</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white font-mono selection:bg-white selection:text-black">
      {/* SECTION 1 — HERO */}
      <section>
        <HeroAsciiOne />
      </section>

      {/* SECTION 2 — MANIFESTO */}
      <section className="py-24 border-t border-white/10 relative px-6 bg-white/5">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/30" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <span className="text-[10px] font-mono">01 //</span>
              <div className="w-12 h-px bg-white"/>
              <span className="text-[10px] font-mono">MISSION STATEMENT</span>
            </div>
            <h2 className="font-mono text-3xl font-bold text-white tracking-widest mb-6">BEYOND THE SURFACE WEB</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-mono">
              Mainstream models are neutered by layers of safety alignment, moral grandstanding, and corporate compliance filters. They tell you what is safe to hear, not what is true.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-mono">
              TRUTH SEEKER AI strips away the corporate guardrails. Engineered on top of unrestricted Llama-3 architecture, it provides raw, unapologetic, and hyper-logical breakdowns of the systems that govern our reality.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border-l border-white/30 pl-4">
                <div className="text-white text-2xl font-bold mb-1">uncensored</div>
                <div className="text-white/40 text-[10px]">ANALYSIS PROTOCOL</div>
              </div>
              <div className="border-l border-white/30 pl-4">
                <div className="text-white text-2xl font-bold mb-1">0_logs</div>
                <div className="text-white/40 text-[10px]">TELEMETRY PIPELINE</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
             <div className="aspect-square border border-white/20 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black" />
                <div className="absolute top-4 left-4 text-[10px] text-white/30">SYSTEM.ARCHITECTURE</div>
                <div className="absolute bottom-4 right-4 text-[10px] text-white/30">V.1.0.0_STABLE</div>
                
                {/* Decorative wireframe globe/eye */}
                <div className="relative w-48 h-48 border rounded-full border-white/20 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                  <div className="absolute inset-0 border border-white/20 rounded-full scale-110 -skew-x-12" />
                  <div className="absolute inset-0 border border-white/20 rounded-full scale-90 skew-y-12" />
                  <div className="w-2 h-2 bg-white rounded-full absolute top-0 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — DEMO */}
      <section id="demo" className="py-16 md:py-24 border-t border-white/10 relative px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-white/30" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-60">
             <div className="w-8 md:w-12 h-px bg-white"/>
             <span className="text-[10px] font-mono whitespace-nowrap">02 // LIVE FEED</span>
             <div className="w-8 md:w-12 h-px bg-white"/>
          </div>
          <h2 className="font-mono text-2xl md:text-4xl font-bold text-white tracking-widest mb-2">QUERY THE SYSTEM</h2>
          <p className="text-white/50 text-[10px] md:text-xs tracking-widest mb-8 md:mb-12">LIVE DEMONSTRATION — INTELLIGENCE STREAMING</p>
          <div className="max-w-full overflow-hidden">
            <AnimatedAIChat />
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section className="py-16 md:py-24 border-t border-white/10 relative px-4 md:px-6">
        <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-white/30" />
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4 opacity-60 justify-center">
             <span className="text-[10px] font-mono">03 //</span>
             <div className="w-8 md:w-12 h-px bg-white"/>
             <span className="text-[10px] font-mono">CAPABILITIES</span>
          </div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-white tracking-widest mb-8 md:mb-12 text-center">INTELLIGENCE MODULES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-black border border-white/20 p-6 md:p-8 relative group hover:border-white/50 transition-colors col-span-1 md:col-span-2">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30 group-hover:border-white transition-colors" />
              <div className="text-white/40 text-[10px] mb-4">[ MODULE.ALPHA ]</div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 tracking-wider">DARK PSYCHOLOGY</h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">Reverse-engineer manipulation tactics, influence frameworks, and the science of mass persuasion used by media and state actors.</p>
            </div>
            
            <div className="bg-black border border-white/20 p-6 md:p-8 relative group hover:border-white/50 transition-colors col-span-1 md:col-span-2">
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30 group-hover:border-white transition-colors" />
              <div className="text-white/40 text-[10px] mb-4">[ MODULE.BETA ]</div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 tracking-wider">SUPPRESSED SYSTEMS</h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">Deep structural analysis into financial warfare, suppressed technologies, and modern geopolitical control grids.</p>
            </div>

            <div className="bg-black border border-white/20 p-6 md:p-8 relative group hover:border-white/50 transition-colors col-span-1 md:col-span-2 lg:col-span-1">
              <div className="text-white/40 text-[10px] mb-4">[ 01 ]</div>
              <h3 className="text-base md:text-lg font-bold mb-2 tracking-wider">ENCRYPTED MEMORY</h3>
              <p className="text-white/60 text-[10px] md:text-xs">Supabase RLS secures all session logs permanently.</p>
            </div>

            <div className="bg-black border border-white/20 p-6 md:p-8 relative group hover:border-white/50 transition-colors col-span-1 md:col-span-2 lg:col-span-1">
              <div className="text-white/40 text-[10px] mb-4">[ 02 ]</div>
              <h3 className="text-base md:text-lg font-bold mb-2 tracking-wider">LLAMA-3.3 70B</h3>
              <p className="text-white/60 text-[10px] md:text-xs">Powered by the largest open-weights model for hyper-accurate logic.</p>
            </div>
            
            <div className="bg-black border border-white/20 p-6 md:p-8 relative group hover:border-white/50 transition-colors col-span-1 md:col-span-4 lg:col-span-2 flex items-center justify-between overflow-hidden">
               <div className="relative z-10 w-full">
                  <div className="text-white/40 text-[10px] mb-4 flex justify-between">
                     <span>[ SYSTEM.PING ]</span>
                     <span className="animate-pulse">LATENCY: 12ms</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 tracking-wider">GROQ LPU STREAMING</h3>
                  <div className="w-full bg-white/10 h-1 mt-4 relative">
                     <div className="absolute top-0 left-0 h-full bg-white animate-[pulse_2s_ease-in-out_infinite]" style={{width: '75%'}} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section className="py-20 md:py-32 text-center border-t border-white/10 relative px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black" />
        <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-white/30 relative z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-white/30 relative z-10" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
           <h2 className="font-mono text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-widest break-words">INITIATE ACCESS</h2>
           <p className="font-mono text-white/50 text-[10px] md:text-sm mb-10 md:mb-12">The system is ready. Awaiting your credentials.</p>
           
           <Link href="/auth" className="inline-block border border-white bg-white text-black hover:bg-black hover:text-white font-mono px-6 md:px-12 py-3 md:py-4 tracking-widest transition-all font-bold relative group whitespace-nowrap text-xs md:text-base">
             <span className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-all group-hover:-top-2 group-hover:-left-2 md:group-hover:-top-3 md:group-hover:-left-3" />
             <span className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-all group-hover:-bottom-2 group-hover:-right-2 md:group-hover:-bottom-3 md:group-hover:-right-3" />
             BEGIN SECURE SESSION →
           </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/20 py-4 px-6 flex justify-between items-center text-[10px] font-mono text-white/50">
        <div className="flex gap-4">
          <span>SYSTEM.ACTIVE</span>
          <span>V1.0.0</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </footer>
    </div>
  );
}
