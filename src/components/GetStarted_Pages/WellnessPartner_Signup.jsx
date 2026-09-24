import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

// CORRECT PATHS FOR ASSETS FROM GETSTARTED_PAGES FOLDER
import counsellor1 from '../../assets/councellor-1.png';
import counsellor2 from '../../assets/councellor-2.png';
import counsellor3 from '../../assets/councellor-3.png';
import counsellor4 from '../../assets/councellor-4.png';

const LOCAL_STORAGE_PARTNERS_KEY = 'manovedh_wellness_partners';

export default function CounsellorSignup({ onBackToHome, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const counsellorImages = [
    counsellor1,
    counsellor2,
    counsellor3,
    counsellor4
  ];

  // Slow smooth automatic transition every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % counsellorImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [counsellorImages.length]);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    email: '',
    address: '',
    profession: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    certificateName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.size <= 5 * 1024 * 1024) {
        setFormData({ ...formData, certificateName: file.name });
      } else {
        alert('Please upload a valid PDF under 5MB.');
      }
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please check.');
      return;
    }

    const existingPartners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY)) || [];
    const emailExists = existingPartners.some(p => p.email.toLowerCase() === formData.email.toLowerCase());

    if (emailExists) {
      setErrorMessage('An account with this email already exists. Please login.');
      return;
    }

    const newPartner = { ...formData };
    existingPartners.push(newPartner);
    localStorage.setItem(LOCAL_STORAGE_PARTNERS_KEY, JSON.stringify(existingPartners));

    setSuccessMessage('Registration successful! Redirecting to login...');
    setTimeout(() => {
      if (onSwitchToLogin) onSwitchToLogin();
    }, 2000);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#12241C] flex flex-col items-center justify-center py-2 px-4 font-sans relative overflow-hidden">
      
      <div className="w-full max-w-5xl mb-2 flex items-center justify-between z-30 px-1">
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <span className="text-[11px] font-semibold px-3 py-1 bg-white/10 text-[#ffd700] rounded-full border border-white/10 backdrop-blur-md">
          Professional Registration
        </span>
      </div>

      <div className="relative w-full max-w-5xl bg-[#ECE7DE] rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#2e5b45]/25">

        {/* LEFT SIDE: IMAGES WITH SMOOTH SLOW FADE ANIMATION */}
        <div className="lg:col-span-5 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[#1a382c] text-white">
          
          {counsellorImages.map((imgSrc, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-35 scale-105 filter brightness-95' 
                  : 'opacity-0 scale-100'
              }`}
              style={{ 
                backgroundImage: `url(${imgSrc})`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '1.5s',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            ></div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#12241C] via-[#1a382c]/80 to-[#1a382c]/50"></div>

          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#2c5341] flex items-center justify-center text-white font-bold shadow-md text-xs border border-white/25">
                🌿
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight font-serif">Manovedh</h1>
                <p className="text-[6px] tracking-[0.25em] text-[#ffd700] font-extrabold uppercase">EXPERT NETWORK</p>
              </div>
            </div>

            {/* SMOOTH ANIMATED INDICATOR DOTS */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {counsellorImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentImageIndex ? 'bg-[#ffd700] w-4' : 'bg-white/50 w-1.5'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-20 my-auto py-6">
            <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight mb-3 text-[#F8F6F0]">
              Join our community of professional counsellors
            </h2>
            <p className="text-[11px] text-[#d1dcd5] mb-5 leading-relaxed">
              Help make a difference in people's lives through trusted guidance and secure sessions.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-sm transition-transform hover:translate-x-1 duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
                <span className="text-[11px] font-medium">Flexible schedule</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-sm transition-transform hover:translate-x-1 duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
                <span className="text-[11px] font-medium">Global reach</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-sm transition-transform hover:translate-x-1 duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
                <span className="text-[11px] font-medium">Professional growth</span>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-between text-[9px] text-[#a3b8ac]">
            <span>Empowering minds, transforming lives.</span>
            <span className="text-[#ffd700] font-semibold tracking-wider">Expert {currentImageIndex + 1}/4</span>
          </div>
        </div>

        {/* RIGHT SIDE: COMPACT FORM CONTAINER */}
        <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-[#F8F6F0] relative overflow-y-auto max-h-[580px]">

          <div className="max-w-md mx-auto w-full z-20">

            {/* TOGGLE PILL SWITCH */}
            <div className="bg-[#E6E0D4] p-1 rounded-full flex items-center mb-4 shadow-inner">
              <button 
                type="button"
                onClick={() => { if (onSwitchToLogin) onSwitchToLogin(); }}
                className="flex-1 py-1 text-center rounded-full text-xs font-bold text-[#5a6b62] hover:text-[#1b3328] transition-all cursor-pointer bg-transparent border-none"
              >
                Login
              </button>
              <div className="flex-1 py-1 text-center rounded-full text-xs font-bold bg-[#2c5341] text-white shadow-md cursor-pointer transition-all">
                Sign Up
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-serif font-bold text-[#1b3328]">Join as a Counsellor</h3>
              <p className="text-[10px] text-[#5a6b62] mt-0.5">
                Create your professional account. Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { if (onSwitchToLogin) onSwitchToLogin(); }} 
                  className="text-[#2c5341] font-bold underline cursor-pointer bg-transparent border-none p-0 inline"
                >
                  Sign in
                </button>
              </p>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-700 text-[11px] font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 text-[11px] font-medium">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              
              {/* PERSONAL INFORMATION */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#738279] block mb-1.5">
                  👤 Personal Information
                </label>
                
                <div className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <p className="text-[8px] text-[#738279] mt-0.5">YOU MUST BE AT LEAST 21 YEARS OLD TO REGISTER</p>
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                  </div>
                </div>
              </div>

              {/* PROFESSIONAL INFORMATION */}
              <div className="pt-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#738279] block mb-1.5">
                  🏛️ Professional Information
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <select
                    name="profession"
                    required
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                  >
                    <option value="">Profession</option>
                    <option value="Psychologist">Clinical Psychologist</option>
                    <option value="Therapist">Licensed Therapist</option>
                    <option value="Counsellor">Career/Life Counsellor</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                  </select>

                  <input
                    type="text"
                    name="specialization"
                    required
                    placeholder="Specialization (e.g. Anxiety)"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                  />
                </div>
              </div>

              {/* ACCOUNT SECURITY */}
              <div className="pt-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#738279] block mb-1.5">
                  🔒 Account Security
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-9 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-9 py-2 bg-white border border-black/10 rounded-xl text-[11px] text-[#1b3328] placeholder-[#8a9890] focus:outline-none focus:ring-2 focus:ring-[#2c5341]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#738279] hover:text-[#1b3328] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* VERIFICATION */}
              <div className="pt-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#738279] block mb-1.5">
                  🛡️ Verification
                </label>
                
                <label className="border border-dashed border-black/20 bg-white hover:bg-white/80 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-[#2c5341] mb-1" />
                  <span className="text-[11px] font-bold text-[#1b3328]">
                    {formData.certificateName ? formData.certificateName : 'Click to upload certificate'}
                  </span>
                  <span className="text-[8px] text-[#738279]">PDF ONLY (MAX 5MB)</span>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px] text-[#5a6b62]">
                <input type="checkbox" required id="terms" className="rounded border-black/20 text-[#2c5341] focus:ring-[#2c5341]" />
                <label htmlFor="terms" className="cursor-pointer">
                  By registering, I agree to the <span className="underline font-semibold">Terms</span> & <span className="underline font-semibold">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#1e3d30] to-[#2c5341] hover:from-[#152b22] hover:to-[#203e31] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Register as Counsellor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>

          </div>

          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-center gap-2 text-[9px] text-[#738279]">
            <ShieldCheck className="w-3 h-3 text-[#2c5341]" />
            <span>Secure Professional Verification & Data Encryption</span>
          </div>

        </div>

      </div>
    </div>
  );
}