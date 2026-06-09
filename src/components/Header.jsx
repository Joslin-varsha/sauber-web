'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe, Bell, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/utils/LanguageContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { createPortal } from 'react-dom';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 48.1351, lng: 11.5820 });
  const [tempLocation, setTempLocation] = useState(null);
  const [profileLocation, setProfileLocation] = useState('');
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
          console.warn("Could not get live location for header map click", err);
        }
      );
    }
  };

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.location) {
          setProfileLocation(u.location);
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
          if (u.location) setProfileLocation(u.location);
        }
      } catch (e) {}
    };
    window.addEventListener('locationChanged', syncLocation);
    return () => window.removeEventListener('locationChanged', syncLocation);
  }, []);

  const langMap = {
    English: 'EN',
    German: 'DE',
    Arabic: 'AR'
  };

  // Add glassmorphism on scroll and check login state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(sessionStorage.getItem('is_logged_in') === 'true');
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-premium py-2 border-b border-slate-100' 
        : 'bg-white py-3.5 border-b border-slate-100'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Sauber & Fix Logo" 
              className="h-8.5 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="font-sans font-semibold text-slate-600 hover:text-primary transition-colors text-[13px]">
              {t('nav.services', 'Services')}
            </Link>
            <Link href="/#how-it-works" className="font-sans font-semibold text-slate-600 hover:text-primary transition-colors text-[13px]">
              {t('nav.howItWorks', 'How It Works')}
            </Link>
            <div className="relative py-1 flex items-center">
              <Link 
                href="/about-us" 
                className={`font-sans font-semibold transition-colors text-[13px] ${
                  pathname === '/about-us' ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                {t('nav.aboutUs', 'About Us')}
              </Link>
              {pathname === '/about-us' && (
                <div className="absolute -bottom-[20px] left-0 right-0 h-[3px] bg-primary rounded-full" />
              )}
            </div>
            <Link href="/#contact" className="font-sans font-semibold text-slate-600 hover:text-primary transition-colors text-[13px]">
              {t('nav.contactUs', 'Contact Us')}
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-6">
            
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

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 cursor-pointer group text-slate-650 hover:text-primary transition-colors text-[13px] font-sans font-semibold border-none bg-transparent"
              >
                <Globe className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                <span>{langMap[language] || 'EN'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-premium border border-slate-100 py-1 z-50">
                  {[
                    { code: 'English', label: 'English (EN)' },
                    { code: 'German', label: 'Deutsch (DE)' },
                    { code: 'Arabic', label: 'العربية (AR)' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 font-sans text-xs hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer font-bold ${
                        language === lang.code ? 'text-[#137DC5]' : 'text-slate-650'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm relative border border-slate-200 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white font-display font-extrabold text-[12px]">
                      {getInitials(user ? user.name : 'User')}
                    </div>
                    <span className="font-sans font-bold text-slate-700 text-[13px]">
                      {user ? user.name : 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-premium border border-slate-100 py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-slate-50">
                        <p className="font-sans font-bold text-slate-800 text-[13px]">{user ? user.name : 'User'}</p>
                        <p className="font-sans text-[11px] text-slate-400 truncate">{user ? user.email : 'user@email.com'}</p>
                      </div>
                      <Link href="/profile" className="flex items-center w-full px-3.5 py-2 font-sans text-[12.5px] text-slate-600 hover:bg-slate-50 hover:text-[#137DC5] transition-colors">
                        {t('nav.myProfile', 'My Profile')}
                      </Link>
                      <Link href="/orders" className="flex items-center w-full px-3.5 py-2 font-sans text-[12.5px] text-slate-600 hover:bg-slate-50 hover:text-[#137DC5] transition-colors">
                        {t('nav.myOrders', 'My Orders')}
                      </Link>
                      <button 
                        onClick={() => {
                          sessionStorage.removeItem('is_logged_in');
                          sessionStorage.removeItem('auth_token');
                          sessionStorage.removeItem('auth_user');
                          sessionStorage.removeItem('auth_email');
                          sessionStorage.removeItem('auth_otp');
                          window.location.reload();
                        }}
                        className="flex items-center w-full px-3.5 py-2 font-sans text-[12.5px] text-red-650 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        {t('nav.signOut', 'Sign Out')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Log in Button */}
                <Link 
                  href="/login"
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/50 transition-all font-sans font-bold text-[12.5px] cursor-pointer"
                >
                  {t('nav.login', 'Log in')}
                </Link>

                {/* Sign Up Button */}
                <Link 
                  href="/register"
                  className="px-5 py-2.5 rounded-lg bg-[#137DC5] hover:bg-[#0C5F97] text-white transition-all font-sans font-bold text-[12.5px] cursor-pointer shadow-sm shadow-blue-500/10"
                >
                  {t('nav.signUp', 'Sign Up')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Action Buttons (Directly in Header in place of sidebar/hamburger menu) */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <Link 
                href="/profile"
                className="w-8 h-8 rounded-full overflow-hidden shadow-sm relative border border-slate-200 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white font-display font-extrabold text-[12px] cursor-pointer"
              >
                {getInitials(user ? user.name : 'User')}
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:text-primary transition-all font-sans font-bold text-[11.5px] cursor-pointer bg-white"
                >
                  {t('nav.login', 'Log in')}
                </Link>

                <Link 
                  href="/register"
                  className="px-3.5 py-2 rounded-lg bg-[#137DC5] hover:bg-[#0C5F97] text-white transition-all font-sans font-bold text-[11.5px] cursor-pointer shadow-sm"
                >
                  {t('nav.signUp', 'Sign Up')}
                </Link>
              </>
            )}
          </div>
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
                      setProfileLocation(mainAddr);
                      try {
                        const storedUser = sessionStorage.getItem('auth_user') || '{}';
                        const u = JSON.parse(storedUser);
                        u.location = mainAddr;
                        u.latitude = targetLocation.lat;
                        u.longitude = targetLocation.lng;
                        sessionStorage.setItem('auth_user', JSON.stringify(u));
                        
                        // Dispatch custom event to notify BookingWidget
                        window.dispatchEvent(new Event('locationChanged'));
                      } catch (e) {}
                    } else {
                      const latlngStr = `${targetLocation.lat.toFixed(2)}, ${targetLocation.lng.toFixed(2)}`;
                      setProfileLocation(latlngStr);
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
                    setProfileLocation(latlngStr);
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
    </header>
  );
}
