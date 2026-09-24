import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Stethoscope,
  HeartHandshake,
  CalendarCheck
} from 'lucide-react';

const LOCAL_STORAGE_PARTNERS_KEY = 'manovedh_wellness_partners';
const LOCAL_STORAGE_PARTNER_SESSION_KEY = 'manovedh_current_partner';

export default function WellnessPartnerLogin({ onLoginSuccess, onBackToHome, onSwitchToSignup, onSwitchToUserLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Typewriter effect states for Partner Tagline
  const fullText = "SUPPORTING PATIENTS WITH EXPERT CARE";
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  useEffect(() => {
    const handleTyping = () => {
      const fullCurText = fullText;
      if (isDeleting) {
        setDisplayedText(fullCurText.substring(0, displayedText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayedText(fullCurText.substring(0, displayedText.length + 1));
        setTypingSpeed(100);
      }
      if (!isDeleting && displayedText === fullCurText) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(120);
      }
    };
    const ticker = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, loopNum, typingSpeed]);

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY)) || [];
    const foundPartner = partners.find(
      (p) =>
        p.email.toLowerCase() === loginData.email.toLowerCase() &&
        p.password === loginData.password
    );

    if (foundPartner || (loginData.email === 'partner@manovedh.com' && loginData.password === 'password')) {
      const partnerUser = foundPartner || { email: loginData.email, fullName: 'Wellness Partner' };
      localStorage.setItem(LOCAL_STORAGE_PARTNER_SESSION_KEY, JSON.stringify(partnerUser));
      if (onLoginSuccess) onLoginSuccess(partnerUser);
    } else {
      setErrorMessage('Invalid partner credentials. Please check and try again.');
    }
  };

  const handleBackToHome = (e) => {
    e.preventDefault();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#12241C] flex flex-col items-center justify-center pt-2 pb-6 px-4 font-sans relative overflow-hidden">
      
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between z-30 px-1 sm:px-0">
        <button 
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-[#ffd700] rounded-full border border-white/10 backdrop-blur-md">
          Wellness Partner Portal
        </span>
      </div>

      <div className="relative w-full max-w-5xl bg-[#ECE7DE] rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] border border-[#2e5b45]/25">

        {/* LEFT SIDE: ORGANIC WAVE PANEL */}
        <div className="lg:col-span-5 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[#ECE7DE]">
          <div className="absolute right-0 top-0 bottom-0 w-80 pointer-events-none z-20 hidden lg:block overflow-hidden">
            <svg viewBox="0 0 300 800" preserveAspectRatio="none" className="w-full h-full fill-[#1e3d30]">
              <path d="M 120 0 C 260 220, 20 420, 220 620 C 280 690, 100 760, 250 800 L 300 800 L 300 0 Z"></path>
            </svg>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-60 pointer-events-none z-20 hidden lg:block opacity-90 overflow-hidden">
            <svg viewBox="0 0 300 800" preserveAspectRatio="none" className="w-full h-full fill-[#28503e]">
              <path d="M 160 0 C 280 260, 80 460, 240 690 C 280 750, 210 780, 270 800 L 300 800 L 300 0 Z"></path>
            </svg>
          </div>

          <div className="relative z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e3d30] flex items-center justify-center text-white font-bold shadow-md text-sm">
                🌿
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-[#1b3328] font-serif">Manovedh</h1>
                <p className="text-[7px] tracking-[0.25em] text-[#55635b] font-extrabold uppercase">PARTNER PORTAL</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-auto py-4 flex flex-col justify-center pr-10 lg:pr-14">
            <div className="mb-4 min-h-[3.5rem] sm:min-h-[4rem]">
              <h2 className="text-lg sm:text-xl font-serif font-normal leading-tight bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#daa520] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(218,165,32,0.4)]">
                {displayedText}
                <span className="inline-block w-[2px] h-5 ml-0.5 bg-[#b8860b] animate-pulse align-middle"></span>
              </h2>
            </div>

            <div className="space-y-3 z-30 mt-1">
              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1e3d30] text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <Stethoscope className="w-4 h-4 text-[#ffd700]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1b3328]">Professional Guidance</h4>
                  <p className="text-[10px] text-[#55635b]">Manage sessions and interact securely with users.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1e3d30] text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <CalendarCheck className="w-4 h-4 text-[#ffd700]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1b3328]">Schedule Management</h4>
                  <p className="text-[10px] text-[#55635b]">Organize your availability and calendar appointments.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1e3d30] text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <HeartHandshake className="w-4 h-4 text-[#ffd700]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1b3328]">Dedicated Support</h4>
                  <p className="text-[10px] text-[#55635b]">Empower healing through trusted expert networks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-30 flex flex-col items-start gap-2 mt-2">
            <p className="text-[11px] text-[#55635b] font-medium">Empowering minds, transforming lives together.</p>
          </div>
        </div>

        {/* RIGHT SIDE: LIGHT PANEL WITH TOGGLE PILL */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#F8F6F0] relative overflow-hidden">

          <div className="max-w-sm mx-auto w-full z-20 my-auto">

            {/* IMAGE SARKHI LOGIN/SIGNUP PILL SWITCH BUTTON */}
            <div className="bg-[#E6E0D4] p-1 rounded-full flex items-center mb-5 shadow-inner">
              <div className="flex-1 py-1.5 text-center rounded-full text-xs font-bold bg-[#2c5341] text-white shadow-md cursor-pointer transition-all">
                Login
              </div>
              <button 
                type="button"
                onClick={() => { if (onSwitchToSignup) onSwitchToSignup(); }}
                className="flex-1 py-1.5 text-center rounded-full text-xs font-bold text-[#5a6b62] hover:text-[#1b3328] transition-all cursor-pointer bg-transparent border-none"
              >
                Sign Up
              </button>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-serif font-bold text-[#1b3328]">Partner Dashboard Access</h3>
              <p className="text-[11px] text-[#5a6b62] mt-0.5">Sign in to manage patient appointments and counselling sessions.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                <input
                  type="email"
                  required
                  placeholder="partner@manovedh.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                />
              </div>

              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5a6b62] pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded border-black/20 text-[#2c5341] focus:ring-[#2c5341]" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#forgot" className="text-[#2c5341] font-semibold hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-[#2c5341] hover:bg-[#203e31] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Login to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-5 text-center space-y-1.5 text-[11px] text-[#5a6b62]">
              <p>
                Are you a regular user?{' '}
                <button 
                  onClick={() => { if (onSwitchToUserLogin) onSwitchToUserLogin(); }}
                  className="text-[#2c5341] font-bold underline cursor-pointer bg-transparent border-none p-0 inline"
                >
                  User Login
                </button>
              </p>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-black/5 grid grid-cols-3 text-center text-[9px] text-[#738279] z-20">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Secure & encrypted</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Real-time scheduling</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Crisis-ready tools</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}