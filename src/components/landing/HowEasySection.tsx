'use client';

import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { getLocalizedValue } from '@/translations/localized';

export default function HowEasySection({ content }: { content?: any }) {
    const { language, t } = useUI();

    const copy = {
        title: getLocalizedValue(content?.title, language, t('landing.how_easy.title')),
        case1Brand: getLocalizedValue(content?.case1_brand, language, 'TESLA'),
        case1Stat: getLocalizedValue(content?.case1_stat, language, t('landing.how_easy.case1_stat')),
        case1Text: getLocalizedValue(content?.case1_text, language, t('landing.how_easy.case1_text')),
        case1Footer: getLocalizedValue(content?.case1_footer, language, t('landing.how_easy.case1_footer')),
        case2Brand: getLocalizedValue(content?.case2_brand, language, 'VOGUE'),
        case2Stat: getLocalizedValue(content?.case2_stat, language, t('landing.how_easy.case2_stat')),
        case2Text: getLocalizedValue(content?.case2_text, language, t('landing.how_easy.case2_text')),
        case2Footer: getLocalizedValue(content?.case2_footer, language, t('landing.how_easy.case2_footer'))
    };

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.how_easy.eyebrow')}</h5>
                    <h2 className="text-4xl lg:text-6xl font-black text-foreground">{copy.title}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="carbon-card p-1 items-center rounded-[3rem] group"
                    >
                        <div className="bg-surface-dark rounded-[2.9rem] p-12 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-10">
                                <div className="text-4xl font-extrabold italic text-red-600 tracking-tighter">{copy.case1Brand}</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-green-400">{copy.case1Stat}</div>
                            </div>
                            <p className="text-xl text-muted mb-10 leading-relaxed font-light">"{copy.case1Text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-red-600 rounded"></div>
                                <div className="text-xs font-bold text-muted uppercase">{copy.case1Footer}</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="carbon-card p-1 items-center rounded-[3rem] group"
                    >
                        <div className="bg-surface-dark rounded-[2.9rem] p-12 h-full flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 animate-pulse"></div>
                            <div className="flex justify-between items-start mb-10">
                                <div className="text-4xl font-extrabold italic text-foreground tracking-widest uppercase">{copy.case2Brand}</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-purple-400">{copy.case2Stat}</div>
                            </div>
                            <p className="text-xl text-muted mb-10 leading-relaxed font-light">"{copy.case2Text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-foreground rounded"></div>
                                <div className="text-xs font-bold text-muted uppercase">{copy.case2Footer}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
