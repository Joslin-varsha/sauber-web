'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle,
  Lock,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { authApi } from '@/utils/api';

const formatDateStr = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[monthIndex];
    if (monthName) return `${day} ${monthName} ${year}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

function mapBackendOrderToUI(data) {
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const statusVal = data.status;

  let workerVal = null;
  if (data.worker) {
    workerVal = {
      worker_id: data.worker.worker_id || null,
      name: data.worker.name || '',
      role: data.worker.role || '',
      rating: data.worker.rating || 0.0,
      reviews: data.worker.reviews || 0,
      arrivalTime: data.worker.arrivalTime || data.arrival_time || '',
      initials: getInitials(data.worker.name || ''),
      gradient: 'from-blue-400 to-teal-500'
    };
  } else if (data.worker_name) {
    workerVal = {
      worker_id: data.worker_id || null,
      name: data.worker_name,
      role: data.worker_skill || '',
      rating: data.worker_rating || 0.0,
      reviews: data.worker_reviews || 0,
      arrivalTime: data.arrival_time || '',
      initials: getInitials(data.worker_name),
      gradient: 'from-blue-400 to-teal-500'
    };
  }

  return {
    orderPrimaryId: data.order?.order_primaryid || data.bookingPrimaryId,
    booking_id: data.booking_id || data.order?.booking_id,
    id: data.order?.order_id ? `#${data.order.order_id}` : `#${data.booking_id}`,
    service: data.service_type,
    status: statusVal,
    statusText: statusVal,
    image: data.service_icon || data.service_image || data.image || data.service_img || null,
    date: formatDateStr(data.booking_date),
    time: data.booking_time || '',
    address: data.service_address || '',
    worker: workerVal,
  };
}

const isImageUrl = (image) => image && (
  image.startsWith('/') ||
  image.startsWith('http') ||
  image.includes('.') ||
  !['vacuum_cleaner', 'cleaning', 'plumbing', 'electrical', 'painting', 'ac'].includes(image)
);

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const cleanId = rawId ? rawId.toUpperCase() : 'SB12456';

  // Form States
  const [order, setOrder] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  // Load Order Details dynamically
  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setIsOrderLoading(true);
        setError('');
        const res = await authApi.getOrderDetails(rawId);
        if (res && res.data) {
          const mappedOrder = mapBackendOrderToUI(res.data);
          setOrder(mappedOrder);

          // Fetch worker details if we have a worker_id
          const workerId = mappedOrder.worker?.worker_id;
          if (workerId) {
            try {
              const workerRes = await authApi.getWorkerDetails(workerId);
              if (workerRes && workerRes.data) {
                const wd = workerRes.data;
                const getInitials = (name) => {
                  if (!name) return 'AW';
                  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                };
                setOrder(prev => ({
                  ...prev,
                  worker: {
                    ...prev.worker,
                    name: wd.name || prev.worker.name,
                    role: wd.skill || prev.worker.role || 'Service Specialist',
                    rating: parseFloat(wd.rating) || prev.worker.rating,
                    reviews: wd.reviews || prev.worker.reviews,
                    initials: getInitials(wd.name || prev.worker.name),
                    profile_photo: wd.profile_photo || null,
                    verification_status: wd.verification_status,
                    completed_jobs: wd.completed_jobs,
                  }
                }));
              }
            } catch (workerErr) {
              console.warn('Could not load worker details:', workerErr);
              // Non-fatal: keep the order data as-is
            }
          }
        } else {
          throw new Error('Failed to load order details');
        }
      } catch (err) {
        console.error('Failed to load dynamic order details for review:', err);
        setError('Failed to load order details for review');
      } finally {
        setIsOrderLoading(false);
      }
    };

    if (rawId) {
      loadOrderDetails();
    } else {
      setError('No Order ID provided');
      setIsOrderLoading(false);
    }
  }, [rawId]);

  // Text representation for rating score
  const getRatingLabel = (score) => {
    switch (score) {
      case 5: return { text: 'Excellent', color: 'text-[#19A859]' };
      case 4: return { text: 'Good', color: 'text-[#19A859]' };
      case 3: return { text: 'Average', color: 'text-amber-500' };
      case 2: return { text: 'Poor', color: 'text-rose-500' };
      case 1: return { text: 'Very Poor', color: 'text-rose-500' };
      default: return { text: '', color: 'text-slate-400' };
    }
  };

  const currentLabel = getRatingLabel(rating);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const bId = order?.booking_id || rawId || cleanId;
      const oId = order?.orderPrimaryId || null;
      await authApi.submitReview(bId, oId, rating, reviewText);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/orders/${cleanId.toLowerCase()}`);
  };

  if (isOrderLoading || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFCFF] items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-[#137DC5] mb-2" />
        <span className="text-slate-500 font-semibold text-sm">Loading order details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFF] text-slate-800 overflow-x-hidden">
      
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col flex-grow w-full">
        {/* 1. Header */}
        <DashboardHeader />

        {/* 2. Main content area */}
        <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Navigation Sidebar */}
            <DashboardSidebar />

            {/* Right Content Panel */}
            <div className="flex-grow w-full lg:max-w-[calc(100%-270px)] flex flex-col gap-6 text-left">
              
              {/* Back Navigation & Page Header */}
              <div className="flex items-center gap-4 mb-2">
                <button 
                  onClick={() => router.back()}
                  className="p-2 bg-white border border-slate-100 hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 hover:text-[#137DC5] focus:outline-none cursor-pointer shadow-sm"
                  title="Back to Order Details"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                  <h1 className="font-display font-extrabold text-[20px] sm:text-[22px] text-[#092040] leading-tight">
                    Write a Review
                  </h1>
                  <p className="font-sans text-[12px] sm:text-[13px] text-slate-400 mt-0.5">
                    Share your experience and help others by leaving a review.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 text-red-650 px-5 py-4 rounded-2xl font-sans text-xs font-bold border border-red-100/50">
                    {error}
                  </div>
                )}
                
                {/* SECTION 1: Service Details */}
                <div>
                  <h3 className="font-sans font-bold text-[#092040] text-[15px] mb-2 px-1">
                    Service Details
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start justify-between">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      {/* Service Image/SVG wrapper */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F4F8FC] border border-blue-50/30 rounded-xl p-3 flex-shrink-0 flex items-center justify-center">
                        {isImageUrl(order.image) ? (
                          <img 
                            src={order.image} 
                            alt={order.service} 
                            className="w-full h-full object-contain"
                          />
                        ) : (order.service === 'Home Cleaning' || order.image === 'vacuum_cleaner' || order.service === 'Cleaning') ? (
                          <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
                            <rect width="64" height="64" rx="12" fill="#E0F2FE"/>
                            <path d="M26 38 C26 34.686 28.686 32 32 32 C35.314 32 38 34.686 38 38 C38 41.314 35.314 44 32 44 C28.686 44 26 41.314 26 38 Z" fill="#137DC5" />
                            <circle cx="32" cy="38" r="3" fill="#E0F2FE" />
                            <rect x="30" y="18" width="4" height="14" rx="1.5" fill="#137DC5" />
                            <path d="M32 18 L26 12" stroke="#137DC5" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M24 43.5 L40 43.5" stroke="#137DC5" strokeWidth="3.5" strokeLinecap="round" />
                            <path d="M46 22 L47.5 24.5 L50 25.5 L47.5 26.5 L46 29 L44.5 26.5 L42 25.5 L44.5 24.5 Z" fill="#F59E0B" />
                            <path d="M18 24 L19 25.5 L21 26 L19 26.5 L18 28 L17 26.5 L15 26 L17 25.5 Z" fill="#F59E0B" opacity="0.8" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#137DC5]">
                            {order.service === 'Plumbing' && (
                              <path d="M50 20 C35 35 35 55 50 70 C65 55 65 35 50 20 Z" fill="currentColor" opacity="0.8" />
                            )}
                            {order.service === 'Electrical' && (
                              <polygon points="55,15 30,55 50,55 45,85 70,45 50,45" fill="currentColor" />
                            )}
                            {order.service === 'Painting' && (
                              <path d="M30 20 H70 V50 C70 60 60 70 50 70 C40 70 30 60 30 50 Z M50 70 V90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            )}
                          </svg>
                        )}
                      </div>

                      {/* Details content */}
                      <div className="flex flex-col gap-3.5 text-left">
                        <h4 className="font-display font-extrabold text-[17px] text-[#092040] leading-none">
                          {order.service}
                        </h4>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#137DC5] mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="text-[11.5px] text-slate-400 font-medium">Date</span>
                              <span className="text-[13.5px] font-bold text-[#092040] mt-0.5">{order.date}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#137DC5] mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="text-[11.5px] text-slate-400 font-medium">Time</span>
                              <span className="text-[13.5px] font-bold text-[#092040] mt-0.5">{order.time}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 max-w-md">
                            <MapPin className="w-5 h-5 text-[#137DC5] mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="text-[11.5px] text-slate-400 font-medium">Location</span>
                              <span className="text-[13.5px] font-bold text-[#092040] mt-0.5 leading-snug">{order.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & ID columns */}
                    <div className="flex md:flex-col items-start md:items-end justify-between md:justify-start gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <div className="flex items-center gap-1.5 bg-[#EAF7EE] text-[#19A859] border border-[#BCE8C9] px-3 py-1.5 rounded-lg text-[12px] font-bold">
                        <svg className="w-4 h-4 text-[#19A859]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Completed</span>
                      </div>
                      <span className="font-sans text-[11.5px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        Order ID: #{order.id.replace('#', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Worker You Reviewed */}
                <div>
                  <h3 className="font-sans font-bold text-[#092040] text-[15px] mb-2 px-1">
                    Worker You Reviewed
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    {/* Worker avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 relative">
                      {order.worker.profile_photo || order.worker.avatar ? (
                        <img 
                          src={order.worker.profile_photo || order.worker.avatar}
                          alt={order.worker.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-avatar-worker')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-avatar-worker w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[16px] bg-gradient-to-tr ' + (order.worker.gradient || 'from-blue-400 to-indigo-500');
                              fallback.innerText = order.worker.initials || 'W';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className={'fallback-avatar-worker w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[16px] bg-gradient-to-tr ' + (order.worker.gradient || 'from-blue-400 to-indigo-500')}>
                          {order.worker.initials || 'W'}
                        </div>
                      )}
                      {order.worker.verification_status === 1 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#19A859] rounded-full flex items-center justify-center border-2 border-white" title="Verified Worker">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Worker details */}
                    <div className="flex flex-col text-left gap-0.5">
                      <h4 className="font-sans font-extrabold text-[16px] text-[#092040]">
                        {order.worker.name}
                      </h4>
                      <span className="font-sans text-[12px] text-slate-400 font-semibold">
                        {order.worker.role || 'Cleaning Specialist'}
                      </span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#FFB300] text-[#FFB300]" />
                          <span className="font-sans font-bold text-[#092040] text-[12px]">
                            {parseFloat(order.worker.rating).toFixed(1)}
                          </span>
                          <span className="font-sans text-[11.5px] text-slate-400 font-semibold">
                            ({order.worker.reviews} reviews)
                          </span>
                        </div>
                        {order.worker.completed_jobs > 0 && (
                          <span className="font-sans text-[10.5px] text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                            {order.worker.completed_jobs} jobs done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Your Rating */}
                <div>
                  <h3 className="font-sans font-bold text-[#092040] text-[15px] mb-2 px-1">
                    Your Rating
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
                    <span className="font-sans text-[12.5px] text-slate-400">
                      How would you rate your overall experience?
                    </span>
                    <div className="flex items-center gap-2.5">
                      {[1, 2, 3, 4, 5].map((index) => {
                        const isStarred = hoverRating ? index <= hoverRating : index <= rating;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHoverRating(index)}
                            onMouseLeave={() => setHoverRating(0)}
                            className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none shadow-sm ${
                              isStarred
                                ? 'border-amber-100 bg-[#FFFDF5]'
                                : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                            <Star 
                              className={`w-7.5 h-7.5 transition-colors ${
                                isStarred 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-350 fill-transparent'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className={`font-sans font-bold text-[14px] mt-1 ${currentLabel.color}`}>
                      {currentLabel.text}
                    </span>
                  </div>
                </div>

                {/* SECTION 4: Your Review */}
                <div>
                  <h3 className="font-sans font-bold text-[#092040] text-[15px] mb-2 px-1">
                    Your Review
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
                    <span className="font-sans text-[12.5px] text-slate-400">
                      Tell us about your experience (Optional)
                    </span>
                    <div className="relative">
                      <textarea
                        rows={5}
                        maxLength={500}
                        placeholder="Share your thoughts about the service quality, punctuality, efficiency, and friendliness of the worker..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5] focus:outline-none p-4 font-sans text-[13.5px] leading-relaxed resize-none transition-colors text-slate-700 bg-white"
                      />
                      <div className="absolute bottom-3.5 right-4 font-sans text-[11px] font-bold text-slate-450 tracking-wide bg-white px-1 py-0.5 rounded">
                        {reviewText.length}/500
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col gap-4.5 items-center mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#137DC5] hover:bg-[#0E639C] disabled:bg-slate-300 text-white font-sans font-bold text-[15px] py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                  <div className="flex items-center gap-2 text-slate-450 text-[12px] font-semibold leading-none">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span>Your review will be public and help other customers.</span>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </main>
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
          borderBottom: '1px solid #F1F5F9',
          position: 'relative',
        }}>
          <button 
            type="button"
            onClick={() => router.back()}
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
            <ArrowLeft size={20} />
          </button>
          <h1 style={{
            fontSize: '16px',
            fontWeight: 850,
            color: '#092040',
            textAlign: 'center',
            margin: 0
          }}>
            Write a Review
          </h1>
        </div>

        {/* Scrollable Container */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '20px',
          paddingBottom: '100px',
          gap: '24px'
        }}>
          {error && (
            <div style={{
              background: '#FEF2F2',
              color: '#B91C1C',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center',
              border: '1px solid #FEE2E2'
            }}>
              {error}
            </div>
          )}
          {/* Order/Service Card */}
          <div style={{
            background: 'white',
            border: '1px solid #F1F5F9',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* Left: Image Container */}
            <div style={{
              width: '84px',
              height: '84px',
              background: '#FAFBFD',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              padding: '10px'
            }}>
              {isImageUrl(order.image) ? (
                <img 
                  src={order.image} 
                  alt={order.service} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (order.service === 'Home Cleaning' || order.image === 'vacuum_cleaner' || order.service === 'Cleaning') ? (
                <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none">
                  <rect width="64" height="64" rx="12" fill="#E0F2FE"/>
                  <path d="M26 38 C26 34.686 28.686 32 32 32 C35.314 32 38 34.686 38 38 C38 41.314 35.314 44 32 44 C28.686 44 26 41.314 26 38 Z" fill="#137DC5" />
                  <circle cx="32" cy="38" r="3" fill="#E0F2FE" />
                  <rect x="30" y="18" width="4" height="14" rx="1.5" fill="#137DC5" />
                  <path d="M32 18 L26 12" stroke="#137DC5" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M24 43.5 L40 43.5" stroke="#137DC5" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M46 22 L47.5 24.5 L50 25.5 L47.5 26.5 L46 29 L44.5 26.5 L42 25.5 L44.5 24.5 Z" fill="#F59E0B" />
                  <path d="M18 24 L19 25.5 L21 26 L19 26.5 L18 28 L17 26.5 L15 26 L17 25.5 Z" fill="#F59E0B" opacity="0.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 100 100" style={{ width: '40px', height: '40px' }} className="text-[#137DC5]">
                  {order.service === 'Plumbing' && (
                    <path d="M50 20 C35 35 35 55 50 70 C65 55 65 35 50 20 Z" fill="currentColor" opacity="0.8" />
                  )}
                  {order.service === 'Electrical' && (
                    <polygon points="55,15 30,55 50,55 45,85 70,45 50,45" fill="currentColor" />
                  )}
                  {order.service === 'Painting' && (
                    <path d="M30 20 H70 V50 C70 60 60 70 50 70 C40 70 30 60 30 50 Z M50 70 V90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  )}
                </svg>
              )}
            </div>
            
            {/* Right: Info Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Top Title & Status Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#092040', margin: 0 }}>
                  {order.service}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#EAF7EE',
                    color: '#19A859',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '9.5px',
                    fontWeight: 700
                  }}>
                    <svg style={{ width: '10px', height: '10px', color: '#19A859' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Completed</span>
                  </div>
                  <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 600 }}>
                    Order ID: #{order.id.replace('#', '')}
                  </span>
                </div>
              </div>
              
              {/* Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Detail Item: Date */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Calendar size={13} style={{ color: '#137DC5', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 600 }}>Clean Date</span>
                    <span style={{ fontSize: '11px', color: '#092040', fontWeight: 700 }}>{order.date}</span>
                  </div>
                </div>

                {/* Detail Item: Time */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={13} style={{ color: '#137DC5', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 600 }}>Time</span>
                    <span style={{ fontSize: '11px', color: '#092040', fontWeight: 700 }}>{order.time}</span>
                  </div>
                </div>

                {/* Detail Item: Address */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <MapPin size={13} style={{ color: '#137DC5', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 600 }}>Address</span>
                    <span style={{ fontSize: '11px', color: '#092040', fontWeight: 700, lineHeight: '1.3' }}>
                       {order.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Experience Rating */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#092040', margin: 0 }}>
              How was your experience?
            </h3>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 550, margin: 0 }}>
              Rate your overall experience with the service.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '12px', 
              background: 'white',
              border: '1px solid #F1F5F9',
              borderRadius: '16px',
              padding: '24px 16px',
              marginTop: '4px'
            }}>
              {/* Stars Row */}
              <div style={{ display: 'flex', gap: '14px' }}>
                {[1, 2, 3, 4, 5].map((index) => {
                  const isStarred = hoverRating ? index <= hoverRating : index <= rating;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <Star 
                        size={28}
                        style={{
                          fill: isStarred ? '#FFB300' : 'none',
                          stroke: isStarred ? '#FFB300' : '#CBD5E1',
                          strokeWidth: 1.5,
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#092040' }}>
                {currentLabel.text}
              </span>
            </div>
          </div>

          {/* Section: Written Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#092040', margin: 0 }}>
              Tell us more (optional)
            </h3>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 550, margin: 0 }}>
              Share your feedback to help us improve our service.
            </p>
            
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <textarea
                rows={6}
                maxLength={500}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'none',
                  color: '#334155',
                  outline: 'none',
                  background: 'white'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '16px',
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#94A3B8'
              }}>
                {reviewText.length}/500
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action Button */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            padding: '16px 20px',
            borderTop: '1px solid #F1F5F9',
            boxShadow: '0 -4px 10px rgba(0,0,0,0.03)',
            zIndex: 40
          }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                background: isSubmitting ? '#CBD5E1' : '#137DC5',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 700,
                fontSize: '13.5px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ color: 'white' }} />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <span>Submit Review</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={handleModalClose}
            className="absolute inset-0 bg-[#092040]/30 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 p-6 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 scale-105 transition-transform duration-500">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            
            <div className="flex flex-col gap-1 mt-1">
              <h3 className="font-display font-extrabold text-[18px] text-[#092040]">
                Review Submitted!
              </h3>
              <p className="font-sans text-[12.5px] text-slate-400 leading-relaxed max-w-xs">
                Thank you for sharing your feedback. Your review helps keep our community quality high.
              </p>
            </div>
            
            <button
              onClick={handleModalClose}
              className="w-full bg-[#137DC5] hover:bg-[#0E639C] text-white font-sans font-bold text-[13.5px] py-2.5 rounded-lg shadow-sm transition-all focus:outline-none cursor-pointer mt-2"
            >
              Back to Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}