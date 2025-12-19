'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, CaretRight, ShieldCheck, ShootingStar, Spinner, CheckCircle } from '@phosphor-icons/react';
import { fetchWithAuth } from '@/lib/api';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('Account');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newName, setNewName] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await fetchWithAuth('/user/profile');
            if (data?.data?.user) {
                setUser(data.data.user);
                setNewName(data.data.user.name || '');
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        setUpdating(true);
        setSaveSuccess(false);
        try {
            await fetchWithAuth('/user/profile', {
                method: 'PATCH',
                body: JSON.stringify({ name: newName })
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            loadProfile();
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setUpdating(false);
        }
    };

    const menuItems = [
        { id: 'Account', icon: User, label: 'Account Hub' },
        { id: 'Security', icon: Lock, label: 'Access & Shield' },
        { id: 'Notifications', icon: Bell, label: 'Pulse Alerts' }
    ];

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Spinner size={40} className="animate-spin text-primary" weight="bold" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Internal Parameters</h1>
                <p className="text-gray-500 font-medium">Fine-tune your node configuration and operational identity.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Sidebar */}
                <div className="xl:col-span-1">
                    <div className="carbon-card rounded-[2rem] border-white/5 p-3 space-y-2 sticky top-32">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${activeSection === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={20} weight={activeSection === item.id ? 'fill' : 'bold'} />
                                    {item.label}
                                </div>
                                <CaretRight size={14} weight="bold" className={`transition-transform ${activeSection === item.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="xl:col-span-3 space-y-8">
                    {activeSection === 'Account' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="carbon-card p-10 lg:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                                <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
                                        <User size={24} weight="bold" />
                                    </div>
                                    Identity Profile
                                </h2>

                                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Neural Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none opacity-50 cursor-not-allowed font-bold"
                                            defaultValue={user?.email}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                    <p className="text-gray-500 text-sm font-medium">Any changes to identity requires re-verification of node status.</p>
                                    <button
                                        onClick={handleUpdateName}
                                        disabled={updating}
                                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {updating ? <Spinner className="animate-spin" /> : (saveSuccess ? <CheckCircle size={18} weight="bold" /> : null)}
                                        {saveSuccess ? 'Parameters Updated' : 'Update Parameters'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="carbon-card p-8 rounded-[2rem] border-white/5">
                                    <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20 text-pink-500 mb-6">
                                        <ShootingStar size={24} weight="bold" />
                                    </div>
                                    <h3 className="text-lg font-black mb-2 text-white">{user?.plan?.name || 'Standard Cluster'}</h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Active tier. Node capacity: {user?.max_instances} instances.
                                        Monthly limit: {user?.monthly_message_limit} signals.
                                    </p>
                                </div>
                                <div className="carbon-card p-8 rounded-[2rem] border-white/5">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-500 mb-6">
                                        <ShieldCheck size={24} weight="bold" />
                                    </div>
                                    <h3 className="text-lg font-black mb-2 text-white">Trust Score</h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Sent: {user?.messages_sent_current_period} messages.
                                        Node reputation is verified and stable.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'Security' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="carbon-card p-10 lg:p-12 rounded-[2.5rem] border-white/5">
                                <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 text-red-500">
                                        <Lock size={24} weight="bold" />
                                    </div>
                                    Access Control
                                </h2>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Universal Access Token</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                readOnly
                                                className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-mono text-sm opacity-60"
                                                value={user?.access_token}
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(user?.access_token);
                                                    alert('Token copied to neural link.');
                                                }}
                                                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 transition"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">Use this token for headless API integrations and one-line sending.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
