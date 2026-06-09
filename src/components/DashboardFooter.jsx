'use client';

import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';

export default function DashboardFooter() {
  const { tr } = useLanguage();

  return (
    <footer id="contact" className="w-full bg-white border-t border-slate-100 text-slate-600 mt-auto scroll-mt-20">
      
      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Logo & Brand Info */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left lg:border-r border-slate-100 lg:pr-8">
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
          <div className="lg:col-span-3 flex flex-col gap-3 text-left lg:border-r border-slate-100 lg:pr-4 lg:pl-4">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.forCustomers', 'For Customers')}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-[12.5px] font-semibold text-slate-400">
              <Link href="/#how-it-works" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.howItWorks', 'How It Works')}</Link>
              <Link href="/about-us#faq" className="hover:text-[#137DC5] transition-colors w-fit">{tr('footer.faq', 'FAQ')}</Link>
              <Link href="/#contact" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.contactUs', 'Contact Us')}</Link>
            </div>
          </div>



          {/* Column 4: Company */}
          <div className="lg:col-span-3 flex flex-col gap-3 text-left lg:pl-6">
            <h4 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wider">
              {tr('footer.company', 'Company')}
            </h4>
            <div className="flex flex-col gap-2 font-sans text-[12.5px] font-semibold text-slate-400">
              <Link href="/about-us" className="hover:text-[#137DC5] transition-colors w-fit">{tr('nav.aboutUs', 'About Us')}</Link>
              <Link href="/#terms" className="hover:text-[#137DC5] transition-colors w-fit">{tr('profile.termsConditions', 'Terms & Conditions')}</Link>
              <Link href="/#privacy" className="hover:text-[#137DC5] transition-colors w-fit">{tr('profile.privacyPolicy', 'Privacy Policy')}</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 py-6 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs font-semibold text-slate-400">
          <span>
            {tr('footer.copyright2025', '© 2025 Sauber. All rights reserved.')}
          </span>
        </div>
      </div>

    </footer>
  );
}
