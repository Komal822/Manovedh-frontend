import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Globe, ChevronDown, User, 
  Settings, Bookmark, HelpCircle, LogOut, Sparkles 
} from "lucide-react";

import logoImg from "../assets/logo.png"; // Your logo path

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Feedback", path: "/feedback" },
  { label: "Support", path: "/support" },
  { label: "Contact", path: "/contact" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "mr", label: "मराठी (Marathi)" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Profile & Language States
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Active User Check From LocalStorage (Key matched with Login/Signup Code & Profile Updates)
  useEffect(() => {
    const checkUserSession = () => {
      const activeUser = localStorage.getItem("manovedh_current_user");
      if (activeUser) {
        setUser(JSON.parse(activeUser));
      } else {
        setUser(null);
      }
    };

    checkUserSession();
    window.addEventListener("storage", checkUserSession);

    return () => window.removeEventListener("storage", checkUserSession);
  }, [location]);

  // Scroll & Outside Click Event Listeners
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("manovedh_current_user");
    setUser(null);
    setProfileOpen(false);
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      <nav
        className={`flex items-center justify-between px-6 sm:px-10 lg:px-16 transition-all duration-300 bg-white ${
          scrolled
            ? "py-2 shadow-md border-b border-black/5 text-[#1b3328]"
            : "py-3 border-b border-black/5 text-[#1b3328]"
        }`}
      >
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-3.5 py-1">
          <img 
            src={logoImg} 
            alt="Manovedh Logo" 
            className={`w-auto object-contain transition-all duration-300 drop-shadow-sm group-hover:scale-105 ${
              scrolled ? "h-10 md:h-12" : "h-12 md:h-14 lg:h-16"
            }`} 
          />
          <span className="flex flex-col leading-tight">
            <span
              className={`font-bold tracking-tight text-[#1b3328] transition-all duration-300 group-hover:text-[#2e5b45] ${
                scrolled ? "text-[22px] md:text-[24px]" : "text-[26px] md:text-[30px]"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Manovedh
            </span>
            <span className="text-[10px] md:text-[11px] tracking-[0.22em] text-[#a08a4a] uppercase font-bold">
              Mindful living
            </span>
          </span>
        </Link>

        {/* DESKTOP CONTENT */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* NAVIGATION LINKS */}
          <ul className="flex items-center gap-1 bg-black/5 border border-black/5 rounded-full px-3 py-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.label} className="relative group">
                  <Link
                    to={link.path}
                    className={`relative z-10 px-4 py-1.5 text-[14px] font-semibold tracking-wide rounded-full transition-all duration-300 block ${
                      isActive ? "text-[#1b3328]" : "text-[#4a5850] hover:text-[#1b3328]"
                    }`}
                  >
                    {link.label}
                  </Link>
                  <span
                    className={`absolute inset-0 bg-white shadow-sm rounded-full transition-all duration-300 pointer-events-none ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* LANGUAGE SELECTOR */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-[13.5px] font-semibold text-[#1b3328] bg-black/5 hover:bg-black/10 border border-black/5 rounded-full transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#2e5b45]" />
              <span>{selectedLang.label.split(" ")[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#4a5850] transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1b3328] text-white rounded-2xl shadow-xl border border-white/10 py-2 z-50 overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedLang.code === lang.code ? "bg-[#2e5b45] text-white font-semibold" : "text-emerald-100/80 hover:bg-[#28493a]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* USER LOGGED-IN CONDITION */}
          {user ? (
            /* PROFILE DROPDOWN (WHEN USER IS LOGGED IN) */
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full bg-black/5 hover:bg-black/10 border border-black/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#2e5b45] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[#a08a4a] overflow-hidden">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-[13.5px] font-semibold text-[#1b3328] group-hover:text-[#2e5b45]">
                  {user.fullName ? user.fullName.split(" ")[0] : "User"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#4a5850] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* PROFILE MENU */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-[#1b3328] text-white rounded-2xl shadow-2xl border border-white/10 py-3 z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-5 py-3 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2e5b45] text-white flex items-center justify-center font-bold text-base ring-2 ring-[#a08a4a] overflow-hidden flex-shrink-0">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</span>
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-[15px] text-white truncate">{user.fullName || "User"}</span>
                        <span className="text-[12px] text-emerald-100/70 truncate">{user.email}</span>
                        <div className="mt-1 flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-[#a08a4a]/20 border border-[#a08a4a]/40 text-[#d4af37] text-[10px] font-semibold uppercase">
                          <Sparkles className="w-3 h-3" /> Member
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-b border-white/10">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium text-emerald-100/80 hover:bg-[#28493a] hover:text-white transition-all">
                      <User className="w-4 h-4 text-[#a08a4a]" /> My Profile
                    </Link>
                    <Link to="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium text-emerald-100/80 hover:bg-[#28493a] hover:text-white transition-all">
                      <Bookmark className="w-4 h-4 text-[#a08a4a]" /> Saved Items
                    </Link>
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium text-emerald-100/80 hover:bg-[#28493a] hover:text-white transition-all">
                      <Settings className="w-4 h-4 text-[#a08a4a]" /> Settings
                    </Link>
                  </div>

                  <div className="pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all cursor-pointer">
                      <LogOut className="w-4 h-4 text-rose-400" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LOGIN & GET STARTED BUTTONS (WHEN USER IS LOGGED OUT) */
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-[14px] font-bold text-[#1b3328] hover:text-[#2e5b45] transition-colors cursor-pointer">
                Login
              </Link>

              <Link
                to="/signup"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-[13.5px] font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 group cursor-pointer"
                style={{ background: "linear-gradient(145deg, #4E8A6B, #234A38)" }}
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#1b3328]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5 text-[#2e5b45]" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div className={`lg:hidden overflow-hidden bg-white border-b border-black/10 transition-all duration-500 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-2 px-8 py-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.path} className="py-2.5 text-[16px] font-semibold text-[#1b3328] border-b border-black/5" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <button onClick={handleLogout} className="mt-4 py-3 bg-rose-500 text-white font-bold rounded-full text-center">
              Logout ({user.fullName})
            </button>
          ) : (
            <div className="flex flex-col gap-2.5 pt-3">
              <Link to="/login" className="py-2.5 text-center text-[15px] font-bold text-[#1b3328] bg-black/5 rounded-full" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="flex items-center justify-center py-3 text-[14px] font-bold uppercase text-white rounded-full shadow-md" style={{ background: "linear-gradient(145deg, #4E8A6B, #234A38)" }} onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}