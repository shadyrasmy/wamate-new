'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
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
                setMessage(data.message || 'If an account with that email exists, a password reset link has been sent.');
                setMessageType('success');
                setEmail('');
            } else {
                setMessage(data.message || 'An error occurred. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Identity Recovery</h1>
                <p className="text-gray-500 font-medium">Enter your transmission ID to receive a bypass cipher. This protocol requires a verified backup frequency.</p>

                {message && (
                    <div className={`p-4 rounded-xl ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Verified Identity (Email)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : 'Request Cipher'}
                    </button>
                </form>
                <div className="pt-6">
                    <a href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">Abort Protocol & Return</a>
                </div>
            </div>
        </div>
    );
}
