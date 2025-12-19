'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import HeroSection from '@/components/landing/HeroSection';
import WhyUsSection from '@/components/landing/WhyUsSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import NumbersSection from '@/components/landing/NumbersSection';
import HowEasySection from '@/components/landing/HowEasySection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/config/public`);
        if (res.ok) {
          const data = await res.json();
          setConfig(data.data.config);
        }
      } catch (error) {
        console.error('Failed to load public config', error);
      }
    };
    loadConfig();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role === 'admin') setIsAdmin(true);
  }, []);

  const show = (section: string) => {
    if (!config || !config.cms_visibility) return true; // Default to showing if not loaded
    return config.cms_visibility[section] !== false;
  };

  return (
    <main className="min-h-screen bg-background text-white overflow-x-hidden relative">
      {isAdmin && (
        <a
          href="/dashboard/admin/settings?tab=landing"
          className="fixed bottom-10 right-10 z-[100] bg-primary text-white p-4 rounded-2xl shadow-2xl shadow-primary/40 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-110 active:scale-95 transition"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Edit Landing Content
        </a>
      )}
      {show('hero') && <HeroSection content={config?.landing_content?.hero} />}
      {show('numbers') && <NumbersSection content={config?.landing_content?.numbers} />}
      {show('whyUs') && <WhyUsSection content={config?.landing_content?.whyUs} />}
      {show('benefits') && <BenefitsSection content={config?.landing_content?.benefits} />}
      {show('howEasy') && <HowEasySection content={config?.landing_content?.howEasy} />}
      <Footer />
    </main>
  );
}
