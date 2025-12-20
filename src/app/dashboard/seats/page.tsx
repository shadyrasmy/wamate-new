'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import { UsersThree, Plus, Trash, User, Circle, Spinner, X } from '@phosphor-icons/react';

export default function SeatsPage() {
    const [seats, setSeats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        loadSeats();
    }, []);

    const loadSeats = async () => {
        try {
            const data = await fetchWithAuth('/seats/manage');
            setSeats(data.data.seats);
        } catch (error) {
            console.error('Failed to load seats', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSeat = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth('/seats/manage', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '' });
            loadSeats();
        } catch (error: any) {
            alert(error.message || 'Failed to create seat');
        }
    };

    const handleDeleteSeat = async (seatId: string) => {
        if (!confirm('Are you sure you want to remove this seat?')) return;
        try {
            await fetchWithAuth(`/seats/manage/${seatId}`, {
                method: 'DELETE'
            });
            loadSeats();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Agent Seats</h1>
                    <p className="text-gray-500 font-medium">Manage team members and broadcast permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition"
                >
                    <Plus size={20} weight="bold" /> PROVISION SEAT
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            ) : seats.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="carbon-card rounded-[2.5rem] p-20 text-center border-white/5"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <UsersThree size={48} weight="duotone" className="text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">No Agents Found</h2>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">
                        Your operation is currently running solo. Add team members to scale your response time.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {seats.map((seat, i) => (
                        <motion.div
                            key={seat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="carbon-card p-8 rounded-[2rem] border-white/5 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => handleDeleteSeat(seat.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                                >
                                    <Trash size={20} weight="bold" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                                    <User size={32} weight="duotone" className="text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-xl truncate">{seat.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium truncate">{seat.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${seat.status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {seat.status || 'Offline'}
                                    </span>
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                                    Agent Node
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="carbon-card rounded-[2.5rem] shadow-2xl w-full max-w-xl border-white/10 overflow-hidden relative"
                    >
                        <div className="absolute top-8 right-8">
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-10 lg:p-12">
                            <div className="mb-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6">
                                    <Plus size={28} weight="bold" className="text-primary" />
                                </div>
                                <h3 className="text-3xl font-black mb-2">New Seat Provision</h3>
                                <p className="text-gray-500 font-medium">Configure credentials for the new operational node.</p>
                            </div>

                            <form onSubmit={handleCreateSeat} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Identity</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-medium"
                                            placeholder="Agent One"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-medium"
                                            placeholder="agent@wamate.io"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-medium"
                                        placeholder="••••••••••••"
                                    />
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        Initialize Seat
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
