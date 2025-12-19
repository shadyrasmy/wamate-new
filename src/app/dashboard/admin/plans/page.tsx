'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Shield, Plus, PencilSimple, X, Spinner,
    ChatCircleDots, DeviceMobile, UsersThree, Trash
} from '@phosphor-icons/react';
import CustomSelect from '@/components/ui/CustomSelect';

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await fetchWithAuth('/admin/plans');
            setPlans(data.data.plans);
        } catch (error) {
            console.error('Failed to load plans', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingPlan.id ? 'PATCH' : 'POST';
            const url = editingPlan.id ? `/admin/plans/${editingPlan.id}` : '/admin/plans';

            const sanitizedPlan = {
                ...editingPlan,
                price: parseFloat(editingPlan.price) || 0,
                monthly_message_limit: parseInt(editingPlan.monthly_message_limit) || 0,
                max_instances: parseInt(editingPlan.max_instances) || 0,
                max_seats: parseInt(editingPlan.max_seats) || 0
            };

            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(sanitizedPlan)
            });
            setEditingPlan(null);
            loadPlans();
        } catch (error) {
            console.error('Save failed', error);
        }
    };

    const handleDeletePlan = async (planId: string) => {
        if (!confirm('Are you sure you want to decommission this protocol?')) return;
        try {
            await fetchWithAuth(`/admin/plans/${planId}`, { method: 'DELETE' });
            loadPlans();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Service Protocols</h1>
                    <p className="text-gray-500 font-medium">Define the operational constraints and value metrics for the grid tiers.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingPlan({ name: '', price: 0, monthly_message_limit: 1000, max_instances: 1, max_seats: 1, is_active: true })}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    <Plus size={20} weight="bold" />
                    New Tier
                </motion.button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="carbon-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                    <Shield size={28} weight="bold" className="text-primary" />
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <button
                                        onClick={() => setEditingPlan(plan)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 transition"
                                    >
                                        <PencilSimple size={20} weight="bold" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition"
                                    >
                                        <Trash size={20} weight="bold" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{plan.name}</h3>
                                <div className="text-3xl font-black text-primary flex items-baseline gap-1">
                                    ${plan.price}
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">/ {plan.billing_cycle || 'Month'}</span>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                    <ChatCircleDots size={20} weight="duotone" className="text-primary" />
                                    <span>{plan.monthly_message_limit.toLocaleString()} Broadcasts</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                    <DeviceMobile size={20} weight="duotone" className="text-primary" />
                                    <span>{plan.max_instances} Total Channels</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                    <UsersThree size={20} weight="duotone" className="text-primary" />
                                    <span>{plan.max_seats} Support Seats</span>
                                </div>
                            </div>

                            {!plan.is_active && (
                                <div className="mt-8 pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Offline Protocol
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0914]/80 backdrop-blur-xl p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="carbon-card rounded-[2.5rem] shadow-2xl w-full max-w-2xl border-white/10 overflow-hidden"
                    >
                        <div className="p-10 lg:p-12">
                            <h3 className="text-3xl font-black mb-10">Protocol Configuration</h3>

                            <form onSubmit={handleSavePlan} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tier Name</label>
                                        <input
                                            type="text"
                                            value={editingPlan.name}
                                            onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                            placeholder="e.g. ULTIMATE CLUSTER"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Magnitude (Price)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingPlan.price ?? ''}
                                            onChange={e => setEditingPlan({ ...editingPlan, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Broadcast Quota</label>
                                        <input
                                            type="number"
                                            value={editingPlan.monthly_message_limit ?? ''}
                                            onChange={e => setEditingPlan({ ...editingPlan, monthly_message_limit: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Channels</label>
                                        <input
                                            type="number"
                                            value={editingPlan.max_instances ?? ''}
                                            onChange={e => setEditingPlan({ ...editingPlan, max_instances: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Team Capacity</label>
                                        <input
                                            type="number"
                                            value={editingPlan.max_seats ?? ''}
                                            onChange={e => setEditingPlan({ ...editingPlan, max_seats: e.target.value === '' ? '' : parseInt(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <CustomSelect
                                        label="Temporal Cycle (Billing)"
                                        value={editingPlan.billing_cycle || 'monthly'}
                                        onChange={val => setEditingPlan({ ...editingPlan, billing_cycle: val })}
                                        options={[
                                            { value: 'monthly', label: 'MONTHLY' },
                                            { value: 'quarterly', label: 'QUARTERLY' },
                                            { value: 'yearly', label: 'YEARLY' },
                                            { value: 'lifetime', label: 'LIFETIME' }
                                        ]}
                                    />
                                </div>

                                <div className="pt-10 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPlan(null)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        Synchronize
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
