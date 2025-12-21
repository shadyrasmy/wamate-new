'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Gift, Money, Users, Coins, ChartLineUp, CheckCircle, Warning } from '@phosphor-icons/react';
import { fetchWithAuth } from '@/lib/api';

export default function ReferralPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchWithAuth('/referrals/stats');
            setStats(data.data);
        } catch (error) {
            console.error('Failed to load referral stats', error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (!stats?.referral_code) return;
        const link = `${window.location.origin}/register?ref=${stats.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    const referralLink = `${(typeof window !== 'undefined' ? window.location.origin : '')}/register?ref=${stats?.referral_code || '...'}`;

    return (
        <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">My Affiliate Dashboard.</h1>
                <p className="text-gray-400 font-medium">Share your love for WaMate and earn lifetime commissions.</p>
            </div>

            {/* Hero Card */}
            <div className="bg-gradient-to-r from-primary to-secondary p-[1px] rounded-3xl shadow-2xl shadow-primary/10">
                <div className="bg-surface rounded-[23px] p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
                        <Gift size={200} weight="fill" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
                        <div className="space-y-6 flex-1">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Share Love, Earn Money.</h2>
                                <p className="text-gray-400 max-w-md leading-relaxed">
                                    Invite friends to WaMate and earn <span className="text-primary font-bold">20% commission</span> on every payment they make, forever.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-white/5 max-w-lg">
                                <div className="flex-1 truncate font-mono text-sm text-gray-300 select-all">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={copyLink}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-black font-bold rounded-lg transition-all flex items-center gap-2"
                                >
                                    {copied ? <CheckCircle size={18} weight="fill" /> : <Copy size={18} weight="bold" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end">
                            <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full max-w-sm">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Current Balance</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-4xl font-black text-white">${Number(stats?.balance || 0).toFixed(2)}</span>
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold">USD</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Minimum payout: $50.00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Money}
                    label="Total Earnings"
                    value={`$${Number(stats?.total_earnings || 0).toFixed(2)}`}
                    color="text-green-400"
                />
                <StatCard
                    icon={Users}
                    label="Referred Users"
                    value={stats?.referral_count || 0}
                    color="text-blue-400"
                />
                <StatCard
                    icon={ChartLineUp}
                    label="Active Conversions"
                    value="-"
                    color="text-purple-400"
                />
            </div>

            {/* Transaction History */}
            <div className="bg-surface rounded-3xl border border-white/5 p-6 lg:p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Coins size={24} className="text-yellow-500" />
                    Transaction History
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest">
                                <th className="py-4 font-bold">Date</th>
                                <th className="py-4 font-bold">User</th>
                                <th className="py-4 font-bold">Type</th>
                                <th className="py-4 font-bold text-right">Amount</th>
                                <th className="py-4 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stats?.history?.length > 0 ? (
                                stats.history.map((tx: any) => (
                                    <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-medium text-white">
                                            {tx.referred_user?.name || 'System'}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest 
                                                ${tx.type === 'commission' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                                            `}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`py-4 text-right font-mono font-bold ${tx.type === 'commission' ? 'text-green-400' : 'text-white'}`}>
                                            {tx.type === 'commission' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className="text-gray-500 text-xs font-bold uppercase">{tx.status}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                                        No transactions yet. Share your link to start earning!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-surface p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                    <Icon size={20} weight="fill" />
                </div>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-3xl font-black tracking-tight">{value}</div>
        </div>
    );
}
