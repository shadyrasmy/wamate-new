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

  const show = (section: string) => {
    if (!config || !config.cms_visibility) return true; // Default to showing if not loaded
    return config.cms_visibility[section] !== false;
  };

  return (
    <main className="min-h-screen bg-background text-white overflow-x-hidden">
      {show('hero') && <HeroSection content={config?.landing_content?.hero} />}
      {show('numbers') && <NumbersSection content={config?.landing_content?.numbers} />}
      {show('whyUs') && <WhyUsSection content={config?.landing_content?.whyUs} />}
      {show('benefits') && <BenefitsSection content={config?.landing_content?.benefits} />}
      {show('howEasy') && <HowEasySection content={config?.landing_content?.howEasy} />}
      <Footer />
    </main>
  );
}
