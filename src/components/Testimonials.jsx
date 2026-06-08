'use client';

import { useState } from 'react';
import { Star, ShieldCheck, Lock, Award, Headphones } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

export default function Testimonials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { tr } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: 'Anna L.',
      city: tr('city.berlin', 'Berlin'),
      avatarInitials: 'AL',
      avatarBg: 'bg-indigo-100 text-indigo-700',
      text: tr('review.text1', '"Amazing service! The cleaner was punctual, friendly, and did a fantastic job. Will definitely book again."'),
      stars: 5,
    },
    {
      id: 2,
      name: 'Markus T.',
      city: tr('city.munich', 'Munich'),
      avatarInitials: 'MT',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      text: tr('review.text2', '"I found a great plumber within minutes. Transparent pricing and very professional."'),
      stars: 5,
    },
    {
      id: 3,
      name: 'Sarah K.',
      city: tr('city.hamburg', 'Hamburg'),
      avatarInitials: 'SK',
      avatarBg: 'bg-amber-100 text-amber-700',
      text: tr('review.text3', '"Great platform, easy to use and the workers are highly skilled. Highly recommended!"'),
      stars: 5,
    },
  ];

  const highlights = [
    {
      title: tr('highlight.verifiedTitle', 'Verified Professionals'),
      desc: tr('highlight.verifiedDesc', 'Background checked'),
      icon: ShieldCheck,
    },
    {
      title: tr('highlight.paymentsTitle', 'Secure Payments'),
      desc: tr('highlight.paymentsDesc', 'Safe & protected'),
      icon: Lock,
    },
    {
      title: tr('highlight.guaranteeTitle', 'Satisfaction Guaranteed'),
      desc: tr('highlight.guaranteeDesc', 'Quality service'),
      icon: Award,
    },
    {
      title: tr('highlight.supportTitle', '24/7 Support'),
      desc: tr('highlight.supportDesc', "We're here to help"),
      icon: Headphones,
    },
  ];

  return (
    <section className="w-full pt-0 pb-8 bg-white text-left">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040]">
            {tr('testimonials.title', 'What Our Customers Say')}
          </h2>
          <a
            href="#testimonials"
            className="font-sans font-bold text-xs sm:text-[13px] text-[#137DC5] hover:underline transition-all cursor-pointer"
          >
            {tr('testimonials.viewAll', 'View all reviews →')}
          </a>
        </div>

        {/* Desktop grid (3 cards) & Mobile carousel (1 card active) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => {
            const avatarFilename = review.name.toLowerCase().replace(' ', '-').replace('.', '');
            return (
              <div
                key={review.id}
                className={`bg-white border rounded-[20px] p-6 sm:p-7 flex-col justify-between shadow-[0_4px_20px_rgba(9,32,64,0.015)] hover:shadow-premium transition-all duration-300 cursor-pointer ${
                  activeSlide === idx 
                    ? 'border-[#137DC5] flex' 
                    : 'border-slate-100 hidden md:flex'
                }`}
                onClick={() => setActiveSlide(idx)}
              >
                <div className="flex flex-col gap-3">
                  {/* 5 Stars (Gold) */}
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-500 italic leading-relaxed">
                    {review.text}
                  </p>
                </div>

                {/* Reviewer Avatars */}
                <div className="flex items-center gap-3 mt-0 pt-5 border-t border-slate-50">
                  <div className="w-9 h-9 rounded-full overflow-hidden shadow-inner flex-shrink-0 relative border border-slate-100 bg-slate-50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/workers/${avatarFilename}.png`}
                      alt={review.name}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          if (!parent.querySelector('.fallback-avatar')) {
                            const fallback = document.createElement('div');
                            fallback.className = `fallback-avatar w-full h-full flex items-center justify-center font-sans font-extrabold text-[10px] text-indigo-700 bg-indigo-100`;
                            fallback.innerText = review.avatarInitials;
                            parent.appendChild(fallback);
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans font-bold text-slate-800 text-xs sm:text-[13px]">
                      {review.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
                      {review.city}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Pagination Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx ? 'bg-[#137DC5] w-6' : 'bg-slate-200 hover:bg-slate-350 w-2'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        {/* 4. PREMIUM INTEGRATED HIGHLIGHTS BAR - Hidden on mobile */}
        <div className="w-full bg-[#f4f8fc] border border-blue-50/50 rounded-2xl p-5 mt-10 text-left hidden md:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2 items-center">
            {highlights.map((h, idx) => {
              const HIcon = h.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 group relative w-full justify-start sm:justify-start lg:justify-center">
                  
                  {/* Left divider line for desktop */}
                  {idx > 0 && (
                    <div className="hidden lg:block absolute left-[-15px] top-1/2 -translate-y-1/2 h-10 w-[1px] bg-slate-200/70 pointer-events-none"></div>
                  )}

                  {/* Icon container */}
                  <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#137DC5] flex-shrink-0 shadow-[0_2px_10px_rgba(19,125,197,0.03)] group-hover:scale-105 transition-transform duration-300">
                    <HIcon className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  
                  {/* Text labels */}
                  <div className="flex flex-col">
                    <span className="font-sans font-bold text-[#092040] text-[12px] sm:text-[12.5px] leading-tight">
                      {h.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
                      {h.desc}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
