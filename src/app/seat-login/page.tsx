'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { Armchair, EnvelopeSimple, Lock, Spinner } from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function SeatLoginPage() {
    const router = useRouter();
    const { t } = useUI();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/seats/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                router.push('/seat-dashboard');
            } else {
                alert(data.message || t('seat.login.error_login_failed'));
            }
        } catch (error) {
            console.error('Login error', error);
            alert(t('seat.login.error_connection_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]" />

            <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-border relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-wa-green to-wa-teal rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
                        <Armchair size={32} weight="fill" className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{t('seat.login.title')}</h1>
                    <p className="text-muted text-sm mt-1">{t('seat.login.subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted uppercase ml-1">{t('seat.login.email_label')}</label>
                        <div className="relative group">
                            <EnvelopeSimple size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-wa-green transition-colors" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-input border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-wa-green/20 focus:border-wa-green transition-all"
                                placeholder={t('seat.login.email_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted uppercase ml-1">{t('seat.login.password_label')}</label>
                        <div className="relative group">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-wa-green transition-colors" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-input border border-input-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-wa-green/20 focus:border-wa-green transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-wa-green hover:bg-wa-dark-green text-white font-semibold rounded-xl transition-all shadow-lg shadow-wa-green/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner className="animate-spin" size={20} /> : t('seat.login.submit')}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-muted">
                    © {new Date().getFullYear()} {t('seat.login.footer')}
                </div>
            </div>
        </div>
    );
}
