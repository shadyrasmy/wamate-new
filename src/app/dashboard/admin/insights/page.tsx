'use client';

import React, { useState, useEffect } from 'react';
import {
    ChartBar,
    WhatsappLogo,
    ArrowUp,
    ArrowDown,
    CurrencyCircleDollar,
    Users,
    Pulse,
    TrendUp,
    UserPlus,
    Target,
    Warning,
    ChartPieSlice,
    Clock,
    UserList,
    HandCoins,
    Crown
} from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';
import { fetchWithAuth } from '@/lib/api';

export default function InsightsPage() {
    const { t, theme } = useUI();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth('/admin/insights');
            setData(response.data);
        } catch (error: any) {
            console.error('Failed to fetch insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    const { summary, instances, topUsers, messaging, revenue, retention, affiliates } = data;

    const stats = [
        {
            label: 'Monthly Recurring (MRR)',
            value: `$${summary.mrr.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: CurrencyCircleDollar,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            sub: 'Projected Revenue'
        },
        {
            label: 'Conversion Rate',
            value: summary.conversionRate,
            icon: Target,
            color: 'text-primary',
            bg: 'bg-primary/10',
            sub: `${summary.totalUsers} total users`
        },
        {
            label: 'Affiliate Payouts',
            value: `$${summary.totalCommissions.toLocaleString()}`,
            icon: HandCoins,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            sub: 'Total Commissions'
        },
        {
            label: 'Active Clusters',
            value: `${summary.onlineInstances}/${summary.totalInstances}`,
            icon: Pulse,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            sub: 'Nodes Online'
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Main Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-3xl border border-border hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} weight="fill" />
                            </div>
                            <TrendUp size={24} className="text-gray-500 opacity-20" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                            {stat.sub && <p className="text-[10px] font-bold text-primary uppercase">{stat.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Lifecycle */}
                <div className="glass-card rounded-[40px] border border-border p-8 bg-surface/30">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Growth Velocity</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">User Registration</p>
                        </div>
                        <UserPlus size={28} weight="bold" className="text-blue-500" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-400">Last 24 Hours</span>
                            <span className="text-lg font-black text-blue-500">+{summary.newUsers24h}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-sm font-bold text-gray-400">Last 7 Days</span>
                            <span className="text-lg font-black text-blue-500">+{summary.newUsers7d}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-sm font-bold text-gray-400">Total Network</span>
                            <span className="text-lg font-black">{summary.totalUsers}</span>
                        </div>
                    </div>
                </div>

                {/* Message DNA */}
                <div className="glass-card rounded-[40px] border border-border p-8 bg-surface/30">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Messaging DNA</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Type Breakdown</p>
                        </div>
                        <WhatsappLogo size={28} weight="bold" className="text-green-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {messaging.typeBreakdown.map((type: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/20 transition-all">
                                <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">{type.type}</span>
                                <span className="text-xl font-black">{type.count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Churn Risk */}
                <div className="glass-card rounded-[40px] border border-border p-8 bg-surface/30">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Churn Risk</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-red-400">Expiring in 7 Days</p>
                        </div>
                        <Warning size={28} weight="fill" className="text-red-500" />
                    </div>
                    <div className="space-y-4">
                        {retention.churnRisk.length > 0 ? retention.churnRisk.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                                <div>
                                    <div className="text-xs font-bold truncate max-w-[120px]">{user.name}</div>
                                    <div className="text-[9px] text-gray-500 uppercase">{new Date(user.subscription_end_date).toLocaleDateString()}</div>
                                </div>
                                <ArrowUp size={16} className="text-red-400 rotate-45" />
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No immediate risks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plan Distribution */}
                <div className="glass-card rounded-[40px] border border-border p-10 bg-surface/30">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter">Cluster Ecosystem</h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Market Share Analysis</p>
                        </div>
                        <ChartPieSlice size={32} weight="bold" className="text-primary" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            {revenue.planDistribution.map((plan: any, idx: number) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">{plan.plan_name}</span>
                                        <span className="text-primary">{plan.count} users</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${(plan.count / summary.totalUsers) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-surface rounded-3xl p-6 border border-border flex flex-col justify-center text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Network Earnings</span>
                            <span className="text-4xl font-black tracking-tight text-primary">${summary.totalEarnings.toLocaleString()}</span>
                            <div className="mt-4 pt-4 border-t border-border flex justify-around">
                                {revenue.invoiceStats.map((stat: any, idx: number) => (
                                    <div key={idx}>
                                        <div className="text-[8px] font-black uppercase text-gray-500">{stat.status}</div>
                                        <div className="text-sm font-black">{stat.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Referrers */}
                <div className="glass-card rounded-[40px] border border-border p-10 bg-surface/30">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter">Top Command Referrers</h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Affiliate Growth Leaders</p>
                        </div>
                        <Crown size={32} weight="fill" className="text-yellow-500" />
                    </div>
                    <div className="space-y-6">
                        {affiliates.topReferrers.length > 0 ? affiliates.topReferrers.map((ref: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-3xl bg-surface border border-border group hover:border-primary/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center font-black text-xs text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm tracking-tight">{ref.referrer?.name}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">{ref.referrer?.email}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-primary">${parseFloat(ref.total_earned).toLocaleString()}</div>
                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total Earned</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-30">
                                <p className="text-xs font-bold uppercase tracking-widest">No affiliate data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Node Grid */}
                <div className="glass-card rounded-[40px] border border-border overflow-hidden">
                    <div className="p-8 border-b border-border flex items-center justify-between bg-surface/30">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Node Grid Activity</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Top 10 Performers</p>
                        </div>
                        <Pulse size={24} weight="bold" className="text-primary animate-pulse" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Instance</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Protocol</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {instances.map((inst: any) => (
                                    <tr key={inst.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                    <WhatsappLogo size={18} weight="fill" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{inst.name}</div>
                                                    <div className="text-[9px] text-gray-500 font-bold uppercase">{inst.user?.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${inst.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {inst.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-sm">
                                            {inst.messages_sent?.toLocaleString() || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Vanguard Users */}
                <div className="glass-card rounded-[40px] border border-border overflow-hidden">
                    <div className="p-8 border-b border-border flex items-center justify-between bg-surface/30">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Vanguard Power Users</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Top Volume Leaders</p>
                        </div>
                        <UserList size={24} weight="bold" className="text-primary" />
                    </div>
                    <div className="p-8 space-y-6">
                        {topUsers.map((user: any, idx: number) => (
                            <div key={user.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center font-black text-xs text-primary group-hover:border-primary/50 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{user.name}</div>
                                        <div className="text-[10px] text-gray-500 font-bold truncate max-w-[150px]">{user.email}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-lg tracking-tight">{user.messages_sent?.toLocaleString() || 0}</div>
                                    <div className="text-[9px] font-black text-primary uppercase tracking-tighter">Messages</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
