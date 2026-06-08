'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToDashboardOrders() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/orders');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFCFF] font-sans">
      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#137DC5] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-500 font-bold text-sm">Redirecting to Dashboard Orders...</span>
      </div>
    </div>
  );
}
