'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User,
  Phone,
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  BadgeCheck, 
  Headphones,
  Lock,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import { authApi } from '@/utils/api';

export default function RegisterPage() {
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (isLoggedIn) {
        router.replace('/profile');
      }
    }
  }, [router]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !fullName || !phone) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.register(fullName, email, phone);
      
      // Store credentials and mock OTP in sessionStorage
      sessionStorage.setItem('auth_email', email);
      sessionStorage.setItem('auth_name', fullName);
      if (response.data && response.data.otp) {
        sessionStorage.setItem('auth_otp', response.data.otp);
      }
      
      // Route to verification
      router.push('/verify');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <span className="text-[18px] font-bold font-sans text-slate-600">&lt;</span>
        </Link>

        <div className="w-full flex-grow flex flex-col justify-center max-w-sm mx-auto gap-4 mt-4">
          {/* Top Illustration */}
          <div className="w-full flex justify-center mb-1">
            <img 
              src="/onboarding_cleaner.png" 
              alt="Sauber Clean House" 
              className="h-36 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = '/login.png'; }}
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center flex flex-col gap-1">
            <h2 className="font-display font-extrabold text-[25px] text-[#092040] tracking-tight leading-tight">
              Register
            </h2>
            <span className="font-sans text-[13.5px] text-slate-400 font-bold">
              Create your account
            </span>
          </div>

          {/* Form */}
          {error && (
            <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-bold text-[11px] text-slate-500 uppercase tracking-wider text-left">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-[#137DC5]" />
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl font-sans text-sm text-slate-800 transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-bold text-[11px] text-slate-500 uppercase tracking-wider text-left">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-[#137DC5]" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl font-sans text-sm text-slate-800 transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-bold text-[11px] text-slate-500 uppercase tracking-wider text-left">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-4 w-5 h-5 text-[#137DC5]" />
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl font-sans text-sm text-slate-800 transition-all outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-bold text-[11px] text-slate-500 uppercase tracking-wider text-left">
                Language
              </label>
              <div className="relative flex items-center">
                {/* Translate character icon */}
                <span className="absolute left-4 text-[#137DC5] font-sans font-extrabold text-xs select-none">文A</span>
                <select 
                  required
                  defaultValue="en"
                  className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl font-sans text-sm text-slate-800 transition-all outline-none shadow-sm appearance-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
                <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center w-full">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-450 text-xs font-bold font-sans">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Foot Link */}
          <p className="font-sans text-[13px] text-slate-400 font-semibold text-center mb-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#137DC5] hover:text-[#0C5F97] font-bold transition-colors cursor-pointer ml-0.5">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* DESKTOP LAYOUT (Shown only on screens md and up) */}
      <div className="hidden md:flex flex-col min-h-screen bg-[#FAFCFF]">
        {/* Header */}
        <Header />

        {/* Main Container */}
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

            {/* Right Column: Form Area */}
            <div className="p-8 sm:p-12 flex flex-col justify-center gap-5">
              
              {/* Logo */}
              <div className="flex items-center justify-center md:justify-start">
                <img src="/logo.png" alt="Sauber Logo" className="h-9 w-auto object-contain" />
              </div>

              {/* Heading */}
              <div className="text-center md:text-left flex flex-col gap-1">
                <h2 className="font-display font-extrabold text-2xl text-[#092040] tracking-tight">
                  Create Your Account
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                  Create your Sauber account to book trusted home cleaning services.
                </p>
              </div>

              {/* Form */}
              {error && (
                <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-left">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:bg-white rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:bg-white rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:bg-white rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-xs sm:text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group mt-2"
                >
                  <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>

              {/* OTP Notice */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-[11px] font-bold">
                <ShieldCheck className="w-4.5 h-4.5 text-[#137DC5]" />
                <span>We&apos;ll send a secure OTP to your email</span>
              </div>

              <hr className="border-slate-100" />

              {/* Foot Link */}
              <p className="font-sans text-xs text-slate-400 font-bold text-center md:text-left">
                Already have an account?{' '}
                <Link href="/login" className="text-[#137DC5] hover:text-[#0C5F97] underline transition-colors cursor-pointer">
                  Login
                </Link>
              </p>

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
                <div key={idx} className="flex items-center sm:items-start gap-3 sm:gap-4">
                  <div className="text-[#137DC5] flex-shrink-0 mt-0.5">
                    <FeatIcon className="w-5.5 h-5.5 stroke-[1.8]" />
                  </div>
                  <div className="flex flex-col gap-0.5 text-left">
                    <h4 className="font-sans font-bold text-[13px] text-[#092040] leading-tight">
                      {feat.title}
                    </h4>
                    <span className="font-sans text-[11px] text-slate-400 font-semibold leading-snug">
                      {feat.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </main>

        {/* Footer copyright */}
        <footer className="w-full py-4 sm:py-5 mt-auto flex items-center justify-center">
          <div className="font-sans text-[11.5px] text-slate-400 font-semibold flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 text-center">
            <span>© 2025 Sauber. All rights reserved.</span>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:text-[#137DC5] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <Link href="/terms" className="hover:text-[#137DC5] transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </footer>
      </div>

    </div>
  );
}
