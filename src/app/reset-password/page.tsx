'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUI } from '@/context/UIContext';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const { t } = useUI();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setIsTokenValid(false);
            setMessage(t('auth.reset.invalid_token'));
            setMessageType('error');
        }
    }, [searchParams, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            setMessage(t('auth.reset.password_mismatch'));
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setMessage(t('auth.reset.password_short'));
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || t('auth.reset.success_fallback'));
                setMessageType('success');
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage(data.message || t('auth.reset.error_fallback'));
                setMessageType('error');
            }
        } catch (error) {
            setMessage(t('auth.reset.error_fallback'));
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t('auth.reset.title')}</h1>
                <p className="theme-copy font-medium">{t('auth.reset.subtitle')}</p>

                {message && (
                    <div className={`p-4 rounded-xl ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {isTokenValid && messageType !== 'success' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            placeholder={t('auth.reset.new_password_placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="theme-input-solid w-full p-5 rounded-2xl focus:outline-none focus:border-primary/50 transition font-bold"
                        />
                        <input
                            type="password"
                            placeholder={t('auth.reset.confirm_password_placeholder')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="theme-input-solid w-full p-5 rounded-2xl focus:outline-none focus:border-primary/50 transition font-bold"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="theme-button-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('auth.reset.submitting') : t('auth.reset.submit')}
                        </button>
                    </form>
                )}

                {messageType === 'success' && (
                    <div className="pt-6">
                        <a href="/login" className="theme-button-primary inline-block py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition">
                            {t('auth.reset.proceed_to_login')}
                        </a>
                    </div>
                )}

                <div className="pt-6">
                    <a href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground transition">{t('auth.reset.request_new')}</a>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const { t } = useUI();

    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground font-bold p-10">{t('common.loading')}</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
