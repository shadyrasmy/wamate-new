'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [isTokenValid, setIsTokenValid] = useState(true);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setIsTokenValid(false);
            setMessage('Invalid or missing reset token. Please request a new password reset.');
            setMessageType('error');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
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
                setMessage(data.message || 'Password has been reset successfully. You can now log in with your new password.');
                setMessageType('success');
                setPassword('');
                setConfirmPassword('');
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
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Reset Cipher</h1>
                <p className="text-gray-500 font-medium">Enter your new transmission cipher to restore access to your identity.</p>

                {message && (
                    <div className={`p-4 rounded-xl ${messageType === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {isTokenValid && messageType !== 'success' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            placeholder="New Cipher (Password)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Cipher"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Reset Cipher'}
                        </button>
                    </form>
                )}

                {messageType === 'success' && (
                    <div className="pt-6">
                        <a href="/login" className="inline-block py-5 px-8 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition">
                            Proceed to Login
                        </a>
                    </div>
                )}

                <div className="pt-6">
                    <a href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">Request New Cipher</a>
                </div>
            </div>
        </div>
    );
}
