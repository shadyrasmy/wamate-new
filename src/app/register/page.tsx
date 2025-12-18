'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import {
    User,
    EnvelopeSimple,
    LockSimple,
    ArrowRight,
    Spinner,
    WarningCircle,
    WhatsappLogo,
    Circle,
    ShieldCheck
} from '@phosphor-icons/react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0914] relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-[0.03] invert pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[520px] p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="carbon-card p-10 lg:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/[0.02] rounded-br-[100px] pointer-events-none" />

                    <div className="flex flex-col mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <motion.div
                                whileHover={{ rotate: -10, scale: 1.1 }}
                                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl"
                            >
                                <ShieldCheck size={32} weight="fill" className="text-primary" />
                            </motion.div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight">Initialize Identity</h2>
                                <p className="text-gray-500 font-medium text-sm">Create your credentials for the grid.</p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl flex items-center gap-3 uppercase tracking-widest"
                            >
                                <WarningCircle size={18} weight="fill" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Display Alias</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full operational name"
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Identity Hub</label>
                            <div className="relative group">
                                <EnvelopeSimple className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="Verification email"
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Secure Cipher</label>
                            <div className="relative group">
                                <LockSimple className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="Complex cipher string"
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                By initializing identity, you agree to the <span className="text-primary cursor-pointer hover:underline">Grid Protocols</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Logic</span>.
                            </p>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                        >
                            {loading ? (
                                <>
                                    <Spinner size={20} className="animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    Deploy Identity
                                    <ArrowRight size={18} weight="bold" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4 w-full opacity-20">
                            <div className="h-[1px] flex-1 bg-white" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div className="h-[1px] flex-1 bg-white" />
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest text-center">
                            Identity already active? {' '}
                            <Link href="/login" className="text-primary font-black hover:text-white transition">
                                Access Link
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <p className="mt-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
                    End-to-End Encryption Enabled // No-Log Policy
                </p>
            </div>
        </div>
    );
}
