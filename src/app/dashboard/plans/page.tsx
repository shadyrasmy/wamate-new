'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Shield, Spinner,
    ChatCircleDots, DeviceMobile, UsersThree, ShootingStar, Check
} from '@phosphor-icons/react';

export default function PlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

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
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = (planId: string) => {
        // In a real app, this would redirect to checkout
        alert('Internal redirection to checkout for plan: ' + planId + '. This feature is being finalized with our payment partner.');
    };

    return (
        <div className="space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Service Protocols</h1>
                <p className="text-gray-500 font-medium">Select the magnitude of your operation and scale your neural capacity.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {plans.map((plan, i) => {
                        const isCurrent = user?.plan?.id === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`carbon-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group transition-all duration-500 shadow-2xl ${isCurrent ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/30'}`}
                            >
                                {isCurrent && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg z-20">
                                        Current Active Tier
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isCurrent ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                        <Shield size={28} weight="bold" />
                                    </div>
                                </div>

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{plan.name}</h3>
                                    <div className="text-3xl font-black text-primary flex items-baseline gap-1">
                                        ${plan.price}
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">/ {plan.billing_cycle || 'Month'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <ChatCircleDots size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.monthly_message_limit.toLocaleString()} Broadcast Signals</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <DeviceMobile size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.max_instances} Total Node Channels</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                        <UsersThree size={20} weight="duotone" className="text-primary" />
                                        <span>{plan.max_seats} Operative Seats</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrent}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${isCurrent ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {isCurrent ? <Check size={18} weight="bold" /> : <ShootingStar size={18} weight="bold" />}
                                    {isCurrent ? 'Protocol Verified' : 'Synchronize Magnitude'}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
