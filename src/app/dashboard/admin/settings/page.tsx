'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { fetchWithAuth } from '@/lib/api';
import {
    Gear, Eye, Code, FacebookLogo, Envelope,
    Spinner, Check, WarningCircle, ToggleLeft, ToggleRight, PaperPlaneRight, FileText
} from '@phosphor-icons/react';

import { useSearchParams } from 'next/navigation';

function TemplateManager() {
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
            alert('Template updated!');
        } catch (error) {
            console.error('Failed to save template', error);
            alert('Save failed.');
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Spinner size={24} className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Message Templates</h3>
                <p className="text-gray-500 text-sm">Customize the automated emails sent by the system.</p>
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
                                    Edit Template
                                </button>
                            )}
                        </div>

                        {editingId === tmpl.key ? (
                            <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject Line</label>
                                    <input
                                        type="text"
                                        value={editForm.subject}
                                        onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">HTML Body Content</label>
                                    <textarea
                                        value={editForm.body}
                                        onChange={e => setEditForm({ ...editForm, body: e.target.value })}
                                        className="w-full h-64 bg-black/20 border border-white/10 p-3 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleSave(tmpl.key)} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition">
                                        Save Changes
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="bg-white/5 text-gray-400 px-6 py-2 rounded-xl font-bold text-xs hover:text-white transition">
                                        Cancel
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

            await fetchWithAuth('/admin/config', {
                method: 'PATCH',
                body: JSON.stringify(cleanConfig)
            });
            alert('Site configuration synchronized successfully.');
            loadConfig(); // Reload to get fresh data
        } catch (error) {
            console.error('Save failed', error);
            alert('Settings synchronization failed. Check validation rules.');
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
        if (!testEmail) return alert('Please enter a recipient email.');
        setSendingTest(true);
        try {
            await fetchWithAuth('/admin/config/test-smtp', {
                method: 'POST',
                body: JSON.stringify({ to: testEmail, message: 'This is a test from the Admin Dashboard.' })
            });
            alert('Test email sent successfully!');
        } catch (error) {
            console.error('Test failed', error);
            alert('Failed to send test email. Check server logs.');
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
                    <h1 className="text-4xl font-black tracking-tight mb-2">Command Center</h1>
                    <p className="text-gray-500 font-medium text-sm">Global grid configuration for site visibility and tracking telemetry.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    {saving ? <Spinner size={20} className="animate-spin" /> : <Check size={20} weight="bold" />}
                    Synchronize Magnitude
                </motion.button>
            </div>

            <div className="flex gap-4 p-1.5 bg-white/5 rounded-2xl w-fit">
                {[
                    { id: 'cms', label: 'Visibility', icon: Eye },
                    { id: 'landing', label: 'Landing CMS', icon: Gear },
                    { id: 'scripts', label: 'Script Lab', icon: Code },
                    { id: 'facebook', label: 'Tracking', icon: FacebookLogo },
                    { id: 'smtp', label: 'SMTP / Email', icon: Envelope },
                    { id: 'templates', label: 'Msg Templates', icon: FileText }
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
                                <h3 className="text-xl font-bold mb-2">SMTP Gateway Configuration</h3>
                                <p className="text-gray-500 text-sm">Configure your mail server for transactional warnings and notifications.</p>
                            </div>
                            {/* ... (rest of the content remains the same, just ensuring correct nesting) ... */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* ... fields ... */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SMTP Host</label>
                                    <input
                                        type="text"
                                        value={config.smtp_settings?.host || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, host: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="smtp.example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SMTP Port</label>
                                    <input
                                        type="number"
                                        value={config.smtp_settings?.port || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, port: Number(e.target.value) } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="465 or 587"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username / Email</label>
                                    <input
                                        type="text"
                                        value={config.smtp_settings?.user || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, user: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                    <input
                                        type="password"
                                        value={config.smtp_settings?.password || ''}
                                        onChange={e => setConfig({ ...config, smtp_settings: { ...config.smtp_settings, password: e.target.value } })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">From Name</label>
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
                                        placeholder="defaults to username"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Connection (SSL/TLS)</label>
                                    <p className="text-xs text-gray-500">Enable for port 465. Disable for 587 (STARTTLS).</p>
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
                                    <PaperPlaneRight size={16} /> Test Configuration
                                </h4>
                                <div className="flex gap-4">
                                    <input
                                        type="email"
                                        value={testEmail}
                                        onChange={e => setTestEmail(e.target.value)}
                                        className="flex-1 bg-black/20 border border-primary/20 p-3 rounded-xl text-white text-sm focus:outline-none"
                                        placeholder="Send test email to..."
                                    />
                                    <button
                                        onClick={handleTestSmtp}
                                        disabled={sendingTest}
                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {sendingTest ? 'Sending...' : 'Send Test'}
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
                                <h3 className="text-xl font-bold mb-2">Visibility Protocols</h3>
                                <p className="text-gray-500 text-sm">Toggle front-end landing page sections on/off instantly.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {config?.cms_visibility && Object.entries(config.cms_visibility).map(([key, val]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <div className="capitalize font-bold text-gray-300">
                                            {key.replace(/([A-Z])/g, ' $1')} Section
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
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">Hero Section</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hero Title</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.hero?.title || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, title: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hero Subtitle</label>
                                        <textarea
                                            value={config?.landing_content?.hero?.subtitle || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, subtitle: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition h-24"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary CTA</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.hero?.cta_primary || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, hero: { ...config.landing_content.hero, cta_primary: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secondary CTA</label>
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
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">Numbers Section</h3>
                                <div className="space-y-2 mb-6">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Background Label</label>
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
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stat {i} Title</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.numbers?.[`stat${i}_title`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, numbers: { ...config.landing_content.numbers, [`stat${i}_title`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stat {i} Label</label>
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
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">Why Us Section</h3>
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
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Card {i} Title</label>
                                                    <input
                                                        type="text"
                                                        value={config?.landing_content?.whyUs?.[`card${i}_title`] || ''}
                                                        onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, whyUs: { ...config.landing_content.whyUs, [`card${i}_title`]: e.target.value } } })}
                                                        className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Card {i} Description</label>
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
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">Benefits Section</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Analytics Title</label>
                                        <input
                                            type="text"
                                            value={config?.landing_content?.benefits?.title || ''}
                                            onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, title: e.target.value } } })}
                                            className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Analytics Description</label>
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
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mission Title</label>
                                            <input
                                                type="text"
                                                value={config?.landing_content?.benefits?.mission_title || ''}
                                                onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, benefits: { ...config.landing_content.benefits, mission_title: e.target.value } } })}
                                                className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mission Quote</label>
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
                                <h3 className="text-lg font-black uppercase tracking-widest text-primary border-b border-white/5 pb-4">Case Studies</h3>
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
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Case {i} Brand</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.howEasy?.[`case${i}_brand`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_brand`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-white font-black italic focus:outline-none focus:border-primary/50 transition uppercase tracking-tighter text-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Case {i} Stat Badge</label>
                                                <input
                                                    type="text"
                                                    value={config?.landing_content?.howEasy?.[`case${i}_stat`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_stat`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-green-400 font-bold focus:outline-none focus:border-primary/50 transition text-xs"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Case {i} Quote</label>
                                                <textarea
                                                    value={config?.landing_content?.howEasy?.[`case${i}_text`] || ''}
                                                    onChange={e => setConfig({ ...config, landing_content: { ...config.landing_content, howEasy: { ...config.landing_content.howEasy, [`case${i}_text`]: e.target.value } } })}
                                                    className="w-full bg-white/[0.03] border border-white/5 p-3 rounded-xl text-gray-300 font-medium text-sm focus:outline-none focus:border-primary/50 transition h-24"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Case {i} Footer Label</label>
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
                                <h3 className="text-xl font-bold mb-2">Neural Header Injection</h3>
                                <p className="text-gray-500 text-sm">Add custom HTML scripts to the global header (Analytics, Chat widgets, etc).</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Custom Header Code</label>
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
                                <h3 className="text-xl font-bold mb-2">FB Tracking Telemetry</h3>
                                <p className="text-gray-500 text-sm">Connect your Facebook Pixel and Conversion API for landing events.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pixel ID</label>
                                    <input
                                        type="text"
                                        value={config.fb_pixel_id || ''}
                                        onChange={e => setConfig({ ...config, fb_pixel_id: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="e.g. 1234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Conversion API Token</label>
                                    <input
                                        type="password"
                                        value={config.fb_capi_token || ''}
                                        onChange={e => setConfig({ ...config, fb_capi_token: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-xl text-white font-bold focus:outline-none focus:border-primary/50 transition"
                                        placeholder="EAAB..."
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4">
                                <FacebookLogo size={24} weight="fill" className="text-primary" />
                                <div className="text-xs font-medium text-gray-400">
                                    Tracking will automatically emit events for: **LandingPageView**, **SignupStarted**, and **SubscriptionComplete**.
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
            </div >
        </div >
    );
}

export default function AdminSettingsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-96"><Spinner size={32} className="animate-spin text-primary" /></div>}>
            <SettingsContent />
        </Suspense>
    );
}
