'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gear, User, Lock, Bell, CaretRight, ShieldCheck, ShootingStar } from '@phosphor-icons/react';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('Account');

    const menuItems = [
        { id: 'Account', icon: User, label: 'Account Hub' },
        { id: 'Security', icon: Lock, label: 'Access & Shield' },
        { id: 'Notifications', icon: Bell, label: 'Pulse Alerts' }
    ];

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

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                            defaultValue="Operational Unit 01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Neural Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none opacity-50 cursor-not-allowed font-bold"
                                            defaultValue="node@wamate.io"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <p className="text-gray-500 text-sm font-medium">Any changes to identity requires re-verification of node status.</p>
                                    <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition">Update Parameters</button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="carbon-card p-8 rounded-[2rem] border-white/5">
                                    <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20 text-pink-500 mb-6">
                                        <ShootingStar size={24} weight="bold" />
                                    </div>
                                    <h3 className="text-lg font-black mb-2 text-white">Advanced Tier</h3>
                                    <p className="text-gray-500 text-sm font-medium">Currently operating on a Pro Level cluster.</p>
                                </div>
                                <div className="carbon-card p-8 rounded-[2rem] border-white/5">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-500 mb-6">
                                        <ShieldCheck size={24} weight="bold" />
                                    </div>
                                    <h3 className="text-lg font-black mb-2 text-white">Trust Score</h3>
                                    <p className="text-gray-500 text-sm font-medium">Node reputation is verified and stable.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'Security' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="carbon-card p-10 lg:p-12 rounded-[2.5rem] border-white/5"
                        >
                            <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 text-red-500">
                                    <Lock size={24} weight="bold" />
                                </div>
                                Access Control
                            </h2>
                            <div className="space-y-10">
                                <div className="flex items-center justify-between py-6 border-b border-white/5">
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Encrypted Password</h4>
                                        <p className="text-gray-500 text-sm font-medium">Last updated: 32 days ago</p>
                                    </div>
                                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition">Change Key</button>
                                </div>
                                <div className="flex items-center justify-between py-6">
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Two-Factor Shield</h4>
                                        <p className="text-gray-500 text-sm font-medium">Enhanced biometric verification layer.</p>
                                    </div>
                                    <div className="w-14 h-7 bg-primary rounded-full relative shadow-lg shadow-primary/20">
                                        <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full"></div>
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
