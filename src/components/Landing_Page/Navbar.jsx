import React, { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Menu, X, ArrowRight, Globe, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Family", href: "#family" },
  { label: "Contact", href: "#contact" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "mr", label: "मराठी (Marathi)" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Language state & dropdown ref
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    // Close language dropdown on outside click
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans transition-all duration-500">
      
      {/* 1. TOP INFO BAR */}
      <div
        className={`hidden md:flex items-center justify-between px-8 lg:px-16 bg-[#f4f1ea]/90 backdrop-blur-md text-[12.5px] text-[#33413a] border-b border-[#e5e0d3] transition-all duration-500 overflow-hidden ${
          scrolled ? "max-h-0 py-0 opacity-0 border-none" : "max-h-12 py-2 opacity-100"
        }`}
      >
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 hover:text-[#1b3328] transition-colors cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-[#2e5b45]" />
           Survey No:374/1, Gaulkhed Road,
Shegaon, Maharashtra 444203
          </span>
          <span className="flex items-center gap-2 hover:text-[#1b3328] transition-colors cursor-pointer">
            <Phone className="w-3.5 h-3.5 text-[#2e5b45]" />
          +91 9223456789
          </span>
        </div>
        <span className="flex items-center gap-2 hover:text-[#1b3328] transition-colors cursor-pointer">
          <Mail className="w-3.5 h-3.5 text-[#2e5b45]" />
         mindspace.aisense@gmail.com
        </span>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav
        className={`flex items-center justify-between px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-white/85 backdrop-blur-md shadow-md border-b border-black/5 text-[#1b3328]"
            : "py-4 bg-[#eae5db]/60 backdrop-blur-sm border-b border-black/5 text-[#1b3328]"
        }`}
      >
        {/* LOGO */}
        <a href="#home" className="group flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            style={{ background: "linear-gradient(135deg, #4E8A6B, #1b3328)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21C12 21 4 15.5 4 9.5C4 6.46 6.46 4 9.5 4C10.94 4 12 5 12 5C13.06 4 14.5 4C17.54 4 20 6.46 20 9.5C20 15.5 12 21 12 21Z"
                fill="#ffe59e"
              />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-[22px] font-bold tracking-tight text-[#1b3328] transition-colors duration-300 group-hover:text-[#2e5b45]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Manovedh
            </span>
            <span className="text-[9.5px] tracking-[0.2em] text-[#a08a4a] uppercase font-bold mt-0.5">
              Mindful living
            </span>
          </span>
        </a>

        {/* RIGHT GROUP: LINKS + LANGUAGE + BUTTONS */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* DESKTOP LINKS */}
          <ul className="flex items-center gap-1 bg-black/5 border border-black/5 rounded-full px-3 py-1 backdrop-blur-sm">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.label} className="relative group">
                  <a
                    href={link.href}
                    className={`relative z-10 px-4 py-1.5 text-[14px] font-semibold tracking-wide rounded-full transition-all duration-300 block ${
                      isActive
                        ? "text-[#1b3328]"
                        : "text-[#4a5850] hover:text-[#1b3328]"
                    }`}
                  >
                    {link.label}
                  </a>

                  {/* Hover Pill Effect */}
                  <span
                    className={`absolute inset-0 bg-white shadow-sm rounded-full transition-all duration-300 pointer-events-none ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* LANGUAGE SELECTOR DROPDOWN */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-[13.5px] font-semibold text-[#1b3328] bg-black/5 hover:bg-black/10 border border-black/5 rounded-full transition-all duration-300"
            >
              <Globe className="w-4 h-4 text-[#2e5b45]" />
              <span>{selectedLang.label.split(" ")[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#4a5850] transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Options */}
            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1b3328] text-white rounded-2xl shadow-xl border border-white/10 py-2 z-50 overflow-hidden backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors duration-200 flex items-center justify-between ${
                      selectedLang.code === lang.code
                        ? "bg-[#2e5b45] text-white font-semibold"
                        : "text-emerald-100/80 hover:bg-[#28493a] hover:text-white"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            {/* LOG IN BUTTON */}
            <a
              href="#login"
              className="px-4 py-2 text-[14px] font-bold text-[#1b3328] hover:text-[#2e5b45] transition-colors duration-300"
            >
              Log in
            </a>

            {/* GET STARTED BUTTON */}
            <a
              href="#get-started"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-2.5 text-[13.5px] font-bold uppercase tracking-wider text-white shadow-md shadow-[#1b3328]/20 transition-all duration-500 hover:shadow-xl hover:scale-105 active:scale-95 group"
              style={{ background: "linear-gradient(145deg, #4E8A6B, #234A38)" }}
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <span className="relative z-10 flex items-center gap-1.5">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          </div>

        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#1b3328] transition-all duration-300 active:scale-90 hover:bg-black/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
            {open ? <X className="w-5 h-5 text-[#2e5b45]" /> : <Menu className="w-5 h-5" />}
          </span>
        </button>
      </nav>

      {/* 3. MOBILE MENU DROP DOWN */}
      <div
        className={`lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-black/10 transition-all duration-500 ease-in-out ${
          open ? "max-h-[500px] opacity-100 shadow-2xl" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-2 px-8 py-6">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className={`py-2.5 text-[16px] font-semibold text-[#1b3328] border-b border-black/5 transition-all duration-300 hover:translate-x-2 hover:text-[#2e5b45] ${
                open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
              style={{ transitionDelay: `${open ? idx * 60 : 0}ms` }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* MOBILE LANGUAGE SELECTOR */}
          <div
            className={`py-3 border-b border-black/5 transition-all duration-300 ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: `${open ? NAV_LINKS.length * 60 : 0}ms` }}
          >
            <span className="text-[12px] uppercase font-bold text-[#a08a4a] block mb-2">Select Language</span>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1.5 text-[13px] rounded-full font-medium transition-all ${
                    selectedLang.code === lang.code
                      ? "bg-[#1b3328] text-white"
                      : "bg-black/5 text-[#1b3328] hover:bg-black/10"
                  }`}
                >
                  {lang.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <a
            href="#login"
            className={`mt-2 py-2 text-center text-[15px] font-bold text-[#1b3328] hover:text-[#2e5b45] transition-all duration-300 ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: `${open ? (NAV_LINKS.length + 1) * 60 : 0}ms` }}
            onClick={() => setOpen(false)}
          >
            Log in
          </a>

          <a
            href="#get-started"
            className={`mt-2 flex justify-center items-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-all duration-300 ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{
              background: "linear-gradient(145deg, #4E8A6B, #234A38)",
              transitionDelay: `${open ? (NAV_LINKS.length + 2) * 60 : 0}ms`,
            }}
            onClick={() => setOpen(false)}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}