'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Shield,
    Spinner,
    ChatCircleDots,
    DeviceMobile,
    UsersThree,
    ShootingStar,
    Check
} from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function PlansPage() {
    const { t } = useUI();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAI, setShowAI] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [upgradingPlanId, setUpgradingPlanId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [plansData, userData] = await Promise.all([
                fetchWithAuth('/plans'),
                fetchWithAuth('/user/profile')
            ]);
            setPlans(plansData.data.plans);
            setUser(userData.data.user);
            if (userData.data.user?.plan?.ai_enabled) {
                setShowAI(true);
            }
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (planId: string) => {
        setUpgradingPlanId(planId);
        try {
            const data = await fetchWithAuth('/payment/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan_id: planId })
            });

            if (data.data?.invoice_url) {
                window.location.href = data.data.invoice_url;
            } else {
                alert(t('dashboard.plans.invoice_error'));
            }
        } catch (error: any) {
            console.error('Upgrade failed:', error);
            alert(error.message || t('dashboard.plans.upgrade_error'));
        } finally {
            setUpgradingPlanId(null);
        }
    };

    const filteredPlans = plans.filter(plan => !!plan.ai_enabled === showAI);

    return (
        <div className="space-y-10 pb-20">
            <div className="text-center mb-4">
                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">{t('dashboard.plans.title')}</h1>
                <p className="text-gray-500 font-medium max-w-xl mx-auto">{t('dashboard.plans.subtitle')}</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="relative flex bg-gray-900/80 p-2 rounded-3xl border-2 border-white/10 shadow-2xl backdrop-blur-xl">
                    <div
                        className={`absolute top-2 bottom-2 w-[calc(50%-4px)] rounded-2xl transition-all duration-500 ease-out ${showAI
                                ? 'left-[calc(50%+2px)] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg shadow-pink-500/30'
                                : 'left-2 bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30'
                            }`}
                    />

                    <button
                        onClick={() => setShowAI(false)}
                        className={`relative z-10 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${!showAI ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Shield size={20} weight="bold" />
                        {t('dashboard.plans.standard')}
                    </button>
                    <button
                        onClick={() => setShowAI(true)}
                        className={`relative z-10 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${showAI ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShootingStar size={20} weight="bold" className={showAI ? 'animate-pulse' : ''} />
                        {t('dashboard.plans.ai_powered')}
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-gray-600 -mt-4 mb-6">
                {showAI ? t('dashboard.plans.ai_hint') : t('dashboard.plans.standard_hint')}
            </p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredPlans.map((plan, index) => {
                        const isCurrent = user?.plan?.id === plan.id || user?.id_plan === plan.id;
                        const isUpgrading = upgradingPlanId === plan.id;

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`carbon-card p-8 rounded-[3rem] border-white/5 relative overflow-hidden group transition-all duration-500 shadow-2xl ${isCurrent ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'hover:border-primary/30'}`}
                            >
                                {isCurrent && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl shadow-lg z-20">
                                        {t('dashboard.plans.current_protocol')}
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isCurrent ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                        {plan.ai_enabled ? <ShootingStar size={28} weight="bold" /> : <Shield size={28} weight="bold" />}
                                    </div>
                                </div>

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{plan.name}</h3>
                                    <div className="text-4xl font-black text-primary flex items-baseline gap-1">
                                        ${plan.price}
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">/ {plan.billing_cycle || t('dashboard.plans.month')}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <ChatCircleDots size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.monthly_message_limit.toLocaleString()} {t('dashboard.plans.broadcasts')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <DeviceMobile size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.max_instances} {t('dashboard.plans.nodes')}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <UsersThree size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.max_seats} {t('dashboard.plans.seats')}</span>
                                    </div>

                                    {plan.ai_enabled && (
                                        <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                                            <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.15em]">
                                                <Check size={16} weight="bold" />
                                                <span>{t('dashboard.plans.ai_reply_quota', { count: plan.ai_reply_limit.toLocaleString() })}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.15em]">
                                                <Check size={16} weight="bold" />
                                                <span>{t('dashboard.plans.cognitive_capacity', { count: plan.ai_knowledge_limit })}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrent || isUpgrading}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${isCurrent ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : isUpgrading ? 'bg-primary/50 text-white cursor-wait' : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {isUpgrading ? (
                                        <Spinner size={18} className="animate-spin" />
                                    ) : isCurrent ? (
                                        <Check size={18} weight="bold" />
                                    ) : (
                                        <ShootingStar size={18} weight="bold" />
                                    )}
                                    {isCurrent ? t('dashboard.plans.protocol_active') : isUpgrading ? t('dashboard.plans.transmitting') : t('dashboard.plans.engage_tier')}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
