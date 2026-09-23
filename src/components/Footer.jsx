import React, { useState } from 'react';
import { Send, Heart } from 'lucide-react';

// LOGO & ASSETS IMPORTS
import logoImg from "../assets/logo.png";
import helpIcon from "../assets/help-center.png";
import termsIcon from "../assets/terms-and-condition.png";
import privacyIcon from "../assets/privacy-policy.png";

// Location, Phone & Email Custom Icons
import locationIcon from "../assets/location.png";
import callIcon from "../assets/call.png";
import emailIcon from "../assets/communication.png";

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
    <footer className="w-full bg-gradient-to-b from-[#0e271c] via-[#091a13] to-[#05110c] text-white font-sans relative overflow-x-hidden border-t border-emerald-500/10">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 max-w-full h-96 bg-[#2e5b45]/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP FOOTER CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="Manovedh Logo" 
                className="h-10 w-auto object-contain drop-shadow-md"
              />
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Manovedh
              </h2>
            </div>

            <p className="text-emerald-100/70 text-[14px] leading-relaxed max-w-md font-normal break-words">
              Empowering your emotional well-being through mindful living and intelligent AI support. Your journey to inner peace starts here.
            </p>
          </div>

          {/* CONTACT INFO COLUMN WITH CUSTOM ICONS */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-emerald-200 uppercase tracking-widest text-[12px] font-semibold">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-[13.5px] text-gray-300">
              <li className="flex items-start gap-3">
                <img 
                  src={locationIcon} 
                  alt="Location" 
                  className="w-4 h-4 object-contain opacity-80 shrink-0 mt-1" 
                />
                <span className="leading-relaxed">
                  Survey No: 374/1, Gaulkhed Road,<br />
                  Shegaon, Maharashtra 444203
                </span>
              </li>
              <li className="flex items-center gap-3">
                <img 
                  src={callIcon} 
                  alt="Phone" 
                  className="w-4 h-4 object-contain opacity-80 shrink-0" 
                />
                <a href="tel:+919223456789" className="hover:text-amber-200 transition-colors">
                  +91 92234 56789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <img 
                  src={emailIcon} 
                  alt="Email" 
                  className="w-4 h-4 object-contain opacity-80 shrink-0" 
                />
                <a href="mailto:mindspace.aisense@gmail.com" className="hover:text-amber-200 transition-colors break-all">
                  mindspace.aisense@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-emerald-200 uppercase tracking-widest text-[12px] font-semibold">
              Support
            </h3>
            <ul className="space-y-3 text-[14px] text-gray-300">
              <li>
                <a href="#help" className="flex items-center gap-2.5 hover:text-amber-200 transition-colors duration-200 group">
                  <img src={helpIcon} alt="Help Center" className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
                  <span>Help Center</span>
                </a>
              </li>
              <li>
                <a href="#terms" className="flex items-center gap-2.5 hover:text-amber-200 transition-colors duration-200 group">
                  <img src={termsIcon} alt="Terms of Service" className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#privacy" className="flex items-center gap-2.5 hover:text-amber-200 transition-colors duration-200 group">
                  <img src={privacyIcon} alt="Privacy Policy" className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity shrink-0" />
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER COLUMN */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-emerald-200 uppercase tracking-widest text-[12px] font-semibold">
              Stay up to date
            </h3>
            <p className="text-gray-300 text-[13.5px] break-words">
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
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4E8A6B] to-[#234A38] hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* DIVIDER LINE */}
      <div className="w-full border-t border-white/10" />

      {/* BOTTOM COPYRIGHT SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 text-center">
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
