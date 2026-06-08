'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check,
  Lock,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  Home,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [transactionId] = useState(() => searchParams.get('payment_id') || searchParams.get('payment_intent') || 'PAY-2024-12568');
  const [bookingId] = useState(() => searchParams.get('booking_id') || '#JOB-2024-1256');
  const [dateTimeStr] = useState(() => searchParams.get('datetime') || '24 May 2024, 10:00 AM');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (!isLoggedIn) {
        sessionStorage.setItem('redirect_after_login', '/payment/success');
        router.push('/login');
        return;
      }
      setIsAuthorized(true);
    }
  }, [router]);

  // Search parameters passed from workers booking panel (with mockup defaults)
  const service = searchParams.get('service') || 'Apartment Deep Cleaning';
  const amount = searchParams.get('amount') || '549';
  const workerName = searchParams.get('worker') || 'your provider';

  const parsedAmount = parseFloat(amount);
  const displayAmount = isNaN(parsedAmount) ? amount : (parsedAmount % 1 === 0 ? parsedAmount.toFixed(0) : parsedAmount.toFixed(2));

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFCFF] font-sans">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#137DC5] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 font-bold text-sm">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">
      
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col flex-grow w-full bg-white">
        <DashboardHeader />

        <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 w-full text-center">
          <div className="max-w-[760px] mx-auto">

            {/* Animated Success Graphic & Confetti */}
            <div className="relative w-72 h-32 mx-auto mb-6 flex items-center justify-center">
              {/* Success Check circle inside light green ring */}
              <div className="z-10 w-[84px] h-[84px] bg-[#19A859]/10 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-[#19A859] rounded-full flex items-center justify-center text-white shadow-sm">
                  <Check className="w-7 h-7 stroke-[3.5]" />
                </div>
              </div>

              {/* Confetti particles exactly matching the mockup */}
              {/* Top-left green pill */}
              <div className="absolute top-6 left-[76px] w-2.5 h-5.5 bg-[#19A859]/80 rounded-full rotate-[30deg]"></div>
              {/* Top-left yellow diamond */}
              <div className="absolute top-16 left-[56px] w-3 h-3 bg-amber-400 rotate-12 rounded-[2px]"></div>
              {/* Middle-left blue square */}
              <div className="absolute bottom-6 left-[84px] w-3 h-3 bg-[#137DC5] rotate-45 rounded-[2px]"></div>
              {/* Top green circle/dot */}
              <div className="absolute top-4 left-[124px] w-2 h-2 bg-[#19A859] rounded-full"></div>

              {/* Top-right green circle/dot */}
              <div className="absolute top-4 right-[124px] w-2 h-2 bg-[#19A859] opacity-60 rounded-full"></div>
              {/* Top-right blue square */}
              <div className="absolute top-12 right-[80px] w-2.5 h-2.5 bg-[#137DC5] opacity-75 rotate-[15deg] rounded-[2px]"></div>
              {/* Right green pill */}
              <div className="absolute top-20 right-[56px] w-2.5 h-5 bg-[#19A859]/50 rounded-full rotate-[-45deg]"></div>
              {/* Bottom-right yellow diamond */}
              <div className="absolute bottom-6 right-[88px] w-3 h-3 bg-amber-400 rotate-45 rounded-[2px]"></div>
            </div>

            {/* Titles */}
            <h1 className="font-sans font-extrabold text-[28px] sm:text-[32px] text-[#092040] tracking-tight leading-tight">
              Payment Completed Successfully!
            </h1>
            <p className="font-sans text-[14px] text-slate-500 font-medium mt-3.5 max-w-lg mx-auto leading-relaxed">
              Your payment has been received and your booking is confirmed.
              <br />
              Thank you for choosing Sauber.
            </p>

            {/* Secure Transaction Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#EAF7F0] px-3.5 py-1.5 rounded-lg text-[#19A859] font-sans font-bold text-[12px] mt-5.5">
              <Lock className="w-3.5 h-3.5 text-[#19A859]" />
              <span>Transaction Secure</span>
            </div>

            {/* Details Section */}
            <div className="text-left mt-14 w-full">
              <h2 className="font-sans font-extrabold text-[15px] text-[#092040] mb-6 pl-1">Payment Details</h2>

              {/* Two-Column Grid without Border/Shadow/Divider */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 px-1">

                {/* Column 1 */}
                <div className="flex flex-col gap-6">

                  {/* Payment ID */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Payment ID</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{transactionId}</p>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <Calendar className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Booking ID</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{bookingId}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Date & Time</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{dateTimeStr}</p>
                    </div>
                  </div>

                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-6">

                  {/* Service */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <Home className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Service</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{service}</p>
                    </div>
                  </div>

                  {/* Amount Paid */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#137DC5] flex items-center justify-center text-white font-sans font-black text-[18px] flex-shrink-0 shadow-sm shadow-[#137DC5]/15">
                      €
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Amount Paid</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{displayAmount}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <CreditCard className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Payment Method</p>
                      <p className="font-sans font-bold text-[#092040] text-[13.5px] mt-0.5 leading-snug">{searchParams.get('method') || 'Stripe'}</p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF5FA] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                      <CheckCircle className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="font-sans text-slate-400 font-medium text-[12px] leading-tight">Payment Status</p>
                      <p className="font-sans font-extrabold text-[#19A859] text-[13.5px] mt-0.5 leading-snug">Completed</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Status Alert Banner */}
              <div className="bg-[#EAF7F0] rounded-xl p-4.5 mt-9 flex items-start gap-3.5">
                <div className="w-6 h-6 bg-[#19A859] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
                <div className="flex flex-col text-left justify-center">
                  <p className="font-sans font-bold text-[#19A859] text-[13.5px] leading-tight">
                    All set!
                  </p>
                  <p className="font-sans text-[12.5px] text-[#19A859]/85 font-medium mt-1 leading-normal">
                    We have sent the payment confirmation to your registered email.
                  </p>
                </div>
              </div>

            </div>

            {/* Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-9 justify-center">
              <button
                onClick={() => router.push('/dashboard/orders')}
                className="w-full sm:w-[240px] py-3.5 px-6 bg-white border border-[#137DC5] hover:bg-slate-50 text-[#137DC5] font-sans font-bold text-[13px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 stroke-[2.2]" />
                <span>View My Orders</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-[240px] py-3.5 px-6 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-bold text-[13px] rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 stroke-[2.2]" />
                <span>Go to Dashboard</span>
              </button>
            </div>

          </div>
        </main>

        <DashboardFooter />
      </div>

      {/* MOBILE VIEW */}
      <div className="flex flex-col md:hidden min-h-screen bg-[#FAFBFD]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Mobile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 20px',
          background: 'white',
          position: 'sticky',
          top: 0,
          borderBottom: '1px solid #E2E8F0',
          zIndex: 50
        }}>
          <button
            onClick={() => router.push('/orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              cursor: 'pointer',
              padding: 8,
              position: 'absolute',
              left: 20
            }}
          >
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="#092040" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#092040', letterSpacing: -0.3 }}>Payment Success</span>
        </div>

        {/* Mobile Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px 20px' }}>
          
          {/* Confetti & Success Graphic */}
          <div style={{ position: 'relative', width: 280, height: 120, margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EAF7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#19A859', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 6px rgba(25, 168, 89, 0.15)' }}>
                <Check style={{ width: 28, height: 28 }} strokeWidth={3.5} />
              </div>
            </div>
            
            {/* Confetti particles */}
            {/* Top-left green pill */}
            <div style={{ position: 'absolute', top: 12, left: 80, width: 9, height: 20, background: 'rgba(25, 168, 89, 0.8)', borderRadius: 99, transform: 'rotate(30deg)' }}></div>
            {/* Top-left yellow diamond */}
            <div style={{ position: 'absolute', top: 54, left: 62, width: 11, height: 11, background: '#F59E0B', transform: 'rotate(12deg)', borderRadius: 2 }}></div>
            {/* Middle-left blue square */}
            <div style={{ position: 'absolute', bottom: 12, left: 88, width: 11, height: 11, background: '#137DC5', transform: 'rotate(45deg)', borderRadius: 2 }}></div>
            {/* Top green circle/dot */}
            <div style={{ position: 'absolute', top: 6, left: 130, width: 8, height: 8, background: '#19A859', borderRadius: '50%' }}></div>

            {/* Top-right green circle/dot */}
            <div style={{ position: 'absolute', top: 6, right: 130, width: 8, height: 8, background: '#19A859', opacity: 0.6, borderRadius: '50%' }}></div>
            {/* Top-right blue square */}
            <div style={{ position: 'absolute', top: 20, right: 84, width: 9, height: 9, background: '#137DC5', opacity: 0.75, transform: 'rotate(15deg)', borderRadius: 2 }}></div>
            {/* Right green pill */}
            <div style={{ position: 'absolute', top: 58, right: 62, width: 9, height: 18, background: 'rgba(25, 168, 89, 0.5)', borderRadius: 99, transform: 'rotate(-45deg)' }}></div>
            {/* Bottom-right yellow diamond */}
            <div style={{ position: 'absolute', bottom: 12, right: 92, width: 11, height: 11, background: '#F59E0B', transform: 'rotate(45deg)', borderRadius: 2 }}></div>
          </div>

          {/* Titles */}
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#092040', letterSpacing: -0.5, lineHeight: 1.25, margin: '0 0 10px 0', textAlign: 'center' }}>
            Payment Completed Successfully!
          </h1>
          <p style={{ fontWeight: 550, fontSize: 13, color: '#94A3B8', lineHeight: 1.45, margin: '0 auto', maxWidth: 280, textAlign: 'center' }}>
            Your payment has been received and your booking is confirmed. Thank you for choosing Sauber.
          </p>

          {/* Secure Transaction Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '14px auto 0 auto', background: '#EAF7F0', padding: '6px 12px', borderRadius: 20, width: 'fit-content' }}>
            <Lock size={12} color="#19A859" />
            <span style={{ fontWeight: 700, fontSize: 11.5, color: '#19A859', textTransform: 'capitalize' }}>Transaction Secure</span>
          </div>

          {/* Payment Details Container */}
          <div style={{ marginTop: 32, textAlign: 'left' }}>
            <h3 style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: '0 0 16px 0' }}>
              Payment Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: '0 16px', overflow: 'hidden' }}>
              {/* Row 1: Payment ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="#137DC5" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Payment ID</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{transactionId}</span>
                </div>
              </div>

              {/* Row 2: Booking ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <Calendar style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>BookingID</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{bookingId}</span>
                </div>
              </div>

              {/* Row 3: Date & Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <Clock style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Date & Time</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{dateTimeStr}</span>
                </div>
              </div>

              {/* Row 4: Service */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <Home style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Service</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{service}</span>
                </div>
              </div>

              {/* Row 5: Amount Paid */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'sans-serif', color: '#137DC5' }}>₹</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Amount Paid</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{displayAmount}</span>
                </div>
              </div>

              {/* Row 6: Payment Method */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <CreditCard style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Payment Method</span>
                  <span style={{ fontSize: 12.5, fontWeight: 750, color: '#092040', marginTop: 2 }}>{searchParams.get('method') || 'Stripe'}</span>
                </div>
              </div>

              {/* Row 7: Payment Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#137DC5', flexShrink: 0 }}>
                  <CheckCircle style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Payment Status</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#19A859', marginTop: 2 }}>Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Status Alert Banner */}
          <div style={{
            background: '#EAF7F0',
            borderRadius: 12,
            padding: '14px 16px',
            marginTop: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            textAlign: 'left'
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#19A859', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, marginTop: 2 }}>
              <Check style={{ width: 12, height: 12 }} strokeWidth={3.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#19A859' }}>All set!</span>
              <span style={{ fontSize: 12, color: 'rgba(25, 168, 89, 0.85)', fontWeight: 600, marginTop: 2, lineHeight: 1.4 }}>
                We have sent the payment confirmation to your registered email.
              </span>
            </div>
          </div>

          {/* Action Buttons Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
            <button
              onClick={() => router.push('/orders')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'white',
                border: '1px solid #137DC5',
                borderRadius: 12,
                color: '#137DC5',
                fontWeight: 800,
                fontSize: 13.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="#137DC5" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>View My Bookings</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#137DC5',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontWeight: 800,
                fontSize: 13.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(19, 125, 197, 0.2)'
              }}
            >
              <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go to Dashboard</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">
        <DashboardHeader />
        <main className="flex-grow flex items-center justify-center py-12 px-4 text-center">
          <div className="font-sans font-semibold text-slate-500 text-sm">
            Loading transaction secure details...
          </div>
        </main>
        <DashboardFooter />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
