'use client';

import Footer from '@/components/layout/Footer';
import { useUI } from '@/context/UIContext';

export default function TermsPage() {
    const { t } = useUI();
    const sections = [
        { title: t('legal.terms.section1_title'), body: t('legal.terms.section1_body') },
        { title: t('legal.terms.section2_title'), body: t('legal.terms.section2_body') },
        { title: t('legal.terms.section3_title'), body: t('legal.terms.section3_body') },
        { title: t('legal.terms.section4_title'), body: t('legal.terms.section4_body') }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <div className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-5xl font-black mb-12 tracking-tight">{t('legal.terms.title')}</h1>

                <div className="space-y-12 theme-copy font-medium leading-relaxed">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="theme-section-title mb-6 text-sm">{section.title}</h2>
                            <p>{section.body}</p>
                        </section>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
