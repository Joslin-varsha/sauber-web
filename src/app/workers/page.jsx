'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  MapPin,
  Clock,
  Star,
  Calendar,
  ChevronDown,
  Search,
  X,
  Info,
  Lock,
  Check,
  RefreshCw,
  Edit3,
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  UserCheck,
  Briefcase,
  MessageCircle,
  User,
  ShoppingBag,
} from 'lucide-react';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from '@/components/Footer';
import DashboardFooter from '@/components/DashboardFooter';
import { authApi } from '@/utils/api';
import { useLanguage } from '@/utils/LanguageContext';
import StripePaymentModal from '@/components/StripePaymentModal';

const convertTo24Hour = (time12h) => {
  if (!time12h) return '12:00';
  if (/^\d{2}:\d{2}$/.test(time12h)) return time12h;
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '12:00';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const convertTo12Hour = (time24h) => {
  if (!time24h) return '12:00 PM';
  if (/AM|PM$/i.test(time24h)) return time24h;
  const [hoursStr, minutesStr] = time24h.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
};

const convertToYYYYMMDD = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase().substring(0, 3)] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

const convertToDDMMMYYYY = (dateStr) => {
  if (!dateStr) return '24 May 2024';
  if (dateStr.includes(' ')) return dateStr;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const year = match[1];
  const monthIdx = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[monthIdx] || 'Jan';
  return `${day} ${month} ${year}`;
};

// Mock Workers list matching mockup
const initialWorkers = [
  {
    id: 'w1',
    name: 'Elisabeth',
    role: 'Home Cleaning Expert',
    rating: 4.9,
    reviews: 128,
    jobs: 120,
    location: 'Berlin, 10115',
    pincode: '10115',
    rate: 50.00,
    badge: 'Top Rated',
    initials: 'EL',
    gradient: 'from-emerald-400 to-teal-500',
    photo: '/workers/emma-wilson.png',
  },
  {
    id: 'w2',
    name: 'Katharina',
    role: 'Cleaning Specialist',
    rating: 4.9,
    reviews: 128,
    jobs: 80,
    location: 'Berlin, 10115',
    pincode: '10115',
    rate: 60.00,
    badge: null,
    initials: 'KA',
    gradient: 'from-blue-400 to-indigo-500',
    photo: '/workers/daniel-brown.png',
  },
  {
    id: 'w3',
    name: 'Magdalena',
    role: 'Home Cleaning Expert',
    rating: 4.9,
    reviews: 128,
    jobs: 650,
    location: 'Berlin, 10115',
    pincode: '10115',
    rate: 40.00,
    badge: null,
    initials: 'MA',
    gradient: 'from-purple-400 to-pink-500',
    photo: '/workers/sophia-muller.png',
  },
  {
    id: 'w4',
    name: 'Anneliese',
    role: 'Professional Cleaner',
    rating: 4.9,
    reviews: 128,
    jobs: 650,
    location: 'Berlin, 10115',
    pincode: '10115',
    rate: 40.00,
    badge: null,
    initials: 'AN',
    gradient: 'from-amber-400 to-rose-500',
    photo: '/workers/liam-johnson.png',
  },
  {
    id: 'w5',
    name: 'Wilhelmina',
    role: 'Cleaning Specialist',
    rating: 4.9,
    reviews: 128,
    jobs: 80,
    location: 'Berlin, 10115',
    pincode: '10115',
    rate: 40.00,
    badge: null,
    initials: 'WI',
    gradient: 'from-violet-400 to-purple-500',
    photo: '/workers/olivia-taylor.png',
  },
];

function WorkerAvatar({ worker, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-11 h-11' : 'w-14 h-14';
  const textSize = size === 'sm' ? 'text-[13px]' : 'text-[16px]';
  if (worker.photo) {
    return (
      <img
        src={worker.photo}
        alt={worker.name}
        className={`${sizeClass} rounded-full flex-shrink-0 object-cover object-top shadow-sm border-2 border-white`}
      />
    );
  }
  return (
    <div className={`${sizeClass} ${textSize} rounded-full flex-shrink-0 bg-gradient-to-br ${worker.gradient} flex items-center justify-center text-white font-display font-extrabold shadow-sm`}>
      {worker.initials}
    </div>
  );
}

// Mobile-only worker avatar (larger, circular with border)
function MobileWorkerAvatar({ worker }) {
  const [imgError, setImgError] = useState(false);
  if (worker.photo && !imgError) {
    return (
      <img
        src={worker.photo}
        alt={worker.name}
        onError={() => setImgError(true)}
        style={{
          width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
          border: '2px solid #E2E8F0', flexShrink: 0
        }}
      />
    );
  }
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, #4facfe, #00f2fe)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800, fontSize: 16, border: '2px solid #E2E8F0'
    }}>
      {worker.initials}
    </div>
  );
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < full ? '#FBBF24' : '#E2E8F0'}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return stars;
}

const formatDate = (dateStr) => {
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

const formatTimeRange = (timeStr) => {
  if (!timeStr) return '10:00AM-12:00PM';
  const timeMap = {
    '08:00AM': '08:00AM-10:00AM',
    '09:00AM': '09:00AM-11:00AM',
    '10:00AM': '10:00AM-12:00PM',
    '11:00AM': '11:00AM-01:00PM',
    '12:00PM': '12:00PM-02:00PM',
    '01:00PM': '01:00PM-03:00PM',
    '02:00PM': '02:00PM-04:00PM',
    '03:00PM': '03:00PM-05:00PM',
    '04:00PM': '04:00PM-06:00PM',
  };
  return timeMap[timeStr] || `${timeStr}-12:00PM`;
};

const mapBackendWorkerToUI = (w, index) => {
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
    id: w.id ? `w${w.id}` : `w${index + 1}`,
    worker_id: w.worker_id || null,
    name: w.name || 'Anonymous Worker',
    role: w.skill || '',
    rating: parseFloat(w.rating) || 0,
    reviews: parseInt(w.reviews_count, 0) || 0,
    jobs: parseInt(w.reviews_count, 0) || 0,
    location: w.location || '',
    pincode: w.pincode || '',
    rawLocation: w.location,
    rawPincode: w.pincode,
    rate: parseFloat(w.hourly_wage) || 0,
    badge: w.is_top_rated ? 'Top Rated' : null,
    initials,
    gradient,
    photo: w.profile_photo || null,
    languages: w.languages || '',
    distance_km: parseFloat(w.distance_km) || 0,
  };
};

function WorkersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tr } = useLanguage();

  const paramService = searchParams.get('service') || 'Home Cleaning';
  const paramDate = searchParams.get('date') || '12 May 2025';
  const paramRooms = searchParams.get('rooms') || '2';
  const paramLocation = searchParams.get('location') || '22.4th Cross, HSR Layout';

  // Custom carried-over query parameters
  const paramSqm = searchParams.get('sqm') || '120';
  const paramExpectedTime = searchParams.get('expected_time') || '2';
  const paramVacuum = searchParams.get('vacuum');
  const paramMaterialAmountIds = searchParams.get('material_amount_ids');
  const paramFrequency = searchParams.get('frequency');
  const paramNotes = searchParams.get('notes') || '';
  const paramBookingTime = searchParams.get('booking_time');

  // Workers API data state
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filterLocation, setFilterLocation] = useState(paramLocation);
  const [minRating, setMinRating] = useState('0.0');
  const [searchRadius, setSearchRadius] = useState(50);
  const [tempSearchRadius, setTempSearchRadius] = useState(15);
  const [tempMinRating, setTempMinRating] = useState('0.0');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Worker selection & sort
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [workerValidationError, setWorkerValidationError] = useState('');
  const [sortBy, setSortBy] = useState('Best Match');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [pricingSettings, setPricingSettings] = useState(null);
  const [dynamicMaterials, setDynamicMaterials] = useState([]);

  // Booking form
  const [vacuumRequired, setVacuumRequired] = useState(paramVacuum !== null ? paramVacuum === 'true' : false);
  const [selectedMaterials, setSelectedMaterials] = useState(() => {
    try {
      return paramMaterialAmountIds ? JSON.parse(paramMaterialAmountIds) : [];
    } catch(e) {
      return [];
    }
  });
  const [scheduleType, setScheduleType] = useState(paramFrequency || 'One Time');
  const [bookingDate, setBookingDate] = useState(paramDate);
  const [bookingTime, setBookingTime] = useState(paramBookingTime || '12:00 PM');
  const [notes, setNotes] = useState(paramNotes);

  // Dynamic scheduling states matching add-post
  const [isBiweekly, setIsBiweekly] = useState(searchParams.get('is_biweekly') === 'true');
  const [weeklySlots, setWeeklySlots] = useState(() => {
    const raw = searchParams.get('weekly_slots');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [{ day: 'Monday', time: '12:00 PM' }];
  });
  const [monthlySlots, setMonthlySlots] = useState(() => {
    const raw = searchParams.get('monthly_slots');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [{ date: '24 May 2024', time: '12:00 PM' }];
  });

  // Custom dropdown states for dynamically generated rows
  const [openWeeklyDayIndex, setOpenWeeklyDayIndex] = useState(null);
  const [openWeeklyTimeIndex, setOpenWeeklyTimeIndex] = useState(null);
  const [openMonthlyDateIndex, setOpenMonthlyDateIndex] = useState(null);
  const [openMonthlyTimeIndex, setOpenMonthlyTimeIndex] = useState(null);

  // States for Biweekly specific selections
  const [biweeklyDays, setBiweeklyDays] = useState(() => {
    const raw = searchParams.get('biweekly_days');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      day1: '1st Monday',
      day2: '3rd Tuesday',
      day3: '2nd Monday',
      day4: '4th Monday',
    };
  });
  const [biweeklyTimes, setBiweeklyTimes] = useState(() => {
    const raw = searchParams.get('biweekly_times');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      time1: '12:00 PM',
      time2: '05:00 PM',
    };
  });
  const [selectedLatitude, setSelectedLatitude] = useState(searchParams.get('latitude') || '');
  const [selectedLongitude, setSelectedLongitude] = useState(searchParams.get('longitude') || '');

  // Toggles for biweekly specific dropdown selects
  const [openBiweeklyDay, setOpenBiweeklyDay] = useState(null); // 'day1', 'day2', 'day3', 'day4'
  const [openBiweeklyTime, setOpenBiweeklyTime] = useState(null); // 'time1', 'time2'

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    setOpenWeeklyDayIndex(null);
    setOpenWeeklyTimeIndex(null);
    setOpenMonthlyDateIndex(null);
    setOpenMonthlyTimeIndex(null);
    setOpenBiweeklyDay(null);
    setOpenBiweeklyTime(null);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState(null);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [paymentBookingData, setPaymentBookingData] = useState(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Fetch workers from the backend API
  const fetchWorkers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.getWorkers({});
      if (response && response.status && Array.isArray(response.data)) {
        const mapped = response.data.map((w, index) => mapBackendWorkerToUI(w, index));
        setWorkers(mapped);
      } else {
        throw new Error(response?.message || 'Failed to fetch workers');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while fetching workers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('is_logged_in') === 'true';
      if (!loggedIn) {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirect_after_login', currentPath);
        router.push('/login');
        return;
      }
      setIsLoggedIn(true);
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;
    fetchWorkers();

    async function loadServices() {
      try {
        const res = await authApi.getServicesDropdown();
        if (res && res.data) {
          setServicesList(res.data);
        }
      } catch (err) {
        console.error('Failed to load services in workers page:', err);
      }
    }
    loadServices();

    async function loadPricingSettings() {
      try {
        const res = await authApi.getPricingSettings();
        if (res && res.data) {
          setPricingSettings(res.data);
        }
      } catch (err) {
        console.error('Failed to load pricing settings in workers page:', err);
      }
    }
    loadPricingSettings();
  }, [isAuthorized]);

  // Listen for location changes from map picker or header
  useEffect(() => {
    const syncLocation = () => {
      try {
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.location) {
            setFilterLocation(u.location);
          }
          if (u.latitude) {
            setSelectedLatitude(u.latitude.toString());
          }
          if (u.longitude) {
            setSelectedLongitude(u.longitude.toString());
          }
        }
      } catch (e) {}
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('locationChanged', syncLocation);
      syncLocation();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('locationChanged', syncLocation);
      }
    };
  }, []);

  // Restore pending booking when workers are successfully loaded
  useEffect(() => {
    if (workers.length > 0 && typeof window !== 'undefined') {
      const pendingWorkerId = sessionStorage.getItem('pending_booking_worker_id');
      if (pendingWorkerId) {
        const worker = pendingWorkerId === 'auto'
          ? { id: 'auto', name: 'Auto Assigned', initials: 'AA', gradient: 'from-blue-500 to-cyan-500' }
          : workers.find(w => w.id === pendingWorkerId);
        if (worker) {
          setSelectedWorker(worker);
          setShowBookingPanel(true);
          const vacuum = sessionStorage.getItem('pending_booking_vacuum');
          if (vacuum !== null) setVacuumRequired(vacuum === 'true');
          const schedule = sessionStorage.getItem('pending_booking_schedule');
          if (schedule) setScheduleType(schedule);
          const date = sessionStorage.getItem('pending_booking_date');
          if (date) setBookingDate(date);
          const time = sessionStorage.getItem('pending_booking_time');
          if (time) setBookingTime(time);
          const notesText = sessionStorage.getItem('pending_booking_notes');
          if (notesText) setNotes(notesText);
          const materialsRaw = sessionStorage.getItem('pending_booking_materials');
          if (materialsRaw) {
            try { setSelectedMaterials(JSON.parse(materialsRaw)); } catch (e) {}
          }
          const lat = sessionStorage.getItem('pending_booking_latitude');
          if (lat) setSelectedLatitude(lat);
          const lng = sessionStorage.getItem('pending_booking_longitude');
          if (lng) setSelectedLongitude(lng);
        }
        sessionStorage.removeItem('pending_booking_worker_id');
        sessionStorage.removeItem('pending_booking_vacuum');
        sessionStorage.removeItem('pending_booking_schedule');
        sessionStorage.removeItem('pending_booking_date');
        sessionStorage.removeItem('pending_booking_time');
        sessionStorage.removeItem('pending_booking_notes');
        sessionStorage.removeItem('pending_booking_materials');
        sessionStorage.removeItem('pending_booking_latitude');
        sessionStorage.removeItem('pending_booking_longitude');
      }
    }
  }, [workers]);

  useEffect(() => {
    async function loadMaterials() {
      const selectedServiceObj = servicesList.find(s => 
        s.name.toLowerCase().trim() === (paramService || '').toLowerCase().trim()
      );
      if (selectedServiceObj && selectedServiceObj.id) {
        try {
          const data = await authApi.getServiceMaterials(selectedServiceObj.id);
          if (data && data.data && data.data.materials) {
            setDynamicMaterials(data.data.materials);
          } else {
            setDynamicMaterials([]);
          }
        } catch (err) {
          console.error('Error fetching materials:', err);
          setDynamicMaterials([]);
        }
      }
    }
    if (servicesList.length > 0) {
      loadMaterials();
    }
  }, [paramService, servicesList]);

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

  const selectedServiceObj = servicesList.find(s => 
    s.name.toLowerCase().trim() === (paramService || '').toLowerCase().trim()
  );
  const hourlyPrice = selectedServiceObj ? parseFloat(selectedServiceObj.base_price) : (pricingSettings ? parseFloat(pricingSettings.base_price) : 100);
  const singleOccurrenceBaseCost = hourlyPrice * (parseFloat(paramExpectedTime) || 1);

  const vacuumCleanerVal = pricingSettings ? parseFloat(pricingSettings.vacuum_cleaner_amount) : 250.00;
  const vacuumExtra = vacuumRequired ? vacuumCleanerVal : 0.00;

  const currentMaterialsCost = selectedMaterials.reduce((total, matId) => {
    const mat = dynamicMaterials.find(m => m.id === matId);
    return total + (mat ? parseFloat(mat.amount || 0) : 0);
  }, 0);

  // Multiplier logic matching add-post
  let multiplier = 1;
  if (scheduleType === 'Daily') {
    multiplier = 7;
  } else if (scheduleType === 'Weekly') {
    if (isBiweekly) {
      multiplier = 2;
    } else {
      multiplier = weeklySlots ? weeklySlots.length : 1;
    }
  } else if (scheduleType === 'Monthly') {
    multiplier = monthlySlots ? monthlySlots.length : 1;
  }

  const estimatedPrice = (singleOccurrenceBaseCost + currentMaterialsCost + vacuumExtra) * multiplier;

  const filteredWorkers = workers.filter(worker => {
    const matchesRating = worker.rating >= parseFloat(minRating);
    const locFilter = (filterLocation || '').split(',')[0].trim().toLowerCase();
 
  
    const matchesLocation = !locFilter || 
      !worker.rawLocation || 
      (worker.location || '').toLowerCase().includes(locFilter);
    
    const matchesDistance = searchRadius === 50 || worker.distance_km <= searchRadius;
    
    return matchesRating && matchesLocation && matchesDistance;
  });

  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.rate - b.rate;
    if (sortBy === 'Price: High to Low') return b.rate - a.rate;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    return b.rating * b.reviews - a.rating * a.reviews;
  });

  const handleClearFilters = () => {
    setFilterLocation('Berlin, Germany');
    setMinRating('0.0');
    setSearchRadius(50);
    setTempSearchRadius(15);
    setTempMinRating('0.0');
  };

  const executeBooking = async (activeWorker) => {
    if (!activeWorker) return;
    
    setIsBookingLoading(true);
    try {
      // 1. Format frequency details according to schedule type
      let frequencyDetailsValue = null;
      if (scheduleType === 'One Time') {
        frequencyDetailsValue = { date: bookingDate, time: bookingTime };
      } else if (scheduleType === 'Weekly') {
        frequencyDetailsValue = weeklySlots;
      } else if (scheduleType === 'BiWeekly' || scheduleType === 'Biweekly') {
        frequencyDetailsValue = [
          { day: biweeklyDays.day1, time: biweeklyTimes.time1 },
          { day: biweeklyDays.day2, time: biweeklyTimes.time2 }
        ];
      } else if (scheduleType === 'Monthly') {
        frequencyDetailsValue = monthlySlots.map(slot => {
          let dateNum = slot.date;
          if (slot.date.includes(' ')) {
            const parts = slot.date.split(' ');
            dateNum = parts[0];
          }
          return { date: dateNum, time: slot.time };
        });
      }

      // 2. Format worker ID to int or 'auto'
      // The backend expects a numeric ID. activeWorker.worker_id might be a string like "WRK-123", 
      // causing a "NaN" SQL error on the backend. We extract the numeric ID from activeWorker.id (e.g. 'w15' -> 15).
      const parsedId = parseInt(activeWorker.id.replace('w', ''), 10);
      const workerIdVal = activeWorker.id === 'auto' 
        ? 'auto' 
        : (!isNaN(parsedId) ? parsedId : 15);

      // 3. Helper to format date as YYYY-MM-DD
      const formatBookingDateForAPI = (dateStr) => {
        if (!dateStr) return new Date().toISOString().split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        try {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
          }
        } catch(e) {}
        return dateStr;
      };

      const actualServiceId = selectedServiceObj ? selectedServiceObj.id.toString() : "1";

      const payload = {
        service_id: actualServiceId,
        service_type: paramService || "",
        service_address: filterLocation,
        worker_id: workerIdVal,
        booking_date: formatBookingDateForAPI(bookingDate),
        booking_time: bookingTime || "",
        rooms: parseInt(paramRooms, 10) || 0,
        area_sqm: paramSqm || "",
        material_amount_ids: selectedMaterials,
        vacuum_cleaner: vacuumRequired,
        frequency: scheduleType,
        frequency_details: frequencyDetailsValue,
        note: notes || "",
        expected_time: paramExpectedTime ? `${paramExpectedTime} Hours` : "2 Hours",
        latitude: selectedLatitude,
        longitude: selectedLongitude,
        grand_total: estimatedPrice,
        total_payable: estimatedPrice,
        estimated_cost: estimatedPrice,
        price: estimatedPrice,
        amount: estimatedPrice,
        total: estimatedPrice,
        is_biweekly: isBiweekly,
        biweekly_days: biweeklyDays,
        biweekly_times: biweeklyTimes,
        weekly_slots: weeklySlots,
        monthly_slots: monthlySlots
      };

      const response = await authApi.createOrder(payload);
      
      if (response.status && response.data) {
        const orderData = response.data;
        const totalAmount = estimatedPrice;
        
        const clientSecretVal = response.clientSecret || orderData.clientSecret;
        const paymentIntentIdVal = response.paymentIntentId || orderData.paymentIntentId;

        if (clientSecretVal) {
          setStripeClientSecret(clientSecretVal);
          setStripePaymentIntentId(paymentIntentIdVal);
          setPaymentBookingData({
            service_type: orderData.service_type || paramService,
            total_payable: totalAmount,
            worker_name: orderData.worker_name || activeWorker.name,
            booking_id: orderData.booking_id,
            booking_date: orderData.booking_date,
            booking_time: orderData.booking_time
          });
          setShowStripeModal(true);
        } else {
          // If no client secret is provided, bypass and go straight to success page
          router.push(`/payment/success?service=${encodeURIComponent(orderData.service_type || paramService)}&amount=${totalAmount}&worker=${encodeURIComponent(orderData.worker_name || activeWorker.name)}&booking_id=${orderData.booking_id}&datetime=${encodeURIComponent(orderData.booking_date + ', ' + orderData.booking_time)}`);
        }
      } else {
        throw new Error(response.message || 'Booking creation failed');
      }
    } catch (err) {
      alert(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!selectedWorker) return;
    if (isBookingLoading) return;
    if (sessionStorage.getItem('is_logged_in') !== 'true') {
      sessionStorage.setItem('pending_booking_worker_id', selectedWorker.id);
      sessionStorage.setItem('pending_booking_vacuum', vacuumRequired ? 'true' : 'false');
      sessionStorage.setItem('pending_booking_materials', JSON.stringify(selectedMaterials));
      sessionStorage.setItem('pending_booking_schedule', scheduleType);
      sessionStorage.setItem('pending_booking_date', bookingDate);
      sessionStorage.setItem('pending_booking_time', bookingTime);
      sessionStorage.setItem('pending_booking_notes', notes);
      sessionStorage.setItem('pending_booking_latitude', selectedLatitude);
      sessionStorage.setItem('pending_booking_longitude', selectedLongitude);
      sessionStorage.setItem('redirect_after_login', '/workers');
      router.push('/login');
      return;
    }
    executeBooking(selectedWorker);
  };

  const handleMobileBottomNav = (tab) => {
    setMobileBottomTab(tab);
    if (tab === 'home') {
      if (typeof window !== 'undefined') sessionStorage.setItem('mobileActiveTab', 'home');
      router.push('/profile');
    } else if (tab === 'messages') {
      if (typeof window !== 'undefined') sessionStorage.setItem('mobileActiveTab', 'messages');
      router.push('/profile');
    } else if (tab === 'profile') {
      if (typeof window !== 'undefined') sessionStorage.setItem('mobileActiveTab', 'profile');
      router.push('/profile');
    } else if (tab === 'orders') {
      router.push('/orders');
    }
  };

  console.log("DEBUG [Workers]: selectedWorker =", selectedWorker);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">

      {/* ================================================================ */}
      <div className="flex flex-col md:hidden min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
        {showBookingPanel ? (
          /* ── JOB SUMMARY MOBILE VIEW ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAFC', paddingBottom: 110 }}>
            
            {/* Solid Blue Header */}
            <div style={{
              background: '#0D6EFD',
              padding: '20px 20px 24px',
              position: 'sticky',
              top: 0,
              zIndex: 50,
              boxShadow: '0 2px 10px rgba(13,110,253,0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={() => {
                    setShowBookingPanel(false);
                    setSelectedWorker(null);
                  }}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'white',
                    border: 'none', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    flexShrink: 0
                  }}
                >
                  <ArrowLeft size={18} color="#0D6EFD" />
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{ color: 'white', fontSize: 16, fontWeight: 800, letterSpacing: -0.3, display: 'block' }}>
                    Job Summary
                  </span>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10.5, fontWeight: 550, margin: '2px 0 0', lineHeight: 1.25 }}>
                    Review employee details and confirm your booking
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Contents */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

              {/* Service details card */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '12px',
                marginBottom: 16,
                boxShadow: '0 4px 15px rgba(9,32,64,0.04)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#E8F3FD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShoppingBag size={18} color="#0D6EFD" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 13.5, color: '#092040', margin: 0 }}>{paramService}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <MapPin size={11} color="#0D6EFD" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {paramLocation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Calendar size={11} color="#0D6EFD" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 550 }}>
                      {paramDate} • {convertTo12Hour(bookingTime)}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/add-post?${searchParams.toString()}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 8,
                    color: '#0D6EFD',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    flexShrink: 0, textDecoration: 'none'
                  }}
                >
                  Change
                  <Edit3 size={11} color="#0D6EFD" />
                </Link>
              </div>
                            {/* Section Heading: Employee Details */}
              {selectedWorker && selectedWorker.id !== 'auto' && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: 0 }}>Employee Details</p>
                  </div>

                  {/* Employee Details Card */}
                  <div style={{
                    background: 'white',
                    borderRadius: 16,
                    padding: '12px',
                    marginBottom: 20,
                    boxShadow: '0 4px 15px rgba(9,32,64,0.04)',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <MobileWorkerAvatar worker={selectedWorker || sortedWorkers[0] || initialWorkers[0]} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: 13.5, color: '#092040' }}>
                            {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).name}
                          </span>
                          {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).badge && (
                            <span style={{
                              fontSize: 8.5, fontWeight: 700,
                              background: '#E6F4EA', color: '#137333',
                              padding: '2px 6px', borderRadius: 12,
                              textTransform: 'capitalize'
                            }}>
                              {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).badge}
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <Star size={11} fill="#FFB800" stroke="none" />
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#092040' }}>
                            {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).rating.toFixed(1)}
                          </span>
                          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
                            ({(selectedWorker || sortedWorkers[0] || initialWorkers[0]).reviews} Reviews)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Briefcase size={10} color="#64748B" />
                            <span style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>
                              {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).jobs}+ Jobs
                            </span>
                          </div>
                          {((selectedWorker || sortedWorkers[0] || initialWorkers[0]).languages) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                              </svg>
                              <span style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>
                                {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).languages}
                              </span>
                            </div>
                          )}
                        </div>

                        {((selectedWorker || sortedWorkers[0] || initialWorkers[0]).role) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{
                              background: '#E8F3FD', color: '#0D6EFD',
                              fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6
                            }}>
                              {(selectedWorker || sortedWorkers[0] || initialWorkers[0]).role}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
                    </div>

                    <div style={{ height: 1, background: '#F1F5F9', marginTop: 4 }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, width: '100%', marginTop: 2 }}>
                      {[
                        'ID Verified',
                        'Trained Professional',
                        'Background Verified'
                      ].map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#137333', fontSize: '9px', fontWeight: 650, whiteSpace: 'nowrap' }}>
                          <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1px solid #137333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Check size={8} color="#137333" strokeWidth={4} />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Section Heading: Job & Schedule */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: 0 }}>Job & Schedule</p>
              </div>

              {/* Job & Schedule Timeline Card */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '12px',
                marginBottom: 20,
                boxShadow: '0 4px 15px rgba(9,32,64,0.04)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              }}>
                {[
                  {
                    label: 'Service',
                    value: <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 650 }}>{paramService}</span>,
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    )
                  },
                  {
                    label: 'Frequency',
                    value: (
                      <div>
                        <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 650, display: 'block' }}>
                          {scheduleType === 'Weekly' ? 'Weekly' : scheduleType}
                        </span>
                        {scheduleType === 'Weekly' && (
                          <span style={{ fontSize: 10.5, color: '#0D6EFD', fontWeight: 700, display: 'block', marginTop: 1 }}>
                            (Every Monday)
                          </span>
                        )}
                      </div>
                    ),
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    )
                  },
                  {
                    label: 'Start Date',
                    value: <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 650 }}>{formatDate(bookingDate)}</span>,
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    )
                  },
                  {
                    label: 'Time',
                    value: <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 650 }}>{convertTo12Hour(bookingTime)}</span>,
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Left Column: Icon + Label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 120, flexShrink: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#E8F3FD', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 12.5, color: '#092040', fontWeight: 800 }}>
                        {item.label}
                      </span>
                    </div>

                    {/* Middle Column: Dotted line and dot */}
                    <div style={{ width: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        position: 'absolute',
                        top: idx === 0 ? '50%' : 0,
                        bottom: idx === 3 ? '50%' : 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        borderLeft: '2px dotted #CBD5E1',
                        zIndex: 1
                      }} />
                      <div style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#CBD5E1',
                        border: '1.5px solid white',
                        zIndex: 2,
                        boxShadow: '0 0 0 2px white'
                      }} />
                    </div>

                    {/* Right Column: Value */}
                    <div style={{ flex: 1, paddingLeft: 8 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Heading: Price Details */}
              <div id="price-details-section" style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: 0 }}>Price Details</p>
              </div>

              {/* Price Details Card */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '12px',
                marginBottom: 20,
                boxShadow: '0 4px 15px rgba(9,32,64,0.04)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#64748B', fontWeight: 550 }}>Service Charge</span>
                  <span style={{ fontSize: 13, color: '#092040', fontWeight: 800 }}>
                    €{estimatedPrice.toFixed(0)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 550 }}>Platform Fee</span>
                    <Info size={13} color="#94A3B8" />
                  </div>
                  <span style={{ fontSize: 13, color: '#092040', fontWeight: 800 }}>€0</span>
                </div>
                
                <div style={{ height: 1, background: '#F1F5F9' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#092040', fontWeight: 800 }}>Total Payable</span>
                  <span style={{ fontSize: 15, color: '#0D6EFD', fontWeight: 800 }}>
                    €{estimatedPrice.toFixed(0)}
                  </span>
                </div>
              </div>

            </div>

            {/* Sticky Bottom Bar for Job Summary */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderTop: '1px solid #E2E8F0',
              padding: '10px 16px 24px',
              zIndex: 60,
              boxShadow: '0 -4px 20px rgba(9,32,64,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Text Section */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 550 }}>
                      Total Payable
                    </span>
                    <Info size={11} color="#94A3B8" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 1 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: '#0D6EFD', lineHeight: 1.1 }}>
                      €{estimatedPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={isBookingLoading}
                onClick={(e) => {
                  e.preventDefault();
                  if (isBookingLoading) return;
                  const activeWorker = selectedWorker || sortedWorkers[0] || initialWorkers[0];
                  if (sessionStorage.getItem('is_logged_in') !== 'true') {
                    sessionStorage.setItem('pending_booking_worker_id', activeWorker.id);
                    sessionStorage.setItem('pending_booking_vacuum', vacuumRequired ? 'true' : 'false');
                    sessionStorage.setItem('pending_booking_materials', JSON.stringify(selectedMaterials));
                    sessionStorage.setItem('pending_booking_schedule', scheduleType);
                    sessionStorage.setItem('pending_booking_date', bookingDate);
                    sessionStorage.setItem('pending_booking_time', bookingTime);
                    sessionStorage.setItem('pending_booking_notes', notes);
                    sessionStorage.setItem('pending_booking_latitude', selectedLatitude);
                    sessionStorage.setItem('pending_booking_longitude', selectedLongitude);
                    sessionStorage.setItem('redirect_after_login', '/workers');
                    router.push('/login');
                    return;
                  }
                  executeBooking(activeWorker);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 12,
                  background: isBookingLoading ? '#94A3B8' : '#0D6EFD',
                  border: 'none', color: 'white',
                  fontSize: 13, fontWeight: 700, cursor: isBookingLoading ? 'not-allowed' : 'pointer',
                  boxShadow: isBookingLoading ? 'none' : '0 4px 14px rgba(13,110,253,0.2)',
                  transition: 'transform 0.1s'
                }}
              >
                {isBookingLoading ? 'Confirming...' : 'Continue'}
                {!isBookingLoading && <ChevronRight size={14} color="white" strokeWidth={3} />}
              </button>
            </div>
          </div>
        ) : (
          /* ── AVAILABLE WORKERS LIST MOBILE VIEW ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* ── Blue Header ── */}
            <div style={{
              background: '#0D6EFD',
              padding: '16px 20px 20px',
              position: 'sticky',
              top: 0,
              zIndex: 50,
              boxShadow: '0 2px 10px rgba(13,110,253,0.12)'
            }}>
              {/* Top row: back + title + filters */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && sessionStorage.getItem('is_logged_in') === 'true') {
                        sessionStorage.setItem('mobileActiveTab', 'home');
                        router.push('/profile');
                      } else {
                        router.push('/');
                      }
                    }}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'white',
                      border: 'none', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    <ArrowLeft size={18} color="#0D6EFD" />
                  </button>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ color: 'white', fontSize: 16, fontWeight: 800, letterSpacing: -0.3, display: 'block' }}>
                      Select Worker
                    </span>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10.5, fontWeight: 500, margin: '2px 0 0' }}>
                      Choose a worker for your job
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTempSearchRadius(searchRadius);
                    setTempMinRating(minRating);
                    setShowFilterModal(true);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 11.5,
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <SlidersHorizontal size={13} color="white" strokeWidth={2.5} />
                  Filters
                </button>
              </div>
            </div>

            {/* Main scrolling body */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC', paddingBottom: 120 }}>
              
              {/* Service summary card */}
              <div style={{
                background: 'white',
                borderRadius: 16,
                padding: '12px',
                margin: '16px 16px 20px',
                boxShadow: '0 4px 15px rgba(9,32,64,0.04)',
                border: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                {/* Icon container */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#E8F3FD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShoppingBag size={18} color="#0D6EFD" />
                </div>
                {/* Info details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 13.5, color: '#092040', margin: 0 }}>{paramService}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <MapPin size={11} color="#0D6EFD" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {paramLocation}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Calendar size={11} color="#0D6EFD" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 550 }}>
                      {paramDate} • 10:00 AM-12:00 PM
                    </span>
                  </div>
                </div>
                {/* Change link */}
                <Link
                  href={`/add-post?${searchParams.toString()}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 8,
                    color: '#0D6EFD',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    flexShrink: 0, textDecoration: 'none'
                  }}
                >
                  Change
                  <Edit3 size={11} color="#0D6EFD" />
                </Link>
              </div>

              {isLoading ? (
                <div style={{ padding: '0 16px' }}>
                  <div style={{ padding: '0 4px', marginBottom: 16 }}>
                    <div style={{ height: 18, backgroundColor: '#E2E8F0', borderRadius: 4, width: '40%', marginBottom: 6 }} className="animate-pulse" />
                    <div style={{ height: 12, backgroundColor: '#E2E8F0', borderRadius: 4, width: '60%' }} className="animate-pulse" />
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      background: 'white',
                      borderRadius: 16,
                      padding: '16px',
                      marginBottom: 12,
                      border: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      opacity: 0.75,
                      animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 14, backgroundColor: '#E2E8F0', borderRadius: 4, width: '65%', marginBottom: 8 }} />
                        <div style={{ height: 11, backgroundColor: '#E2E8F0', borderRadius: 4, width: '45%', marginBottom: 6 }} />
                        <div style={{ height: 11, backgroundColor: '#E2E8F0', borderRadius: 4, width: '55%' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                        <div style={{ height: 16, backgroundColor: '#E2E8F0', borderRadius: 4, width: 40 }} />
                        <div style={{ height: 30, backgroundColor: '#E2E8F0', borderRadius: 8, width: 65 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: 16,
                  padding: '24px 16px',
                  margin: '20px 16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Info size={24} color="#DC2626" />
                  </div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: '#991B1B', margin: 0 }}>Unable to load workers</p>
                  <p style={{ fontSize: 12.5, color: '#B91C1C', marginTop: 4, marginHorizontal: 0, marginBottom: 16 }}>{error}</p>
                  <button
                    onClick={fetchWorkers}
                    style={{
                      padding: '10px 24px', borderRadius: 10,
                      background: '#DC2626', border: 'none', color: 'white',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(220,38,38,0.2)'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Section heading */}
                  <div style={{ padding: '0 20px', marginBottom: 16 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: 0 }}>Available Workers</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, margin: '2px 0 0' }}>
                      Top rated professionals near you
                    </p>
                  </div>

                  {/* Workers list container */}
                  <div style={{ padding: '0 16px' }}>
                    {sortedWorkers.map((worker, idx) => {
                      const isSelected = selectedWorker && selectedWorker.id === worker.id;
                      return (
                        <div
                          key={worker.id}
                          style={{
                            background: 'white',
                            borderRadius: 16,
                            padding: '12px',
                            marginBottom: 12,
                            boxShadow: '0 2px 8px rgba(9,32,64,0.03)',
                            border: isSelected ? '2px solid #0D6EFD' : '1px solid #F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            position: 'relative'
                          }}
                        >
                          {/* Avatar */}
                          <MobileWorkerAvatar worker={worker} />

                          {/* Worker details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontWeight: 800, fontSize: 13.5, color: '#092040' }}>{worker.name}</span>
                              {/* Top Rated Badge */}
                              {worker.badge && (
                                <span style={{
                                  fontSize: 8.5, fontWeight: 700,
                                  background: '#E6F4EA', color: '#137333',
                                  padding: '2px 6px', borderRadius: 12,
                                  border: 'none',
                                  textTransform: 'capitalize'
                                }}>
                                  {worker.badge}
                                </span>
                              )}
                            </div>

                            {/* Stars & Reviews */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                              <Star size={11} fill="#FFB800" stroke="none" />
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#092040' }}>{worker.rating.toFixed(1)}</span>
                              <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 550 }}>({worker.reviews} Reviews)</span>
                            </div>

                            {/* Briefcase & Jobs */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Briefcase size={10} color="#94A3B8" />
                              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 550 }}>
                                {worker.jobs}+ Jobs
                              </span>
                            </div>
                          </div>

                          {/* Pricing and Select Button */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>


                            <button
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedWorker(null);
                                  setShowBookingPanel(false);
                                } else {
                                  setSelectedWorker(worker);
                                  setShowBookingPanel(true);
                                  setWorkerValidationError('');
                                }
                              }}
                              style={{
                                padding: '6px 16px',
                                borderRadius: 10,
                                border: isSelected ? 'none' : '1.5px solid #0D6EFD',
                                background: isSelected ? '#10B981' : 'white',
                                color: isSelected ? 'white' : '#0D6EFD',
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease-in-out',
                                boxShadow: isSelected ? '0 4px 10px rgba(16,185,129,0.2)' : 'none'
                              }}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {sortedWorkers.length === 0 && (
                      <div style={{ background: 'white', border: '1px solid #F1F5F9', borderRadius: 16, padding: '32px 16px', textAlign: 'center', marginBottom: 12 }}>
                        <p style={{ fontWeight: 800, fontSize: 14, color: '#092040', margin: 0 }}>No workers match your filters</p>
                        <p style={{ fontSize: 12, color: '#64748B', marginTop: 4, margin: 0 }}>Try adjusting your location or rating filters.</p>
                      </div>
                    )}

                    {/* Can't find the right one card */}
                    <div style={{
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: 16,
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 16
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: 'white',
                        display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D6EFD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 'auto' }}>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 800, fontSize: 12.5, color: '#092040', margin: 0 }}>Can't find the right one?</p>
                        <p style={{ fontSize: 10.5, color: '#64748B', fontWeight: 500, margin: '2px 0 0', lineHeight: 1.3 }}>
                          We'll assign the best available worker for you.
                        </p>
                      </div>
                      <button
                        disabled={isBookingLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          if (isBookingLoading) return;
                          if (sessionStorage.getItem('is_logged_in') !== 'true') {
                            sessionStorage.setItem('pending_booking_worker_id', 'auto');
                            sessionStorage.setItem('pending_booking_vacuum', vacuumRequired ? 'true' : 'false');
                            sessionStorage.setItem('pending_booking_materials', JSON.stringify(selectedMaterials));
                            sessionStorage.setItem('pending_booking_schedule', scheduleType);
                            sessionStorage.setItem('pending_booking_date', bookingDate);
                            sessionStorage.setItem('pending_booking_time', bookingTime);
                            sessionStorage.setItem('pending_booking_notes', notes);
                            sessionStorage.setItem('pending_booking_latitude', selectedLatitude);
                            sessionStorage.setItem('pending_booking_longitude', selectedLongitude);
                            sessionStorage.setItem('redirect_after_login', '/workers');
                            router.push('/login');
                            return;
                          }
                          setSelectedWorker({ id: 'auto', name: 'Auto Assigned', initials: 'AA', gradient: 'from-blue-500 to-cyan-500' });
                          setShowBookingPanel(true);
                        }}
                        style={{
                          padding: '7px 12px', borderRadius: 10,
                          background: isBookingLoading ? '#94A3B8' : '#0D6EFD', border: 'none',
                          color: 'white', fontSize: 10.5, fontWeight: 700,
                          cursor: isBookingLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                          boxShadow: isBookingLoading ? 'none' : '0 3px 8px rgba(13,110,253,0.2)'
                        }}
                      >
                        {isBookingLoading ? 'Processing...' : 'Auto Assign'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

             {!isLoading && !error && sortedWorkers.length > 0 && (
              <>
                {workerValidationError && (
                  <div style={{
                    position: 'fixed',
                    bottom: 80, left: 16, right: 16,
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#DC2626',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    zIndex: 55,
                    boxShadow: '0 4px 12px rgba(220,38,38,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <Info size={14} color="#DC2626" />
                    <span>{workerValidationError}</span>
                  </div>
                )}
                <div style={{
                  position: 'fixed',
                  bottom: 0, left: 0, right: 0,
                  background: 'white',
                  borderTop: '1px solid #E2E8F0',
                  padding: '10px 16px 24px',
                  zIndex: 60,
                  boxShadow: '0 -4px 20px rgba(9,32,64,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Text Section */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 550 }}>
                          Estimated Cost
                        </span>
                        <Info size={11} color="#94A3B8" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 1 }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: '#0D6EFD', lineHeight: 1.1 }}>
                          €{estimatedPrice.toFixed(0)}
                        </span>
                        <div 
                          onClick={() => {
                            if (!selectedWorker) {
                              setWorkerValidationError('Please select a worker or click Auto Assign to continue.');
                              return;
                            }
                            setWorkerValidationError('');
                            setShowBookingPanel(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                        >
                          <span style={{ fontSize: 10.5, color: '#0D6EFD', fontWeight: 600 }}>
                            View Details
                          </span>
                          <ChevronDown size={12} color="#0D6EFD" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue button */}
                  <button
                    onClick={() => {
                      if (!selectedWorker) {
                        setWorkerValidationError('Please select a worker or click Auto Assign to continue.');
                        return;
                      }
                      setWorkerValidationError('');
                      setShowBookingPanel(true);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '10px 24px', borderRadius: 12,
                      background: '#0D6EFD',
                      border: 'none', color: 'white',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(13,110,253,0.2)',
                      transition: 'transform 0.1s'
                    }}
                  >
                    Continue
                    <ChevronRight size={14} color="white" strokeWidth={3} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Mobile Filters Bottom Sheet Modal */}
        {showFilterModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Styles for animation */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}} />

            {/* Transparent click-to-close overlay background */}
            <div 
              onClick={() => setShowFilterModal(false)}
              style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            />

            {/* Bottom Sheet Panel */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              background: 'white',
              width: '100%',
              maxWidth: 500,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: '24px 20px 32px',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Top Indicator handle bar */}
              <div style={{
                width: 44,
                height: 4.5,
                background: '#E2E8F0',
                borderRadius: 3,
                margin: '0 auto -4px',
                opacity: 0.8
              }} />

              {/* Header Title & Reset */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#092040', fontFamily: 'Inter, sans-serif' }}>
                  Filter Workers
                </span>
                <button 
                  onClick={() => {
                    setSearchRadius(50);
                    setMinRating('0.0');
                    setFilterLocation('');
                    setTempSearchRadius(50);
                    setTempMinRating('0.0');
                    setShowFilterModal(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0D6EFD',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Section 1: Search Radius */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: '#092040' }}>
                    Search Radius
                  </span>
                  <span style={{
                    background: '#E8F3FD',
                    color: '#0D6EFD',
                    fontSize: 11.5,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 12
                  }}>
                    {tempSearchRadius === 50 ? '50+ km' : `${tempSearchRadius} km`}
                  </span>
                </div>

                {/* Range Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input 
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={tempSearchRadius}
                    onChange={(e) => setTempSearchRadius(parseInt(e.target.value, 10))}
                    style={{
                      width: '100%',
                      height: 6,
                      background: '#E2E8F0',
                      borderRadius: 3,
                      outline: 'none',
                      accentColor: '#0D6EFD',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                    <span>5 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Minimum Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#092040' }}>
                  Minimum Rating
                </span>

                {/* Tags list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {[
                    { label: '3.0+', value: '3.0' },
                    { label: '3.5+', value: '3.5' },
                    { label: '4.0+', value: '4.0' },
                    { label: '4.5+', value: '4.5' },
                    { label: '5.0+', value: '5.0' }
                  ].map((opt) => {
                    const isActive = tempMinRating === opt.value;
                    return (
                      <div 
                        key={opt.value}
                        onClick={() => setTempMinRating(opt.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 24,
                          background: isActive ? '#0D6EFD' : '#F8FAFC',
                          color: isActive ? 'white' : '#475569',
                          border: isActive ? '1px solid #0D6EFD' : '1px solid #E2E8F0',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                          boxShadow: isActive ? '0 4px 8px rgba(13,110,253,0.2)' : 'none'
                        }}
                      >
                        <Star 
                          size={12} 
                          fill={isActive ? 'white' : '#FFB800'} 
                          stroke="none" 
                        />
                        <span>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button 
                onClick={() => {
                  setSearchRadius(tempSearchRadius);
                  setMinRating(tempMinRating);
                  setShowFilterModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 12,
                  background: '#0D6EFD',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: 13.5,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(13,110,253,0.25)',
                  marginTop: 8
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* DESKTOP VIEW — shown on md and above                             */}
      {/* ================================================================ */}
      <div className="hidden md:flex flex-col flex-grow">
        {isLoggedIn ? <DashboardHeader /> : <Header />}
        <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 w-full">

          {/* 2-Column Desktop Grid Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

            {/* ── Left Column: Header + Inner Grid ── */}
            <div className={`flex-grow flex flex-col gap-3 min-w-0 w-full transition-all duration-300 ${
              showBookingPanel ? 'lg:max-w-[calc(100%-374px)]' : 'lg:max-w-full'
            }`}>
              
              {/* Back to Home */}
              <div className="pt-1">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-1.5 text-[#137DC5] hover:text-[#0C5F97] font-sans font-bold text-[12px] hover:underline cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Home
                </button>
              </div>

              {/* Header Title + Job Summary Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="flex-shrink-0">
                  <h1 className="font-sans font-extrabold text-[25px] text-[#092040] tracking-tight leading-tight">Available Workers</h1>
                  <p className="font-sans text-slate-400 font-medium text-[11.5px] mt-0.5 opacity-90">
                    We found verified and trusted workers for your cleaning.
                  </p>
                </div>

                {/* Job Summary Bar */}
                <div className="flex-grow flex justify-center md:justify-center lg:justify-center">
                  <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm flex items-center justify-between gap-4 max-w-md w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#137DC5] flex-shrink-0">
                        <Home className="w-4.5 h-4.5 stroke-[1.8]" />
                      </div>
                      <div>
                        <p className="font-sans font-extrabold text-[13.5px] text-[#092040] leading-none">{paramService}</p>
                        <p className="font-sans text-[11px] text-slate-450 font-semibold mt-1 whitespace-nowrap">
                          {paramLocation}&nbsp;•&nbsp;{paramDate}&nbsp;•&nbsp;{paramRooms} Rooms
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/add-post?' + searchParams.toString())}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#137DC5] hover:bg-[#137DC5]/5 rounded-xl font-sans font-bold text-[#137DC5] text-[11.5px] transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Inner Grid: Filters + Workers List */}
              <div className="flex flex-col md:flex-row gap-5 items-start w-full mt-1">

                {/* ── Column 1: Filters ── */}
                <div className="w-full md:w-[235px] flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left">
                  <h2 className="font-sans font-extrabold text-[15px] text-[#092040] mb-4">Filters</h2>

                  <div className="flex flex-col gap-5">
                    {/* Search Radius Slider */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center">
                        <label className="font-sans font-bold text-[13px] text-slate-700">Search Radius</label>
                        <span className="bg-[#EBF3FC] text-[#137DC5] text-[10.5px] font-extrabold px-2 py-0.5 rounded-full select-none">
                          {searchRadius === 50 ? '50+ km' : `${searchRadius} km`}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <input 
                          type="range"
                          min="5"
                          max="50"
                          step="1"
                          value={searchRadius}
                          onChange={(e) => setSearchRadius(parseInt(e.target.value, 10))}
                          className="w-full h-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#137DC5] outline-none transition-colors"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold select-none">
                          <span>5 km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                    </div>

                    {/* Minimum Rating Tags */}
                    <div className="flex flex-col gap-2.5">
                      <label className="font-sans font-bold text-[13px] text-slate-700">Minimum Rating</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '3.0+', value: '3.0' },
                          { label: '3.5+', value: '3.5' },
                          { label: '4.0+', value: '4.0' },
                          { label: '4.5+', value: '4.5' },
                          { label: '5.0+', value: '5.0' }
                        ].map((opt) => {
                          const isActive = minRating === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setMinRating(opt.value)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                                isActive 
                                  ? 'bg-[#137DC5] border-[#137DC5] text-white shadow-sm shadow-blue-500/10' 
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-655'
                              }`}
                            >
                              <Star 
                                size={11} 
                                fill={isActive ? 'white' : '#FFB800'} 
                                stroke="none" 
                                className="flex-shrink-0"
                              />
                              <span className="font-sans text-[11px] font-bold">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                      onClick={handleClearFilters}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#137DC5] border border-slate-200 hover:border-slate-350 rounded-xl font-sans font-bold text-[12.5px] transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* ── Column 2: Workers List ── */}
                <div className="flex-grow flex flex-col gap-4 min-w-0">

                  {/* Count + Sort row */}
                  <div className="flex items-center justify-between px-0.5">
                    <span className="font-sans font-semibold text-slate-500 text-[12.5px]">
                      {sortedWorkers.length} workers found
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-sans font-semibold text-slate-600 text-[12px] hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        <span>Sort by: {sortBy}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      {isSortOpen && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-40">
                          {['Best Match', 'Top Rated', 'Price: Low to High', 'Price: High to Low'].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                              className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-sans text-[12.5px] transition-colors cursor-pointer ${sortBy === opt ? 'text-[#137DC5] font-bold' : 'text-slate-600'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Worker Cards */}
                  <div className="flex flex-col gap-3 w-full animate-fadeIn">
                    {isLoading ? (
                      <>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-white border border-slate-100 rounded-2xl px-6 py-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-200 rounded-full flex-shrink-0" />
                              <div className="flex flex-col gap-2">
                                <div className="h-4 bg-slate-200 rounded w-28" />
                                <div className="h-3 bg-slate-200 rounded w-20" />
                                <div className="h-3 bg-slate-200 rounded w-36 mt-1" />
                              </div>
                            </div>
                            <div className="flex flex-col items-start gap-2.5 flex-shrink-0">
                              <div className="h-4 bg-slate-200 rounded w-16" />
                              <div className="flex items-center gap-2">
                                <div className="h-9 bg-slate-200 rounded-lg w-24" />
                                <div className="h-9 bg-slate-200 rounded-lg w-28" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : error ? (
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center w-full my-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-650 mx-auto mb-3">
                          <Info className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-red-800 text-base">Unable to load workers</h3>
                        <p className="font-sans text-sm text-red-600 mt-1">{error}</p>
                        <button
                          onClick={fetchWorkers}
                          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm rounded-lg transition-colors cursor-pointer"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : sortedWorkers.length > 0 ? (
                      sortedWorkers.map((worker) => {
                        const isSelected = selectedWorker?.id === worker.id;
                        return (
                          <div
                            key={worker.id}
                            className={`bg-white border rounded-2xl px-6 py-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isSelected ? 'border-[#137DC5]/40' : 'border-slate-100'
                            }`}
                          >
                            {/* Left Section: Avatar + Info */}
                            <div className="flex items-center gap-4">
                              <WorkerAvatar worker={worker} size="md" />
                              <div>
                                <h3 className="font-sans font-extrabold text-[14.5px] text-[#092040] leading-tight">{worker.name}</h3>
                                <p className="font-sans font-semibold text-slate-400 text-[12px] mt-0.5">{worker.role}</p>
                                <div className="flex items-center gap-2 mt-2.5">
                                  <div className="flex items-center gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-sans font-semibold text-[12px] text-slate-500">{worker.rating}</span>
                                    <span className="font-sans text-[11px] text-slate-400 font-semibold">({worker.reviews})</span>
                                  </div>
                                  <span className="text-slate-300 text-[10px]">•</span>
                                  <span className="font-sans font-semibold text-slate-400 text-[11.5px]">
                                    {worker.location.replace(', ', ',')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Section: Rate + Buttons */}
                            <div className="flex flex-col items-start gap-2.5 flex-shrink-0">
                             
                              <div className="flex items-center gap-2">
                                {/* <button
                                  onClick={() => alert(`Showing full profile for ${worker.name}...`)}
                                  className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg font-sans font-bold text-[#137DC5] text-[12px] transition-colors cursor-pointer"
                                >
                                  View Profile
                                </button> */}
                                <button
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedWorker(null);
                                      setShowBookingPanel(false);
                                    } else {
                                      setSelectedWorker(worker);
                                      setShowBookingPanel(true);
                                      setWorkerValidationError('');
                                    }
                                  }}
                                  className={`px-4 py-2 font-sans font-bold text-[12px] rounded-lg shadow-sm transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                      : 'bg-[#137DC5] hover:bg-[#137DC5]/90 text-white'
                                  }`}
                                >
                                  {isSelected ? 'Selected' : 'Select Worker'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-white border border-slate-100 rounded-2xl py-16 text-center shadow-sm w-full">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                          <Search className="w-5 h-5" />
                        </div>
                        <p className="font-sans font-bold text-slate-700 text-sm">No workers match your filters</p>
                        <p className="font-sans text-[12.5px] text-slate-400 mt-1">Try adjusting your location or rating filters.</p>
                      </div>
                    )}
                  </div>

                  {/* Can't find the right one card (Desktop) */}
                  {!isLoading && !error && (
                    <div className="bg-slate-100 border-none rounded-2xl p-5 flex items-center justify-between gap-4 mt-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#137DC5] flex-shrink-0 shadow-sm">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-sans font-extrabold text-[14px] text-[#092040] leading-snug">Can&apos;t find the right one?</h4>
                          <p className="font-sans text-[12px] text-slate-500 font-semibold mt-0.5">
                            We&apos;ll assign the best available worker for you.
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={isBookingLoading}
                        onClick={(e) => {
                          e.preventDefault();
                          if (isBookingLoading) return;
                          if (sessionStorage.getItem('is_logged_in') !== 'true') {
                            sessionStorage.setItem('pending_booking_worker_id', 'auto');
                            sessionStorage.setItem('pending_booking_vacuum', vacuumRequired ? 'true' : 'false');
                            sessionStorage.setItem('pending_booking_materials', JSON.stringify(selectedMaterials));
                            sessionStorage.setItem('pending_booking_schedule', scheduleType);
                            sessionStorage.setItem('pending_booking_date', bookingDate);
                            sessionStorage.setItem('pending_booking_time', bookingTime);
                            sessionStorage.setItem('pending_booking_notes', notes);
                            sessionStorage.setItem('pending_booking_latitude', selectedLatitude);
                            sessionStorage.setItem('pending_booking_longitude', selectedLongitude);
                            sessionStorage.setItem('redirect_after_login', '/workers');
                            router.push('/login');
                            return;
                          }
                          setSelectedWorker({ id: 'auto', name: 'Auto Assigned', initials: 'AA', gradient: 'from-blue-500 to-cyan-500' });
                          setShowBookingPanel(true);
                        }}
                        className={`px-5 py-2.5 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-bold text-[12px] rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap ${isBookingLoading ? 'bg-slate-400 cursor-not-allowed' : ''}`}
                      >
                        {isBookingLoading ? 'Processing...' : 'Auto Assign'}
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* ── Right Column: Complete Your Booking ── */}
            {showBookingPanel && (
              <div className="w-full lg:w-[350px] flex-shrink-0 bg-white border border-slate-100 rounded-2xl shadow-sm text-left sticky top-[76px] animate-in slide-in-from-right duration-300">
 
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                  <h2 className="font-sans font-extrabold text-[15px] text-[#092040]">{tr('booking.completeBooking', 'Complete Your Booking')}</h2>
                  <button
                    onClick={() => {
                      setShowBookingPanel(false);
                      setSelectedWorker(null);
                    }}
                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

              <div className="px-5 pb-5 flex flex-col gap-4.5 mt-4">

                {/* Selected Worker label */}
                {selectedWorker && selectedWorker.id !== 'auto' && selectedWorker.name !== 'Auto Assigned' && (
                  <>
                    <div>
                      <p className="font-sans font-bold text-[12px] text-slate-400 uppercase tracking-wider mb-2.5">{tr('booking.selectedWorkerLabel', 'Selected Worker')}</p>
                      <div className="pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <WorkerAvatar worker={selectedWorker} size="sm" />
                          <div>
                            <p className="font-sans font-bold text-[14px] text-[#092040] leading-snug">{selectedWorker.name}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-sans font-bold text-[11.5px] text-[#092040]">{selectedWorker.rating}</span>
                              <span className="font-sans text-[10.5px] text-slate-400">({selectedWorker.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                  </>
                )}

                {/* Step 1: Worker Preference */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 border border-[#137DC5] rounded-full flex items-center justify-center text-[#137DC5] font-sans font-bold text-[11px] flex-shrink-0">1</div>
                    <span className="font-sans font-bold text-[#092040] text-[13px]">{tr('booking.workerPreference', 'Worker Preference')}</span>
                  </div>
                  <div className="flex flex-col gap-3 pl-7.5">
                    {selectedWorker && selectedWorker.id !== 'auto' && selectedWorker.name !== 'Auto Assigned' && (
                      <div className="flex items-center gap-2.5 select-none cursor-pointer">
                        <div className="w-4 h-4 rounded-full border-2 border-[#137DC5] flex items-center justify-center bg-white flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#137DC5]" />
                        </div>
                        <span className="font-sans font-medium text-slate-600 text-[12.5px]">{tr('booking.selectedWorker', 'Selected Worker')} ({selectedWorker?.name})</span>
                      </div>
                    )}

                    <div 
                      className="flex items-center gap-2.5 select-none cursor-pointer group" 
                      onClick={() => setVacuumRequired(!vacuumRequired)}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                        vacuumRequired ? 'border-[#137DC5] bg-[#137DC5] text-white' : 'border-slate-350 bg-white group-hover:border-slate-400'
                      }`}>
                        {vacuumRequired && <Check className="w-3 h-3 stroke-[3.5]" />}
                      </div>
                      <span className="font-sans font-medium text-slate-600 text-[12.5px]">{tr('booking.vacuumCleaner', 'Vacuum Cleaner Required')} (+€{vacuumCleanerVal})</span>
                    </div>

                    {/* Dynamic Materials list so user sees what was chosen */}
                    {dynamicMaterials.length > 0 && dynamicMaterials.map(mat => (
                      <div 
                        key={mat.id}
                        className="flex items-center gap-2.5 select-none cursor-pointer group" 
                        onClick={() => {
                          setSelectedMaterials(prev => 
                            prev.includes(mat.id) ? prev.filter(id => id !== mat.id) : [...prev, mat.id]
                          );
                        }}
                      >
                        <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedMaterials.includes(mat.id) ? 'border-[#137DC5] bg-[#137DC5] text-white' : 'border-slate-350 bg-white group-hover:border-slate-400'
                        }`}>
                          {selectedMaterials.includes(mat.id) && <Check className="w-3 h-3 stroke-[3.5]" />}
                        </div>
                        <span className="font-sans font-medium text-slate-600 text-[12.5px]">{mat.material_name} (+€{parseFloat(mat.amount).toFixed(2)})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Step 2: Job Schedule */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 border border-[#137DC5] rounded-full flex items-center justify-center text-[#137DC5] font-sans font-bold text-[11px] flex-shrink-0">2</div>
                    <span className="font-sans font-bold text-[#092040] text-[13px]">{tr('booking.jobSchedule', 'Job Schedule')}</span>
                  </div>
                  <div className="flex flex-col gap-4 pl-7.5">
                    {/* Frequency Cards Grid (4 boxes) */}
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      {['One Time', 'Daily', 'Weekly', 'Monthly'].map((type) => {
                        const labelMap = {
                          'One Time': tr('freq.oneTime', 'One Time'),
                          'Daily': tr('freq.daily', 'Daily'),
                          'Weekly': tr('freq.weekly', 'Weekly'),
                          'Monthly': tr('freq.monthly', 'Monthly')
                        };
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleScheduleTypeChange(type)}
                            className={`py-2 text-center font-sans font-extrabold text-[10.5px] rounded-xl border transition-all cursor-pointer select-none ${
                              scheduleType === type
                                ? 'bg-[#137DC5] text-white border-[#137DC5] shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {labelMap[type] || type}
                          </button>
                        );
                      })}
                    </div>

                    {scheduleType === 'One Time' && (
                      <div className="grid grid-cols-1 gap-3 mt-1">
                        {/* Date Input */}
                        <div className="flex flex-col gap-1.5 relative text-left">
                          <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Date</span>
                          <div className="relative flex items-center">
                            <Calendar className="absolute left-4 w-4.5 h-4.5 text-[#137DC5] pointer-events-none" />
                            <input
                              type="date"
                              value={convertToYYYYMMDD(bookingDate)}
                              onChange={(e) => {
                                setBookingDate(convertToDDMMMYYYY(e.target.value));
                              }}
                              className="w-full pl-11 pr-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                            />
                          </div>
                        </div>

                        {/* Time Input */}
                        <div className="flex flex-col gap-1.5 relative text-left">
                          <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                          <div className="relative flex items-center">
                            <Clock className="absolute left-4 w-4.5 h-4.5 text-[#137DC5] pointer-events-none" />
                            <input
                              type="time"
                              value={convertTo24Hour(bookingTime)}
                              onChange={(e) => {
                                setBookingTime(convertTo12Hour(e.target.value));
                              }}
                              className="w-full pl-11 pr-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {scheduleType === 'Daily' && (
                      <div className="flex flex-col gap-1.5 relative text-left mt-1">
                        <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                        <div className="relative flex items-center">
                          <Clock className="absolute left-4 w-4.5 h-4.5 text-[#137DC5] pointer-events-none" />
                          <input
                            type="time"
                            value={convertTo24Hour(bookingTime)}
                            onChange={(e) => {
                              setBookingTime(convertTo12Hour(e.target.value));
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                          />
                        </div>
                      </div>
                    )}

                    {scheduleType === 'Weekly' && (
                      <div className="flex flex-col gap-3 mt-1">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isBiweekly}
                                onChange={(e) => {
                                  setIsBiweekly(e.target.checked);
                                  setOpenWeeklyDayIndex(null);
                                  setOpenWeeklyTimeIndex(null);
                                  setOpenBiweeklyDay(null);
                                  setOpenBiweeklyTime(null);
                                }}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${isBiweekly
                                  ? 'bg-[#137DC5] border-[#137DC5]'
                                  : 'bg-white border-slate-300 hover:border-[#137DC5]'
                                }`}>
                                {isBiweekly && (
                                  <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                                )}
                              </div>
                            </div>
                            <span className="font-sans font-extrabold text-[12.5px] text-slate-700">Biweekly</span>
                          </label>

                          {!isBiweekly && (
                            <button
                              type="button"
                              onClick={() => {
                                setWeeklySlots([...weeklySlots, { day: 'Monday', time: '12:00 PM' }]);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 text-[#137DC5] rounded-xl font-sans font-bold text-[12px] transition-all cursor-pointer border border-blue-100/30"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Add New</span>
                            </button>
                          )}
                        </div>

                        {!isBiweekly ? (
                          <div className="flex flex-col gap-3">
                            {weeklySlots.map((slot, index) => (
                              <div key={index} className="grid grid-cols-1 gap-3 bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative text-left">
                                <div className="flex flex-col gap-1.5 relative text-left">
                                  <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Day</span>
                                  <select
                                    value={slot.day}
                                    onChange={(e) => {
                                      const updated = [...weeklySlots];
                                      updated[index].day = e.target.value;
                                      setWeeklySlots(updated);
                                    }}
                                    className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                  >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                      <option key={day} value={day}>{day}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex flex-col gap-1.5 relative text-left">
                                  <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="time"
                                      value={convertTo24Hour(slot.time)}
                                      onChange={(e) => {
                                        const updated = [...weeklySlots];
                                        updated[index].time = convertTo12Hour(e.target.value);
                                        setWeeklySlots(updated);
                                      }}
                                      className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                    />

                                    {weeklySlots.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWeeklySlots(weeklySlots.filter((_, idx) => idx !== index));
                                        }}
                                        className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-colors"
                                      >
                                        <svg className="w-4 h-4 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                          <line x1="10" y1="11" x2="10" y2="17" />
                                          <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {/* Row 1 — Select 1st Day + Select Time */}
                            <div className="flex flex-col gap-3 bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative text-left">
                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select 1st Day</span>
                                <select
                                  value={biweeklyDays.day1}
                                  onChange={(e) => setBiweeklyDays({ ...biweeklyDays, day1: e.target.value })}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                >
                                  {['1st Monday', '1st Tuesday', '1st Wednesday', '1st Thursday', '1st Friday', '1st Saturday', '1st Sunday'].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                                <input
                                  type="time"
                                  value={convertTo24Hour(biweeklyTimes.time1)}
                                  onChange={(e) => setBiweeklyTimes({ ...biweeklyTimes, time1: convertTo12Hour(e.target.value) })}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                />
                              </div>
                            </div>

                            {/* Row 2 — Select 2nd day + Select Time */}
                            <div className="flex flex-col gap-3 bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative text-left">
                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select 2nd day</span>
                                <select
                                  value={biweeklyDays.day2}
                                  onChange={(e) => setBiweeklyDays({ ...biweeklyDays, day2: e.target.value })}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                >
                                  {['3rd Monday', '3rd Tuesday', '3rd Wednesday', '3rd Thursday', '3rd Friday', '3rd Saturday', '3rd Sunday'].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                                <input
                                  type="time"
                                  value={convertTo24Hour(biweeklyTimes.time2)}
                                  onChange={(e) => setBiweeklyTimes({ ...biweeklyTimes, time2: convertTo12Hour(e.target.value) })}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {scheduleType === 'Monthly' && (
                      <div className="flex flex-col gap-3 mt-1">
                        <div className="flex items-center justify-between font-sans">
                          <span className="font-sans font-extrabold text-[12.5px] text-slate-700">Monthly Dates</span>
                          <button
                            type="button"
                            onClick={() => {
                              setMonthlySlots([...monthlySlots, { date: '24 May 2024', time: '12:00 PM' }]);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 text-[#137DC5] rounded-xl font-sans font-bold text-[12px] transition-all cursor-pointer border border-blue-100/30"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add New</span>
                          </button>
                        </div>

                        <div className="flex flex-col gap-3">
                          {monthlySlots.map((slot, index) => (
                            <div key={index} className="grid grid-cols-1 gap-3 bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative text-left">
                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Date</span>
                                <input
                                  type="date"
                                  value={convertToYYYYMMDD(slot.date)}
                                  onChange={(e) => {
                                    const updated = [...monthlySlots];
                                    updated[index].date = convertToDDMMMYYYY(e.target.value);
                                    setMonthlySlots(updated);
                                  }}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                />
                              </div>

                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="time"
                                    value={convertTo24Hour(slot.time)}
                                    onChange={(e) => {
                                      const updated = [...monthlySlots];
                                      updated[index].time = convertTo12Hour(e.target.value);
                                      setMonthlySlots(updated);
                                    }}
                                    className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                  />

                                  {monthlySlots.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMonthlySlots(monthlySlots.filter((_, idx) => idx !== index));
                                      }}
                                      className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-colors"
                                    >
                                      <svg className="w-4 h-4 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Step 3: Additional Notes */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 border border-[#137DC5] rounded-full flex items-center justify-center text-[#137DC5] font-sans font-bold text-[11px] flex-shrink-0">3</div>
                    <span className="font-sans font-bold text-[#092040] text-[13px]">
                      {tr('booking.additionalNotes', 'Additional Notes')} <span className="text-slate-400 font-semibold text-[11px]">({tr('booking.optional', 'Optional')})</span>
                    </span>
                  </div>
                  <div className="pl-7.5">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 250))}
                      rows={3}
                      placeholder={tr('booking.specialNotesPlaceholder', 'Add any special instructions for the worker...')}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 font-sans font-medium text-[13px] text-slate-650 placeholder-slate-400 outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/10 resize-none transition-all"
                    />
                    <div className="text-right text-[10px] font-bold text-slate-400 mt-1">{notes.length}/250</div>
                  </div>
                </div>

                {/* Pricing & Checkout Card */}
                <div className="bg-[#FAFBFD] border border-slate-100 rounded-2xl p-5 flex flex-col gap-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-slate-700 text-[13.5px]">{tr('booking.estimatedPrice', 'Estimated Price')}</span>
                        <Info className="w-3.5 h-3.5 text-slate-450" />
                      </div>
                      <p className="font-sans text-slate-400 text-[11px] mt-0.5">{tr('booking.estimatedPriceDesc', 'Includes service charge and taxes.')}</p>
                    </div>
                    <span className="font-sans font-extrabold text-[22px] text-[#092040]">€{estimatedPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePayNow}
                    className="w-full py-3.5 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-bold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    {tr('booking.payNow', 'Pay Now')}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-slate-400 font-sans font-semibold text-[11.5px]">
                    <Lock className="w-3.5 h-3.5 text-[#137DC5] flex-shrink-0" />
                    <span>{tr('booking.secureBooking', 'Secure booking. Your data is protected.')}</span>
                  </div>
                </div>

              </div>
            </div>
            )}

          </div>
        </main>

        {isLoggedIn ? <DashboardFooter /> : <Footer />}
      </div>

      <StripePaymentModal
        isOpen={showStripeModal}
        clientSecret={stripeClientSecret}
        bookingData={paymentBookingData}
        onClose={() => {
          setShowStripeModal(false);
          setIsBookingLoading(false);
        }}
        onPaymentSuccess={() => {
          setShowStripeModal(false);
          setIsBookingLoading(false);
        }}
      />
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] items-center justify-center">
        <div className="font-sans font-semibold text-slate-400 text-sm">Loading workers...</div>
      </div>
    }>
      <WorkersContent />
    </Suspense>
  );
}
