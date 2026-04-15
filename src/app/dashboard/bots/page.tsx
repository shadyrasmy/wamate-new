'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Robot, Plus, Trash, PencilSimple, X,
    Spinner, Info, CheckCircle, DeviceMobile,
    Brain, ShieldCheck, ToggleLeft, ToggleRight
} from '@phosphor-icons/react';

export default function BotsPage() {
    const [bots, setBots] = useState<any[]>([]);
    const [instances, setInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingBot, setEditingBot] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        system_instruction: '',
        instance_id: '',
        is_active: true
    });

    const getFormInstanceId = (bot: any) => {
        const matchedInstance = instances.find(
            (ins) => ins.id === bot.instance_id || ins.instance_id === bot.instance_id
        );

        return matchedInstance?.instance_id || bot.instance_id || '';
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [botsRes, insRes] = await Promise.all([
                fetchWithAuth('/bots'),
                fetchWithAuth('/instances')
            ]);
            setBots(botsRes.data.bots);
            setInstances(insRes.data.instances);
        } catch (error) {
            console.error('Failed to load bots', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingBot ? 'PATCH' : 'POST';
            const url = editingBot ? `/bots/${editingBot.id}` : '/bots';

            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(formData)
            });

            setIsAdding(false);
            setEditingBot(null);
            setFormData({ name: '', system_instruction: '', instance_id: '', is_active: true });
            loadData();
        } catch (error) {
            console.error('Save failed', error);
            alert('Operation failed. Check if you have select a node.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this bot?')) return;
        try {
            await fetchWithAuth(`/bots/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const toggleStatus = async (bot: any) => {
        try {
            await fetchWithAuth(`/bots/${bot.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: !bot.is_active })
            });
            loadData();
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    return (
        <div className="p-8 space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-4">
                        <Robot size={44} weight="fill" className="text-primary" />
                        Bot Forge
                    </h1>
                    <p className="text-gray-500 font-medium">Create specialized AI agents for different departments or brands.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingBot(null);
                        setFormData({ name: '', system_instruction: '', instance_id: '', is_active: true });
                        setIsAdding(true);
                    }}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 w-fit"
                >
                    <Plus size={20} weight="bold" />
                    New Agent
                </motion.button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Spinner size={32} className="animate-spin text-primary" /></div>
            ) : bots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Robot size={40} className="text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Bots Forged</h3>
                    <p className="text-gray-600 text-sm max-w-sm text-center font-medium">Create specialized assistants linked to specific numbers to handle different business flows.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {bots.map((bot) => (
                        <motion.div
                            key={bot.id}
                            className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${bot.is_active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                                        <Robot size={28} weight="duotone" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-white uppercase tracking-tight">{bot.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${bot.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{bot.is_active ? 'Operational' : 'Hibernating'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {
                                        setEditingBot(bot);
                                        setFormData({
                                            name: bot.name,
                                            system_instruction: bot.system_instruction,
                                            instance_id: getFormInstanceId(bot),
                                            is_active: bot.is_active
                                        });
                                        setIsAdding(true);
                                    }} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 transition"><PencilSimple size={16} /></button>
                                    <button onClick={() => handleDelete(bot.id)} className="p-2 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-red-500 transition"><Trash size={16} /></button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <DeviceMobile size={16} className="text-gray-500" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                                        Linked to: {instances.find(ins => ins.id === bot.instance_id || ins.instance_id === bot.instance_id)?.name || 'Unknown Node'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 italic">
                                    "{bot.system_instruction || 'No core directive defined...'}"
                                </p>
                            </div>

                            <button
                                onClick={() => toggleStatus(bot)}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${bot.is_active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-primary text-white shadow-lg'}`}
                            >
                                {bot.is_active ? 'Deactivate Protocol' : 'Initiate Operation'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Forge Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-2xl rounded-[3rem] p-10 lg:p-12 relative z-10 border-white/10 max-h-[95vh] overflow-y-auto custom-scroll"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black flex items-center gap-3 uppercase">
                                    <Robot size={32} className="text-primary" />
                                    {editingBot ? 'Tune Agent' : 'Forge Entity'}
                                </h3>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full transition"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Agent Codename</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="e.g. Sales Specialist, Support Hero..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Host Node</label>
                                    <select
                                        value={formData.instance_id}
                                        onChange={e => setFormData({ ...formData, instance_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="">Select Target Edge Node</option>
                                        {instances.map(ins => (
                                            <option key={ins.instance_id} value={ins.instance_id}>{ins.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Core Behavioral Directives</label>
                                    <textarea
                                        value={formData.system_instruction}
                                        onChange={e => setFormData({ ...formData, system_instruction: e.target.value })}
                                        className="w-full min-h-[200px] bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition resize-none custom-scroll"
                                        placeholder="Define the bot's personality, goals, and constraints..."
                                        required
                                    />
                                </div>

                                <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] flex gap-4">
                                    <ShieldCheck size={24} className="text-primary flex-shrink-0" />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest">
                                        Specialized bots operate at the highest neural priority for their assigned node. Use them to create unique brand experiences for different numbers.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-xs uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {editingBot ? 'Sync Neural Data' : 'Forge Protocol'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
