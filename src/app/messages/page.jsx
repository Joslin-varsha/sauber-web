'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MessageCircle,
  Home,
  ShoppingBag,
  Plus,
  User,
  ArrowLeft,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';
import { useLanguage } from '@/utils/LanguageContext';

export default function MessagesPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [mobileBottomTab, setMobileBottomTab] = useState('messages');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, [router]);

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
              {t('nav.messages', 'Messages')}
            </h1>
            <p className="font-sans text-xs sm:text-[12.5px] text-slate-500 mt-0.5 font-semibold">
              {t('inbox.desc', 'Chat with your Sauber professionals instantly.')}
            </p>
          </div>

          {/* Desktop Empty State Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[350px] gap-4">
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#F0F6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0D6EFD'
            }}>
              <MessageSquare size={34} strokeWidth={2.2} />
            </div>
            <div className="text-center flex flex-col gap-1.5">
              <h3 className="font-sans font-extrabold text-[17px] text-[#092040]">
                {t('inbox.noMessages', 'No Messages Yet')}
              </h3>
              <p className="font-sans text-[13px] text-slate-400 font-medium max-w-[240px] mx-auto">
                {t('inbox.appearHere', 'Your worker conversations will appear here.')}
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>

      {/* ========================================================
          2. MOBILE VIEWPORT PORTAL / LAYOUT (Shown only on mobile)
         ======================================================== */}
      <div className="flex md:hidden flex-col min-h-screen bg-white pb-24 relative select-none" style={{ fontFamily: 'Inter, sans-serif' }}>
        
        {/* Messages Content */}
        <div className="flex flex-col px-5 pt-6 text-left animate-in fade-in duration-200" style={{ minHeight: 'calc(100vh - 100px)', background: 'white' }}>
          
          {/* Header Title */}
          <h1 className="font-sans font-black text-[24px] text-[#092040] tracking-tight mb-4">
            {t('nav.messages', 'Messages')}
          </h1>
          
          {/* Search Conversations Box */}
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('inbox.searchPlaceholder', 'Search conversations...')}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-sans text-xs outline-none focus:border-[#137DC5] transition-all"
              style={{
                height: '46px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1E293B'
              }}
            />
          </div>

          {/* Centered Empty State */}
          <div className="flex-grow flex flex-col items-center justify-center py-16 gap-4" style={{ marginTop: '60px' }}>
            {/* Soft Blue Circle with chat bubble */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#F0F6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0D6EFD'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div className="text-center flex flex-col gap-1.5 mt-2">
              <h3 className="font-sans font-extrabold text-[17px] text-[#092040] leading-tight">
                {t('inbox.noMessages', 'No Messages Yet')}
              </h3>
              <p className="font-sans text-[13px] text-slate-400 font-medium leading-normal max-w-[240px] mx-auto">
                {t('inbox.appearHere', 'Your worker conversations will appear here.')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Sticky Footer */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(9,32,64,0.08)] px-0 py-1.5 flex items-center justify-between" style={{ paddingBottom: '10px' }}>
          <button 
            type="button"
            onClick={() => router.push('/home')}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-450 hover:text-[#0D6EFD]"
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
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-[#0D6EFD]"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.messages', 'Messages')}</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('mobileActiveTab', 'profile');
              }
              router.push('/profile');
            }}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer transition-all text-slate-455 hover:text-[#0D6EFD]"
          >
            <User className="w-[18px] h-[18px]" />
            <span className="font-sans font-semibold text-[8.5px]">{t('nav.myProfile', 'Profile')}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
