'use client';

import { useState } from 'react';
import { useUI } from '@/context/UIContext';

export default function ForgotPasswordPage() {
    const { t } = useUI();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || t('auth.forgot.success_fallback'));
                setMessageType('success');
                setEmail('');
            } else {
                setMessage(data.message || t('auth.forgot.error_fallback'));
                setMessageType('error');
            }
        } catch (error) {
            setMessage(t('auth.forgot.error_fallback'));
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t('auth.forgot.title')}</h1>
                <p className="theme-copy font-medium">{t('auth.forgot.subtitle')}</p>

                {message && (
                    <div className={`p-4 rounded-xl ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder={t('auth.forgot.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="theme-input-solid w-full p-5 rounded-2xl focus:outline-none focus:border-primary/50 transition font-bold"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="theme-button-primary w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
                    </button>
                </form>
                <div className="pt-6">
                    <a href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground transition">{t('auth.forgot.back')}</a>
                </div>
            </div>
        </div>
    );
}
