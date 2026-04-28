'use client';

import Link from 'next/link';
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { useUI } from '@/context/UIContext';

export default function Footer() {
    const { t } = useUI();

    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <WhatsappLogo size={24} weight="fill" className="text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">{t('common.app_name')}</span>
                        </div>
                        <p className="theme-copy font-medium text-sm leading-relaxed max-w-xs">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">{t('footer.links_title')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.about')}</Link></li>
                            <li><Link href="/features" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.features')}</Link></li>
                            <li><Link href="/pricing" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.pricing')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">{t('footer.compliance_title')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.privacy')}</Link></li>
                            <li><Link href="/terms" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.terms')}</Link></li>
                            <li><Link href="/cookies" className="theme-copy hover:text-primary transition text-sm font-medium">{t('footer.cookies')}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">{t('footer.support_title')}</h4>
                        <p className="theme-copy text-sm font-medium">{t('footer.support_description')}</p>
                        <div className="theme-panel flex items-center gap-2 px-4 py-2 rounded-xl w-fit">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t('footer.grid_online')}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                        {t('footer.copyright', { year: new Date().getFullYear() })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
