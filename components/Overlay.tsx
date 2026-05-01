import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { IDENTITY } from '../data/config';

export const Overlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header stagger reveal
    tl.from(".header-text", {
      y: -20,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      delay: 0.5
    });

    // Reticle expansion
    tl.from(".reticle", {
      scale: 0.8,
      opacity: 0,
      duration: 2,
      ease: "expo.out"
    }, "-=1.0");

    // Philosophy text typewriter-ish effect (via clip-path or opacity stagger)
    tl.from(".philosophy-line", {
      x: -10,
      opacity: 0,
      duration: 1,
      stagger: 0.1
    }, "-=1.5");
    
    // Nav hint fade in
    tl.from(".nav-hint", {
      opacity: 0,
      duration: 2
    }, "-=0.5");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4 md:p-12 mix-blend-difference">
      
      {/* Top Left: Identity */}
      <header className="flex flex-col gap-2">
        <h1 className="header-text font-syncopate text-xl sm:text-2xl md:text-4xl font-bold tracking-tighter text-[#e2e8f0] drop-shadow-[0_0_10px_rgba(226,232,240,0.4)] opacity-100">
          {IDENTITY.name}
        </h1>
        <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px] md:text-xs tracking-[0.2em] text-[#00f0ff] font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          {IDENTITY.role.map((role) => (
            <span key={role} className="header-text">[{role}]</span>
          ))}
        </div>
      </header>

      {/* Center: Reticle / Focus indicator (Subtle) */}
      <div className="reticle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border border-white/5 rounded-full opacity-20 pointer-events-none" />

      {/* Bottom Left: Philosophy */}
      <div className="hidden md:flex flex-col gap-1 text-xs text-[#94a3b8] font-mono tracking-widest max-w-md">
        <span className="philosophy-line text-[#00f0ff]/70 mb-2">/// DIRECTIVE</span>
        <p className="philosophy-line text-[#e2e8f0]">"{IDENTITY.philosophy}"</p>
      </div>

      {/* Bottom Right: Navigation hint */}
      <div className="nav-hint absolute bottom-6 right-4 md:bottom-12 md:right-12 text-right">
        <div className="text-[10px] tracking-[0.3em] text-[#00f0ff] animate-pulse drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]">
          SCROLL TO TRAVERSE FIELD
        </div>
        <div className="h-16 w-px bg-gradient-to-b from-transparent via-[#00f0ff]/50 to-transparent ml-auto mr-4 mt-4" />
      </div>

      {/* Background Vignette for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
};