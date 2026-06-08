'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/utils/api';
import {
  ArrowLeft,
  HelpCircle,
  MapPin,
  LocateFixed,
  CheckCircle,
  Home,
  Clock,
  Calendar,
  ChevronDown,
  Info,
  FileText,
  Sliders,
  Check,
  User,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Ruler
} from 'lucide-react';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { createPortal } from 'react-dom';

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

const isScheduleError = (err) => {
  if (!err) return false;
  const lowercase = err.toLowerCase();
  return lowercase.includes('date') || 
         lowercase.includes('time') || 
         lowercase.includes('day') || 
         lowercase.includes('schedule') || 
         lowercase.includes('slot') || 
         lowercase.includes('biweekly') || 
         lowercase.includes('weekly') || 
         lowercase.includes('monthly');
};

function PostJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || '';

  // Services API state
  const [servicesList, setServicesList] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null); // { id, service_id, name, base_price, category }
  const [isOpenService, setIsOpenService] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [activeField, setActiveField] = useState('sqm'); // default SQM is focused/selected in mockup
  const [rooms, setRooms] = useState(searchParams.get('rooms') && searchParams.get('rooms') !== '0' ? parseInt(searchParams.get('rooms'), 10) : '');
  const [sqm, setSqm] = useState(searchParams.get('sqm') && searchParams.get('sqm') !== '0' ? parseInt(searchParams.get('sqm'), 10) : '');
  const [expectedTime, setExpectedTime] = useState(() => {
    const et = searchParams.get('expected_time');
    if (et && et !== '0') return parseInt(et, 10);
    if (searchParams.get('service')) return 1;
    return '';
  });



  const [dynamicMaterials, setDynamicMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState(() => {
    const rawIds = searchParams.get('material_amount_ids');
    if (rawIds) {
      try { return JSON.parse(rawIds); } catch(e) {}
    }
    return [];
  });
  const [pricingSettings, setPricingSettings] = useState(null);

  const [frequency, setFrequency] = useState(searchParams.get('frequency') || 'One Time');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(searchParams.get('booking_time') || '12:00');

  // Dynamic scheduling states matching user screenshots
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
    return [{ date: '', time: '12:00 PM' }];
  });

  // Custom dropdown states for dynamically generated rows
  const [openWeeklyDayIndex, setOpenWeeklyDayIndex] = useState(null);
  const [openWeeklyTimeIndex, setOpenWeeklyTimeIndex] = useState(null);
  const [openMonthlyDateIndex, setOpenMonthlyDateIndex] = useState(null);
  const [openMonthlyTimeIndex, setOpenMonthlyTimeIndex] = useState(null);

  // Safe SSR-compatible defaults — sessionStorage is read in a useEffect below
  const [locationAddress, setLocationAddress] = useState(searchParams.get('location') || '22, 4th Cross, HSR Layout, Munich, Germany');
  const [selectedLatitude, setSelectedLatitude] = useState(searchParams.get('latitude') || '');
  const [selectedLongitude, setSelectedLongitude] = useState(searchParams.get('longitude') || '');

  const [isLocating, setIsLocating] = useState(false);

  // Google Maps state
  const [mounted, setMounted] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const [mapCenter, setMapCenter] = useState({ lat: 48.1351, lng: 11.5820 });
  const [tempLocation, setTempLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLatitude(latitude.toString());
        setSelectedLongitude(longitude.toString());
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setLocationAddress(data.display_name);
            try {
              const storedUser = sessionStorage.getItem('auth_user');
              if (storedUser) {
                const u = JSON.parse(storedUser);
                u.location = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.road || data.display_name.split(',')[0];
                u.latitude = latitude;
                u.longitude = longitude;
                sessionStorage.setItem('auth_user', JSON.stringify(u));
              }
            } catch (e) {}
          } else {
            setLocationAddress(`Live Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          setLocationAddress(`Live Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const handleOpenMap = () => {
    setShowMapModal(true);
    if (navigator.geolocation && !tempLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(newLoc);
          setTempLocation(newLoc);
        },
        () => {
          console.warn("Could not get live location for map.");
        }
      );
    } else if (tempLocation) {
      setMapCenter(tempLocation);
    }
  };

  // States for Biweekly specific selections (screenshot 4 layout)
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

  // Toggles for biweekly specific dropdown selects
  const [openBiweeklyDay, setOpenBiweeklyDay] = useState(null); // 'day1', 'day2', 'day3', 'day4'
  const [openBiweeklyTime, setOpenBiweeklyTime] = useState(null); // 'time1', 'time2'

  const [notes, setNotes] = useState(searchParams.get('notes') || '');
  const [referredBy, setReferredBy] = useState('');
  const [isOpenReferredBy, setIsOpenReferredBy] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('is_logged_in') === 'true';
    }
    return false;
  });

  // Sync state values with query parameters on mount or parameter changes (handles Next.js router hydration lag)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const roomsParam = searchParams.get('rooms');
    if (roomsParam && roomsParam !== '0') {
      setRooms(parseInt(roomsParam, 10));
    }
    
    const sqmParam = searchParams.get('sqm');
    if (sqmParam && sqmParam !== '0') {
      setSqm(parseInt(sqmParam, 10));
    }
    
    const etParam = searchParams.get('expected_time');
    if (etParam && etParam !== '0') {
      setExpectedTime(parseInt(etParam, 10));
    } else if (initialService) {
      setExpectedTime(1);
    }

    const freqParam = searchParams.get('frequency');
    if (freqParam) {
      setFrequency(freqParam);
    }

    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }

    const timeParam = searchParams.get('booking_time');
    if (timeParam) {
      setSelectedTime(timeParam);
    }

    const notesParam = searchParams.get('notes');
    if (notesParam) {
      setNotes(notesParam);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams, initialService]);

  // Dropdown UI state toggles
  const [isOpenRooms, setIsOpenRooms] = useState(false);
  const [isOpenSqm, setIsOpenSqm] = useState(false);
  const [isOpenTime, setIsOpenTime] = useState(false);
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [isOpenHour, setIsOpenHour] = useState(false);

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    setIsOpenRooms(false);
    setIsOpenSqm(false);
    setIsOpenTime(false);
    setIsOpenDate(false);
    setIsOpenHour(false);
    setIsOpenReferredBy(false);
    setOpenWeeklyDayIndex(null);
    setOpenWeeklyTimeIndex(null);
    setOpenMonthlyDateIndex(null);
    setOpenMonthlyTimeIndex(null);
    setOpenBiweeklyDay(null);
    setOpenBiweeklyTime(null);
  };

  const closeAllMobileDropdowns = () => {
    setIsOpenDate(false);
    setIsOpenHour(false);
    setIsOpenReferredBy(false);
    setOpenWeeklyDayIndex(null);
    setOpenWeeklyTimeIndex(null);
    setOpenMonthlyDateIndex(null);
    setOpenMonthlyTimeIndex(null);
    setOpenBiweeklyDay(null);
    setOpenBiweeklyTime(null);
    setIsOpenService(false);
  };

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('is_logged_in') === 'true';
        const res = isLoggedIn 
          ? await authApi.getServicesDropdown() 
          : await authApi.getServicesWebList();
        if (res && res.data) {
          setServicesList(res.data);
          // Pre-select based on URL param only (no default first service select)
          if (initialService) {
            const matched = res.data.find(s => s.name === initialService);
            if (matched) setSelectedService(matched);
          }
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, [initialService]);

  // On mount: read sessionStorage and hydrate location state (client-only, after SSR)
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMounted(true);
    const syncLocation = () => {
      try {
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.location) setLocationAddress(u.location);
          if (u.latitude && u.longitude) {
            const lat = parseFloat(u.latitude);
            const lng = parseFloat(u.longitude);
            setSelectedLatitude(u.latitude.toString());
            setSelectedLongitude(u.longitude.toString());
            setMapCenter({ lat, lng });
            setTempLocation({ lat, lng });
          }
        }
      } catch (e) {}
    };

    // Sync immediately on mount from sessionStorage
    syncLocation();

    // Also sync when the header map picker dispatches a locationChanged event
    window.addEventListener('locationChanged', syncLocation);
    return () => window.removeEventListener('locationChanged', syncLocation);
  }, []);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await authApi.getPricingSettings();
        if (res && res.data) {
          setPricingSettings(res.data);
        }
      } catch (err) {
        console.error('Failed to load pricing settings:', err);
      }
    }
    loadPricing();
  }, []);

  useEffect(() => {
    async function loadMaterials() {
      if (selectedService?.id) {
        try {
          const data = await authApi.getServiceMaterials(selectedService.id);
          if (data && data.data && data.data.materials) {
            setDynamicMaterials(data.data.materials);
            // DO NOT override selectedMaterials if they were parsed from URL
            if (!searchParams.get('material_amount_ids')) {
              setSelectedMaterials([]);
            }
          } else {
            setDynamicMaterials([]);
          }
        } catch (err) {
          console.error('Error fetching materials:', err);
          setDynamicMaterials([]);
        }
      } else {
        setDynamicMaterials([]);
      }
    }
    loadMaterials();
  }, [selectedService, searchParams]);

  const handleToggleMaterial = (matId) => {
    setSelectedMaterials(prev => 
      prev.includes(matId) ? prev.filter(id => id !== matId) : [...prev, matId]
    );
  };

  const calculatePrice = () => {
    if (!selectedService) return 0;
    
    // Use the selected service base price as the 1-hour price. Fallback to pricing settings or 100.
    const hourlyPrice = selectedService.base_price ? parseFloat(selectedService.base_price) : (pricingSettings ? parseFloat(pricingSettings.base_price) : 100);
    
    // Calculate base cost based on hours
    const baseCost = hourlyPrice * (expectedTime || 1);

    const materialsCost = dynamicMaterials
      .filter(m => selectedMaterials.includes(m.id))
      .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

    const baseAmount = baseCost + materialsCost;

    let multiplier = 1;
    if (frequency === 'Daily') {
      multiplier = 7;
    } else if (frequency === 'Weekly') {
      if (isBiweekly) {
        multiplier = 2;
      } else {
        multiplier = weeklySlots ? weeklySlots.length : 1;
      }
    } else if (frequency === 'Monthly') {
      multiplier = monthlySlots ? monthlySlots.length : 1;
    }

    return Math.round(baseAmount * multiplier);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      router.push('/profile');
    } else {
      router.push('/dashboard/orders');
    }
  };

  const handleContinue = () => {
    if (!selectedService) {
      setValidationError('Please select a service before continuing.');
      return;
    }
    if (!rooms || parseInt(rooms, 10) <= 0) {
      setValidationError('Please enter the number of rooms (must be at least 1).');
      return;
    }
    if (!sqm || parseInt(sqm, 10) <= 0) {
      setValidationError('Please enter the square meters (SQM) (must be at least 1).');
      return;
    }
    if (!expectedTime || parseInt(expectedTime, 10) <= 0) {
      setValidationError('Please enter the expected time in hours (must be at least 1).');
      return;
    }

    // Date & schedule validations
    if (frequency === 'One Time') {
      if (!selectedDate) {
        setValidationError('Please select a booking date.');
        return;
      }
      if (!selectedTime) {
        setValidationError('Please select a booking time.');
        return;
      }
    } else if (frequency === 'Daily') {
      if (!selectedTime) {
        setValidationError('Please select a booking time.');
        return;
      }
    } else if (frequency === 'Weekly') {
      if (isBiweekly) {
        if (!biweeklyDays.day1 || !biweeklyDays.day2 || !biweeklyTimes.time1 || !biweeklyTimes.time2) {
          setValidationError('Please select days and times for all biweekly slots.');
          return;
        }
      } else {
        if (!weeklySlots || weeklySlots.length === 0) {
          setValidationError('Please add at least one weekly slot.');
          return;
        }
        for (let i = 0; i < weeklySlots.length; i++) {
          if (!weeklySlots[i].day || !weeklySlots[i].time) {
            setValidationError('Please select both day and time for all weekly slots.');
            return;
          }
        }
        const days = weeklySlots.map(s => s.day).filter(Boolean);
        const uniqueDays = new Set(days);
        if (uniqueDays.size !== days.length) {
          setValidationError('Please select different days for your weekly schedule.');
          return;
        }
      }
    } else if (frequency === 'Monthly') {
      if (!monthlySlots || monthlySlots.length === 0) {
        setValidationError('Please add at least one monthly date slot.');
        return;
      }
      for (let i = 0; i < monthlySlots.length; i++) {
        if (!monthlySlots[i].date || !monthlySlots[i].time) {
          setValidationError('Please select both date and time for all monthly slots.');
          return;
        }
      }
      const dates = monthlySlots.map(s => s.date).filter(Boolean);
      const uniqueDates = new Set(dates);
      if (uniqueDates.size !== dates.length) {
        setValidationError('Please select different dates for your monthly schedule.');
        return;
      }
    }

    setValidationError('');
    const params = new URLSearchParams();
    params.set('service', selectedService?.name || '');
    if (selectedService?.service_id) params.set('service_id', selectedService.service_id);
    params.set('date', selectedDate);
    params.set('rooms', rooms.toString());
    params.set('sqm', sqm.toString());
    params.set('expected_time', expectedTime.toString());
    params.set('location', locationAddress);
    params.set('latitude', selectedLatitude);
    params.set('longitude', selectedLongitude);
    params.set('material_amount_ids', JSON.stringify(selectedMaterials));
    params.set('frequency', frequency);
    params.set('notes', notes);
    
    const finalPrice = calculatePrice();
    params.set('estimated_cost', finalPrice.toString());
    
    if (frequency === 'Weekly') {
      params.set('weekly_slots', JSON.stringify(weeklySlots));
      params.set('is_biweekly', isBiweekly ? 'true' : 'false');
      if (isBiweekly) {
        params.set('biweekly_days', JSON.stringify(biweeklyDays));
        params.set('biweekly_times', JSON.stringify(biweeklyTimes));
      }
    } else if (frequency === 'Monthly') {
      params.set('monthly_slots', JSON.stringify(monthlySlots));
    } else {
      params.set('booking_time', selectedTime);
    }

    const isLoggedInVal = typeof window !== 'undefined' && sessionStorage.getItem('is_logged_in') === 'true';
    if (!isLoggedInVal) {
      sessionStorage.setItem('redirect_after_login', `/workers?${params.toString()}`);
      router.push('/login');
      return;
    }

    router.push(`/workers?${params.toString()}`);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFD] text-slate-800">

      {/* Desktop view */}
      <div className="hidden md:flex flex-col flex-grow">
        {/* 1. Header (Shared logged in shell / Public header) */}
        {isLoggedIn ? <DashboardHeader /> : <Header />}

      {/* 2. Main content page container */}
      <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Sidebar navigation */}
          {isLoggedIn && <DashboardSidebar />}

          {/* Right Main Content */}
          <div className={`flex-grow w-full ${isLoggedIn ? 'lg:w-3/4' : 'max-w-4xl mx-auto'} flex flex-col gap-6`}>

            {/* Title Line (Back arrow + Title + Help Button) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 bg-white border border-slate-100 hover:border-slate-200 rounded-xl shadow-sm text-slate-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <div className="flex flex-col text-left">
                  <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#092040] tracking-tight">
                    Post a Job
                  </h1>
                  <p className="font-sans text-[12.5px] text-slate-400 font-semibold mt-0.5">
                    Tell us what you need and we&apos;ll take care of the rest.
                  </p>
                </div>
              </div>


            </div>

            {/* Split Form & Cost Columns */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">

              {/* Form Side (span 8) */}
              <div className="xl:col-span-8 flex flex-col gap-5.5 w-full">

                {/* 1. Address Block */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-50/70 border border-blue-100/20 flex items-center justify-center text-[#137DC5] flex-shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5 stroke-[2px]" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-sans font-extrabold text-slate-800 text-[13.5px]">Address (GPS-based)</h4>
                        <p className="font-sans text-[12.5px] text-slate-500 font-semibold mt-0.5 leading-relaxed max-w-sm truncate whitespace-normal">
                          {locationAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleOpenMap}
                        className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl font-sans font-bold text-[12px] transition-all cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${isLocating ? 'bg-blue-100 border-blue-200 opacity-70' : 'bg-blue-50 hover:bg-blue-100 border-blue-100/20 text-[#137DC5]'}`}
                        title="Locate via GPS"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 ${isLocating ? 'animate-spin' : ''}`}
                        >
                          {/* Outer ring */}
                          <circle cx="12" cy="12" r="6" stroke="#137DC5" strokeWidth="2.2" />
                          {/* Inner solid dot */}
                          <circle cx="12" cy="12" r="2.5" fill="#137DC5" />
                          {/* Crosshair ticks */}
                          <line x1="12" y1="2" x2="12" y2="8" stroke="#137DC5" strokeWidth="2.2" strokeLinecap="round" />
                          <line x1="12" y1="16" x2="12" y2="22" stroke="#137DC5" strokeWidth="2.2" strokeLinecap="round" />
                          <line x1="2" y1="12" x2="8" y2="12" stroke="#137DC5" strokeWidth="2.2" strokeLinecap="round" />
                          <line x1="16" y1="12" x2="22" y2="12" stroke="#137DC5" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Status detected banner */}
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50/40 border border-emerald-100/30 rounded-xl text-emerald-700 font-sans font-bold text-[12px]">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Location detected accurately</span>
                  </div>
                </div>

                {/* 2. Select Service block */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm text-left overflow-hidden">

                  {/* Service Picker */}
                  <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Sliders className="w-4.5 h-4.5 text-[#137DC5] stroke-[2.2px]" />
                      <h3 className="font-sans font-extrabold text-slate-800 text-[13.5px]">Select Service</h3>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsOpenService(!isOpenService)}
                        disabled={servicesLoading}
                        className="flex items-center justify-between w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-[#137DC5] rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all text-left cursor-pointer disabled:opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <Sliders className="w-4 h-4 text-[#137DC5] flex-shrink-0" />
                          <span>
                            {servicesLoading
                              ? 'Loading services...'
                              : selectedService
                              ? selectedService.name
                              : 'Choose a service'}
                          </span>
                          {selectedService && (
                            <span className="text-[11px] text-slate-400 font-normal">
                              — ₹{parseFloat(selectedService.base_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpenService ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpenService && (
                        <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-1.5 z-50 max-h-56 overflow-y-auto">
                          {servicesList.map((svc) => (
                            <button
                              key={svc.id}
                              type="button"
                              onClick={() => {
                                setSelectedService(svc);
                                setIsOpenService(false);
                                setValidationError('');
                                if (!expectedTime) setExpectedTime(1);
                              }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 font-sans text-[12.5px] transition-colors cursor-pointer flex items-center justify-between ${
                                selectedService?.id === svc.id
                                  ? 'text-[#137DC5] font-bold bg-blue-50/30'
                                  : 'text-slate-600'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span>{svc.name}</span>
                                {svc.category && (
                                  <span className="text-[10.5px] text-slate-400 font-normal">{svc.category}</span>
                                )}
                              </div>
                              <span className="text-[11.5px] text-slate-500 font-semibold flex-shrink-0">
                                ₹{parseFloat(svc.base_price).toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {validationError && !isScheduleError(validationError) && (
                        <p className="mt-2 text-xs font-semibold text-red-500 text-left">
                          ⚠ {validationError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Header Title bar */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 select-none">
                    <div className="flex items-center gap-3">
                      <Sliders className="w-4.5 h-4.5 text-[#137DC5] stroke-[2.2px]" />
                      <h3 className="font-sans font-extrabold text-slate-800 text-[13.5px]">Job Details</h3>
                    </div>
                    <ChevronDown className="w-4.5 h-4.5 text-[#137DC5]" />
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col divide-y divide-slate-50">

                    {/* Rooms row */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <Home className="w-4.5 h-4.5 text-[#137DC5]" />
                        <span className="font-sans font-semibold text-slate-600 text-[13px]">Rooms</span>
                      </div>
                      <div className="relative">
                        <div className={`flex items-center px-3.5 py-1.5 bg-[#FAFBFD] border rounded-xl transition-all w-28 ${activeField === 'rooms' ? 'border-[#137DC5] bg-blue-50/20 shadow-[0_0_0_3px_rgba(19,125,197,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={rooms || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setRooms(val ? parseInt(val) : '');
                            }}
                            onFocus={() => setActiveField('rooms')}
                            className="w-full bg-transparent border-none outline-none font-sans font-bold text-[12.5px] text-slate-700 text-center"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SQM row */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
                      <div className="flex items-center gap-3 pl-0.5">
                        <span className="font-sans font-bold text-sm text-[#137DC5]">m²</span>
                        <span className="font-sans font-semibold text-slate-600 text-[13px] ml-1">SQM</span>
                      </div>
                      <div className="relative">
                        <div className={`flex items-center px-3.5 py-1.5 bg-[#FAFBFD] border rounded-xl transition-all w-28 ${activeField === 'sqm' ? 'border-[#137DC5] bg-blue-50/20 shadow-[0_0_0_3px_rgba(19,125,197,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sqm || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setSqm(val ? parseInt(val) : '');
                            }}
                            onFocus={() => setActiveField('sqm')}
                            className="w-full bg-transparent border-none outline-none font-sans font-bold text-[12.5px] text-slate-700 text-center"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expected Time row */}
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4.5 h-4.5 text-[#137DC5]" />
                        <span className="font-sans font-semibold text-slate-600 text-[13px]">Expected Time (Hrs)</span>
                      </div>
                      <div className="relative">
                        <div className={`flex items-center px-3.5 py-1.5 bg-[#FAFBFD] border rounded-xl transition-all w-28 ${activeField === 'time' ? 'border-[#137DC5] bg-blue-50/20 shadow-[0_0_0_3px_rgba(19,125,197,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={expectedTime || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setExpectedTime(val ? parseInt(val) : '');
                            }}
                            onFocus={() => setActiveField('time')}
                            className="w-full bg-transparent border-none outline-none font-sans font-bold text-[12.5px] text-slate-700 text-center"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Materials from API */}
                    {dynamicMaterials.map((mat) => (
                      <div key={mat.id} className="flex items-center justify-between px-5 py-3.5 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-600 font-sans font-semibold text-[13px]">
                          <svg className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                            <path d="M8 9V6a4 4 0 0 1 8 0v3" />
                          </svg>
                          <span>{mat.material_name}</span>
                          <span className="text-[10px] bg-[#137DC5]/10 text-[#137DC5] px-1.5 py-0.5 rounded-md font-bold ml-1">+€{mat.amount}</span>
                        </div>
                        <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-0.5 gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => handleToggleMaterial(mat.id)}
                            className={`px-5 py-1.5 font-sans font-bold text-[12px] rounded-lg transition-all cursor-pointer ${selectedMaterials.includes(mat.id) ? 'bg-[#137DC5] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleToggleMaterial(mat.id)}
                            className={`px-5 py-1.5 font-sans font-bold text-[12px] rounded-lg transition-all cursor-pointer ${!selectedMaterials.includes(mat.id) ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                {/* 3. Date & Schedule Block */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-5.5 text-left">

                  {/* Title bar */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                    <Calendar className="w-5 h-5 text-[#137DC5] stroke-[2px]" />
                    <h3 className="font-sans font-extrabold text-slate-800 text-[13.5px]">Date & Schedule</h3>
                  </div>

                  {/* Frequency Cards Grid (4 boxes) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    {/* One Time card */}
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('One Time')}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl text-center transition-all relative cursor-pointer group ${frequency === 'One Time'
                          ? 'border-[#137DC5] bg-blue-50/15'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                    >
                      {/* Check radio bullet indicator */}
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all">
                        {frequency === 'One Time' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#137DC5]"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                        )}
                      </div>
                      <Calendar className={`w-6 h-6 stroke-[1.8px] mb-2 ${frequency === 'One Time' ? 'text-[#137DC5]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                      <span className={`font-sans font-extrabold text-[12.5px] ${frequency === 'One Time' ? 'text-[#137DC5]' : 'text-slate-700'}`}>One Time</span>
                      <span className="font-sans text-[10px] text-slate-400 mt-0.5">Choose a date</span>
                    </button>

                    {/* Daily card */}
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('Daily')}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl text-center transition-all relative cursor-pointer group ${frequency === 'Daily'
                          ? 'border-[#137DC5] bg-blue-50/15'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                    >
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center">
                        {frequency === 'Daily' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#137DC5]"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                        )}
                      </div>
                      <Clock className={`w-6 h-6 stroke-[1.8px] mb-2 ${frequency === 'Daily' ? 'text-[#137DC5]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                      <span className={`font-sans font-extrabold text-[12.5px] ${frequency === 'Daily' ? 'text-[#137DC5]' : 'text-slate-700'}`}>Daily</span>
                      <span className="font-sans text-[10px] text-slate-400 mt-0.5">Choose time</span>
                    </button>

                    {/* Weekly card */}
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('Weekly')}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl text-center transition-all relative cursor-pointer group ${frequency === 'Weekly'
                          ? 'border-[#137DC5] bg-blue-50/15'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                    >
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center">
                        {frequency === 'Weekly' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#137DC5]"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                        )}
                      </div>
                      {/* Weekly calendar variant */}
                      <svg className={`w-6 h-6 stroke-[1.8px] mb-2 fill-none ${frequency === 'Weekly' ? 'text-[#137DC5]' : 'text-slate-400 group-hover:text-slate-500'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M8 14h8M8 18h5" />
                      </svg>
                      <span className={`font-sans font-extrabold text-[12.5px] ${frequency === 'Weekly' ? 'text-[#137DC5]' : 'text-slate-700'}`}>Weekly</span>
                      <span className="font-sans text-[10px] text-slate-400 mt-0.5">Choose day</span>
                    </button>

                    {/* Monthly card */}
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('Monthly')}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl text-center transition-all relative cursor-pointer group ${frequency === 'Monthly'
                          ? 'border-[#137DC5] bg-blue-50/15'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                    >
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center">
                        {frequency === 'Monthly' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#137DC5]"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                        )}
                      </div>
                      {/* Monthly grid calendar variant */}
                      <svg className={`w-6 h-6 stroke-[1.8px] mb-2 fill-none ${frequency === 'Monthly' ? 'text-[#137DC5]' : 'text-slate-400 group-hover:text-slate-500'}`} viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01M17 18h.01" strokeWidth="2.5" />
                      </svg>
                      <span className={`font-sans font-extrabold text-[12.5px] ${frequency === 'Monthly' ? 'text-[#137DC5]' : 'text-slate-700'}`}>Monthly</span>
                      <span className="font-sans text-[10px] text-slate-400 mt-0.5">Choose day & time</span>
                    </button>

                  </div>

                  {/* Dynamic frequency schedule inputs based on active selection */}
                  {frequency === 'One Time' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {/* Native Date Input */}
                      <div className="flex flex-col gap-1.5 relative text-left">
                        <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Date</span>
                        <div className="relative">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                          />
                        </div>
                      </div>

                      {/* Native Time Input */}
                      <div className="flex flex-col gap-1.5 relative text-left">
                        <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                        <div className="relative">
                          <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {frequency === 'Daily' && (
                    <div className="flex flex-col gap-1.5 relative text-left mt-2">
                      <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Time</span>
                      <div className="relative">
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                        />
                      </div>
                    </div>
                  )}

                  {frequency === 'Weekly' && (
                    <div className="flex flex-col gap-4 mt-2">
                      {/* Biweekly Checkbox and Add New Button Row */}
                      <div className="flex items-center justify-between">
                        {/* Checkbox Container */}
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
                            {/* Custom Checkbox Square Box */}
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

                        {/* Add New Button (only if not biweekly) */}
                        {!isBiweekly && (
                          <button
                            type="button"
                            onClick={() => {
                              setWeeklySlots([...weeklySlots, { day: '', time: '12:00 PM' }]);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 text-[#137DC5] rounded-xl font-sans font-bold text-[12px] transition-all cursor-pointer border border-blue-100/30"
                          >
                            <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Add New</span>
                          </button>
                        )}
                      </div>

                      {/* Rendering weekly slots if NOT biweekly */}
                      {!isBiweekly ? (
                        <div className="flex flex-col gap-4">
                          {weeklySlots.map((slot, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative">
                              {/* Day Selector */}
                              <div className="flex flex-col gap-1.5 relative text-left">
                                <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Day</span>
                                <select
                                  value={slot.day || ''}
                                  onChange={(e) => {
                                    const updated = [...weeklySlots];
                                    updated[index].day = e.target.value;
                                    setWeeklySlots(updated);
                                  }}
                                  className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                                >
                                  <option value="" disabled>Day</option>
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Time Selector */}
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

                                  {/* Delete Button for rows beyond the first */}
                                  {weeklySlots.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWeeklySlots(weeklySlots.filter((_, idx) => idx !== index));
                                      }}
                                      className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-colors"
                                      title="Remove slot"
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
                        <div className="flex flex-col gap-4 mt-2">
                          {/* Row 1 — Select 1st Day + Select Time */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative">
                            {/* Day 1 Selector */}
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

                            {/* Time 1 Selector */}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative">
                            {/* Day 2 Selector */}
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

                            {/* Time 2 Selector */}
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

                  {frequency === 'Monthly' && (
                    <div className="flex flex-col gap-4 mt-2">
                      {/* Monthly Slots Header & Add New Button */}
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-extrabold text-[12.5px] text-slate-700">Monthly Dates</span>
                        <button
                          type="button"
                          onClick={() => {
                            setMonthlySlots([...monthlySlots, { date: '', time: '12:00 PM' }]);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-50 text-[#137DC5] rounded-xl font-sans font-bold text-[12px] transition-all cursor-pointer border border-blue-100/30"
                        >
                          <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          <span>Add New</span>
                        </button>
                      </div>

                      {/* List of Monthly slots */}
                      <div className="flex flex-col gap-4">
                        {monthlySlots.map((slot, index) => (
                          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50/30 p-3 rounded-xl border border-slate-100 relative">
                            {/* Date Selector */}
                            <div className="flex flex-col gap-1.5 relative text-left">
                              <span className="font-sans font-bold text-slate-400 text-[10.5px] uppercase tracking-wider">Select Date</span>
                              <select
                                value={slot.date || ''}
                                onChange={(e) => {
                                  const updated = [...monthlySlots];
                                  updated[index].date = e.target.value.toString();
                                  setMonthlySlots(updated);
                                }}
                                className="w-full px-4 py-3 bg-[#FAFBFD] border border-slate-200/80 hover:border-slate-300 rounded-xl text-slate-700 font-sans font-bold text-[13px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-2 focus:ring-[#137DC5]/20"
                              >
                                <option value="" disabled>Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>

                            {/* Time Selector */}
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

                                {/* Delete button for monthly slots beyond the first */}
                                {monthlySlots.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMonthlySlots(monthlySlots.filter((_, idx) => idx !== index));
                                    }}
                                    className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-colors"
                                    title="Remove slot"
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

                  {/* Reschedule description blue banner */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-blue-50/50 border border-blue-100/30 rounded-xl text-[#137DC5] font-sans font-bold text-[12px] mt-1">
                    <Info className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0" />
                    <span>You can reschedule or modify the date later</span>
                  </div>

                  {validationError && isScheduleError(validationError) && (
                    <p className="mt-3 text-xs font-semibold text-red-500 text-left">
                      ⚠ {validationError}
                    </p>
                  )}

                </div>

                {/* 4. Add Note optional textarea */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 text-left">

                  {/* Header Title */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                    <FileText className="w-5 h-5 text-[#137DC5] stroke-[2px]" />
                    <h3 className="font-sans font-extrabold text-slate-800 text-[13.5px]">Add Note (Optional)</h3>
                  </div>

                  {/* Textarea and counter box */}
                  <div className="relative flex flex-col">
                    <textarea
                      placeholder="Enter any special instructions or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 250))}
                      rows={4}
                      className="w-full bg-[#FAFBFD] border border-slate-200/80 rounded-xl px-4 py-3 font-sans font-semibold text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-[#137DC5] focus:bg-white transition-all resize-none"
                    />
                    <span className="absolute bottom-2.5 right-3.5 font-sans font-bold text-[11px] text-slate-400">
                      {notes.length}/250
                    </span>
                  </div>

                </div>

              </div>

              {/* Price Checkout Column (span 4) */}
              <div className="xl:col-span-4 w-full">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5 text-left sticky top-22">

                  {/* Top: Euro icon on the left, Cost details on the right */}
                  <div className="flex items-center gap-4 select-none">
                    {/* Blue Euro badge */}
                    <div className="w-14 h-14 rounded-full bg-[#137DC5] flex items-center justify-center text-white font-display font-black text-[26px] shadow-sm flex-shrink-0">
                      €
                    </div>

                    {/* Cost details */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1 text-slate-400 font-sans font-extrabold text-[11px] tracking-wide uppercase">
                        <span>Estimated Cost</span>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Calculated based on base price, room size, and material selections" />
                      </div>
                      <div className="font-sans font-black text-[38px] text-[#137DC5] leading-none mt-1">
                        {calculatePrice()}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="w-full border-t border-slate-100 my-1"></div>

                  {/* Checklist items */}
                  <div className="w-full flex flex-col gap-4 text-left font-sans font-extrabold text-[12.5px] text-slate-650">

                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 stroke-[2px]" />
                      <span>Professional & Verified Cleaners</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 stroke-[2px]" />
                      <span>Background Checked</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 stroke-[2px]" />
                      <span>Satisfaction Guaranteed</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4.5 h-4.5 text-[#137DC5] flex-shrink-0 stroke-[2px]" />
                      <span>Secure Payments</span>
                    </div>

                  </div>

                  {/* Large continue primary action button */}
                  <button
                    onClick={handleContinue}
                    className="w-full mt-2 py-3.5 bg-[#137DC5] hover:bg-[#137DC5]/90 text-white font-sans font-black text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 select-none"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden flex-col min-h-screen bg-[#FAFBFD] pb-24 relative text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Blue wave header banner */}
        <div className="bg-[#137DC5] rounded-b-[32px] h-32 p-5 pt-6 text-left text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-blue-900 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            {/* Back Button + Title & Subtitle */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-9.5 h-9.5 bg-white rounded-full flex items-center justify-center text-[#137DC5] shadow-md border border-white hover:bg-slate-50 transition-all cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-4.5 h-4.5 stroke-[2.8]" />
              </button>
              <div className="flex flex-col text-left">
                <h1 className="font-sans font-extrabold text-[17px] text-white leading-tight">Post a Job</h1>
                <p className="font-sans text-[10px] text-white/85 font-medium mt-0.5 leading-snug">
                  Tell us what you need and we&apos;ll take care of the rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main White Content Box - floats with margin on the sides */}
        <div className="mx-4 bg-white rounded-3xl -mt-10 pt-4 pb-4 px-3.5 flex flex-col gap-3 relative z-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/60">
          
          {/* Choose Service Location Header & Card */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-sans font-extrabold text-[13.5px] text-[#092040] tracking-tight text-left">
              Choose Service Location
            </h3>
            
            {/* Location Card */}
            <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm flex justify-between items-center gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50/70 flex items-center justify-center text-[#137DC5] flex-shrink-0">
                  <MapPin className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div className="flex flex-col text-left">
                  <p className="font-sans text-[11px] text-slate-500 font-bold leading-normal line-clamp-2 max-w-[180px]">
                    {locationAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleOpenMap}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-[#137DC5] rounded-lg font-sans font-bold text-[11px] hover:border-[#137DC5] hover:bg-blue-50/20 transition-all cursor-pointer"
                >
                  Change
                </button>
                
                <button
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${isLocating ? 'bg-blue-100 border-blue-200 opacity-70' : 'bg-blue-50 text-[#137DC5] border-blue-100/50 hover:bg-blue-100'}`}
                  title="Locate via GPS"
                >
                  <LocateFixed className={`w-3.5 h-3.5 text-[#137DC5] ${isLocating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Service & Details Section */}
          <div className="flex flex-col gap-0.5">
            
            {/* Choose Service Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Sliders className="w-4.5 h-4.5 text-[#137DC5] stroke-[1.8]" />
                <span className="font-sans font-extrabold text-[12.5px] text-[#092040]">Choose Service</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const state = !isOpenService;
                    closeAllMobileDropdowns();
                    setIsOpenService(state);
                  }}
                  disabled={servicesLoading}
                  className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#137DC5] cursor-pointer active:scale-95 transition-all"
                >
                  <span>
                    {servicesLoading
                      ? 'Loading...'
                      : selectedService
                      ? selectedService.name
                      : 'Choose Service'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#092040] stroke-[2px] transition-transform" />
                </button>
                
                {isOpenService && (
                  <div className="absolute top-[110%] right-0 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-1.5 z-50 w-52 max-h-52 overflow-y-auto">
                    {servicesList.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(svc);
                          setIsOpenService(false);
                          setValidationError('');
                          if (!expectedTime) setExpectedTime(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 font-sans text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          selectedService?.id === svc.id
                            ? 'text-[#137DC5] font-bold bg-blue-50/30'
                            : 'text-slate-650'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{svc.name}</span>
                        </div>
                        <span className="text-[10.5px] text-slate-500 font-semibold flex-shrink-0">
                          ₹{parseFloat(svc.base_price).toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {validationError && !isScheduleError(validationError) && (
              <div className="text-[#EF4444] text-[11px] font-bold text-left py-1.5 px-1 animate-pulse">
                ⚠ {validationError}
              </div>
            )}

            {/* Rooms row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5]">
                  <Home className="w-3.5 h-3.5 stroke-[1.8]" />
                </div>
                <span className="font-sans font-extrabold text-[12.5px] text-[#092040] ml-0.5">Rooms</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={rooms || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setRooms(val ? parseInt(val) : '');
                  }}
                  className="w-[100px] px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-lg font-sans font-bold text-[11px] text-slate-700 placeholder-slate-350 outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/10 transition-all text-center"
                />
              </div>
            </div>

            {/* SQM row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5]">
                  <Ruler className="w-3.5 h-3.5 stroke-[1.8]" />
                </div>
                <span className="font-sans font-extrabold text-[12.5px] text-[#092040] ml-0.5">SQM</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={sqm || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setSqm(val ? parseInt(val) : '');
                  }}
                  className="w-[100px] px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-lg font-sans font-bold text-[11px] text-slate-700 placeholder-slate-350 outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/10 transition-all text-center"
                />
              </div>
            </div>

            {/* Expected Time row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5]">
                  <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                </div>
                <span className="font-sans font-extrabold text-[12.5px] text-[#092040] ml-0.5">Expected Time</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Hours"
                  value={expectedTime || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setExpectedTime(val ? parseInt(val) : '');
                  }}
                  className="w-[100px] px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-lg font-sans font-bold text-[11px] text-slate-700 placeholder-slate-350 outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/10 transition-all text-center"
                />
              </div>
            </div>

            {/* Dynamic Materials for Mobile */}
            {dynamicMaterials.map((mat) => (
              <div key={mat.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2 font-sans font-extrabold text-[12.5px] text-[#092040]">
                  <div className="w-7 h-7 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5]">
                    <svg className="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="M8 9V6a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>
                  <span className="ml-1">{mat.material_name}</span>
                  <span className="text-[10px] bg-[#137DC5]/10 text-[#137DC5] px-1.5 py-0.5 rounded-md font-bold ml-1">+€{mat.amount}</span>
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-full overflow-hidden w-24 flex-shrink-0">
                  <button
                    onClick={() => handleToggleMaterial(mat.id)}
                    className={`flex-1 py-1 rounded-full text-center font-sans font-bold text-[10px] transition-all cursor-pointer ${selectedMaterials.includes(mat.id) ? 'bg-[#137DC5] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleToggleMaterial(mat.id)}
                    className={`flex-1 py-1 rounded-full text-center font-sans font-bold text-[10px] transition-all cursor-pointer ${!selectedMaterials.includes(mat.id) ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Date & Schedule Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100/80 mb-0.5">
              <div className="w-6.5 h-6.5 rounded-md bg-blue-50/70 flex items-center justify-center text-[#137DC5]">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-sans font-extrabold text-slate-800 text-[13px]">Date & Schedule</h3>
            </div>

            <p className="font-sans text-[10px] text-slate-400 font-bold mb-0.5">Service Frequency</p>
            
            {/* Grid of frequency selection cards */}
            <div className="grid grid-cols-4 gap-1.5">
              {/* One Time card */}
              <button
                onClick={() => handleFrequencyChange('One Time')}
                className={`flex flex-col items-center justify-between p-1.5 border rounded-xl text-center transition-all relative cursor-pointer min-h-[70px] ${frequency === 'One Time' ? 'border-[#137DC5] bg-[#EFF6FF]' : 'border-slate-200 bg-white'}`}
              >
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border flex items-center justify-center ${frequency === 'One Time' ? 'bg-[#137DC5] border-[#137DC5]' : 'bg-white border-slate-200'}`}>
                  {frequency === 'One Time' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                </div>
                <Calendar className={`w-4 h-4 mt-0.5 ${frequency === 'One Time' ? 'text-[#137DC5]' : 'text-slate-400'}`} />
                <div className="flex flex-col items-center">
                  <span className={`font-sans font-extrabold text-[9px] leading-tight ${frequency === 'One Time' ? 'text-[#137DC5]' : 'text-slate-750'}`}>One Time</span>
                  <span className="font-sans text-[7px] text-slate-400 leading-none mt-0.5">Choose a date</span>
                </div>
              </button>

              {/* Daily card */}
              <button
                onClick={() => handleFrequencyChange('Daily')}
                className={`flex flex-col items-center justify-between p-1.5 border rounded-xl text-center transition-all relative cursor-pointer min-h-[70px] ${frequency === 'Daily' ? 'border-[#137DC5] bg-[#EFF6FF]' : 'border-slate-200 bg-white'}`}
              >
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border flex items-center justify-center ${frequency === 'Daily' ? 'bg-[#137DC5] border-[#137DC5]' : 'bg-white border-slate-200'}`}>
                  {frequency === 'Daily' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                </div>
                <Clock className={`w-4 h-4 mt-0.5 ${frequency === 'Daily' ? 'text-[#137DC5]' : 'text-slate-400'}`} />
                <div className="flex flex-col items-center">
                  <span className={`font-sans font-extrabold text-[9px] leading-tight ${frequency === 'Daily' ? 'text-[#137DC5]' : 'text-slate-750'}`}>Daily</span>
                  <span className="font-sans text-[7px] text-slate-400 leading-none mt-0.5">Choose time</span>
                </div>
              </button>

              {/* Weekly card */}
              <button
                onClick={() => handleFrequencyChange('Weekly')}
                className={`flex flex-col items-center justify-between p-1.5 border rounded-xl text-center transition-all relative cursor-pointer min-h-[70px] ${frequency === 'Weekly' ? 'border-[#137DC5] bg-[#EFF6FF]' : 'border-slate-200 bg-white'}`}
              >
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border flex items-center justify-center ${frequency === 'Weekly' ? 'bg-[#137DC5] border-[#137DC5]' : 'bg-white border-slate-200'}`}>
                  {frequency === 'Weekly' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                </div>
                <svg className={`w-4 h-4 mt-0.5 fill-none stroke-[2] ${frequency === 'Weekly' ? 'text-[#137DC5]' : 'text-slate-400'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h8" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className={`font-sans font-extrabold text-[9px] leading-tight ${frequency === 'Weekly' ? 'text-[#137DC5]' : 'text-slate-750'}`}>Weekly</span>
                  <span className="font-sans text-[7px] text-slate-400 leading-none mt-0.5">Choose day</span>
                </div>
              </button>

              {/* Monthly card */}
              <button
                onClick={() => handleFrequencyChange('Monthly')}
                className={`flex flex-col items-center justify-between p-1.5 border rounded-xl text-center transition-all relative cursor-pointer min-h-[70px] ${frequency === 'Monthly' ? 'border-[#137DC5] bg-[#EFF6FF]' : 'border-slate-200 bg-white'}`}
              >
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border flex items-center justify-center ${frequency === 'Monthly' ? 'bg-[#137DC5] border-[#137DC5]' : 'bg-white border-slate-200'}`}>
                  {frequency === 'Monthly' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                </div>
                <svg className={`w-4 h-4 mt-0.5 fill-none stroke-[2] ${frequency === 'Monthly' ? 'text-[#137DC5]' : 'text-slate-400'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M7 14h.01M12 14h.01M17 14h.01" strokeWidth="2.5" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className={`font-sans font-extrabold text-[9px] leading-tight ${frequency === 'Monthly' ? 'text-[#137DC5]' : 'text-slate-750'}`}>Monthly</span>
                  <span className="font-sans text-[7px] text-slate-400 leading-none mt-0.5">Choose day & time</span>
                </div>
              </button>
            </div>

            {/* Dynamic frequency schedule inputs based on active selection */}
            {frequency === 'One Time' && (
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {/* Select Date */}
                <div className="flex flex-col gap-1 relative">
                  <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Date</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                    />
                  </div>
                </div>

                {/* Select Time */}
                <div className="flex flex-col gap-1 relative">
                  <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Time</span>
                  <div className="relative">
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                    />
                  </div>
                </div>
              </div>
            )}

            {frequency === 'Daily' && (
              <div className="flex flex-col gap-1 mt-1.5 relative">
                <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Time</span>
                <div className="relative">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                  />
                </div>
              </div>
            )}

            {frequency === 'Weekly' && (
              <div className="flex flex-col gap-2 mt-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isBiweekly}
                      onChange={(e) => {
                        setIsBiweekly(e.target.checked);
                        closeAllMobileDropdowns();
                      }}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isBiweekly ? 'bg-[#137DC5] border-[#137DC5]' : 'bg-white border-slate-350'}`}>
                      {isBiweekly && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                    </div>
                    <span className="font-sans font-extrabold text-xs text-slate-700">Biweekly</span>
                  </label>
                  
                  {!isBiweekly && (
                    <button
                      onClick={() => setWeeklySlots([...weeklySlots, { day: '', time: '12:00 PM' }])}
                      className="text-[11px] font-bold text-[#137DC5] hover:underline cursor-pointer"
                    >
                      Add New
                    </button>
                  )}
                </div>

                {!isBiweekly ? (
                  <div className="flex flex-col gap-2">
                    {weeklySlots.map((slot, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 relative">
                        {/* Day Selector */}
                        <div className="relative flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Day</span>
                            {weeklySlots.length > 1 && (
                              <button
                                onClick={() => setWeeklySlots(weeklySlots.filter((_, idx) => idx !== index))}
                                className="text-[10px] text-red-500 font-bold hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <select
                            value={slot.day || ''}
                            onChange={(e) => {
                              const updated = [...weeklySlots];
                              updated[index].day = e.target.value;
                              setWeeklySlots(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                          >
                            <option value="" disabled>Day</option>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>

                        {/* Time Selector */}
                        <div className="relative flex flex-col gap-1 mt-auto">
                          <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Time</span>
                          <input
                            type="time"
                            value={convertTo24Hour(slot.time)}
                            onChange={(e) => {
                              const updated = [...weeklySlots];
                              updated[index].time = convertTo12Hour(e.target.value);
                              setWeeklySlots(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 mt-1.5">
                    {/* 1st Row — Select 1st Day + Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative flex flex-col gap-1">
                        <span className="font-sans font-medium text-slate-400 text-[10.5px] tracking-wide text-left">Select 1st Day</span>
                        <select
                          value={biweeklyDays.day1}
                          onChange={(e) => setBiweeklyDays({ ...biweeklyDays, day1: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[#FAFBFD] border border-slate-200 rounded-xl text-[#092040] font-sans font-bold text-[12.5px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/20 appearance-auto"
                        >
                          {['1st Monday', '1st Tuesday', '1st Wednesday', '1st Thursday', '1st Friday', '1st Saturday', '1st Sunday'].map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative flex flex-col gap-1">
                        <span className="font-sans font-medium text-slate-400 text-[10.5px] tracking-wide text-left">Select Time</span>
                        <input
                          type="time"
                          value={convertTo24Hour(biweeklyTimes.time1)}
                          onChange={(e) => setBiweeklyTimes({ ...biweeklyTimes, time1: convertTo12Hour(e.target.value) })}
                          className="w-full px-3 py-2.5 bg-[#FAFBFD] border border-slate-200 rounded-xl text-[#092040] font-sans font-bold text-[12.5px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/20"
                        />
                      </div>
                    </div>

                    {/* 2nd Row — Select 2nd Day + Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative flex flex-col gap-1">
                        <span className="font-sans font-medium text-slate-400 text-[10.5px] tracking-wide text-left">Select 2nd day</span>
                        <select
                          value={biweeklyDays.day2}
                          onChange={(e) => setBiweeklyDays({ ...biweeklyDays, day2: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[#FAFBFD] border border-slate-200 rounded-xl text-[#092040] font-sans font-bold text-[12.5px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/20 appearance-auto"
                        >
                          {['3rd Monday', '3rd Tuesday', '3rd Wednesday', '3rd Thursday', '3rd Friday', '3rd Saturday', '3rd Sunday'].map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative flex flex-col gap-1">
                        <span className="font-sans font-medium text-slate-400 text-[10.5px] tracking-wide text-left">Select Time</span>
                        <input
                          type="time"
                          value={convertTo24Hour(biweeklyTimes.time2)}
                          onChange={(e) => setBiweeklyTimes({ ...biweeklyTimes, time2: convertTo12Hour(e.target.value) })}
                          className="w-full px-3 py-2.5 bg-[#FAFBFD] border border-slate-200 rounded-xl text-[#092040] font-sans font-bold text-[12.5px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {frequency === 'Monthly' && (
              <div className="flex flex-col gap-2 mt-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-slate-700">Monthly Dates</span>
                  <button
                    onClick={() => setMonthlySlots([...monthlySlots, { date: '', time: '12:00 PM' }])}
                    className="text-[11px] font-bold text-[#137DC5] hover:underline cursor-pointer"
                  >
                    Add New
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {monthlySlots.map((slot, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 relative">
                      {/* Date */}
                      <div className="relative flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Date</span>
                          {monthlySlots.length > 1 && (
                            <button
                              onClick={() => setMonthlySlots(monthlySlots.filter((_, idx) => idx !== index))}
                              className="text-[10px] text-red-500 font-bold hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <select
                          value={slot.date || ''}
                          onChange={(e) => {
                            const updated = [...monthlySlots];
                            updated[index].date = e.target.value.toString();
                            setMonthlySlots(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                        >
                          <option value="" disabled>Day</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      {/* Time */}
                      <div className="relative flex flex-col gap-1 mt-auto">
                        <span className="font-sans font-bold text-slate-400 text-[9px] uppercase tracking-wider">Select Time</span>
                        <input
                          type="time"
                          value={convertTo24Hour(slot.time)}
                          onChange={(e) => {
                            const updated = [...monthlySlots];
                            updated[index].time = convertTo12Hour(e.target.value);
                            setMonthlySlots(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-[#092040] font-sans font-extrabold text-[11px] transition-all cursor-pointer focus:outline-none focus:border-[#137DC5] focus:ring-1 focus:ring-[#137DC5]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {validationError && isScheduleError(validationError) && (
              <div className="text-[#EF4444] text-[11px] font-bold text-left py-1.5 px-1 mt-2 animate-pulse">
                ⚠ {validationError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom price and action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          {/* Blue circle badge with € */}
          <div className="w-9.5 h-9.5 rounded-full bg-[#EBF3FC] flex items-center justify-center text-[#137DC5] font-sans font-black text-lg shadow-sm">
            €
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 text-slate-400 font-sans font-extrabold text-[9.5px] tracking-wide uppercase">
              <span>Estimated Cost /hour</span>
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Calculated based on base price, room size, and material selections" />
            </div>
            <div className="font-sans font-black text-xl text-[#137DC5] leading-none mt-0.5">
              €{calculatePrice()}
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-[#137DC5] hover:bg-[#0C5F97] text-white font-sans font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 select-none"
        >
          <span>Continue</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Map Picker Modal */}
      {mounted && showMapModal && isLoaded && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-slate-800 text-[15px]">Select Location</h3>
              <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer border-none bg-transparent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="h-[280px] sm:h-[350px] w-full relative bg-slate-50 flex-shrink-0">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={14}
                onClick={(e) => {
                  setTempLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                }}
              >
                {tempLocation ? (
                  <Marker position={tempLocation} />
                ) : (
                  <Marker position={mapCenter} />
                )}
              </GoogleMap>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowMapModal(false)}
                className="px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const targetLocation = tempLocation || mapCenter;
                  setSelectedLatitude(targetLocation.lat.toString());
                  setSelectedLongitude(targetLocation.lng.toString());
                  setShowMapModal(false);
                  setIsLocating(true);
                  try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLocation.lat}&lon=${targetLocation.lng}`);
                    const data = await res.json();
                    if (data && data.display_name) {
                      setLocationAddress(data.display_name);
                      try {
                        const storedUser = sessionStorage.getItem('auth_user');
                        if (storedUser) {
                          const u = JSON.parse(storedUser);
                          u.location = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.road || data.display_name.split(',')[0];
                          u.latitude = targetLocation.lat;
                          u.longitude = targetLocation.lng;
                          sessionStorage.setItem('auth_user', JSON.stringify(u));
                        }
                      } catch (e) {}
                    } else {
                      setLocationAddress(`Selected Location: ${targetLocation.lat.toFixed(4)}, ${targetLocation.lng.toFixed(4)}`);
                    }
                  } catch (err) {
                    setLocationAddress(`Selected Location: ${targetLocation.lat.toFixed(4)}, ${targetLocation.lng.toFixed(4)}`);
                  } finally {
                    setIsLocating(false);
                  }
                }}
                className="px-5 py-2.5 rounded-xl font-sans font-bold text-[13px] text-white bg-[#137DC5] hover:bg-[#0C5F97] cursor-pointer transition-all shadow-md"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#FAFBFD] items-center justify-center">
        <div className="font-sans font-semibold text-slate-400 text-sm">Loading...</div>
      </div>
    }>
      <PostJobContent />
    </Suspense>
  );
}

