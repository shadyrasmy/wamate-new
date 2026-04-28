'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    ChatCircleDots,
    DeviceMobile,
    UsersThree,
    Lightning,
    CaretRight,
    ArrowUpRight,
    Circle,
    Spinner
} from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function DashboardHome() {
    const { t } = useUI();
    const [stats, setStats] = useState({
        messagesSent: 0,
        messageLimit: 0,
        instanceCount: 0,
        seatCount: 0,
        quotaUsed: 0
    });
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [userRes, seatsRes, instancesRes] = await Promise.all([
                fetchWithAuth('/auth/me'),
                fetchWithAuth('/seats/manage'),
                fetchWithAuth('/instances')
            ]);

            const nextUser = userRes.data.user;
            const seats = seatsRes.data.seats || [];
            const instances = instancesRes.data.instances || [];

            setUser(nextUser);
            setStats({
                messagesSent: nextUser.messages_sent_current_period || 0,
                messageLimit: nextUser.monthly_message_limit || 0,
                instanceCount: instances.length,
                seatCount: seats.length,
                quotaUsed: nextUser.monthly_message_limit > 0 ? Number(((nextUser.messages_sent_current_period / nextUser.monthly_message_limit) * 100).toFixed(1)) : 0
            });
        } catch (error) {
            console.error('Failed to load dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size={32} className="animate-spin text-primary" />
                    <span className="text-muted font-bold uppercase tracking-widest text-xs">{t('dashboard.home.loading')}</span>
                </div>
            </div>
        );
    }

    const isFreePlan = String(user?.plan?.name || user?.plan || 'free').toLowerCase() === 'free';
    const userPlan = user?.plan?.name || (typeof user?.plan === 'string' ? user?.plan : t('dashboard.layout.free_tier'));

    const cards = [
        { label: t('dashboard.home.outbound_traffic'), value: `${stats.messagesSent.toLocaleString()} / ${stats.messageLimit.toLocaleString()}`, icon: ChatCircleDots, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: t('dashboard.home.active_channels'), value: `${stats.instanceCount} / ${user?.max_instances || 1}`, icon: DeviceMobile, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { label: t('dashboard.home.agent_seats'), value: `${stats.seatCount} / ${user?.max_seats || 1}`, icon: UsersThree, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { label: t('dashboard.home.system_quota'), value: `${stats.quotaUsed}%`, icon: Lightning, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-3xl p-8 border border-border flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-sm"
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Lightning size={160} weight="fill" className="text-primary" />
                </div>
                <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition duration-500 shadow-xl shadow-primary/5">
                        <Lightning size={32} weight="fill" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-foreground capitalize">{userPlan} {t('dashboard.home.plan_suffix')}</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{t('dashboard.home.plan_badge')}</span>
                        </div>
                        <p className="text-muted font-medium">{t('dashboard.home.plan_description')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {isFreePlan && (
                        <button
                            onClick={() => window.location.href = '/dashboard/plans'}
                            className="flex-1 md:flex-none px-8 py-3.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-primary/20"
                        >
                            {t('dashboard.home.upgrade_cta')}
                        </button>
                    )}
                    <button
                        onClick={() => window.location.href = '/dashboard/plans'}
                        className="flex-1 md:flex-none px-8 py-3.5 bg-control border border-control-border text-muted text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-control-hover transition"
                    >
                        {t('dashboard.home.view_params')}
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-surface p-8 rounded-3xl border ${card.border} group relative overflow-hidden shadow-sm`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                            <card.icon size={80} weight="fill" />
                        </div>
                        <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-6`}>
                            <card.icon size={24} weight="bold" />
                        </div>
                        <div className="text-muted text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</div>
                        <div className="text-3xl font-black text-foreground">{card.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-surface rounded-[2.5rem] p-10 border border-border shadow-sm overflow-hidden relative"
                >
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-foreground">{t('dashboard.home.traffic_pulse')}</h3>
                            <p className="text-muted font-medium">{t('dashboard.home.outbound_msg_vol')}</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2 glass-card rounded-xl text-[10px] font-black border-border hover:border-primary/50 transition uppercase tracking-widest">
                            {t('dashboard.home.view_logs')} <CaretRight weight="bold" />
                        </button>
                    </div>

                    <div className="w-full h-[280px] relative">
                        <svg viewBox="0 0 800 200" className="w-full h-full">
                            <defs>
                                <linearGradient id="g-purple-dash" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                                d="M0,150 L100,120 L200,80 L300,140 L400,30 L500,110 L600,40 L700,90 L800,20"
                                stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" fill="none"
                            />
                            <path d="M0,150 L100,120 L200,80 L300,140 L400,30 L500,110 L600,40 L700,90 L800,20 L800,200 L0,200 Z" fill="url(#g-purple-dash)" />
                        </svg>

                        <div
                            className="absolute top-[20px] right-[10%] w-3 h-3 bg-primary rounded-full"
                            style={{ boxShadow: '0 0 15px var(--primary)' }}
                        />
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-surface rounded-3xl p-8 border border-border shadow-sm"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-muted text-[10px] uppercase tracking-widest">{t('dashboard.home.system_engine')}</h4>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: t('dashboard.home.baileys_multi'), status: t('dashboard.home.optimal'), color: 'text-green-500' },
                                { name: t('dashboard.home.socket_cluster'), status: t('dashboard.home.optimal'), color: 'text-green-500' },
                                { name: t('dashboard.home.queue_manager'), status: t('dashboard.home.standby'), color: 'text-blue-500' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-border rounded-full group-hover:bg-primary transition"></div>
                                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase ${item.color}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden group cursor-pointer"
                    >
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h4 className="text-xl font-black mb-1 text-foreground">{t('dashboard.layout.menu_upgrade')}</h4>
                                <p className="text-muted text-sm font-medium">{t('dashboard.home.need_more_credits')}</p>
                            </div>
                            <ArrowUpRight size={24} weight="bold" className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition">
                            <Circle size={120} weight="fill" className="text-primary" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
