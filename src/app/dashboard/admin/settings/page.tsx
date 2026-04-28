'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { fetchWithAuth } from '@/lib/api';
import {
    Gear, Eye, Code, FacebookLogo, Envelope,
    Spinner, Check, WarningCircle, ToggleLeft, ToggleRight, PaperPlaneRight, FileText,
    Robot, Brain, Key, MagnifyingGlassPlus
} from '@phosphor-icons/react';

import { useSearchParams } from 'next/navigation';

function TemplateManager() {
    const { t } = useUI();
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ subject: '', body: '' });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const res = await fetchWithAuth('/admin/config/templates');
            setTemplates(res.data.templates);
        } catch (error) {
            console.error('Failed to load templates', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tmpl: any) => {
        setEditingId(tmpl.key);
        setEditForm({ subject: tmpl.subject, body: tmpl.body });
    };

    const handleSave = async (key: string) => {
        try {
            await fetchWithAuth(`/admin/config/templates/${key}`, {
                method: 'PATCH',
                body: JSON.stringify(editForm)
            });
            setEditingId(null);
            loadTemplates();
            alert(t('admin.settings.template_success'));
        } catch (error) {
            console.error('Failed to save template', error);
            alert(t('admin.settings.template_error'));
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Spinner size={24} className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2">{t('admin.settings.template_title')}</h3>
                <p className="text-gray-500 text-sm">{t('admin.settings.template_desc')}</p>
            </div>

            <div className="grid gap-6">
                {templates.map(tmpl => (
                    <div key={tmpl.key} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-white text-lg">{tmpl.name}</h4>
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase font-black tracking-widest">{tmpl.key}</span>
                                </div>
                                <p className="text-xs text-gray-500 font-mono">Variables: {tmpl.variables?.join(', ')}</p>
                            </div>
                            {editingId !== tmpl.key && (
                                <button onClick={() => handleEdit(tmpl)} className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-bold transition">
                                    {t('admin.settings.edit_template')}
                                </button>
                            )}
                        </div>

                        {editingId === tmpl.key ? (
                            <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.subject_line')}</label>
                                    <input
                                        type="text"
                                        value={editForm.subject}
                                        onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.html_body')}</label>
                                    <textarea
                                        value={editForm.body}
                                        onChange={e => setEditForm({ ...editForm, body: e.target.value })}
                                        className="w-full h-64 bg-black/20 border border-white/10 p-3 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleSave(tmpl.key)} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition">
                                        {t('admin.settings.save_changes')}
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="bg-white/5 text-gray-400 px-6 py-2 rounded-xl font-bold text-xs hover:text-white transition">
                                        {t('dashboard.instances.cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 opacity-50">
                                <p className="text-xs text-gray-400 font-mono line-clamp-2">{tmpl.subject}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsContent() {
    const { t } = useUI();
    const searchParams = useSearchParams();
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'cms');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await fetchWithAuth('/admin/config');
            setConfig(res.data.config);
        } catch (error) {
            console.error('Failed to load config', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Strip metadata fields that the backend validator rejects
            const { id, createdAt, updatedAt, ...cleanConfig } = config;

            const res = await fetchWithAuth('/admin/config', {
                method: 'PATCH',
                body: JSON.stringify(cleanConfig)
            });

            if (res?.data?.config) {
                setConfig(res.data.config); // Update state directly from response
            }

            alert(t('admin.settings.sync_success'));
        } catch (error) {
            console.error('Save failed', error);
            alert(t('admin.settings.sync_error'));
        } finally {
            setSaving(false);
        }
    };

    const toggleCMS = (key: string) => {
        if (!config || !config.cms_visibility) return;
        setConfig({
            ...config,
            cms_visibility: {
                ...config.cms_visibility,
                [key]: !config.cms_visibility[key]
            }
        });
    };

    const [testEmail, setTestEmail] = useState('');
    const [sendingTest, setSendingTest] = useState(false);

    const handleTestSmtp = async () => {
        if (!testEmail) return alert(t('admin.settings.test_recip_error'));
        setSendingTest(true);
        try {
            await fetchWithAuth('/admin/config/test-smtp', {
                method: 'POST',
                body: JSON.stringify({ to: testEmail, message: 'This is a test from the Admin Dashboard.' })
            });
            alert(t('admin.settings.test_success'));
        } catch (error) {
            console.error('Test failed', error);
            alert(t('admin.settings.test_error'));
        } finally {
            setSendingTest(false);
        }
    };

    if (loading || !config) return (
        <div className="flex justify-center items-center h-96">
            <Spinner size={32} className="animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">{t('admin.settings.title')}</h1>
                    <p className="text-gray-500 font-medium text-sm">{t('admin.settings.subtitle')}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    {saving ? <Spinner size={20} className="animate-spin" /> : <Check size={20} weight="bold" />}
                    {t('admin.settings.sync_btn')}
                </motion.button>
            </div>

            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit">
                {[
                    { id: 'cms', label: t('admin.settings.tab_visibility'), icon: Eye },
                    { id: 'landing', label: t('admin.settings.tab_landing'), icon: Gear },
                    { id: 'scripts', label: t('admin.settings.tab_scripts'), icon: Code },
                    { id: 'facebook', label: t('admin.settings.tab_tracking'), icon: FacebookLogo },
                    { id: 'smtp', label: t('admin.settings.tab_smtp'), icon: Envelope },
                    { id: 'templates', label: t('admin.settings.tab_templates'), icon: FileText },
                    { id: 'ai', label: t('admin.settings.tab_ai'), icon: Robot }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-xl flex items-center gap-3 transition font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        <tab.icon size={18} weight="bold" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="carbon-card p-10 lg:p-12 rounded-[2.5rem] border border-white/5">

                {/* ... existing tabs ... */}

                {
                    activeTab === 'smtp' && (
                        <div className="space-y-10">
                            {/* ... SMTP Content ... */}
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t('admin.settings.smtp_title')}</h3>
                                <p className="text-gray-500 text-sm">{t('admin.settings.smtp_desc')}</p>
                            </div>
                            {/* ... (rest of the content remains the same, just ensuring correct nesting) ... */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* ... fields ... */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_host')}</label>
                                    <input
                                        type="text"
                                        value={config.smtp_settings?.host || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, host: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="smtp.example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_port')}</label>
                                    <input
                                        type="number"
                                        value={config.smtp_settings?.port || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, port: Number(e.target.value) } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="465 or 587"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_user')}</label>
                                    <input
                                        type="text"
                                        value={config.smtp_settings?.user || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, user: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_pass')}</label>
                                    <input
                                        type="password"
                                        value={config.smtp_settings?.password || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, password: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_from_name')}</label>
                                    <input
                                        type="text"
                                        value={config.smtp_settings?.from_name || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, from_name: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="WaMate Support"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">From Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={config.smtp_settings?.from_email || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, from_email: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder={t('admin.settings.smtp_from_default')}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.smtp_secure')}</label>
                                    <p className="text-xs text-gray-500">{t('admin.settings.smtp_secure_help')}</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, secure: !config.smtp_settings?.secure } })}
                                >
                                    {config.smtp_settings?.secure ? (
                                        <ToggleRight size={38} weight="fill" className="text-primary" />
                                    ) : (
                                        <ToggleLeft size={38} weight="fill" className="text-gray-700" />
                                    )}
                                </button>
                            </div>

                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <PaperPlaneRight size={16} /> {t('admin.settings.test_config')}
                                </h4>
                                <div className="flex gap-4">
                                    <input
                                        type="email"
                                        value={testEmail}
                                        onChange={e => setTestEmail(e.target.value)}
                                        className="flex-1 bg-black/20 border border-primary/20 p-3 rounded-xl text-white text-sm focus:outline-none"
                                        placeholder={t('admin.settings.test_placeholder')}
                                    />
                                    <button
                                        onClick={handleTestSmtp}
                                        disabled={sendingTest}
                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {sendingTest ? t('admin.settings.sending') : t('admin.settings.send_test')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'cms' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t('admin.settings.visibility_title')}</h3>
                                <p className="text-gray-500 text-sm">{t('admin.settings.visibility_desc')}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {config?.cms_visibility && Object.entries(config.cms_visibility).map(([key, val]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <div className="capitalize font-bold text-gray-300">
                                            {t('admin.settings.section_label', { key: key.replace(/([A-Z])/g, ' $1') })}
                                        </div>
                                        <button onClick={() => toggleCMS(key)} className="transition">
                                            {val ? (
                                                <ToggleRight size={38} weight="fill" className="text-primary" />
                                            ) : (
                                                <ToggleLeft size={38} weight="fill" className="text-gray-700" />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'landing' && (
                        <div className="space-y-12">
                            {/* HERO SECTION */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">{t('admin.settings.hero_section')}</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.hero_title')}</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.hero?.title || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, title: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.hero_subtitle')}</label>
                                        <textarea
                                            value={config?.landing_content?.hero?.subtitle || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, subtitle: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition h-24"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.cta_primary')}</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.hero?.cta_primary || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, cta_primary: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.cta_secondary')}</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.hero?.cta_secondary || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, cta_secondary: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NUMBERS SECTION */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">{t('admin.settings.numbers_section')}</h3>
                                <div className="space-y-2 mb-6">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.bg_label')}</label>
                                    <input
                                        type="text"
                                        value={config?.landing_content?.numbers?.title || ''}
                                        onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, numbers: { ...config.landing_content.numbers, title: e.target.value } } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition text-sm uppercase tracking-widest"
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.stat_title', { i })}</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.numbers?.[`stat${i}_title`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, numbers: { ...config.landing_content.numbers, [`stat${i}_title`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.stat_label', { i })}</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.numbers?.[`stat${i}_label`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, numbers: { ...config.landing_content.numbers, [`stat${i}_label`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-primary/50 transition"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WHY US SECTION */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">{t('admin.settings.why_us_section')}</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section Title</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.whyUs?.title || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, whyUs: { ...config.landing_content.whyUs, title: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section Subtitle</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.whyUs?.subtitle || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, whyUs: { ...config.landing_content.whyUs, subtitle: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.card_title', { i })}</label>
                                                    <input
                                                        type="text"
                                                        value={config?.landing_content?.whyUs?.[`card${i}_title`] || ''}
                                                        onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, whyUs: { ...config.landing_content.whyUs, [`card${i}_title`]: e.target.value } } })}
                                                        className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.card_desc', { i })}</label>
                                                    <textarea
                                                        value={config?.landing_content?.whyUs?.[`card${i}_desc`] || ''}
                                                        onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, whyUs: { ...config.landing_content.whyUs, [`card${i}_desc`]: e.target.value } } })}
                                                        className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-primary/50 transition h-20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* BENEFITS SECTION */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">{t('admin.settings.benefits_section')}</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.analytics_title')}</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.benefits?.title || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, title: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.analytics_desc')}</label>
                                        <textarea
                                            value={config?.landing_content?.benefits?.subtitle || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, subtitle: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition h-24"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stat 1 (e.g. 99.9%)</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.benefits?.stat1_title || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, stat1_title: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stat 1 Label</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.benefits?.stat1_label || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, stat1_label: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                            />
                                        </div>
                                    </div>
                                    <div className="border-t border-white/5 pt-6 mt-4">
                                        <div className="space-y-2 mb-6">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.mission_title')}</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.benefits?.mission_title || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, mission_title: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.mission_quote')}</label>
                                            <textarea
                                                value={config?.landing_content?.benefits?.mission_text || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, mission_text: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition h-32 italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CASE STUDIES SECTION */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">{t('admin.settings.case_studies')}</h3>
                                <div className="space-y-2 mb-6">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={config?.landing_content?.howEasy?.title || ''}
                                        onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, title: e.target.value } } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[1, 2].map(i => (
                                        <div key={i} className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.case_brand', { i })}</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.howEasy?.[`case${i}_brand`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_brand`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-black italic focus:outline-none focus:border-primary/50 transition uppercase tracking-tighter text-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.case_stat', { i })}</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.howEasy?.[`case${i}_stat`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_stat`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-green-400 font-bold focus:outline-none focus:border-primary/50 transition text-xs"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.case_quote', { i })}</label>
                                                <textarea
                                                    value={config?.landing_content?.howEasy?.[`case${i}_text`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_text`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-gray-300 font-medium text-sm focus:outline-none focus:border-primary/50 transition h-24"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.case_footer', { i })}</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.howEasy?.[`case${i}_footer`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_footer`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-gray-500 font-bold focus:outline-none focus:border-primary/50 transition text-[10px] uppercase"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'scripts' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t('admin.settings.scripts_title')}</h3>
                                <p className="text-gray-500 text-sm">{t('admin.settings.scripts_desc')}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.scripts_label')}</label>
                                <textarea
                                    value={config.header_scripts || ''}
                                    onChange={e => setConfig({ ...config, header_scripts: e.target.value })}
                                    className="w-full h-64 bg-white/[0.03] border border-white/5 p-6 rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition"
                                    placeholder="<script>...your code here...</script>"
                                />
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'facebook' && (
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t('admin.settings.tracking_title')}</h3>
                                <p className="text-gray-500 text-sm">{t('admin.settings.tracking_desc')}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.pixel_id')}</label>
                                    <input
                                        type="text"
                                        value={config.fb_pixel_id || ''}
                                        onChange={e => setConfig({ ...config, fb_pixel_id: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="e.g. 1234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.capi_token')}</label>
                                    <input
                                        type="password"
                                        value={config.fb_capi_token || ''}
                                        onChange={e => setConfig({ ...config, fb_capi_token: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="EAAB..."
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'ai' && (
                        <div className="space-y-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">{t('admin.settings.ai_title')}</h3>
                                    <p className="text-gray-500 text-sm">{t('admin.settings.ai_desc')}</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white leading-none mb-1">{t('admin.settings.ai_status')}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{config.ai_settings?.global_enabled ? t('admin.settings.active_pulse') : t('admin.settings.standby_mode')}</p>
                                    </div>
                                    <button onClick={() => setConfig({ ...config, ai_settings: { ...config.ai_settings, global_enabled: !config.ai_settings?.global_enabled } })}>
                                        {config.ai_settings?.global_enabled ? (
                                            <ToggleRight size={38} weight="fill" className="text-primary" />
                                        ) : (
                                            <ToggleLeft size={38} weight="fill" className="text-gray-700" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Key size={14} /> {t('admin.settings.google_key')}
                                    </label>
                                    <input
                                        type="password"
                                        value={config.ai_settings?.google_api_key || ''}
                                        onChange={e => setConfig({ ...config, ai_settings: { ...config.ai_settings, google_api_key: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="••••••••••••••••••••••••••••••••"
                                    />
                                    <p className="text-[10px] text-gray-400 ml-1">{t('admin.settings.google_key_help')}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Brain size={14} /> {t('admin.settings.pinecone_key')}
                                    </label>
                                    <input
                                        type="password"
                                        value={config.ai_settings?.pinecone_api_key || ''}
                                        onChange={e => setConfig({ ...config, ai_settings: { ...config.ai_settings, pinecone_api_key: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="••••••••-••••-••••-••••-••••••••••••"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <MagnifyingGlassPlus size={14} /> {t('admin.settings.pinecone_env')}
                                    </label>
                                    <input
                                        type="text"
                                        value={config.ai_settings?.pinecone_environment || ''}
                                        onChange={e => setConfig({ ...config, ai_settings: { ...config.ai_settings, pinecone_environment: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="e.g. us-east-1-aws"
                                    />
                                </div>

                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t('admin.settings.default_model')}</label>
                                    <input
                                        type="text"
                                        value={config.ai_settings?.default_model || 'gemini-3-flash'}
                                        onChange={e => setConfig({ ...config, ai_settings: { ...config.ai_settings, default_model: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'templates' && (
                        <TemplateManager />
                    )
                }
            </div>
        </div>
    );
}

export default function AdminSettingsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-96"><Spinner size={32} className="animate-spin text-primary" /></div>}>
            <SettingsContent />
        </Suspense>
    );
}
