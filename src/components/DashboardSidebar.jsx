'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  List, 
  PlusCircle, 
  Globe, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  LogOut,
  BadgeCheck 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/utils/LanguageContext';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const { tr } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Helper to determine if a menu item is active
  const isActive = (path) => {
    if (path === '/dashboard/orders') {
      return pathname.startsWith('/dashboard/orders') || pathname.startsWith('/orders/');
    }
    return pathname === path;
  };

  const menuItems = [
    { name: tr('profile.title', 'My Profile'), icon: User, path: '/profile' },
    { name: tr('nav.myOrders', 'My Orders'), icon: List, path: '/dashboard/orders' },
    { name: tr('nav.addPost', 'Add Post'), icon: PlusCircle, path: '/add-post' },
    { name: tr('profile.changeLanguage', 'Change Language'), icon: Globe, path: '#' },
    { name: tr('profile.helpSupport', 'Help & Support'), icon: HelpCircle, path: '#' },
    { name: tr('profile.privacyPolicy', 'Privacy Policy'), icon: ShieldCheck, path: '#' },
    { name: tr('profile.termsConditions', 'Terms & Conditions'), icon: FileText, path: '#' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-6 shadow-sm">
      
      {/* Profile Info block */}
      <div className="flex flex-row items-center gap-4 pb-5 border-b border-slate-100 text-left w-full">
        {/* Avatar with dynamic initials */}
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm relative border border-slate-200 flex-shrink-0 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white font-display font-extrabold text-[20px]">
          {getInitials(user ? user.name : 'User')}
        </div>
        
        {/* Details & verification */}
        <div className="flex flex-col min-w-0">
          <h3 className="font-sans font-extrabold text-[#092040] text-[15px] leading-snug">
            {user ? user.name : 'User'}
          </h3>
          <span className="font-sans text-[11px] text-[#A3B8CC] font-semibold truncate max-w-full leading-relaxed">
            {user ? user.email : 'user@email.com'}
          </span>
          
          {/* Verification badge */}
          <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-[#E8F2FC] text-[#137DC5] rounded-full self-start">
            <BadgeCheck className="w-4 h-4 fill-[#137DC5] text-white flex-shrink-0" />
            <span className="font-sans font-bold text-[9.5px] text-[#137DC5] whitespace-nowrap leading-none">{tr('profile.verifiedUser', 'Verified User')}</span>
          </div>
        </div>
      </div>

      {/* Navigation menu items */}
      <nav className="flex flex-col gap-1 text-left">
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans font-bold text-[12.5px] transition-all ${
                active 
                  ? 'bg-blue-50/55 text-[#137DC5]' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <ItemIcon className={`w-4 h-4 ${active ? 'text-[#137DC5]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button at the bottom */}
      <div className="pt-2 border-t border-slate-100 mt-auto">
        <button 
          onClick={() => alert('Signing out...')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans font-bold text-[12.5px] text-red-500 hover:bg-red-50 transition-all text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>{tr('profile.logout', 'Logout')}</span>
        </button>
      </div>

    </aside>
  );
}
