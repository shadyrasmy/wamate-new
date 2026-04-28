'use client';

import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { getLocalizedValue } from '@/translations/localized';

export default function NumbersSection({ content }: { content?: any }) {
    const { language, t } = useUI();

    const stats = [
        {
            value: getLocalizedValue(content?.stat1_title, language, '99.99%'),
            label: getLocalizedValue(content?.stat1_label, language, t('landing.numbers.stat1_label'))
        },
        {
            value: getLocalizedValue(content?.stat2_title, language, '24/7'),
            label: getLocalizedValue(content?.stat2_label, language, t('landing.numbers.stat2_label'))
        },
        {
            value: getLocalizedValue(content?.stat3_title, language, '<10ms'),
            label: getLocalizedValue(content?.stat3_label, language, t('landing.numbers.stat3_label'))
        }
    ];

    return (
        <div className="py-24 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-4xl lg:text-7xl font-black mb-10 text-foreground/20 select-none tracking-widest uppercase">
                        {getLocalizedValue(content?.title, language, t('landing.numbers.title'))}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl">
                        {stats.map((stat) => (
                            <div key={`${stat.value}-${stat.label}`}>
                                <div className="text-4xl lg:text-5xl font-bold mb-2 text-foreground">{stat.value}</div>
                                <div className="text-[10px] text-primary font-black uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-[0.02] pointer-events-none select-none">
                <div className="flex animate-marquee whitespace-nowrap text-[120px] font-black italic">
                    <span className="mx-10 whitespace-nowrap">{t('landing.numbers.marquee')}</span>
                    <span className="mx-10 whitespace-nowrap">{t('landing.numbers.marquee')}</span>
                </div>
            </div>
        </div>
    );
}
