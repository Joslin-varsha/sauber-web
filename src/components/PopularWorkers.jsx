'use client';

import { Star } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

export default function PopularWorkers() {
  const { tr } = useLanguage();
  const workers = [
    {
      id: 'james-smith',
      name: 'James Smith',
      specialty: 'Home Cleaning',
      rating: 4.8,
      reviews: 125,
      price: '€25/hr',
      initials: 'JS',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'emma-keller',
      name: 'Emma Keller',
      specialty: 'Cleaning Specialist',
      rating: 4.7,
      reviews: 98,
      price: '€23/hr',
      initials: 'EK',
      gradient: 'from-emerald-450 to-teal-500',
    },
    {
      id: 'daniel-brown',
      name: 'Daniel Brown',
      specialty: 'Plumbing Expert',
      rating: 4.9,
      reviews: 210,
      price: '€30/hr',
      initials: 'DB',
      gradient: 'from-amber-400 to-rose-500',
    },
    {
      id: 'sophia-mueller',
      name: 'Sophia Müller',
      specialty: 'Home Cleaning',
      rating: 4.6,
      reviews: 87,
      price: '€20/hr',
      initials: 'SM',
      gradient: 'from-purple-400 to-pink-500',
    },
  ];

  return (
    <section className="w-full pt-0 pb-9 bg-white text-left">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040] mb-6">
          {tr('workers.title', 'Popular Workers')}
        </h2>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(9,32,64,0.02)] hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-center gap-4 text-left relative overflow-hidden"
            >
              
              {/* Avatar Circle Container with fallback initials */}
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-inner flex-shrink-0 relative border border-slate-100/60 bg-slate-50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/workers/${worker.id}.png`}
                  alt={worker.name}
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      // Check if already has a fallback div
                      if (!parent.querySelector('.fallback-avatar')) {
                        const fallback = document.createElement('div');
                        fallback.className = `fallback-avatar w-full h-full flex items-center justify-center text-white font-display font-extrabold text-base bg-gradient-to-tr ${worker.gradient}`;
                        fallback.innerText = worker.initials;
                        parent.appendChild(fallback);
                      }
                    }
                  }}
                />
              </div>

              {/* Worker Details (Right of avatar) */}
              <div className="flex flex-col flex-1">
                <h3 className="font-display font-bold text-slate-800 text-[14.5px]">
                  {worker.name}
                </h3>
                <span className="font-sans font-semibold text-slate-450 text-[11px] leading-tight mt-0.5">
                  {worker.specialty}
                </span>

                {/* Rating block */}
                <div className="flex items-center gap-1.5 mt-1.5 font-sans font-bold text-amber-500 text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{worker.rating}</span>
                  <span className="text-slate-400 font-semibold text-[9.5px]">
                    ({worker.reviews})
                  </span>
                </div>

                {/* Rate badge */}
                <div className="mt-2.5 font-sans font-extrabold text-[#10b981] text-[12px]">
                  {tr('price.fromPrefix', 'From')} {worker.price}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
