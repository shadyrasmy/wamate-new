'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth, API_URL } from '@/lib/api';
import { Armchair, EnvelopeSimple, Lock, Spinner } from '@phosphor-icons/react';

export default function SeatLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Note: Seats login via logic handled in backend or same auth endpoint? 
            // In our implemented controller, it's /api/seats/login
            const res = await fetch(`${API_URL}/seats/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                // Redirect to Seat Dashboard (to be created)
                router.push('/seat-dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error', error);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#efeae2] p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]" />

            <div className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/50 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-wa-green to-wa-teal rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
                        <Armchair size={32} weight="fill" className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Portal</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your team seat</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Email</label>
                        <div className="relative group">
                            <EnvelopeSimple size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-wa-green transition-colors" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wa-green/20 focus:border-wa-green transition-all"
                                placeholder="agent@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Password</label>
                        <div className="relative group">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-wa-green transition-colors" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wa-green/20 focus:border-wa-green transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-wa-green hover:bg-wa-dark-green text-white font-semibold rounded-xl transition-all shadow-lg shadow-wa-green/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} WaMate. All rights reserved.
                </div>
            </div>
        </div>
    );
}

