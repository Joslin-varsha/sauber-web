'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import BookingWidget from './BookingWidget';
import { useLanguage } from '@/utils/LanguageContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { createPortal } from 'react-dom';

export default function Hero({ locations }) {
  const { tr } = useLanguage();
  const [location, setLocation] = useState('Berlin, Germany');

  const [mounted, setMounted] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 48.1351, lng: 11.5820 });
  const [tempLocation, setTempLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.location) {
          setLocation(u.location);
        }
        if (u.latitude && u.longitude) {
          const loc = { lat: parseFloat(u.latitude), lng: parseFloat(u.longitude) };
          setMapCenter(loc);
          setTempLocation(loc);
        }
      }
    } catch (e) {}

    const syncLocation = () => {
      try {
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.location) setLocation(u.location);
        }
      } catch (e) {}
    };
    window.addEventListener('locationChanged', syncLocation);
    return () => window.removeEventListener('locationChanged', syncLocation);
  }, []);

  const handleChangeLocation = () => {
    setShowMapModal(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(newLoc);
          if (!tempLocation) {
            setTempLocation(newLoc);
          }
        },
        (err) => {
          console.warn("Could not get live location for hero map click", err);
        }
      );
    }
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

      {/* Map Picker Modal */}
      {mounted && showMapModal && isLoaded && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-slate-800 text-[15px]">Select Location</h3>
              <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer border-none bg-transparent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="h-[280px] sm:h-[350px] w-full relative bg-slate-50 flex-shrink-0">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={14}
                onClick={(e) => {
                  setTempLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
              >
                {tempLocation ? (
                  <Marker position={tempLocation} />
                ) : (
                  <Marker position={mapCenter} />
                )}
              </GoogleMap>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowMapModal(false)}
                className="px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer border-none"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const targetLocation = tempLocation || mapCenter;
                  setShowMapModal(false);
                  setIsLocating(true);
                  try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLocation.lat}&lon=${targetLocation.lng}`);
                    const data = await res.json();
                    if (data && data.address) {
                      const mainAddr = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.road || data.display_name.split(',')[0];
                      setLocation(mainAddr);
                      try {
                        const storedUser = sessionStorage.getItem('auth_user') || '{}';
                        const u = JSON.parse(storedUser);
                        u.location = mainAddr;
                        u.latitude = targetLocation.lat;
                        u.longitude = targetLocation.lng;
                        sessionStorage.setItem('auth_user', JSON.stringify(u));
                        
                        // Dispatch custom event to notify BookingWidget and Header
                        window.dispatchEvent(new Event('locationChanged'));
                      } catch (e) {}
                    } else {
                      const latlngStr = `${targetLocation.lat.toFixed(2)}, ${targetLocation.lng.toFixed(2)}`;
                      setLocation(latlngStr);
                      try {
                        const storedUser = sessionStorage.getItem('auth_user') || '{}';
                        const u = JSON.parse(storedUser);
                        u.location = latlngStr;
                        u.latitude = targetLocation.lat;
                        u.longitude = targetLocation.lng;
                        sessionStorage.setItem('auth_user', JSON.stringify(u));
                        window.dispatchEvent(new Event('locationChanged'));
                      } catch (e) {}
                    }
                  } catch (err) {
                    const latlngStr = `${targetLocation.lat.toFixed(2)}, ${targetLocation.lng.toFixed(2)}`;
                    setLocation(latlngStr);
                    try {
                      const storedUser = sessionStorage.getItem('auth_user') || '{}';
                      const u = JSON.parse(storedUser);
                      u.location = latlngStr;
                      u.latitude = targetLocation.lat;
                      u.longitude = targetLocation.lng;
                      sessionStorage.setItem('auth_user', JSON.stringify(u));
                      window.dispatchEvent(new Event('locationChanged'));
                    } catch (e) {}
                  } finally {
                    setIsLocating(false);
                  }
                }}
                className="px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-white bg-[#137DC5] hover:bg-[#0C5F97] cursor-pointer border-none shadow-md"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
