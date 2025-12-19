'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';
import {
    EnvelopeSimple,
    LockSimple,
    ArrowRight,
    Spinner,
    WarningCircle,
    WhatsappLogo,
    Circle
} from '@phosphor-icons/react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) router.push('/dashboard');
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Verification failure');

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
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Floating Orbs */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/30 rounded-full blur-3xl pointer-events-none"
            />

            <div className="w-full max-w-[420px] p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="carbon-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    {/* Interior Decorative Element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-[80px] pointer-events-none" />

                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 shadow-xl shadow-primary/5"
                        >
                            <WhatsappLogo size={32} weight="fill" className="text-primary" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2">Access Grid</h2>
                        <p className="text-gray-500 font-medium text-center text-xs max-w-[240px]">Synchronize your communications across the global neural network.</p>
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
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Identity Hub</label>
                            <div className="relative group">
                                <EnvelopeSimple className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter verified email"
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
                                    placeholder="Enter unique cipher"
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Link href="/forgot-password" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition">
                                Recovery Protocol?
                            </Link>
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
                                    Decrypting...
                                </>
                            ) : (
                                <>
                                    Establish Link
                                    <ArrowRight size={18} weight="bold" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-12 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4 w-full opacity-20">
                            <div className="h-[1px] flex-1 bg-white" />
                            <Circle size={8} weight="fill" />
                            <div className="h-[1px] flex-1 bg-white" />
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                            New user? {' '}
                            <Link href="/register" className="text-primary font-black hover:text-white transition">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer Attribution */}
                <p className="mt-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
                    WaMate OS v2.4 // Advanced Transmission System
                </p>
            </div>
        </div>
    );
}
