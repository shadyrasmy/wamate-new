'use client';

import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function AboutPage() {
    const { t } = useUI();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">{t('about.title')}</h1>
                <p className="theme-copy font-medium">
                    {t('about.body')}
                </p>
                <div className="pt-10 flex justify-center">
                    <Link href="/" className="theme-button-secondary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        {t('about.cta')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
