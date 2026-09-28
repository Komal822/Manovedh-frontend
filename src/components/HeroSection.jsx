import React from "react";
import { Link } from "react-router-dom";

import heroBgImage from "../../assets/image.png";
import rightIcon from "../../assets/right.png";

function HeroSection({
  onOpenWellnessLogin,
  onOpenWellnessSignup,
}) {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#12241C] text-white"
    >
      {/* =========================================================
          HERO BACKGROUND
      ========================================================= */}
      <div className="absolute inset-0">
        <img
          src={heroBgImage}
          alt="Manovedh Wellness"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#10251C]/95 via-[#10251C]/70 to-[#10251C]/20" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* =========================================================
          HERO CONTENT
      ========================================================= */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-10 lg:px-16">

          <div className="max-w-3xl">

            {/* Small Heading */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#a08a4a]" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100/80 sm:text-xs">
                A Calmer Mind&nbsp;&nbsp; A Brighter You
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="text-white">
                Your Well-Being
              </span>
              <br />
              <span className="text-[#9acbb0]">
                Matters.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base sm:leading-8">
              Manovedh helps you understand your emotions,
              <br className="hidden sm:block" />
              build healthier habits, and track your progress
              <br className="hidden sm:block" />
              with calm AI-powered support.
            </p>

            {/* =====================================================
                CTA BUTTONS
            ===================================================== */}
            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* Get Started */}
              <Link
                to="/login"
                className="group inline-flex items-center gap-3 rounded-full bg-[#9acbb0] px-7 py-3.5 text-sm font-bold text-[#173326] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#b0dbc2] hover:shadow-xl"
              >
                <span>Get Started</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* =================================================
                  LEARN MORE
                  Opens LearnMoreSection through /about
              ================================================= */}
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10"
              >
                <span>Learn More</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

            {/* =====================================================
                FEATURE POINTS
            ===================================================== */}
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                  <span className="text-lg">⌁</span>
                </div>

                <p className="text-xs font-medium leading-5 text-white/80">
                  Understand
                  <br />
                  Your Emotions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                  <span className="text-lg">↗</span>
                </div>

                <p className="text-xs font-medium leading-5 text-white/80">
                  Build
                  <br />
                  Healthier Habits
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                  <span className="text-lg">♡</span>
                </div>

                <p className="text-xs font-medium leading-5 text-white/80">
                  Find Your
                  <br />
                  Balance
                </p>
              </div>

            </div>

          </div>

          {/* =========================================================
              RIGHT SIDE MESSAGE
          ========================================================= */}
          <div className="absolute bottom-28 right-8 hidden max-w-[220px] text-right lg:block xl:right-16">

            <p className="font-serif text-3xl italic leading-tight text-white/90">
              Better
              <br />
              Thoughts
              <br />
              <span className="text-[#9acbb0]">
                Brighter Days
              </span>
            </p>

            <div className="ml-auto mt-4 h-px w-16 bg-[#9acbb0]" />
          </div>

        </div>
      </div>

      {/* =========================================================
          SCROLL INDICATOR
      ========================================================= */}
      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          Scroll to explore
        </span>

        <span className="animate-bounce text-white/70">
          ↓
        </span>
      </div>

      {/* =========================================================
          WAVE DIVIDER
      ========================================================= */}
      <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block h-[70px] w-full sm:h-[90px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C180,120 360,120 540,72 C720,24 900,24 1080,64 C1260,104 1350,108 1440,80 L1440,120 L0,120 Z"
            fill="#F8F6F0"
          />
        </svg>
      </div>

      {/* =========================================================
          SMALL RIGHT ICON
      ========================================================= */}
      <div className="absolute bottom-20 right-6 z-20 hidden sm:block">
        <img
          src={rightIcon}
          alt=""
          className="h-10 w-10 object-contain opacity-70"
        />
      </div>
    </section>
  );
}

export default HeroSection;