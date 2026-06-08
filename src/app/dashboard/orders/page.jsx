'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  Clock,
  CircleDot,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  SlidersHorizontal,
  Plus,
  MessageCircle,
  Home,
  Headphones,
  User,
  MapPin,
  Calendar,
  Wrench,
  Zap,
  Paintbrush,
  Filter,
  ShoppingBag
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardFooter from '@/components/DashboardFooter';
import DashboardSidebar from '@/components/DashboardSidebar';
import { authApi } from '@/utils/api';
import { useLanguage } from '@/utils/LanguageContext';



const mobileTabs = ['All Orders', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

function ServiceIllustration({ type }) {
  const isImageUrl = type && (
    type.startsWith('/') ||
    type.startsWith('http') ||
    type.includes('.') ||
    !['cleaning', 'plumbing', 'electrical', 'painting', 'ac'].includes(type)
  );

  if (isImageUrl) {
    return (
      <img
        src={type}
        alt="Service Image"
        style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 12 }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.innerHTML = `<div style="width:64px;height:64px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;">🧹</div>`;
        }}
      />
    );
  }
  if (type === 'cleaning') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="12" fill="#E0F2FE"/>
        <path d="M26 38 C26 34.686 28.686 32 32 32 C35.314 32 38 34.686 38 38 C38 41.314 35.314 44 32 44 C28.686 44 26 41.314 26 38 Z" fill="#137DC5" />
        <circle cx="32" cy="38" r="3" fill="#E0F2FE" />
        <rect x="30" y="18" width="4" height="14" rx="1.5" fill="#137DC5" />
        <path d="M32 18 L26 12" stroke="#137DC5" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 43.5 L40 43.5" stroke="#137DC5" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M46 22 L47.5 24.5 L50 25.5 L47.5 26.5 L46 29 L44.5 26.5 L42 25.5 L44.5 24.5 Z" fill="#F59E0B" />
        <path d="M18 24 L19 25.5 L21 26 L19 26.5 L18 28 L17 26.5 L15 26 L17 25.5 Z" fill="#F59E0B" opacity="0.8" />
      </svg>
    );
  }
  if (type === 'plumbing') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="12" fill="#E8F5E9"/>
        <rect x="20" y="28" width="28" height="8" rx="4" fill="#90A4AE"/>
        <rect x="36" y="20" width="8" height="10" rx="3" fill="#78909C"/>
        <ellipse cx="40" cy="42" rx="2" ry="3" fill="#29B6F6"/>
        <ellipse cx="40" cy="49" rx="1.5" ry="2.5" fill="#29B6F6" opacity="0.6"/>
        <rect x="12" y="30" width="10" height="4" rx="2" fill="#607D8B"/>
        <circle cx="36" cy="28" r="4" fill="#90A4AE"/>
      </svg>
    );
  }
  if (type === 'electrical') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="12" fill="#FFFDE7"/>
        <path d="M32 14C24.268 14 18 20.268 18 28C18 33.5 21 38.3 25.5 40.5L26 46H38L38.5 40.5C43 38.3 46 33.5 46 28C46 20.268 39.732 14 32 14Z" fill="#FFD54F"/>
        <path d="M32 14C24.268 14 18 20.268 18 28C18 33.5 21 38.3 25.5 40.5L26 46H38L38.5 40.5C43 38.3 46 33.5 46 28C46 20.268 39.732 14 32 14Z" fill="url(#bulb)" fillOpacity="0.8"/>
        <rect x="27" y="46" width="10" height="4" rx="2" fill="#9E9E9E"/>
        <rect x="28" y="50" width="8" height="2" rx="1" fill="#757575"/>
        <ellipse cx="26" cy="23" rx="3" ry="5" fill="white" fillOpacity="0.4" transform="rotate(-20 26 23)"/>
        <path d="M33 21L29 30H33L31 38L37 27H33L35 21H33Z" fill="#FF8F00"/>
        <defs>
          <linearGradient id="bulb" x1="18" y1="14" x2="46" y2="46">
            <stop stopColor="#FFF176"/>
            <stop offset="1" stopColor="#FFB300"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (type === 'painting') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="12" fill="#F3E5F5"/>
        <rect x="38" y="12" width="5" height="28" rx="2.5" fill="#8D6E63"/>
        <rect x="28" y="18" width="16" height="6" rx="2" fill="#795548"/>
        <rect x="14" y="22" width="20" height="14" rx="5" fill="#CE93D8"/>
        <rect x="16" y="24" width="16" height="10" rx="4" fill="#BA68C8"/>
        <ellipse cx="18" cy="38" rx="2" ry="3" fill="#AB47BC"/>
        <ellipse cx="24" cy="40" rx="1.5" ry="2" fill="#9C27B0" opacity="0.7"/>
        <ellipse cx="30" cy="37" rx="1.5" ry="2.5" fill="#BA68C8" opacity="0.8"/>
        <rect x="14" y="44" width="36" height="6" rx="2" fill="#CE93D8" opacity="0.3"/>
      </svg>
    );
  }
  if (type === 'ac') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="12" fill="#E3F2FD"/>
        <rect x="10" y="20" width="44" height="28" rx="6" fill="#90CAF9"/>
        <rect x="10" y="20" width="44" height="28" rx="6" fill="url(#acGrad)"/>
        <line x1="18" y1="36" x2="46" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <line x1="18" y1="40" x2="46" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="18" y1="44" x2="46" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <rect x="14" y="24" width="22" height="8" rx="3" fill="#1565C0" opacity="0.3"/>
        <circle cx="44" cy="28" r="4" fill="#1E88E5"/>
        <path d="M44 25.5V28M42.2 26.2A3 3 0 1 0 45.8 26.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 52 Q24 49 28 52" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M28 52 Q32 49 36 52" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M36 52 Q40 49 44 52" stroke="#64B5F6" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        <defs>
          <linearGradient id="acGrad" x1="10" y1="20" x2="54" y2="48">
            <stop stopColor="#42A5F5"/>
            <stop offset="1" stopColor="#1565C0"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return null;
}

function MobileStatusBadge({ status }) {
  const config = {
    'Completed': { bg: '#E8F6EE', color: '#19A859', dot: '#19A859' },
    'In Progress': { bg: '#FFF7E6', color: '#F59E0B', dot: '#F59E0B' },
    'Pending': { bg: '#E8F3FD', color: '#0D6EFD', dot: '#0D6EFD' },
    'Cancelled': { bg: '#FEE2E2', color: '#EF4444', dot: '#EF4444' },
  };
  const c = config[status] || config['Pending'];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: 4,
      background: c.bg,
      color: c.color,
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: 0.1
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {status}
    </span>
  );
}

// Helper functions to map backend data to frontend UI structures
function getWorkerRole(serviceType) {
  const type = (serviceType || '').toLowerCase();
  if (type.includes('clean')) return 'Cleaning Specialist';
  if (type.includes('plumb')) return 'Plumbing Expert';
  if (type.includes('elect')) return 'Electrician';
  if (type.includes('paint')) return 'Painter';
  return 'Service Specialist';
}

function getInitials(name) {
  if (!name) return 'AW';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDateStr(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function mapStatusToUI(status) {
  if (!status) return 'Pending';
  const st = status.toLowerCase();
  if (st === 'completed') return 'Completed';
  if (st === 'cancelled') return 'Cancelled';
  if (st === 'in progress' || st === 'inprogress' || st === 'in-progress') return 'In Progress';
  if (st === 'upcoming' || st === 'pending') return 'Pending';
  return status;
}

function getServiceIllustrationKey(serviceType) {
  const type = (serviceType || '').toLowerCase();
  if (type.includes('clean')) return 'cleaning';
  if (type.includes('plumb')) return 'plumbing';
  if (type.includes('elect')) return 'electrical';
  if (type.includes('paint')) return 'painting';
  if (type.includes('ac')) return 'ac';
  return 'cleaning';
}

function mapBackendListOrderToUI(data) {
  const timeFormatted = data.booking_time ? `, ${data.booking_time}` : '';
  return {
    id: `#${data.booking_id}`,
    service: data.service_type,
    worker: {
      name: data.worker_name || 'Assigned Worker',
      role: getWorkerRole(data.service_type),
      rating: 4.8,
      reviews: 120,
      avatar: data.worker_profile_photo || data.profile_photo || data.worker_photo || null,
      initials: getInitials(data.worker_name || 'AW'),
      gradient: 'from-blue-400 to-teal-500'
    },
    date: formatDateStr(data.booking_date) + timeFormatted,
    location: data.service_address ? data.service_address.split(',')[0].trim() : 'Berlin',
    price: data.grand_total ? `€${parseFloat(data.grand_total).toFixed(2)}` : '€0.00',
    status: mapStatusToUI(data.status),
    illustration: data.service_icon || data.service_image || data.image || data.service_img || getServiceIllustrationKey(data.service_type)
  };
}

export default function DashboardOrdersPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Recent First');
  const [mobileActiveOrderTab, setMobileActiveOrderTab] = useState('All Orders');
  const [mobileBottomTab, setMobileBottomTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await authApi.getOrders();
        if (res.status && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBackendListOrderToUI);
          setOrders(mapped);
        } else {
          throw new Error(res.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
        setError(err.message);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Dynamically calculate badge counts
  const allCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const tabs = [
    { name: 'All Orders', count: allCount, statusFilter: 'All Orders', activeColor: 'border-[#137DC5] text-[#137DC5]', badgeClass: 'bg-slate-100 text-slate-500' },
    { name: 'Pending', count: pendingCount, statusFilter: 'Pending', activeColor: 'border-orange-500 text-orange-600', badgeClass: 'bg-[#FFF2E6] text-[#FF7E00]' },
    { name: 'In Progress', count: inProgressCount, statusFilter: 'In Progress', activeColor: 'border-[#137DC5] text-[#137DC5]', badgeClass: 'bg-[#EBF5FA] text-[#137DC5]' },
    { name: 'Completed', count: completedCount, statusFilter: 'Completed', activeColor: 'border-emerald-500 text-emerald-600', badgeClass: 'bg-[#E8F6EE] text-[#19A859]' },
    { name: 'Cancelled', count: cancelledCount, statusFilter: 'Cancelled', activeColor: 'border-slate-400 text-slate-500', badgeClass: 'bg-slate-100 text-slate-500' },
  ];

  // Tab selection filtering (Desktop)
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All Orders') {
      return true;
    }
    return order.status === activeTab;
  });

  // Tab selection filtering (Mobile)
  const filteredMobileOrders = orders.filter((order) => {
    if (mobileActiveOrderTab === 'All Orders') return true;
    return order.status === mobileActiveOrderTab;
  });

  const handleViewDetails = (orderId) => {
    const cleanId = orderId.replace('#', '').replace('Order#', '');
    router.push(`/orders/${cleanId}`);
  };

  const handleMobileBottomNav = (tab) => {
    setMobileBottomTab(tab);
    if (tab === 'home') {
      router.push('/home');
    } else if (tab === 'messages') {
      router.push('/messages');
    } else if (tab === 'profile') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mobileActiveTab', 'profile');
      }
      router.push('/profile');
    } else if (tab === 'workers') {
      router.push('/workers');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-[#FFF2E6] text-[#FF7E00]">
            <Clock className="w-3.5 h-3.5 text-[#FF7E00]" />
            <span>Pending</span>
          </div>
        );
      case 'In Progress':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-[#EBF5FA] text-[#137DC5]">
            <CircleDot className="w-3.5 h-3.5 text-[#137DC5]" />
            <span>In Progress</span>
          </div>
        );
      case 'Completed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-[#E8F6EE] text-[#19A859]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#19A859]" />
            <span>Completed</span>
          </div>
        );
      case 'Cancelled':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-slate-100 text-slate-500">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFF] text-slate-800 overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* MOBILE VIEW — hidden on md and above                         */}
      {/* ============================================================ */}
      <div className="flex flex-col md:hidden min-h-screen" style={{ background: '#F5F7FA', fontFamily: 'Inter, sans-serif' }}>

        {/* Mobile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <button
            onClick={() => router.push('/profile')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={20} color="#092040" />
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#092040' }}>{t('nav.myOrders', 'My Orders')}</span>
          <div style={{ width: 20 }} />
        </div>

        {/* Scrollable Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 16,
          background: 'white',
          borderBottom: '1px solid #F1F5F9',
          padding: '0 20px',
          scrollbarWidth: 'none'
        }}>
          {mobileTabs.map((tab) => {
            const isActive = mobileActiveOrderTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setMobileActiveOrderTab(tab)}
                style={{
                  flexShrink: 0,
                  padding: '12px 0',
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0D6EFD' : '#94A3B8',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #0D6EFD' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  marginBottom: -1
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FEE2E2', color: '#991B1B', fontSize: 11.5, fontWeight: 700, padding: '8px 16.5px', textAlign: 'center' }}>
            API Error: {error}
          </div>
        )}

        {/* Orders List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: 100 }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 12 }}>
              <RefreshCw className="w-8 h-8 text-[#137DC5] animate-spin" />
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 650 }}>Loading orders...</span>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 10, background: 'white', borderRadius: 16, border: '1px solid #FEE2E2', color: '#991B1B', textAlign: 'center' }}>
              <XCircle size={32} color="#EF4444" />
              <p style={{ fontWeight: 700, fontSize: 14, color: '#475569', margin: '4px 0 0 0' }}>Failed to load orders</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{error}</p>
            </div>
          ) : filteredMobileOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#475569' }}>No orders found</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>No orders match this filter.</p>
            </div>
          ) : (
            filteredMobileOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                {/* Top row: illustration + info + price */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  {/* Illustration - Scaled Down */}
                  <div style={{ flexShrink: 0, width: 48, height: 48, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#F8FAFC' }}>
                    <div style={{ transform: 'scale(0.75)' }}>
                      <ServiceIllustration type={order.illustration} />
                    </div>
                  </div>

                  {/* Order info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#092040', lineHeight: 1.2 }}>{order.service}</span>
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#092040', whiteSpace: 'nowrap', marginLeft: 8 }}>{order.price}</span>
                    </div>
                    <p style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 550, marginTop: 2, marginBottom: 0 }}>OrderID: {order.id}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Calendar size={10} color="#94A3B8" />
                      <span style={{ fontSize: 9.5, color: '#64748B', fontWeight: 550 }}>{order.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 3 }}>
                      <MapPin size={10} color="#94A3B8" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 9.5, color: '#64748B', fontWeight: 550, lineHeight: 1.3 }}>{order.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: status badge + View Details button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <MobileStatusBadge status={order.status} />
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 4,
                      border: '1px solid #93C5FD',
                      background: 'white',
                      color: '#0D6EFD',
                      fontSize: 9.5,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Help card removed - only orders show here */}
        </div>

        {/* Bottom Navigation Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          padding: '6px 0 10px',
          zIndex: 50,
          overflow: 'visible',
          boxShadow: '0 -4px 20px rgba(9,32,64,0.08)'
        }}>
          {/* Home */}
          <button
            onClick={() => handleMobileBottomNav('home')}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Home size={18} color="#94A3B8" />
            <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>{t('nav.home', 'Home')}</span>
          </button>

          {/* My Orders (Active) */}
          <button
            onClick={() => handleMobileBottomNav('orders')}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ShoppingBag size={18} color="#0D6EFD" />
            <span style={{ fontSize: 8.5, color: '#0D6EFD', fontWeight: 650 }}>{t('nav.myOrders', 'My Orders')}</span>
          </button>

          {/* Center + FAB */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
            <button
              onClick={() => router.push('/add-post')}
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #137DC5, #0d5fa0)',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(19,125,197,0.45)',
                position: 'absolute',
                top: -20,
                zIndex: 10
              }}
            >
              <Plus size={20} color="white" />
            </button>
          </div>

          {/* Messages */}
          <button
            onClick={() => handleMobileBottomNav('messages')}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <MessageCircle size={18} color="#94A3B8" />
            <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>{t('nav.messages', 'Messages')}</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleMobileBottomNav('profile')}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <User size={18} color="#94A3B8" />
            <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>{t('nav.myProfile', 'Profile')}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP VIEW — hidden on mobile (below md)                   */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col flex-grow">
        {/* 1. Header */}
        <DashboardHeader />

        {/* 2. Main content area */}
        <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Navigation Sidebar */}
            <DashboardSidebar />

            {/* Right Content Panel */}
            <div className="flex-grow w-full lg:w-3/4 flex flex-col gap-6">
              
              {/* Title and Intro */}
              <div className="text-left flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#092040] tracking-tight">
                    My Orders
                  </h1>
                  <p className="font-sans text-[13.5px] text-slate-400 mt-1 font-semibold">
                    Track and manage all your cleaning service orders.
                  </p>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] font-semibold px-3 py-1.5 rounded-lg max-w-md">
                    API Error: {error}
                  </div>
                )}
              </div>

              {/* Filter Tabs & Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-0">
                {/* Tabs List */}
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.statusFilter;
                    return (
                      <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.statusFilter)}
                        className={`flex items-center gap-2 py-3.5 px-1 font-sans font-bold text-[13px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? `${tab.activeColor} border-current`
                            : 'border-transparent text-slate-400 hover:text-slate-650'
                        }`}
                      >
                        <span>{tab.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${tab.badgeClass}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sorting Dropdown */}
                <div className="relative self-end sm:self-center mb-2 sm:mb-0">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-650 font-sans font-bold text-[12.5px] hover:border-slate-300 focus:outline-none transition-all cursor-pointer shadow-sm"
                  >
                    <span>{sortOption}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {isSortOpen && (
                    <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-premium py-1.5 z-40">
                      {['Recent First', 'Oldest First', 'Price: High-Low', 'Price: Low-High'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortOption(opt);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-slate-50 font-sans text-[12px] font-semibold cursor-pointer ${
                            sortOption === opt ? 'text-[#137DC5] bg-blue-50/20' : 'text-slate-650'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Orders Listing Table */}
              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <div className="bg-white border border-slate-100 rounded-2xl py-16 px-4 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                    <RefreshCw className="w-8 h-8 text-[#137DC5] animate-spin" />
                    <p className="font-sans font-bold text-slate-700 text-sm">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white border border-red-100 rounded-2xl py-16 px-4 text-center flex flex-col items-center justify-center gap-3 shadow-sm text-red-750">
                    <XCircle className="w-12 h-12 text-red-500" />
                    <p className="font-sans font-bold text-slate-700 text-sm">Failed to load orders</p>
                    <p className="font-sans text-[12.5px] text-slate-450 mt-0.5 max-w-md mx-auto">
                      {error}
                    </p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-100/90 rounded-2xl p-5 hover:shadow-premium transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                    >
                      {/* Column 1: Worker Info */}
                      <div className="flex items-center gap-3.5 md:w-[28%] flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm relative border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                          {order.worker.avatar ? (
                            <img
                              src={order.worker.avatar}
                              alt={order.worker.name}
                              className="w-full h-full object-cover relative z-10"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector('.fallback-avatar')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = `fallback-avatar w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[14px] bg-gradient-to-tr ${order.worker.gradient}`;
                                  fallback.innerText = order.worker.initials;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[14px] bg-gradient-to-tr ${order.worker.gradient}`}>
                              {order.worker.initials}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-sans font-bold text-slate-800 text-[14.5px] leading-tight">
                            {order.worker.name}
                          </h4>
                          <span className="font-sans text-[11px] text-slate-400 font-semibold leading-normal">
                            {order.worker.role}
                          </span>
                          
                          {/* Rating */}
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                            <span className="font-sans text-[11px] ml-1 font-bold text-[#092040]">
                              {order.worker.rating}
                            </span>
                            <span className="font-sans text-[11px] text-slate-400 ml-0.5 font-semibold">
                              ({order.worker.reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Order ID */}
                      <div className="md:w-[15%] text-slate-400 font-sans font-bold text-[13px]">
                        {order.id}
                      </div>

                      {/* Column 3: Date & Time */}
                      <div className="md:w-[22%] text-slate-500 font-sans font-semibold text-[13px]">
                        {order.date}
                      </div>

                      {/* Column 4: Location */}
                      <div className="md:w-[12%] text-slate-800 font-sans font-extrabold text-[13.5px]">
                        {order.location}
                      </div>

                      {/* Column 5: Price */}
                      <div className="md:w-[10%] text-slate-800 font-sans font-extrabold text-[15.5px]">
                        {order.price}
                      </div>

                      {/* Column 6: Status & Button */}
                      <div className="md:w-[13%] flex flex-col items-start md:items-end gap-2.5 flex-shrink-0">
                        {getStatusBadge(order.status)}

                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="px-4.5 py-2 bg-white border border-[#137DC5]/35 hover:border-[#137DC5] rounded-xl font-sans font-extrabold text-[#137DC5] text-[12px] tracking-wide transition-all cursor-pointer shadow-sm hover:shadow-md hover:bg-blue-50/10 w-full md:w-auto text-center"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl py-16 px-4 text-center shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="font-sans font-bold text-slate-700 text-sm">No orders found</p>
                    <p className="font-sans text-[12px] text-slate-400 mt-1 max-w-xs mx-auto">
                      There are no orders with "{activeTab}" status at the moment.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4 pb-12">
                <span className="font-sans text-[12px] text-slate-400 font-semibold">
                  Showing 1 to {filteredOrders.length} of {allCount} orders
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-350 focus:outline-none transition-all cursor-pointer bg-white">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#137DC5] text-white font-sans font-bold text-[13px] focus:outline-none shadow-sm cursor-pointer">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350 font-sans font-bold text-[13px] focus:outline-none cursor-pointer bg-white">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350 font-sans font-bold text-[13px] focus:outline-none cursor-pointer bg-white">
                    3
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350 font-sans font-bold text-[13px] focus:outline-none cursor-pointer bg-white">
                    4
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-350 focus:outline-none transition-all cursor-pointer bg-white">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* 3. Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
