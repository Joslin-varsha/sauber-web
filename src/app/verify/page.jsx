'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  BadgeCheck, 
  Headphones,
  Lock,
  ArrowLeft,
  Clock
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { authApi } from '@/utils/api';

export default function VerifyPage() {
  const router = useRouter();
  
  // Get email from sessionStorage or default fallback
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_email') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (isLoggedIn) {
        router.replace('/profile');
      }
    }
  }, [router]);
  
  // OTP input digits (6 boxes)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const mobileInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const desktopInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Resend Timer (45 seconds)
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Derive canResend state from timeLeft directly
  const canResend = timeLeft <= 0;

  // Load mock OTP on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMockOtp(sessionStorage.getItem('auth_otp') || '');
    }
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Handle OTP digit changes
  const handleOtpChange = (value, index, isMobile) => {
    // Only accept numeric inputs
    if (value !== '' && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if we typed a digit
    if (value !== '' && index < 5) {
      const refs = isMobile ? mobileInputRefs : desktopInputRefs;
      refs[index + 1].current?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index, isMobile) => {
    if (e.key === 'Backspace') {
      const refs = isMobile ? mobileInputRefs : desktopInputRefs;
      if (otp[index] === '' && index > 0) {
        // Go back and clear the previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        refs[index - 1].current?.focus();
      } else {
        // Just clear current digit
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP Resend action
  const handleResend = () => {
    if (!canResend) return;
    setTimeLeft(45);
    setError('');
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 5000);
  };

  // Submit and verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.verifyOtp(email, otpCode);
      
      // Set logged-in state and store token/user info
      sessionStorage.setItem('is_logged_in', 'true');
      sessionStorage.setItem('just_logged_in', 'true');
      if (response.token) {
        sessionStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      
      // Redirect to dynamic return URL, or /home on mobile, /profile on desktop
      const storedRedirect = sessionStorage.getItem('redirect_after_login');
      sessionStorage.removeItem('redirect_after_login');
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const redirectUrl = storedRedirect || (isMobile ? '/home' : '/profile');
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: 'Trusted Professionals',
      desc: 'Verified & background-checked',
      icon: ShieldCheck,
    },
    {
      title: 'Easy & Convenient',
      desc: 'Book in minutes, manage online',
      icon: Calendar,
    },
    {
      title: 'Quality Guaranteed',
      desc: 'Top-quality cleaning every time',
      icon: BadgeCheck,
    },
    {
      title: '24/7 Support',
      desc: "We're here to help anytime",
      icon: Headphones,
    },
  ];

  return (
    <div className="min-h-screen bg-white md:bg-[#FAFCFF] relative">
      
      {/* MOBILE RESPONSIVE LAYOUT (Shown only on mobile) */}
      <div className="flex md:hidden flex-col justify-between min-h-screen bg-white px-6 py-8 relative">
        {/* Floating Back arrow linking to login */}
        <Link 
          href="/login" 
          className="absolute top-6 left-6 text-slate-700 hover:text-primary transition-colors cursor-pointer z-20 flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-50"
        >
          <span className="text-[20px] font-bold font-sans text-slate-650">&lt;</span>
        </Link>

        <div className="w-full flex-grow flex flex-col justify-center max-w-sm mx-auto gap-5 mt-4">
          {/* Custom SVG Illustration of Blue Envelope with Green Checkmark */}
          <div className="w-full flex justify-center mb-1 select-none pointer-events-none">
            <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-36 w-auto object-contain">
              {/* Background Soft Sky Cloud Shapes */}
              <path d="M40 70C40 50 60 40 80 40C100 40 110 50 120 40C130 30 145 35 150 50C155 65 145 80 140 85C135 90 40 90 40 70Z" fill="#F0F7FF" opacity="0.8" />
              <path d="M15 95C15 85 28 80 38 80C48 80 52 85 58 80C64 75 72 78 75 85C78 92 72 100 70 102C68 104 15 104 15 95Z" fill="#EBF3FC" opacity="0.6" />
              
              {/* Floating Stars */}
              <path d="M55 25L57.5 30L62.5 30.5L58.5 34L59.8 39L55 36.3L50.2 39L51.5 34L47.5 30.5L52.5 30L55 25Z" fill="#93C5FD" opacity="0.7" />
              <path d="M148 78L149.5 81L152.5 81.3L150.1 83.4L150.9 86.4L148 84.8L145.1 86.4L145.9 83.4L143.5 81.3L146.5 81L148 78Z" fill="#93C5FD" opacity="0.7" />
              
              {/* Open Blue Envelope Back */}
              <rect x="35" y="65" width="100" height="60" rx="10" fill="#3B82F6" />
              <path d="M35 70L85 98L135 70V65C135 62.2 132.8 60 130 60H40C37.2 60 35 62.2 35 70Z" fill="#2563EB" />
              
              {/* White Letter Sticking Out with Shield inside */}
              <g transform="translate(47, 45)">
                <rect width="76" height="55" rx="6" fill="white" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))" />
                {/* Shield inside Letter */}
                <path d="M38 15C38 15 47 18 47 24C47 32 38 37 38 37C38 37 29 32 29 24C29 18 38 15 38 15Z" fill="#3B82F6" />
                <path d="M35.5 28.5L37.5 30.5L41.5 25.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Decorative lines on card */}
                <line x1="12" y1="12" x2="28" y2="12" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="20" x2="24" y2="20" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="28" x2="20" y2="28" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              
              {/* Envelope Flap Overlay Front */}
              <path d="M35 125L85 98L135 125V75L85 98L35 75V125Z" fill="#3B82F6" opacity="0.9" />
              <path d="M35 125V75L85 98L135 75V125C135 127.8 132.8 130 130 130H40C37.2 130 35 127.8 35 125Z" fill="#1D4ED8" />

              {/* Green Checkmark Circle Badge */}
              <circle cx="120" cy="110" r="16" fill="#10B981" stroke="white" strokeWidth="3" />
              <path d="M113 110L118 115L127 105" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="font-display font-extrabold text-[25px] text-[#092040] tracking-tight leading-tight">
              Verify OTP
            </h2>
            <p className="font-sans text-[13.5px] text-slate-400 font-medium px-4 leading-relaxed">
              Enter the 6-digit code sent to <span className="text-[#137DC5] font-bold">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
            {error && (
              <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-center">
                {error}
              </div>
            )}
            {resendSuccess && (
              <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-emerald-100/50 text-center">
                A new 6-digit OTP code has been sent!
              </div>
            )}
            {mockOtp && (
              <div className="bg-blue-50 text-[#137DC5] px-4 py-3 rounded-xl font-sans text-xs font-bold border border-[#137DC5]/20 text-center">
                Mock OTP for testing: <span className="underline select-all text-sm tracking-wider ml-1 font-mono">{mockOtp}</span>
              </div>
            )}
            
            {/* OTP Digit Box Inputs */}
            <div className="flex justify-center gap-2 sm:gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={mobileInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx, true)}
                  onKeyDown={(e) => handleKeyDown(e, idx, true)}
                  className="w-11 h-13 sm:w-12 sm:h-14 bg-white border border-slate-200 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl text-center font-display font-bold text-[19px] text-[#092040] outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Resend OTP Timer section */}
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] text-slate-400 font-bold">
              {canResend ? (
                <span>
                  Didn&apos;t receive the code?{' '}
                  <button 
                    type="button"
                    onClick={handleResend}
                    className="text-[#137DC5] hover:text-[#0C5F97] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </span>
              ) : (
                <span>
                  Didn&apos;t receive the code? Resend OTP in <span className="text-[#137DC5] font-bold">{formatTime(timeLeft)}</span>
                </span>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-sm text-white transition-all shadow-md flex items-center justify-center cursor-pointer mt-1"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* DESKTOP LAYOUT (Shown only on screens md and up) */}
      <div className="hidden md:flex flex-col min-h-screen bg-[#FAFCFF]">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content Container */}
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-4 lg:py-5 flex flex-col gap-6 lg:gap-8 justify-center">
          
          {/* Split Card */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Visual Area with Image & CSS Fallback */}
            <div className="relative w-full h-full min-h-[320px] md:min-h-[450px] bg-[#F0F7FF] flex items-center justify-center overflow-hidden">
              <img 
                src="/login.png" 
                alt="Sauber Visual Cleaner" 
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {/* Fallback pattern if cleaner-login.png doesn't exist */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#137DC5]/10 to-sky-100/50 flex flex-col justify-between p-8 select-none z-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#137DC5] flex items-center justify-center text-white text-[12px] font-bold">S</div>
                    <span className="text-[14px] font-bold text-[#092040] uppercase tracking-wide">Sauber & Fix</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/90 px-3 py-1 rounded-full shadow-sm">Trusted Home Services</span>
                </div>
                
                <div className="my-auto flex flex-col items-center text-center gap-4 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100/50 text-[#137DC5]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-xs">
                    <h3 className="font-display font-extrabold text-[#092040] text-base">Professional Cleaning</h3>
                    <p className="font-sans text-[12px] text-slate-400 font-semibold leading-relaxed">
                      Book background-checked professionals for your home cleaning in Germany.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>Verified Professionals</span>
                  <span>Germany Coverage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Verification Form */}
            <div className="p-8 sm:p-12 flex flex-col justify-center gap-6">
              
              {/* Logo */}
              <div className="flex items-center justify-center md:justify-start">
                <img src="/logo.png" alt="Sauber Logo" className="h-9 w-auto object-contain" />
              </div>

              {/* Heading */}
              <div className="text-center md:text-left flex flex-col gap-1">
                <h2 className="font-display font-extrabold text-2xl text-[#092040] tracking-tight">
                  Verify Your Email
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                  We&apos;ve sent a 6-digit OTP to <span className="text-[#137DC5] font-bold">{email}</span>. Please enter it below to verify your account.
                </p>
              </div>

              {/* Verification Inputs Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-1">
                {error && (
                  <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-left">
                    {error}
                  </div>
                )}
                {resendSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-emerald-100/50 text-left">
                    A new 6-digit OTP code has been sent!
                  </div>
                )}
                {mockOtp && (
                  <div className="bg-blue-50 text-[#137DC5] px-4 py-3 rounded-xl font-sans text-xs font-bold border border-[#137DC5]/20 text-left">
                    Mock OTP for testing: <span className="underline select-all text-sm tracking-wider ml-1 font-mono">{mockOtp}</span>
                  </div>
                )}
                
                {/* Digit Inputs Row */}
                <div className="flex flex-col gap-2">
                  <span className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide text-center md:text-left">
                    Enter OTP
                  </span>
                  <div className="flex justify-between md:justify-start gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={desktopInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx, false)}
                        onKeyDown={(e) => handleKeyDown(e, idx, false)}
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 border-2 border-slate-200 focus:border-[#137DC5] focus:bg-white focus:ring-1 focus:ring-[#137DC5]/20 rounded-xl text-center font-display font-extrabold text-lg sm:text-xl text-[#092040] outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Ticking Countdown Timer */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400 font-semibold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {canResend ? (
                    <span>
                      Didn&apos;t receive the code?{' '}
                      <button 
                        type="button"
                        onClick={handleResend}
                        className="text-[#137DC5] hover:text-[#0C5F97] hover:underline font-bold transition-colors cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </span>
                  ) : (
                    <span>
                      Didn&apos;t receive the code? Resend OTP in <span className="text-[#137DC5] font-bold">{formatTime(timeLeft)}</span>
                    </span>
                  )}
                </div>

                {/* Verify Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-xs sm:text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>{isLoading ? 'Verifying & Continuing...' : 'Verify & Continue'}</span>
                </button>
              </form>

              <hr className="border-slate-100" />

              {/* Back to Login Link */}
              <div className="flex justify-center md:justify-start">
                <Link href="/login" className="flex items-center gap-2 font-sans text-xs text-[#137DC5] hover:text-[#0C5F97] font-bold transition-colors group cursor-pointer">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back to Login</span>
                </Link>
              </div>

              {/* Data Protection Safe info block */}
              <div className="bg-[#EBF3FC]/60 border border-[#D9E9FB] rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#137DC5] flex-shrink-0 shadow-sm">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <span className="font-sans text-[11px] text-[#0A507F] font-bold leading-normal">
                  Your data is safe with us. We never share your information.
                </span>
              </div>

            </div>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/60 text-[#137DC5] flex items-center justify-center flex-shrink-0">
                    <FeatIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-sans font-bold text-xs sm:text-[13px] text-[#092040]">
                      {feat.title}
                    </h4>
                    <span className="font-sans text-[10px] sm:text-[11px] text-slate-400 font-semibold leading-normal">
                      {feat.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </main>

        {/* Footer copyright */}
        <footer className="w-full border-t border-slate-100 bg-white py-4 sm:py-5 mt-auto">
          <div className="mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[11px] sm:text-xs text-slate-400 font-semibold">
              © 2025 Sauber. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="font-sans text-[11px] sm:text-xs text-slate-400 hover:text-[#137DC5] font-semibold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="font-sans text-[11px] sm:text-xs text-slate-400 hover:text-[#137DC5] font-semibold transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
