'use client';

import React, { useState, useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Brain, Plus, Trash, PencilSimple, X,
    Spinner, Info, Database, FileText, Globe,
    CheckCircle, MagnifyingGlass
} from '@phosphor-icons/react';

export default function KnowledgeBase() {
    const { t } = useUI();
    const [knowledge, setKnowledge] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [instances, setInstances] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'text',
        instance_id: ''
    });

    useEffect(() => {
        loadKnowledge();
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [insRes, userRes] = await Promise.all([
                fetchWithAuth('/instances'),
                fetchWithAuth('/user/profile')
            ]);
            setInstances(insRes.data.instances);
            setUser(userRes.data.user);
        } catch (error) {
            console.error('Failed to load metadata', error);
        }
    };

    const loadKnowledge = async () => {
        try {
            const res = await fetchWithAuth('/user/knowledge');
            setKnowledge(res.data.knowledge);
        } catch (error) {
            console.error('Failed to load knowledge', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingItem ? 'PATCH' : 'POST';
            const url = editingItem ? `/user/knowledge/${editingItem.id}` : '/user/knowledge';

            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(formData)
            });

            setIsAdding(false);
            setEditingItem(null);
            setFormData({ title: '', content: '', type: 'text', instance_id: '' });
            loadKnowledge();
        } catch (error) {
            console.error('Save failed', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('dashboard.knowledge.delete_confirm'))) return;
        try {
            await fetchWithAuth(`/user/knowledge/${id}`, { method: 'DELETE' });
            loadKnowledge();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const filteredKnowledge = knowledge.filter(k =>
        k.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        <Brain size={40} weight="fill" className="text-primary" />
                        {t('dashboard.knowledge.title')}
                    </h1>
                    <p className="text-gray-500 font-medium">{t('dashboard.knowledge.subtitle')}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ title: '', content: '', type: 'text', instance_id: '' });
                        setIsAdding(true);
                    }}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 w-fit"
                >
                    <Plus size={20} weight="bold" />
                    {t('dashboard.knowledge.expand_intel')}
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 rounded-[2rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Database size={20} weight="bold" />
                            <span className="font-black text-xs uppercase tracking-widest">{t('dashboard.knowledge.stats_title')}</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-tighter">{t('dashboard.knowledge.capacity')}</span>
                                <span className="text-white font-black">{knowledge.length}/{user?.ai_knowledge_limit || user?.plan?.ai_knowledge_limit || 0}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(knowledge.length / (user?.ai_knowledge_limit || user?.plan?.ai_knowledge_limit || 1)) * 100}%` }} />
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                {t('dashboard.knowledge.depth_desc')}
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition" />
                        <input
                            type="text"
                            placeholder={t('dashboard.knowledge.search_placeholder')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                        />
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="flex justify-center py-20"><Spinner size={32} className="animate-spin text-primary" /></div>
                    ) : filteredKnowledge.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 glass-card rounded-[3rem] border-dashed border-white/10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Brain size={40} className="text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-500 mb-2">{t('dashboard.knowledge.empty_title')}</h3>
                            <p className="text-gray-600 text-sm max-w-sm text-center">{t('dashboard.knowledge.empty_desc')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredKnowledge.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                                                    {item.type === 'url' ? <Globe size={20} /> : item.type === 'file' ? <FileText size={20} /> : <FileText size={20} />}
                                                </div>
                                                <h4 className="font-black text-white uppercase tracking-tight line-clamp-1">{item.title}</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(item);
                                                        setFormData({ title: item.title, content: item.content, type: item.type, instance_id: item.instance_id || '' });
                                                        setIsAdding(true);
                                                    }}
                                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-500 transition"
                                                >
                                                    <PencilSimple size={16} weight="bold" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-red-500 transition"
                                                >
                                                    <Trash size={16} weight="bold" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-4 leading-relaxed font-medium mb-4">{item.content}</p>
                                        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                            <CheckCircle size={14} weight="fill" className="text-green-500" />
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                                                {item.instance_id ? t('dashboard.knowledge.active_for', { name: instances.find(i => i.id === item.instance_id || i.instance_id === item.instance_id)?.name || t('dashboard.knowledge.specific_node') }) : t('dashboard.knowledge.universal_knowledge')}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
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
                                <h3 className="text-2xl font-black flex items-center gap-3">
                                    <Brain size={28} className="text-primary" />
                                    {editingItem ? t('dashboard.knowledge.edit_intel') : t('dashboard.knowledge.inject_context')}
                                </h3>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full transition"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.knowledge.item_title')}</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="e.g. Refund Policy or Product Features"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.knowledge.target_node')}</label>
                                    <select
                                        value={formData.instance_id}
                                        onChange={e => setFormData({ ...formData, instance_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary/50 transition appearance-none cursor-pointer"
                                    >
                                        <option value="">{t('dashboard.knowledge.universal_all')}</option>
                                        {instances.map(ins => (
                                            <option key={ins.instance_id} value={ins.id || ins.instance_id}>{ins.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-[9px] text-gray-500 font-medium ml-1">{t('dashboard.knowledge.scope_desc')}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('dashboard.knowledge.content_label')}</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full min-h-[200px] max-h-[400px] bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition resize-none custom-scroll overflow-y-auto"
                                        placeholder="Paste paragraphs of text, lists, or instructions for the AI..."
                                        required
                                    />
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex gap-3">
                                    <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest">
                                        The AI will use this exact text as its "expert knowledge" when answering customer questions. Keep it factual and clear.
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-4">
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
                                        {editingItem ? t('dashboard.knowledge.sync_intel') : t('dashboard.knowledge.store_context')}
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


