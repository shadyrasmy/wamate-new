'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Users, PencilSimple, Trash, Warning,
    CheckCircle, XCircle, Spinner, CaretLeft, CaretRight, X,
    CaretDown, CaretUp, WhatsappLogo, PaperPlaneRight,
    Shield
} from '@phosphor-icons/react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

    // Filter/Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('all');

    useEffect(() => {
        loadUsers();
    }, [page, dateRange]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            let url = `/admin/users?page=${page}&limit=10`;
            if (search) url += `&search=${search}`;

            const now = new Date();
            let startDate, endDate;

            if (dateRange === 'today') {
                startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                endDate = new Date().toISOString();
            } else if (dateRange === 'yesterday') {
                startDate = new Date(new Date().setDate(now.getDate() - 1)).setHours(0, 0, 0, 0);
                endDate = new Date(new Date().setDate(now.getDate() - 1)).setHours(23, 59, 59, 999);
                startDate = new Date(startDate).toISOString();
                endDate = new Date(endDate).toISOString();
            } else if (dateRange === 'last7days') {
                startDate = new Date(new Date().setDate(now.getDate() - 7)).toISOString();
                endDate = new Date().toISOString();
            } else if (dateRange === 'thisMonth') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                endDate = new Date().toISOString();
            } else if (dateRange === 'lastMonth') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
                endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
            }

            if (startDate && endDate) {
                url += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const data = await fetchWithAuth(url);
            setUsers(data.data.users);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth(`/admin/users/${editingUser.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    phone_number: editingUser.phone_number,
                    plan: editingUser.plan,
                    monthly_message_limit: parseInt(editingUser.monthly_message_limit),
                    max_instances: parseInt(editingUser.max_instances),
                    max_seats: parseInt(editingUser.max_seats),
                    is_active: editingUser.is_active,
                    subscription_end_date: editingUser.subscription_end_date
                })
            });
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to permanently DECOMMISSION this identity? All associated nodes will be purged.')) return;
        try {
            await fetchWithAuth(`/admin/users/${userId}`, { method: 'DELETE' });
            loadUsers();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleExtendSubscription = async (userId: string) => {
        const days = prompt('Enter magnitude extension (days):', '30');
        if (!days) return;
        try {
            await fetchWithAuth(`/admin/users/${userId}/extend`, {
                method: 'POST',
                body: JSON.stringify({ days })
            });
            loadUsers();
        } catch (error) {
            console.error('Extension failed', error);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Global Nodes</h1>
                    <p className="text-gray-500 font-medium">Control tower for all operational entities on the grid.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                        <input
                            type="text"
                            placeholder="Search identities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                            className="bg-transparent border-none focus:outline-none px-4 py-2 text-sm text-white font-medium w-64"
                        />
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white/5 border border-white/10 p-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:outline-none"
                    >
                        <option value="all" className="bg-carbon">All Time</option>
                        <option value="today" className="bg-carbon">Today</option>
                        <option value="yesterday" className="bg-carbon">Yesterday</option>
                        <option value="last7days" className="bg-carbon">Last 7 Days</option>
                        <option value="thisMonth" className="bg-carbon">This Month</option>
                        <option value="lastMonth" className="bg-carbon">Last Month</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="carbon-card rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    <th className="p-6 w-10"></th>
                                    <th className="p-6">Operator Identity</th>
                                    <th className="p-6">Phone</th>
                                    <th className="p-6">Subscription Tier</th>
                                    <th className="p-6">Network Load</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Expires</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                    <React.Fragment key={u.id}>
                                        <tr className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${expandedUserId === u.id ? 'bg-white/[0.03]' : ''}`} onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}>
                                            <td className="p-6 text-gray-600">
                                                {expandedUserId === u.id ? <CaretUp size={16} /> : <CaretDown size={16} />}
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-white text-base">{u.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{u.email}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-gray-400 font-mono italic">
                                                    {u.phone_number || 'SIGNAL_LOW'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block border
                                                    ${u.plan === 'enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        u.plan === 'pro' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                            'bg-gray-500/10 text-gray-500 border-white/5'
                                                    }`}>
                                                    {u.plan}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-xs space-y-1">
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-gray-500 uppercase font-black text-[9px] tracking-widest">Broadcasts</span>
                                                        <span className="text-white font-bold">{u.messages_sent_current_period?.toLocaleString() || 0} <span className="text-gray-600 font-medium">/ {u.monthly_message_limit?.toLocaleString() || 0}</span></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {u.is_active ?
                                                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div> Verified
                                                    </div> :
                                                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Suspended
                                                    </div>
                                                }
                                            </td>
                                            <td className="p-6">
                                                <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest font-mono italic">
                                                    {u.subscription_end_date ? new Date(u.subscription_end_date).toLocaleDateString() : 'PERPETUAL'}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingUser(u); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5"
                                                        title="Edit User"
                                                    >
                                                        <PencilSimple size={18} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleExtendSubscription(u.id); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition border border-primary/10"
                                                        title="Extend Subscription"
                                                    >
                                                        <CheckCircle size={18} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition border border-red-500/10"
                                                        title="Delete User"
                                                    >
                                                        <Trash size={18} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {expandedUserId === u.id && (
                                                <tr>
                                                    <td colSpan={8} className="p-0 bg-white/[0.01]">
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                {u.instances?.length > 0 ? u.instances.map((inst: any) => (
                                                                    <div key={inst.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                                                                        <div className="flex justify-between items-start">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${inst.status === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                                                                    <WhatsappLogo size={18} weight="fill" />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-[11px] font-black text-white uppercase tracking-tight">{inst.name}</div>
                                                                                    <div className="text-[9px] text-gray-500 font-medium font-mono">{inst.instance_id}</div>
                                                                                </div>
                                                                            </div>
                                                                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${inst.status === 'connected' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                                                {inst.status}
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                                                            <div>
                                                                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Messages</div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <PaperPlaneRight size={14} className="text-primary" />
                                                                                    <span className="text-sm font-bold text-white">{(inst.messages_count || 0).toLocaleString()}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone</div>
                                                                                <div className="text-xs font-bold text-white">{inst.phone_number || 'UNKNOWN'}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )) : (
                                                                    <div className="col-span-full py-10 text-center text-gray-600 font-medium italic text-xs tracking-widest">
                                                                        SIGNAL_ZERO // No operational nodes found.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                            Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20 transition border border-white/5"
                            >
                                <CaretLeft size={18} weight="bold" />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20 transition border border-white/5"
                            >
                                <CaretRight size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0914]/80 backdrop-blur-xl p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="carbon-card rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-white/10 overflow-hidden relative"
                    >
                        <div className="p-10 lg:p-12">
                            <div className="mb-10 flex justify-between items-start">
                                <div>
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 font-black text-primary">
                                        <Shield size={28} weight="bold" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-2">Override Node Magnitude</h3>
                                    <p className="text-gray-500 font-medium">Adjusting parameters for operator: <span className="text-white">{editingUser.name}</span></p>
                                </div>
                                <button onClick={() => setEditingUser(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition">
                                    <X size={20} weight="bold" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveUser} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2 col-span-full">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number Hub</label>
                                        <input
                                            type="text"
                                            value={editingUser.phone_number || ''}
                                            onChange={e => setEditingUser({ ...editingUser, phone_number: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Service Tier</label>
                                        <select
                                            value={editingUser.plan}
                                            onChange={e => setEditingUser({ ...editingUser, plan: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        >
                                            <option value="free" className="bg-carbon text-white">FREE NODE</option>
                                            <option value="pro" className="bg-carbon text-white">PRO NODE</option>
                                            <option value="enterprise" className="bg-carbon text-white">ENTERPRISE CLUSTER</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Broadcast Quota</label>
                                        <input
                                            type="number"
                                            value={editingUser.monthly_message_limit}
                                            onChange={e => setEditingUser({ ...editingUser, monthly_message_limit: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Max Channels</label>
                                        <input
                                            type="number"
                                            value={editingUser.max_instances}
                                            onChange={e => setEditingUser({ ...editingUser, max_instances: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Team Capacity</label>
                                        <input
                                            type="number"
                                            value={editingUser.max_seats}
                                            onChange={e => setEditingUser({ ...editingUser, max_seats: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser({ ...editingUser, is_active: !editingUser.is_active })}
                                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${editingUser.is_active ? 'bg-green-500' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${editingUser.is_active ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Identity Status: <span className={editingUser.is_active ? 'text-green-500' : 'text-red-500'}>{editingUser.is_active ? 'Operational' : 'Suspended'}</span></span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subscription Expiry</label>
                                    <input
                                        type="date"
                                        value={editingUser.subscription_end_date ? editingUser.subscription_end_date.split('T')[0] : ''}
                                        onChange={e => setEditingUser({ ...editingUser, subscription_end_date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold text-sm"
                                    />
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/5"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        Apply Override
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
