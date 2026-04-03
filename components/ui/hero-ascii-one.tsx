/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect } from 'react';

export default function HeroAsciiOne() {
  useEffect(() => {
    // Inject global CSS to hide watermark elements by all known patterns
    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] a[href*="unicorn"],
      [data-us-project] a[href*="unicornstudio"],
      [data-us-project] div[style*="unicorn"],
      [data-us-project] img[alt*="unicorn" i],
      [data-us-project] img[src*="unicorn" i],
      a[href*="unicornstudio"],
      a[href*="unicorn.studio"],
      img[src*="unicorn.studio"],
      img[src*="made_in_us"],
      img[src*="free_user_logo"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        clip: rect(0,0,0,0) !important;
      }
    `;
    document.head.appendChild(style);

    // Load UnicornStudio
    const s = document.createElement('script');
    s.textContent = `!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)};(document.head||document.body).appendChild(i)}}();`;
    document.head.appendChild(s);

    // Walk through shadow DOMs and regular DOM to nuke watermark
    const walkAndNuke = (root: Document | ShadowRoot | Element) => {
      const els = root.querySelectorAll('a, div, span, p, img, svg');
      els.forEach((el: any) => {
        const text = (el.textContent || '').toLowerCase();
        const href = (el.href || el.src || '').toLowerCase();
        const style = (el.getAttribute?.('style') || '').toLowerCase();
        if (
          text.includes('unicorn') || text.includes('made with') ||
          href.includes('unicorn') || href.includes('made_in_us') || href.includes('free_user') ||
          style.includes('unicorn')
        ) {
          el.style.cssText = 'display:none!important;width:0!important;height:0!important;overflow:hidden!important;position:absolute!important;clip:rect(0,0,0,0)!important;';
          try { el.remove(); } catch {}
        }
        // Walk into shadow roots
        if (el.shadowRoot) {
          walkAndNuke(el.shadowRoot);
        }
      });
    };

    const nuke = () => {
      walkAndNuke(document);
      // Also walk all shadow roots in the project container
      document.querySelectorAll('[data-us-project] *').forEach((el: any) => {
        if (el.shadowRoot) walkAndNuke(el.shadowRoot);
      });
    };

    // MutationObserver to catch watermark as soon as it's injected
    const observer = new MutationObserver(() => nuke());
    observer.observe(document.body, { childList: true, subtree: true });

    nuke();
    const iv = setInterval(nuke, 100);
    [300, 600, 1000, 2000, 3000, 5000].forEach(t => setTimeout(nuke, t));

    return () => {
      clearInterval(iv);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none lg:pointer-events-auto">
        <div data-us-project="OMzqyUv6M3kSnv0JeAtC" style={{ width: '100%', height: '100%', minHeight: '100vh' }} />
        {/* Solid black overlay to cover UnicornStudio watermark at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '80px' }}>
          <div className="w-full h-full bg-black" />
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 z-20"/>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/30 z-20"/>
      <div className="absolute left-0 w-12 h-12 border-b-2 border-l-2 border-white/30 z-20" style={{ bottom: '5vh' }}/>
      <div className="absolute right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 z-20" style={{ bottom: '5vh' }}/>
      
      <div className="absolute top-0 inset-x-0 z-20 border-b border-white/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-white text-xl font-bold tracking-widest italic -skew-x-12 inline-block">TRUTH SEEKER</span>
          <div className="h-4 w-px bg-white/40"/>
          <span className="text-white/60 text-[10px] font-mono">EST. 2026</span>
        </div>
        <span className="hidden lg:block text-[10px] font-mono text-white/60">INTEL: CLASSIFIED · STATUS: ACTIVE</span>
      </div>
      
      <div className="relative z-10 flex min-h-screen items-center justify-end pt-16" style={{ marginTop: '5vh' }}>
        <div className="w-full lg:w-1/2 px-6 lg:pr-[10%]">
          <div className="max-w-lg lg:ml-auto">
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <div className="w-8 h-px bg-white"/>
              <span className="text-white text-[10px] font-mono">∞</span>
              <div className="flex-1 h-px bg-white"/>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 font-mono tracking-wider leading-tight">THE TRUTH<br/>THEY HIDE</h1>
            <div className="flex gap-1 mb-4 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full"/>
              ))}
            </div>
            <p className="text-sm text-gray-300 mb-6 font-mono opacity-80 leading-relaxed">
              Dark psychology. Conspiracy truths. Hidden power. No filters — raw intelligence on demand.
            </p>
            <div className="flex flex-col lg:flex-row gap-3">
              <a href="/auth" className="relative px-6 py-2.5 border border-white text-white font-mono text-sm hover:bg-white hover:text-black transition-all group text-center">
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                ACCESS THE TRUTH →
              </a>
              <a href="#demo" className="px-6 py-2.5 border border-white/40 text-white/70 font-mono text-sm hover:bg-white hover:text-black transition-all text-center">
                SEE DEMO
              </a>
            </div>
            <div className="flex items-center gap-2 mt-6 opacity-40">
              <span className="text-[9px] font-mono text-white">∞</span>
              <div className="flex-1 h-px bg-white"/>
              <span className="text-[9px] font-mono text-white">TRUTH.PROTOCOL.ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm px-8 py-3 flex justify-between" style={{ bottom: '5vh' }}>
        <div className="flex gap-6 text-[9px] font-mono text-white/50">
          <span>SYSTEM.ACTIVE</span>
          <span>V1.0.0</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-white/50">
          <span>◐ PROCESSING</span>
          {[0, 0.2, 0.4].map((d, i) => (
            <div key={i} className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: `${d}s` }}/>
          ))}
        </div>
      </div>
    </main>
  );
}
