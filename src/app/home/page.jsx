'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Plus,
  User,
  ChevronDown,
  Zap,
  Hammer,
  Paintbrush,
  ShieldCheck,
  Lock,
  Headphones,
  Award,
  Star,
  Bell,
  Droplet,
  Languages,
  Check,
  X
} from 'lucide-react';
import { authApi } from '@/utils/api';
import { useLanguage } from '@/utils/LanguageContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { createPortal } from 'react-dom';

export default function MobileHomePage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [profileLocation, setProfileLocation] = useState('');
  const [homeServices, setHomeServices] = useState([]);
  const [homeLocations, setHomeLocations] = useState([]);
  const [homeReviews, setHomeReviews] = useState([]);
  
  // Language & Map States
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 48.1351, lng: 11.5820 });
  const [tempLocation, setTempLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleOpenMap = () => {
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
          console.warn("Could not get live location for map modal click", err);
        }
      );
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Desktop users go to /profile — this page is mobile-only
      if (window.innerWidth >= 768) {
        router.replace('/profile');
        return;
      }

      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }

      // Load profile location from session (fallback)
      try {
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          setProfileLocation(u.location || '');
        }
      } catch (e) {}

      // Get current location automatically on page mount
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const newLoc = { lat: latitude, lng: longitude };
            setMapCenter(newLoc);
            setTempLocation(newLoc);
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              if (data && data.address) {
                const mainAddr = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.road || data.display_name.split(',')[0];
                setProfileLocation(mainAddr);
                
                const storedUser = sessionStorage.getItem('auth_user');
                if (storedUser) {
                  const u = JSON.parse(storedUser);
                  u.location = mainAddr;
                  sessionStorage.setItem('auth_user', JSON.stringify(u));
                }
              }
            } catch (err) {
              console.error("Error geocoding current location on mount:", err);
            }
          },
          (err) => {
            console.warn("Could not get live location on mount:", err);
          }
        );
      }

      authApi.getHomeData().then((res) => {
        if (res && res.status && res.data) {
          setHomeServices(res.data.popularServices || []);
          setHomeLocations(res.data.locations || []);
          setHomeReviews(res.data.topReviews || []);
        }
      }).catch(() => {});
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24 relative select-none" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Sauber & Fix Logo" className="h-8 w-auto object-contain" />
        </Link>

        {/* Right Buttons: Location Pill and Language Circle */}
        <div className="flex items-center gap-2 relative">
          
          {/* Location Pill Button */}
          <div className="relative">
            <button
              onClick={handleOpenMap}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: profileLocation ? '8px 14px' : '0 16px',
                height: 40,
                borderRadius: 24,
                background: 'white',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                outline: 'none',
                minWidth: profileLocation ? 'auto' : 72
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ flexShrink: 0 }}
              >
                <path 
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                  fill="#137DC5" 
                />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
              {profileLocation && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#092040', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profileLocation}
                </span>
              )}
            </button>
          </div>

          {/* Translation Circle Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLanguageSheetOpen(true);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'white',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                outline: 'none'
              }}
            >
              <Languages className="w-[18px] h-[18px] text-[#137DC5]" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 px-4 pt-4 text-left animate-in fade-in duration-200">

        {/* Promo Hero Card */}
        <div className="bg-[#EBF3FC] rounded-[22px] p-5 text-slate-800 relative overflow-hidden shadow-sm min-h-[165px] flex items-center justify-between border border-[#D9E8F5]/65">
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/35 rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col gap-4 z-10 max-w-[55%]">
            <div className="flex flex-col gap-1 text-left">
              <h1 className="font-display font-black text-[18.5px] leading-[1.12] text-[#092040] tracking-tight">
                All Your <br />
                Home Services <br />
                <span className="text-[#137DC5]">On Demand</span>
              </h1>
              <p className="font-sans text-[9.5px] text-slate-500 font-semibold leading-normal mt-0.5">
                Book trusted professionals for any job, anytime.
              </p>
            </div>

            <button
              onClick={() => router.push('/add-post')}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1B3E8F] hover:bg-[#122D6E] rounded-xl font-sans font-bold text-[11px] text-white transition-all cursor-pointer w-fit shadow-md shadow-blue-900/10 active:scale-95"
            >
              <span className="w-4 h-4 rounded-full bg-white text-[#1B3E8F] flex items-center justify-center text-[10.5px] font-black">+</span>
              <span>Post a Job</span>
            </button>
          </div>

          {/* Circular visual arch image */}
          <div className="absolute right-0 bottom-0 top-0 w-[42%] h-full z-0 pointer-events-none select-none overflow-hidden rounded-l-[110px] border-l-4 border-white bg-gradient-to-tr from-white to-[#EBF3FC]">
            <img
              src="/hero-cleaner-boy.png"
              alt="Sauber Professional"
              className="h-full w-full object-cover object-[center_top] scale-105"
              onError={(e) => { e.currentTarget.src = '/workers/james-anderson.png'; }}
            />
          </div>
        </div>

        {/* Popular Services Card Section */}
        {homeServices && homeServices.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[22px] p-4.5 shadow-[0_2px_12px_rgba(9,32,64,0.015)]">
            <div className="mb-3.5 text-left">
              <h3 className="font-display font-extrabold text-[15px] text-[#092040] tracking-tight">
                Popular Services
              </h3>
            </div>

            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1 snap-x">
              {(() => {
                const seen = new Set();
                const unique = [];
                for (const s of homeServices) {
                  const sName = s.name || '';
                  if (!seen.has(sName)) {
                    seen.add(sName);
                    unique.push(s);
                  }
                }
                return unique;
              })().map((serv, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(`/add-post?service=${encodeURIComponent(serv.name)}`)}
                  className="flex flex-col items-center cursor-pointer group flex-shrink-0 snap-align-start"
                >
                  <div className="w-13 h-13 rounded-full bg-[#EBF3FC] border border-[#D0E2F5]/80 flex items-center justify-center shadow-sm active:scale-95 transition-all text-[#137DC5] hover:bg-blue-100/50 overflow-hidden">
                    {serv.service_icon ? (
                      <img src={serv.service_icon} alt={serv.name} className="w-6.5 h-6.5 object-contain" />
                    ) : (
                      <Home className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>
                  <span className="font-sans font-extrabold text-[9.5px] text-slate-700 leading-tight text-center mt-2 max-w-[70px] break-words">
                    {serv.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Service Banner */}
        <div
          onClick={() => alert('Searching for quick dispatch specialists near you...')}
          className="relative w-full cursor-pointer active:scale-[0.99] hover:brightness-[0.98] transition-all select-none rounded-[20px] overflow-hidden shadow-sm border border-slate-100/50"
        >
          <img
            src="/quick-service-banner.png"
            alt="Quick Service Just in 30 Minutes! Book Now"
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Trust Badging Grid */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-[0_2px_10px_rgba(9,32,64,0.015)]">
          <div className="grid grid-cols-4 gap-2">
            {[
              { title: 'Verified Professionals', icon: ShieldCheck },
              { title: 'Secure Payments', icon: Lock },
              { title: '24/7 Support', icon: Headphones },
              { title: 'Satisfaction Guaranteed', icon: Award }
            ].map((b, idx) => {
              const BIcon = b.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5] mb-1.5 shadow-inner">
                    <BIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="font-sans font-extrabold text-[8.5px] text-slate-800 leading-tight max-w-[75px] block">
                    {b.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials section */}
        {homeReviews && homeReviews.length > 0 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-[15px] text-[#092040] tracking-tight">
                What Our Customers Say
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {homeReviews.slice(0, 2).map((rev, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-[22px] p-4 flex flex-col justify-between gap-3 shadow-[0_2px_8px_rgba(9,32,64,0.015)]">
                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                      ))}
                    </div>
                    <p className="font-sans text-[10.5px] text-slate-600 leading-normal font-semibold">
                      {rev.feedback ? `"${rev.feedback}"` : 'No feedback left'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-sans font-bold text-[10px] text-slate-800 leading-tight">
                        {rev.user_name || 'Customer'}
                      </span>
                      <span className="text-[7.5px] text-[#137DC5] font-extrabold uppercase mt-0.5 leading-none">
                        {rev.worker_name ? `Reviewed ${rev.worker_name}` : 'Verified customer'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-0.5">
              <div className="w-4 h-1.5 rounded-full bg-[#137DC5]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Navigation Bar ───────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(9,32,64,0.08)] px-0 py-1.5 flex items-center justify-between" style={{ paddingBottom: '10px' }}>
        {/* Home — active */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-[#0D6EFD]"
        >
          <Home className="w-[18px] h-[18px]" />
          <span className="font-sans font-semibold text-[8.5px]">{t('nav.home', 'Home')}</span>
        </button>

        {/* My Orders */}
        <button
          type="button"
          onClick={() => router.push('/dashboard/orders')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]"
        >
          <ShoppingBag className="w-[18px] h-[18px]" />
          <span className="font-sans font-semibold text-[8.5px]">{t('nav.myOrders', 'My Orders')}</span>
        </button>

        {/* Center + FAB */}
        <div className="relative flex justify-center items-center flex-1 h-10 -mt-5 select-none">
          <button
            type="button"
            onClick={() => router.push('/add-post')}
            className="absolute w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#137DC5] to-[#0d5fa0] active:scale-95 transition-all text-white flex items-center justify-center shadow-[0_4px_16px_rgba(19,125,197,0.45)] border-[2px] border-white z-20 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Messages */}
        <button
          type="button"
          onClick={() => router.push('/messages')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span className="font-sans font-semibold text-[8.5px]">{t('nav.messages', 'Messages')}</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]"
        >
          <User className="w-[18px] h-[18px]" />
          <span className="font-sans font-semibold text-[8.5px]">{t('nav.myProfile', 'Profile')}</span>
        </button>
      </nav>

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
                      setProfileLocation(mainAddr);
                      try {
                        const storedUser = sessionStorage.getItem('auth_user');
                        if (storedUser) {
                          const u = JSON.parse(storedUser);
                          u.location = mainAddr;
                          u.latitude = targetLocation.lat;
                          u.longitude = targetLocation.lng;
                          sessionStorage.setItem('auth_user', JSON.stringify(u));
                        }
                      } catch (e) {}
                    } else {
                      setProfileLocation(`${targetLocation.lat.toFixed(2)}, ${targetLocation.lng.toFixed(2)}`);
                    }
                  } catch (err) {
                    setProfileLocation(`${targetLocation.lat.toFixed(2)}, ${targetLocation.lng.toFixed(2)}`);
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

      {/* Choose Language Bottom Sheet Modal */}
      {isLanguageSheetOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center select-none animate-in fade-in duration-200">
          {/* Smooth Backdrop */}
          <div 
            onClick={() => setIsLanguageSheetOpen(false)}
            className="absolute inset-0 bg-[#092040]/30 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* SVG Global Defs for Waving Flags */}
          <svg width="0" height="0" className="absolute" style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <clipPath id="flag-wave">
                <path d="M 0,4 Q 15,-2 30,4 T 60,4 L 60,36 Q 45,30 30,36 T 0,36 Z" />
              </clipPath>
              <linearGradient id="flag-shade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="25%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="75%" stopColor="#000000" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          {/* Bottom Sheet Card */}
          <div className="relative bg-white w-full max-w-md rounded-t-[32px] p-6 shadow-premium z-10 flex flex-col gap-4 animate-slideUp text-left" style={{
            boxShadow: '0 -8px 30px rgba(9,32,64,0.08)',
            paddingBottom: '32px'
          }}>
            {/* Top Handle Drag Bar */}
            <div style={{
              width: '48px',
              height: '4px',
              background: '#E2E8F0',
              borderRadius: '2px',
              margin: '0 auto 8px auto'
            }}></div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="font-sans font-extrabold text-[18px] text-[#092040] leading-none">
                Choose Language
              </h3>
              <p className="font-sans text-[12.5px] text-[#94A3B8] font-bold leading-none mt-1.5">
                Select your preferred language
              </p>
            </div>

            {/* Language list */}
            <div className="flex flex-col gap-3 mt-1.5">
              {[
                { 
                  code: 'English', 
                  label: 'English', 
                  sub: 'English', 
                  flag: (
                    <svg viewBox="0 0 60 40" style={{ width: '42px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(9, 32, 64, 0.08))' }} className="flex-shrink-0">
                      <g clipPath="url(#flag-wave)">
                        <rect width="60" height="40" fill="#012169" />
                        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6" />
                        <path d="M0,0 L30,20 M60,40 L30,20 M60,0 L30,20 M0,40 L30,20" stroke="#C8102E" strokeWidth="3" />
                        <path d="M30,0 L30,40 M0,20 L60,20" stroke="#fff" strokeWidth="10" />
                        <path d="M30,0 L30,40 M0,20 L60,20" stroke="#C8102E" strokeWidth="6" />
                        <path d="M0,4 Q15,-2 30,4 T60,4 L60,36 Q45,30 30,36 T0,36 Z" fill="url(#flag-shade)" style={{ mixBlendMode: 'multiply' }} />
                      </g>
                    </svg>
                  )
                },
                { 
                  code: 'German', 
                  label: 'German', 
                  sub: 'Deutsch', 
                  flag: (
                    <svg viewBox="0 0 60 40" style={{ width: '42px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(9, 32, 64, 0.08))' }} className="flex-shrink-0">
                      <g clipPath="url(#flag-wave)">
                        <rect width="60" height="13.3" y="0" fill="#000000" />
                        <rect width="60" height="13.3" y="13.3" fill="#D00000" />
                        <rect width="60" height="13.4" y="26.6" fill="#FFCE00" />
                        <path d="M0,4 Q15,-2 30,4 T60,4 L60,36 Q45,30 30,36 T0,36 Z" fill="url(#flag-shade)" style={{ mixBlendMode: 'multiply' }} />
                      </g>
                    </svg>
                  )
                },
                { 
                  code: 'Arabic', 
                  label: 'Arabic', 
                  sub: 'العربية', 
                  flag: (
                    <svg viewBox="0 0 60 40" style={{ width: '42px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(9, 32, 64, 0.08))' }} className="flex-shrink-0">
                      <g clipPath="url(#flag-wave)">
                        <rect x="15" y="0" width="45" height="13.3" fill="#00732F" />
                        <rect x="15" y="13.3" width="45" height="13.3" fill="#ffffff" />
                        <rect x="15" y="26.6" width="45" height="13.4" fill="#000000" />
                        <rect x="0" y="0" width="15" height="40" fill="#FF0000" />
                        <path d="M0,4 Q15,-2 30,4 T60,4 L60,36 Q45,30 30,36 T0,36 Z" fill="url(#flag-shade)" style={{ mixBlendMode: 'multiply' }} />
                      </g>
                    </svg>
                  )
                }
              ].map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setTimeout(() => setIsLanguageSheetOpen(false), 250);
                    }}
                    className={`w-full flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                      isSelected
                        ? 'border-[#137DC5] bg-[#F4F9FD]'
                        : 'border-[#F1F5F9] bg-[#F8FAFC] hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {lang.flag}
                      <div className="flex flex-col text-left">
                        <span className={`font-sans font-bold text-[14px] leading-tight ${isSelected ? 'text-[#137DC5]' : 'text-[#092040]'}`}>
                          {lang.label}
                        </span>
                        <span className={`font-sans text-[11px] font-semibold leading-normal mt-0.5 ${isSelected ? 'text-[#94A3B8]' : 'text-slate-400'}`}>
                          {lang.sub}
                        </span>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-[22px] h-[22px] rounded-full bg-[#137DC5] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    ) : (
                      <div className="w-[22px] h-[22px] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
