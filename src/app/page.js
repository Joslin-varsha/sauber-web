'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import Hero from '@/components/Hero';
import PopularServices from '@/components/PopularServices';
import PopularWorkers from '@/components/PopularWorkers';
import WhyAndDownload from '@/components/WhyAndDownload';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import DashboardFooter from '@/components/DashboardFooter';
import { authApi } from '@/utils/api';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popularServices, setPopularServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check login state and fetch home details on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(sessionStorage.getItem('is_logged_in') === 'true');
    }

    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const res = await authApi.getHomeData();
        if (res && res.status && res.data) {
          setPopularServices(res.data.popularServices || []);
          setLocations(res.data.locations || []);
        }
      } catch (err) {
        console.error('Failed to fetch home page details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Frosted Sticky Navigation bar */}
      {isLoggedIn ? <DashboardHeader /> : <Header />}

      {/* Main Content Body */}
      <main className="flex-grow">
        {/* 2. Hero showcase & search widget */}
        <Hero locations={locations} />

        {/* 3. Popular services quick grid */}
        <PopularServices services={popularServices} isLoading={isLoading} />

        {/* 4. Verified worker cards - Hidden on mobile */}
        <div className="hidden md:block">
          <PopularWorkers />
        </div>

        {/* 5. How It Works, Why Choose Sauber & CSS phone device mockup */}
        <WhyAndDownload />

        {/* 7. Rating feedback slider */}
        <Testimonials />
      </main>

      {/* 8. Highlights bar & details footer */}
      {isLoggedIn ? <DashboardFooter /> : <Footer />}
    </div>
  );
}
