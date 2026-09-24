import React, { useState } from 'react';
import { ArrowRight, X, User, BookOpen } from 'lucide-react';

// Import background image from assets directory
import heroBgImage from '../../assets/image.png';

const HeroSection = ({ onOpenWellnessLogin, onOpenWellnessSignup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-24 select-none bg-[#1b3328]"
    >
      {/* 1. BACKGROUND IMAGE - FULL COVER WITH FOCUS ON CHARACTER FOR MOBILE */}
      <div className={`absolute inset-0 w-full h-full overflow-hidden z-0 transition-all duration-500 ${isModalOpen ? 'filter blur-md scale-105' : ''}`}>
        <img
          src={heroBgImage}
          alt="Peaceful meditation during sunset"
          className="w-full h-full object-cover object-[82%_center] sm:object-center brightness-[0.90] sm:brightness-[0.95] contrast-[1.05] animate-smooth-zoom"
        />
      </div>

      {/* 2. GRADIENT OVERLAYS - LEFT READABILITY & BOTTOM FADE GRADIENT */}
      <div className={`absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:from-black/75 sm:via-black/35 z-10 transition-all duration-700 ease-in-out ${isModalOpen ? 'backdrop-blur-sm' : ''}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b3328]/90 via-transparent to-transparent z-15 pointer-events-none" />

      {/* 3. AMBIENT FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden hidden sm:block">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-[#ffea9f]/60 rounded-full animate-particle-slow" />
        <div className="absolute top-[50%] left-[40%] w-3 h-3 bg-white/25 rounded-full animate-particle-fast" />
        <div className="absolute bottom-[30%] left-[20%] w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-normal" />
        <div className="absolute top-[70%] right-[15%] w-2.5 h-2.5 bg-[#ffea9f]/55 rounded-full animate-particle-slow" />
        <div className="absolute top-[30%] right-[30%] w-2.5 h-2.5 bg-emerald-100/30 rounded-full animate-particle-normal" />
      </div>

      {/* 4. MAIN HERO CONTENT */}
      <div className={`relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 z-30 transition-all duration-500 ${isModalOpen ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
        <div className="max-w-2xl space-y-6 sm:space-y-8 text-left">

          {/* MAIN HEADING - CLEAN & SOLID */}
          <h1
            className="text-4xl sm:text-6xl lg:text-[76px] leading-[1.12] sm:leading-[1.08] tracking-tight font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block font-medium italic text-[#ffe59e] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-ultra-smooth-text-1">
              Your Well-Being
            </span>
            <span className="block text-white animate-ultra-smooth-text-2 mt-1 sm:mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Matters
            </span>
          </h1>

          {/* SUBTITLE TEXT */}
          <p className="text-[15px] sm:text-[18px] text-white/95 leading-relaxed max-w-md sm:max-w-xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-ultra-smooth-text-3">
            Manovedh helps you understand your emotions, build healthier habits, and track your progress with calm AI-powered support.
          </p>

          {/* CALL TO ACTION BUTTONS */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 animate-ultra-smooth-text-4">
            {/* GET STARTED BUTTON - OPENS POPUP */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative group inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full px-7 py-3.5 sm:px-8 sm:py-4 text-[13px] sm:text-[15.5px] font-bold uppercase tracking-wider text-white shadow-xl shadow-[#1b3328]/35 transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{ background: "linear-gradient(145deg, #4E8A6B, #234A38)" }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-out group-hover:translate-x-2" />
              </span>
            </button>

            {/* LEARN MORE BUTTON */}
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 sm:px-8 sm:py-4 text-[13px] sm:text-[15.5px] font-bold tracking-wide text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            >
              Learn More
            </a>
          </div>

        </div>
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#EAF3EC] rounded-[28px] p-8 shadow-2xl border border-[#d6e8da] text-gray-800">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Logo / Header */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#1b3328] flex items-center justify-center text-[#ffea9f] mb-4 shadow-md">
                <span className="font-serif font-bold text-lg">M</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1b3328]">Join Manovedh</h3>
              <p className="text-sm text-gray-600 mt-1">Choose how you'd like to get started</p>
            </div>

            {/* Options Cards */}
            <div className="space-y-4">
              
              {/* User Option Card */}
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  // Add user login handler here if needed in future
                }}
                className="w-full text-left group flex items-center justify-between p-4 bg-white/80 hover:bg-white rounded-2xl border border-[#d6e8da] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dcf0e2] flex items-center justify-center text-[#1b3328]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#1b3328]">User</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Access wellness activities, tracking & support</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1b3328] group-hover:translate-x-1 transition-all" />
              </button>

              {/* Wellness Partner Option Card */}
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  if (onOpenWellnessLogin) onOpenWellnessLogin();
                }}
                className="w-full text-left group flex items-center justify-between p-4 bg-white/80 hover:bg-white rounded-2xl border border-[#d6e8da] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dcf0e2] flex items-center justify-center text-[#1b3328]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#1b3328]">Wellness Partner</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Provide professional guidance & manage clients</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1b3328] group-hover:translate-x-1 transition-all" />
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 5. BOTTOM WAVY SECTION DIVIDER */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none z-25">
        <svg 
          viewBox="0 0 1440 120" 
          className="w-full h-12 sm:h-20 text-[#ffffff] fill-current" 
          preserveAspectRatio="none"
        >
          <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* 6. CUSTOM CSS ANIMATIONS */}
      <style>{`
        @keyframes smoothZoom {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.02); }
        }

        @keyframes ultraSmoothReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes particleSlow {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(0.9); opacity: 0.2; }
          50% { transform: translateY(-40px) translateX(20px) scale(1.2); opacity: 0.8; }
        }
        @keyframes particleFast {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(0.8); opacity: 0.15; }
          50% { transform: translateY(-70px) translateX(-30px) scale(1.3); opacity: 0.75; }
        }
        @keyframes particleNormal {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-55px) translateX(15px); opacity: 0.6; }
        }

        .animate-smooth-zoom { animation: smoothZoom 28s ease-in-out infinite; }
        .animate-ultra-smooth-text-1 { opacity: 0; animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards; }
        .animate-ultra-smooth-text-2 { opacity: 0; animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards; }
        .animate-ultra-smooth-text-3 { opacity: 0; animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards; }
        .animate-ultra-smooth-text-4 { opacity: 0; animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.55s forwards; }

        .animate-particle-slow { animation: particleSlow 8s ease-in-out infinite; }
        .animate-particle-fast { animation: particleFast 5s ease-in-out infinite; }
        .animate-particle-normal { animation: particleNormal 6.5s ease-in-out infinite; }
      `}</style>

    </section>
  );
};

export default HeroSection;