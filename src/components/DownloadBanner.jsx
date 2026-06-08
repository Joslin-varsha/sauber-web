'use client';

import React from 'react';

export default function DownloadBanner() {
  return (
    <div className="relative bg-[#EBF3FC] border border-[#D0E2F5] rounded-3xl mt-6 flex flex-col md:flex-row items-center justify-between px-6 py-6 md:py-0 md:h-36 overflow-visible w-full select-none gap-6 md:gap-0">
      
      {/* Left Side: Silver/White iPhone Mockup */}
      <div className="hidden md:block relative -mt-7 -mb-5 h-[178px] w-[88px] flex-shrink-0 z-20 -rotate-12 transition-transform duration-500 hover:rotate-0">
        <div className="w-full h-full bg-white border-[3.5px] border-slate-300 rounded-[22px] shadow-2xl overflow-hidden flex flex-col relative p-1">
          {/* Speaker & Camera Notch */}
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-900 rounded-full flex items-center justify-center z-30">
            <div className="w-3.5 h-[1.5px] bg-slate-600 rounded-full"></div>
          </div>
          
          {/* Screen content mockup */}
          <div className="w-full h-full bg-[#F3F7FC] rounded-[18px] overflow-hidden flex flex-col relative p-1 text-[5px]">
            {/* App Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1 pt-1.5 px-0.5">
              <div className="flex items-center gap-0.5">
                <div className="w-2.2 h-2.2 rounded-full bg-[#137DC5] flex items-center justify-center text-white text-[4px] font-bold">S</div>
                <span className="text-[5.2px] font-extrabold text-[#092040] tracking-tight">Sauber</span>
              </div>
              <span className="text-[4.5px] text-slate-400 font-medium">12:30 PM</span>
            </div>
            
            {/* Mock Card 1: Active status */}
            <div className="bg-white border border-slate-100/80 rounded-md p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.02)] flex flex-col gap-0.5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[3.8px] bg-emerald-50 text-emerald-600 font-extrabold px-1 rounded-full scale-90 origin-left">ARRIVING</span>
                <span className="text-[4.5px] font-bold text-[#137DC5]">€65.00</span>
              </div>
              <div className="flex gap-0.5 items-center mt-0.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center text-white text-[4.2px] font-bold">AB</div>
                <div className="flex flex-col text-left">
                  <span className="text-[4.2px] font-bold text-slate-800 leading-none">Anna Becker</span>
                  <span className="text-[3.2px] text-slate-400 leading-none mt-0.5">Specialist</span>
                </div>
              </div>
            </div>

            {/* Mock Card 2: Upcoming status */}
            <div className="bg-white border border-slate-100/80 rounded-md p-1 shadow-[0_1.5px_3px_rgba(0,0,0,0.02)] flex flex-col gap-0.5 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-[3.8px] bg-blue-50 text-[#137DC5] font-extrabold px-1 rounded-full scale-90 origin-left">UPCOMING</span>
                <span className="text-[4.5px] font-bold text-slate-700">€80.00</span>
              </div>
              <div className="flex gap-0.5 items-center mt-0.5">
                <div className="w-3 h-3 rounded-full bg-blue-300 flex items-center justify-center text-white text-[4.2px] font-bold">DB</div>
                <div className="flex flex-col text-left">
                  <span className="text-[4.2px] font-bold text-slate-800 leading-none">Daniel Brown</span>
                  <span className="text-[3.2px] text-slate-400 leading-none mt-0.5">Expert</span>
                </div>
              </div>
            </div>
            
            {/* Bottom dots */}
            <div className="mt-auto mb-0.5 flex justify-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-[#137DC5]"></div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Text Container and App Badges */}
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between flex-grow md:pl-6 z-10 w-full md:w-auto">
        {/* Banner Text */}
        <div className="flex flex-col text-center md:text-left gap-1 mb-4 md:mb-0 md:ml-4">
          <h2 className="font-sans font-extrabold text-[16px] md:text-[18px] text-[#3B4E78] leading-tight">
            Download the Sauber App
          </h2>
          <p className="font-sans text-[12px] md:text-[13px] text-[#758BAF] font-semibold leading-snug">
            Book services on the go. <br className="hidden sm:inline" />
            Anytime, anywhere.
          </p>
        </div>

        {/* Black Store Badges */}
        <div className="flex flex-row gap-3 justify-center items-center md:mr-6">
          {/* App Store Badge */}
          <a
            href="#app-store"
            className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white py-1.5 px-3 rounded-lg transition-all duration-300 shadow-md cursor-pointer h-10 w-28 md:w-32 justify-center"
          >
            <svg className="w-4.5 h-4.5 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[6.5px] uppercase font-bold text-slate-400 tracking-wider leading-none">Download on the</span>
              <span className="text-[10px] font-bold font-sans leading-tight mt-0.5">App Store</span>
            </div>
          </a>

          {/* Google Play Store Badge */}
          <a
            href="#play-store"
            className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white py-1.5 px-3 rounded-lg transition-all duration-300 shadow-md cursor-pointer h-10 w-28 md:w-32 justify-center"
          >
            <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M3 3.25c-.15.15-.25.38-.25.66v16.18c0 .28.1.51.25.66l8.28-8.28L3 3.25z" fill="#00E5FF" />
              <path d="M15.44 15.58l-3.91-3.91-8.28 8.28c.2.2.53.25.89.06l11.3-6.43z" fill="#FF1744" />
              <path d="M11.53 11.67l3.91-3.91-11.3-6.43c-.36-.19-.69-.14-.89.06l8.28 8.28z" fill="#00E676" />
              <path d="M19.34 9.5l-3.9 2.17 3.9 3.91c.42-.24.66-.71.66-1.25V10.75c0-.54-.24-1.01-.66-1.25z" fill="#FFEA00" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[6.5px] uppercase font-bold text-slate-400 tracking-wider leading-none">GET IT ON</span>
              <span className="text-[10px] font-bold font-sans leading-tight mt-0.5">Google Play</span>
            </div>
          </a>
        </div>
      </div>

      {/* Right Side: Elegant Plant & Cozy Blue Armchair SVG */}
      <div className="w-[210px] h-[142px] flex-shrink-0 relative hidden lg:block overflow-visible self-end">
        <svg viewBox="0 0 210 142" className="w-full h-full overflow-visible">
          {/* Ground Shadows */}
          <ellipse cx="40" cy="135" rx="15" ry="3" fill="#D5E3F0" />
          <ellipse cx="140" cy="134" rx="55" ry="8" fill="#D5E3F0" />
          
          {/* 1. PLANT IN POT */}
          {/* Pot Shadow */}
          <path d="M28,110 L32,134 C32,135 48,135 48,134 L52,110 Z" fill="#EBF3FC" opacity="0.3" />
          {/* Pot body */}
          <path d="M28,110 L32,134 C33,135.5 47,135.5 48,134 L52,110 Z" fill="#FFFFFF" />
          <path d="M28,110 L32,134 C33,135.5 47,135.5 48,134 L52,110 Z" fill="none" stroke="#D0E2F5" strokeWidth="1" />
          {/* Pot Rim */}
          <ellipse cx="40" cy="110" rx="12" ry="2.5" fill="#FFFFFF" stroke="#D0E2F5" strokeWidth="1" />
          {/* Soil */}
          <ellipse cx="40" cy="110" rx="10.5" ry="2" fill="#543C31" />
          
          {/* Snake Plant Leaves */}
          {/* Leaf 1 (center back, tall) */}
          <path d="M38,110 C35,70 31,40 37,15 C42,40 43,70 42,110 Z" fill="#1B5E20" />
          <path d="M38,110 C36,70 34,40 37,15 C37.5,15 39,40 42,110 Z" fill="#2E7D32" opacity="0.3" />
          <path d="M37,15 C37,15 39,40 40,110" fill="none" stroke="#81C784" strokeWidth="1" strokeDasharray="3,3" />
          
          {/* Leaf 2 (left front, medium) */}
          <path d="M33,110 C27,88 23,55 28,35 C33,55 35,88 37,110 Z" fill="#2E7D32" />
          <path d="M30,37 C29,52 31,78 34,110" fill="none" stroke="#A5D6A7" strokeWidth="0.8" />
          
          {/* Leaf 3 (right front, medium) */}
          <path d="M43,110 C48,90 49,60 44,40 C39,60 41,90 42,110 Z" fill="#1B5E20" />
          <path d="M44,42 C43,60 42,82 42,110" fill="none" stroke="#81C784" strokeWidth="0.8" />
          
          {/* Leaf 4 (far left, short, tilted) */}
          <path d="M29,110 C20,95 18,75 20,58 C25,75 27,95 29,110 Z" fill="#388E3C" />
          <path d="M21,60 C23,72 25,88 27,110" fill="none" stroke="#C8E6C9" strokeWidth="0.6" />
          
          {/* Leaf 5 (far right, short, tilted) */}
          <path d="M45,110 C52,98 54,80 51,64 C47,80 46,98 45,110 Z" fill="#43A047" />
          <path d="M51,66 C49,78 48,92 45,110" fill="none" stroke="#A5D6A7" strokeWidth="0.6" />

          {/* 2. BLUE ARMCHAIR */}
          {/* Legs */}
          {/* Back Left Leg */}
          <line x1="122" y1="112" x2="116" y2="128" stroke="#795548" strokeWidth="4.5" strokeLinecap="round" />
          {/* Back Right Leg */}
          <line x1="158" y1="112" x2="164" y2="128" stroke="#795548" strokeWidth="4.5" strokeLinecap="round" />
          {/* Front Left Leg */}
          <line x1="108" y1="114" x2="100" y2="134" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
          <line x1="108" y1="114" x2="100" y2="134" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          {/* Front Right Leg */}
          <line x1="172" y1="114" x2="180" y2="134" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
          <line x1="172" y1="114" x2="180" y2="134" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          
          {/* Armchair Backrest */}
          <path d="M102,60 C102,38 178,38 178,60 L178,105 C178,114 102,114 102,105 Z" fill="#137DC5" />
          {/* Shadow/indentation crease for back cushion comfort */}
          <path d="M106,60 C106,43 174,43 174,60 L174,105" fill="none" stroke="#0B5F97" strokeWidth="1.5" opacity="0.25" />
          
          {/* Seat Cushion */}
          <rect x="94" y="92" width="92" height="22" rx="10" fill="#137DC5" />
          {/* Accent shading/highlight on seat cushion */}
          <rect x="98" y="94" width="84" height="8" rx="4" fill="#3BA2E8" opacity="0.25" />
          
          {/* Left Armrest (inner side/back side of depth) */}
          <rect x="84" y="76" width="20" height="38" rx="10" fill="#137DC5" />
          <rect x="87" y="78" width="14" height="12" rx="5" fill="#3BA2E8" opacity="0.25" />
          
          {/* Right Armrest */}
          <rect x="176" y="76" width="20" height="38" rx="10" fill="#0C5F97" />
          <rect x="179" y="78" width="14" height="12" rx="5" fill="#137DC5" opacity="0.3" />
          
          {/* White Cushion/Pillow (rotated, leaning against right armrest) */}
          <rect x="142" y="70" width="30" height="30" rx="6" fill="#FFFFFF" transform="rotate(-12 142 70)" shadow="sm" />
          {/* Soft shadow/creases on pillow */}
          <path d="M148,81 L166,88" stroke="#ECEFF1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M151,75 L160,93" stroke="#ECEFF1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

    </div>
  );
}
