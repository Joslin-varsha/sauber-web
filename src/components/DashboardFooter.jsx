'use client';

import { Heart, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';

export default function DashboardFooter() {
  const { tr } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-100 text-slate-600 mt-auto">
      
      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Logo & Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-left lg:border-r border-slate-100 lg:pr-8">
            <Link href="/" className="flex items-center group cursor-pointer w-fit">
              <img 
                src="/logo.png" 
                alt="Sauber & Fix Logo" 
                className="h-8.5 w-auto object-contain" 
              />
            </Link>
            <p className="font-sans text-[13px] text-slate-400 leading-relaxed max-w-sm">
              {tr('footer.desc', 'Connecting you with trusted local professionals across Germany.')}
            </p>
            
            {/* Social Icons (White circle buttons with gray borders) */}
            <div className="flex gap-2.5 mt-3">
              {/* Facebook */}
              <a href="#fb" className="w-8.5 h-8.5 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:border-[#137DC5] hover:text-[#137DC5] transition-all bg-white shadow-sm cursor-pointer" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#ig" className="w-8.5 h-8.5 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:border-[#137DC5] hover:text-[#137DC5] transition-all bg-white shadow-sm cursor-pointer" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#x" className="w-8.5 h-8.5 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:border-[#137DC5] hover:text-[#137DC5] transition-all bg-white shadow-sm cursor-pointer" aria-label="X (Twitter)">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#li" className="w-8.5 h-8.5 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:border-[#137DC5] hover:text-[#137DC5] transition-all bg-white shadow-sm cursor-pointer" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: For Customers */}
          <div className="lg:col-span-2 flex flex-col gap-3 text-left lg:border-r border-slate-100 lg:pr-4 lg:pl-4">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.forCustomers', 'For Customers')}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-[12.5px] font-semibold text-slate-400">
              <Link href="/#how-it-works" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.howItWorks', 'How It Works')}</Link>
              <Link href="/#faq" className="hover:text-[#137DC5] transition-colors w-fit">{tr('footer.faq', 'FAQ')}</Link>
              <Link href="/#contact" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.contactUs', 'Contact Us')}</Link>
            </div>
          </div>

          {/* Column 3: For Workers */}
          <div className="lg:col-span-2 flex flex-col gap-3 text-left lg:border-r border-slate-100 lg:pr-4 lg:pl-4">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.forWorkers', 'For Workers')}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-[12.5px] font-semibold text-slate-400">
              <Link href="/#become-worker" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.becomeWorker', 'Become a Worker')}</Link>
              <Link href="/#how-it-works" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.howItWorks', 'How It Works')}</Link>
              <Link href="/#guide" className="hover:text-[#137DC5] transition-colors w-fit">{tr('footer.workerGuide', 'Worker Guide')}</Link>
              <Link href="/#earnings" className="hover:text-[#137DC5] transition-colors w-fit">{tr('footer.earnings', 'Earnings')}</Link>
              <Link href="/#support" className="hover:text-[#137DC5] transition-colors w-fit">{tr('footer.support', 'Support')}</Link>
            </div>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 flex flex-col gap-3 text-left lg:border-r border-slate-100 lg:pr-4 lg:pl-4">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.company', 'Company')}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-[12.5px] font-semibold text-slate-400">
              <Link href="/about-us" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.aboutUs', 'About Us')}</Link>
              <Link href="/#terms" className="hover:text-[#137DC5] transition-colors w-fit">{tr('profile.termsConditions', 'Terms & Conditions')}</Link>
              <Link href="/#privacy" className="hover:text-[#137DC5] transition-colors w-fit">{tr('profile.privacyPolicy', 'Privacy Policy')}</Link>
            </div>
          </div>

          {/* Column 5: Need Help */}
          <div className="lg:col-span-2 flex flex-col gap-3.5 text-left lg:pl-6">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.needHelp', 'Need Help?')}
            </h4>
            <div className="flex flex-col gap-3.5 font-sans text-[12.5px] font-bold text-slate-500">
              <a href="tel:+493012345678" className="flex items-center gap-3 hover:text-[#137DC5] transition-colors group">
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-[#137DC5] transition-colors" />
                <span>+493012345678</span>
              </a>
              <a href="mailto:support@sauber.com" className="flex items-center gap-3 hover:text-[#137DC5] transition-colors group">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-[#137DC5] transition-colors" />
                <span>support@sauber.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar (White with payment methods) */}
      <div className="border-t border-slate-100 py-6 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <span>
            {tr('footer.copyright2025', '© 2025 Sauber. All rights reserved.')}
          </span>
          {/* Payment Methods (Flat, Borderless, High-Fidelity SVG Badges) */}
          <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
            {/* VISA SVG */}
            <div className="flex items-center h-5 select-none hover:opacity-95 transition-opacity">
              <span className="font-sans font-black italic text-[#1A1F71] text-[13px] tracking-tight">VISA</span>
            </div>
            
            {/* Mastercard SVG */}
            <div className="flex items-center h-5 select-none hover:opacity-95 transition-opacity">
              <svg className="h-4.5 w-auto" viewBox="0 0 36 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#EB001B" />
                <circle cx="25" cy="11" r="11" fill="#F79E1B" fillOpacity="0.85" />
                <path d="M18 17.5a10.95 10.95 0 0 0 4-6.5 10.95 10.95 0 0 0-4-6.5 10.95 10.95 0 0 0-4 6.5 10.95 10.95 0 0 0 4 6.5z" fill="#FF5F00" />
              </svg>
            </div>

            {/* PayPal SVG */}
            <div className="flex items-center h-5 select-none hover:opacity-95 transition-opacity">
              <div className="flex items-center font-sans font-black italic text-[11.5px] tracking-tight">
                <span className="text-[#003087]">Pay</span>
                <span className="text-[#0079C1]">Pal</span>
              </div>
            </div>

            {/* Apple Pay Button style */}
            <div className="flex items-center bg-black text-white px-2 py-0.5 rounded-[4px] h-[21px] select-none hover:bg-slate-900 transition-colors">
              <svg className="w-2 h-2.5 fill-white mr-0.5" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
              </svg>
              <span className="font-sans font-bold text-[9px] tracking-tight">Pay</span>
            </div>

            {/* Google Pay */}
            <div className="flex items-center gap-0.5 select-none font-sans font-semibold text-slate-800 text-[10.5px] hover:opacity-95 transition-opacity">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.24 3.51v2.77h5.08c3.07-2.83 4.82-7.01 4.82-12.01z" fill="#4285F4" />
                <path d="M12.18 20.43c3.24 0 5.97-1.07 7.96-2.92l-5.08-2.77c-1.38.93-3.15 1.46-4.98 1.46-3.84 0-7.09-2.59-8.25-6.08H1.67v2.86c2.31 4.58 7.03 7.45 10.51 7.45z" fill="#34A853" />
                <path d="M3.93 10.12c-.29-.87-.46-1.8-.46-2.76s.17-1.89.46-2.76V1.74H1.67A11.95 11.95 0 0 0 0 7.36c0 2.08.53 4.04 1.67 5.62l2.26-2.86z" fill="#FBBC05" />
                <path d="M12.18 3.19c1.76 0 3.35.61 4.6 1.8l3.43-3.43C18.15.54 15.42 0 12.18 0 8.7 0 3.98 2.87 1.67 7.45l2.26 2.86c1.16-3.49 4.41-6.08 8.25-6.08z" fill="#EA4335" />
              </svg>
              <span className="font-bold tracking-tight">Pay</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
