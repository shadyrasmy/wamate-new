'use client';

import React, { useEffect, useState } from 'react';
import {
    Money,
    TrendUp,
    Users,
    Gear,
    CheckCircle,
    WarningCircle,
    HandCoins,
    Spinner
} from '@phosphor-icons/react';
import { fetchWithAuth } from '@/lib/api';

export default function AdminReferralPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [percentage, setPercentage] = useState(20);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchWithAuth('/referrals/admin/stats');
            setStats(data.data);
            setPercentage(data.data.commission_percentage);
        } catch (error) {
            console.error('Failed to load admin stats', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setMsg({ type: '', text: '' });
        try {
            await fetchWithAuth('/referrals/admin/settings', {
                method: 'POST',
                body: JSON.stringify({ percentage: Number(percentage) })
            });
            setMsg({ type: 'success', text: 'Commission settings updated successfully.' });
        } catch (error: any) {
            setMsg({ type: 'error', text: error.message || 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Referral Administration</h1>
                    <p className="text-gray-400">Manage global commission rates and view top affiliates.</p>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Money size={20} weight="fill" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Total Commissions</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight">${Number(stats?.total_commissions || 0).toFixed(2)}</div>
                </div>

                <div className="bg-surface p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <HandCoins size={20} weight="fill" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Total Payouts</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight">${Number(stats?.total_payouts || 0).toFixed(2)}</div>
                </div>

                <div className="bg-surface p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users size={20} weight="fill" />
                        </div>
                        <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Active Referrers</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight">{stats?.top_referrers?.length || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Card */}
                <div className="bg-surface rounded-3xl border border-white/5 p-8 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <Gear size={24} weight="fill" className="text-gray-400" />
                        <h2 className="text-xl font-bold">Global Configuration</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Commission Percentage (%)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => setPercentage(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary/50 transition"
                                />
                                <span className="text-gray-500 font-bold">%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                This percentage applies to all future payments. Existing balances are not affected.
                            </p>
                        </div>

                        {msg.text && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {msg.type === 'success' ? <CheckCircle size={18} weight="fill" /> : <WarningCircle size={18} weight="fill" />}
                                {msg.text}
                            </div>
                        )}

                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Spinner className="animate-spin" /> : <CheckCircle size={20} weight="bold" />}
                            {saving ? 'Saving...' : 'Update Settings'}
                        </button>
                    </div>
                </div>

                {/* Top Referrers Table */}
                <div className="lg:col-span-2 bg-surface rounded-3xl border border-white/5 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <TrendUp size={24} className="text-primary" weight="fill" />
                        Top Performing Affiliates
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest">
                                    <th className="py-4 pl-4">User</th>
                                    <th className="py-4">Code</th>
                                    <th className="py-4 text-right pr-4">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {stats?.top_referrers?.length > 0 ? (
                                    stats.top_referrers.map((user: any) => (
                                        <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-4 font-bold text-white">
                                                <div className="flex flex-col">
                                                    <span>{user.name}</span>
                                                    <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 font-mono text-primary">
                                                {user.referral_code}
                                            </td>
                                            <td className="py-4 pr-4 text-right font-mono font-bold text-green-400">
                                                ${Number(user.referral_balance).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-gray-500 italic">
                                            No active referrers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
