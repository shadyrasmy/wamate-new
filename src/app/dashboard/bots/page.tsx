'use client';

import React, { useState, useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Robot, Plus, Trash, PencilSimple, X,
    Spinner, Info, CheckCircle, DeviceMobile,
    Brain, ShieldCheck, ToggleLeft, ToggleRight
} from '@phosphor-icons/react';

export default function BotsPage() {
    const { t } = useUI();
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
            console.error(t('dashboard.bots.load_error'), error);
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
            alert(t('dashboard.bots.save_error'));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('dashboard.bots.delete_confirm'))) return;
        try {
            await fetchWithAuth(`/bots/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) {
            console.error(t('dashboard.bots.delete_error'), error);
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
            console.error(t('dashboard.bots.toggle_error'), error);
        }
    };

    return (
        <div className="p-8 space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-4">
                        <Robot size={44} weight="fill" className="text-primary" />
                        {t('dashboard.bots.title')}
                    </h1>
                    <p className="text-gray-500 font-medium">{t('dashboard.bots.subtitle')}</p>
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
                    {t('dashboard.bots.new_agent')}
                </motion.button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Spinner size={32} className="animate-spin text-primary" /></div>
            ) : bots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Robot size={40} className="text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">{t('dashboard.bots.empty_title')}</h3>
                    <p className="text-gray-600 text-sm max-w-sm text-center font-medium">{t('dashboard.bots.empty_desc')}</p>
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
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{bot.is_active ? t('dashboard.bots.operational') : t('dashboard.bots.hibernating')}</span>
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
                                        {t('dashboard.bots.linked_to', { name: instances.find(ins => ins.id === bot.instance_id || ins.instance_id === bot.instance_id)?.name || t('dashboard.bots.unknown_node') })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 italic">
                                    "{bot.system_instruction || t('dashboard.bots.no_directive')}"
                                </p>
                            </div>

                            <button
                                onClick={() => toggleStatus(bot)}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${bot.is_active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-primary text-white shadow-lg'}`}
                            >
                                {bot.is_active ? t('dashboard.bots.deactivate') : t('dashboard.bots.initiate')}
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
                                    {editingBot ? t('dashboard.bots.tune_title') : t('dashboard.bots.forge_title')}
                                </h3>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full transition"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.bots.agent_codename')}</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder={t('dashboard.bots.codename_placeholder')}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.bots.host_node')}</label>
                                    <select
                                        value={formData.instance_id}
                                        onChange={e => setFormData({ ...formData, instance_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="">{t('dashboard.bots.select_node')}</option>
                                        {instances.map(ins => (
                                            <option key={ins.instance_id} value={ins.instance_id}>{ins.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.bots.directives_label')}</label>
                                    <textarea
                                        value={formData.system_instruction}
                                        onChange={e => setFormData({ ...formData, system_instruction: e.target.value })}
                                        className="w-full min-h-[200px] bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition resize-none custom-scroll"
                                        placeholder={t('dashboard.bots.directives_placeholder')}
                                        required
                                    />
                                </div>

                                <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] flex gap-4">
                                    <ShieldCheck size={24} className="text-primary flex-shrink-0" />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest">
                                        {t('dashboard.bots.priority_info')}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-xs uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition"
                                    >
                                        {t('dashboard.instances.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {editingBot ? t('dashboard.bots.sync_neural') : t('dashboard.bots.forge_protocol')}
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

