import React from 'react';
import activityBg from '../../assets/activity-bg.png';
import { 
  Leaf, 
  Wind, 
  Target, 
  BookOpen, 
  Activity as ActivityIcon, 
  ArrowRight, 
  Users, 
  Pause, 
  Heart
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Section blending                                                  */
/* ------------------------------------------------------------------ */
const BLEND_TOP = '#fbfefc';
const BLEND_BOTTOM = '#fbfefc';
const BLEND_H = 'clamp(150px, 28vh, 280px)';

/* ------------------------------------------------------------------ */
/*  Background colour (Ultra light & soft green gradient)             */
/* ------------------------------------------------------------------ */
const BG_GLOW_TEXT = 'radial-gradient(55% 50% at 14% 38%, rgba(250,253,251,0.8) 0%, rgba(250,253,251,0) 70%)';
const BG_GLOW_TOP = 'radial-gradient(45% 40% at 68% 12%, rgba(230,249,236,0.8) 0%, rgba(230,249,236,0) 70%)';
const BG_GLOW_CARD = 'radial-gradient(50% 55% at 82% 62%, rgba(185,230,200,0.25) 0%, rgba(185,230,200,0) 72%)';
const BG_BASE = 'linear-gradient(160deg, #e4f7ea 0%, #c8f0d4 50%, #d5f4df 100%)';

const FADE_FROM_TOP = 'linear-gradient(to bottom, transparent 0%, #000 75%)';
const FADE_FROM_BOTTOM = 'linear-gradient(to top, transparent 0%, #000 75%)';

// 1. onOpenCommunity प्रॉप इथे स्वीकारला आहे
export default function Activity({ onOpenCommunity }) {
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
    <div
      style={blendedBackground}
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans text-stone-800"
    >
      
      {/* Top Wavy Divider */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0"
        style={{ WebkitMaskImage: FADE_FROM_TOP, maskImage: FADE_FROM_TOP }}
      >
        <svg className="relative block w-full h-16 sm:h-24 text-[#b5e4c2]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,0 L0,0 Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Bottom Wavy Divider */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-0"
        style={{ WebkitMaskImage: FADE_FROM_BOTTOM, maskImage: FADE_FROM_BOTTOM }}
      >
        <svg className="relative block w-full h-16 sm:h-24 text-[#b5e4c2]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Watermarks */}
      <div className="absolute top-10 right-6 pointer-events-none text-emerald-900/30 font-serif italic text-sm tracking-wide hidden md:block rotate-3 z-10">
        Ideas Heal Together
      </div>

      <div className="absolute bottom-10 right-12 pointer-events-none text-emerald-900/30 font-serif italic text-sm tracking-wide hidden lg:block -rotate-2 z-10">
        Small Ideas Brighter Lives
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 my-auto py-12">
        
        {/* Left Section: Text Content */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-5 animate-[fadeIn_0.8s_ease-out]">
          
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dcf2e3] border border-[#c1e6cc] text-emerald-900 text-xs font-semibold tracking-wider uppercase shadow-xs transition hover:scale-105 duration-300">
            <Users size={14} className="text-emerald-800" />
            <span>YOUR OWN ACTIVITY</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11261B] tracking-tight leading-[1.15]">
            Become a <br />
            <span className="text-[#2F6146]">Community</span> Contributor
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-emerald-950/75 max-w-lg leading-relaxed">
            Have an idea for a simple activity that could help others? Share it with the Manovedh community and see it come to life in the app.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { icon: Leaf, label: 'Breathing' },
              { icon: Wind, label: 'Grounding' },
              { icon: Target, label: 'Focus' },
              { icon: BookOpen, label: 'Journaling' },
              { icon: ActivityIcon, label: 'Movement' },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 bg-white/70 hover:bg-white text-emerald-900 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-xs cursor-pointer border border-[#d2eada] hover:-translate-y-0.5">
                  <IconComponent size={14} className="text-emerald-700" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            {/* 2. इथे onClick जोडले आहे जेणेकरून क्लिक केल्यावर फॉर्म ओपन होईल */}
            <button 
              onClick={onOpenCommunity} 
              className="group flex items-center justify-between gap-4 bg-[#133222] hover:bg-[#1b4631] text-white px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
              <span>Become a Community Contributor</span>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition">
                <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-emerald-900/75 uppercase pt-2">
            <span>Share</span>
            <span className="w-1 h-1 rounded-full bg-emerald-900/40"></span>
            <span>Inspire</span>
            <span className="w-1 h-1 rounded-full bg-emerald-900/40"></span>
            <span>Support</span>
            <span className="w-1 h-1 rounded-full bg-emerald-900/40"></span>
            <span>A Calmer You</span>
          </div>

        </div>

        {/* Right Section: Preview Card */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(31,63,44,0.08)] border border-emerald-100/80 w-full max-w-lg relative transition-all duration-500 hover:shadow-[0_25px_60px_rgba(31,63,44,0.12)] hover:-translate-y-1">
            
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#dcf2e3] flex items-center justify-center text-emerald-800">
                  <Users size={15} />
                </div>
                <span className="font-bold text-emerald-950 text-sm sm:text-base">Community Idea</span>
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3D6] text-amber-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Under Review</span>
              </div>
            </div>

            {/* Banner Illustration Box using activity-bg.png */}
            <div className="relative rounded-2xl overflow-hidden mb-4 shadow-inner bg-[#244935] h-52 sm:h-60 flex flex-col justify-end p-4 sm:p-5 group">
              
              {/* Background image reference */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={activityBg} 
                  alt="Activity Background" 
                  className="w-full h-full object-cover opacity-90 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3F2E] via-[#2D5A42] to-[#437A5D]/40"></div>
              </div>

              {/* Decorative Icon Overlay */}
              <div className="absolute top-4 left-4 z-10 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform duration-300 group-hover:rotate-12">
                <Leaf size={18} />
              </div>

              {/* Card Details */}
              <div className="relative z-10 text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-1">5-Minute Calm Reset</h3>
                <p className="text-emerald-100/90 text-xs sm:text-sm line-clamp-2 max-w-sm">
                  A simple breathing and grounding activity designed by a Manovedh user.
                </p>
              </div>

            </div>

            {/* Interactive Step Tags */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="flex items-center justify-center gap-1.5 bg-[#f0f7f2] hover:bg-[#e4f2e7] text-emerald-900 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-300 border border-emerald-100 hover:scale-105">
                <Pause size={13} className="text-emerald-700" />
                <span>1. Pause</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-[#f0f7f2] hover:bg-[#e4f2e7] text-emerald-900 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-300 border border-emerald-100 hover:scale-105">
                <Wind size={13} className="text-emerald-700" />
                <span>2. Breathe</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-[#f0f7f2] hover:bg-[#e4f2e7] text-emerald-900 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-300 border border-emerald-100 hover:scale-105">
                <Heart size={13} className="text-emerald-700" />
                <span>3. Reflect</span>
              </div>
            </div>

            {/* Text message replacing quote */}
            <div className="text-center py-1">
              <span className="text-emerald-900/70 font-medium text-xs">
                Small ideas can create a big positive impact.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}