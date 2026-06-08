'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import BookingWidget from './BookingWidget';
import { useLanguage } from '@/utils/LanguageContext';

export default function Hero({ locations }) {
  const { tr } = useLanguage();
  const [location, setLocation] = useState('Berlin, Germany');

  const handleChangeLocation = () => {
    const newLoc = prompt(tr('hero.promptLocation', 'Enter service city/area in Germany:'), location);
    if (newLoc) setLocation(newLoc);
  };

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-0 lg:pb-0 bg-[#fafcff]">
      {/* Background horizontal gradient shape */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-[#f3f8fe] to-[#e8f2fe] -z-20"></div>
      
      {/* Desktop Full-Bleed Right Visual Column (Matching original design layout) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[63%] h-150 z-0 overflow-hidden">
        {/* Soft Linear Gradient Overlay on the left of the image to blend it seamlessly into the background */}
        <div className="absolute left-0 top-0 bottom-0 w-[200px] bg-gradient-to-r from-[#fafcff] via-[#f3f8fe]/90 to-transparent z-10 pointer-events-none"></div>

        {/* High-fidelity full living room image positioned to showcase the cleaner woman beautifully */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/hero-cleaner-girl.png" 
          alt="Sauber & Fix Cleaner" 
          className="w-full h-full object-cover object-[15%_center] transition-transform duration-700 hover:scale-[1.01]" 
        />

        {/* Elegant thin curved decorative path with a solid blue circle node sitting perfectly at the peak */}
        <div className="absolute left-[-35px] top-0 bottom-0 w-[260px] z-20 pointer-events-none">
          <svg 
            className="w-full h-full text-blue-400/50" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            fill="none"
          >
            <path 
              d="M 82 22 C 32 35, 32 65, 82 78" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              strokeLinecap="round"
            />
            {/* Solid blue circle dot with a thick white border, placed exactly at the peak (82, 22) */}
            <circle 
              cx="82" 
              cy="22" 
              r="2.5" 
              fill="#137DC5" 
              stroke="white" 
              strokeWidth="0.8" 
            />
          </svg>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 min-h-[380px] lg:min-h-[460px]">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col gap-4.5 text-center lg:text-left relative z-10">
            <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-[54px] text-slate-900 leading-[1.08] tracking-tight">
              {tr('hero.titleLine1', 'Find Trusted')} <br />
              {tr('hero.titleLine2', 'Local Workers')} <br />
              {tr('hero.titleLine3', 'in')} <span className="text-primary">{tr('hero.titleCountry', 'Germany')}</span>
            </h1>
            
            <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-500 max-w-sm mx-auto lg:mx-0 font-semibold leading-relaxed">
              {tr('hero.subtitle', 'Book skilled professionals for your home and get the job done.')}
            </p>

            {/* Service Location Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[12.5px] font-semibold text-slate-600 w-fit mx-auto lg:mx-0 py-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{tr('hero.serviceArea', 'Service Area:')} <span className="text-slate-900 font-extrabold">{location}</span></span>
              <button 
                onClick={handleChangeLocation}
                className="text-primary hover:text-primary/80 font-extrabold ml-2 hover:underline cursor-pointer"
              >
                {tr('hero.changeLocation', 'Change Location')}
              </button>
            </div>
          </div>

          {/* Mobile Image Visual (Only visible on mobile/tablet) */}
          <div className="lg:hidden w-full h-[240px] sm:h-[320px] rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/hero-cleaner-girl.png" 
              alt="Sauber & Fix Cleaner" 
              className="w-full h-full object-cover" 
            />
          </div>
          
        </div>
        
        {/* Responsive Booking Form Wrapper - Hidden on mobile */}
        <div className="mt-8 lg:mt-[-50px] relative z-30 w-full hidden md:block">
          <BookingWidget locations={locations} />
        </div>
      </div>
    </section>
  );
}
