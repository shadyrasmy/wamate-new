'use client';

import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { getLocalizedValue } from '@/translations/localized';

export default function BenefitsSection({ content }: { content?: any }) {
    const { language, t } = useUI();

    const copy = {
        title: getLocalizedValue(content?.title, language, t('landing.benefits.title')),
        subtitle: getLocalizedValue(content?.subtitle, language, t('landing.benefits.subtitle')),
        stat1Title: getLocalizedValue(content?.stat1_title, language, '99.9%'),
        stat1Label: getLocalizedValue(content?.stat1_label, language, t('landing.benefits.stat1_label')),
        stat2Title: getLocalizedValue(content?.stat2_title, language, '< 2s'),
        stat2Label: getLocalizedValue(content?.stat2_label, language, t('landing.benefits.stat2_label')),
        missionTitle: getLocalizedValue(content?.mission_title, language, t('landing.benefits.mission_title')),
        missionText: getLocalizedValue(content?.mission_text, language, t('landing.benefits.mission_text'))
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="carbon-card rounded-[2.5rem] p-10 border-border shadow-2xl overflow-hidden relative"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">{t('landing.benefits.analytics_title')}</h3>
                                <p className="text-muted">{t('landing.benefits.analytics_subtitle')}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-1.5 glass-card rounded-lg text-[10px] font-bold border-border uppercase tracking-widest text-primary">{t('landing.benefits.analytics_badge')}</div>
                            </div>
                        </div>

                        <div className="w-full h-[250px] relative">
                            <svg viewBox="0 0 800 200" className="w-full h-full">
                                <defs>
                                    <linearGradient id="g-purple-benefit" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2 }}
                                    d="M0,150 L50,140 L100,160 L150,120 L200,80 L250,90 L300,40 L350,60 L400,30 L450,70 L500,40 L550,80 L600,30 L650,50 L700,20 L750,40 L800,10"
                                    stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" fill="none"
                                />
                                <path d="M0,150 L50,140 L100,160 L150,120 L200,80 L250,90 L300,40 L350,60 L400,30 L450,70 L500,40 L550,80 L600,30 L650,50 L700,20 L750,40 L800,10 L800,200 L0,200 Z" fill="url(#g-purple-benefit)" />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.benefits.eyebrow')}</h5>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">{copy.title}</h2>
                        <p className="text-muted text-lg leading-relaxed mb-10">
                            {copy.subtitle}
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-3xl font-bold mb-1 text-foreground">{copy.stat1Title}</div>
                                <div className="text-xs text-muted uppercase font-black">{copy.stat1Label}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1 text-foreground">{copy.stat2Title}</div>
                                <div className="text-xs text-muted uppercase font-black">{copy.stat2Label}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="py-24 border-y border-border/60">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-7xl font-black mb-12 text-foreground">
                                {copy.missionTitle}
                            </h2>
                            <p className="text-2xl text-muted leading-relaxed font-light italic">
                                "{copy.missionText}"
                            </p>
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold italic">WM</div>
                                <div className="text-left text-sm">
                                    <div className="font-bold text-foreground">{t('landing.benefits.mission_author')}</div>
                                    <div className="text-muted font-bold uppercase tracking-widest text-[10px]">{t('landing.benefits.mission_role')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
