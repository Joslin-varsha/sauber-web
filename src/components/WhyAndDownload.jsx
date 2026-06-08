'use client';

import { Search, Users, ClipboardCheck, ShieldCheck, Receipt, Grid, Clock } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

export default function WhyAndDownload() {
  const { tr } = useLanguage();

  const steps = [
    {
      stepNum: 1,
      title: tr('step.searchTitle', 'Search Service'),
      desc: tr('step.searchDesc', 'Choose the service you need and set your details.'),
      icon: Search,
    },
    {
      stepNum: 2,
      title: tr('step.chooseTitle', 'Choose a Worker'),
      desc: tr('step.chooseDesc', 'Browse profiles, compare reviews and prices.'),
      icon: Users,
    },
    {
      stepNum: 3,
      title: tr('step.doneTitle', 'Get It Done'),
      desc: tr('step.doneDesc', 'Confirm and relax while the job gets done right.'),
      icon: ClipboardCheck,
    },
  ];

  const benefits = [
    {
      title: tr('benefit.verified', 'Verified & Trusted Professionals'),
      icon: ShieldCheck,
    },
    {
      title: tr('benefit.pricing', 'Fair Pricing, No Hidden Charges'),
      icon: Receipt,
    },
    {
      title: tr('benefit.services', 'Wide Range of Services'),
      icon: Grid,
    },
    {
      title: tr('benefit.support', '24/7 Customer Support'),
      icon: Clock,
    },
  ];

  return (
    <section className="w-full pt-0 pb-8 bg-white text-left">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Column 1: How It Works */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040]">
                {tr('why.howItWorks', 'How It Works')}
              </h2>
              <a
                href="#how-it-works"
                className="font-sans font-bold text-xs sm:text-[13px] text-[#137DC5] hover:underline transition-all cursor-pointer"
              >
                {tr('why.viewSteps', 'View all steps')}
              </a>
            </div>

            {/* Steps Horizontal Grid */}
            <div className="grid grid-cols-3 gap-2 items-start relative mt-2">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.stepNum} className="flex flex-col items-center text-center relative group">
                    
                    {/* Horizontal dotted connector arrow for desktop */}
                    {idx < 2 && (
                      <div className="hidden sm:flex absolute top-5 left-[70%] w-12 justify-center items-center z-0 text-[#137DC5]/80">
                        <svg className="w-8 h-3" viewBox="0 0 40 12" fill="none">
                          <path d="M0 6H32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                          <path d="M28 2L34 6L28 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    {/* Step badge */}
                    <div className="w-5 h-5 rounded-full bg-[#137DC5] text-white flex items-center justify-center font-sans font-extrabold text-[10px] mb-2.5 shadow-sm shadow-blue-500/25 z-10">
                      {step.stepNum}
                    </div>

                    {/* Plain Icon without background circle */}
                    <div className="w-10 h-10 flex items-center justify-center mb-2 text-[#137DC5] group-hover:scale-105 transition-transform duration-300">
                      <StepIcon className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    {/* Step Details */}
                    <h3 className="font-sans font-bold text-slate-800 text-[11px] sm:text-[12px] mb-1 z-10 leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-sans text-[9.5px] sm:text-[10.5px] text-slate-400 max-w-[85px] sm:max-w-[100px] leading-snug z-10">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Why Choose Sauber? */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:pl-2">
            <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040]">
              {tr('why.title', 'Why Choose Sauber?')}
            </h2>

            <div className="flex flex-col gap-4 mt-2">
              {benefits.map((benefit, idx) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 group">
                    {/* Circle icon container */}
                    <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-100/55 flex items-center justify-center text-[#137DC5] flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <BenefitIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="font-sans font-bold text-[#092040] text-[11px] sm:text-[12px] leading-tight">
                      {benefit.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Download the Sauber App */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-gradient-to-br from-[#092040] via-[#092040] to-[#137DC5]/80 text-white rounded-[20px] p-5 shadow-premium relative overflow-hidden flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4 h-auto lg:h-[220px]">
              
              {/* Decorative radial blur */}
              <div className="absolute -right-20 -bottom-20 w-[180px] h-[180px] bg-[#137DC5]/20 rounded-full blur-[50px] pointer-events-none"></div>

              {/* Text column */}
              <div className="flex flex-col text-center sm:text-left lg:text-left z-10 flex-1 gap-3.5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-extrabold text-sm sm:text-base tracking-tight leading-tight">
                    {tr('why.downloadTitle', 'Download the Sauber App')}
                  </h3>
                  <p className="font-sans text-[10px] text-slate-300 font-semibold leading-normal max-w-[180px] mx-auto sm:mx-0">
                    {tr('why.downloadDescLine1', 'Book services on the go')} <br />
                    {tr('why.downloadDescLine2', 'Anytime, anywhere')}
                  </p>
                </div>

                {/* App store buttons */}
                <div className="flex flex-row gap-2 justify-center sm:justify-start lg:justify-start">
                  {/* Apple App Store */}
                  <a 
                    href="#app-store" 
                    className="flex items-center gap-1.5 bg-black hover:bg-slate-900 border border-slate-800 text-white px-2 py-1 rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.12.02.24.03.36.03.9 0 2.02-.55 2.45-1.36"/>
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[6px] uppercase font-bold text-slate-400 leading-none">{tr('why.downloadApplePrefix', 'Download on the')}</span>
                      <span className="text-[9px] font-bold leading-tight mt-0.5">App Store</span>
                    </div>
                  </a>

                  {/* Google Play */}
                  <a 
                    href="#play-store" 
                    className="flex items-center gap-1.5 bg-black hover:bg-slate-900 border border-slate-800 text-white px-2 py-1 rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M5 3.001c-.172 0-.344.043-.5.127l10.147 10.147 3.328-3.328L5.275 3.096A.54.54 0 0 0 5 3.001M4.127 4.125a.54.54 0 0 0-.127.375v15c0 .141.043.275.127.375l10.5-10.5zm1.148 16.78 12.822-6.848-3.328-3.328zm13.797-7.37 3.633-1.942a.542.542 0 0 0 0-.946l-3.633-1.942-3.454 3.454z"/>
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[6px] uppercase font-bold text-slate-400 leading-none">{tr('why.downloadGooglePrefix', 'GET IT ON')}</span>
                      <span className="text-[9px] font-bold leading-tight mt-0.5">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* iPhone App Screen Mockup */}
              <div className="w-[100px] h-[160px] bg-slate-950 rounded-t-[18px] border-t-2 border-x-2 border-slate-800 p-0.5 shadow-2xl relative flex-shrink-0 self-end overflow-hidden hidden sm:block lg:block">
                {/* Phone Speaker Notch */}
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-slate-800 rounded-full flex items-center justify-center z-50">
                  <div className="w-3 h-0.5 bg-slate-700 rounded-full"></div>
                </div>

                {/* Screen contents container */}
                <div className="w-full h-full bg-slate-50 rounded-t-[14px] overflow-hidden flex flex-col font-sans p-1 select-none relative text-[5px]">
                  
                  {/* Fake App Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5 pt-1">
                    <div className="flex items-center gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#137DC5] flex items-center justify-center text-white text-[3px] font-bold">S</div>
                      <span className="text-[3.5px] font-bold text-slate-700 uppercase">Sauber</span>
                    </div>
                    <span className="text-[3px] font-bold text-slate-400">12:30 PM</span>
                  </div>

                  {/* Search Bar mockup */}
                  <div className="my-1 bg-slate-100 rounded p-0.5 flex items-center justify-between">
                    <span className="text-[3.5px] text-slate-400 font-semibold">Berlin, Germany</span>
                    <span className="text-[3.5px] text-primary">🔍</span>
                  </div>

                  {/* Active Booking card */}
                  <div className="bg-white border border-slate-100 rounded p-1 shadow-sm flex flex-col gap-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[3px] bg-emerald-50 text-emerald-600 font-extrabold px-0.5 rounded-full">{tr('phone.activeJob', 'ACTIVE JOB')}</span>
                      <span className="text-[3px] font-bold text-slate-650">€25/hr</span>
                    </div>
                    
                    <div className="flex gap-0.5 items-center my-0.5">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-[3px] font-extrabold">JS</div>
                      <div className="flex flex-col">
                        <span className="text-[3.5px] font-bold text-slate-800 leading-none">James Smith</span>
                        <span className="text-[2.5px] text-slate-450 mt-0.5 font-semibold">{tr('phone.specialty', 'Home Cleaner')}</span>
                      </div>
                    </div>
                    
                    <div className="h-0.5 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
                    </div>
                    <span className="text-[2.5px] text-slate-450 font-bold leading-none">{tr('phone.arriving', 'James is arriving in 5 mins')}</span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
