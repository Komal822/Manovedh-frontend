import React from 'react';

const ComeAsYouAreSection = () => {
  return (
    <section id="about" className="relative w-full bg-white py-24 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left image with organic blob mask */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
          <div
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-[55%_45%_40%_60%/45%_55%_45%_55%]"
            style={{ background: "linear-gradient(160deg, #cfe3d5, #9dc4ac)" }}
          />
          <img
            src="/hero-meditation.png"
            alt="Woman stretching in a yoga cobra pose"
            className="relative z-10 w-[260px] sm:w-[340px] h-auto object-contain rounded-[45%_55%_60%_40%/50%_45%_55%_50%] shadow-xl scale-x-[-1]"
          />
        </div>

        {/* Right text content */}
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[14px] font-semibold tracking-wide text-[#a08a4a]">
            Let's start
          </span>
          <h2
            className="text-4xl sm:text-[42px] font-bold text-[#1b3328] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Come As You Are
          </h2>

          <p className="text-[15.5px] text-[#5c6b60] leading-relaxed max-w-md">
            No experience needed, no perfect pose required. Whatever your body
            feels like today, this practice meets you there. Breathe deeply,
            move gently, and let go of anything you carried in with you.
          </p>

          <div className="pt-2">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full px-8 py-3 text-[14.5px] font-semibold border-2 transition-colors hover:text-white"
              style={{ borderColor: "#a08a4a", color: "#a08a4a" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#a08a4a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Join Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wavy divider transitioning into features */}
      <div className="absolute bottom-0 left-0 right-0 leading-none translate-y-1">
        <svg viewBox="0 0 1440 100" className="w-full h-16 sm:h-24" preserveAspectRatio="none">
          <path
            d="M0,50 C300,100 600,0 900,30 C1200,60 1320,80 1440,40 L1440,100 L0,100 Z"
            fill="#e9f1ea"
          />
        </svg>
      </div>
    </section>
  );
};

export default ComeAsYouAreSection;
