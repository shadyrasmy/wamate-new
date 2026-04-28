'use client';

import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function FeaturesPage() {
    const { t } = useUI();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">{t('features.title')}</h1>
                <p className="theme-copy font-medium">
                    {t('features.body')}
                </p>
                <div className="pt-10 flex justify-center gap-4">
                    <Link href="/" className="theme-button-secondary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        {t('features.secondary_cta')}
                    </Link>
                    <Link href="/register" className="theme-button-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        {t('features.primary_cta')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
