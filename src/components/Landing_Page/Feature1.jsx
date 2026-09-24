import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, 
  TrendingUp, 
  Sun 
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Section blending & background styles                              */
/* ------------------------------------------------------------------ */
const BLEND_TOP = '#fbfefc';
const BLEND_BOTTOM = '#fbfefc';
const BLEND_H = 'clamp(150px, 28vh, 280px)';

const BG_GLOW_TEXT = 'radial-gradient(55% 50% at 14% 38%, rgba(250,253,251,0.8) 0%, rgba(250,253,251,0) 70%)';
const BG_GLOW_TOP = 'radial-gradient(45% 40% at 68% 12%, rgba(230,249,236,0.8) 0%, rgba(230,249,236,0) 70%)';
const BG_GLOW_CARD = 'radial-gradient(50% 55% at 82% 62%, rgba(185,230,200,0.25) 0%, rgba(185,230,200,0) 72%)';
const BG_BASE = 'linear-gradient(160deg, #e4f7ea 0%, #c8f0d4 50%, #d5f4df 100%)';

const FADE_FROM_TOP = 'linear-gradient(to bottom, transparent 0%, #000 75%)';
const FADE_FROM_BOTTOM = 'linear-gradient(to top, transparent 0%, #000 75%)';

export default function Feature1() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Overall, 1-4 = Segments
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { 
      id: 'energy', 
      label: 'Energy', 
      value: 25, 
      percentage: '38%', 
      desc: 'Sustained vitality'
    },
    { 
      id: 'effectiveness', 
      label: 'Effectiveness', 
      value: 25, 
      percentage: '76%', 
      desc: 'Output vs Input'
    },
    { 
      id: 'focus', 
      label: 'Focus', 
      value: 25, 
      percentage: '68%', 
      desc: 'Deep work ratio'
    },
    { 
      id: 'flow', 
      label: 'Daily Flow', 
      value: 25, 
      percentage: '82%', 
      desc: 'Harmonic rhythm'
    }
  ];

  // Smooth automatic cycling through segments
  useEffect(() => {
    if (!isVisible || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (stats.length + 1));
    }, 3200);
    return () => clearInterval(interval);
  }, [isVisible, isPaused, stats.length]);

  const defaultSummary = {
    id: 'total',
    label: 'Overall Balance',
    percentage: '82%',
    desc: 'Harmonic rhythm'
  };

  const currentStat = activeIndex === 0 ? defaultSummary : stats[activeIndex - 1];

  // Donut geometry specs
  const RADIUS = 64;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const CENTER = 100;

  let accumulatedLength = 0;
  const segments = stats.map((stat, idx) => {
    const length = (CIRCUMFERENCE * stat.value) / 100;
    const dashoffset = CIRCUMFERENCE - accumulatedLength;
    
    // Position labels right on top of each colored segment arc
    const midLength = accumulatedLength + length / 2;
    const angleRad = (midLength / CIRCUMFERENCE) * 2 * Math.PI - Math.PI / 2;
    const labelRadius = RADIUS; 
    const x = CENTER + labelRadius * Math.cos(angleRad);
    const y = CENTER + labelRadius * Math.sin(angleRad);

    accumulatedLength += length;

    return {
      ...stat,
      index: idx + 1,
      strokeDasharray: `${length} ${CIRCUMFERENCE - length}`,
      strokeDashoffset: isVisible ? -dashoffset : CIRCUMFERENCE,
      labelCoords: { x, y }
    };
  });

  const features = [
    { label: 'Understand Your Patterns', icon: Leaf },
    { label: 'Build Better Habits', icon: TrendingUp },
    { label: 'Feel More In Control', icon: Sun }
  ];

  const blendedBackground = {
    background: [
      `linear-gradient(to bottom, ${BLEND_TOP} 0%, rgba(255,255,255,0) ${BLEND_H}, rgba(255,255,255,0) calc(100% - ${BLEND_H}), ${BLEND_BOTTOM} 100%)`,
      BG_GLOW_TEXT,
      BG_GLOW_TOP,
      BG_GLOW_CARD,
      BG_BASE
    ].join(', ')
  };

  return (
    <section 
      ref={sectionRef}
      style={blendedBackground}
      className="relative w-full min-h-screen flex items-center justify-center py-16 sm:py-20 px-4 sm:px-8 font-sans overflow-hidden"
    >
      {/* Top Wavy Divider */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0"
        style={{ WebkitMaskImage: FADE_FROM_TOP, maskImage: FADE_FROM_TOP }}
      >
        <svg className="relative block w-full h-14 sm:h-20 text-[#b5e4c2]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className={`w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
      }`}>
        
        {/* Left Section: Copy & Intro */}
        <div className="lg:col-span-6 flex flex-col space-y-5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1b3a2b] leading-[1.12] tracking-tight">
            Improve Focus <br /> with <span className="text-[#2d6a4f]">Effectiveness.</span>
          </h1>

          <p className="text-[#2f5142] text-sm sm:text-base leading-relaxed max-w-lg">
            Manovedh helps you identify daily patterns and take meaningful action through small, practical steps. No pressure. No judgment. Just clarity.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 border border-[#d2eada] shadow-xs text-xs sm:text-sm font-medium text-[#2d6a4f]">
                  <div className="w-7 h-7 rounded-lg bg-[#dcf2e3] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#2d6a4f]" />
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex items-center gap-3">
            <div className="h-px bg-[#8bc49f] flex-1 max-w-[70px]" />
            <span className="text-xs italic font-serif text-[#2f5142]">A Calmer You</span>
            <div className="h-px bg-[#8bc49f] flex-1 max-w-[70px]" />
          </div>
        </div>

        {/* Right Section: 3D Card with Smooth Zoom-Out & Controlled Ring Spin */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center perspective-[1200px]">
          <div 
            className={`relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-full p-3 border border-white shadow-[0_30px_70px_rgba(0,0,0,0.15),inset_0_2px_8px_rgba(255,255,255,0.9)] cursor-pointer select-none transition-all duration-1200 ease-out transform ${
              isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg) rotateY(-8deg)' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* SVG Gradient Definitions */}
            <svg className="absolute w-0 h-0 overflow-hidden">
              <defs>
                <linearGradient id="grad-energy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
                <linearGradient id="grad-effectiveness" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="grad-focus" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </linearGradient>
                <linearGradient id="grad-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Main Donut Wheel (Smooth, slower, elegant spin into place) */}
            <svg 
              className={`w-full h-full transform -rotate-90 overflow-visible drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] transition-transform duration-[2400ms] cubic-bezier(0.25, 1, 0.5, 1) ${
                isVisible ? 'rotate-[360deg]' : 'rotate-0'
              }`}
              viewBox="0 0 200 200"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="38"
                fill="none"
              />

              {segments.map((seg) => {
                const isCurrentActive = activeIndex === seg.index;
                const gradientId = `grad-${seg.id}`;
                
                return (
                  <circle
                    key={seg.id}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={isCurrentActive ? "42" : "38"}
                    fill="none"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    onClick={() => setActiveIndex(seg.index)}
                    style={{
                      transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 0.35s ease, filter 0.35s ease',
                      filter: isCurrentActive ? 'drop-shadow(0px 6px 12px rgba(0,0,0,0.22))' : 'none'
                    }}
                    className="cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Text and Percentages on Segments (Icons removed) */}
            <div className="absolute inset-0 pointer-events-none">
              {segments.map((seg) => {
                const isCurrentActive = activeIndex === seg.index;
                
                const leftPercent = (seg.labelCoords.x / 200) * 100;
                const topPercent = (seg.labelCoords.y / 200) * 100;

                return (
                  <div
                    key={seg.id}
                    onClick={() => setActiveIndex(seg.index)}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-all duration-400 ${
                      isCurrentActive ? 'scale-115 z-10' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <span className="text-white text-[12px] font-black tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {seg.percentage}
                    </span>
                    <span className="text-white/95 text-[9px] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
                      {seg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Summary Content (Title and Percentage) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <span className="text-xs font-bold text-[#2d6a4f] transition-all duration-300">
                {currentStat.label}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#1b3a2b] tracking-tight leading-tight mt-0.5 transition-all duration-300">
                {currentStat.percentage}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Wavy Divider */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0"
        style={{ WebkitMaskImage: FADE_FROM_BOTTOM, maskImage: FADE_FROM_BOTTOM }}
      >
        <svg className="relative block w-full h-14 sm:h-20 text-[#b5e4c2]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}