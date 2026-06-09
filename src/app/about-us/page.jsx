'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  CheckCircle,
  Sparkles,
  Sliders,
  CreditCard,
  Headphones,
  Users,
  Award,
  Heart,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from '@/components/Footer';
import DashboardFooter from '@/components/DashboardFooter';

export default function AboutUsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0); // First item expanded by default as in mockup

  // Check login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(sessionStorage.getItem('is_logged_in') === 'true');
    }
  }, []);

  const toggleFAQ = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // collapse if clicked again
    } else {
      setExpandedIndex(index);
    }
  };

  const faqData = [
    {
      question: "How do I book a cleaning service?",
      answer: "Booking is simple! Choose your service, select a convenient date and time, and confirm your booking in just a few clicks.",
      icon: Calendar
    },
    {
      question: "Are your cleaners verified?",
      answer: "Absolutely. Every cleaner on our platform goes through a strict vetting process, including identity verification, background checks, and professional training to ensure your peace of mind.",
      icon: ShieldCheck
    },
    {
      question: "What cleaning services do you provide?",
      answer: "We offer a wide range of cleaning services, including standard home cleaning, deep cleaning, move-in/move-out cleaning, window cleaning, and office cleaning to fit all your needs.",
      icon: Sparkles
    },
    {
      question: "Can I reschedule or cancel my booking?",
      answer: "Yes, you can easily reschedule or cancel your booking through your dashboard. Cancellations made at least 24 hours in advance are completely free of charge.",
      icon: Calendar
    },
    {
      question: "Do I need to provide cleaning supplies?",
      answer: "No, you don't need to provide anything. Our workers can bring their own professional cleaning supplies if selected during booking, or they can use the supplies available in your home if preferred.",
      icon: Sliders
    },
    {
      question: "How are payments handled?",
      answer: "Payments are processed securely online after the service is completed. We support credit cards, PayPal, and direct bank transfers. No cash payments are required.",
      icon: CreditCard
    },
    {
      question: "What if I'm not satisfied with the cleaning?",
      answer: "Your satisfaction is our priority. If you're not happy with the service, let us know within 24 hours and we'll send a cleaner back to re-clean the areas for free.",
      icon: CheckCircle
    },
    {
      question: "Is customer support available?",
      answer: "Yes, our dedicated customer support team is available 7 days a week via email or phone to help you with any questions or issues you might have.",
      icon: Headphones
    }
  ];

  const statsData = [
    {
      number: "25,000+",
      title: "Happy Customers",
      description: "Trusted by thousands of families and professionals.",
      icon: Users
    },
    {
      number: "5,000+",
      title: "Verified Cleaners",
      description: "Carefully screened and trained cleaning experts.",
      icon: ShieldCheck
    },
    {
      number: "100,000+",
      title: "Cleanings Completed",
      description: "Delivering spotless results every single day.",
      icon: Calendar
    },
    {
      number: "4.8/5",
      title: "Average Rating",
      description: "High satisfaction from our happy customers.",
      icon: Star
    }
  ];

  const valuesData = [
    {
      title: "Integrity",
      description: "We believe in honesty, transparency, and doing what's right.",
      icon: ShieldCheck
    },
    {
      title: "Care",
      description: "We treat every home and customer with respect and care.",
      icon: Heart
    },
    {
      title: "Excellence",
      description: "We are committed to delivering the highest quality every time.",
      icon: Award
    },
    {
      title: "Empowerment",
      description: "We empower our cleaners with opportunities and support to grow.",
      icon: Users
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      {/* 1. Conditional Navigation Header based on login status */}
      {isLoggedIn ? <DashboardHeader /> : <Header />}

      {/* 2. Main Page Content */}
      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= SECTION 1: ABOUT US HERO ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 md:mb-28">
            <div className="lg:col-span-6 text-left flex flex-col gap-5">
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                About Us
              </span>
              <h1 className="font-sans font-extrabold text-slate-800 text-3xl md:text-5xl leading-[1.15] tracking-tight">
                Making Homes Cleaner, <br />Lives Easier.
              </h1>
              <p className="font-sans text-[13.5px] leading-relaxed text-slate-500 max-w-lg">
                Sauber connects you with trusted, professional cleaners so you can enjoy a spotless home and more free time for the things that matter most.
              </p>

              {/* Three Value Bullet Points */}
              <div className="flex flex-col gap-4 mt-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50/80 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-50/50">
                    <ShieldCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-[13.5px]">Trusted Professionals</h3>
                    <p className="font-sans text-xs text-slate-450 mt-0.5">Every cleaner is verified and background-checked.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50/80 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-50/50">
                    <Calendar className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-[13.5px]">Easy & Convenient</h3>
                    <p className="font-sans text-xs text-slate-450 mt-0.5">Book in minutes and manage everything online.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50/80 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-50/50">
                    <CheckCircle className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-[13.5px]">Quality Guaranteed</h3>
                    <p className="font-sans text-xs text-slate-450 mt-0.5">We ensure top-quality service every time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand Image */}
            <div className="lg:col-span-6 relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[450px] rounded-2xl overflow-hidden shadow-premium hover-zoom border border-slate-100/50 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about_us_cleaner.png"
                alt="Smiling Professional Cleaner"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* ================= SECTION 2: OUR STORY ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 md:mb-28">
            {/* Left Hand Image */}
            <div className="lg:col-span-6 order-2 lg:order-1 relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[450px] rounded-2xl overflow-hidden shadow-premium hover-zoom border border-slate-100/50 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about_us_living_room.png"
                alt="Cozy Clean Living Room"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Hand Text Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 text-left flex flex-col gap-4">
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                Our Story
              </span>
              <h2 className="font-sans font-extrabold text-slate-800 text-2xl md:text-4xl leading-tight tracking-tight">
                Built on Trust, <br />Focused on You
              </h2>
              <div className="flex flex-col gap-4 font-sans text-[13.5px] leading-relaxed text-slate-500 mt-2">
                <p>
                  Sauber was founded with a simple mission: to take the hassle out of cleaning and bring more time back to people's lives.
                </p>
                <p>
                  We know how important a clean, comfortable home is. That's why we've built a platform that connects you with reliable cleaning professionals who take pride in their work.
                </p>
                <p>
                  From our easy booking process to our dedicated support, we're here to make every step simple, seamless, and satisfying.
                </p>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: KEY STATISTICS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-28">
            {statsData.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100/80 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-50/80 text-primary rounded-full flex items-center justify-center mb-4 border border-blue-50/50">
                    <StatIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="font-sans font-extrabold text-[#137DC5] text-3xl leading-none">
                    {stat.number}
                  </span>
                  <h3 className="font-sans font-bold text-slate-800 text-[13.5px] mt-2.5">
                    {stat.title}
                  </h3>
                  <p className="font-sans text-[11px] leading-normal text-slate-400 mt-1 max-w-[180px]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* ================= SECTION 4: OUR VALUES ================= */}
          <section className="flex flex-col items-center mb-20 md:mb-28">
            <div className="text-center flex flex-col gap-2 mb-10 max-w-lg">
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                Our Values
              </span>
              <h2 className="font-sans font-extrabold text-slate-800 text-2xl md:text-3xl tracking-tight">
                The Principles That Guide Us
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {valuesData.map((value, idx) => {
                const ValueIcon = value.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100/80 rounded-2xl p-6 md:p-7 flex flex-col items-center text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-blue-50/80 text-primary rounded-full flex items-center justify-center mb-4 border border-blue-50/50">
                      <ValueIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="font-sans font-bold text-slate-800 text-[14px]">
                      {value.title}
                    </h3>
                    <p className="font-sans text-[11.5px] leading-relaxed text-slate-450 mt-2">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION 5: FREQUENTLY ASKED QUESTIONS ================= */}
          <section id="faq" className="flex flex-col items-center mb-16 md:mb-24 scroll-mt-20">
            <div className="text-center flex flex-col gap-2 mb-10 max-w-lg">
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                FAQ
              </span>
              <h2 className="font-sans font-extrabold text-slate-800 text-2xl md:text-3xl tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-sans text-xs md:text-[13px] text-slate-450 leading-relaxed mt-0.5">
                Everything You Need to Know About Our Cleaning Services
              </p>
            </div>

            {/* Accordion List Container */}
            <div className="flex flex-col gap-3.5 w-full max-w-3xl">
              {faqData.map((item, idx) => {
                const FAQIcon = item.icon;
                const isExpanded = expandedIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all duration-300 ${
                      isExpanded
                        ? 'bg-[#F4F8FD] border-[#B3D4EE] shadow-sm'
                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {/* Collapsed/Expanded Header Toggle */}
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-4 flex-grow pr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isExpanded ? 'bg-[#E3EFFB] text-primary' : 'bg-blue-50/50 text-[#137DC5]'
                        }`}>
                          <FAQIcon className="w-5 h-5 stroke-[2]" />
                        </div>
                        <span className={`font-sans font-bold text-[13.5px] md:text-[14.5px] tracking-tight ${
                          isExpanded ? 'text-slate-850' : 'text-slate-700'
                        }`}>
                          {item.question}
                        </span>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-primary stroke-[2.5]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                        )}
                      </div>
                    </button>

                    {/* Answer Area (Expandable) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-40 border-t border-[#B3D4EE]/40' : 'max-h-0'
                      }`}
                    >
                      <div className="p-4 md:p-5 pl-18 md:pl-18 pr-6 md:pr-10 text-[12.5px] md:text-[13.5px] leading-relaxed text-slate-500 font-sans">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION 6: BOTTOM STILL HAVE QUESTIONS CTA ================= */}
          <section className="mt-8">
            <div className="w-full bg-[#F4F8FD] border border-blue-50 rounded-2xl overflow-hidden relative min-h-[220px] md:min-h-[260px] flex flex-col md:flex-row items-center justify-between shadow-sm">
              
              {/* Left Side Info Panel */}
              <div className="p-6 md:p-10 flex flex-col items-start text-left z-20 max-w-md">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 shadow-sm shadow-blue-500/20">
                  <Headphones className="w-6 h-6 stroke-[2]" />
                </div>
                <h2 className="font-sans font-extrabold text-slate-800 text-lg md:text-xl leading-none">
                  Still Have Questions?
                </h2>
                <p className="font-sans text-[12.5px] md:text-[13px] text-slate-450 mt-1.5 leading-normal">
                  Our support team is here to help anytime.
                </p>
                <Link
                  href="/#contact"
                  className="mt-5 px-6 py-2.5 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-bold text-[12.5px] rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Contact Us
                </Link>
              </div>

              {/* Right Side Image Panel (fades to transparency on its left edge) */}
              <div className="w-full md:w-[48%] h-[200px] md:absolute md:right-0 md:top-0 md:bottom-0 md:h-full relative overflow-hidden flex-shrink-0 self-stretch">
                {/* Gradient blend overlay */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#F4F8FD] via-[#F4F8FD]/60 to-transparent z-10 w-full md:w-1/3 h-1/4 md:h-full" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cleaning_supplies_caddy.png"
                  alt="Professional Cleaning Supplies bucket caddy"
                  className="w-full h-full object-cover relative"
                />
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* 3. Conditional Navigation Footer based on login status */}
      {isLoggedIn ? <DashboardFooter /> : <Footer />}
    </div>
  );
}
