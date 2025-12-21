'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    ShieldCheck,
    CheckCircle,
    Gift
} from '@phosphor-icons/react';

import { Suspense } from 'react';

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone_number: '', referralCode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) router.push('/dashboard');

        // Check for referral code
        const refParam = searchParams.get('ref');
        if (refParam) {
            setFormData(prev => ({ ...prev, referralCode: refParam }));
        }
    }, [router, searchParams]);

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

            // Show success message - user needs to verify email before logging in
            setRegistrationSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[520px] p-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="carbon-card p-10 lg:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/[0.02] rounded-br-[100px] pointer-events-none" />

                {/* Success State - Check Your Email */}
                {registrationSuccess ? (
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 mb-8"
                        >
                            <CheckCircle size={40} weight="fill" className="text-green-500" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-4">Check Your Email!</h2>
                        <p className="text-gray-400 font-medium text-sm mb-2">
                            We've sent a verification link to:
                        </p>
                        <p className="text-primary font-bold text-lg mb-6">{formData.email}</p>
                        <p className="text-gray-500 font-medium text-xs mb-8">
                            Click the link in your email to verify your account. If you don't see it, check your spam folder.
                        </p>
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
                            >
                                Go to Login
                                <ArrowRight size={18} weight="bold" />
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <motion.div
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl"
                                >
                                    <ShieldCheck size={32} weight="fill" className="text-primary" />
                                </motion.div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                                    <p className="text-gray-500 font-medium text-sm">Join the next-gen messaging platform.</p>
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
                            {formData.referralCode && (
                                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3">
                                    <Gift className="text-green-500 shrink-0 mt-0.5" size={20} weight="fill" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Referral Applied!</p>
                                        <p className="text-xs text-gray-400">You are registering with code <span className="font-mono text-green-400">{formData.referralCode}</span>.</p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                <div className="relative group">
                                    <EnvelopeSimple className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                                <div className="relative group">
                                    <WhatsappLogo className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="+1 234 567 890"
                                        className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Secure Password</label>
                                <div className="relative group">
                                    <LockSimple className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" size={20} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition placeholder:text-gray-700"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create My Account
                                        <ArrowRight size={18} weight="bold" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-12 flex flex-col items-center gap-6">
                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest text-center">
                                Already have an account? {' '}
                                <Link href="/login" className="text-primary font-black hover:text-white transition">
                                    Login Here
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </motion.div>

            <p className="mt-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
                End-to-End Encryption Enabled // No-Log Policy
            </p>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-[0.03] invert pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[500px]">
                    <Spinner size={32} className="animate-spin text-primary" />
                </div>
            }>
                <RegisterContent />
            </Suspense>
        </div>
    );
}
