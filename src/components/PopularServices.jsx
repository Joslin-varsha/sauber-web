'use client';

import { useRouter } from 'next/navigation';
import { Home, Droplet, Zap, Paintbrush, Wrench, Loader2 } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

export default function PopularServices({ services, isLoading }) {
  const router = useRouter();
  const { tr } = useLanguage();

  // Helper to dynamically choose Lucide icons based on service name
  const getServiceIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('clean')) return Home;
    if (n.includes('plumb')) return Droplet;
    if (n.includes('electr')) return Zap;
    if (n.includes('paint')) return Paintbrush;
    return Wrench;
  };

  // Helper to fallback to standard hourly wages by category
  const getServicePrice = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('clean')) return tr('price.from20', 'From €20/hr');
    if (n.includes('plumb')) return tr('price.from30', 'From €30/hr');
    if (n.includes('electr')) return tr('price.from35', 'From €35/hr');
    if (n.includes('paint')) return tr('price.from25', 'From €25/hr');
    return tr('price.from22', 'From €22/hr');
  };

  // Build the list of services dynamically or fallback to mockup defaults
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
        price: getServicePrice(s.name),
        icon: getServiceIcon(s.name),
        service_icon: s.service_icon
      }))
    : [
        { id: 'cleaning', name: tr('service.cleaning', 'Home Cleaning'), price: tr('price.from20', 'From €20/hr'), icon: Home },
        { id: 'plumbing', name: tr('service.plumbing', 'Plumbing'), price: tr('price.from30', 'From €30/hr'), icon: Droplet },
        { id: 'electrical', name: tr('service.electrical', 'Electrical'), price: tr('price.from35', 'From €35/hr'), icon: Zap },
        { id: 'painting', name: tr('service.painting', 'Painting'), price: tr('price.from25', 'From €25/hr'), icon: Paintbrush }
      ];

  const handleServiceClick = (serviceName) => {
    router.push(`/add-post?service=${encodeURIComponent(serviceName)}`);
  };

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
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.name)}
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(9,32,64,0.02)] hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  {/* Blue Icon / Image */}
                  {service.service_icon ? (
                    <img 
                      src={service.service_icon} 
                      alt={service.name} 
                      className="w-8 h-8 object-contain mb-4 group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <IconComponent className="w-8 h-8 text-[#137DC5] stroke-[1.8] mb-4 group-hover:scale-105 transition-transform duration-300" />
                  )}

                  {/* Service Details */}
                  <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-[14.5px] text-center mb-1">
                    {service.name}
                  </h3>
                  <span className="font-sans font-semibold text-slate-400 text-[11px] sm:text-xs">
                    {service.price}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
