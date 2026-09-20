import React, { useState } from 'react';
import { Send, Heart, Shield, HelpCircle, FileText } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#0e271c] via-[#091a13] to-[#05110c] text-white font-sans relative overflow-hidden border-t border-emerald-500/10">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2e5b45]/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP FOOTER CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg border border-amber-200/20"
                style={{ background: "linear-gradient(135deg, #4E8A6B, #1b3328)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21C12 21 4 15.5 4 9.5C4 6.46 6.46 4 9.5 4C10.94 4 12 5 12 5C13.06 4 14.5 4C17.54 4 20 6.46 20 9.5C20 15.5 12 21 12 21Z"
                    fill="#ffe59e"
                  />
                </svg>
              </span>
              <h2 
                className="text-3xl font-bold tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Manovedh
              </h2>
            </div>

            <p className="text-emerald-100/70 text-[14px] leading-relaxed max-w-md font-normal">
              Empowering your emotional well-being through mindful living and intelligent AI support. Your journey to inner peace starts here.
            </p>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[15px] font-semibold text-emerald-200 uppercase tracking-widest text-[12px]">
              Support
            </h3>
            <ul className="space-y-3 text-[14px] text-gray-300">
              <li>
                <a href="#help" className="flex items-center gap-2 hover:text-amber-200 transition-colors duration-200">
                  <HelpCircle className="w-4 h-4 text-[#4E8A6B]" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#terms" className="flex items-center gap-2 hover:text-amber-200 transition-colors duration-200">
                  <FileText className="w-4 h-4 text-[#4E8A6B]" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="flex items-center gap-2 hover:text-amber-200 transition-colors duration-200">
                  <Shield className="w-4 h-4 text-[#4E8A6B]" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER COLUMN */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[15px] font-semibold text-emerald-200 uppercase tracking-widest text-[12px]">
              Stay up to date
            </h3>
            <p className="text-gray-300 text-[13.5px]">
              Subscribe to get mindful tips and updates delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="relative max-w-sm w-full">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 text-white placeholder-gray-400 px-5 py-3 rounded-full border border-white/10 focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 backdrop-blur-md transition-all text-[13.5px] pr-12 shadow-inner"
              />
              <button
                type="submit"
                aria-label="Send email"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4E8A6B] to-[#234A38] hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* DIVIDER LINE */}
      <div className="w-full border-t border-white/10" />

      {/* BOTTOM COPYRIGHT SECTION (CENTER ALIGNED) */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="text-[13px] text-gray-400 font-medium flex items-center justify-center gap-1.5 flex-wrap">
          <span>Copyright © 2026 Manovedh AI. All rights reserved.</span>
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="flex items-center gap-1 text-emerald-300/80">
            Crafted with <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> for Mindful Living
          </span>
        </p>
      </div>

    </footer>
  );
}