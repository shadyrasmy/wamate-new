'use client';

import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function PricingPage() {
    const { t } = useUI();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">{t('pricing.title')}</h1>
                <p className="theme-copy font-medium">
                    {t('pricing.body')}
                </p>
                <div className="pt-10 flex justify-center">
                    <Link href="/register" className="theme-button-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105">
                        {t('pricing.cta')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
