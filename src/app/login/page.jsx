'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  ShieldCheck, 
  Calendar, 
  BadgeCheck, 
  Headphones
} from 'lucide-react';
import Header from '@/components/Header';
import { authApi } from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(email);
      
      // Store email and mock OTP in sessionStorage to display/use on the verification page
      sessionStorage.setItem('auth_email', email);
      if (response.data && response.data.otp) {
        sessionStorage.setItem('auth_otp', response.data.otp);
      }
      
      // Route to verification screen
      router.push('/verify');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
    <div className="min-h-screen bg-white md:bg-[#FAFCFF]">
      
      {/* MOBILE RESPONSIVE LAYOUT (Shown only on mobile) */}
      <div className="flex md:hidden flex-col justify-between min-h-screen bg-white px-6 py-8">
        {/* Floating Back arrow is not on the login screen mockup, only register and verify */}
        
        <div className="w-full flex-grow flex flex-col justify-center max-w-sm mx-auto gap-5">
          {/* Top Illustration */}
          <div className="w-full flex justify-center mb-1">
            <img 
              src="/onboarding_cleaner.png" 
              alt="Sauber Clean House" 
              className="h-44 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = '/login.png'; }}
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center flex flex-col gap-1">
            <h2 className="font-display font-extrabold text-[25px] text-[#092040] tracking-tight">
              Welcome Back
            </h2>
            <span className="font-sans text-[14.5px] text-[#137DC5] font-bold">
              Login to continue
            </span>
          </div>

          {/* Form */}
          {error && (
            <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 mt-2">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-bold text-[11.5px] text-slate-450 uppercase tracking-wider text-left">
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

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
              {!isLoading && <span className="text-base font-extrabold">→</span>}
            </button>
          </form>

          {/* Secure & protected login */}
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11.5px] font-bold mt-1">
            <div className="w-4 h-4 rounded-full border border-blue-100 flex items-center justify-center text-[#137DC5] bg-blue-50/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#137DC5]" />
            </div>
            <span>Secure & protected login</span>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center w-full">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold font-sans">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Foot Link */}
          <p className="font-sans text-[13px] text-slate-400 font-semibold text-center mb-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#137DC5] hover:text-[#0C5F97] font-bold transition-colors cursor-pointer ml-0.5">
              Register
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
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium p-3 grid grid-cols-1 md:grid-cols-2 items-center gap-2">
            
            {/* Left Column: Visual Area with Image */}
            <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-[#F0F7FF] flex items-center justify-center">
              <img 
                src="/login.png" 
                alt="Sauber Visual Cleaner" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Absolute circular checkmark badge */}
              <div className="absolute bottom-10 right-28 z-20 bg-white/95 p-1.5 rounded-full shadow-md flex items-center justify-center border border-slate-100">
                <div className="bg-[#137DC5] text-white p-1 rounded-full">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Right Column: Form Area */}
            <div className="p-6 sm:p-10 flex flex-col justify-center gap-6">
              
              {/* Logo */}
              <div className="flex items-center justify-center">
                <img src="/logo.png" alt="Sauber Logo" className="h-9 w-auto object-contain" />
              </div>

              {/* Heading */}
              <div className="text-center flex flex-col gap-1.5">
                <h2 className="font-display font-extrabold text-2xl sm:text-[26px] text-[#092040] tracking-tight">
                  Welcome Back
                </h2>
                <p className="font-sans text-xs sm:text-[13px] text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
                  Login to your Sauber account to manage your bookings and cleaning services.
                </p>
              </div>

              {/* Form */}
              {error && (
                <div className="bg-red-50 text-red-650 px-4 py-3 rounded-xl font-sans text-xs font-bold border border-red-100/50 text-center max-w-md w-full mx-auto">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md w-full mx-auto">
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-bold text-[11px] text-[#092040]/70 uppercase tracking-wider text-left">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#137DC5]" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-sans font-bold text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>

              {/* OTP Notice */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11.5px] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#137DC5]" />
                <span>We&apos;ll send a secure OTP to your email</span>
              </div>

              <div className="border-t border-slate-100 my-1 max-w-md w-full mx-auto"></div>

              {/* Foot Link */}
              <p className="font-sans text-[12.5px] text-slate-400 font-bold text-center">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#137DC5] hover:text-[#0C5F97] font-extrabold transition-colors cursor-pointer ml-0.5">
                  Create Account
                </Link>
              </p>

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
