'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Funnel, Export, UserCircle, CaretRight, CheckCircle, XCircle, Clock } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    // Pagination
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    useEffect(() => {
        loadLeads();
    }, [filter, page]);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/leads?status=${filter}&page=${page}&limit=20`);
            setLeads(res.data.leads);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await fetchWithAuth(`/leads/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            // Optimistic update
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleExport = async () => {
        try {
            // Need to fetch blob manually since fetchWithAuth parses JSON
            const token = localStorage.getItem('token');
            // Use the centralized API_URL which handles the env var logic
            const { API_URL } = await import('@/lib/api');
            const res = await fetch(`${API_URL}/leads/export?status=${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-export-${Date.now()}.csv`;
            a.click();
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const statusColors: any = {
        'New': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Contacted': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        'Hot': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'Closed': 'bg-green-500/10 text-green-500 border-green-500/20',
        'Lost': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };

    return (
        <div className="p-4 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <Funnel size={32} className="text-primary" weight="duotone" />
                        Sales Pipeline
                    </h1>
                    <p className="text-gray-400 mt-1">Track and manage your captured leads.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition"
                >
                    <Export size={20} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'New', 'Contacted', 'Hot', 'Closed', 'Lost'].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition whitespace-nowrap ${filter === status
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Lead Name</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Intent</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Flexible Data</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-500 animate-pulse">Scanning pipeline...</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-500">No leads found.</td></tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/[0.02] transition">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                                    {lead.contact?.profile_pic ? (
                                                        <img src={lead.contact.profile_pic} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <UserCircle size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{lead.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{lead.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-gray-300 font-medium">{lead.intent}</p>
                                            {lead.notes && <p className="text-xs text-gray-500 mt-1 italic">"{lead.notes}"</p>}
                                        </td>
                                        <td className="p-6">
                                            {lead.metadata && Object.keys(lead.metadata).length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(lead.metadata).map(([k, v]) => (
                                                        <span key={k} className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400">
                                                            <strong className="text-gray-300 uppercase mr-1">{k}:</strong> {String(v)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold border bg-transparent focus:outline-none cursor-pointer ${statusColors[lead.status] || 'text-gray-400 border-gray-700'}`}
                                            >
                                                <option className="bg-gray-900 text-gray-300" value="New">New</option>
                                                <option className="bg-gray-900 text-gray-300" value="Contacted">Contacted</option>
                                                <option className="bg-gray-900 text-gray-300" value="Hot">Hot</option>
                                                <option className="bg-gray-900 text-gray-300" value="Closed">Closed</option>
                                                <option className="bg-gray-900 text-gray-300" value="Lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="p-6 text-right">
                                            <p className="text-xs text-gray-600 font-mono">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="p-6 border-t border-white/5 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-50 text-white font-bold text-sm"
                        >
                            Prev
                        </button>
                        <span className="px-4 py-2 text-gray-400 text-sm flex items-center">
                            Page {page} of {pagination.pages}
                        </span>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-50 text-white font-bold text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
