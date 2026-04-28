'use client';

import { motion } from 'framer-motion';
import { Stack, Repeat, ShieldCheck } from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';
import { getLocalizedValue } from '@/translations/localized';

export default function WhyUsSection({ content }: { content?: any }) {
    const { language, t } = useUI();

    const copy = {
        title: getLocalizedValue(content?.title, language, t('landing.why_us.title')),
        subtitle: getLocalizedValue(content?.subtitle, language, t('landing.why_us.subtitle')),
        card1Title: getLocalizedValue(content?.card1_title, language, t('landing.why_us.card1_title')),
        card1Desc: getLocalizedValue(content?.card1_desc, language, t('landing.why_us.card1_desc')),
        card2Title: getLocalizedValue(content?.card2_title, language, t('landing.why_us.card2_title')),
        card2Desc: getLocalizedValue(content?.card2_desc, language, t('landing.why_us.card2_desc')),
        card3Title: getLocalizedValue(content?.card3_title, language, t('landing.why_us.card3_title')),
        card3Desc: getLocalizedValue(content?.card3_desc, language, t('landing.why_us.card3_desc'))
    };

    const features = [
        {
            icon: Stack,
            title: copy.card1Title,
            desc: copy.card1Desc,
            color: 'text-purple-400',
            bg: 'bg-purple-600/10',
            border: 'hover:border-purple-500/50'
        },
        {
            icon: ShieldCheck,
            title: copy.card2Title,
            desc: copy.card2Desc,
            color: 'text-blue-400',
            bg: 'bg-blue-600/10',
            border: 'hover:border-blue-500/50'
        },
        {
            icon: Repeat,
            title: copy.card3Title,
            desc: copy.card3Desc,
            color: 'text-green-400',
            bg: 'bg-green-600/10',
            border: 'hover:border-green-500/50'
        }
    ];

    return (
        <section id="features" className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.why_us.eyebrow')}</h5>
                        <h2 className="text-4xl lg:text-6xl font-bold font-sans text-foreground">
                            {copy.title}
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-muted max-w-sm mt-6 md:mt-0"
                    >
                        {copy.subtitle}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`carbon-card p-10 rounded-[2.5rem] group border-border transition-all duration-500 ${feature.border}`}
                        >
                            <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 border border-border group-hover:bg-primary transition-all duration-500 shadow-lg`}>
                                <feature.icon size={32} weight="bold" className={`${feature.color} group-hover:text-white transition-colors`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                            <p className="text-muted leading-relaxed font-sans">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
