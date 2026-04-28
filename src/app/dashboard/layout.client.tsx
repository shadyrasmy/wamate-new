'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    SquaresFour,
    ChatCircleDots,
    HardDrives,
    UsersThree,
    Crown,
    Code,
    Gear,
    SignOut,
    User,
    WhatsappLogo,
    List,
    X,
    Receipt,
    Shield,
    Sun,
    Moon,
    Translate,
    Heart,
    CaretLeft,
    CaretRight,
    PlugsConnected,
    ChartBar,
    Brain,
    RocketLaunch,
    Funnel,
    ShoppingCart,
    Robot,
    Handshake,
    Warning
} from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme, language, setLanguage, t } = useUI();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'expired' | 'loading'>('loading');
    const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(-1);

    useEffect(() => {
        const collapsed = localStorage.getItem('sidebarCollapsed');
        if (collapsed === 'true') setIsCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState.toString());
    };

    const menuGroups = [
        {
            label: t('dashboard.layout.group_general'),
            items: [
                { icon: SquaresFour, label: t('dashboard.layout.menu_dashboard'), href: '/dashboard' },
                { icon: ChatCircleDots, label: t('dashboard.layout.menu_chat'), href: '/dashboard/chat' },
                { icon: HardDrives, label: t('dashboard.layout.menu_instances'), href: '/dashboard/instances' },
                { icon: UsersThree, label: t('dashboard.layout.menu_seats'), href: '/dashboard/seats' },
                { icon: Crown, label: t('dashboard.layout.menu_upgrade'), href: '/dashboard/plans' },
            ]
        },
        {
            label: t('dashboard.layout.group_ai'),
            aiOnly: true,
            items: [
                { icon: Funnel, label: t('dashboard.layout.menu_leads'), href: '/dashboard/leads' },
                { icon: ShoppingCart, label: t('dashboard.layout.menu_orders'), href: '/dashboard/orders' },
                { icon: Brain, label: t('dashboard.layout.menu_knowledge'), href: '/dashboard/knowledge' },
                { icon: Robot, label: t('dashboard.layout.menu_bots'), href: '/dashboard/bots' },
            ]
        },
        {
            label: t('dashboard.layout.group_dev'),
            items: [
                { icon: Code, label: t('dashboard.layout.menu_api'), href: '/dashboard/api' },
                { icon: PlugsConnected, label: t('dashboard.layout.menu_integrations'), href: '/dashboard/integrations' },
                { icon: Heart, label: t('dashboard.layout.menu_referral'), href: '/dashboard/referral' },
            ]
        },
        {
            label: t('dashboard.layout.group_admin'),
            isAdmin: true,
            items: [
                { icon: Crown, label: t('dashboard.layout.menu_admin_users'), href: '/dashboard/admin/users' },
                { icon: ChartBar, label: t('dashboard.layout.menu_admin_insights'), href: '/dashboard/admin/insights' },
                { icon: Gear, label: t('dashboard.layout.menu_admin_landing'), href: '/dashboard/admin/settings?tab=landing' },
                { icon: Receipt, label: t('dashboard.layout.menu_admin_invoices'), href: '/dashboard/admin/invoices' },
                { icon: Handshake, label: t('dashboard.layout.menu_admin_referrals'), href: '/dashboard/admin/referrals' },
                { icon: Shield, label: t('dashboard.layout.menu_admin_plans'), href: '/dashboard/admin/plans' },
                { icon: Gear, label: t('dashboard.layout.menu_admin_settings'), href: '/dashboard/admin/settings' },
            ]
        }
    ];

    const routeTitle =
        pathname === '/dashboard/admin/settings' && searchParams.get('tab') === 'landing'
            ? t('dashboard.layout.menu_admin_landing')
            : ({
                '/dashboard': t('dashboard.layout.menu_dashboard'),
                '/dashboard/chat': t('dashboard.layout.menu_chat'),
                '/dashboard/instances': t('dashboard.layout.menu_instances'),
                '/dashboard/seats': t('dashboard.layout.menu_seats'),
                '/dashboard/plans': t('dashboard.layout.menu_upgrade'),
                '/dashboard/leads': t('dashboard.layout.menu_leads'),
                '/dashboard/orders': t('dashboard.layout.menu_orders'),
                '/dashboard/knowledge': t('dashboard.layout.menu_knowledge'),
                '/dashboard/bots': t('dashboard.layout.menu_bots'),
                '/dashboard/api': t('dashboard.layout.menu_api'),
                '/dashboard/integrations': t('dashboard.layout.menu_integrations'),
                '/dashboard/referral': t('dashboard.layout.menu_referral'),
                '/dashboard/settings': t('dashboard.layout.settings'),
                '/dashboard/admin/users': t('dashboard.layout.menu_admin_users'),
                '/dashboard/admin/insights': t('dashboard.layout.menu_admin_insights'),
                '/dashboard/admin/invoices': t('dashboard.layout.menu_admin_invoices'),
                '/dashboard/admin/referrals': t('dashboard.layout.menu_admin_referrals'),
                '/dashboard/admin/plans': t('dashboard.layout.menu_admin_plans'),
                '/dashboard/admin/settings': t('dashboard.layout.menu_admin_settings'),
            } as Record<string, string>)[pathname] || t('dashboard.layout.menu_dashboard');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchSubscriptionStatus = async () => {
            try {
                const res = await fetchWithAuth('/auth/me');
                if (res.status === 'success') {
                    setUser(res.data.user);
                    setSubscriptionStatus(res.data.subscription_status || 'active');
                    setDaysUntilExpiry(res.data.days_until_expiry || -1);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
            } catch (error) {
                console.error('Failed to fetch subscription status:', error);
                setSubscriptionStatus('active');
            }
        };

        fetchSubscriptionStatus();
    }, [router]);

    useEffect(() => {
        const isAdmin = user?.role === 'admin';
        const isPlansPage = pathname === '/dashboard/plans';
        const isSettingsPage = pathname === '/dashboard/settings';

        if (subscriptionStatus === 'expired' && !isAdmin && !isPlansPage && !isSettingsPage) {
            router.push('/dashboard/plans');
        }
    }, [subscriptionStatus, pathname, router, user?.role]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
            <aside
                className={`fixed lg:relative z-50 h-full flex-shrink-0 bg-surface border-r border-border flex flex-col pt-8 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'w-20' : 'w-[260px]'}`}
            >
                <div className={`px-6 mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <WhatsappLogo size={24} weight="fill" className="text-white" />
                        </div>
                        {!isCollapsed && <span className="text-2xl font-bold tracking-tight animate-in fade-in duration-500">WaMate</span>}
                    </div>
                    {!isCollapsed && (
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-surface border border-border rounded-full items-center justify-center text-muted hover:text-primary transition shadow-md z-[60]"
                >
                    {isCollapsed ? <CaretRight size={14} weight="bold" /> : <CaretLeft size={14} weight="bold" />}
                </button>

                <nav className="flex-1 space-y-8 overflow-y-auto custom-scroll px-2 py-4">
                    {menuGroups.map((group) => {
                        const visibleItems = group.items.filter(() => {
                            const isAdmin = user?.role === 'admin';
                            if (group.isAdmin && !isAdmin) return false;
                            if (group.aiOnly && !isAdmin && !user?.ai_enabled && !user?.plan?.ai_enabled) return false;
                            return true;
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.label} className="space-y-1">
                                {!isCollapsed && (
                                    <div className="px-8 mb-2 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-primary rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/70">
                                            {group.label}
                                        </span>
                                    </div>
                                )}
                                {visibleItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`py-3 flex items-center gap-4 text-muted hover:text-foreground transition group border-r-4 transition-all
                                            ${isCollapsed ? 'justify-center px-0' : 'px-8'}
                                            ${isActive
                                                    ? 'bg-primary/10 text-primary border-primary'
                                                    : 'border-transparent hover:bg-control'}`}
                                        >
                                            <item.icon size={20} weight={isActive ? 'fill' : 'bold'} className={`group-hover:scale-110 transition flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                            {!isCollapsed && <span className="font-bold text-[10px] uppercase tracking-[0.15em] truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                <div className={`p-4 space-y-2 border-t border-border mt-auto bg-surface/50 ${isCollapsed ? 'items-center' : ''}`}>
                    <div className={`flex ${isCollapsed ? 'flex-col' : 'gap-2'} mb-4`}>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'nova-light' : 'dark')}
                            className={`h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors ${isCollapsed ? 'w-10' : 'flex-1'}`}
                        >
                            {theme === 'dark' ? <Sun size={18} weight="bold" className="text-orange-400" /> : <Moon size={18} weight="bold" className="text-purple-500" />}
                            {!isCollapsed && <span className="text-[9px] font-black uppercase tracking-tighter">{t('dashboard.layout.theme_toggle')}</span>}
                        </button>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                            className={`h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors ${isCollapsed ? 'w-10' : 'flex-1'}`}
                        >
                            <Translate size={18} weight="bold" className="text-primary" />
                            {!isCollapsed && (
                                <span className="text-[9px] font-black uppercase tracking-tighter">
                                    {language === 'en' ? t('common.language_arabic') : t('common.language_english')}
                                </span>
                            )}
                        </button>
                    </div>

                    <Link href="/dashboard/settings" className={`flex items-center gap-4 py-3.5 glass-card rounded-2xl text-muted hover:text-foreground transition ${isCollapsed ? 'justify-center px-0' : 'px-6'} ${pathname === '/dashboard/settings' ? 'text-foreground border-primary/20' : ''}`}>
                        <Gear size={22} weight="bold" className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest truncate">{t('dashboard.layout.settings')}</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 py-3.5 rounded-2xl text-muted hover:text-red-400 hover:bg-red-500/10 transition ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                    >
                        <SignOut size={22} weight="bold" className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest truncate">{t('dashboard.layout.sign_out')}</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col bg-background relative transition-colors duration-300">
                <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 flex-shrink-0 bg-background/80 backdrop-blur-md z-40 transition-colors">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted">
                            <List size={24} />
                        </button>
                        <div>
                            <h2 className="text-lg lg:text-xl font-black capitalize tracking-tight">{routeTitle}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-card rounded-full border-border">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-green-500 tracking-wider uppercase">{t('dashboard.layout.live_system')}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`text-right hidden xs:block ${language === 'ar' ? 'order-last text-left' : ''}`}>
                                <div className="text-sm font-bold">{user?.name || t('dashboard.layout.local_identity')}</div>
                                <div className="text-[9px] text-primary font-black tracking-widest uppercase">
                                    {user?.role === 'admin' ? t('dashboard.layout.enterprise_admin') : (user?.plan?.name || user?.plan || t('dashboard.layout.free_tier'))}
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <User size={20} weight="bold" className="text-primary" />
                            </div>
                        </div>

                        {(user?.role === 'admin' || user?.ai_enabled || user?.plan?.ai_enabled) && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const newStatus = !user?.ai_enabled;
                                    setUser({ ...user, ai_enabled: newStatus });
                                    localStorage.setItem('user', JSON.stringify({ ...user, ai_enabled: newStatus }));
                                    fetchWithAuth('/user/profile', {
                                        method: 'PATCH',
                                        body: JSON.stringify({ ai_enabled: newStatus })
                                    });
                                }}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${user?.ai_enabled ? 'bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10' : 'bg-control border-control-border text-muted'}`}
                            >
                                <RocketLaunch size={18} weight={user?.ai_enabled ? 'fill' : 'bold'} className={user?.ai_enabled ? 'animate-pulse' : ''} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{user?.ai_enabled ? t('dashboard.layout.ai_active') : t('dashboard.layout.ai_standby')}</span>
                            </motion.button>
                        )}
                    </div>
                </header>

                {subscriptionStatus === 'expired' && user?.role !== 'admin' && (
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 px-6 py-3 flex items-center justify-center gap-3">
                        <Warning size={20} weight="fill" className="text-red-400 animate-pulse" />
                        <span className="text-sm font-bold text-red-400">{t('dashboard.layout.subscription_expired')}</span>
                        <Link
                            href="/dashboard/plans"
                            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                        >
                            {t('dashboard.layout.renew_now')}
                        </Link>
                    </div>
                )}

                {subscriptionStatus === 'active' && daysUntilExpiry > 0 && daysUntilExpiry <= 7 && user?.role !== 'admin' && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-center gap-3">
                        <Warning size={18} weight="bold" className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">
                            {t(
                                daysUntilExpiry === 1
                                    ? 'dashboard.layout.subscription_expiring_one'
                                    : 'dashboard.layout.subscription_expiring',
                                { days: daysUntilExpiry }
                            )}
                        </span>
                        <Link
                            href="/dashboard/plans"
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border border-amber-500/30"
                        >
                            {t('dashboard.layout.extend')}
                        </Link>
                    </div>
                )}

                <div className={`flex-1 overflow-y-auto custom-scroll ${pathname === '/dashboard/chat' ? 'p-0 overflow-hidden' : 'p-6 lg:p-10'}`}>
                    {children}
                </div>
            </main>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-overlay backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
