'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    Translate
} from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme, language, setLanguage, t } = useUI();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<any>(null);

    const menuItems = [
        { icon: SquaresFour, label: t('dashboard'), href: '/dashboard' },
        { icon: ChatCircleDots, label: t('chat_center'), href: '/dashboard/chat' },
        { icon: HardDrives, label: t('instances'), href: '/dashboard/instances' },
        { icon: UsersThree, label: t('team_seats'), href: '/dashboard/seats' },
        { icon: Crown, label: 'Manage Nodes', href: '/dashboard/admin/users', isAdmin: true },
        { icon: Receipt, label: 'Network Invoices', href: '/dashboard/admin/invoices', isAdmin: true },
        { icon: Shield, label: 'Service Plans', href: '/dashboard/admin/plans', isAdmin: true },
        { icon: Gear, label: 'Command Center', href: '/dashboard/admin/settings', isAdmin: true },
        { icon: Crown, label: t('upgrade'), href: '/dashboard/plans' },
        { icon: Code, label: t('api_center'), href: '/dashboard/api' },
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
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">

            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 h-full w-[260px] flex-shrink-0 bg-surface border-r border-border flex flex-col pt-8 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="px-8 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <WhatsappLogo size={24} weight="fill" className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">WaMate</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto custom-scroll px-2">
                    {menuItems.filter(item => !item.isAdmin || user?.role === 'admin').map((item) => {
                        const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-8 py-3.5 flex items-center gap-4 text-gray-400 hover:text-foreground transition group border-r-4 transition-all ${isActive
                                    ? 'bg-primary/10 text-primary border-primary'
                                    : 'border-transparent'}`}
                            >
                                <item.icon size={22} weight={isActive ? "fill" : "bold"} className="group-hover:scale-110 transition" />
                                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-2 border-t border-border mt-auto bg-surface/50">
                    {/* Theme & Language Toggles */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'nova-light' : 'dark')}
                            className="flex-1 h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={18} weight="bold" className="text-orange-400" /> : <Moon size={18} weight="bold" className="text-purple-500" />}
                            <span className="text-[9px] font-black uppercase tracking-tighter">{t('theme_toggle')}</span>
                        </button>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                            className="flex-1 h-10 bg-background border border-border rounded-xl flex items-center justify-center gap-2 hover:border-primary/50 transition transition-colors"
                        >
                            <Translate size={18} weight="bold" className="text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{language === 'en' ? 'العربية' : 'English'}</span>
                        </button>
                    </div>

                    <Link href="/dashboard/settings" className={`flex items-center gap-4 px-6 py-3.5 glass-card rounded-2xl text-gray-400 hover:text-foreground transition ${pathname === '/dashboard/settings' ? 'text-foreground border-primary/20' : ''}`}>
                        <Gear size={22} weight="bold" />
                        <span className="font-bold text-xs uppercase tracking-widest">{t('settings')}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition"
                    >
                        <SignOut size={22} weight="bold" />
                        <span className="font-bold text-xs uppercase tracking-widest">{t('sign_out')}</span>
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
                                <div className="text-[9px] text-primary font-black tracking-widest uppercase">{user?.role === 'admin' ? t('enterprise_admin') : (user?.plan || t('free_tier'))}</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <User size={20} weight="bold" className="text-primary" />
                            </div>
                        </div>
                    </div>
                </header>

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
