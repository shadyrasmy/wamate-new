'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Receipt, Spinner, CaretLeft, CaretRight,
    CheckCircle, Clock, XCircle, Check, X, Funnel
} from '@phosphor-icons/react';

type InvoiceStatus = 'all' | 'pending' | 'paid' | 'failed' | 'cancelled';

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadInvoices();
    }, [page, statusFilter]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const statusQuery = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
            const data = await fetchWithAuth(`/admin/invoices?page=${page}&limit=10${statusQuery}`);
            setInvoices(data.data.invoices);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error('Failed to load invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (invoiceId: string) => {
        if (!confirm('Approve this payment and upgrade the user\'s plan?')) return;

        setActionLoading(invoiceId);
        try {
            await fetchWithAuth(`/admin/invoices/${invoiceId}/approve`, { method: 'POST' });
            loadInvoices();
        } catch (error: any) {
            alert(error.message || 'Failed to approve payment');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (invoiceId: string) => {
        if (!confirm('Reject this payment? This cannot be undone.')) return;

        setActionLoading(invoiceId);
        try {
            await fetchWithAuth(`/admin/invoices/${invoiceId}/reject`, { method: 'POST' });
            loadInvoices();
        } catch (error: any) {
            alert(error.message || 'Failed to reject payment');
        } finally {
            setActionLoading(null);
        }
    };

    const statusTabs: { value: InvoiceStatus; label: string; color: string }[] = [
        { value: 'all', label: 'All', color: 'bg-white/10' },
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
        { value: 'paid', label: 'Paid', color: 'bg-green-500/20 text-green-400' },
        { value: 'failed', label: 'Failed', color: 'bg-red-500/20 text-red-400' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-500/20 text-gray-400' },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Billing Ledger</h1>
                    <p className="text-gray-500 font-medium">Audit trail of all financial transactions across the network.</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                    Financial Oversight
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2">
                <Funnel size={18} className="text-gray-500" />
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === tab.value
                                    ? 'bg-white text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
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
                    className="carbon-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                    <th className="p-6">Invoice #</th>
                                    <th className="p-6">Operator</th>
                                    <th className="p-6">Descriptor</th>
                                    <th className="p-6">Magnitude</th>
                                    <th className="p-6">State</th>
                                    <th className="p-6">Timestamp</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                                    <Receipt size={16} className="text-gray-400" />
                                                </div>
                                                <span className="font-mono text-xs text-white uppercase">{inv.invoice_number}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-bold text-white text-sm">{inv.user?.name}</div>
                                            <div className="text-[10px] text-gray-500 font-medium">{inv.user?.email}</div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{inv.plan_name}</span>
                                        </td>
                                        <td className="p-6 text-sm font-black text-white">
                                            {inv.amount} <span className="text-[10px] text-gray-500">{inv.currency}</span>
                                        </td>
                                        <td className="p-6">
                                            {inv.status === 'paid' ? (
                                                <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle size={14} weight="fill" /> Finalized
                                                </div>
                                            ) : inv.status === 'pending' ? (
                                                <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                                                    <Clock size={14} weight="fill" /> Transit
                                                </div>
                                            ) : inv.status === 'cancelled' ? (
                                                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                                    <XCircle size={14} weight="fill" /> Cancelled
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                    <XCircle size={14} weight="fill" /> Dropped
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-[10px] text-gray-500 font-black">
                                            {new Date(inv.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-right">
                                            {inv.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(inv.id)}
                                                        disabled={actionLoading === inv.id}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors disabled:opacity-50"
                                                        title="Approve Payment"
                                                    >
                                                        {actionLoading === inv.id ? (
                                                            <Spinner size={14} className="animate-spin" />
                                                        ) : (
                                                            <Check size={16} weight="bold" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(inv.id)}
                                                        disabled={actionLoading === inv.id}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
                                                        title="Reject Payment"
                                                    >
                                                        <X size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            )}
                                            {inv.status === 'paid' && (
                                                <span className="text-[10px] text-green-500 font-black">✓ PROCESSED</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center">
                                            <Receipt size={48} className="mx-auto text-gray-800 mb-4" />
                                            <p className="text-gray-500 font-medium">No recorded transactions found in the ledger.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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
        </div>
    );
}
