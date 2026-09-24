import React from 'react';
import { Link } from 'react-router-dom';

// Import assets with exact folder filenames
import rightIcon from '../assets/right.png';
import brainIcon from '../assets/brain (1).png';
import smileIcon from '../assets/smile (1).png';
import sparkleIcon from '../assets/sparkle (1).png';
import heartIcon from '../assets/heart.png';
import shieldIcon from '../assets/shield.png';

const LearnMoreSection = () => {
  return (
    <section id="about" className="w-full bg-[#FAF8F5] text-[#1B3328] py-20 sm:py-28 px-4 sm:px-8 lg:px-16 relative overflow-hidden select-none">
      
      {/* 1. AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#2E5B45]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-[#A08A4A]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-28 sm:space-y-36">

        {/* 2. HERO INTRO SECTION WITH DASHBOARD DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-[#1B3328]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Built to help you understand your{' '}
              <span className="italic bg-gradient-to-r from-[#1B3328] via-[#2E5B45] to-[#735A23] bg-clip-text text-transparent">
                mind better.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#4A5850] font-normal leading-relaxed max-w-2xl">
              Manovedh combines gentle daily check-ins, intelligent habit tracking, and AI-powered reflections to empower you with personal emotional clarity and resilience.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#2E5B45] hover:bg-[#1E4334] text-white text-sm font-bold tracking-wide shadow-xl shadow-[#2E5B45]/25 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>Start Your Journey</span>
                <img src={rightIcon} alt="Arrow" className="w-4 h-4 object-contain group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>

              {/* VISIT SUPPORT BUTTON ROUTED TO /support */}
              <Link
                to="/support"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border border-[#1B3328]/15 hover:border-[#2E5B45] text-[#1B3328] text-sm font-bold tracking-wide shadow-sm hover:bg-[#F4F6F4] transition-all duration-300"
              >
                Visit Support
              </Link>
            </div>
          </div>

          {/* RIGHT UI DASHBOARD CARD PREVIEW */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#18362A] via-[#1E4334] to-[#0F261D] p-6 sm:p-8 text-white shadow-[0_25px_60px_-15px_rgba(27,51,40,0.4)] border border-white/15 overflow-hidden group">
              
              {/* Card Ambient Glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FFE59E]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                    <img src={brainIcon} alt="Brain Icon" className="w-5 h-5 object-contain brightness-125" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-wide">Today's AI Insight</h4>
                    <p className="text-[11px] text-emerald-200/60 font-mono">Updated 5m ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                  Active
                </span>
              </div>

              {/* AI Insight Text */}
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-6">
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light italic">
                  "Your sleep consistency and stress levels improved by 14% this week. Keep up your evening wind-down routine."
                </p>
              </div>

              {/* Dynamic Progress Bars */}
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-emerald-200/90 flex items-center gap-2">
                      <img src={smileIcon} alt="Mood Icon" className="w-4 h-4 object-contain brightness-125" /> 
                      Mood Balance
                    </span>
                    <span className="text-[#FFE59E] font-bold font-mono">78%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-[#A08A4A] to-[#FFE59E] rounded-full w-[78%] transition-all duration-1000 shadow-sm" />
                  </div>
                </div>

                {/* STRESS LEVEL WITH HEART ICON */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-emerald-200/90 flex items-center gap-2">
                      <img src={heartIcon} alt="Heart Icon" className="w-4 h-4 object-contain brightness-125" /> 
                      Stress Level
                    </span>
                    <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">Low</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-emerald-400 rounded-full w-[32%] transition-all duration-1000 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Footer Security Badge */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/70 font-medium">
                <span className="flex items-center gap-2">
                  <img src={shieldIcon} alt="Shield Icon" className="w-4 h-4 object-contain brightness-125" /> 
                  100% Encrypted & Private
                </span>
                <span className="text-[10px] text-white/40 font-mono">END-TO-END</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. FEATURES GRID */}
        <div className="space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E5B45] bg-[#2E5B45]/10 px-3.5 py-1.5 rounded-full border border-[#2E5B45]/15">
              What Manovedh Does
            </span>
            <h3 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B3328] pt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A calm digital space for daily well-being
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* FEATURE 1 */}
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-9 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#2E5B45]/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 rounded-2xl bg-[#2E5B45]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2E5B45] transition-all duration-300 shadow-sm">
                <img src={brainIcon} alt="Brain" className="w-8 h-8 object-contain" />
              </div>
              <h4 className="text-2xl font-bold text-[#1B3328] mb-3 font-serif">Understand Patterns</h4>
              <p className="text-sm text-[#4A5850] leading-relaxed">
                Track your mood, habits, sleep, and daily reflections to discover meaningful patterns over time.
              </p>
            </div>

            {/* FEATURE 2 */}
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-9 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#A08A4A]/10 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 rounded-2xl bg-[#A08A4A]/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#A08A4A] transition-all duration-300 shadow-sm">
                <img src={sparkleIcon} alt="Sparkle" className="w-8 h-8 object-contain" />
              </div>
              <h4 className="text-2xl font-bold text-[#1B3328] mb-3 font-serif">AI Reflections</h4>
              <p className="text-sm text-[#4A5850] leading-relaxed">
                Get gentle, personalized prompts and advice that help you reflect without feeling overwhelmed or judged.
              </p>
            </div>

            {/* FEATURE 3 */}
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-9 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#2E5B45]/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 rounded-2xl bg-[#2E5B45]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2E5B45] transition-all duration-300 shadow-sm">
                <img src={smileIcon} alt="Smile" className="w-8 h-8 object-contain" />
              </div>
              <h4 className="text-2xl font-bold text-[#1B3328] mb-3 font-serif">Progress Tracking</h4>
              <p className="text-sm text-[#4A5850] leading-relaxed">
                View your emotional growth through simple visual insights that make long-term progress easier to understand.
              </p>
            </div>

          </div>
        </div>

        {/* 4. HOW IT WORKS */}
        <div className="space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E5B45] bg-[#2E5B45]/10 px-3.5 py-1.5 rounded-full border border-[#2E5B45]/15">
              How It Works
            </span>
            <h3 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B3328] pt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Simple steps, clear results
            </h3>
          </div>

          <div className="max-w-4xl mx-auto space-y-5">
            
            {/* STEP 1 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-black/5 shadow-md hover:shadow-xl transition-all duration-300 flex items-start sm:items-center gap-6 group hover:-translate-x-1">
              <div className="w-14 h-14 rounded-2xl bg-[#2E5B45] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2E5B45]/20 group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="space-y-1">
                <h5 className="text-xl font-bold text-[#1B3328]">Create your account</h5>
                <p className="text-sm text-[#4A5850] leading-relaxed">
                  Sign up securely in under 2 minutes and set up your personal space before using the platform.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-black/5 shadow-md hover:shadow-xl transition-all duration-300 flex items-start sm:items-center gap-6 group hover:-translate-x-1">
              <div className="w-14 h-14 rounded-2xl bg-[#2E5B45] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2E5B45]/20 group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="space-y-1">
                <h5 className="text-xl font-bold text-[#1B3328]">Check in daily</h5>
                <p className="text-sm text-[#4A5850] leading-relaxed">
                  Share how you feel, record quick reflections, and track small daily habits without stress.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-black/5 shadow-md hover:shadow-xl transition-all duration-300 flex items-start sm:items-center gap-6 group hover:-translate-x-1">
              <div className="w-14 h-14 rounded-2xl bg-[#2E5B45] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#2E5B45]/20 group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="space-y-1">
                <h5 className="text-xl font-bold text-[#1B3328]">Receive actionable insights</h5>
                <p className="text-sm text-[#4A5850] leading-relaxed">
                  Manovedh helps you notice emotional trends and suggests small, actionable steps for mental clarity.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 5. CALL TO ACTION BANNER */}
        <div className="relative rounded-[3rem] bg-gradient-to-r from-[#18362A] via-[#234A38] to-[#0F261D] p-10 sm:p-16 text-center text-white shadow-2xl overflow-hidden border border-white/15">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FFE59E]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#2E5B45]/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h3 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start building emotional clarity today.
            </h3>
            <p className="text-base sm:text-lg text-emerald-100/90 font-light leading-relaxed max-w-2xl mx-auto">
              Your well-being does not need to feel complicated. Start with small check-ins, simple insights, and better awareness.
            </p>
            <div className="pt-2">
              <a
                href="#get-started"
                className="inline-flex items-center gap-3 px-9 py-4.5 rounded-full bg-white text-[#1B3328] hover:bg-[#FFE59E] font-bold text-base tracking-wide shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span>Get Started Free</span>
                <img src={rightIcon} alt="Arrow" className="w-5 h-5 object-contain group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LearnMoreSection;