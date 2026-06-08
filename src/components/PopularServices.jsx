'use client';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

export default function PopularServices({ services, isLoading }) {
  const router = useRouter();
  const { tr } = useLanguage();

  // Build the list of services dynamically
  const servicesList = services && services.length > 0
    ? (() => {
        const seen = new Set();
        const unique = [];
        for (const s of services) {
          const sName = s.name || '';
          if (!seen.has(sName)) {
            seen.add(sName);
            unique.push(s);
          }
        }
        return unique;
      })().map((s, idx) => ({
        id: s.service_id || String(s.id || idx),
        name: s.name,
        service_icon: s.service_icon
      }))
    : [];

  const handleServiceClick = (serviceName) => {
    router.push(`/add-post?service=${encodeURIComponent(serviceName)}`);
  };

  if (!isLoading && servicesList.length === 0) {
    return null;
  }

  return (
    <section id="services" className="w-full pt-5 pb-8 bg-white text-left">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040] mb-6">
          {tr('services.title', 'Popular Services')}
        </h2>

        {/* Loading skeleton wrapper */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-slate-400 font-sans font-semibold text-sm gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#137DC5]" />
            <span>{tr('services.loading', 'Loading services...')}</span>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {servicesList.map((service) => {
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.name)}
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(9,32,64,0.02)] hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  {/* Service Image Icon */}
                  {service.service_icon && (
                    <img 
                      src={service.service_icon} 
                      alt={service.name} 
                      className="w-8 h-8 object-contain mb-4 group-hover:scale-105 transition-transform duration-300" 
                    />
                  )}

                  {/* Service Details */}
                  <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-[14.5px] text-center">
                    {service.name}
                  </h3>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
