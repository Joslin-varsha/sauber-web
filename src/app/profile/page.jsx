'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, 
  User, 
  ShoppingBag, 
  Globe, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  BadgeCheck,
  Edit3,
  X,
  Check,
  Home,
  MessageCircle,
  Plus,
  Star,
  MapPin,
  Users,
  Search,
  Award,
  Lock,
  Paintbrush,
  Headphones,
  Bell,
  ArrowLeft,
  MoreVertical,
  Mic,
  Phone,
  Zap,
  Droplet,
  Hammer
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';
import DownloadBanner from '@/components/DownloadBanner';
import { authApi } from '@/utils/api';
import { useLanguage } from '@/utils/LanguageContext';

export default function ProfilePage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  
  // Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [memberSince, setMemberSince] = useState('');
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('home');
  const [isMobileLocOpen, setIsMobileLocOpen] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);


  // Fetch profile from backend API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.getProfile();
      if (response.data) {
        const u = response.data;
        setProfileName(u.name || '');
        setProfileEmail(u.email || '');
        setProfilePhone(u.phone || '');
        setProfileLocation(u.location || '');
        
        // Format member since date
        if (u.member_since) {
          const date = new Date(u.member_since);
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          setMemberSince(`${months[date.getMonth()]} ${date.getFullYear()}`);
        }

        // Sync auth_user details to storage
        sessionStorage.setItem('auth_user', JSON.stringify({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          location: u.location
        }));
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      
      // Fallback to local storage if API fails or offline
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setProfileName(u.name || '');
          setProfileEmail(u.email || '');
          setProfilePhone(u.phone || '');
          setProfileLocation(u.location || '');
        } catch (e) {
          console.error(e);
          setError(err.message || 'Failed to load profile');
        }
      } else {
        setError(err.message || 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }

      fetchProfile();

      const storedTab = sessionStorage.getItem('mobileActiveTab');
      if (storedTab && storedTab !== 'home') {
        setMobileActiveTab(storedTab);
        sessionStorage.removeItem('mobileActiveTab');
      } else {
        // Default to profile tab on mobile — home is now its own page
        setMobileActiveTab('profile');
        sessionStorage.removeItem('mobileActiveTab');
        sessionStorage.removeItem('just_logged_in');
      }
    }
  }, []);

  // Handle Profile Update
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    try {
      const response = await authApi.updateProfile(tempName, tempLocation);
      if (response.data) {
        const u = response.data;
        setProfileName(u.name || '');
        setProfileLocation(u.location || '');
        
        // Sync updated info to sessionStorage
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userObj.name = u.name;
            userObj.location = u.location;
            sessionStorage.setItem('auth_user', JSON.stringify(userObj));
          } catch (err) {
            console.error(err);
          }
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditModalOpen(false);
        window.location.reload(); // reload to update headers
      }, 800);
    } catch (err) {
      alert(err.message || 'Profile update failed. Please try again.');
    }
  };

  // Open Edit Modal
  const openEditModal = () => {
    setTempName(profileName);
    setTempEmail(profileEmail);
    setTempLocation(profileLocation || '');
    setIsEditModalOpen(true);
  };

  // Menu items list matching mockup
  const menuItems = [
    {
      name: t('nav.myOrders', 'My Orders'),
      icon: ShoppingBag,
      action: () => router.push('/dashboard/orders'),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.changeLanguage', 'Change Language'),
      icon: Globe,
      action: () => setIsLanguageSheetOpen(true),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.findWorkers', 'Find Workers'),
      icon: User,
      action: () => router.push('/workers'),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.helpSupport', 'Help & Support'),
      icon: HelpCircle,
      action: () => alert('Support email: support@sauber.com'),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.privacyPolicy', 'Privacy Policy'),
      icon: ShieldCheck,
      action: () => alert('Privacy Policy content coming soon.'),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.termsConditions', 'Terms & Conditions'),
      icon: FileText,
      action: () => alert('Terms & Conditions content coming soon.'),
      colorClass: 'bg-[#EAF3FA] text-[#137DC5]'
    },
    {
      name: t('profile.logout', 'Logout'),
      icon: LogOut,
      action: () => setIsLogoutModalOpen(true),
      colorClass: 'bg-[#FDF2F2] text-[#EF4444]',
      isLogout: true
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFCFF] text-slate-800">
        <DashboardHeader />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#137DC5] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-sans font-bold text-slate-500 text-sm">Loading Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profileName) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFCFF] text-slate-800">
        <DashboardHeader />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md w-full shadow-lg">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <User className="w-8 h-8" />
            </div>
            <h3 className="font-display font-extrabold text-[18px] text-[#092040] mb-2">
              Unable to load profile details
            </h3>
            <p className="font-sans text-[13px] text-slate-500 font-semibold mb-6">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-3 border border-slate-200 hover:border-slate-350 text-slate-650 font-sans font-bold text-[13px] rounded-xl cursor-pointer transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={fetchProfile}
                className="flex-1 py-3 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-bold text-[13px] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] md:bg-[#FAFCFF]">
      
      {/* ========================================================
          1. DESKTOP VIEWPORT LAYOUT (Shown only on screens md and up)
         ======================================================== */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* Header */}
        <DashboardHeader />

        {/* Main content */}
        <main className="flex-grow max-w-[840px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-4 sm:pb-12 flex flex-col gap-4.5">
          
          {/* Title */}
          <div className="text-left mt-0">
            <h1 className="font-display font-extrabold text-xl sm:text-[24px] text-[#092040] tracking-tight">
              {t('profile.title', 'My Profile')}
            </h1>
            <p className="font-sans text-xs sm:text-[12.5px] text-slate-500 mt-0.5 font-semibold">
              {t('profile.subtitle', 'Manage your account information and preferences.')}
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4.5 sm:p-5.5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar Container */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-sm border border-slate-200 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white font-display font-extrabold text-[24px]">
                <span className="relative z-0">
                  {profileName ? profileName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </span>
                
                {/* Photo Upload Camera Icon Overlay */}
                <button 
                  onClick={openEditModal}
                  className="absolute bottom-0 right-0 z-20 w-6.5 h-6.5 rounded-full bg-[#137DC5] text-white border-2 border-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Profile Information details */}
              <div className="flex flex-col gap-1 items-center sm:items-start">
                <h2 className="font-display font-extrabold text-lg sm:text-[18px] text-[#092040]">
                  {profileName}
                </h2>
                <span className="font-sans text-xs sm:text-[12.5px] text-slate-400 font-semibold leading-none">
                  {profileEmail}
                </span>
                
                {/* Verified Badge */}
                <div className="mt-0.5 flex items-center gap-1 px-2.5 py-0.5 bg-[#EAF3FA] rounded-full w-fit">
                  <BadgeCheck className="w-3.5 h-3.5 fill-[#137DC5] text-white" />
                  <span className="font-sans font-bold text-[10.5px] text-[#137DC5]">
                    {t('profile.verifiedUser', 'Verified User')}
                  </span>
                </div>
   
                {/* Member Since */}
                <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-semibold mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member since {memberSince}</span>
                </div>
                {profileLocation && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-semibold mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {profileLocation}</span>
                  </div>
                )}
                {profilePhone && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-semibold mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone: {profilePhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button 
              onClick={openEditModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#D0E2F5] hover:border-[#137DC5] rounded-lg font-sans font-bold text-xs sm:text-[12.5px] text-[#137DC5] hover:bg-blue-50/20 transition-all cursor-pointer shadow-sm mt-2 sm:mt-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#137DC5]" />
              <span>{t('edit.title', 'Edit Profile')}</span>
            </button>
          </div>

          {/* Options Navigation List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden divide-y divide-slate-200">
            {menuItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/40 transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon Block */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-105 flex-shrink-0 ${item.colorClass}`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    
                    {/* Name */}
                    <span className={`font-sans font-bold text-xs sm:text-[13px] transition-colors ${
                      item.isLogout ? 'text-[#EF4444]' : 'text-slate-650 group-hover:text-[#092040]'
                    }`}>
                      {item.name}
                    </span>
                  </div>
   
                  {/* Right Arrow Chevron */}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                    item.isLogout ? 'text-red-400' : 'text-slate-400 group-hover:text-[#137DC5]'
                  }`} />
                </button>
              );
            })}
          </div>
          
          {/* Download Banner */}
          <DownloadBanner />
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>

      {/* ========================================================
          2. MOBILE VIEWPORT PORTAL / LAYOUT (Shown only on mobile)
         ======================================================== */}
      <div className="flex md:hidden flex-col min-h-screen bg-[#F8FAFC] pb-24 relative select-none">
        {mobileNotificationsOpen ? (
          <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header: Title Centered, Back Arrow left */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 20px',
              background: 'white',
              borderBottom: '1px solid #F1F5F9',
              position: 'relative'
            }}>
              <button 
                type="button"
                onClick={() => setMobileNotificationsOpen(false)}
                style={{
                  position: 'absolute',
                  left: '16px',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#092040',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={24} strokeWidth={2.5} className="text-[#092040]" />
              </button>
              <h1 style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#092040',
                margin: 0
              }}>
                {t('notif.title', 'Notifications')}
              </h1>
            </div>

            {/* Empty State Centered Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              background: '#FAFBFD',
              minHeight: 'calc(100vh - 120px)'
            }}>
              {/* Circular Bell Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(9,32,64,0.04)',
                border: '1px solid #F1F5F9',
                marginBottom: '24px'
              }}>
                <Bell size={32} color="#94A3B8" strokeWidth={1.5} />
              </div>

              {/* Bold Title */}
              <h2 style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#092040',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                {t('notif.emptyTitle', 'No Notifications Yet')}
              </h2>

              {/* Description text */}
              <p style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#94A3B8',
                lineHeight: '1.5',
                textAlign: 'center',
                margin: 0,
                maxWidth: '280px',
                fontFamily: 'Inter, sans-serif'
              }}>
                {t('notif.emptyDesc', "We will notify you when there's an update on your service bookings.")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Sticky Header */}
        {(
          mobileActiveTab === 'profile' ? (
            <header className="sticky top-0 z-40 bg-[#F8FAFC] px-5 py-4.5 flex items-center justify-between select-none">
              <h1 className="font-display font-black text-[24px] text-[#092040] tracking-tight">
                {t('profile.title', 'Profile')}
              </h1>
              
              {/* Bell notification with red dot badge */}
              <button 
                onClick={() => setMobileNotificationsOpen(true)}
                className="relative p-1 active:scale-95 transition-all text-[#092040] hover:text-[#137DC5] cursor-pointer"
              >
                <Bell className="w-6 h-6 stroke-[2]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              </button>
            </header>
          ) : (
            <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img src="/logo.png" alt="Sauber & Fix Logo" className="h-8 w-auto object-contain" />
              </Link>

              {/* Location & Translate Actions with dynamic city dropdown */}
              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => setIsMobileLocOpen(!isMobileLocOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 active:scale-95 rounded-full font-sans font-bold text-[10.5px] text-slate-800 transition-all cursor-pointer shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#137DC5]" />
                  <span>{profileLocation || 'Germany'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#137DC5] transition-transform duration-200 ${isMobileLocOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileLocOpen && (
                  <div className="absolute right-0 top-[110%] bg-white border border-slate-100 rounded-xl shadow-premium py-1.5 z-50 w-36 overflow-hidden animate-fadeIn text-left">
                    {Array.from(new Set((homeLocations || []).map(l => l.city).filter(Boolean)))
                      .slice(0, 6)
                      .map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setProfileLocation(city);
                            setIsMobileLocOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 font-sans font-bold text-[11px] hover:bg-slate-50 transition-colors ${profileLocation === city ? 'text-[#137DC5] bg-blue-50/30' : 'text-slate-650'}`}
                        >
                          {city}
                        </button>
                      ))}
                    {(!homeLocations || homeLocations.length === 0) && ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setProfileLocation(city);
                          setIsMobileLocOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 font-sans font-bold text-[11px] hover:bg-slate-50 transition-colors ${profileLocation === city ? 'text-[#137DC5] bg-blue-50/30' : 'text-slate-650'}`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
                
                <button 
                  onClick={() => alert('Translations: DE / EN')}
                  className="w-8.5 h-8.5 rounded-full bg-white border border-slate-200 text-[#137DC5] flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <span className="font-sans font-bold text-[10.5px]">文A</span>
                </button>
              </div>
            </header>
          )
        )}

        {/* Workers List Tab */}
        {mobileActiveTab === 'workers' && (
          <div className="flex flex-col gap-4 px-4 pt-4 text-left animate-in fade-in duration-200">
            <div className="flex flex-col gap-1 text-left">
              <h2 className="font-display font-black text-lg text-[#092040] tracking-tight">Available Workers</h2>
              <p className="font-sans text-[11px] text-slate-400 font-semibold leading-none">Book background-checked professionals in Germany.</p>
            </div>

            {/* Search Input Box */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cleaning, handyman, gardening..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-sans text-xs outline-none focus:border-[#137DC5] transition-all"
              />
            </div>

            {/* Workers grid list */}
            <div className="flex flex-col gap-3">
              {[
                { name: 'James Anderson', role: 'Premium Cleaning', price: '€22/hr', rating: '4.9 (180 reviews)', img: '/workers/james-anderson.png' },
                { name: 'Liam Johnson', role: 'Handyman Specialist', price: '€25/hr', rating: '4.8 (124 reviews)', img: '/workers/liam-johnson.png' },
                { name: 'Olivia Taylor', role: 'Professional Painter', price: '€24/hr', rating: '4.9 (95 reviews)', img: '/workers/olivia-taylor.png' },
                { name: 'Sophia Mueller', role: 'Deep Cleaning Pro', price: '€23/hr', rating: '5.0 (42 reviews)', img: '/workers/sophia-mueller.png' }
              ].map((w, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-[0_1px_5px_rgba(0,0,0,0.015)]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                      <img src={w.img} alt={w.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left gap-0.5">
                      <span className="font-sans font-bold text-xs text-[#092040]">{w.name}</span>
                      <span className="font-sans font-semibold text-[10px] text-[#137DC5]">{w.role}</span>
                      <span className="font-sans font-medium text-[9px] text-slate-400">★ {w.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="font-display font-extrabold text-[12px] text-slate-800 leading-none">{w.price}</span>
                    <button 
                      onClick={() => alert(`Initiating direct booking session with ${w.name}...`)}
                      className="px-3 py-1 bg-[#137DC5] hover:bg-[#0C5F97] rounded-lg font-sans font-bold text-[9px] text-white transition-all cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {mobileActiveTab === 'profile' && (
          <div className="flex flex-col gap-5 px-5 pt-3 text-left animate-in fade-in duration-200">
            
            {/* Profile Card */}
            <div className="bg-white border border-slate-100 rounded-[22px] p-5 shadow-[0_2px_12px_rgba(9,32,64,0.015)] flex items-center justify-between gap-3 relative overflow-hidden">
              <div className="flex items-center gap-4">
                {/* Avatar Container */}
                <div className="relative w-18 h-18 rounded-full shadow-sm border border-slate-100 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white font-display font-extrabold text-[22px]">
                  <span className="relative z-0">
                    {profileName ? profileName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                  
                  {/* Photo Upload Camera Icon Overlay */}
                  <button 
                    onClick={openEditModal}
                    className="absolute bottom-[-2px] left-[50%] -translate-x-[50%] z-20 w-6.5 h-6.5 rounded-full bg-[#137DC5] text-white border-2 border-white flex items-center justify-center shadow-md cursor-pointer active:scale-110 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 fill-white text-white" />
                  </button>
                </div>

                {/* Profile Information details */}
                <div className="flex flex-col gap-1 text-left">
                  <h2 className="font-display font-black text-[16px] text-[#092040] leading-none">
                    {profileName}
                  </h2>
                  <span className="font-sans text-[11px] text-slate-400 font-bold leading-none">
                    {profileEmail}
                  </span>
                  {profileLocation && (
                    <span className="font-sans text-[10px] text-slate-400 font-semibold leading-none mt-1">
                      📍 {profileLocation}
                    </span>
                  )}
                  {profilePhone && (
                    <span className="font-sans text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
                      📞 {profilePhone}
                    </span>
                  )}
                  
                  {/* Verified Badge */}
                  <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 bg-[#EFF6FF] border border-blue-50 rounded-full w-fit">
                    <BadgeCheck className="w-3.5 h-3.5 fill-[#137DC5] text-white" />
                    <span className="font-sans font-extrabold text-[9px] text-[#137DC5]">
                      {t('profile.verifiedUser', 'VerifiedUser')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soft blue House Illustration on the right */}
              <div className="flex items-center justify-end select-none pointer-events-none pr-1">
                <svg width="90" height="80" viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-auto object-contain flex-shrink-0 opacity-90">
                  <ellipse cx="55" cy="50" rx="26" ry="22" fill="#F0F7FF" opacity="0.8"/>
                  <path d="M18 58C16.5 53 18 49 21 49C24 49 25.5 53 24 58H18Z" fill="#E0F2FE" opacity="0.6"/>
                  <rect x="58" y="20" width="7" height="13" fill="#BFDBFE" rx="1"/>
                  <path d="M28 36h38v28H28Z" fill="#EFF6FF"/>
                  <path d="M28 36l19-15 19 15H28Z" fill="#BFDBFE"/>
                  <rect x="44" y="49" width="8" height="15" fill="#EFF6FF" rx="0.5"/>
                  <circle cx="50" cy="56" r="0.7" fill="#3B82F6"/>
                  <rect x="34" y="42" width="7" height="7" fill="#EFF6FF" rx="0.5"/>
                  <rect x="52" y="42" width="7" height="7" fill="#EFF6FF" rx="0.5"/>
                  <line x1="20" y1="64" x2="75" y2="64" stroke="#E0F2FE" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Options Navigation List */}
            <div className="bg-white border border-slate-100 rounded-[22px] overflow-hidden divide-y divide-slate-100 shadow-[0_2px_12px_rgba(9,32,64,0.015)] flex flex-col">
              {[
                {
                  name: t('profile.myPosts', 'My Posts'),
                  icon: FileText,
                  action: () => router.push('/orders'),
                  colorClass: 'bg-[#EFF6FF] text-[#137DC5]'
                },
                {
                  name: t('profile.changeLanguage', 'Change Language'),
                  icon: Globe,
                  action: () => setIsLanguageSheetOpen(true),
                  colorClass: 'bg-[#EFF6FF] text-[#137DC5]'
                },
                {
                  name: t('profile.helpSupport', 'Help & Support'),
                  icon: HelpCircle,
                  action: () => alert('Support email: support@sauber.com'),
                  colorClass: 'bg-[#EFF6FF] text-[#137DC5]'
                },
                {
                  name: t('profile.privacyPolicy', 'Privacy Policy'),
                  icon: ShieldCheck,
                  action: () => alert('Privacy Policy content coming soon.'),
                  colorClass: 'bg-[#EFF6FF] text-[#137DC5]'
                },
                {
                  name: t('profile.termsConditions', 'Terms & Conditions'),
                  icon: FileText,
                  action: () => alert('Terms & Conditions content coming soon.'),
                  colorClass: 'bg-[#EFF6FF] text-[#137DC5]'
                }
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/40 active:bg-slate-50/20 transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Icon Block with rounded square background */}
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center flex-shrink-0 ${item.colorClass}`}>
                        <ItemIcon className="w-5 h-5 stroke-[2]" />
                      </div>
                      
                      {/* Name */}
                      <span className="font-sans font-extrabold text-[13px] text-slate-800 tracking-wide">
                        {item.name}
                      </span>
                    </div>

                    {/* Right Arrow Chevron */}
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>

            {/* Separate Logout Card Container */}
            <div className="bg-white border border-slate-100 rounded-[22px] p-4.5 shadow-[0_2px_12px_rgba(9,32,64,0.015)]">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-1 font-sans font-bold text-[13.5px] text-[#EF4444] active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-[#EF4444]" />
                <span>{t('profile.logout', 'Logout')}</span>
              </button>
            </div>

          </div>
        )}

        {/* Tab Navigation Sticky Footer */}
        {true && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(9,32,64,0.08)] px-0 py-1.5 flex items-center justify-between" style={{ paddingBottom: '10px' }}>
            <button 
              type="button"
              onClick={() => router.push('/home')}
              className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]`}
            >
              <Home className="w-[18px] h-[18px]" />
              <span className="font-sans font-semibold text-[8.5px]">{t('nav.home', 'Home')}</span>
            </button>

            <button 
              type="button"
              onClick={() => router.push('/dashboard/orders')}
              className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-455 hover:text-[#0D6EFD]"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              <span className="font-sans font-semibold text-[8.5px]">{t('nav.myOrders', 'My Orders')}</span>
            </button>

            {/* Floating plus button */}
            <div className="relative flex justify-center items-center flex-1 h-10 -mt-5 select-none">
              <button 
                type="button"
                onClick={() => router.push('/add-post')}
                className="absolute w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#137DC5] to-[#0d5fa0] active:scale-95 transition-all text-white flex items-center justify-center shadow-[0_4px_16px_rgba(19,125,197,0.45)] border-[2px] border-white z-20 cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <button 
              type="button"
              onClick={() => router.push('/messages')}
              className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-455 hover:text-[#0D6EFD]"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              <span className="font-sans font-semibold text-[8.5px]">{t('nav.messages', 'Messages')}</span>
            </button>

            <button 
              type="button"
              onClick={() => setMobileActiveTab('profile')}
              className={`flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all ${
                mobileActiveTab === 'profile' ? 'text-[#0D6EFD]' : 'text-slate-455 hover:text-[#0D6EFD]'
              }`}
            >
              <User className="w-[18px] h-[18px]" />
              <span className="font-sans font-semibold text-[8.5px]">{t('nav.myProfile', 'Profile')}</span>
            </button>
          </nav>
        )}
        </>
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
                  {t('lang.title', 'Choose Language')}
                </h3>
                <p className="font-sans text-[12.5px] text-[#94A3B8] font-bold leading-none mt-1.5">
                  {t('lang.subtitle', 'Select your preferred language')}
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
                        {/* Waving flag SVG */}
                        {lang.flag}
                        
                        {/* Text labels */}
                        <div className="flex flex-col text-left">
                          <span className={`font-sans font-bold text-[14px] leading-tight ${
                            isSelected ? 'text-[#137DC5]' : 'text-[#092040]'
                          }`}>
                            {lang.label}
                          </span>
                          <span className={`font-sans text-[11px] font-semibold leading-normal mt-0.5 ${
                            isSelected ? 'text-[#94A3B8]' : 'text-slate-400'
                          }`}>
                            {lang.sub}
                          </span>
                        </div>
                      </div>

                      {/* Checked Circle Badge */}
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

      {/* ========================================================
          3. SHARED MODALS (Used by both desktop and mobile viewports)
         ======================================================== */}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsEditModalOpen(false)}
            className="absolute inset-0 bg-[#092040]/30 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
              <h3 className="font-display font-extrabold text-[#092040] text-base">{t('edit.title', 'Edit Account Details')}</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                  {t('edit.displayName', 'Display Name')}
                </label>
                <input 
                  type="text" 
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:bg-white rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                  {t('edit.email', 'Email Address (Not Editable)')}
                </label>
                <input 
                  type="email" 
                  disabled
                  value={tempEmail}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-sans text-sm text-slate-400 transition-all outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-bold text-[11.5px] text-[#092040]/75 uppercase tracking-wide">
                  {t('edit.location', 'Location')}
                </label>
                <input 
                  type="text" 
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#137DC5] focus:bg-white rounded-xl font-sans text-sm text-slate-800 transition-all outline-none"
                  placeholder="Enter location"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-2 border-t border-slate-50 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-sans font-bold text-xs sm:text-sm text-slate-500 transition-all cursor-pointer"
                >
                  {t('edit.cancel', 'Cancel')}
                </button>
                <button 
                  type="submit"
                  disabled={saveSuccess}
                  className="px-5 py-2.5 bg-[#137DC5] hover:bg-[#0C5F97] active:scale-98 rounded-xl font-sans font-bold text-xs sm:text-sm text-white transition-all cursor-pointer flex items-center justify-center gap-2 min-w-[90px]"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>{t('edit.saved', 'Saved!')}</span>
                    </>
                  ) : (
                    <span>{t('edit.saveChanges', 'Save Changes')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setIsLogoutModalOpen(false)}
            className="absolute inset-0 bg-[#092040]/30 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-10 p-6 flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display font-extrabold text-[#092040] text-base">{t('logout.title', 'Sign Out')}</h3>
              <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold">
                {t('logout.desc', 'Are you sure you want to log out of your Sauber account?')}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-sans font-bold text-xs sm:text-sm text-slate-500 transition-all cursor-pointer"
              >
                {t('logout.cancel', 'Cancel')}
              </button>
              <button 
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  sessionStorage.removeItem('is_logged_in');
                  sessionStorage.removeItem('auth_token');
                  sessionStorage.removeItem('auth_user');
                  sessionStorage.removeItem('auth_email');
                  sessionStorage.removeItem('auth_otp');
                  router.push('/login');
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 active:scale-98 rounded-xl font-sans font-bold text-xs sm:text-sm text-white transition-all cursor-pointer"
              >
                {t('logout.confirm', 'Logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
