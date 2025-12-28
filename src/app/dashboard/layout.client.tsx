'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    Users,
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
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'expired' | 'loading'>('loading');
    const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(-1);

    // Load states from localStorage
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
            label: 'General Intelligence',
            items: [
                { icon: SquaresFour, label: t('dashboard'), href: '/dashboard' },
                { icon: ChatCircleDots, label: t('chat_center'), href: '/dashboard/chat' },
                { icon: HardDrives, label: t('instances'), href: '/dashboard/instances' },
                { icon: UsersThree, label: t('team_seats'), href: '/dashboard/seats' },
                { icon: Crown, label: t('upgrade'), href: '/dashboard/plans' },
            ]
        },
        {
            label: 'AI Commerce',
            aiOnly: true,
            items: [
                { icon: Funnel, label: 'Sales Leads', href: '/dashboard/leads' },
                { icon: ShoppingCart, label: 'Order Pipeline', href: '/dashboard/orders' },
                { icon: Brain, label: 'Knowledge Base', href: '/dashboard/knowledge' },
                { icon: Robot, label: 'Specialized Bots', href: '/dashboard/bots' },
            ]
        },
        {
            label: 'Developer Ecosystem',
            items: [
                { icon: Code, label: t('api_center'), href: '/dashboard/api' },
                { icon: PlugsConnected, label: 'Integrations', href: '/dashboard/integrations' },
                { icon: Heart, label: 'Share Love & Earn', href: '/dashboard/referral' },
            ]
        },
        {
            label: 'Admin Command',
            isAdmin: true,
            items: [
                { icon: Crown, label: 'Manage Nodes', href: '/dashboard/admin/users' },
                { icon: ChartBar, label: 'Analytics Insights', href: '/dashboard/admin/insights' },
                { icon: Gear, label: 'Landing CMS', href: '/dashboard/admin/settings?tab=landing' },
                { icon: Receipt, label: 'Network Invoices', href: '/dashboard/admin/invoices' },
                { icon: Handshake, label: 'Affiliates', href: '/dashboard/admin/referrals' },
                { icon: Shield, label: 'Service Plans', href: '/dashboard/admin/plans' },
                { icon: Gear, label: 'System Protocols', href: '/dashboard/admin/settings' },
            ]
        }
    ];

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

        // Fetch fresh user data including subscription status
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
                setSubscriptionStatus('active'); // Fallback to active on error
            }
        };

        fetchSubscriptionStatus();
    }, [router]);

    // Redirect to plans page if subscription is expired (except for /plans itself)
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
            {/* Sidebar */}
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
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Collapse Toggle Button (Desktop) */}
                <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-surface border border-border rounded-full items-center justify-center text-gray-400 hover:text-primary transition shadow-md z-[60]"
                >
                    {isCollapsed ? <CaretRight size={14} weight="bold" /> : <CaretLeft size={14} weight="bold" />}
                </button>

                <nav className="flex-1 space-y-8 overflow-y-auto custom-scroll px-2 py-4">
                    {menuGroups.map((group) => {
                        const visibleItems = group.items.filter(item => {
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
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400/60">
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
                                            className={`py-3 flex items-center gap-4 text-gray-400 hover:text-foreground transition group border-r-4 transition-all
                                            ${isCollapsed ? 'justify-center px-0' : 'px-8'}
                                            ${isActive
                                                    ? 'bg-primary/10 text-primary border-primary'
                                                    : 'border-transparent hover:bg-white/[0.02]'}`}
                                        >
                                            <item.icon size={20} weight={isActive ? "fill" : "bold"} className={`group-hover:scale-110 transition flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                            {!isCollapsed && <span className="font-bold text-[10px] uppercase tracking-[0.15em] truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                <div className={`p-4 space-y-2 border-t border-border mt-auto bg-surface/50 ${isCollapsed ? 'items-center' : ''}`}>
                    {/* Theme & Language Toggles */}
                    <div className={`flex ${isCollapsed ? 'flex-col' : 'gap-2'} mb-4`}>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'nova-light' : 'dark')}
                            className={`h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors ${isCollapsed ? 'w-10' : 'flex-1'}`}
                        >
                            {theme === 'dark' ? <Sun size={18} weight="bold" className="text-orange-400" /> : <Moon size={18} weight="bold" className="text-purple-500" />}
                            {!isCollapsed && <span className="text-[9px] font-black uppercase tracking-tighter">{t('theme_toggle')}</span>}
                        </button>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                            className={`h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors ${isCollapsed ? 'w-10' : 'flex-1'}`}
                        >
                            <Translate size={18} weight="bold" className="text-primary" />
                            {!isCollapsed && <span className="text-[9px] font-black uppercase tracking-tighter">{language === 'en' ? 'العربية' : 'English'}</span>}
                        </button>
                    </div>

                    <Link href="/dashboard/settings" className={`flex items-center gap-4 py-3.5 glass-card rounded-2xl text-gray-400 hover:text-foreground transition ${isCollapsed ? 'justify-center px-0' : 'px-6'} ${pathname === '/dashboard/settings' ? 'text-foreground border-primary/20' : ''}`}>
                        <Gear size={22} weight="bold" className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest truncate">{t('settings')}</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 py-3.5 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                    >
                        <SignOut size={22} weight="bold" className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest truncate">{t('sign_out')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col bg-background relative transition-colors duration-300">

                <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 flex-shrink-0 bg-background/80 backdrop-blur-md z-40 transition-colors">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400">
                            <List size={24} />
                        </button>
                        <div>
                            <h2 className="text-lg lg:text-xl font-black capitalize tracking-tight">
                                {t(pathname.split('/').pop()?.replace(/-/g, '_') || 'dashboard')}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Status */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-card rounded-full border-border">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-green-500 tracking-wider uppercase">{t('live_system')}</span>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className={`text-right hidden xs:block ${language === 'ar' ? 'order-last text-left' : ''}`}>
                                <div className="text-sm font-bold">{user?.name || t('local_identity')}</div>
                                <div className="text-[9px] text-primary font-black tracking-widest uppercase">{user?.role === 'admin' ? t('enterprise_admin') : (user?.plan?.name || user?.plan || t('free_tier'))}</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <User size={20} weight="bold" className="text-primary" />
                            </div>
                        </div>

                        {/* AI Global Toggle */}
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
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${user?.ai_enabled ? 'bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 text-gray-500'}`}
                            >
                                <RocketLaunch size={18} weight={user?.ai_enabled ? "fill" : "bold"} className={user?.ai_enabled ? "animate-pulse" : ""} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{user?.ai_enabled ? 'AI ACTIVE' : 'AI STANDBY'}</span>
                            </motion.button>
                        )}
                    </div>
                </header>

                {/* Subscription Expiry Banner */}
                {subscriptionStatus === 'expired' && user?.role !== 'admin' && (
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 px-6 py-3 flex items-center justify-center gap-3">
                        <Warning size={20} weight="fill" className="text-red-400 animate-pulse" />
                        <span className="text-sm font-bold text-red-400">
                            Your subscription has expired!
                        </span>
                        <Link
                            href="/dashboard/plans"
                            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                        >
                            Renew Now
                        </Link>
                    </div>
                )}

                {/* Warning Banner for Expiring Soon (7 days or less) */}
                {subscriptionStatus === 'active' && daysUntilExpiry > 0 && daysUntilExpiry <= 7 && user?.role !== 'admin' && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-center gap-3">
                        <Warning size={18} weight="bold" className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">
                            Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                        </span>
                        <Link
                            href="/dashboard/plans"
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border border-amber-500/30"
                        >
                            Extend
                        </Link>
                    </div>
                )}

                {/* Scrolled Content */}
                <div className={`flex-1 overflow-y-auto custom-scroll ${pathname === '/dashboard/chat' ? 'p-0 overflow-hidden' : 'p-6 lg:p-10'}`}>
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
