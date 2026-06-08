'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, Clock, Search, Check, Droplet, Zap, Paintbrush, Scissors, Sparkles } from 'lucide-react';
import { authApi } from '@/utils/api';
import { useLanguage } from '@/utils/LanguageContext';

const getServiceIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('clean')) return Home;
  if (n.includes('plumb')) return Droplet;
  if (n.includes('elect')) return Zap;
  if (n.includes('paint')) return Paintbrush;
  if (n.includes('hair') || n.includes('cut')) return Scissors;
  return Sparkles;
};

export default function BookingWidget({ locations }) {
  const router = useRouter();
  const { tr } = useLanguage();
  const [service, setService] = useState('');
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  
  const [expectedTime, setExpectedTime] = useState('');
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  const [rooms, setRooms] = useState();
  const [sqm, setSqm] = useState();
  
  const [location, setLocation] = useState('Munich, Germany , 110015');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [autoAssign, setAutoAssign] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [servicesList, setServicesList] = useState([
  ]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [dynamicMaterials, setDynamicMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('is_logged_in') === 'true';
        const res = isLoggedIn 
          ? await authApi.getServicesDropdown() 
          : await authApi.getServicesWebList();
        if (res && res.data && res.data.length > 0) {
          const mapped = res.data.map(svc => ({
            id: svc.id,
            name: svc.name,
            icon: getServiceIcon(svc.name)
          }));
          setServicesList(mapped);
          // Set default to the first loaded service if current is not in the list
          if (!mapped.some(m => m.name === service)) {
            setService(mapped[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load services in BookingWidget:', err);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    async function loadMaterials() {
      const selected = servicesList.find(s => s.name === service);
      if (selected && selected.id) {
        try {
          const data = await authApi.getServiceMaterials(selected.id);
          if (data && data.data && data.data.materials) {
            setDynamicMaterials(data.data.materials);
            setSelectedMaterials([]);
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
    if (servicesList.length > 0) {
      loadMaterials();
    }
  }, [service, servicesList]);

  useEffect(() => {
    const syncLocation = () => {
      try {
        const storedUser = sessionStorage.getItem('auth_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.location) {
            setLocation(u.location);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('locationChanged', syncLocation);
    syncLocation();

    return () => {
      window.removeEventListener('locationChanged', syncLocation);
    };
  }, []);

  const handleToggleMaterial = (matId) => {
    setSelectedMaterials(prev => 
      prev.includes(matId) ? prev.filter(id => id !== matId) : [...prev, matId]
    );
  };

  const timesList = [
    '1 Hour',
    '2 Hours',
    '3 Hours',
    '4 Hours',
    '5 Hours',
    '6 Hours',
    '7 Hours',
    '8 Hours'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!service) {
      setValidationError(tr('booking.errService', 'Please select a service type.'));
      return;
    }
    if (!expectedTime || parseInt(expectedTime, 10) <= 0) {
      setValidationError(tr('booking.errTime', 'Please enter a valid expected time (greater than 0 hours).'));
      return;
    }
    if (!rooms || parseInt(rooms, 10) <= 0) {
      setValidationError(tr('booking.errRooms', 'Please enter a valid number of rooms (greater than 0).'));
      return;
    }
    if (!sqm || parseInt(sqm, 10) <= 0) {
      setValidationError(tr('booking.errSqm', 'Please enter valid square meters (sqm greater than 0).'));
      return;
    }
    if (!location || !location.trim()) {
      setValidationError(tr('booking.errLocation', 'Please enter a valid service area location.'));
      return;
    }

    setValidationError('');
    const cleanRooms = rooms;
    const cleanSqm = sqm;
    const cleanExpectedTime = expectedTime.toString().replace(' Hours', '').replace(' Hour', '');
    
    let lat = '';
    let lng = '';
    try {
      const storedUser = sessionStorage.getItem('auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.latitude) lat = u.latitude.toString();
        if (u.longitude) lng = u.longitude.toString();
      }
    } catch (e) {}

    router.push(`/workers?service=${encodeURIComponent(service)}&date=${encodeURIComponent('12 May 2025')}&rooms=${encodeURIComponent(cleanRooms)}&sqm=${encodeURIComponent(cleanSqm)}&expected_time=${encodeURIComponent(cleanExpectedTime)}&location=${encodeURIComponent(location || 'Berlin, Germany')}&autoAssign=${autoAssign}&material_amount_ids=${encodeURIComponent(JSON.stringify(selectedMaterials))}&latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}`);
  };

  const SelectedIcon = servicesList.find((s) => s.name === service)?.icon || Home;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgba(9,32,64,0.04)] p-6 sm:p-7 relative z-30">
      <form onSubmit={handleSearch} className="flex flex-col gap-6">
        
        {/* Main Grid: Top Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          
          {/* Dropdown: Service Type */}
          <div className="relative flex flex-col gap-1.5">
            <label className="font-sans font-semibold text-[13px] text-slate-600 text-left">
              {tr('booking.whatService', 'What service do you need?')}
            </label>
            <button
              type="button"
              onClick={() => {
                setIsServiceOpen(!isServiceOpen);
                setIsTimeOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-sans font-semibold text-[13.5px] hover:border-slate-300 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <SelectedIcon className="w-4.5 h-4.5 text-primary" />
                <span>{service}</span>
              </div>
              <span className="text-slate-400 text-[9px]">▼</span>
            </button>
            
            {isServiceOpen && (
              <div className="absolute bottom-[102%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-premium py-1.5 z-40 animate-fadeIn">
                {servicesList.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setService(item.name);
                        setIsServiceOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3.5 py-2.5 text-left font-sans text-[12px] text-slate-650 hover:bg-slate-50 hover:text-primary transition-all cursor-pointer ${service === item.name ? 'bg-blue-50/50 text-primary font-bold' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                        <span>{item.name}</span>
                      </div>
                      {service === item.name && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input: Expected Time */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="font-sans font-semibold text-[13px] text-slate-600 text-left">
              {tr('booking.expectedTime', 'Expected Time (Hrs)')}
            </label>
            <div className="flex items-center gap-2.5 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-primary transition-all">
              <Clock className="w-4.5 h-4.5 text-primary flex-shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={expectedTime}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9\b]+$/.test(val)) {
                    setExpectedTime(val);
                  }
                }}
                placeholder={tr('booking.enterHours', 'Enter Hours')}
                className="w-full bg-transparent outline-none font-sans font-semibold text-[13.5px] text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Input: Room */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="font-sans font-semibold text-[13px] text-slate-600 text-left">
              {tr('booking.room', 'Room')}
            </label>
            <div className="flex items-center gap-2.5 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-primary transition-all">
              <Home className="w-4.5 h-4.5 text-primary flex-shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={rooms || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9\b]+$/.test(val)) {
                    setRooms(val);
                  }
                }}
                placeholder={tr('booking.enterRooms', 'Enter Rooms')}
                className="w-full bg-transparent outline-none font-sans font-semibold text-[13.5px] text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Input: sqm */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="font-sans font-semibold text-[13px] text-slate-600 text-left">
              {tr('booking.sqm', 'sqm')}
            </label>
            <div className="flex items-center gap-2.5 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-primary transition-all">
              <span className="text-[10px] font-extrabold text-[#137dc5] border border-blue-200 bg-blue-50 rounded px-1 py-0.5 leading-none select-none flex-shrink-0">m²</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={sqm || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9\b]+$/.test(val)) {
                    setSqm(val);
                  }
                }}
                placeholder={tr('booking.enterSqm', 'Enter sqm')}
                className="w-full bg-transparent outline-none font-sans font-semibold text-[13.5px] text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

        </div>

        {/* Dynamic Materials */}
        {dynamicMaterials.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="font-sans font-semibold text-[13px] text-slate-600 w-full text-left">{tr('booking.additionalMaterials', 'Additional Materials Needed?')}</span>
            {dynamicMaterials.map((mat) => (
              <label key={mat.id} className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-lg px-4 py-2 hover:border-primary transition-all">
                <input 
                  type="checkbox" 
                  checked={selectedMaterials.includes(mat.id)}
                  onChange={() => handleToggleMaterial(mat.id)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="font-sans text-[13px] font-semibold text-slate-700 select-none">{mat.material_name}</span>
              </label>
            ))}
          </div>
        )}

        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-650 rounded-xl p-3.5 text-[12.5px] font-semibold text-left">
            {validationError}
          </div>
        )}

        {/* Lower Row: Location and Options (Horizontal alignment matching original) */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between pt-4 border-t border-slate-100">
          
          {/* Location Field - Spans wider on desktop with dynamic suggestions */}
          <div className="relative flex-1 w-full md:max-w-2xl">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 w-full focus-within:border-primary transition-all">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setIsLocationOpen(true);
                }}
                onFocus={() => setIsLocationOpen(true)}
                onBlur={() => setTimeout(() => setIsLocationOpen(false), 200)}
                placeholder={tr('booking.enterLocation', 'Enter Location / Postal Code')}
                className="w-full bg-transparent outline-none font-sans font-semibold text-[13.5px] text-slate-700 placeholder-slate-400"
              />
            </div>
            {isLocationOpen && (
              <div className="absolute bottom-[102%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-premium py-1.5 z-45 animate-fadeIn text-left">
                {Array.from(new Set((locations || []).map(l => l.city).filter(Boolean)))
                  .filter(city => city.toLowerCase().includes((location || '').toLowerCase()))
                  .map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setLocation(`${city}, Germany`);
                        setIsLocationOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3.5 py-2.5 text-left font-sans text-[12.5px] text-slate-650 hover:bg-slate-50 hover:text-primary transition-all cursor-pointer"
                    >
                      <span>{city}, Germany</span>
                    </button>
                  ))}
                {(!locations || locations.length === 0) && ['Berlin', 'Munich', 'Hamburg', 'Frankfurt']
                  .filter(city => city.toLowerCase().includes((location || '').toLowerCase()))
                  .map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setLocation(`${city}, Germany`);
                        setIsLocationOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3.5 py-2.5 text-left font-sans text-[12.5px] text-slate-650 hover:bg-slate-50 hover:text-primary transition-all cursor-pointer"
                    >
                      <span>{city}, Germany</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Toggle and Search Button Row */}
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
            
            {/* Auto Assign Toggle (Premium custom slider matching original) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAutoAssign(!autoAssign)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoAssign ? 'bg-primary' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoAssign ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="font-sans font-bold text-slate-700 text-[13.5px] whitespace-nowrap">
                {tr('booking.assignAutoWorker', 'Assign Auto Worker')}
              </span>
            </div>

            {/* Find Workers Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-sans font-bold text-[13.5px] rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex-shrink-0"
            >
              <span>{tr('booking.findWorkers', 'Find Workers')}</span>
              <Search className="w-4 h-4" />
            </button>

          </div>

        </div>

      </form>
    </div>
  );
}
