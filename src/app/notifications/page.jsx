'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from '@/components/Footer';
import DashboardFooter from '@/components/DashboardFooter';
import { useLanguage } from '@/utils/LanguageContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(sessionStorage.getItem('is_logged_in') === 'true');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Header (Desktop Only) */}
      <div className="hidden md:block">
        {isLoggedIn ? <DashboardHeader /> : <Header />}
      </div>

      {/* 2. Main Content Wrapper */}
      <main className="flex-grow py-8 md:py-16 px-4">
        
        {/* ========================================================
            DESKTOP VIEWPORT LAYOUT (Shown only on Desktop/Tablet)
           ======================================================== */}
        <div className="hidden md:block max-w-[800px] mx-auto">
          {/* Breadcrumbs / Back button */}
          <div className="flex items-center gap-3 mb-6 text-left">
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50 shadow-sm transition-all cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-1.5 font-sans font-bold text-xs text-slate-450 uppercase tracking-wider">
              <Link href="/" className="hover:text-primary transition-all">Home</Link>
              <span>/</span>
              <span className="text-slate-700">Notifications</span>
            </div>
          </div>

          {/* Desktop Notifications Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-10 md:p-14 text-center shadow-[0_8px_30px_rgba(9,32,64,0.02)]">
            <div className="w-16 h-16 bg-[#EBF3FC] text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-50">
              <Bell size={28} className="stroke-[2]" />
            </div>

            <h2 className="font-sans font-extrabold text-slate-800 text-xl tracking-tight mb-2.5">
              {t('notif.emptyTitle', 'No Notifications Yet')}
            </h2>

            <p className="font-sans text-[13.5px] leading-relaxed text-slate-450 max-w-sm mx-auto">
              {t('notif.emptyDesc', "We will notify you when there's an update on your service bookings.")}
            </p>
          </div>
        </div>

        {/* ========================================================
            MOBILE VIEWPORT LAYOUT (Shown only on Mobile)
           ======================================================== */}
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col min-h-screen">
          {/* Header Bar */}
          <div className="flex items-center justify-center p-4 border-b border-slate-100 bg-white relative">
            <button 
              onClick={() => router.back()}
              className="absolute left-4 p-1 text-[#092040] cursor-pointer"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <h1 className="font-sans font-extrabold text-[#092040] text-base leading-none">
              {t('notif.title', 'Notifications')}
            </h1>
          </div>

          {/* Centered Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAFBFD]">
            <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md mb-6">
              <Bell size={32} className="text-slate-400 stroke-[1.8]" />
            </div>

            <h2 className="font-sans font-extrabold text-slate-800 text-base tracking-tight mb-2">
              {t('notif.emptyTitle', 'No Notifications Yet')}
            </h2>

            <p className="font-sans text-[12.5px] leading-relaxed text-slate-400 text-center max-w-[280px]">
              {t('notif.emptyDesc', "We will notify you when there's an update on your service bookings.")}
            </p>
          </div>
        </div>

      </main>

      {/* 3. Footer (Desktop Only) */}
      <div className="hidden md:block">
        {isLoggedIn ? <DashboardFooter /> : <Footer />}
      </div>
    </div>
  );
}
