import React from 'react';
import { ArrowRight } from 'lucide-react';

// Import background image from assets directory
import heroBgImage from '../assets/image.png';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-20 select-none bg-[#1b3328]"
    >
      {/* 1. BACKGROUND IMAGE - FULL COVER WITH FOCUS ON CHARACTER FOR MOBILE */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <img
          src={heroBgImage}
          alt="Peaceful meditation during sunset"
          className="w-full h-full object-cover object-[82%_center] sm:object-center brightness-[0.90] sm:brightness-[0.95] contrast-[1.05] animate-smooth-zoom"
        />
      </div>

      {/* 2. GRADIENT OVERLAY - SMOOTH DARK LEFT GRADIENT FOR READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent sm:from-black/70 sm:via-black/30 z-10 transition-all duration-700 ease-in-out" />

      {/* 3. AMBIENT FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden hidden sm:block">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-[#e3d19b]/50 rounded-full animate-particle-slow" />
        <div className="absolute top-[50%] left-[40%] w-3 h-3 bg-white/25 rounded-full animate-particle-fast" />
        <div className="absolute bottom-[30%] left-[20%] w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-normal" />
        <div className="absolute top-[70%] right-[15%] w-2.5 h-2.5 bg-[#e3d19b]/45 rounded-full animate-particle-slow" />
        <div className="absolute top-[30%] right-[30%] w-2.5 h-2.5 bg-emerald-100/30 rounded-full animate-particle-normal" />
      </div>

      {/* 4. MAIN HERO CONTENT */}
      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 z-30">
        <div className="max-w-2xl space-y-4 sm:space-y-8 text-left">

          {/* MAIN HEADING */}
          <h1
            className="text-4xl sm:text-6xl lg:text-[76px] leading-[1.12] sm:leading-[1.08] tracking-tight font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block font-medium italic bg-gradient-to-r from-[#ffe59e] via-[#f8b500] to-[#e3d19b] bg-clip-text text-transparent animate-ultra-smooth-text-1">
              Your Well-Being
            </span>
            <span className="block text-white animate-ultra-smooth-text-2 mt-1 sm:mt-0">
              Matters
            </span>
          </h1>

          {/* SUBTITLE TEXT */}
          <p className="text-[14px] sm:text-[18px] text-white/95 leading-relaxed max-w-md sm:max-w-xl font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] animate-ultra-smooth-text-3">
            Manovedh helps you understand your emotions, build healthier habits, and track your progress with calm AI-powered support.
          </p>

          {/* CALL TO ACTION BUTTONS */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 animate-ultra-smooth-text-4">
            {/* GET STARTED BUTTON */}
            <a
              href="#get-started"
              className="relative group inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full px-7 py-3.5 sm:px-8 sm:py-4 text-[13px] sm:text-[15.5px] font-bold uppercase tracking-wider text-white shadow-xl shadow-[#1b3328]/35 transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(145deg, #4E8A6B, #234A38)" }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-out group-hover:translate-x-2" />
              </span>
            </a>

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

      {/* 5. BOTTOM WAVY SECTION DIVIDER */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none z-25">
        <svg 
          viewBox="0 0 1440 120" 
          className="w-full h-10 sm:h-20 text-[#f4f1ea] fill-current" 
          preserveAspectRatio="none"
        >
          <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* 6. CUSTOM CSS ANIMATIONS AND STYLES */}
      <style>{`
        /* Smooth Scale zoom effect for background image */
        @keyframes smoothZoom {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.02); }
        }

        /* Ultra smooth staggered text reveal effect */
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

        /* Floating particles keyframes */
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

        /* Animation utility classes */
        .animate-smooth-zoom {
          animation: smoothZoom 28s ease-in-out infinite;
        }

        /* Staggered text animation classes */
        .animate-ultra-smooth-text-1 {
          opacity: 0;
          animation: ultraSmoothReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }
        .animate-ultra-smooth-text-2 {
          opacity: 0;
          animation: ultraSmoothReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
        }
        .animate-ultra-smooth-text-3 {
          opacity: 0;
          animation: ultraSmoothReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }
        .animate-ultra-smooth-text-4 {
          opacity: 0;
          animation: ultraSmoothReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.55s forwards;
        }

        /* Particle animations trigger classes */
        .animate-particle-slow { animation: particleSlow 8s ease-in-out infinite; }
        .animate-particle-fast { animation: particleFast 5s ease-in-out infinite; }
        .animate-particle-normal { animation: particleNormal 6.5s ease-in-out infinite; }
      `}</style>

    </section>
  );
};

export default HeroSection;