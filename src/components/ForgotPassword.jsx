import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Recovery Flow Steps: 1 = Email, 2 = Verify Code/OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer logic for OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(30);
      setCanResend(false);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword || password.length < 8) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#1b3328]/10 shadow-xl relative transition-all my-8">
      
      {/* Header Bar */}
      {step < 4 && (
        <div className="flex items-center justify-between border-b border-[#1b3328]/10 pb-4 mb-6">
          <button 
            onClick={() => {
              if (step === 1) navigate('/support');
              else setStep(step - 1);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4a5850] hover:text-[#1b3328] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#1b3328] bg-[#1b3328]/5 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Account Recovery</span>
          </div>
        </div>
      )}

      {/* STEP 1: ENTER EMAIL */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-[#1b3328]">
              Forgot Password?
            </h2>
            <p className="text-xs text-[#6b7b73] mt-1">
              Enter your registered email address below. We'll send you an OTP code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#f4f1ea]/60 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] focus:bg-white text-[#1b3328] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1b3328] hover:bg-[#2e5b45] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: ENTER OTP */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-[#1b3328]">
              Check Your Mail
            </h2>
            <p className="text-xs text-[#6b7b73] mt-1">
              We sent a 6-digit code to <span className="font-semibold text-[#1b3328]">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-10 h-12 text-center font-bold text-base bg-[#f4f1ea]/70 border border-[#1b3328]/20 rounded-xl outline-none focus:border-[#1b3328] focus:bg-white transition-all shadow-inner"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6b7b73]">Didn't receive email?</span>
              <button
                type="button"
                disabled={!canResend}
                onClick={() => { setTimer(30); setCanResend(false); }}
                className={`font-bold transition-colors ${
                  canResend ? 'text-[#1b3328] hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Resend Code' : `Resend in ${timer}s`}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full py-3 bg-[#1b3328] hover:bg-[#2e5b45] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify Code</span>}
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1b3328]">
              Set New Password
            </h2>
            <p className="text-xs text-[#6b7b73] mt-1">
              Please create a new password for your Manovedh account.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-[#f4f1ea]/60 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] focus:bg-white text-[#1b3328] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#f4f1ea]/60 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] focus:bg-white text-[#1b3328]"
            />

            {confirmPassword && password !== confirmPassword && (
              <p className="text-[10px] text-red-500 font-semibold">Passwords do not match.</p>
            )}

            <button
              type="submit"
              disabled={loading || password !== confirmPassword || password.length < 8}
              className="w-full py-3 bg-[#1b3328] hover:bg-[#2e5b45] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 4 && (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1b3328]">
              Password Reset Successful!
            </h2>
            <p className="text-xs text-[#6b7b73] max-w-xs mx-auto mt-1">
              Your password has been changed. You can now login with your new password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/support')}
            className="w-full py-3 bg-[#1b3328] hover:bg-[#2e5b45] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Back to Support Center
          </button>
        </div>
      )}

    </div>
  );
}