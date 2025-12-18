'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Receipt, FileText, Spinner, CaretLeft, CaretRight,
    CheckCircle, Clock, XCircle
} from '@phosphor-icons/react';

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadInvoices();
    }, [page]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const data = await fetchWithAuth(`/admin/invoices?page=${page}&limit=10`);
            setInvoices(data.data.invoices);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error('Failed to load invoices', error);
        } finally {
            setLoading(false);
        }
    };

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
                                    <th className="p-6 text-right">Timestamp</th>
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
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                    <XCircle size={14} weight="fill" /> Dropped
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-right text-[10px] text-gray-500 font-black">
                                            {new Date(inv.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
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
