'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import {
    CheckCircle,
    XCircle,
    Spinner,
    EnvelopeSimple,
    ArrowRight
} from '@phosphor-icons/react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing. Please check your email link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed. The link may be invalid or expired.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred while verifying your email. Please try again.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-[0.03] invert pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[480px] p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="carbon-card p-10 lg:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/[0.02] rounded-br-[100px] pointer-events-none" />

                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"
                            >
                                <Spinner size={40} className="text-primary" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Verifying Email</h2>
                                <p className="text-gray-500 font-medium text-sm">Please wait while we verify your account...</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20"
                            >
                                <CheckCircle size={40} weight="fill" className="text-green-500" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Email Verified!</h2>
                                <p className="text-gray-500 font-medium text-sm">{message}</p>
                            </div>
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-4 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
                                >
                                    Continue to Login
                                    <ArrowRight size={18} weight="bold" />
                                </motion.button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20"
                            >
                                <XCircle size={40} weight="fill" className="text-red-500" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Verification Failed</h2>
                                <p className="text-gray-500 font-medium text-sm">{message}</p>
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <Link href="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition flex items-center gap-3 text-sm uppercase tracking-widest"
                                    >
                                        Go to Login
                                    </motion.button>
                                </Link>
                                <Link href="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
                                    >
                                        Register Again
                                        <ArrowRight size={18} weight="bold" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>

                <p className="mt-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
                    Secure Email Verification // WaMate
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner size={32} className="animate-spin text-primary" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
