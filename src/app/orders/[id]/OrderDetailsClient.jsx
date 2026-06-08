'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Info,
  CheckCircle,
  HelpCircle,
  FileText,
  X,
  Car,
  CreditCard,
  Sparkles,
  CircleDot,
  MessageSquare,
  RefreshCw,
  User,
  Loader2,
  Bike,
  Compass,
  Home,
  Navigation,
  ShoppingBag,
  Ruler,
  Repeat
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { authApi } from '@/utils/api';
import StripePaymentModal from '@/components/StripePaymentModal';

// Mock detailed database for dynamic routing
export const orderDetailsDb = {
  'ORD-250512-001': {
    id: '#ORD-250512-001',
    service: 'Home Cleaning',
    status: 'Pending',
    statusColor: 'text-amber-500 bg-amber-500',
    statusText: 'Pending',
    date: '14 May 2025',
    time: '10:00 AM',
    address: 'Alexanderplatz 12, 10178 Berlin, Germany',
    worker: {
      name: 'Emma Keller',
      role: 'Home Cleaning Expert',
      rating: 4.8,
      reviews: 126,
      arrivalTime: '09:55',
      initials: 'EK',
      gradient: 'from-amber-400 to-rose-500',
    },
    pricing: {
      basePrice: '€65.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€65.00',
    },
    payment: {
      total: '€65.00',
      paid: '€65.00',
      pending: '€0.00',
    }
  },
  'ORD-250510-002': {
    id: '#ORD-250510-002',
    service: 'Plumbing',
    status: 'Pending',
    statusColor: 'text-amber-500 bg-amber-500',
    statusText: 'Pending',
    date: '12 May 2025',
    time: '02:00 PM',
    address: 'Schönhauser Allee 45, 10437 Berlin, Germany',
    worker: {
      name: 'Daniel Brown',
      role: 'Cleaning Specialist',
      rating: 4.7,
      reviews: 98,
      arrivalTime: '13:50',
      initials: 'DB',
      gradient: 'from-orange-400 to-red-500',
    },
    pricing: {
      basePrice: '€55.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€55.00',
    },
    payment: {
      total: '€55.00',
      paid: '€55.00',
      pending: '€0.00',
    }
  },
  'ORD-250509-003': {
    id: '#ORD-250509-003',
    service: 'Home Cleaning',
    status: 'In Progress',
    statusColor: 'text-blue-500 bg-blue-500',
    statusText: 'Inprogress',
    date: '11 May 2025',
    time: '11:00 AM',
    address: 'Kurfürstendamm 210, 10719 Berlin, Germany',
    worker: {
      name: 'Sophia Müller',
      role: 'Home Cleaning Expert',
      rating: 4.9,
      reviews: 142,
      arrivalTime: '10:50',
      initials: 'SM',
      gradient: 'from-blue-400 to-indigo-500',
    },
    pricing: {
      basePrice: '€70.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€70.00',
    },
    payment: {
      total: '€70.00',
      paid: '€70.00',
      pending: '€0.00',
    }
  },
  'ORD-250507-004': {
    id: '#ORD-250507-004',
    service: 'Home Cleaning',
    status: 'In Progress',
    statusColor: 'text-blue-500 bg-blue-500',
    statusText: 'Inprogress',
    date: '09 May 2025',
    time: '09:30 AM',
    address: 'Friedrichstraße 95, 10117 Berlin, Germany',
    worker: {
      name: 'Liam Johnson',
      role: 'Professional Cleaner',
      rating: 4.6,
      reviews: 87,
      arrivalTime: '09:15',
      initials: 'LJ',
      gradient: 'from-emerald-400 to-teal-500',
    },
    pricing: {
      basePrice: '€60.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€60.00',
    },
    payment: {
      total: '€60.00',
      paid: '€60.00',
      pending: '€0.00',
    }
  },
  'ORD-250505-005': {
    id: '#ORD-250505-005',
    service: 'Home Cleaning',
    status: 'Completed',
    statusColor: 'text-emerald-500 bg-emerald-500',
    statusText: 'Completed',
    date: '07 May 2025',
    time: '01:00 PM',
    address: 'Alexanderplatz 12, 10178 Berlin, Germany',
    worker: {
      name: 'Olivia Taylor',
      role: 'Cleaning Specialist',
      rating: 4.7,
      reviews: 110,
      arrivalTime: '12:45',
      initials: 'OT',
      gradient: 'from-purple-400 to-pink-500',
    },
    pricing: {
      basePrice: '€50.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€50.00',
    },
    payment: {
      total: '€50.00',
      paid: '€50.00',
      pending: '€0.00',
    }
  },
  'ORD-250502-006': {
    id: '#ORD-250502-006',
    service: 'Home Cleaning',
    status: 'Completed',
    statusColor: 'text-emerald-500 bg-emerald-500',
    statusText: 'Completed',
    date: '04 May 2025',
    time: '10:30 AM',
    address: 'Schönhauser Allee 45, 10437 Berlin, Germany',
    worker: {
      name: 'James Anderson',
      role: 'Cleaning Expert',
      rating: 4.5,
      reviews: 76,
      arrivalTime: '10:15',
      initials: 'JA',
      gradient: 'from-purple-400 to-indigo-500',
    },
    pricing: {
      basePrice: '€45.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€45.00',
    },
    payment: {
      total: '€45.00',
      paid: '€45.00',
      pending: '€0.00',
    }
  },
  'SB12456': {
    id: '#SB12456',
    service: 'Home Cleaning',
    status: 'Inprogress',
    statusColor: 'text-blue-500 bg-blue-500',
    statusText: 'Inprogress',
    date: '20 May 2026',
    time: '10:00-12:00',
    address: 'Alexanderplatz 12, 10178 Berlin, Germany',
    worker: {
      name: 'Anna Müller',
      role: 'Cleaning Specialist',
      rating: 4.8,
      reviews: 128,
      arrivalTime: '09:55',
      initials: 'AM',
      gradient: 'from-blue-400 to-teal-500',
    },
    pricing: {
      basePrice: '€80.00',
      extraHours: '€20.00',
      extraCharges: '€0.00',
      totalAmount: '€100.00',
    },
    extraHoursDetail: {
      hours: '1 Hour(s)',
      rate: '€20.00',
      amount: '€20.00',
    },
    payment: {
      total: '€100.00',
      paid: '€80.00',
      pending: '€20.00',
    }
  },
  'SB12455': {
    id: '#SB12455',
    service: 'Plumbing',
    image: 'vacuum_cleaner',
    status: 'Pending',
    statusColor: 'text-amber-500 bg-amber-500',
    statusText: 'Pending',
    date: '10 May 2025',
    time: '14:00-16:00',
    address: 'Schönhauser Allee 45, 10437 Berlin, Germany',
    worker: {
      name: 'Daniel Brown',
      role: 'Plumbing Expert',
      rating: 4.9,
      reviews: 210,
      arrivalTime: '13:50',
      initials: 'DB',
      gradient: 'from-orange-400 to-red-500',
    },
    pricing: {
      basePrice: '€80.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€80.00',
    },
    payment: {
      total: '€80.00',
      paid: '€80.00',
      pending: '€0.00',
    }
  },
  'SB12454': {
    id: '#SB12454',
    service: 'Electrical',
    status: 'Cancelled',
    statusColor: 'text-slate-400 bg-slate-400',
    statusText: 'Cancelled',
    date: '08 May 2025',
    time: '11:30-13:30',
    address: 'Kurfürstendamm 210, 10719 Berlin, Germany',
    worker: {
      name: 'Liam Johnson',
      role: 'Electrician',
      rating: 4.8,
      reviews: 156,
      arrivalTime: '--:--',
      initials: 'LJ',
      gradient: 'from-amber-400 to-rose-500',
    },
    pricing: {
      basePrice: '€75.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€75.00',
    },
    payment: {
      total: '€75.00',
      paid: '€0.00',
      pending: '€0.00',
    }
  },
  'SB12453': {
    id: '#SB12453',
    service: 'Painting',
    image: 'vacuum_cleaner',
    status: 'Completed',
    statusColor: 'text-emerald-500 bg-emerald-500',
    statusText: 'Completed',
    date: '05 May 2025',
    time: '09:00-14:00',
    address: 'Friedrichstraße 95, 10117 Berlin, Germany',
    worker: {
      name: 'Olivia Taylor',
      role: 'Painter',
      rating: 4.7,
      reviews: 74,
      arrivalTime: '08:45',
      initials: 'OT',
      gradient: 'from-purple-400 to-pink-500',
    },
    pricing: {
      basePrice: '€120.00',
      extraHours: '€0.00',
      extraCharges: '€0.00',
      totalAmount: '€120.00',
    },
    materials: {
      required: 'Yes',
      vacuum: 'Yes',
    },
    payment: {
      total: '€120.00',
      paid: '€120.00',
      pending: '€0.00',
    }
  }
};

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

const getHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const p1 = parseFloat(lat1);
  const p2 = parseFloat(lon1);
  const p3 = parseFloat(lat2);
  const p4 = parseFloat(lon2);
  if (isNaN(p1) || isNaN(p2) || isNaN(p3) || isNaN(p4)) return null;

  const R = 6371; // Radius of the Earth in km
  const dLat = (p3 - p1) * Math.PI / 180;
  const dLon = (p4 - p2) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1 * Math.PI / 180) * Math.cos(p3 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

function mapBackendOrderToUI(data) {
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const statusVal = data.status;
  
  // Map worker if present
  let workerVal = null;
  if (data.worker) {
    workerVal = {
      name: data.worker.name || '',
      role: data.worker.role || '',
      rating: data.worker.rating || 0.0,
      reviews: data.worker.reviews || 0,
      arrivalTime: data.worker.arrivalTime || data.worker.arrival_time || data.arrival_time || '',
      initials: getInitials(data.worker.name || ''),
      gradient: 'from-blue-400 to-teal-500',
      profile_photo: data.worker.profile_photo || data.worker.avatar || data.worker.worker_photo || null,
      latitude: data.worker.latitude || data.worker.worker_latitude || data.worker_latitude || null,
      longitude: data.worker.longitude || data.worker.worker_longitude || data.worker_longitude || null,
      travel_time_taken: data.worker.travel_time_taken || data.worker.total_travel_time || data.worker_travel_time_taken || null,
      dispatch_time: data.worker.dispatch_time || data.worker_dispatch_time || null,
      arrival_time_raw: data.worker.arrival_time || data.worker_arrival_time || null
    };
  } else if (data.worker_name || data.worker_latitude || data.worker_longitude) {
    workerVal = {
      name: data.worker_name || 'Assigned Worker',
      role: data.worker_skill || '',
      rating: data.worker_rating || 0.0,
      reviews: data.worker_reviews || 0,
      arrivalTime: data.arrival_time || '',
      initials: getInitials(data.worker_name || 'Worker'),
      gradient: 'from-blue-400 to-teal-500',
      profile_photo: data.worker_profile_photo || data.profile_photo || data.worker_photo || null,
      latitude: data.worker_latitude || (data.worker && data.worker.latitude) || (data.worker && data.worker.worker_latitude) || null,
      longitude: data.worker_longitude || (data.worker && data.worker.longitude) || (data.worker && data.worker.worker_longitude) || null,
      travel_time_taken: data.worker_travel_time_taken || (data.worker && data.worker.travel_time_taken) || null,
      dispatch_time: data.worker_dispatch_time || (data.worker && data.worker.dispatch_time) || null,
      arrival_time_raw: data.worker_arrival_time || (data.worker && data.worker.arrival_time) || null
    };
  }

  const basePriceVal = data.pricing?.base_price ? parseFloat(data.pricing.base_price) : 0;
  const extraHoursVal = data.pricing?.extra_work_hours ? parseFloat(data.pricing.extra_work_hours) : 0;
  const extraHoursAmountVal = data.pricing?.extra_work_hours_amount ? parseFloat(data.pricing.extra_work_hours_amount) : 0;
  const materialsFeeVal = data.pricing?.materials_fee ? parseFloat(data.pricing.materials_fee) : 0;
  const extraChargesVal = data.pricing?.extra_charges ? parseFloat(data.pricing.extra_charges) : 0;
  const totalAmountVal = data.pricing?.total_amount ? parseFloat(data.pricing.total_amount) : (basePriceVal + extraHoursAmountVal + materialsFeeVal + extraChargesVal);
  const hourlyRateVal = data.pricing?.hourly_rate ? parseFloat(data.pricing.hourly_rate) : 0;

  // Let's determine payment summary
  const isMainPaid = (data.order?.payment_status === 1 || data.payment_status === 'Paid');
  const extraHoursStatusVal = data.pricing?.extra_work_hours_status || (extraHoursVal > 0 ? 'approved' : 'none');

  let paidVal = 0;
  let pendingVal = 0;

  if (isMainPaid) {
    if (extraHoursStatusVal === 'approved') {
      paidVal = basePriceVal + materialsFeeVal + extraChargesVal;
      pendingVal = extraHoursAmountVal;
    } else if (extraHoursStatusVal === 'paid' || extraHoursStatusVal === 'completed') {
      paidVal = totalAmountVal;
      pendingVal = 0;
    } else {
      paidVal = basePriceVal + materialsFeeVal + extraChargesVal;
      pendingVal = 0;
    }
  } else {
    paidVal = 0;
    pendingVal = totalAmountVal;
  }

  // Override if backend explicitly provides paid/pending amounts
  if (data.pricing?.paid_amount !== undefined && data.pricing?.paid_amount !== null) {
    paidVal = parseFloat(data.pricing.paid_amount);
  } else if (data.paid_amount !== undefined && data.paid_amount !== null) {
    paidVal = parseFloat(data.paid_amount);
  } else if (data.payment?.paid !== undefined && data.payment?.paid !== null) {
    const rawPaid = typeof data.payment.paid === 'string' ? data.payment.paid.replace(/[^0-9.]/g, '') : data.payment.paid;
    paidVal = parseFloat(rawPaid) || 0;
  }

  if (data.pricing?.pending_amount !== undefined && data.pricing?.pending_amount !== null) {
    pendingVal = parseFloat(data.pricing.pending_amount);
  } else if (data.pending_amount !== undefined && data.pending_amount !== null) {
    pendingVal = parseFloat(data.pending_amount);
  } else if (data.payment?.pending !== undefined && data.payment?.pending !== null) {
    const rawPending = typeof data.payment.pending === 'string' ? data.payment.pending.replace(/[^0-9.]/g, '') : data.payment.pending;
    pendingVal = parseFloat(rawPending) || 0;
  }

  const pendingExtraHoursVal = data.pricing?.pending_extra_work_hours ? parseInt(data.pricing.pending_extra_work_hours, 10) : 
                               (data.pricing?.pending_extra_hours ? parseInt(data.pricing.pending_extra_hours, 10) : 
                               (data.pending_extra_work_hours ? parseInt(data.pending_extra_work_hours, 10) : 
                               (data.pending_extra_hours ? parseInt(data.pending_extra_hours, 10) : 0)));

  const clientSecretVal = data.clientSecret || data.client_secret ||
                          data.order?.clientSecret || data.order?.client_secret ||
                          data.pricing?.clientSecret || data.pricing?.client_secret ||
                          data.payment?.clientSecret || data.payment?.client_secret ||
                          data.payment_intent?.client_secret || data.payment_intent?.clientSecret ||
                          data.payment_intent_client_secret || data.order?.payment_intent_client_secret || 
                          data.stripe?.client_secret || data.stripe_client_secret || null;
  const paymentIntentIdVal = data.paymentIntentId || data.order?.paymentIntentId || data.payment?.paymentIntentId || null;

  // booking_hours: use pricing.total_hours first (API), then expected_time, then fallback
  const bookingHoursVal = data.pricing?.total_hours || 
                          parseInt(data.expected_time) || 
                          data.pricing?.no_of_hours || data.no_of_hours || data.booking_hours || 1;

  return {
    bookingPrimaryId: data.bookingPrimaryId,
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
    // API fields: rooms, area_sqm, frequency
    no_rooms: data.rooms || data.no_rooms || null,
    sqm: data.area_sqm || data.sqm || null,
    service_frequency: data.frequency || data.service_frequency || null,
    booking_hours: bookingHoursVal,
    bookingLatitude: data.bookingLatitude || null,
    bookingLongitude: data.bookingLongitude || null,
    requirements: {
      cleaning_materials: data.requirements?.cleaning_materials || false,
      vacuum_cleaner: data.requirements?.vacuum_cleaner || false
    },
    pricing: {
      basePrice: `€${basePriceVal.toFixed(2)}`,
      extraHours: `€${extraHoursAmountVal.toFixed(2)}`,
      extraCharges: `€${materialsFeeVal.toFixed(2)}`,
      materialsFee: `€${materialsFeeVal.toFixed(2)}`,
      extraChargesActual: `€${extraChargesVal.toFixed(2)}`,
      totalAmount: `€${totalAmountVal.toFixed(2)}`,
      hourlyRate: `€${hourlyRateVal.toFixed(2)}`
    },
    payment: {
      total: `€${totalAmountVal.toFixed(2)}`,
      paid: `€${paidVal.toFixed(2)}`,
      pending: `€${pendingVal.toFixed(2)}`,
    },
    extraHoursDetail: {
      hours: `${extraHoursVal} Hour(s)`,
      rate: `€${hourlyRateVal.toFixed(2)}`,
      amount: `€${extraHoursAmountVal.toFixed(2)}`
    },
    extraHoursStatus: extraHoursStatusVal,
    pendingExtraHours: pendingExtraHoursVal,
    clientSecret: clientSecretVal,
    paymentIntentId: paymentIntentIdVal,
    materials: data.materials || [],
    rawData: data
  };
}

const isImageUrl = (image) => image && (
  image.startsWith('/') ||
  image.startsWith('http') ||
  image.includes('.') ||
  !['vacuum_cleaner', 'cleaning', 'plumbing', 'electrical', 'painting', 'ac'].includes(image)
);

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Pending');
  const [extraHoursCount, setExtraHoursCount] = useState(0);
  const [isAddHoursModalOpen, setIsAddHoursModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState('');
  const [addHoursStatus, setAddHoursStatus] = useState('none'); // 'none' | 'pending' | 'approved'
  const [isAddingHours, setIsAddingHours] = useState(false);

  // Stripe Payment State
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [paymentBookingData, setPaymentBookingData] = useState(null);

  // Reschedule state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [modalWorkers, setModalWorkers] = useState([]);
  const [isWorkersLoading, setIsWorkersLoading] = useState(false);
  const [selectedRescheduleWorkerId, setSelectedRescheduleWorkerId] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authApi.getOrderDetails(rawId);
      if (res.status && res.data) {
        const mapped = mapBackendOrderToUI(res.data);
        setOrder(mapped);
      } else {
        throw new Error(res.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to fetch order details');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (rawId) {
      fetchOrderDetails();
    } else {
      setError('No Order ID provided');
      setIsLoading(false);
    }
  }, [rawId]);

  useEffect(() => {
    if (order) {
      const rawStatus = (order.status || 'Pending').toLowerCase();
      setCurrentStatus(
        (rawStatus === 'pending' || rawStatus === 'upcoming') ? 'Pending' :
        (rawStatus === 'in progress' || rawStatus === 'inprogress' || rawStatus === 'in-progress' || rawStatus === 'in_progress' || rawStatus === 'ininprogress' || rawStatus === 'travel' || rawStatus === 'travelling' || rawStatus === 'traveling' || rawStatus === 'started travel' || rawStatus === 'worker started travel' || rawStatus === 'start travel' || rawStatus === 'worker start travel' || rawStatus === 'worker_started_travel') ? 'Inprogress' : 
        (rawStatus === 'completed') ? 'Completed' :
        (rawStatus === 'cancelled') ? 'Cancelled' : 
        order.status
      );
      setExtraHoursCount(
        order.extraHoursDetail ? parseFloat(order.extraHoursDetail.hours) || 0 : 0
      );
      if (order.extraHoursStatus) {
        setAddHoursStatus(order.extraHoursStatus);
      }
      if (order.pendingExtraHours > 0) {
        setAddHoursStatus('pending');
      }
    }
  }, [order]);

  // State helpers
  const isPending = currentStatus === 'Pending';
  const isInProgress = currentStatus === 'Inprogress' || 
                       currentStatus === 'Ininprogress' || 
                       currentStatus === 'Travel' || 
                       currentStatus === 'Travelling' || 
                       currentStatus === 'Traveling' || 
                       currentStatus === 'Started Travel' || 
                       currentStatus === 'Worker Started Travel' || 
                       currentStatus === 'Start Travel' || 
                       currentStatus === 'Worker Start Travel';
  const isCompleted = currentStatus === 'Completed';
  const isCancelled = currentStatus === 'Cancelled';

  // Math variables safely calculated from dynamic data
  const basePriceNum = order?.pricing?.basePrice ? parseFloat(order.pricing.basePrice.replace(/[^0-9.]/g, '')) : 0;
  const ratePerHour = order?.pricing?.hourlyRate ? parseFloat(order.pricing.hourlyRate.replace(/[^0-9.]/g, '')) : 20;
  const activeExtraHours = order?.extraHoursDetail ? parseFloat(order.extraHoursDetail.hours) || 0 : extraHoursCount;
  const extraHoursAmount = activeExtraHours * ratePerHour;
  const extraCharges = order?.pricing?.extraCharges ? parseFloat(order.pricing.extraCharges.replace(/[^0-9.]/g, '')) : 0;
  const extraChargesActual = order?.pricing?.extraChargesActual ? parseFloat(order.pricing.extraChargesActual.replace(/[^0-9.]/g, '')) : 0;
  
  const totalAmountNum = basePriceNum + extraHoursAmount + extraCharges + extraChargesActual;
  
  const paidNum = (order?.status === 'Completed' || isCompleted) ? totalAmountNum : (order?.payment?.paid ? parseFloat(order.payment.paid.replace(/[^0-9.]/g, '')) : (basePriceNum + extraCharges + extraChargesActual));
  const pendingNum = Math.max(0, totalAmountNum - paidNum);

  const formatEuro = (amount) => `€${amount.toFixed(2)}`;

  const formatTimeOnly = (dateTimeStr) => {
    if (!dateTimeStr) return '--:--';
    const parts = dateTimeStr.split(' ');
    if (parts.length === 2) {
      const timeParts = parts[1].split(':');
      if (timeParts.length >= 2) return `${timeParts[0]}:${timeParts[1]}`;
    }
    return dateTimeStr;
  };

  const distanceKm = (order && order.bookingLatitude && order.bookingLongitude && order.worker && order.worker.latitude && order.worker.longitude)
    ? getHaversineDistance(order.bookingLatitude, order.bookingLongitude, order.worker.latitude, order.worker.longitude)
    : null;
  const distanceStr = distanceKm !== null ? `${distanceKm.toFixed(1)} km` : '0.0 km';
  const travelTimeStr = order?.worker?.travel_time_taken || '2 mins';
  const durationAndDistanceStr = `${travelTimeStr} (${distanceStr})`;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      router.push('/orders');
    } else {
      router.push('/dashboard/orders');
    }
  };

  const handleConfirmBooking = () => {
    alert(`Booking confirmed for Order ${order.id}`);
  };

  // Helper to map backend workers inside the modal
  const mapModalWorkerToUI = (w, index) => {
    const nameParts = (w.name || '').trim().split(/\s+/);
    const initials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (nameParts[0]?.[0] || 'W').toUpperCase();

    const gradients = [
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-amber-400 to-rose-500',
      'from-violet-400 to-purple-500'
    ];
    const gradient = gradients[index % gradients.length];

    return {
      id: w.id,
      name: w.name || 'Anonymous Worker',
      role: w.skill ? `${w.skill} Specialist` : 'Cleaning Specialist',
      rating: parseFloat(w.rating) || 4.5,
      reviews: parseInt(w.reviews_count, 10) || 0,
      hourly_wage: parseFloat(w.hourly_wage) || 20.00,
      is_top_rated: w.is_top_rated,
      initials,
      gradient,
      photo: w.profile_photo || null
    };
  };

  const handleReschedule = async () => {
    setIsRescheduleModalOpen(true);
    setIsWorkersLoading(true);
    setRescheduleError(null);
    setSelectedRescheduleWorkerId(null);
    try {
      const res = await authApi.getWorkers({});
      if (res && res.status && Array.isArray(res.data)) {
        const mapped = res.data.map((w, index) => mapModalWorkerToUI(w, index));
        setModalWorkers(mapped);
      } else {
        throw new Error(res?.message || 'Failed to load workers list');
      }
    } catch (err) {
      setRescheduleError(err.message || 'Unable to fetch workers. Please try again.');
    } finally {
      setIsWorkersLoading(false);
    }
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedRescheduleWorkerId) return;
    setIsRescheduling(true);
    try {
      const bookingIdVal = order?.booking_id || rawId;
      const res = await authApi.rescheduleOrder(bookingIdVal, selectedRescheduleWorkerId);
      if (res && res.status) {
        // Map the new worker details to update page state dynamically
        const newWorker = res.data.new_worker;
        const initials = newWorker.worker_name ? newWorker.worker_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AW';
        
        const updatedWorker = {
          name: newWorker.worker_name,
          role: newWorker.skill ? `${newWorker.skill} Specialist` : 'Cleaning Expert',
          rating: parseFloat(newWorker.rating) || 4.9,
          reviews: 120, // default placeholder
          arrivalTime: '09:55',
          initials,
          gradient: 'from-blue-450 to-teal-550'
        };

        setOrder(prev => {
          if (!prev) return null;
          return {
            ...prev,
            worker: updatedWorker,
            date: res.data.booking_date ? formatDateStr(res.data.booking_date) : prev.date,
            time: res.data.booking_time || prev.time
          };
        });

        setIsRescheduleModalOpen(false);
        alert('Booking rescheduled successfully!');
      } else {
        throw new Error(res?.message || 'Rescheduling failed.');
      }
    } catch (err) {
      alert(err.message || 'Error occurred during rescheduling. Please try again.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleBookAgain = () => {
    alert(`Booking service ${order.service} again`);
  };

  const handleRescheduleClick = () => {
    if (!order || !order.rawData) {
      router.push('/add-post');
      return;
    }
    
    const rawData = order.rawData;
    const params = new URLSearchParams();
    params.set('service', rawData.service_type || '');
    if (rawData.service_id) params.set('service_id', rawData.service_id.toString());
    params.set('rooms', (rawData.rooms || 1).toString());
    params.set('sqm', (rawData.area_sqm || 30).toString());
    params.set('expected_time', (rawData.expected_time || 2).toString());
    params.set('date', rawData.booking_date || '');
    params.set('location', rawData.service_address || '');
    params.set('latitude', rawData.bookingLatitude || '');
    params.set('longitude', rawData.bookingLongitude || '');
    params.set('notes', rawData.note || rawData.notes || '');
    
    if (rawData.materials) {
      const materialIds = Array.isArray(rawData.materials) 
        ? rawData.materials.map(m => m.material_amount_id || m.id)
        : [];
      params.set('material_amount_ids', JSON.stringify(materialIds));
    }
    
    const freq = rawData.frequency || 'One Time';
    if (freq === 'Biweekly' || freq === 'BiWeekly') {
      params.set('frequency', 'Weekly');
      params.set('is_biweekly', 'true');
      try {
        const slots = typeof rawData.frequency_details === 'string' 
          ? JSON.parse(rawData.frequency_details) 
          : rawData.frequency_details;
        if (Array.isArray(slots)) {
          params.set('biweekly_days', JSON.stringify({
            day1: slots[0]?.day || '1st Monday',
            day2: slots[1]?.day || '3rd Tuesday'
          }));
          params.set('biweekly_times', JSON.stringify({
            time1: slots[0]?.time || '12:00 PM',
            time2: slots[1]?.time || '05:00 PM'
          }));
        }
      } catch (e) {}
    } else if (freq === 'Weekly') {
      params.set('frequency', 'Weekly');
      params.set('is_biweekly', 'false');
      if (rawData.frequency_details) {
        params.set('weekly_slots', typeof rawData.frequency_details === 'string' 
          ? rawData.frequency_details 
          : JSON.stringify(rawData.frequency_details));
      }
    } else if (freq === 'Monthly') {
      params.set('frequency', 'Monthly');
      if (rawData.frequency_details) {
        params.set('monthly_slots', typeof rawData.frequency_details === 'string' 
          ? rawData.frequency_details 
          : JSON.stringify(rawData.frequency_details));
      }
    } else {
      params.set('frequency', 'One Time');
      params.set('booking_time', rawData.booking_time || '12:00 PM');
    }
    
    router.push(`/add-post?${params.toString()}`);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading Invoice PDF for Order ${order.id}`);
  };

  const handlePay = () => {
    if (order?.clientSecret) {
      setStripeClientSecret(order.clientSecret);
      setPaymentBookingData({
        service_type: order.service || null,
        total_payable: pendingNum,
        worker_name: order.worker?.name || null,
        booking_id: order.booking_id,
        booking_date: order.date,
        booking_time: order.time
      });
      setShowStripeModal(true);
    } else {
      router.push(`/payment/success?service=${encodeURIComponent(order.service)}&amount=${pendingNum}&worker=${encodeURIComponent(order.worker?.name || '')}&booking_id=${order.booking_id}&datetime=${encodeURIComponent(order.date + ', ' + order.time)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">
        <DashboardHeader />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#137DC5] animate-spin" />
            <span className="font-sans font-bold text-slate-500 text-sm">Loading Order Details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">
        <DashboardHeader />
        <div className="flex-grow flex items-center justify-center p-8 animate-fadeIn">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-md w-full shadow-lg">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Info className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="font-display font-extrabold text-[18px] text-[#092040] mb-2">
              Unable to load order details
            </h3>
            <p className="font-sans text-[13px] text-slate-500 font-semibold mb-6">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/orders')}
                className="flex-1 py-3 border border-slate-200 hover:border-slate-350 text-slate-650 font-sans font-bold text-[13px] rounded-xl cursor-pointer transition-colors"
              >
                Back to Orders
              </button>
              <button
                onClick={fetchOrderDetails}
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
    <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">
      
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col flex-grow w-full">
        {/* Header */}
        <DashboardHeader />

        {/* Main Layout Area */}
        <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Navigation Sidebar */}
            <DashboardSidebar />

            {/* Right Content Area */}
            <div className="flex-grow w-full lg:w-3/4 flex flex-col gap-5">
              
              {/* Switched order details views based on status */}

              {/* Title Line (Clean Back arrow + Title + options to match mockup) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBack}
                    className="p-1.5 text-[#092040] hover:text-[#137DC5] transition-colors cursor-pointer mr-1"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#092040] tracking-tight">
                    Order Details
                  </h1>
                </div>

                {/* Options Dots */}
                <div className="relative">
                  <button 
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                    className="p-1.5 text-[#092040] hover:text-[#137DC5] transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-5.5 h-5.5 stroke-[2.5]" />
                  </button>
                  {isOptionsOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-premium border border-slate-100 py-1.5 z-40">
                      <button onClick={() => alert('Cancelling order...')} className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-sans text-[12px] text-red-600 font-semibold cursor-pointer">
                        Cancel Booking
                      </button>
                      <button onClick={() => alert('Contacting support...')} className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-sans text-[12px] text-slate-650 font-semibold cursor-pointer">
                        Contact Support
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Order ID Row (Floats on background matching mockup) */}
              <div className="flex justify-between items-center px-1.5 py-1.5 animate-fadeIn">
                {isInProgress ? (
                  <>
                    {/* Left: Status */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EBF5FA] rounded-full border border-blue-100/50">
                      <CircleDot className="w-4 h-4 text-[#137DC5]" />
                      <span className="font-sans font-extrabold text-[12.5px] tracking-wide text-[#137DC5]">
                        In Progress
                      </span>
                    </div>
                    {/* Right: Order ID */}
                    <span className="font-sans font-bold text-slate-400 text-[12.5px]">
                      Order ID: <span className="text-[#092040]">{order.id}</span>
                    </span>
                  </>
                ) : (
                  <>
                    {/* Left: Order ID */}
                    <span className="font-sans font-bold text-slate-400 text-[12.5px]">
                      Order ID: <span className="text-[#092040]">{order.id}</span>
                    </span>
                    {/* Right: Status */}
                    <div className="flex items-center gap-2">
                      <CircleDot className={`w-4 h-4 ${
                        isCompleted ? 'text-emerald-500' :
                        isCancelled ? 'text-red-500' :
                        'text-[#FFB300]'
                      }`} />
                      <span className={`font-sans font-extrabold text-[12.5px] tracking-wide ${
                        isCompleted ? 'text-emerald-500' :
                        isCancelled ? 'text-red-500' :
                        'text-[#FFB300]'
                      }`}>
                        {isInProgress ? 'In Progress' : currentStatus}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Rooms / sqm / Frequency Bar — always show when data present */}
              {(order.no_rooms != null || order.sqm != null || order.service_frequency) && (
                <div className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm flex items-center justify-center gap-0 animate-fadeIn">
                  {order.no_rooms != null && (
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <span className="text-sm">🏠</span>
                      <span className="font-sans font-semibold text-[12px] text-slate-600">{order.no_rooms} Rooms</span>
                    </div>
                  )}
                  {order.no_rooms != null && order.sqm != null && (
                    <div className="w-px h-4 bg-slate-200" />
                  )}
                  {order.sqm != null && (
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <span className="text-sm">📐</span>
                      <span className="font-sans font-semibold text-[12px] text-slate-600">{parseFloat(order.sqm).toFixed(0)} sqm</span>
                    </div>
                  )}
                  {order.sqm != null && order.service_frequency && (
                    <div className="w-px h-4 bg-slate-200" />
                  )}
                  {order.service_frequency && (
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <span className="text-sm">🔄</span>
                      <span className="font-sans font-semibold text-[12px] text-slate-600 capitalize">{order.service_frequency}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Job Summary Card (Clean borderless details container) */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fadeIn">

                {/* Main Content Layout inside the card */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Left Column: Job/Service Illustration */}
                  <div className="w-40 h-40 bg-[#FAFBFD] border border-blue-50/50 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    {isImageUrl(order.image) ? (
                      <img
                        src={order.image}
                        alt={order.service}
                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 hover:scale-105"
                      />
                    ) : (order.service === 'Home Cleaning' || order.image === 'vacuum_cleaner') ? (
                      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" className="relative z-10 transition-transform duration-500 hover:scale-105">
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
                      // Fallback: Custom SVG or service-specific representation
                      <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#137DC5]">
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

                  {/* Right Column: Details text with raw clean icons vertically stacked */}
                  <div className="flex flex-col text-left flex-grow gap-3 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                      <h2 className="font-display font-extrabold text-[18px] text-[#092040]">
                        {order.service}
                      </h2>
                      {isCompleted && (
                        <Link 
                          href={`/orders/${(rawId || '').toLowerCase()}/review`}
                          className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group"
                        >
                          <span className="font-sans font-bold text-[#137DC5] group-hover:underline text-[11.5px]">Write a Review</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <Star className="w-3.5 h-3.5 text-slate-300 fill-transparent" />
                          </div>
                        </Link>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-4.5 pt-1 text-left w-full">
                      {/* Clean Date */}
                      <div className="flex items-start gap-3.5">
                        <Calendar className="w-4.5 h-4.5 text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-slate-400 text-[11.5px]">Clean Date</span>
                          <span className="font-sans font-extrabold text-[#092040] text-[13.5px] mt-0.5">Today, {order.date}</span>
                        </div>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-start gap-3.5">
                        <Clock className="w-4.5 h-4.5 text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-slate-400 text-[11.5px]">Time</span>
                          <span className="font-sans font-extrabold text-[#092040] text-[13.5px] mt-0.5">{order.time}</span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3.5">
                        <MapPin className="w-4.5 h-4.5 text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-slate-400 text-[11.5px]">Address</span>
                          <span className="font-sans font-extrabold text-[#092040] text-[13.5px] mt-0.5 leading-tight">{order.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Worker Details Card */}
              {order.worker ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-0 animate-fadeIn">
                  {/* Top row: avatar + info + action icon */}
                  <div className="flex sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner flex-shrink-0 relative border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {order.worker.profile_photo ? (
                          <img
                            src={order.worker.profile_photo}
                            alt={order.worker.name}
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                if (!parent.querySelector('.fallback-avatar')) {
                                  const fallback = document.createElement('div');
                                  fallback.className = `fallback-avatar w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[15px] bg-gradient-to-tr ${order.worker.gradient}`;
                                  fallback.innerText = order.worker.initials;
                                  parent.appendChild(fallback);
                                }
                              }
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-white font-display font-extrabold text-[15px] bg-gradient-to-tr ${order.worker.gradient}`}>
                            {order.worker.initials}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker</span>
                        <span className="font-sans font-extrabold text-[#092040] text-[15.5px] mt-0.5">{order.worker.name}</span>
                        
                        {/* rating block */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                          <span className="font-sans font-extrabold text-[#092040] text-[11.5px] ml-0.5">
                            {order.worker.rating}
                          </span>
                          <span className="font-sans font-semibold text-slate-400 text-[10px] ml-0.5">
                            ({order.worker.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Chat button for cancelled, arrival time for others */}
                    {isCancelled ? (
                      <button
                        onClick={() => {
                          const bId = order.booking_id || order.id || '';
                          const cleanId = bId.replace('#', '');
                          const wName = order.worker?.name || 'Worker';
                          const wId = order.rawData?.worker_pk_id || 101;
                          const sName = order.service || '';
                          const bDate = order.rawData?.booking_date || order.date || '';
                          const bLoc = order.address || '';
                          router.push(`/messages?booking_id=${cleanId}&worker_name=${encodeURIComponent(wName)}&worker_id=${wId}&service=${encodeURIComponent(sName)}&date=${encodeURIComponent(bDate)}&location=${encodeURIComponent(bLoc)}`);
                        }}
                        className="w-10 h-10 rounded-full bg-[#EEF6FD] border border-blue-100/50 flex items-center justify-center cursor-pointer hover:bg-[#DDEEF9] transition-colors flex-shrink-0"
                      >
                        <MessageSquare className="w-4.5 h-4.5 text-[#137DC5]" />
                      </button>
                    ) : (
                      <div className="flex flex-col text-left sm:text-right justify-center">
                        <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker Arrival Time</span>
                        <div className="flex items-center sm:justify-end gap-1.5 font-sans font-extrabold text-[17px] mt-1 text-[#137DC5]">
                          <Clock className="w-4.5 h-4.5" />
                          <span>{durationAndDistanceStr}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom row for cancelled: Worker Arrival Time */}
                  {isCancelled && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-sans font-medium text-slate-400 text-[12px]">Worker Arrival Time</span>
                      </div>
                      <span className="font-sans font-extrabold text-[#137DC5] text-[14px]">
                        {order.worker.arrivalTime || '--:--'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-3.5 text-left animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#137DC5] flex-shrink-0">
                    <User className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker</span>
                    <p className="font-sans font-extrabold text-slate-500 text-[14.5px] mt-0.5">Assigning Best Professional...</p>
                  </div>
                </div>
              )}

              {/* Reschedule Banner for Cancelled Status */}
              {isCancelled && (
                <div className="bg-[#F4F9FD] border border-blue-100/60 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex gap-3 items-center text-left">
                    <div className="w-10 h-10 rounded-full bg-[#E0EEFC] flex items-center justify-center text-[#0D6EFD] flex-shrink-0">
                      <Info className="w-5 h-5 text-[#0D6EFD]" />
                    </div>
                    <div>
                      <p className="font-sans text-[13.5px] text-slate-700 font-semibold leading-relaxed">
                        You can easily pick a new time that works better for you.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/add-post')}
                    className="px-5 py-2.5 bg-[#0D6EFD] hover:bg-[#0D6EFD]/90 text-white font-sans font-bold text-[13px] rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Reschedule
                  </button>
                </div>
              )}

              {/* Travel Timeline Tracker (Only for In Progress state) */}
              {isInProgress && (
                <div className="bg-[#F0F5FA]/60 border border-blue-100/50 rounded-2xl p-5 shadow-sm text-left animate-fadeIn">
                  <div className="relative pl-10 flex flex-col gap-6">
                    {/* Vertical Dotted Line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-[#137DC5]/30"></div>
                    
                    {/* Step 1 */}
                    <div className="relative flex flex-col items-start text-left">
                      <div className="absolute -left-10 w-8 h-8 rounded-full bg-white border-2 border-[#137DC5] flex items-center justify-center text-[#137DC5] shadow-sm">
                        <Bike className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-sans font-extrabold text-[#092040] text-[13px]">Worker Started Travel</span>
                        <span className="font-sans font-extrabold text-[10px] text-white bg-[#0D6EFD] px-2 py-0.5 rounded-full ml-2">
                          {durationAndDistanceStr}
                        </span>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="relative flex flex-col items-start text-left">
                      <div className="absolute -left-10 w-8 h-8 rounded-full bg-white border-2 border-[#137DC5] flex items-center justify-center text-[#137DC5] shadow-sm">
                        <Car className="w-4 h-4" />
                      </div>
                      <span className="font-sans font-extrabold text-[#092040] text-[13px]">Worker Started Travel</span>
                      <span className="font-sans font-bold text-slate-400 text-[11px] mt-0.5">
                        {order?.worker?.dispatch_time ? formatTimeOnly(order.worker.dispatch_time) : '--:--'}
                      </span>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="relative flex flex-col items-start text-left">
                      <div className="absolute -left-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-sans font-extrabold text-slate-400 text-[13px]">Estimated Arrival Time</span>
                      <span className="font-sans font-bold text-slate-400 text-[11px] mt-0.5">{durationAndDistanceStr}</span>
                    </div>
                    
                    {/* Step 4 */}
                    <div className="relative flex flex-col items-start text-left">
                      <div className="absolute -left-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="font-sans font-extrabold text-slate-400 text-[13px]">Service Start Time (Estimated)</span>
                      <span className="font-sans font-bold text-slate-400 text-[11px] mt-0.5">Today, {order.time}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Location Card (Desktop) */}
              {isInProgress && order.worker && order.worker.latitude && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left flex flex-col gap-4 animate-fadeIn">
                  <h3 className="flex items-center gap-2 font-sans font-bold text-[#092040] text-[13.5px]">
                    <Compass size={16} className="text-[#137DC5]" /> Live Location
                  </h3>
                  
                  <div className="flex flex-col gap-4 font-sans text-[12.5px] font-semibold text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EAF4FC] flex items-center justify-center text-[#137DC5] flex-shrink-0">
                        <MapPin size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker Location</span>
                        <span className="font-sans font-extrabold text-[#092040] text-[13.5px] mt-0.5">
                          {parseFloat(order.worker.latitude).toFixed(5)}, {parseFloat(order.worker.longitude).toFixed(5)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8F6EE] flex items-center justify-center text-[#19A859] flex-shrink-0">
                        <Home size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Location</span>
                        <span className="font-sans font-extrabold text-[#092040] text-[13.5px] mt-0.5">{order.address}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-dashed border-slate-200 my-1"></div>
                    
                    <div className="flex justify-between items-center text-[#092040] font-extrabold text-[14px]">
                      <div className="flex items-center gap-2">
                        <Navigation size={14} className="text-slate-400" style={{ transform: 'rotate(45deg)' }} />
                        <span className="font-sans font-bold text-slate-400 text-[12px]">Distance to Service</span>
                      </div>
                      <span className="font-sans font-extrabold text-[#137DC5] text-[13.5px]">{durationAndDistanceStr}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Details (Pricing breakdown with merged alert banner) */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left flex flex-col gap-4 animate-fadeIn">
                <h3 className="font-sans font-bold text-[#092040] text-[13.5px]">
                  Service Details
                </h3>
                
                <div className="flex flex-col gap-3 font-sans text-[12.5px] font-semibold text-slate-400">
                  <div className="flex justify-between items-center">
                    <span className="w-1/3 text-left">Base Price (1 Hour)</span>
                    <span className="w-1/3"></span>
                    <span className="w-1/3 text-right text-slate-700">{formatEuro(basePriceNum)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="w-1/3 text-left">Extra Work Hours</span>
                    <span className="w-1/3 text-center text-slate-500 font-medium">{activeExtraHours} Hour(s)</span>
                    <span className="w-1/3 text-right text-slate-700 font-bold">{formatEuro(extraHoursAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="w-1/3 text-left">Materials Fee</span>
                    <span className="w-1/3"></span>
                    <span className="w-1/3 text-right text-slate-700">{order?.pricing?.materialsFee || '€0.00'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="w-1/3 text-left">Extra Charges</span>
                    <span className="w-1/3"></span>
                    <span className="w-1/3 text-right text-slate-700">{order?.pricing?.extraChargesActual || '€0.00'}</span>
                  </div>
                  
                  {/* Dotted border line */}
                  <div className="border-t border-dashed border-slate-200 my-1"></div>
                  
                  <div className="flex justify-between items-center text-[#092040] font-extrabold text-[14px]">
                    <span className="w-1/3 text-left">Total Amount</span>
                    <span className="w-1/3"></span>
                    <span className="w-1/3 text-right text-[#092040]">{formatEuro(totalAmountNum)}</span>
                  </div>
                </div>

                {/* Merged Interactive Alert Banner inside the details card container */}
                {isInProgress && (
                  <div className="bg-[#F4F9FD] border border-blue-100/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                    <div className="flex gap-2.5 items-start text-left max-w-lg">
                      <Info className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <p className="font-sans text-[11.5px] text-slate-500 font-semibold leading-relaxed">
                          Extra work hours will be charged as per hourly rate.
                        </p>
                        <p className="font-sans text-[11.5px] text-[#137DC5] font-extrabold mt-0.5">
                          Hourly Rate: {formatEuro(ratePerHour)}/Hour
                        </p>
                      </div>
                    </div>

                    {!(order?.pendingExtraHours > 0) && addHoursStatus !== 'pending' && !(pendingNum > 0 && activeExtraHours > 0) && (
                      <button 
                        onClick={() => setIsAddHoursModalOpen(true)}
                        className="px-4 py-2 bg-[#137DC5] hover:bg-[#137DC5]/90 text-white font-sans font-bold text-[12.5px] rounded-lg shadow-sm transition-all cursor-pointer flex-shrink-0"
                      >
                        Add Hours
                      </button>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="bg-[#E8F6EE] border border-emerald-100/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                    <div className="flex gap-2.5 items-start text-left max-w-lg">
                      <Info className="w-4.5 h-4.5 text-[#19A859] flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <p className="font-sans text-[11.5px] text-[#19A859] font-semibold leading-relaxed">
                          Extra work hours were charged as per hourly rate.
                        </p>
                        <p className="font-sans text-[11.5px] text-[#19A859] font-extrabold mt-0.5">
                          Hourly Rate: {formatEuro(ratePerHour)}/Hour
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="bg-[#F4F9FD] border border-blue-100/60 rounded-xl p-4 flex items-center mt-2">
                    <div className="flex gap-2.5 items-start text-left max-w-lg">
                      <Info className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <p className="font-sans text-[11.5px] text-slate-500 font-semibold leading-relaxed">
                          Extra work hours will be charged as per hourly rate.
                        </p>
                        <p className="font-sans text-[11.5px] text-[#137DC5] font-extrabold mt-0.5">
                          Hourly Rate: {formatEuro(ratePerHour)}/Hour
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cleaning Materials Required Card (Desktop) */}
              {order?.materials && order.materials.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left flex flex-col gap-4 animate-fadeIn">
                  <h3 className="flex items-center gap-2 font-sans font-bold text-[#092040] text-[13.5px]">
                    <ShoppingBag size={16} className="text-[#137DC5]" /> Cleaning Materials Required
                  </h3>
                  
                  <div className="flex flex-col gap-3 font-sans text-[12.5px] font-semibold text-slate-650">
                    {order.materials.map((mat) => (
                      <div key={mat.id} className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2.5 last:border-b-0 last:pb-0">
                        <span className="text-slate-600">{mat.name}</span>
                        <span className="text-[#137DC5] font-bold">Yes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Work Hours Detail Grid (For Completed and In Progress with vertical dividers matching mockup) */}
              {(isCompleted || isInProgress || isPending) && activeExtraHours > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left animate-fadeIn">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className={`w-4 h-4 ${isCompleted ? 'text-[#19A859]' : 'text-[#137DC5]'}`} />
                    <h3 className="font-sans font-bold text-[#092040] text-[13px]">
                      Extra Work Hours Detail
                    </h3>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center pt-3 border-t border-slate-100/50">
                    {/* Column 1: Labels */}
                    <div className="flex flex-col gap-2.5">
                      <span className="font-sans font-bold text-slate-400 text-[10px] uppercase tracking-wider">Extra Hours</span>
                      <span className="font-sans font-bold text-slate-400 text-[10px] uppercase tracking-wider">Hourly Rate</span>
                    </div>
                    
                    {/* Divider 1 */}
                    <div className="h-10 w-[1px] bg-slate-100 mx-4"></div>
                    
                    {/* Column 2: Values */}
                    <div className="flex flex-col gap-2.5">
                      <span className="font-sans font-semibold text-slate-650 text-[12.5px]">{activeExtraHours}Hour(s)</span>
                      <span className="font-sans font-semibold text-slate-650 text-[12.5px]">{formatEuro(ratePerHour)}</span>
                    </div>
                    
                    {/* Divider 2 */}
                    <div className="h-10 w-[1px] bg-slate-100 mx-4"></div>
                    
                    {/* Column 3: Extra Hours Amount */}
                    <div className="flex flex-col gap-2.5">
                      <span className="font-sans font-bold text-slate-400 text-[10px] uppercase tracking-wider">Extra Hours Amount</span>
                      <span className="font-sans font-extrabold text-slate-800 text-[13px]">{formatEuro(extraHoursAmount)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary Box */}
              {!isPending && addHoursStatus === 'approved' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left animate-fadeIn">
                  <h3 className="font-sans font-bold text-[#092040] text-[13.5px] mb-4">
                    Payment Summary
                  </h3>

                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center pt-3 border-t border-slate-100/50">
                    {/* Column 1: Total Amount */}
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-bold text-slate-400 text-[10.5px]">Total Amount</span>
                      <span className="font-sans font-extrabold text-slate-800 text-[14px] mt-0.5">
                        {formatEuro(totalAmountNum)}
                      </span>
                    </div>

                    {/* Divider 1 */}
                    <div className="h-10 w-[1px] bg-slate-100 mx-4"></div>

                    {/* Column 2: Already Paid */}
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-bold text-slate-400 text-[10.5px]">Already Paid</span>
                      <span className="font-sans font-bold text-[#092040] text-[14px] mt-0.5">
                        {formatEuro(paidNum)}
                      </span>
                    </div>

                    {/* Divider 2 */}
                    <div className="h-10 w-[1px] bg-slate-100 mx-4"></div>

                    {/* Column 3: Pending Amount */}
                    <div className="flex flex-col gap-1">
                      <span className="font-sans font-bold text-slate-400 text-[10.5px]">Pending Amount</span>
                      <span className="font-sans font-extrabold text-[#137DC5] text-[14px] mt-0.5">
                        {formatEuro(pendingNum)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Bottom Action Buttons */}
              <div className="mt-2.5">
                {currentStatus === 'Completed' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex-1 px-6 py-3 border border-slate-200 hover:border-slate-300 font-sans font-bold text-slate-600 text-[13.5px] rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Download PDF
                    </button>
                    <button 
                      onClick={() => router.push(`/orders/${(rawId || '').toLowerCase()}/review`)}
                      className="flex-1 px-6 py-3 bg-[#137DC5] hover:bg-[#137DC5]/90 text-white font-sans font-bold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Write Review
                    </button>
                  </div>
                )}

                {isInProgress && (
                  <>
                    {(order?.pendingExtraHours > 0 || addHoursStatus === 'pending') ? (
                      <div className="w-full px-6 py-3.5 bg-emerald-100 border border-emerald-500 rounded-xl text-emerald-850 font-sans font-extrabold text-[13.5px] text-center shadow-md transition-all">
                        Your Extra Hour Request Submitted. Please wait for Worker Approval.
                      </div>
                    ) : (pendingNum > 0 && (activeExtraHours > 0 || order?.extraHoursDetail || addHoursStatus === 'approved')) ? (
                      <button 
                        onClick={handlePay}
                        className="w-full px-6 py-3.5 bg-[#137DC5] hover:bg-[#137DC5]/90 text-white font-sans font-extrabold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center tracking-wide animate-fadeIn"
                      >
                        Pay {formatEuro(pendingNum)}
                      </button>
                    ) : (
                      <button 
                        onClick={() => alert('Order verified!')}
                        className="w-full px-6 py-3.5 bg-[#137DC5] hover:bg-[#137DC5]/90 text-white font-sans font-extrabold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center tracking-wide"
                      >
                        Verify
                      </button>
                    )}
                  </>
                )}

                {isCancelled && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => router.push('/dashboard/orders')}
                      className="flex-1 px-6 py-3 border border-slate-200 hover:border-slate-300 font-sans font-bold text-slate-600 text-[13.5px] rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => router.push('/add-post')}
                      className="flex-1 px-6 py-3 bg-[#0D6EFD] hover:bg-[#0D6EFD]/90 text-white font-sans font-bold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Reschedule
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex flex-col md:hidden min-h-screen bg-[#FAFCFF]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Mobile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid #F1F5F9'
        }}>
          <button
            onClick={handleBack}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={20} color="#092040" />
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#092040' }}>Order Details</span>
          
          {/* Options dots */}
          <div className="relative">
            <button 
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <MoreHorizontal size={24} color="#092040" />
            </button>
            {isOptionsOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-premium border border-slate-100 py-1.5 z-40">
                <button 
                  onClick={() => {
                    setIsOptionsOpen(false);
                    alert('Cancelling booking...');
                  }} 
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-sans text-[12px] text-red-600 font-semibold cursor-pointer"
                >
                  Cancel Booking
                </button>
                <button 
                  onClick={() => {
                    setIsOptionsOpen(false);
                    alert('Contacting support...');
                  }} 
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 font-sans text-[12px] text-slate-650 font-semibold cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
          
          {/* Order Info Card (Order ID + Status badge, Pills, Service Stack) */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 16,
            margin: '12px 16px',
            border: '1px solid #F1F5F9',
            boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
          }}>
            {/* Top row: Order ID & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#092040' }}>
                Order ID: {order.booking_id || order.id}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isCompleted ? '#19A859' : isPending ? '#F59E0B' : isInProgress ? '#FBBF24' : isCancelled ? '#EF4444' : '#94A3B8'
                }} />
                <span style={{
                  fontWeight: 700,
                  fontSize: 11,
                  color: isCompleted ? '#19A859' : isPending ? '#F59E0B' : isInProgress ? '#FBBF24' : isCancelled ? '#EF4444' : '#94A3B8'
                }}>
                  {isInProgress ? 'In Progress' : currentStatus}
                </span>
              </div>
            </div>

            {/* Pills Row (Rooms, sqm, Frequency) */}
            {(order.no_rooms != null || order.sqm != null || order.service_frequency) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                marginTop: 12
              }}>
                {order.no_rooms != null && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: '#F1F7FC',
                    border: '1px solid #E1EDF7',
                    borderRadius: 12,
                    padding: '8px 4px',
                    color: '#092040',
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    <Home size={14} color="#137DC5" />
                    <span>{order.no_rooms} Rooms</span>
                  </div>
                )}
                {order.sqm != null && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: '#F1F7FC',
                    border: '1px solid #E1EDF7',
                    borderRadius: 12,
                    padding: '8px 4px',
                    color: '#092040',
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    <Ruler size={14} color="#137DC5" />
                    <span>{parseFloat(order.sqm).toFixed(0)} sqm</span>
                  </div>
                )}
                {order.service_frequency && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: '#F1F7FC',
                    border: '1px solid #E1EDF7',
                    borderRadius: 12,
                    padding: '8px 4px',
                    color: '#092040',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}>
                    <Repeat size={14} color="#137DC5" />
                    <span>{order.service_frequency}</span>
                  </div>
                )}
              </div>
            )}

            {/* Service Stack details */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 16 }}>
              <div style={{
                width: 76,
                height: 76,
                background: '#FAFBFD',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #E9EFF6',
                overflow: 'hidden'
              }}>
                {isImageUrl(order.image) ? (
                  <img
                    src={order.image}
                    alt={order.service}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (order.service === 'Home Cleaning' || order.image === 'vacuum_cleaner') ? (
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
                  <svg viewBox="0 0 100 100" style={{ width: 40, height: 40 }} className="text-[#137DC5]">
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
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <h2 style={{ fontWeight: 800, fontSize: 16, color: '#092040', margin: 0 }}>
                  {order.service}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Calendar size={13} color="#94A3B8" style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 500 }}>Clean Date</span>
                      <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 1 }}>{order.date}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Clock size={13} color="#94A3B8" style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 500 }}>Time</span>
                      <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 1 }}>{order.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <MapPin size={13} color="#94A3B8" style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 500 }}>Address</span>
                      <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 1, lineHeight: 1.3 }}>{order.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Worker Card */}
          {order.worker && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {order.worker.profile_photo ? (
                      <img
                        src={order.worker.profile_photo}
                        alt={order.worker.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.fallback-avatar-mobile')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-avatar-mobile w-full h-full flex items-center justify-center text-white font-extrabold text-[12px] bg-gradient-to-tr ' + order.worker.gradient;
                            fallback.innerText = order.worker.initials;
                            fallback.style.width = '100%';
                            fallback.style.height = '100%';
                            fallback.style.display = 'flex';
                            fallback.style.alignItems = 'center';
                            fallback.style.justifyContent = 'center';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: 12
                      }}>
                        {order.worker.initials}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>Worker</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#092040', marginTop: 1 }}>{order.worker.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
                      <Star size={10} fill="#FFB800" color="#FFB800" />
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: '#94A3B8' }}>
                        <span style={{ color: '#092040', fontWeight: 700 }}>{order.worker.rating}</span>
                        {' '}({order.worker.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#EAF4FC',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  onClick={() => {
                    const bId = order.booking_id || order.id || '';
                    const cleanId = bId.replace('#', '');
                    const wName = order.worker?.name || 'Worker';
                    const wId = order.rawData?.worker_pk_id || 101;
                    const sName = order.service || '';
                    const bDate = order.rawData?.booking_date || order.date || '';
                    const bLoc = order.address || '';
                    router.push(`/messages?booking_id=${cleanId}&worker_name=${encodeURIComponent(wName)}&worker_id=${wId}&service=${encodeURIComponent(sName)}&date=${encodeURIComponent(bDate)}&location=${encodeURIComponent(bLoc)}`);
                  }}
                >
                  <MessageSquare size={16} color="#137DC5" />
                </button>
              </div>

              {/* Worker Arrival Time Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#137DC5" />
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Worker Arrival Time</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 750, color: '#137DC5' }}>{durationAndDistanceStr}</span>
              </div>
            </div>
          )}

          {isCancelled && (
            <div style={{
              background: '#F0F7FD',
              borderRadius: 12,
              padding: '14px 16px',
              margin: '16px 16px 0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#E0EEFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Info size={14} color="#0D6EFD" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 550, color: '#334155', lineHeight: 1.3 }}>
                  You can easily pick a new time that works better for you.
                </span>
              </div>
              <button
                onClick={handleRescheduleClick}
                style={{
                  background: '#0D6EFD',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(13, 110, 253, 0.15)'
                }}
              >
                Reschedule
              </button>
            </div>
          )}

          {/* Timeline tracker */}
          {isInProgress && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
            }}>
              <div style={{ position: 'relative', paddingLeft: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: 14,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  borderLeft: '2px dashed #E2E8F0'
                }} />
                
                {/* Step 1: Bicycle */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    position: 'absolute',
                    left: -36,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#EAF4FC',
                    border: '1px solid #BEE0EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#137DC5'
                  }}>
                    <Bike size={16} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 750, color: '#092040' }}>Worker Started Travel</span>
                  <span style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: 'white',
                    background: '#0D6EFD',
                    padding: '4px 8px',
                    borderRadius: 12
                  }}>{durationAndDistanceStr}</span>
                </div>

                {/* Step 2: Car */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{
                    position: 'absolute',
                    left: -36,
                    top: 10,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#EAF4FC',
                    border: '1px solid #BEE0EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#137DC5'
                  }}>
                    <Car size={16} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 4 }}>Worker Started Travel</span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: '#94A3B8', marginTop: 2 }}>
                    {order?.worker?.dispatch_time ? formatTimeOnly(order.worker.dispatch_time) : '--:--'}
                  </span>
                </div>

                {/* Step 3: MapPin */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{
                    position: 'absolute',
                    left: -36,
                    top: 10,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8'
                  }}>
                    <MapPin size={16} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 750, color: '#94A3B8', marginTop: 4 }}>Estimated Arrival Time</span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: '#94A3B8', marginTop: 2 }}>{durationAndDistanceStr}</span>
                </div>

                {/* Step 4: Clock */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{
                    position: 'absolute',
                    left: -36,
                    top: 10,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8'
                  }}>
                    <Clock size={16} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 750, color: '#94A3B8', marginTop: 4 }}>Service Start Time (Estimated)</span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: '#94A3B8', marginTop: 2 }}>Today, {order.time}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Location Card */}
          {isInProgress && order.worker && order.worker.latitude && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12, color: '#092040', margin: '0 0 16px 0' }}>
                <Compass size={15} color="#137DC5" /> Live Location
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#EAF4FC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#137DC5'
                  }}>
                    <MapPin size={15} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>Worker Location</span>
                    <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 1 }}>
                      {parseFloat(order.worker.latitude).toFixed(5)}, {parseFloat(order.worker.longitude).toFixed(5)}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#E8F6EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#19A859'
                  }}>
                    <Home size={15} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 600 }}>Service Location</span>
                    <span style={{ fontSize: 11, fontWeight: 750, color: '#092040', marginTop: 1 }}>{order.address}</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Navigation size={14} color="#94A3B8" style={{ transform: 'rotate(45deg)' }} />
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Distance to Service</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 750, color: '#137DC5' }}>{durationAndDistanceStr}</span>
              </div>
            </div>
          )}

          {/* Service Details Section */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 16,
            margin: '12px 16px',
            border: '1px solid #F1F5F9',
            textAlign: 'left'
          }}>
            <h3 style={{ fontWeight: 800, fontSize: 12, color: '#092040', marginBottom: 12 }}>
              Service Details
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base Price ({order?.booking_hours || 1} Hour{(order?.booking_hours || 1) > 1 ? 's' : ''})</span>
                <span style={{ color: '#092040', fontWeight: 750 }}>{formatEuro(basePriceNum)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>Extra Work Hours</span>
                <span style={{ flex: 1, textAlign: 'center', color: '#94A3B8' }}>{activeExtraHours} Hours</span>
                <span style={{ flex: 1, textAlign: 'right', color: '#092040', fontWeight: 750 }}>{formatEuro(extraHoursAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Materials Fee</span>
                <span style={{ color: '#092040', fontWeight: 750 }}>{order?.pricing?.materialsFee || '€0.00'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Extra Charges</span>
                <span style={{ color: '#092040', fontWeight: 750 }}>{order?.pricing?.extraChargesActual || '€0.00'}</span>
              </div>

              <div style={{ borderTop: '1px dashed #E2E8F0', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#092040', fontWeight: 800, fontSize: 13 }}>
                <span>Total Amount</span>
                <span>{formatEuro(totalAmountNum)}</span>
              </div>
            </div>
          </div>

          {/* Add Hours Banner */}
          {isInProgress && (
            <div style={{
              background: '#F0F7FF',
              borderRadius: 12,
              padding: 12,
              margin: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
                <Info size={16} color="#0D6EFD" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#0D6EFD', lineHeight: 1.3 }}>
                    Extra workhours will be charged as per hourly rate.
                  </span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#0D6EFD' }}>
                    Hourly Rate: {formatEuro(ratePerHour)}/Hour
                  </span>
                </div>
              </div>
              
              {!(order?.pendingExtraHours > 0) && addHoursStatus !== 'pending' && !(pendingNum > 0 && activeExtraHours > 0) && (
                <button
                  onClick={() => setIsAddHoursModalOpen(true)}
                  style={{
                    background: '#0D6EFD',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontWeight: 700,
                    fontSize: 10,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add Hours
                </button>
              )}
            </div>
          )}

          {/* Extra Work Hours Detail Box */}
          {(isCompleted || isInProgress || isPending) && activeExtraHours > 0 && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Clock size={16} color="#137DC5" />
                <h3 style={{ fontWeight: 800, fontSize: 11, color: '#092040', margin: 0 }}>
                  Extra Work Hours Detail
                </h3>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>Extra Hours</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#092040' }}>{activeExtraHours} Hours</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>Hourly Rate</span>
                    <span style={{ fontSize: 11, fontWeight: 750, color: '#092040' }}>{formatEuro(ratePerHour)}</span>
                  </div>
                </div>

                <div style={{ width: 1, height: 32, background: '#E2E8F0', margin: '0 16px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                  <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>Extra Hours Amount</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#092040', marginTop: 2 }}>{formatEuro(extraHoursAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary Box */}
          {!isPending && addHoursStatus === 'approved' && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
            }}>
              <h3 style={{ fontWeight: 800, fontSize: 12, color: '#092040', margin: '0 0 12px 0' }}>
                Payment Summary
              </h3>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginTop: 2 }}>{formatEuro(totalAmountNum)}</span>
                </div>
                <div style={{ width: 1, height: 28, background: '#E2E8F0', margin: '0 12px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Already Paid</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#092040', marginTop: 2 }}>{formatEuro(paidNum)}</span>
                </div>
                <div style={{ width: 1, height: 28, background: '#E2E8F0', margin: '0 12px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 8.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Pending Amount</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#137DC5', marginTop: 2 }}>{formatEuro(pendingNum)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cleaning Materials Required Card (Mobile) */}
          {order?.materials && order.materials.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 16,
              margin: '12px 16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(9, 32, 64, 0.04)'
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 12, color: '#092040', margin: '0 0 16px 0' }}>
                <ShoppingBag size={16} color="#137DC5" /> Cleaning Materials Required
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {order.materials.map((mat) => (
                  <div key={mat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #F1F5F9', paddingBottom: 10, marginBottom: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>{mat.name}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 750, color: '#137DC5' }}>Yes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '16px',
          borderTop: '1px solid #F1F5F9',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.03)',
          zIndex: 100
        }}>
          {currentStatus === 'Completed' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={handleDownloadPDF}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  color: '#092040',
                  fontWeight: 600,
                  fontSize: 12,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Download PDF
              </button>
              <button 
                onClick={() => router.push(`/orders/${(rawId || '').toLowerCase()}/review`)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0D6EFD',
                  borderRadius: 6,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Write Review
              </button>
            </div>
          )}

          {isInProgress && (
            <>
              {(order?.pendingExtraHours > 0 || addHoursStatus === 'pending') ? (
                <div style={{
                  width: '100%',
                  padding: '14px',
                  background: '#A7F3D0',
                  border: '1px solid #10B981',
                  borderRadius: 12,
                  color: '#065F46',
                  fontWeight: 750,
                  fontSize: 12,
                  textAlign: 'center',
                  lineHeight: 1.5
                }}>
                  Your Extra Hour Request Submitted.<br />
                  Please wait for Worker Approval.
                </div>
              ) : (pendingNum > 0 && (activeExtraHours > 0 || order?.extraHoursDetail || addHoursStatus === 'approved')) ? (
                <button 
                  onClick={handlePay}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0D6EFD',
                    borderRadius: 12,
                    color: 'white',
                    fontWeight: 750,
                    fontSize: 13,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span>Pay {formatEuro(pendingNum)}</span>
                </button>
              ) : (
                <button 
                  onClick={() => alert('Order verified!')}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0D6EFD',
                    borderRadius: 12,
                    color: 'white',
                    fontWeight: 750,
                    fontSize: 13,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span>Verify</span>
                </button>
              )}
            </>
          )}

          {/* Sticky Bottom Spacing placeholder */}
          <div style={{ height: 10 }}></div>

          {isCancelled && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => router.push('/dashboard/orders')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 10,
                  color: '#092040',
                  fontWeight: 700,
                  fontSize: 12,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
              <button 
                onClick={handleRescheduleClick}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#0D6EFD',
                  borderRadius: 10,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(13,110,253,0.2)'
                }}
              >
                Reschedule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Extra Hours Modal Component */}
      {isAddHoursModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Close Button */}
            <button 
              onClick={() => setIsAddHoursModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Title */}
            <h3 className="font-display font-extrabold text-[18px] text-[#092040] mb-1">
              Add Extra Hours
            </h3>
            
            {/* Subtitle */}
            <p className="font-sans text-[12.5px] text-slate-400 font-semibold mb-5">
              Please ask with worker before request.
            </p>
            
            {/* Dropdown */}
            <div className="relative mb-6">
              <select 
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
                style={{
                  color: selectedHours === '' ? '#94A3B8' : '#092040'
                }}
                className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-slate-350 focus:border-[#137DC5] rounded-xl font-sans text-[14px] font-bold focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="" disabled>Select hours</option>
                <option value="1">1 Hour(s)</option>
                <option value="2">2 Hour(s)</option>
                <option value="3">3 Hour(s)</option>
                <option value="4">4 Hour(s)</option>
                <option value="5">5 Hour(s)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Action Button */}
            <button 
              onClick={async () => {
                if (!selectedHours) return;
                const hoursVal = parseInt(selectedHours, 10);
                const booking_id = order?.bookingPrimaryId || rawId;
                
                setIsAddingHours(true);
                try {
                  const response = await authApi.addExtraHours(booking_id, hoursVal);
                  if (response.status) {
                    setExtraHoursCount(hoursVal);
                    setAddHoursStatus('pending');
                    setIsAddHoursModalOpen(false);
                    // Refresh order details from the backend
                    await fetchOrderDetails();
                  } else {
                    alert(response.message || 'Failed to request extra hours. Please try again.');
                  }
                } catch (err) {
                  alert(err.message || 'Something went wrong while adding hours.');
                } finally {
                  setIsAddingHours(false);
                }
              }}
              disabled={isAddingHours || !selectedHours}
              className={`w-full py-3 text-white font-sans font-bold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isAddingHours || !selectedHours
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-[#137DC5] hover:bg-[#137DC5]/90 cursor-pointer'
              }`}
            >
              {isAddingHours ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting...</span>
                </>
              ) : (
                <span>Add Hours</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reschedule/Reassign Worker Modal overlay */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-[#092040]/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsRescheduleModalOpen(false)}
              className="absolute right-5 top-5 p-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Title */}
            <h3 className="font-display font-extrabold text-[18px] text-[#092040] mb-1 text-left">
              Reschedule & Reassign Worker
            </h3>
            
            {/* Subtitle */}
            <p className="font-sans text-[12.5px] text-slate-450 font-semibold mb-4 text-left">
              Select a new verified professional to assign to this booking.
            </p>
            
            {/* Workers List Container */}
            <div className="flex-grow overflow-y-auto pr-1 my-2 flex flex-col gap-2.5 min-h-[220px]">
              {isWorkersLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center gap-2.5">
                  <RefreshCw className="w-6 h-6 text-[#137DC5] animate-spin" />
                  <span className="font-sans font-bold text-slate-400 text-[12.5px]">Fetching team members...</span>
                </div>
              ) : rescheduleError ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                  <span className="font-sans text-xs text-red-500 font-semibold">{rescheduleError}</span>
                  <button
                    onClick={handleReschedule}
                    className="mt-2.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-sans font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : modalWorkers.length > 0 ? (
                modalWorkers.map((w) => {
                  const isSelected = selectedRescheduleWorkerId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedRescheduleWorkerId(w.id)}
                      className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#137DC5] bg-[#137DC5]/5 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        {w.photo ? (
                          <img
                            src={w.photo}
                            alt={w.name}
                            className="w-11 h-11 rounded-full object-cover object-top border border-slate-100 shadow-sm"
                          />
                        ) : (
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${w.gradient} flex items-center justify-center text-white font-extrabold text-[12.5px] shadow-sm`}>
                            {w.initials}
                          </div>
                        )}
                        
                        {/* Info */}
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans font-extrabold text-[13.5px] text-[#092040]">{w.name}</span>
                            {w.is_top_rated && (
                              <span className="text-[9px] font-bold bg-[#E6F4EA] text-[#137333] px-1.5 py-0.5 rounded-full">Top</span>
                            )}
                          </div>
                          <span className="font-sans text-[11px] text-slate-450 font-semibold block">{w.role}</span>
                          <div className="flex items-center gap-0.5 mt-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-sans font-bold text-[11px] text-slate-500">{w.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-slate-350 ml-0.5 font-semibold">({w.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 justify-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'border-[#137DC5] bg-[#137DC5]' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-grow flex items-center justify-center text-slate-400 font-sans text-xs animate-pulse">
                  No workers available.
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setIsRescheduleModalOpen(false)}
                className="py-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-550 font-sans font-bold text-[13.5px] rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedRescheduleWorkerId || isRescheduling}
                onClick={handleRescheduleConfirm}
                className={`py-3 text-white font-sans font-bold text-[13.5px] rounded-xl shadow-md transition-all cursor-pointer ${
                  (!selectedRescheduleWorkerId || isRescheduling)
                    ? 'bg-slate-300 shadow-none cursor-not-allowed'
                    : 'bg-[#137DC5] hover:bg-[#0C5F97]'
                }`}
              >
                {isRescheduling ? 'Rescheduling...' : 'Confirm'}
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Stripe Checkout Modal */}
      <StripePaymentModal
        isOpen={showStripeModal}
        clientSecret={stripeClientSecret}
        bookingData={paymentBookingData}
        onClose={() => {
          setShowStripeModal(false);
        }}
        onPaymentSuccess={async () => {
          setShowStripeModal(false);
          // Refresh order details from the backend
          await fetchOrderDetails();
          // Redirect to payment success page
          router.push(`/payment/success?service=${encodeURIComponent(order.service)}&amount=${pendingNum}&worker=${encodeURIComponent(order.worker?.name || '')}&booking_id=${order.booking_id}&datetime=${encodeURIComponent(order.date + ', ' + order.time)}`);
        }}
      />

    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

