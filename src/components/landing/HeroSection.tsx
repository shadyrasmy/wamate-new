'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, WhatsappLogo, Lightning } from '@phosphor-icons/react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { getLocalizedValue } from '@/translations/localized';

export default function HeroSection({ content }: { content?: any }) {
    const { language, t } = useUI();

    const copy = {
        title: getLocalizedValue(content?.title, language, t('landing.hero.title')),
        subtitle: getLocalizedValue(content?.subtitle, language, t('landing.hero.subtitle')),
        ctaPrimary: getLocalizedValue(content?.cta_primary, language, t('landing.hero.cta_primary')),
        ctaSecondary: getLocalizedValue(content?.cta_secondary, language, t('landing.hero.cta_secondary'))
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-control border border-control-border text-xs font-medium text-primary mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {t('landing.hero.badge')}
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
                        {copy.title}
                    </h1>
                    <p className="text-lg text-muted mb-8 max-w-xl mx-auto lg:mx-0">
                        {copy.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition flex items-center gap-2 shadow-xl shadow-primary/20">
                            {copy.ctaPrimary} <ArrowRight weight="bold" />
                        </Link>
                        <button className="px-8 py-4 carbon-card rounded-full font-bold hover:bg-control transition flex items-center gap-2 border border-border text-foreground group">
                            <PlayCircle size={24} weight="fill" className="text-primary group-hover:scale-110 transition" />
                            {copy.ctaSecondary}
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative flex items-center justify-center h-[500px]"
                >
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative z-20 w-32 h-32 bg-wa-green rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(37,211,102,0.4)]"
                    >
                        <WhatsappLogo size={64} weight="fill" className="text-white" />
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[300px] h-[300px] border border-border rounded-full absolute"></div>
                        <div className="w-[450px] h-[450px] border border-border rounded-full absolute"></div>
                        <div className="w-[600px] h-[600px] border border-border/50 rounded-full absolute"></div>
                    </div>

                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-[300px] h-[300px] pointer-events-none"
                        >
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                            >
                                <div className="p-3 carbon-card glass-card rounded-2xl flex items-center gap-3 w-44 border-border shadow-2xl">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">AG</div>
                                    <div className="text-[10px]">
                                        <div className="font-bold text-foreground">{t('landing.hero.orbit_agent_title')}</div>
                                        <div className="text-gray-400">{t('landing.hero.orbit_agent_subtitle')}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-[450px] h-[450px] pointer-events-none"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                                className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 pointer-events-auto"
                            >
                                <div className="p-3 carbon-card glass-card rounded-2xl flex items-center gap-3 border-border shadow-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Lightning size={20} weight="bold" />
                                    </div>
                                    <div className="text-[10px]">
                                        <div className="font-bold text-foreground">{t('landing.hero.orbit_auto_title')}</div>
                                        <div className="text-muted">{t('landing.hero.orbit_auto_subtitle')}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
