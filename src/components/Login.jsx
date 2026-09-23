import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

import yoga1 from '../assets/yoga-1.png';
import yoga2 from '../assets/yoga-2.png';
import yoga3 from '../assets/yoga-3.png';
import yoga4 from '../assets/yoga-4.png';
import yoga5 from '../assets/yoga-5.png';
import yoga6 from '../assets/yoga-6.png';
import yoga7 from '../assets/yoga-7.png';
import yoga8 from '../assets/yoga-8.png';
import yoga9 from '../assets/yoga-9.png';
import yoga10 from '../assets/yoga-10.png';

const LOCAL_STORAGE_USERS_KEY = 'manovedh_registered_users';
const LOCAL_STORAGE_SESSION_KEY = 'manovedh_current_user';

const yogaImages = [yoga1, yoga2, yoga3, yoga4, yoga5, yoga6, yoga7, yoga8, yoga9, yoga10];

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentYogaIndex, setCurrentYogaIndex] = useState(0);

  // Typewriter effect states
  const fullText = "A HEALTHIER MIND A BRIGHTER YOU";
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentYogaIndex((prevIndex) => (prevIndex + 1) % yogaImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter animation logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % fullText.length;
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

  const [flowState, setFlowState] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPasswordData, setNewPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === loginData.email.toLowerCase() &&
        u.password === loginData.password
    );

    if (foundUser) {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(foundUser));
      if (onLoginSuccess) onLoginSuccess(foundUser);
      navigate('/');
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    const simulatedGoogleUser = {
      fullName: 'Google User',
      email: 'googleuser@manovedh.com',
      password: 'oauth_google_user',
    };

    let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    const exists = users.find((u) => u.email === simulatedGoogleUser.email);
    if (!exists) {
      users.push(simulatedGoogleUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(simulatedGoogleUser));
    if (onLoginSuccess) onLoginSuccess(simulatedGoogleUser);
    navigate('/');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    const foundUser = users.find((u) => u.email.toLowerCase() === resetEmail.toLowerCase());

    if (!foundUser) {
      setErrorMessage('No account found with this email address.');
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    alert(`[Simulated Email] Your Manovedh Password Reset OTP is: ${otp}`);
    setFlowState('forgot_otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (enteredOtp.trim() !== generatedOtp) {
      setErrorMessage('Invalid OTP code. Please check and try again.');
      return;
    }

    setFlowState('forgot_new');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      return;
    }

    if (newPasswordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    users = users.map((u) => {
      if (u.email.toLowerCase() === resetEmail.toLowerCase()) {
        return { ...u, password: newPasswordData.newPassword };
      }
      return u;
    });

    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    alert('Password updated successfully! Please login with your new password.');
    
    setFlowState('login');
    setLoginData({ email: resetEmail, password: '' });
    setResetEmail('');
    setEnteredOtp('');
    setNewPasswordData({ newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen w-full bg-[#12241C] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      
      {/* WRAPPER CONTAINER TO ALIGN BACK BUTTON WITH THE CARD */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-start z-30 px-1 sm:px-0">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative w-full max-w-5xl bg-[#ECE7DE] rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] border border-[#2e5b45]/20">

        {/* ================= LEFT SIDE: REFERENCE MATCHED PANEL ================= */}
        <div className="lg:col-span-5 relative p-5 sm:p-6 flex flex-col justify-between overflow-hidden bg-[#ECE7DE]">

          {/* Smooth Curving Organic Wave Divider Layers matching Reference */}
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

          {/* Top Logo & Branding */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e3d30] flex items-center justify-center text-white font-bold shadow-md text-sm">
                🌿
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-[#1b3328] font-serif">Manovedh</h1>
                <p className="text-[7px] tracking-[0.25em] text-[#55635b] font-extrabold uppercase">MINDFUL LIVING</p>
              </div>
            </div>
          </div>

          {/* Center Content: Tagline with Golden Typewriter Effect & Yoga Illustration Showcase */}
          <div className="relative z-10 my-auto py-2 flex flex-col justify-center pr-14 lg:pr-20">
            <div className="mb-2 min-h-[3.5rem] sm:min-h-[4rem]">
              <h2 className="text-lg sm:text-xl font-serif font-normal leading-tight bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#daa520] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(218,165,32,0.4)]">
                {displayedText}
                <span className="inline-block w-[2px] h-5 ml-0.5 bg-[#b8860b] animate-pulse align-middle"></span>
              </h2>
            </div>

            {/* Yoga Carousel Container with increased image width and height */}
            <div className="relative w-full h-48 sm:h-56 flex items-center justify-start z-10 -ml-3 sm:-ml-5">
              <div className="absolute left-0 w-4/5 sm:w-60 h-full p-1 flex items-center justify-center overflow-hidden">
                {yogaImages.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={imgSrc}
                    alt={`Yoga Illustration ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/280x360/ECE7DE/1b3328?text=Illustration';
                    }}
                    className={`absolute w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(18,36,28,0.25)] transition-all duration-1000 ${
                      index === currentYogaIndex ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Footer Slogan & Indicators */}
          <div className="relative z-30 flex flex-col items-start gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              {yogaImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentYogaIndex ? 'w-5 bg-[#1e3d30]' : 'w-1.5 bg-black/25'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: LIGHT PANEL (FORM CONTAINER) ================= */}
        <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between bg-[#F8F6F0] relative overflow-hidden">

          <div className="max-w-sm mx-auto w-full z-20">

            {flowState === 'login' && (
              <div className="bg-[#E6E0D4] p-1 rounded-full flex items-center mb-4 shadow-inner">
                <button
                  type="button"
                  className="flex-1 py-1.5 rounded-full text-xs font-bold bg-[#2c5341] text-white shadow-md transition-all cursor-default"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex-1 py-1.5 rounded-full text-xs font-bold text-[#55635b] hover:text-[#1b3328] transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mb-2.5 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {flowState === 'login' && (
              <>
                <div className="mb-3">
                  <h3 className="text-xl font-serif font-bold text-[#1b3328]">Welcome Back</h3>
                  <p className="text-[11px] text-[#5a6b62] mt-0.5">Please enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-2">
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
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
                      className="w-full pl-10 pr-10 py-2 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-end text-[11px]">
                    <button
                      type="button"
                      onClick={() => { setFlowState('forgot_email'); setErrorMessage(''); }}
                      className="text-[#2c5341] font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-0.5 rounded-xl bg-[#2c5341] hover:bg-[#203e31] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-2.5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10"></div></div>
                  <span className="relative px-3 bg-[#F8F6F0] text-[9px] text-[#738279] uppercase tracking-wider font-semibold">OR</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2 mb-2.5 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-[#1b3328] font-semibold text-xs shadow-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="mt-2 text-center text-[11px] text-[#5a6b62]">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#2c5341] font-bold underline">
                    Sign Up
                  </Link>
                </p>
              </>
            )}

            {flowState === 'forgot_email' && (
              <>
                <div className="mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2c5341]/10 flex items-center justify-center text-[#2c5341] mb-2">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1b3328]">Reset Password</h3>
                  <p className="text-[11px] text-[#5a6b62] mt-0.5">Enter your registered email address and we'll send you an OTP code.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-2.5">
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2c5341] hover:bg-[#203e31] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Send OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => { setFlowState('login'); setErrorMessage(''); }}
                    className="text-[11px] text-[#2c5341] font-bold underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}

            {flowState === 'forgot_otp' && (
              <>
                <div className="mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2c5341]/10 flex items-center justify-center text-[#2c5341] mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1b3328]">Enter OTP Code</h3>
                  <p className="text-[11px] text-[#5a6b62] mt-0.5">We've sent a verification code to <span className="font-semibold text-[#1b3328]">{resetEmail}</span>.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="Enter 4-digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full px-3 py-2 text-center tracking-[1em] text-sm font-bold bg-white border border-black/10 rounded-xl text-[#1b3328] placeholder:tracking-normal placeholder:font-normal placeholder:text-xs placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2c5341] hover:bg-[#203e31] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Verify OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => { setFlowState('forgot_email'); setErrorMessage(''); }}
                    className="text-[11px] text-[#2c5341] font-bold underline cursor-pointer"
                  >
                    Resend Email / Change Email
                  </button>
                </div>
              </>
            )}

            {flowState === 'forgot_new' && (
              <>
                <div className="mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1b3328]">Create New Password</h3>
                  <p className="text-[11px] text-[#5a6b62] mt-0.5">Your identity has been verified. Please create a secure new password.</p>
                </div>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-2">
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="New Password"
                      value={newPasswordData.newPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738279]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm New Password"
                      value={newPasswordData.confirmPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 bg-white border border-black/10 rounded-xl text-xs text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-0.5 rounded-xl bg-[#2c5341] hover:bg-[#203e31] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Update Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}

          </div>

          <div className="mt-3 pt-2.5 border-t border-black/5 grid grid-cols-3 text-center text-[9px] text-[#738279] z-20">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Your data is safe</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Private & Confidential</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
              <span>Built for a better you</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}